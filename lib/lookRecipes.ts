/* ══════════════════════════════════════════════════════════
   오늘의 완성 코디 — 계절별 룩 레시피 (매일 자동으로 바뀜)
   · 계절은 한국 시간 기준 달로 정한다: 11~2월 겨울, 3~5월 봄, 6~8월 여름, 9~10월 가을
   · 날짜마다 레시피와 색이 돌아가며, 상품은 /api/looks 가 네이버 쇼핑에서 그때그때 찾는다
     (W컨셉 상품이 있으면 우선, 제휴 링크) → 사람이 상품을 올리지 않아도 매일 새 룩
   · 레시피를 더 넣고 싶으면 아래 RECIPES 에 한 줄씩 추가하면 된다
══════════════════════════════════════════════════════════ */

import type { BodyType, ColorType } from "./profile";

export type Season = "spring" | "summer" | "autumn" | "winter";

/** 한국 시간 기준 지금 날짜 */
function kstNow(d = new Date()) {
  return new Date(d.getTime() + 9 * 60 * 60 * 1000);
}

export function currentSeason(d = new Date()): Season {
  const m = kstNow(d).getUTCMonth() + 1;
  if (m === 11 || m === 12 || m <= 2) return "winter";
  if (m <= 5) return "spring";
  if (m <= 8) return "summer";
  return "autumn";
}

/** 한국 시간 기준 날짜 번호(하루에 1씩 증가) */
export function dayNumber(d = new Date()): number {
  return Math.floor(kstNow(d).getTime() / 86400000);
}

export const SEASON_LABEL: Record<Season, { ko: string; en: string }> = {
  spring: { ko: "봄", en: "SPRING" },
  summer: { ko: "여름", en: "SUMMER" },
  autumn: { ko: "가을", en: "AUTUMN" },
  winter: { ko: "겨울", en: "WINTER" },
};

/** 트렌드 시즌 표기 (예: 2026 FW) — 9~2월은 FW, 3~8월은 SS */
export function trendSeasonTag(d = new Date()): string {
  const k = kstNow(d);
  const m = k.getUTCMonth() + 1;
  const y = k.getUTCFullYear();
  if (m >= 3 && m <= 8) return `${y} SS`;
  return `${m <= 2 ? y - 1 : y} FW`;
}

/** 퍼스널컬러별 색 이름 — 메인 아이템(코트·니트 등)에만 붙여 검색 */
const COLOR_WORDS: Record<ColorType, string[]> = {
  spring: ["아이보리", "카멜", "웜베이지", "코랄"],
  summer: ["라이트그레이", "네이비", "라벤더", "스카이블루"],
  autumn: ["브라운", "카키", "베이지", "버건디"],
  winter: ["블랙", "차콜", "화이트", "네이비"],
};
const NEUTRAL = ["베이지", "블랙", "아이보리", "그레이"];

export interface RecipeItem {
  cat: string;          // 화면 표시 (코트/니트…)
  kw: string;           // 검색어 (색·성별어 제외)
  colored?: boolean;    // true면 퍼스널컬러 색 이름을 붙여 검색
}
export interface LookRecipe {
  id: string;
  season: Season;
  title: string;
  mood: string;
  bodies?: BodyType[];  // 비면 모든 체형
  items: RecipeItem[];
}

export const RECIPES: LookRecipe[] = [
  /* ── 겨울 ── */
  { id: "w-longcoat", season: "winter", title: "포근한 니트에 롱코트 한 벌 룩",
    mood: "니트와 코트만 잘 고르면 겨울 코디는 끝나요. 슬랙스로 길게, 앵클부츠로 단정하게.",
    items: [{ cat: "코트", kw: "울 롱코트", colored: true }, { cat: "니트", kw: "캐시미어 니트", colored: true }, { cat: "하의", kw: "울 슬랙스" }, { cat: "슈즈", kw: "앵클부츠" }] },
  { id: "w-padding", season: "winter", title: "패딩도 단정하게, 출근길 룩",
    mood: "짧은 패딩에 터틀넥을 받쳐 입으면 따뜻하면서도 깔끔해 보여요.",
    items: [{ cat: "아우터", kw: "숏패딩", colored: true }, { cat: "니트", kw: "터틀넥 니트" }, { cat: "하의", kw: "니트 롱스커트" }, { cat: "슈즈", kw: "롱부츠" }] },
  { id: "w-tweed", season: "winter", title: "모임 가는 날, 트위드 한 스푼",
    mood: "트위드 재킷 하나로 격식은 살리고, 니트 원피스로 편안함은 그대로.",
    bodies: ["straight", "wave"],
    items: [{ cat: "재킷", kw: "트위드 자켓", colored: true }, { cat: "원피스", kw: "니트 원피스" }, { cat: "슈즈", kw: "로퍼" }, { cat: "가방", kw: "미니 숄더백" }] },
  { id: "w-mustang", season: "winter", title: "주말 브런치, 무스탕 캐주얼",
    mood: "무스탕은 데님과 가장 잘 어울려요. 머플러로 얼굴 가까이 내 색을 더해 보세요.",
    bodies: ["natural", "straight"],
    items: [{ cat: "아우터", kw: "무스탕", colored: true }, { cat: "하의", kw: "와이드 데님" }, { cat: "머플러", kw: "울 머플러", colored: true }, { cat: "슈즈", kw: "어그 부츠" }] },
  { id: "w-cropcoat", season: "winter", title: "짧은 코트로 비율 살리기",
    mood: "허리선 위로 끝나는 코트와 플레어 스커트로 가볍고 여성스럽게.",
    bodies: ["wave"],
    items: [{ cat: "코트", kw: "숏 울코트", colored: true }, { cat: "니트", kw: "앙고라 니트", colored: true }, { cat: "하의", kw: "플레어 스커트" }, { cat: "슈즈", kw: "미들힐 부츠" }] },
  { id: "w-oversize", season: "winter", title: "오버핏 코트로 힘 빼고 멋 내기",
    mood: "넉넉한 코트와 와이드 팬츠, 큰 머플러까지. 툭 걸쳐도 멋이 나는 조합이에요.",
    bodies: ["natural"],
    items: [{ cat: "코트", kw: "오버핏 핸드메이드 코트", colored: true }, { cat: "니트", kw: "케이블 니트" }, { cat: "하의", kw: "와이드 팬츠" }, { cat: "슈즈", kw: "첼시부츠" }] },

  /* ── 봄 ── */
  { id: "s-trench", season: "spring", title: "트렌치코트 하나로 봄 시작",
    mood: "트렌치에 셔츠, 일자 데님이면 어디든 무난하게 예뻐요.",
    items: [{ cat: "아우터", kw: "트렌치코트", colored: true }, { cat: "셔츠", kw: "코튼 셔츠" }, { cat: "하의", kw: "스트레이트 데님" }, { cat: "슈즈", kw: "로퍼" }] },
  { id: "s-cardigan", season: "spring", title: "가디건과 롱스커트, 산뜻한 외출",
    mood: "얇은 가디건에 플리츠 스커트로 가볍게. 플랫슈즈로 편안하게.",
    items: [{ cat: "가디건", kw: "니트 가디건", colored: true }, { cat: "하의", kw: "플리츠 롱스커트" }, { cat: "슈즈", kw: "메리제인 플랫" }, { cat: "가방", kw: "캔버스 토트백" }] },
  { id: "s-jacket", season: "spring", title: "봄 재킷으로 단정한 출근룩",
    mood: "가벼운 재킷과 슬랙스, 블라우스 하나면 출근 준비 끝.",
    items: [{ cat: "재킷", kw: "린넨 블레이저", colored: true }, { cat: "블라우스", kw: "블라우스" }, { cat: "하의", kw: "와이드 슬랙스" }, { cat: "슈즈", kw: "슬링백" }] },

  /* ── 여름 ── */
  { id: "m-dress", season: "summer", title: "편하지만 예쁜, 원피스 한 벌 룩",
    mood: "키높이 샌들로 비율을 살리고, 미니백으로 가볍게. 너무 과하지 않아 데일리로 딱이에요.",
    items: [{ cat: "원피스", kw: "하프슬리브 원피스", colored: true }, { cat: "슈즈", kw: "키높이 샌들" }, { cat: "가방", kw: "미니 호보백" }] },
  { id: "m-linen", season: "summer", title: "린넨 셔츠로 시원하게",
    mood: "린넨 셔츠에 와이드 팬츠, 샌들이면 더운 날도 단정해요.",
    items: [{ cat: "셔츠", kw: "린넨 셔츠", colored: true }, { cat: "하의", kw: "린넨 와이드팬츠" }, { cat: "슈즈", kw: "플랫 샌들" }, { cat: "가방", kw: "라탄백" }] },
  { id: "m-sleeveless", season: "summer", title: "민소매 니트와 롱스커트",
    mood: "가벼운 니트 탑에 흐르는 스커트로 여름 모임룩 완성.",
    items: [{ cat: "상의", kw: "슬리브리스 니트", colored: true }, { cat: "하의", kw: "새틴 롱스커트" }, { cat: "슈즈", kw: "뮬" }] },

  /* ── 가을 ── */
  { id: "a-blazer", season: "autumn", title: "블레이저 하나로 가을 출근룩",
    mood: "블레이저와 니트 베스트, 슬랙스로 가을 분위기 가득하게.",
    items: [{ cat: "재킷", kw: "울 블레이저", colored: true }, { cat: "니트", kw: "니트 베스트" }, { cat: "하의", kw: "울 슬랙스" }, { cat: "슈즈", kw: "로퍼" }] },
  { id: "a-suede", season: "autumn", title: "스웨이드 재킷 주말 룩",
    mood: "부드러운 스웨이드에 데님, 앵클부츠로 따뜻한 가을 캐주얼.",
    items: [{ cat: "재킷", kw: "스웨이드 자켓", colored: true }, { cat: "니트", kw: "라운드 니트" }, { cat: "하의", kw: "부츠컷 데님" }, { cat: "슈즈", kw: "앵클부츠" }] },
  { id: "a-trench", season: "autumn", title: "트렌치와 롱스커트, 가을 산책",
    mood: "트렌치코트 아래 롱스커트를 받쳐 입으면 분위기가 확 살아나요.",
    items: [{ cat: "아우터", kw: "트렌치코트", colored: true }, { cat: "니트", kw: "브이넥 니트" }, { cat: "하의", kw: "롱스커트" }, { cat: "가방", kw: "버킷백" }] },
];

/** 오늘(날짜)·계절·체형·컬러에 맞는 레시피 1개 + 색 이름 */
export function todaysRecipe(body?: string, color?: string, d = new Date()): { recipe: LookRecipe; colorWord: string; season: Season } {
  const season = currentSeason(d);
  const day = dayNumber(d);
  const inSeason = RECIPES.filter((r) => r.season === season);
  const forBody = inSeason.filter((r) => !r.bodies || (body && r.bodies.includes(body as BodyType)));
  const pool = forBody.length ? forBody : inSeason;
  const recipe = pool[day % pool.length];
  const words = (color && COLOR_WORDS[color as ColorType]) || NEUTRAL;
  return { recipe, colorWord: words[day % words.length], season };
}
