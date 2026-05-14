import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/claude";
import { OutfitRecommendation } from "@/lib/types";
import { getMockOutfit, IS_DEMO_MODE } from "@/lib/mockData";

export const runtime = "edge"; // Cloudflare Pages / Edge 환경 호환

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { situation } = body;

    if (!situation || typeof situation !== "string" || situation.trim().length === 0) {
      return NextResponse.json({ error: "상황을 입력해주세요." }, { status: 400 });
    }

    if (situation.trim().length > 500) {
      return NextResponse.json(
        { error: "입력이 너무 깁니다. 500자 이내로 입력해주세요." },
        { status: 400 }
      );
    }

    /* ── 데모 모드: API 키 없을 때 샘플 코디 반환 ── */
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 900));
      return NextResponse.json(getMockOutfit(situation.trim()));
    }

    /* ── 실제 모드: Anthropic API 직접 호출 (fetch) ──
       @anthropic-ai/sdk 는 node:path 에 의존해 Edge Runtime 미호환.
       fetch 로 직접 호출하면 모든 Edge 환경에서 동작한다.           */
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key":        process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "anthropic-beta":   "prompt-caching-2024-07-31",
        "content-type":     "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: situation.trim() }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Anthropic API error:", res.status, err);
      return NextResponse.json(
        { error: "AI 서버와 통신 중 오류가 발생했어요. 잠시 후 다시 시도해주세요." },
        { status: 502 }
      );
    }

    const json = await res.json();
    const textBlock = json.content?.find((b: { type: string }) => b.type === "text");
    if (!textBlock) throw new Error("Claude가 응답을 반환하지 않았습니다.");

    const rawText = (textBlock.text as string)
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const outfit: OutfitRecommendation = JSON.parse(rawText);
    return NextResponse.json(outfit);

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
