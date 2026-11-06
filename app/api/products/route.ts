import { NextRequest, NextResponse } from "next/server";
import { normalizeKeyword, wconceptLink } from "@/lib/shopping";
import type { ProductPick } from "@/lib/types";

/* ── AI 코디 아이템 → 실제 상품 사진 (네이버 쇼핑 검색 API) ──
   키: Vercel 환경변수 NAVER_CLIENT_ID / NAVER_CLIENT_SECRET (서버 전용, 브라우저에 노출 안 됨)
   키가 없으면 빈 목록을 돌려주고, 화면은 예전처럼 색 블록을 보여준다.
   W컨셉 상품이 섞여 있으면 맨 앞에 두고 W컨셉 제휴 링크(링크프라이스)로 감싼다.
   같은 검색어는 하루 동안 캐시해 API 호출 수(하루 25,000건 무료)를 아낀다. */

export const runtime = "edge";

const ID = process.env.NAVER_CLIENT_ID;
const SECRET = process.env.NAVER_CLIENT_SECRET;
const FASHION = ["패션의류", "패션잡화"];
const MAX = 3;

interface NaverItem {
  title: string;
  link: string;
  image: string;
  lprice: string;
  mallName: string;
  productId: string;
  category1: string;
}

function clean(s: string) {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

const isWconcept = (it: NaverItem) =>
  /w\s?컨셉|더블유컨셉|wconcept/i.test(it.mallName) || it.link.includes("wconcept.co.kr");

async function search(query: string): Promise<NaverItem[]> {
  const url = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=40&sort=sim&exclude=used:rental:cbshop`;
  const res = await fetch(url, {
    headers: { "X-Naver-Client-Id": ID!, "X-Naver-Client-Secret": SECRET! },
    next: { revalidate: 86400 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { items?: NaverItem[] };
  return (data.items ?? []).filter((it) => FASHION.includes(it.category1) && it.image);
}

function pick(items: NaverItem[]): ProductPick[] {
  const seen = new Set<string>();
  const uniq = items.filter((it) => (seen.has(it.image) ? false : (seen.add(it.image), true)));
  const w = uniq.find(isWconcept);
  const rest = uniq.filter((it) => it !== w);
  const chosen = (w ? [w, ...rest] : rest).slice(0, MAX);
  return chosen.map((it) => {
    const wc = isWconcept(it);
    return {
      title: clean(it.title),
      image: it.image,
      price: Number(it.lprice) || 0,
      mall: wc ? "W컨셉" : clean(it.mallName) || "네이버쇼핑",
      url: wc && it.link.includes("wconcept.co.kr") ? wconceptLink(it.link) : it.link,
      wconcept: wc,
    };
  });
}

export async function GET(request: NextRequest) {
  const q = normalizeKeyword((request.nextUrl.searchParams.get("q") ?? "").slice(0, 40));
  const color = (request.nextUrl.searchParams.get("color") ?? "").replace(/[^가-힣a-zA-Z\s]/g, "").trim().slice(0, 20);
  if (!ID || !SECRET || !q) return NextResponse.json({ items: [] });

  try {
    // 색을 넣어 먼저 찾고, 부족하면 색 없이 다시 찾는다
    let items = color ? await search(`여성 ${color} ${q}`) : [];
    if (items.length < MAX) items = [...items, ...(await search(`여성 ${q}`))];
    return NextResponse.json(
      { items: pick(items) },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
    );
  } catch {
    return NextResponse.json({ items: [] });
  }
}
