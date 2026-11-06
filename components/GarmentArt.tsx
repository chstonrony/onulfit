import { useId } from "react";

/* 옷 그림 — 색 블록 대신, 아이템 종류(니트·슬랙스·코트·부츠·머플러…)를 그 색으로 그린다.
   사진을 가져올 수 없을 때도 "어떤 옷인지" 바로 떠오르게 하려는 것.
   종류는 아이템 이름·검색어에서 찾고, 못 찾으면 카테고리 기본 모양을 쓴다. */

type Kind =
  | "knit" | "turtleneck" | "cardigan" | "vest" | "shirt" | "tee" | "sleeveless"
  | "pants" | "wide" | "jeans" | "skirt" | "miniskirt" | "dress"
  | "coat" | "trench" | "jacket" | "padding"
  | "boot" | "longboot" | "heel" | "loafer" | "sneaker" | "sandal"
  | "scarf" | "bag" | "earring" | "necklace" | "belt" | "hat";

/* 카테고리별 규칙(위에서부터 먼저 맞는 것) — "부츠컷 데님"이 신발로 잡히지 않게 카테고리 안에서 먼저 찾는다 */
const RULES: Record<string, [RegExp, Kind][]> = {
  top: [
    [/원피스|드레스/, "dress"],
    [/터틀넥|폴라|하이넥/, "turtleneck"],
    [/가디건/, "cardigan"],
    [/베스트|조끼/, "vest"],
    [/(?<!티)셔츠|블라우스|남방/, "shirt"],
    [/슬리브리스|민소매|나시|캐미|뷔스티에/, "sleeveless"],
    [/니트|스웨터|맨투맨|후드|풀오버/, "knit"],
    [/티셔츠|반팔|크롭|탑|티$/, "tee"],
  ],
  bottom: [
    [/원피스|드레스/, "dress"],
    [/미니/, "miniskirt"],
    [/스커트|치마/, "skirt"],
    [/데님|청바지|진$|진\s/, "jeans"],
    [/와이드|부츠컷|플레어|배기/, "wide"],
    [/슬랙스|팬츠|바지|조거|레깅스/, "pants"],
  ],
  outer: [
    [/패딩|다운|푸퍼/, "padding"],
    [/트렌치/, "trench"],
    [/가디건/, "cardigan"],
    [/베스트|조끼/, "vest"],
    [/재킷|자켓|블레이저|점퍼|트위드|라이더/, "jacket"],
    [/코트|무스탕|케이프/, "coat"],
  ],
  shoes: [
    [/롱부츠|니하이|하이부츠/, "longboot"],
    [/부츠|워커|첼시/, "boot"],
    [/샌들|슬리퍼|쪼리/, "sandal"],
    [/스니커|운동화/, "sneaker"],
    [/힐|펌프스|슬링백|뮬|구두/, "heel"],
    [/로퍼|플랫|메리제인|단화|모카신|더비|발레/, "loafer"],
  ],
  accessory: [
    [/머플러|스카프|목도리|숄(?!더)/, "scarf"],
    [/귀걸이|이어링/, "earring"],
    [/목걸이|네크리스|펜던트|초커/, "necklace"],
    [/벨트/, "belt"],
    [/모자|베레|비니|버킷|캡|햇/, "hat"],
    [/가방|백|토트|숄더|크로스|클러치|파우치/, "bag"],
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

/* 색 계산 — 선은 같은 색을 어둡게, 아주 어두운 색(블랙 등)은 밝게 */
function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(hex: string, to: [number, number, number], t: number) {
  const [r, g, b] = rgb(hex);
  const m = (a: number, c: number) => Math.round(a + (c - a) * t);
  return `rgb(${m(r, to[0])},${m(g, to[1])},${m(b, to[2])})`;
}
function luminance(hex: string) {
  const [r, g, b] = rgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/* 모양(viewBox 0 0 100 100). body = 채우는 몸통, lines = 디테일 선, dots = 단추 */
interface Shape { body: string[]; lines?: string[]; dots?: [number, number][] }

const KNIT_BODY = "M30 18 Q40 14 50 21 Q60 14 70 18 L87 30 L93 72 L81 74 L76 44 L76 88 L24 88 L24 44 L19 74 L7 72 L13 30 Z";
const RIB = ["M24 82 L76 82", "M30 82 L30 88", "M38 82 L38 88", "M46 82 L46 88", "M54 82 L54 88", "M62 82 L62 88", "M70 82 L70 88", "M8 67 L20 69", "M80 69 L92 67"];
const COAT_BODY = "M31 10 Q50 17 69 10 L86 22 L92 76 L82 78 L78 42 L78 95 L22 95 L22 42 L18 78 L8 76 L14 22 Z";

const SHAPES: Record<Kind, Shape> = {
  knit: { body: [KNIT_BODY], lines: ["M40 17 Q50 27 60 17", ...RIB, "M38 36 Q42 50 38 64", "M62 36 Q58 50 62 64"] },
  turtleneck: { body: [KNIT_BODY, "M40 8 L60 8 L61 21 Q50 25 39 21 Z"], lines: [...RIB, "M44 9 L44 21", "M50 9 L50 22", "M56 9 L56 21"] },
  cardigan: { body: [KNIT_BODY], lines: ["M40 17 L50 40 L60 17", "M50 40 L50 88", ...RIB], dots: [[53, 48], [53, 60], [53, 72]] },
  vest: { body: ["M34 14 L44 14 L50 40 L56 14 L66 14 Q66 30 76 38 L76 88 L24 88 L24 38 Q34 30 34 14 Z"], lines: [...RIB.slice(0, 7)] },
  shirt: { body: [KNIT_BODY], lines: ["M40 16 L46 26 L50 21 L54 26 L60 16", "M50 24 L50 88", "M8 66 L20 68", "M80 68 L92 66"], dots: [[50, 36], [50, 50], [50, 64], [50, 78]] },
  tee: { body: ["M33 16 Q50 25 67 16 L86 27 L80 42 L72 38 L72 88 L28 88 L28 38 L20 42 L14 27 Z"], lines: ["M38 17 Q50 28 62 17"] },
  sleeveless: { body: ["M37 12 Q50 27 63 12 L68 13 Q66 32 74 40 L74 88 L26 88 L26 40 Q34 32 32 13 Z"], lines: ["M26 82 L74 82"] },

  pants: { body: ["M28 8 L72 8 L76 94 L56 94 L50 34 L44 94 L24 94 Z"], lines: ["M28 15 L72 15", "M36 20 L35 94", "M64 20 L65 94", "M50 15 L50 30"] },
  wide: { body: ["M30 8 L70 8 L84 94 L54 94 L50 34 L46 94 L16 94 Z"], lines: ["M30 15 L70 15", "M38 20 L31 94", "M62 20 L69 94"] },
  jeans: { body: ["M28 8 L72 8 L77 94 L56 94 L50 34 L44 94 L23 94 Z"], lines: ["M28 15 L72 15", "M30 22 Q38 26 42 18", "M70 22 Q62 26 58 18", "M50 15 L50 32", "M25 88 L44 88", "M56 88 L76 88"] },
  skirt: { body: ["M34 8 L66 8 L84 88 Q50 96 16 88 Z"], lines: ["M34 15 L66 15", "M42 15 L36 91", "M50 15 L50 93", "M58 15 L64 91"] },
  miniskirt: { body: ["M30 22 L70 22 L80 70 Q50 77 20 70 Z"], lines: ["M30 29 L70 29", "M40 29 L35 72", "M50 29 L50 74", "M60 29 L65 72"] },
  dress: { body: ["M37 6 L44 6 Q50 14 56 6 L63 6 L64 22 Q60 32 62 38 L84 93 Q50 99 16 93 L38 38 Q40 32 36 22 Z"], lines: ["M38 38 L62 38", "M44 40 L36 94", "M56 40 L64 94"] },

  coat: { body: [COAT_BODY], lines: ["M40 12 L50 42 L60 12", "M50 42 L50 95", "M30 64 L40 64", "M60 64 L70 64"], dots: [[45, 52], [55, 52], [45, 68], [55, 68]] },
  trench: { body: [COAT_BODY], lines: ["M40 12 L50 40 L60 12", "M50 40 L50 95", "M22 54 L78 54", "M22 60 L78 60"], dots: [[45, 46], [55, 46], [45, 70], [55, 70]] },
  jacket: { body: ["M31 10 Q50 17 69 10 L86 22 L92 74 L82 76 L78 42 L78 80 L22 80 L22 42 L18 76 L8 74 L14 22 Z"], lines: ["M40 12 L44 26 L40 30 L50 48 L60 30 L56 26 L60 12", "M50 48 L50 80", "M28 64 L38 64", "M62 64 L72 64"], dots: [[53, 58], [53, 70]] },
  padding: { body: ["M30 14 Q50 22 70 14 L88 26 Q95 50 91 72 L80 74 L78 44 L78 82 Q50 88 22 82 L22 44 L20 74 L9 72 Q5 50 12 26 Z", "M38 6 L62 6 L64 18 Q50 24 36 18 Z"], lines: ["M22 34 Q50 40 78 34", "M22 48 Q50 54 78 48", "M22 62 Q50 68 78 62", "M50 20 L50 84", "M12 44 L20 46", "M80 46 L88 44", "M10 58 L20 60", "M80 60 L90 58"] },

  boot: { body: ["M32 18 L54 18 L55 60 Q60 67 76 69 Q90 72 90 82 L90 86 L30 86 L28 80 Q30 60 32 18 Z", "M28 86 L42 86 L41 94 L29 94 Z"], lines: ["M32 24 L54 24", "M30 80 L90 80"] },
  longboot: { body: ["M33 4 L55 4 L55 62 Q60 68 76 70 Q90 73 90 82 L90 86 L30 86 L28 80 Q31 50 33 4 Z", "M28 86 L42 86 L41 94 L29 94 Z"], lines: ["M33 10 L55 10", "M30 80 L90 80", "M48 14 L48 56"] },
  heel: { body: ["M8 70 Q12 62 26 62 Q42 64 56 74 L78 60 Q88 56 92 63 L92 68 L86 70 L84 92 L80 92 L79 72 L60 82 Q38 86 14 80 Q8 78 8 70 Z"], lines: ["M14 78 Q34 82 58 80"] },
  loafer: { body: ["M8 72 Q10 58 30 58 L58 60 Q80 62 90 73 Q93 82 84 84 L14 84 Q8 82 8 72 Z"], lines: ["M10 78 L90 78", "M36 60 Q46 68 58 61", "M40 66 L54 66"] },
  sneaker: { body: ["M8 74 Q8 56 24 54 L44 52 Q60 62 78 66 Q93 70 92 80 L92 84 L10 84 Q8 82 8 74 Z"], lines: ["M9 77 L92 77", "M44 56 L50 66", "M50 55 L56 66", "M56 58 L62 68", "M18 56 L22 72"] },
  sandal: { body: ["M8 80 Q10 74 24 74 L84 72 Q93 73 92 80 Q90 86 80 86 L16 86 Q8 86 8 80 Z", "M30 74 Q44 56 60 73 L54 74 Q44 64 36 74 Z", "M62 73 Q72 60 80 72 L75 72 Q71 66 67 73 Z"], lines: [] },

  scarf: { body: ["M24 12 Q50 30 76 12 L76 24 Q64 32 62 36 L62 86 L46 86 L46 36 Q38 32 24 24 Z", "M48 30 L64 30 L72 80 L56 82 Z"], lines: ["M47 86 L47 93", "M51 86 L51 93", "M55 86 L55 93", "M59 86 L59 93", "M58 82 L57 90", "M63 81 L63 89", "M68 81 L69 88", "M46 50 L62 50", "M46 64 L62 64"] },
  bag: { body: ["M18 42 L82 42 L86 90 L14 90 Z"], lines: ["M34 42 Q34 12 50 12 Q66 12 66 42", "M18 54 L82 54", "M46 54 L46 62 L54 62 L54 54"] },
  earring: { body: ["M26 46 Q16 66 26 80 Q36 66 26 46 Z", "M74 46 Q64 66 74 80 Q84 66 74 46 Z"], lines: ["M26 26 L26 46", "M74 26 L74 46"], dots: [[26, 24], [74, 24]] },
  necklace: { body: ["M50 62 Q42 72 50 84 Q58 72 50 62 Z"], lines: ["M14 16 Q20 60 50 62 Q80 60 86 16"] },
  belt: { body: ["M6 42 L94 42 L94 58 L6 58 Z", "M30 36 L48 36 L48 64 L30 64 Z"], lines: ["M35 41 L43 41 L43 59 L35 59 Z", "M39 50 L56 50", "M64 50 L66 50", "M74 50 L76 50", "M84 50 L86 50"] },
  hat: { body: ["M30 56 Q30 24 50 24 Q70 24 70 56 Z", "M12 60 Q50 48 88 60 Q50 72 12 60 Z"], lines: ["M30 50 Q50 46 70 50"] },
};

/* 디자이너 도식화(스케치) 스타일
   · 잉크 펜 선: 살짝 떨리고(feDisplacementMap) 두 번 겹쳐 그은 손그림 선
   · 수채 채색: 선에서 살짝 어긋나고 번진 색, 가장자리에 물감이 고인 듯 진하게
   · 연필 해칭: 오른쪽 아래로만 얇은 빗금 그림자 */
const INK = "#2A2521";

export default function GarmentArt({ category, text, hex, size = 72 }: { category: string; text: string; hex: string; size?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const kind = garmentKind(category, text);
  const s = SHAPES[kind];
  const lum = luminance(hex);
  // 아주 어두운 색은 먹물 느낌의 회색으로, 아주 밝은 색은 종이와 구분되게 한 톤 내려 칠한다
  const wash = lum < 0.18 ? mix(hex, [255, 255, 255], 0.18) : lum > 0.9 ? mix(hex, [120, 105, 90], 0.1) : hex;
  const pool = mix(wash, [0, 0, 0], 0.25);
  const id = (n: string) => `ga${uid}${kind}${hex.replace(/[^a-zA-Z0-9]/g, "")}${n}`; // 한 화면에 여러 개여도 겹치지 않게
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden style={{ display: "block", overflow: "visible" }}>
      <defs>
        <filter id={id("r")} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={id("w")} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.45" />
        </filter>
        <pattern id={id("h")} width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
          <line x1="0" y1="0" x2="0" y2="2.6" stroke={INK} strokeWidth="0.45" />
        </pattern>
        <linearGradient id={id("g")} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.5" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <mask id={id("m")}>
          <rect x="0" y="0" width="100" height="100" fill={`url(#${id("g")})`} />
        </mask>
        <clipPath id={id("c")}>
          {s.body.map((d, i) => <path key={i} d={d} />)}
        </clipPath>
      </defs>

      {/* 수채 채색 — 선에서 살짝 어긋나게 */}
      <g transform="translate(2.2 1.8)" filter={`url(#${id("w")})`}>
        {s.body.map((d, i) => (
          <path key={i} d={d} fill={wash} fillOpacity="0.74" stroke={pool} strokeOpacity="0.35" strokeWidth="2.2" strokeLinejoin="round" />
        ))}
      </g>

      {/* 연필 해칭 그림자 */}
      <g clipPath={`url(#${id("c")})`} mask={`url(#${id("m")})`} opacity="0.32">
        <rect x="0" y="0" width="100" height="100" fill={`url(#${id("h")})`} />
      </g>

      {/* 잉크 선 — 한 번 더 겹쳐 그은 듯 */}
      <g filter={`url(#${id("r")})`} fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
        {s.body.map((d, i) => <path key={i} d={d} strokeWidth="1" />)}
        <g transform="translate(0.8 -0.6)" opacity="0.35">
          {s.body.map((d, i) => <path key={i} d={d} strokeWidth="0.6" />)}
        </g>
        {s.lines?.map((d, i) => <path key={i} d={d} strokeWidth="0.75" opacity="0.85" />)}
        {s.dots?.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.4" strokeWidth="0.7" />)}
      </g>
    </svg>
  );
}
