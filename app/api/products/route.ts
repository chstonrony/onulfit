import { NextRequest, NextResponse } from "next/server";
import { normalizeKeyword } from "@/lib/shopping";
import { hasNaverKey, searchShop, rankPicks } from "@/lib/naverShop";

/* ── AI 코디 아이템 → 실제 상품 사진 3장 (네이버 쇼핑, W컨셉 우선) ──
   키가 없으면 빈 목록 → 화면은 예전처럼 색 블록. */

export const dynamic = "force-dynamic"; // 키를 실행 때 읽도록 Node 런타임 사용
const MAX = 3;

export async function GET(request: NextRequest) {
  const q = normalizeKeyword((request.nextUrl.searchParams.get("q") ?? "").slice(0, 40));
  const color = (request.nextUrl.searchParams.get("color") ?? "").replace(/[^가-힣a-zA-Z\s]/g, "").trim().slice(0, 20);
  if (!hasNaverKey() || !q) return NextResponse.json({ items: [] });

  // 색을 넣어 먼저 찾고, 부족하면 색 없이 다시 찾는다
  let items = color ? await searchShop(`여성 ${color} ${q}`) : [];
  if (items.length < MAX) items = [...items, ...(await searchShop(`여성 ${q}`))];
  const picks = rankPicks(items, MAX);
  // 결과가 있을 때만 하루 캐시(오류로 빈 결과가 하루 동안 남지 않게)
  return NextResponse.json(
    { items: picks },
    picks.length ? { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } } : undefined
  );
}
