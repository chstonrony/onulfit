import { NextRequest, NextResponse } from "next/server";
import { normalizeKeyword } from "@/lib/shopping";
import { HAS_NAVER_KEY, searchShop, rankPicks } from "@/lib/naverShop";

/* ── AI 코디 아이템 → 실제 상품 사진 3장 (네이버 쇼핑, W컨셉 우선) ──
   키가 없으면 빈 목록 → 화면은 예전처럼 색 블록. */

export const runtime = "edge";
const MAX = 3;

export async function GET(request: NextRequest) {
  const q = normalizeKeyword((request.nextUrl.searchParams.get("q") ?? "").slice(0, 40));
  const color = (request.nextUrl.searchParams.get("color") ?? "").replace(/[^가-힣a-zA-Z\s]/g, "").trim().slice(0, 20);
  if (!HAS_NAVER_KEY || !q) return NextResponse.json({ items: [] });

  // 색을 넣어 먼저 찾고, 부족하면 색 없이 다시 찾는다
  let items = color ? await searchShop(`여성 ${color} ${q}`) : [];
  if (items.length < MAX) items = [...items, ...(await searchShop(`여성 ${q}`))];
  return NextResponse.json(
    { items: rankPicks(items, MAX) },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
  );
}
