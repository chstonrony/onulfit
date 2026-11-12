/* ══════════════════════════════════════════════════════════
   지그재그 추천 아이템 (공유리워드 제휴 링크) — 2026-11-12
   진단 결과(체형·퍼스널컬러)와 지금 계절에 맞는 실제 상품을 보여 준다.

   · 체형: bodies 에 든 체형에게만 보인다(비우면 모든 체형). styleDirections 의 골격 규칙과 같게:
           통 넓은 하의는 스트레이트 제외, 오버핏 상의는 내추럴만, 크롭 기장은 웨이브만.
   · 계절: seasons 에 든 계절에만 보인다(비우면 사계절). 계절이 바뀌면 상품을 새로 고른다.
   · 퍼스널컬러: 색이 하나뿐인 상품은 tones 로 맞는 톤에게만 보이고,
           색이 여러 개인 상품은 "이 색으로 고르세요" 안내가 톤마다 달라진다(colorTip).
   · 매일 조합이 바뀌고, "다른 아이템 보기"를 누르면 다음 조합으로 넘어간다.

   링크는 지그재그 상품 페이지 → 공유하기 → 링크 복사하기로 만든 주소 그대로 쓴다(변조 금지 — 이용정책).
   상품 사진·지그재그 로고는 쓰지 않는다(상표·저작권). 가격은 자주 바뀌므로 적지 않는다.
   품절·판매 종료된 상품은 이 목록에서 빼면 된다.
══════════════════════════════════════════════════════════ */

import type { BodyType, ColorType } from "./profile";
import { currentSeason, dayNumber, type Season } from "./lookRecipes";
import { COLOR_PLAN } from "./styleDirections";

export type PickSlot = "outer" | "top" | "bottom" | "shoes" | "accessory";

export interface ZigzagPick {
  key: string;
  slot: PickSlot;
  /** 품목 이름 — 옷 그림(GarmentArt)이 알아보는 말로 */
  item: string;
  /** 쇼핑몰(브랜드) 이름 */
  shop: string;
  /** 지그재그 공유리워드 링크 */
  url: string;
  bodies?: BodyType[];
  seasons?: Season[];
  /** 색이 하나뿐인 상품: 맞는 퍼스널컬러 */
  tones?: ColorType[];
  /** 색이 하나뿐인 상품: 그 색 이름 */
  fixedColor?: string;
  /** 데님 상품 — 색 안내를 데님 톤으로 */
  denim?: boolean;
  /** 얼굴 가까이 오는 아이템 — 베스트 컬러(포인트)를 권한다 */
  face?: boolean;
  /** 개성을 주는 포인트 아이템 */
  point?: boolean;
  /** 왜 골랐는지 — 체형별로 다르면 체형별로 */
  why: string | Partial<Record<BodyType, string>>;
}

const COOL: Season[] = ["autumn", "winter", "spring"]; // 여름엔 안 보이는 것
const COLD: Season[] = ["autumn", "winter"];           // 추울 때만

export const ZIGZAG_PICKS: ZigzagPick[] = [
  /* ── 아우터 ── */
  {
    key: "balmacaan", slot: "outer", item: "발마칸 코트", shop: "스파오", url: "https://s.zigzag.kr/abr/V7cCitPn2a",
    bodies: ["straight", "natural"], seasons: COLD,
    why: {
      straight: "어깨선이 둥글게 떨어져 두꺼운 상체가 부해 보이지 않아요. 벨트는 풀어서 일자로.",
      natural: "넉넉한 품과 긴 기장이 뼈대감을 자연스럽게 덮어 줘요.",
    },
  },
  {
    key: "leather-brown", slot: "outer", item: "브라운 레더 자켓", shop: "하네", url: "https://s.zigzag.kr/abr/62fmJaYb2X",
    bodies: ["straight", "natural"], seasons: COOL, tones: ["spring", "autumn"], fixedColor: "브라운", point: true,
    why: {
      straight: "탄탄한 가죽이 스트레이트의 입체적인 상체와 잘 맞아요. 안에는 얇은 니트 하나만.",
      natural: "거친 질감과 넉넉한 품이 내추럴의 뼈대와 한 쌍이에요.",
    },
  },
  {
    key: "leather-black", slot: "outer", item: "블랙 레더 자켓", shop: "하네", url: "https://s.zigzag.kr/abr/pP1MkeQUGt",
    bodies: ["straight", "natural"], seasons: COOL, tones: ["summer", "winter"], fixedColor: "블랙", point: true,
    why: {
      straight: "탄탄한 가죽이 스트레이트의 입체적인 상체와 잘 맞아요. 안에는 얇은 니트 하나만.",
      natural: "거친 질감과 넉넉한 품이 내추럴의 뼈대와 한 쌍이에요.",
    },
  },
  {
    key: "mustang", slot: "outer", item: "무스탕 더플 코트", shop: "제너럴아이디어", url: "https://s.zigzag.kr/abr/IiycH13fDa",
    bodies: ["natural"], seasons: ["winter"], point: true,
    why: "두툼한 질감과 큼직한 실루엣은 내추럴이 가장 멋있게 소화해요.",
  },
  {
    key: "short-padding", slot: "outer", item: "숏 패딩", shop: "디어먼트", url: "https://s.zigzag.kr/abr/rfu2jGuHLS",
    bodies: ["wave"], seasons: ["winter"],
    why: "허리에서 끝나는 기장이라 다리가 길어 보여요. 롱 패딩보다 웨이브에게 맞아요.",
  },
  {
    key: "half-coat", slot: "outer", item: "벨티드 하프 코트", shop: "트위", url: "https://s.zigzag.kr/abr/xy9Ux3eMUl",
    bodies: ["wave"], seasons: COLD, point: true,
    why: "벨트로 허리선을 잡아 주는 짧은 코트. 긴 코트에 눌리지 않아요.",
  },

  /* ── 상의 ── */
  {
    key: "vneck-knit", slot: "top", item: "브이넥 니트", shop: "어텀", url: "https://s.zigzag.kr/abr/BdmYZwI2XV",
    bodies: ["straight", "natural"], seasons: COOL, face: true,
    why: {
      straight: "V넥이 목선을 길게 열어 상체가 얇아 보여요. 스트레이트의 기본이에요.",
      natural: "넉넉한 품의 V넥이라 어깨선이 부드럽게 떨어져요.",
    },
  },
  {
    key: "stripe-shirt", slot: "top", item: "스트라이프 셔츠", shop: "에드모어", url: "https://s.zigzag.kr/abr/davfwc5WR0",
    bodies: ["straight"], seasons: COOL, face: true,
    why: "세로 줄과 깃이 상체를 길게 정리해 줘요. 단추 두 개 풀고 데님에 한쪽만 넣어 입기.",
  },
  {
    key: "crop-cardigan", slot: "top", item: "크롭 가디건", shop: "원로그", url: "https://s.zigzag.kr/abr/1IL4CtEqQa",
    bodies: ["wave"], seasons: COOL, face: true,
    why: "짧은 기장이 허리 위치를 올려 줘요. 색이 11가지라 내 컬러로 고르기 좋아요.",
  },
  {
    key: "hairy-knit", slot: "top", item: "헤어리 카라 크롭 니트", shop: "디어먼트", url: "https://s.zigzag.kr/abr/VPi1eWV1hF",
    bodies: ["wave"], seasons: COLD, face: true, point: true,
    why: "보송한 털과 카라가 얇은 상체에 볼륨을 줘요. 흰 티를 살짝 보이게 겹쳐 입기.",
  },
  {
    key: "check-shirt", slot: "top", item: "체크 셔츠", shop: "퓨어다", url: "https://s.zigzag.kr/abr/PFxO8tU7Pe",
    bodies: ["natural"], seasons: COOL, face: true,
    why: "루즈한 체크 셔츠는 내추럴의 편안한 멋과 가장 잘 맞아요. 소매는 두 번 걷기.",
  },
  {
    key: "henley-knit", slot: "top", item: "헨리넥 오버핏 니트", shop: "슬로우리스트", url: "https://s.zigzag.kr/abr/W59Doheby3",
    bodies: ["natural"], seasons: COLD, face: true,
    why: "박시한 품이 넓은 어깨 프레임을 편하게 감싸요. 단추 트임이 밋밋함을 덜어 줘요.",
  },

  /* ── 하의 ── */
  {
    key: "straight-denim", slot: "bottom", item: "일자 데님", shop: "커믈리진", url: "https://s.zigzag.kr/abr/FqluEnYGep",
    bodies: ["straight"], denim: true,
    why: "허리부터 일자로 떨어져 하체 선이 깔끔해요. 스트레이트는 통을 넓히지 않는 게 좋아요.",
  },
  {
    key: "bootcut", slot: "bottom", item: "세미 부츠컷 팬츠", shop: "슬로우앤드", url: "https://s.zigzag.kr/abr/Ki5Uukl4Dm",
    bodies: ["straight", "wave"], denim: true,
    why: {
      straight: "무릎 아래만 살짝 퍼져 다리가 곧고 길어 보여요.",
      wave: "하이웨스트에 밑단이 살짝 퍼져 골반 선이 정리되고 다리가 길어 보여요.",
    },
  },
  {
    key: "cancan-skirt", slot: "bottom", item: "A라인 캉캉 롱 스커트", shop: "텐가트", url: "https://s.zigzag.kr/abr/moFE4BgGcN",
    bodies: ["wave"],
    why: "허리는 잡고 아래로 퍼지는 A라인이라 웨이브의 곡선이 살아나요. 짧은 상의와 함께.",
  },
  {
    key: "frill-skirt", slot: "bottom", item: "프릴 플레어 스커트", shop: "그레이스뮤즈", url: "https://s.zigzag.kr/abr/aYnQylnXF4",
    bodies: ["wave"], seasons: ["spring", "summer", "autumn"], point: true,
    why: "가벼운 프릴과 플레어가 웨이브의 부드러운 분위기와 잘 맞아요.",
  },
  {
    key: "wide-denim", slot: "bottom", item: "와이드 데님", shop: "고고싱", url: "https://s.zigzag.kr/abr/T8cCZDY64S",
    bodies: ["natural"], denim: true,
    why: "통이 넓고 길게 떨어져 골반 뼈가 도드라지지 않아요. 신발을 덮는 길이로.",
  },
  {
    key: "cargo", slot: "bottom", item: "카고 와이드 팬츠", shop: "원더원더", url: "https://s.zigzag.kr/abr/NSzRL96opC",
    bodies: ["natural"], point: true,
    why: "주머니 달린 넉넉한 바지를 가장 멋지게 입는 체형이 내추럴이에요.",
  },

  /* ── 신발 ── */
  {
    key: "loafer", slot: "shoes", item: "페니 로퍼", shop: "사뿐", url: "https://s.zigzag.kr/abr/6dTYdJqqXZ",
    seasons: COOL,
    why: "데님에도 스커트에도 신는 기본 로퍼. 흰 양말을 살짝 보이면 덜 딱딱해요.",
  },
  {
    key: "long-boots", slot: "shoes", item: "롱부츠", shop: "사뿐", url: "https://s.zigzag.kr/abr/Mi34KaLinT",
    bodies: ["straight", "wave"], seasons: COLD, point: true,
    why: {
      straight: "곧은 통의 롱부츠가 다리 선을 일자로 이어 줘요.",
      wave: "스커트 아래로 롱부츠를 이으면 하체가 한 줄로 길어 보여요.",
    },
  },
  {
    key: "walker", slot: "shoes", item: "레이스업 워커 부츠", shop: "꼼지락", url: "https://s.zigzag.kr/abr/q5uqyCHAgl",
    bodies: ["natural"], seasons: COLD, point: true,
    why: "묵직한 워커가 와이드 팬츠의 넓은 통과 균형을 잡아 줘요.",
  },

  /* ── 소품 ── */
  {
    key: "shoulder-bag", slot: "accessory", item: "가죽 숄더백", shop: "슈펜", url: "https://s.zigzag.kr/abr/1y2X1W6dc5",
    why: "어깨에 짧게 메는 가죽 숄더백 하나면 편한 옷도 정돈돼 보여요.",
  },
  {
    key: "muffler", slot: "accessory", item: "롱 머플러", shop: "끌렌느", url: "https://s.zigzag.kr/abr/wmJAsF1M1l",
    seasons: COLD, face: true,
    why: "얼굴 바로 아래에 오는 색이라 퍼스널컬러 효과가 가장 커요. 색이 9가지예요.",
  },
  {
    key: "ballcap", slot: "accessory", item: "코튼 볼캡", shop: "두마로", url: "https://s.zigzag.kr/abr/MvONxy6rM8",
    face: true, point: true,
    why: "모자 하나로 꾸민 티를 낼 수 있어요. 색이 39가지라 내 컬러를 고르기 쉬워요.",
  },
];

export const SLOT_LABEL: Record<PickSlot, string> = {
  outer: "아우터", top: "상의", bottom: "하의", shoes: "신발", accessory: "소품",
};

/** 체형별 이유 꺼내기 */
export function whyFor(p: ZigzagPick, body: BodyType): string {
  if (typeof p.why === "string") return p.why;
  return p.why[body] ?? Object.values(p.why)[0] ?? "";
}

const TONE_WORD: Record<ColorType, string> = { spring: "봄 웜톤", summer: "여름 쿨톤", autumn: "가을 웜톤", winter: "겨울 쿨톤" };

/** 퍼스널컬러에 맞춘 색 안내 — label 은 한 줄 설명, names 는 색 견본으로 그릴 색 이름(첫 번째가 옷 그림 색) */
/* allowPoint: 한 벌에서 포인트 색은 한 곳에만(모두 베스트 컬러로 칠하면 파스텔 무지개가 됨 — styleDirections 와 같은 원칙) */
export function colorTip(p: ZigzagPick, color: ColorType, n = 0, allowPoint = true): { label: string; names: string[] } {
  const plan = COLOR_PLAN[color];
  const tone = TONE_WORD[color];
  if (p.fixedColor) return { label: `한 가지 색 · ${tone}의 바탕색`, names: [p.fixedColor] };
  if (p.denim) return { label: `${tone} 추천 데님`, names: plan.base.filter((c) => c.includes("데님")) };
  if (p.face && allowPoint) {
    // 포인트 색 두 가지(날마다 돌아가며) + 무난한 바탕색 하나
    const a = plan.points[n % plan.points.length];
    const b = plan.points[(n + 1) % plan.points.length];
    return { label: `얼굴 가까이 · ${tone} 베스트 컬러`, names: [a, b, plan.base[0]] };
  }
  if (p.slot === "shoes" || p.slot === "accessory") return { label: `${tone}에 맞는 소품 색`, names: plan.small.slice(0, 3) };
  return { label: `${tone}의 바탕색`, names: plan.base.filter((c) => !c.includes("데님")).slice(0, 3) };
}

/** 지금 계절·체형·퍼스널컬러에 맞는 상품 전부 */
export function poolFor(body: BodyType, color: ColorType, season: Season): ZigzagPick[] {
  return ZIGZAG_PICKS.filter(
    (p) =>
      (!p.seasons || p.seasons.includes(season)) &&
      (!p.bodies || p.bodies.includes(body)) &&
      (!p.tones || p.tones.includes(color)),
  );
}

/** 오늘의 조합 — 아우터·상의·하의·(신발 또는 소품) 한 개씩.
    날짜와 shift(다른 아이템 보기)에 따라 가능한 조합을 차례로 돈다. */
export function picksFor(body: BodyType, color: ColorType, shift = 0, d = new Date()): { picks: ZigzagPick[]; season: Season; n: number; total: number } {
  const season = currentSeason(d);
  const pool = poolFor(body, color, season);
  const by = (s: PickSlot[]) => pool.filter((p) => s.includes(p.slot));
  const groups = [by(["outer"]), by(["top"]), by(["bottom"])].filter((g) => g.length);
  const extra = by(["shoes", "accessory"]);
  const n = dayNumber(d) + shift;
  const picks: ZigzagPick[] = [];
  let step = 1;
  for (const g of groups) {
    picks.push(g[Math.floor(n / step) % g.length]);
    step *= g.length;
  }
  if (extra.length) picks.push(extra[n % extra.length]);
  return { picks, season, n, total: pool.length };
}
