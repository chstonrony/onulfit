/* ── 네이버 쇼핑 검색 (서버 전용) ──
   키: Vercel 환경변수 NAVER_CLIENT_ID / NAVER_CLIENT_SECRET. 없으면 항상 빈 결과.
   W컨셉 상품은 W컨셉 제휴 링크(링크프라이스)로 감싼다.
   같은 검색어는 하루 동안 캐시(무료 한도 하루 25,000건). */

import { wconceptLink } from "./shopping";
import type { ProductPick } from "./types";

const FASHION = ["패션의류", "패션잡화"];

/* 키는 요청 때마다 읽는다(빌드 때 값이 박히지 않게) */
function keys() {
  return { id: (process.env.NAVER_CLIENT_ID ?? "").trim(), secret: (process.env.NAVER_CLIENT_SECRET ?? "").trim() }; // 붙여 넣을 때 들어간 앞뒤 빈칸 제거
}
export function hasNaverKey(): boolean {
  const { id, secret } = keys();
  return !!(id && secret);
}

export interface NaverItem {
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

export const isWconcept = (it: NaverItem) =>
  /w\s?컨셉|더블유컨셉|wconcept/i.test(it.mallName) || it.link.includes("wconcept.co.kr");

/** 마지막 검색 상태 — 사진이 안 나올 때 원인 확인용(키 값은 담지 않음) */
export let lastStatus = "";

export async function searchShop(query: string): Promise<NaverItem[]> {
  const { id, secret } = keys();
  if (!id || !secret) { lastStatus = "no-key"; return []; }
  const url = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=40&sort=sim&exclude=used:rental:cbshop`;
  try {
    const res = await fetch(url, {
      headers: { "X-Naver-Client-Id": id, "X-Naver-Client-Secret": secret },
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      lastStatus = `naver-${res.status}`;
      console.error("naver shop search failed:", res.status); // 키 값은 남기지 않음
      return [];
    }
    const data = (await res.json()) as { items?: NaverItem[] };
    const all = data.items ?? [];
    const kept = all.filter((it) => FASHION.includes(it.category1) && it.image);
    lastStatus = `ok-${all.length}-${kept.length}`;
    return kept;
  } catch {
    lastStatus = "fetch-error";
    return [];
  }
}

export function toPick(it: NaverItem): ProductPick {
  const wc = isWconcept(it);
  return {
    title: clean(it.title),
    image: it.image,
    price: Number(it.lprice) || 0,
    mall: wc ? "W컨셉" : clean(it.mallName) || "네이버쇼핑",
    url: wc && it.link.includes("wconcept.co.kr") ? wconceptLink(it.link) : it.link,
    wconcept: wc,
  };
}

/** 중복 사진을 빼고, W컨셉 상품이 있으면 맨 앞으로 */
export function rankPicks(items: NaverItem[], max: number): ProductPick[] {
  const seen = new Set<string>();
  const uniq = items.filter((it) => (seen.has(it.image) ? false : (seen.add(it.image), true)));
  const w = uniq.find(isWconcept);
  const rest = uniq.filter((it) => it !== w);
  return (w ? [w, ...rest] : rest).slice(0, max).map(toPick);
}
