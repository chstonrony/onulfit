/* 옷 그림 — 색 블록 대신, 아이템 종류(니트·슬랙스·코트·부츠·머플러…)를 추천 색으로 보여준다.
   그림: 잉크 워시 일러스트 29장(GPT Image 2로 한 번 만들어 public/garments/ 에 저장, 추가 비용 없음)
   · {kind}.webp      흑백 그림 — 곱하기(multiply)로 겹쳐 추천 색 위에 먹 선과 음영을 올린다
   · {kind}-mask.png  옷 영역 — 이 안에만 추천 색을 깐다
   종류는 아이템 이름·검색어에서 찾고, 못 찾으면 카테고리 기본 그림을 쓴다. */

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

/* 색 밝기 — 아주 어두운 색(블랙·네이비)은 먹 선이 묻히므로 선을 살짝 밝게 올린다 */
function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function luminance(hex: string) {
  const [r, g, b] = rgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export default function GarmentArt({ category, text, hex, size = 72 }: { category: string; text: string; hex: string; size?: number }) {
  const kind = garmentKind(category, text);
  const base = `/garments/${kind}`;
  const dark = luminance(hex) < 0.3;
  const mask: React.CSSProperties = {
    WebkitMaskImage: `url(${base}-mask.png)`, maskImage: `url(${base}-mask.png)`,
    WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
  };
  const layer: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" };
  return (
    <span aria-hidden style={{ position: "relative", display: "block", width: size, height: size }}>
      {/* 1) 옷 모양대로 추천 색 */}
      <span style={{ ...layer, backgroundColor: hex, ...mask }} />
      {/* 2) 흑백 잉크 워시를 곱하기로 — 흰 바탕은 카드 배경에 녹아 사라진다 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${base}.webp`} alt="" loading="lazy" style={{ ...layer, mixBlendMode: "multiply" }} />
      {/* 3) 어두운 색이면 선·주름을 살짝 밝게(옷 안에서만) */}
      {dark && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${base}.webp`} alt="" loading="lazy" style={{ ...layer, filter: "invert(1)", mixBlendMode: "screen", opacity: 0.32, ...mask }} />
      )}
    </span>
  );
}
