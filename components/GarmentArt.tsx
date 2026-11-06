/* 옷 사진 — 아이템 종류(니트·트위드 자켓·메리제인…)를 실사 누끼 사진에 추천 색·무늬를 입혀 보여준다.
   사진: GPT Image 2로 한 번 만든 오프화이트 실사 59종(public/garments/photo/{kind}.webp, 추가 비용 없음)
   · 바탕 레이어: 옷 모양(사진의 투명도)대로 추천 색 또는 무늬를 깐다
   · 위 레이어: 흑백 사진을 곱하기(multiply)로 겹쳐 주름·그림자·디테일을 살린다
   종류·무늬는 아이템 이름·검색어에서 찾는다(못 찾으면 카테고리 기본 사진). */

import { GARMENT_SIZES, type GarmentKind } from "@/lib/garmentSizes";

type Kind = GarmentKind;

/* 카테고리별 규칙(위에서부터 먼저 맞는 것) — 디테일 종류를 일반 종류보다 먼저 본다.
   "부츠컷 데님"이 신발로 잡히지 않게 카테고리 안에서 먼저 찾는다 */
const DRESS: [RegExp, Kind][] = [
  [/셔츠\s?원피스|셔츠\s?드레스/, "shirt_dress"],
  [/니트\s?원피스|니트\s?드레스|골지\s?원피스/, "knit_dress"],
  [/원피스|드레스/, "dress"],
];
const CARDI: [RegExp, Kind][] = [
  [/크롭\s?가디건/, "crop_cardigan"],
  [/(브이넥|v넥|V넥)\s?가디건/, "vneck_cardigan"],
  [/가디건/, "cardigan"],
  [/베스트|조끼/, "vest"],
];
const RULES: Record<string, [RegExp, Kind][]> = {
  top: [
    ...DRESS,
    [/터틀넥|폴라|하이넥/, "turtleneck"],
    ...CARDI,
    [/케이블|꽈배기/, "cable_knit"],
    [/(카라|칼라)\s?니트|폴로/, "polo_knit"],
    [/리본|타이\s?블라우스|보우/, "ribbon_blouse"],
    [/(?<!티)셔츠|블라우스|남방/, "shirt"],
    [/슬리브리스|민소매|나시|캐미|뷔스티에/, "sleeveless"],
    [/후드|후디/, "hoodie"],
    [/맨투맨|스웨트/, "sweatshirt"],
    [/니트|스웨터|풀오버/, "knit"],
    [/티셔츠|반팔|크롭|탑|티$/, "tee"],
  ],
  bottom: [
    ...DRESS,
    [/플리츠|주름\s?스커트/, "pleated_skirt"],
    [/슬립\s?스커트|새틴\s?스커트|실크\s?스커트/, "slip_skirt"],
    [/데님\s?스커트|청\s?스커트|청치마/, "denim_skirt"],
    [/미니/, "miniskirt"],
    [/스커트|치마/, "skirt"],
    [/카고/, "cargo_pants"],
    [/버뮤다|반바지|쇼츠|숏팬츠/, "shorts"],
    [/데님|청바지|진$|진\s/, "jeans"],
    [/와이드|부츠컷|플레어|배기/, "wide"],
    [/슬랙스|팬츠|바지|조거|레깅스/, "pants"],
  ],
  outer: [
    [/패딩|다운|푸퍼/, "padding"],
    [/트렌치/, "trench"],
    [/트위드/, "tweed_jacket"],
    [/레더|가죽|라이더/, "leather_jacket"],
    [/무스탕|시어링|양털/, "shearling"],
    [/바시티|야구\s?점퍼|스타디움/, "varsity"],
    [/블레이저/, "blazer"],
    ...CARDI,
    [/더블\s?(코트|브레스트)/, "double_coat"],
    [/재킷|자켓|점퍼/, "jacket"],
    [/코트|케이프/, "coat"],
  ],
  shoes: [
    [/롱부츠|니하이|하이부츠/, "longboot"],
    [/첼시/, "chelsea"],
    [/부츠|워커/, "boot"],
    [/메리제인/, "maryjane"],
    [/발레|플랫/, "ballet"],
    [/뮬|블로퍼/, "mule"],
    [/샌들|슬리퍼|쪼리/, "sandal"],
    [/어글리|청키|대드/, "ugly_sneaker"],
    [/스니커|운동화/, "sneaker"],
    [/힐|펌프스|슬링백|구두/, "heel"],
    [/로퍼|단화|모카신|더비/, "loafer"],
  ],
  accessory: [
    [/머플러|스카프|목도리|숄(?!더)/, "scarf"],
    [/귀걸이|이어링/, "earring"],
    [/목걸이|네크리스|펜던트|초커/, "necklace"],
    [/벨트/, "belt"],
    [/비니/, "beanie"],
    [/볼캡|야구\s?모자|캡/, "cap"],
    [/베레/, "beret"],
    [/모자|버킷|햇|페도라/, "hat"],
    [/토트/, "tote"],
    [/숄더|바게트|호보/, "shoulder_bag"],
    [/가방|백|크로스|클러치|파우치/, "bag"],
  ],
};
const FALLBACK: Record<string, Kind> = { top: "knit", bottom: "pants", outer: "coat", shoes: "loafer", accessory: "bag" };

export function garmentKind(category: string, text: string): Kind {
  for (const [re, k] of RULES[category] ?? []) if (re.test(text)) return k;
  // 카테고리가 엉뚱하게 왔을 때를 대비해 다른 카테고리 규칙도 본다
  for (const [cat, rules] of Object.entries(RULES)) {
    if (cat === category) continue;
    for (const [re, k] of rules) if (re.test(text)) return k;
  }
  return FALLBACK[category] ?? "bag";
}

/* 무늬 — 이름에 무늬 말이 있을 때만(없으면 무지) */
export type Pattern = "stripe" | "gingham" | "check" | "dot";
export function garmentPattern(text: string): Pattern | null {
  if (/스트라이프|줄무늬|보더|단가라|핀스트라이프/.test(text)) return "stripe";
  if (/깅엄/.test(text)) return "gingham";
  if (/체크|타탄|글렌|윈도우페인|하운드|격자/.test(text)) return "check";
  if (/도트|땡땡이|폴카/.test(text)) return "dot";
  return null;
}

/* 색 계산 */
function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function luminance(hex: string) {
  const [r, g, b] = rgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function shade(hex: string, k: number) {
  const [r, g, b] = rgb(hex).map((v) => Math.round(v * k));
  return `rgb(${r},${g},${b})`;
}

/* 무늬 배경(CSS) — s = 무늬 한 칸 크기(px). 추천 색이 어두우면 밝은 바탕 위 색 줄, 밝으면 색 바탕 위 어두운 줄 */
function patternBg(p: Pattern, hex: string, s: number, lineHex?: string | null) {
  const dark = luminance(hex) < 0.45;
  const paper = "#F2EDE3";
  switch (p) {
    case "stripe": {
      const [base, line] = lineHex ? [hex, lineHex] : dark ? [paper, hex] : [hex, "#2A2622"];
      return `repeating-linear-gradient(0deg, ${base} 0 ${s * 0.6}px, ${line} ${s * 0.6}px ${s}px)`;
    }
    case "gingham": {
      const [base, line] = lineHex ? [hex, lineHex] : dark ? [paper, hex] : ["#FFFFFF", shade(hex, 0.75)];
      const l = `color-mix(in srgb, ${line} 45%, transparent)`;
      return `repeating-linear-gradient(0deg, ${l} 0 ${s / 2}px, transparent ${s / 2}px ${s}px), repeating-linear-gradient(90deg, ${l} 0 ${s / 2}px, transparent ${s / 2}px ${s}px), ${base}`;
    }
    case "check": {
      const line = lineHex ?? (dark ? "rgba(242,237,227,.55)" : shade(hex, 0.45));
      const t = s * 2;
      return `repeating-linear-gradient(0deg, transparent 0 ${t - 1.5}px, ${line} ${t - 1.5}px ${t}px), repeating-linear-gradient(90deg, transparent 0 ${t - 1.5}px, ${line} ${t - 1.5}px ${t}px), ${hex}`;
    }
    case "dot": {
      const dotc = lineHex ?? (dark ? paper : "#2A2622");
      const r = s * 0.18;
      return `radial-gradient(circle, ${dotc} 0 ${r}px, transparent ${r + 0.6}px) 0 0/${s}px ${s}px, radial-gradient(circle, ${dotc} 0 ${r}px, transparent ${r + 0.6}px) ${s / 2}px ${s / 2}px/${s}px ${s}px, ${hex}`;
    }
  }
}

/** 사진 원래 비율(가로/세로) */
export function garmentAspect(kind: Kind) {
  const [w, h] = GARMENT_SIZES[kind];
  return w / h;
}

/** 옷 사진 한 장(색·무늬 입힘). width·height 안에 비율을 지켜 가운데 맞춘다 */
export function GarmentPhoto({ kind, hex, pattern, lineHex, width, height, style }: {
  kind: Kind; hex: string; pattern?: Pattern | null; lineHex?: string | null; width: number; height: number; style?: React.CSSProperties;
}) {
  const a = garmentAspect(kind);
  const w = Math.min(width, height * a);
  const h = w / a;
  const src = `/garments/photo/${kind}.webp`;
  const mask: React.CSSProperties = {
    WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
    WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
  };
  const layer: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" };
  // 무늬 한 칸 = 옷 폭의 약 7%
  const bg = pattern ? patternBg(pattern, hex, Math.max(5, w * 0.07), lineHex) : hex;
  const veryDark = !pattern && luminance(hex) < 0.2;
  return (
    <span aria-hidden style={{ position: "relative", display: "block", width: w, height: h, ...style }}>
      <span style={{ ...layer, background: bg, ...mask }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" style={{ ...layer, mixBlendMode: "multiply" }} />
      {/* 아주 어두운 색(블랙·네이비)은 주름이 묻히므로 옷 안에서만 살짝 밝힌다 */}
      {veryDark && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" style={{ ...layer, mixBlendMode: "screen", opacity: 0.16, ...mask }} />
      )}
    </span>
  );
}

/** 아이템 카드용 — 정사각형 칸 안에 옷 사진 */
export default function GarmentArt({ category, text, hex, lineHex, size = 72 }: { category: string; text: string; hex: string; lineHex?: string | null; size?: number }) {
  const kind = garmentKind(category, text);
  return (
    <span aria-hidden style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <GarmentPhoto kind={kind} hex={hex} pattern={garmentPattern(text)} lineHex={lineHex} width={size * 0.92} height={size * 0.92} />
    </span>
  );
}
