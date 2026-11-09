import type { ColorType } from "./profile";

/* ── AI가 쓴 아이템 이름 다듬기 (2026-11-07) ──
   지침을 줘도 가끔 "블랙 캐시미어 혼방 니트 풀오버 (클래식 크루넥)", "립스틱 또는 레드 미니 클러치"처럼 길거나
   하나로 정하지 않은 이름이 온다. 카드·코디 보드에 찍히기 전에 서버에서 한 번 더 정리한다.
   · 괄호 속 설명 빼기 · "또는 / 혹은" 뒤 후보 빼기 · 앞에 붙은 색 빼기(색은 color 칸에 따로 있음) · 너무 길면 앞 수식어부터 덜어내기 */

const MAX = 16;

function stripParens(s: string) {
  return s.replace(/\s*[(\[（【][^)\]）】]*[)\]）】]?/g, " ");
}

/* 옷이 아닌 것·뭉뚱그린 말 — 이런 후보는 건너뛴다 */
const VAGUE = /소품|립스틱|립\s?컬러|립밤|향수|네일|화장/;
/* 무늬 말은 색이 아니므로 이름에 남긴다 */
const PATTERN = /스트라이프|체크|도트|깅엄|플라워|플로럴|헤링본|하운드|타탄|레오파드/;
const ALT = /\s*(?:또는|혹은|\/|\bor\b)\s*/;

export function cleanName(name: string, color = ""): string {
  const orig = (name || "").trim();
  // 후보: 괄호 밖 본문 → 괄호 안에 적힌 다른 후보들. 옷이 아닌 것(립스틱·소품)은 건너뛴다
  const inner = [...orig.matchAll(/[(\[（【]([^)\]）】]*)[)\]）】]?/g)].flatMap((m) => m[1].split(ALT));
  const cands = [stripParens(orig).split(ALT)[0], ...inner].map((x) => x.replace(/\s+/g, " ").trim()).filter(Boolean);
  const s = cands.find((c) => !VAGUE.test(c)) ?? cands[0] ?? orig;

  // 앞에 붙은 색 빼기 — color 칸의 낱말과 같은 낱말만 (예: color "모카 브라운", name "모카 캐시미어 터틀넥" → "캐시미어 터틀넥")
  const colorWords = new Set(stripParens(color).split(/[\s·,]+/).filter((w) => w && !PATTERN.test(w)));
  let words = s.split(" ");
  while (words.length > 2 && colorWords.has(words[0])) words = words.slice(1);

  // 너무 길면 앞 수식어부터 덜어내되 품목(끝 두 낱말)은 남긴다
  while (words.join(" ").length > MAX && words.length > 2) words = words.slice(1);

  const out = words.join(" ").trim();
  return out.length >= 2 ? out : orig;
}

export function cleanColor(color: string): string {
  let s = stripParens(color || "").replace(/\s+/g, " ").trim();
  // "연청 데님 대신 그레이"처럼 바꾼 이유가 섞여 오면 바꾼 뒤의 색만 (2026-11-09 라이브에서 봄)
  if (/\s대신\s/.test(s)) s = s.split(/\s대신\s/).pop()!.trim();
  // 후보를 나열하면 첫 번째 하나만
  s = s.split(ALT)[0].trim();
  return s || color;
}

type AnyItem = { name?: unknown; color?: unknown };
/** 코디(완성본·쓰는 중 모두)의 아이템 이름·색을 다듬어 새 객체로 돌려준다 */
export function cleanOutfit<T>(o: T): T {
  const items = (o as { items?: Record<string, AnyItem> })?.items;
  if (!items || typeof items !== "object") return o;
  const next: Record<string, AnyItem> = {};
  for (const [k, it] of Object.entries(items)) {
    if (!it || typeof it !== "object") { next[k] = it; continue; }
    const color = typeof it.color === "string" ? cleanColor(it.color) : it.color;
    const name = typeof it.name === "string" ? cleanName(it.name, typeof color === "string" ? color : "") : it.name;
    next[k] = { ...it, name, color };
  }
  return { ...(o as object), items: next } as T;
}

/* ── 피할 색 막기 (2026-11-07) ──
   지침을 줘도 AI가 "무난한 무채색"이라며 봄 웜에게 블랙을 주는 일이 있었다.
   퍼스널컬러가 있으면 아이템의 색·이름·설명에 들어간 '피할 색'을 그 사람에게 맞는 색으로 바꿔 보낸다.
   (조문 자리처럼 검정이 정답인 상황은 부르는 쪽에서 건너뛴다) */

const AVOID_SWAP: Record<ColorType, Record<string, string>> = {
  spring: { "블랙": "카멜", "차콜": "카멜", "버건디": "코랄", "탁한 회색": "아이보리" },
  summer: { "머스타드": "라벤더", "카멜": "소프트 그레이", "다크 브라운": "소프트 그레이", "오렌지": "로즈" },
  autumn: { "형광색": "머스타드", "쨍한 핑크": "테라코타", "스카이 블루": "카키", "라벤더": "올리브" },
  winter: { "카멜": "그레이", "올리브": "네이비", "베이지": "퓨어 화이트", "머스타드": "로열 블루" },
};

type ColorItem = { name?: unknown; color?: unknown; description?: unknown };
export function fixAvoidColors<T>(o: T, colorType?: ColorType): T {
  const swap = colorType ? AVOID_SWAP[colorType] : undefined;
  const items = (o as { items?: Record<string, ColorItem> })?.items;
  if (!swap || !items || typeof items !== "object") return o;
  const words = Object.keys(swap).sort((a, b) => b.length - a.length);
  const fix = (v: unknown) => {
    if (typeof v !== "string") return v;
    let s = v;
    for (const w of words) s = s.split(w).join(swap[w]);
    return s;
  };
  const next: Record<string, ColorItem> = {};
  for (const [k, it] of Object.entries(items)) {
    if (!it || typeof it !== "object" || typeof it.color !== "string" || !words.some((w) => (it.color as string).includes(w))) { next[k] = it; continue; }
    next[k] = { ...it, color: fix(it.color), name: fix(it.name), description: fix(it.description) };
  }
  return { ...(o as object), items: next } as T;
}
