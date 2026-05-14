import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // Cloudflare Pages / Edge 환경 호환
import { anthropic, SYSTEM_PROMPT } from "@/lib/claude";
import { OutfitRecommendation } from "@/lib/types";
import { getMockOutfit, IS_DEMO_MODE } from "@/lib/mockData";

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

    /* ── 데모 모드: API 키가 없으면 샘플 코디 반환 ── */
    if (IS_DEMO_MODE) {
      // 실제 느낌을 주기 위해 살짝 딜레이
      await new Promise((r) => setTimeout(r, 900));
      const mockOutfit = getMockOutfit(situation.trim());
      return NextResponse.json(mockOutfit);
    }

    /* ── 실제 모드: Claude API 호출 ── */
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: situation.trim(),
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Claude가 응답을 반환하지 않았습니다.");
    }

    // 마크다운 코드 펜스 제거 후 JSON 파싱
    const rawText = textBlock.text
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
      { error: "코디 추천 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
