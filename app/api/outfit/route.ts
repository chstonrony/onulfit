import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildProfileGuide } from "@/lib/claude";
import { OutfitRecommendation } from "@/lib/types";
import { IS_DEMO_MODE } from "@/lib/mockData";
import { composeOutfit } from "@/lib/demoStylist";
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
    const { situation, bodyType, colorType } = body as {
      situation?: string;
      bodyType?: BodyType;
      colorType?: ColorType;
    };

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
      await new Promise((r) => setTimeout(r, 900));
      return NextResponse.json(composeOutfit(situation.trim(), bodyType, colorType), { headers: { "x-onulfit-ai": "demo" } });
    }

    /* ── 실제 모드: Anthropic API 직접 호출 (fetch) ──
       @anthropic-ai/sdk 는 node:path 에 의존해 Edge Runtime 미호환.
       fetch 로 직접 호출하면 모든 Edge 환경에서 동작한다.
       모델: Claude Haiku 5.5 (2026-11-07 결정 — 1회 1~2원 수준, 콘솔에서 월 한도를 걸어 둔다)
       · 생각(thinking)은 기본으로 켜져 있으니 effort 를 low 로 두고, max_tokens 는 생각+JSON 이 들어가게 넉넉히
       · 실패(한도 초과·오류·거절·JSON 깨짐)하면 데모 코디로 대신 답한다 → 사이트가 멈추지 않는다 */
    // x-onulfit-ai 헤더: ai(정상) · fallback-quota(크레딧·월 한도 소진) · fallback-error(그 밖의 실패)
    // 하루 한 번 자동 점검이 이 헤더를 보고 한도 소진을 알려 준다
    const fallback = (why: string, quota = false) => {
      console.error(quota ? "AI_QUOTA_EXHAUSTED:" : "Outfit AI fallback:", why);
      return NextResponse.json(composeOutfit(situation.trim(), bodyType, colorType), {
        headers: { "x-onulfit-ai": quota ? "fallback-quota" : "fallback-error" },
      });
    };

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key":        process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type":     "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        max_tokens: 8000,
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
          { role: "user", content: situation.trim() + buildProfileGuide(bodyType, colorType) + seasonNote() },
        ],
      }),
    }).catch(() => null);

    if (!res) return fallback("network");
    if (!res.ok) {
      const body = (await res.text()).slice(0, 300);
      // 크레딧 부족·월 사용 한도 도달은 400 등으로 오고 본문에 credit/spend/limit 이 들어 있다
      const quota = [400, 402, 403, 429].includes(res.status) && /credit|spend|usage limit|billing/i.test(body);
      return fallback(`API ${res.status} ${body}`, quota);
    }

    const json = await res.json();
    if (json.stop_reason === "refusal" || json.stop_reason === "max_tokens") return fallback(`stop_reason ${json.stop_reason}`);
    const textBlock = json.content?.find((b: { type: string }) => b.type === "text");
    if (!textBlock) return fallback("no text block");

    const rawText = (textBlock.text as string)
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let outfit: OutfitRecommendation;
    try {
      outfit = JSON.parse(rawText);
    } catch {
      return fallback("JSON parse");
    }
    const it = outfit?.items;
    if (!it?.top?.name || !it?.bottom?.name || !it?.outer?.name || !it?.shoes?.name || !it?.accessory?.name) return fallback("missing items");
    return NextResponse.json(outfit, { headers: { "x-onulfit-ai": "ai" } });

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
