import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildProfileGuide } from "@/lib/claude";
import { OutfitRecommendation } from "@/lib/types";
import { IS_DEMO_MODE } from "@/lib/mockData";
import { composeOutfit, detectOccasion, detectSeason } from "@/lib/demoStylist";
import { pickStyleBrief, briefPrompt } from "@/lib/styleDirections";
import { parseSafePrefix, stripFence } from "@/lib/partialJson";
import { cleanOutfit, fixAvoidColors } from "@/lib/cleanOutfit";
import type { BodyType, ColorType } from "@/lib/profile";
import { currentSeason, SEASON_LABEL } from "@/lib/lookRecipes";

/** 오늘 날짜·계절(한국 기준) — 겨울에 반팔·샌들을 추천하지 않도록 */
function seasonNote(): string {
  const k = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const date = `${k.getUTCFullYear()}년 ${k.getUTCMonth() + 1}월 ${k.getUTCDate()}일`;
  return `\n\n[참고] 오늘은 ${date}, 한국은 ${SEASON_LABEL[currentSeason()].ko}이에요. 상황에 따로 계절이 적혀 있지 않으면 이 계절에 맞는 소재와 아우터로 추천해 주세요.`;
}

export const runtime = "edge"; // Cloudflare Pages / Edge 환경 호환

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { situation, bodyType, colorType, recent: recentRaw } = body as {
      situation?: string;
      bodyType?: BodyType;
      colorType?: ColorType;
      /** 이 사용자에게 방금 추천한 아이템 이름들 (겹치지 않게) */
      recent?: unknown;
    };
    const recent = Array.isArray(recentRaw)
      ? recentRaw.filter((x): x is string => typeof x === "string").map((x) => x.replace(/[\n\r"]/g, " ").trim().slice(0, 30)).filter(Boolean).slice(0, 15)
      : [];

    if (!situation || typeof situation !== "string" || situation.trim().length === 0) {
      return NextResponse.json({ error: "상황을 입력해주세요." }, { status: 400 });
    }

    if (situation.trim().length > 500) {
      return NextResponse.json(
        { error: "입력이 너무 깁니다. 500자 이내로 입력해주세요." },
        { status: 400 }
      );
    }

    /* ── 데모 모드: API 키가 없을 때 — 상황·계절·골격·퍼스널컬러로 매번 새로 조합 ── */
    if (IS_DEMO_MODE) {
      const demo = composeOutfit(situation.trim(), bodyType, colorType);
      const keys = ["top", "bottom", "outer", "shoes", "accessory"] as const;
      const enc = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const send = (o: unknown) => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
          const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
          await wait(300);
          const items: Record<string, unknown> = {};
          send({ t: "p", o: { situation: demo.situation, mood: demo.mood } });
          for (const k of keys) {
            await wait(150);
            items[k] = demo.items[k];
            send({ t: "p", o: { situation: demo.situation, mood: demo.mood, items: { ...items } } });
          }
          send({ t: "done", o: demo, ai: "demo" });
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store", "x-onulfit-ai": "demo" },
      });
    }

    /* ── 실제 모드: Anthropic API 직접 호출 (fetch) ──
       @anthropic-ai/sdk 는 node:path 에 의존해 Edge Runtime 미호환.
       fetch 로 직접 호출하면 모든 Edge 환경에서 동작한다.
       모델: Claude Haiku 5.5 (2026-11-07 결정 — 1회 1~2원 수준, 콘솔에서 월 한도를 걸어 둔다)
       · 속도 우선(2026-11-07): 생각(thinking)을 끄고 effort low — Haiku 5.5 는 effort high 이하에서 끄기 허용
       · 15초 안에 첫 응답이 없으면 기다리지 않고 데모 코디로 답한다(전체는 30초까지)
       · 실패(한도 초과·오류·거절·JSON 깨짐)하면 데모 코디로 대신 답한다 → 사이트가 멈추지 않는다 */
    // x-onulfit-ai 헤더: ai(정상) · fallback-quota(크레딧·월 한도 소진) · fallback-error(그 밖의 실패)
    // 하루 한 번 자동 점검이 이 헤더를 보고 한도 소진을 알려 준다
    const fallback = (why: string, quota = false) => {
      console.error(quota ? "AI_QUOTA_EXHAUSTED:" : "Outfit AI fallback:", why);
      return NextResponse.json(composeOutfit(situation.trim(), bodyType, colorType), {
        headers: { "x-onulfit-ai": quota ? "fallback-quota" : "fallback-error" },
      });
    };

    // 이름 다듬기 + 퍼스널컬러의 피할 색 막기 (조문 자리는 검정이 정답이라 색은 그대로)
    const polish = <T,>(o: T): T => {
      const c = cleanOutfit(o);
      return detectOccasion(situation) === "M" ? c : fixAvoidColors(c, colorType);
    };

    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 15000);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: abort.signal,
      headers: {
        "x-api-key":        process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type":     "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        max_tokens: 3000,
        stream: true,
        thinking: { type: "disabled" },
        output_config: { effort: "low" },
        system: [
          {
            // 고정 시스템 프롬프트만 캐싱 (프로필은 가변이라 user 메시지로 분리)
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content:
              situation.trim() +
              buildProfileGuide(bodyType, colorType) +
              seasonNote() +
              // 매번 다른 코디: 스타일 방향·주인공 아이템·팔레트·하의 형태를 무작위로 정해 건넨다
              briefPrompt(pickStyleBrief(detectOccasion(situation), detectSeason(situation), bodyType), recent, !!colorType),
          },
        ],
      }),
    }).catch(() => null);

    if (!res) {
      clearTimeout(timer);
      return fallback(abort.signal.aborted ? "timeout 15s" : "network");
    }
    if (!res.ok) {
      const body = (await res.text().catch(() => "")).slice(0, 300);
      clearTimeout(timer);
      // 크레딧 부족·월 사용 한도 도달은 400 등으로 오고 본문에 credit/spend/limit 이 들어 있다
      const quota = [400, 402, 403, 429].includes(res.status) && /credit|spend|usage limit|billing/i.test(body);
      return fallback(`API ${res.status} ${body}`, quota);
    }

    clearTimeout(timer);

    /* ── 받는 대로 보내기 (2026-11-07) ──
       AI가 쓰는 글자를 기다리지 않고, 값 하나가 끝날 때마다 지금까지의 코디를 한 줄(NDJSON)씩 보낸다.
       {"t":"p","o":부분 코디} … {"t":"done","o":완성 코디,"ai":"ai"|"fallback-error"}
       끝까지 받은 JSON이 깨졌으면 마지막 줄을 데모 코디로 대신한다. */
    const reader = res.body!.getReader();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const enc = new TextEncoder();
        const dec = new TextDecoder();
        const send = (o: unknown) => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
        const guard = setTimeout(() => abort.abort(), 30000);
        let buf = "";
        let text = "";
        let stop: string | null = null;
        let lastSent = "";
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += dec.decode(value, { stream: true });
            let nl: number;
            while ((nl = buf.indexOf("\n")) >= 0) {
              const line = buf.slice(0, nl).trim();
              buf = buf.slice(nl + 1);
              if (!line.startsWith("data:")) continue;
              let ev: { type?: string; delta?: { type?: string; text?: string; stop_reason?: string } };
              try { ev = JSON.parse(line.slice(5)); } catch { continue; }
              if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta" && ev.delta.text) {
                text += ev.delta.text;
                const raw = parseSafePrefix(text);
                const part = raw ? polish(raw) : null; // 이름 다듬기(괄호·후보 나열·앞 색 빼기)
                if (part) {
                  const str = JSON.stringify(part);
                  if (str !== lastSent) { lastSent = str; send({ t: "p", o: part }); }
                }
              } else if (ev.type === "message_delta" && ev.delta?.stop_reason) {
                stop = ev.delta.stop_reason;
              } else if (ev.type === "error") {
                stop = "error";
              }
            }
          }
        } catch {
          stop = stop ?? (abort.signal.aborted ? "timeout 30s" : "stream-error");
        }
        clearTimeout(guard);

        let outfit: OutfitRecommendation | null = null;
        try { outfit = JSON.parse(stripFence(text)); } catch { /* 아래에서 대신 */ }
        const it = outfit?.items;
        const complete = !!(it?.top?.name && it?.bottom?.name && it?.outer?.name && it?.shoes?.name && it?.accessory?.name);
        if (outfit && complete && stop !== "refusal" && stop !== "max_tokens" && stop !== "error") {
          send({ t: "done", o: polish(outfit), ai: "ai" });
        } else {
          console.error("Outfit AI fallback:", `stream ${stop ?? "no stop"} parsed=${!!outfit} complete=${complete}`);
          send({ t: "done", o: composeOutfit(situation!.trim(), bodyType, colorType), ai: "fallback-error" });
        }
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        "content-type": "application/x-ndjson; charset=utf-8",
        "cache-control": "no-store",
        "x-onulfit-ai": "ai",
      },
    });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "코디 데이터를 처리하는 중 오류가 발생했습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }
    console.error("Outfit API error:", error);
    return NextResponse.json(
      { error: "코디 추천 중 오류가 발생했어요. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
