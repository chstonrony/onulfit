import { NextRequest, NextResponse } from "next/server";
import { HAS_NAVER_KEY, searchShop, rankPicks } from "@/lib/naverShop";
import { todaysRecipe, SEASON_LABEL } from "@/lib/lookRecipes";

/* ── 오늘의 완성 코디 (매일 자동으로 바뀜) ──
   계절·날짜·체형·퍼스널컬러로 레시피를 고르고, 아이템마다 네이버 쇼핑에서 상품 1개를 찾는다.
   W컨셉 상품이 있으면 우선(제휴 링크). 키가 없거나 상품을 3개 미만으로 찾으면 빈 결과 →
   화면은 계절에 맞는 직접 고른 룩이 있으면 그것을, 없으면 카드를 숨긴다. */

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const body = request.nextUrl.searchParams.get("body") ?? "";
  const color = request.nextUrl.searchParams.get("color") ?? "";
  if (!HAS_NAVER_KEY) return NextResponse.json({ look: null });

  const { recipe, colorWord, season } = todaysRecipe(body, color);
  const found = await Promise.all(
    recipe.items.map(async (it) => {
      let items = it.colored ? await searchShop(`여성 ${colorWord} ${it.kw}`) : [];
      if (!items.length) items = await searchShop(`여성 ${it.kw}`);
      const [pick] = rankPicks(items, 1);
      return pick ? { cat: it.cat, ...pick } : null;
    })
  );
  const items = found.filter((x): x is NonNullable<typeof x> => !!x);
  if (items.length < 3) return NextResponse.json({ look: null });

  return NextResponse.json(
    {
      look: {
        id: `${recipe.id}-${colorWord}`,
        title: recipe.title,
        mood: recipe.mood,
        season: SEASON_LABEL[season],
        colorWord,
        items,
      },
    },
    // 날짜가 바뀌면 레시피가 바뀌므로 1시간만 캐시
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600" } }
  );
}
