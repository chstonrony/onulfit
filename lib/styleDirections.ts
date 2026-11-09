/* ── 코디 방향 라이브러리 (2026-11-09 다시 짬) ──
   AI에게 그냥 "코디해 줘"라고 하면 늘 가장 무난한 답으로 모인다. 그래서 매번 스타일 방향 하나와
   상의·하의·아우터·신발·액세서리를 정해서 함께 건넨다.

   2026-11-09 사용자 피드백: "코트 + 라벤더 보트넥 니트 + 로즈 체크 플리츠 + 핑크 로퍼 + 하늘색 스카프"가 나와서
   "스타일리시하지도, 노멀하지도 않다. 핀터레스트·29CM 감성을 해 달라고 했는데 왜 이런 게 나오냐".
   원인 세 가지를 고쳤다.
   1) 예전 방향이 프렌치 시크·클래식 프레피(체크 플리츠)·소프트 페미닌(리본·펄)·콰이어트 럭셔리·레이디 트위드처럼
      화보·교복·마담 쪽이었다 → 핀터레스트 OOTD·29CM 룩북에 실제로 나오는 스트릿 데일리 방향으로 바꿈
   2) 상의·신발·액세서리를 방향과 상관없이 따로 뽑아서 서로 안 어울리는 것끼리 붙었다
      → 방향마다 그 방향에 맞는 상의·하의·아우터·신발·액세서리 후보를 따로 둔다
   3) 퍼스널컬러가 있으면 "모든 아이템을 베스트 컬러로" 칠해서 파스텔 5색이 됐다
      → 바탕은 그 사람에게 맞는 무채색·데님, 베스트 컬러는 포인트 한 곳에만

   기준(사용자 레퍼런스, 2026-11-08): 루즈한 중청·연청 데님(바닥에 살짝 끌리는 길이), 단순한 상의 하나,
   슬림한 로퍼·스웨이드 스니커즈, 브라운 가죽 숄더백·블랙 크로스백, 무채색+청색, 아이템 적은 꾸안꾸.
   아이템 이름은 옷 사진(GarmentArt)이 알아보는 말로 쓴다. */

import type { Season } from "./lookRecipes";
import type { BodyType, ColorType } from "./profile";
import { getColorHex } from "./colors";

/** 자리 — C 일상 · S 단정 · F 격식 · D 데이트 · P 특별한 저녁 · A 야외 · M 조문 */
export type Occ = "C" | "S" | "F" | "D" | "P" | "A" | "M";

type Cat = "top" | "bottom" | "outer" | "shoes" | "accessory";
/** not: 이 계절엔 안 씀 · nob: 이 골격엔 안 씀 */
type Pick = { name: string; not?: Season[]; nob?: BodyType[] };

export interface StyleDirection {
  key: string;
  name: string;
  vibe: string;
  occ: Occ[];
  top: Pick[];
  bottom: Pick[];
  outer: Pick[];
  shoes: Pick[];
  accessory: Pick[];
  /** 퍼스널컬러가 없을 때 쓰는 색: 바탕 색들 + 포인트 하나(없으면 무채색만) */
  palettes: { base: string[]; point?: string }[];
  /** 인플루언서식 스타일링 디테일 후보 */
  cues: string[];
}

const p = (name: string, o: Omit<Pick, "name"> = {}): Pick => ({ name, ...o });
const S: Season[] = ["summer"];
const W: Season[] = ["winter"];
const SW: Season[] = ["summer", "winter"];
const COLD: Season[] = ["summer", "spring"]; // 패딩·롱부츠처럼 추울 때만

/* 골격별로 빠지는 것 (styleGuide의 피할 것) */
const WIDE = { nob: ["straight"] as BodyType[] };            // 통 넓은 하의 — 스트레이트는 부피가 늘어 보임
const OVER = { nob: ["straight", "wave"] as BodyType[] };    // 오버핏·박시 상의
const CROP = { nob: ["straight", "natural"] as BodyType[] }; // 크롭 기장

export const DIRECTIONS: StyleDirection[] = [
  {
    key: "denim-daily", name: "데님 데일리", vibe: "루즈한 데님에 단순한 상의 하나, 힘 뺀 듯 정돈된 핀터레스트 OOTD",
    occ: ["C", "A", "D"],
    top: [p("케이블 니트", { not: S, nob: ["straight"] }), p("크루넥 니트", { not: S }), p("오버핏 셔츠", OVER), p("스트라이프 셔츠"), p("베이직 티셔츠", { not: W }), p("브이넥 니트", { not: S })],
    bottom: [p("와이드 데님", WIDE), p("스트레이트 데님", { nob: ["wave"] }), p("부츠컷 데님")],
    outer: [p("울 코트", { not: S }), p("레더 자켓", { not: S }), p("숏 패딩", { not: COLD }), p("크롭 가디건", { not: W, ...CROP }), p("트렌치 코트", { not: SW })],
    shoes: [p("슬림 로퍼"), p("스웨이드 스니커즈"), p("발레 플랫", { not: W }), p("레더 스니커즈")],
    accessory: [p("가죽 숄더백"), p("크로스백"), p("볼캡"), p("실버 레이어드 목걸이")],
    palettes: [
      { base: ["블랙", "화이트", "중청 데님"], point: "브라운" },
      { base: ["크림", "그레이", "연청 데님"], point: "블랙" },
      { base: ["네이비", "화이트", "중청 데님"] },
    ],
    cues: ["상의 앞자락만 살짝 넣어 입기", "니트 아래로 흰 티를 살짝 보이게 레이어드", "데님은 신발을 덮을 만큼 길게, 바닥에 살짝 끌리는 기장", "셔츠 소매를 한두 번 걷기"],
  },
  {
    key: "street", name: "꾸안꾸 스트릿", vibe: "맨투맨·볼캡·스니커즈로 편하게, 그런데 대충은 아닌 서울 스트릿 룩",
    occ: ["C", "A"],
    top: [p("맨투맨", OVER), p("그래픽 티셔츠", { not: W }), p("크롭 니트", { not: S, ...CROP }), p("오버핏 셔츠", OVER), p("크루넥 니트", { not: S })],
    bottom: [p("와이드 데님", WIDE), p("카고 팬츠", { nob: ["straight", "wave"] }), p("데님 스커트"), p("부츠컷 데님")],
    outer: [p("바시티 재킷", { not: S }), p("숏 패딩", { not: COLD }), p("데님 재킷", { not: W }), p("후드 집업", { not: SW, ...OVER }), p("나일론 바람막이", { not: W })],
    shoes: [p("스니커즈"), p("스웨이드 스니커즈"), p("어글리 스니커즈")],
    accessory: [p("볼캡"), p("비니", { not: S }), p("크로스백"), p("실버 체인 목걸이")],
    palettes: [
      { base: ["멜란지 그레이", "블랙", "중청 데님"], point: "화이트" },
      { base: ["네이비", "화이트", "연청 데님"], point: "그레이" },
      { base: ["블랙", "그레이", "진청 데님"], point: "카키" },
    ],
    cues: ["모자 하나로 꾸민 티 내기", "실버 목걸이·반지로 캐주얼에 반짝임 하나", "흰 양말을 살짝 보이게", "크로스백 끈을 짧게 메기"],
  },
  {
    key: "neutral", name: "미니멀 뉴트럴", vibe: "그레이·크림·블랙만으로 정리한, 29CM 룩북 같은 담백한 룩",
    occ: ["C", "S", "D", "F", "P"],
    top: [p("브이넥 니트", { not: S }), p("크루넥 니트", { not: S }), p("코튼 셔츠", { nob: ["wave"] }), p("반팔 니트", { not: W }), p("터틀넥 니트", { not: S, nob: ["straight"] })],
    bottom: [p("와이드 슬랙스", WIDE), p("스트레이트 데님", { nob: ["wave"] }), p("롱 스커트"), p("부츠컷 슬랙스")],
    outer: [p("발마칸 코트", { not: S }), p("오버핏 블레이저", { not: W, nob: ["wave"] }), p("니트 가디건", { not: W }), p("울 코트", { not: S })],
    shoes: [p("슬림 로퍼"), p("발레 플랫", { not: W }), p("레더 스니커즈"), p("앵클 부츠", { not: S })],
    accessory: [p("가죽 숄더백"), p("실버 이어링"), p("미니 토트백"), p("가죽 벨트")],
    palettes: [
      { base: ["그레이", "크림", "블랙"] },
      { base: ["오트밀", "아이보리", "브라운"], point: "블랙" },
      { base: ["차콜", "화이트", "라이트 그레이"] },
    ],
    cues: ["같은 계열 색으로 위아래를 이어 길어 보이게", "벨트로 허리선 한 번 잡기", "가방·신발 색을 맞춰 정돈", "니트를 어깨에 둘러 레이어드"],
  },
  {
    key: "black-leather", name: "블랙 & 레더", vibe: "블랙 아이템에 가죽 하나, 살짝 쿨한 인스타 무드",
    occ: ["C", "D", "P"],
    top: [p("파인 게이지 니트", { not: S }), p("베이직 티셔츠", { not: W }), p("슬리브리스 니트", { not: ["winter", "autumn"] }), p("크롭 니트", { not: S, ...CROP })],
    bottom: [p("와이드 데님", WIDE), p("부츠컷 데님"), p("슬립 스커트"), p("스트레이트 데님", { nob: ["wave"] })],
    outer: [p("레더 자켓", { not: S }), p("롱 코트", { not: S }), p("오버핏 블레이저", { not: W, nob: ["wave"] })],
    shoes: [p("앵클 부츠", { not: S }), p("슬림 로퍼"), p("스트랩 샌들", { not: ["winter", "autumn"] })],
    accessory: [p("실버 체인 목걸이"), p("숄더백"), p("실버 후프 이어링"), p("가죽 벨트")],
    palettes: [
      { base: ["블랙", "화이트", "진청 데님"] },
      { base: ["블랙", "그레이", "중청 데님"], point: "실버" },
    ],
    cues: ["거친 가죽 하나에 부드러운 니트 하나로 균형", "실버 액세서리를 두세 개 겹치기", "가죽 자켓 소매를 살짝 밀어 올리기"],
  },
  {
    key: "knit-skirt", name: "니트 & 롱스커트", vibe: "포근한 니트에 롱스커트, 여자 인플루언서 데일리처럼 편하고 예쁜 룩",
    occ: ["C", "D", "F"],
    top: [p("크롭 니트", { not: S, ...CROP }), p("브이넥 가디건", { not: S }), p("케이블 니트", { not: S, nob: ["straight"] }), p("반팔 니트", { not: W }), p("크루넥 니트", { not: S })],
    bottom: [p("롱 스커트"), p("데님 롱스커트"), p("슬립 스커트")],
    outer: [p("울 코트", { not: S }), p("숏 패딩", { not: COLD }), p("크롭 가디건", { not: W, ...CROP }), p("스웨이드 재킷", { not: SW })],
    shoes: [p("롱부츠", { not: COLD }), p("발레 플랫", { not: W }), p("스웨이드 스니커즈"), p("슬림 로퍼")],
    accessory: [p("가죽 숄더백"), p("울 머플러", { not: COLD }), p("골드 후프 이어링"), p("캔버스 토트백", { not: W })],
    palettes: [
      { base: ["크림", "그레이", "블랙"] },
      { base: ["오트밀", "브라운", "아이보리"] },
      { base: ["블랙", "차콜", "화이트"], point: "브라운" },
    ],
    cues: ["니트 앞자락을 스커트에 살짝 넣어 허리선 만들기", "스커트와 신발 색을 이어 길어 보이게", "머리는 로우번이나 집게핀으로 가볍게"],
  },
  {
    key: "athleisure", name: "애슬레저 데일리", vibe: "운동복 소재를 일상복과 섞은, 걷기 편한 주말 룩",
    occ: ["A", "C"],
    top: [p("하프 집업", { not: S }), p("맨투맨", OVER), p("베이직 티셔츠", { not: W }), p("크롭 니트", { not: S, ...CROP })],
    bottom: [p("와이드 트랙 팬츠", WIDE), p("와이드 데님", WIDE), p("부츠컷 데님"), p("플리츠 스커트", { nob: ["straight"] })],
    outer: [p("숏 패딩", { not: COLD }), p("패딩 베스트", { not: S }), p("나일론 바람막이", { not: W }), p("후리스 재킷", { not: S })],
    shoes: [p("러닝 스니커즈"), p("스니커즈"), p("어글리 스니커즈")],
    accessory: [p("볼캡"), p("크로스백"), p("비니", { not: S }), p("나일론 숄더백")],
    palettes: [
      { base: ["그레이", "블랙", "화이트"] },
      { base: ["네이비", "크림", "연청 데님"] },
      { base: ["블랙", "화이트", "중청 데님"], point: "카키" },
    ],
    cues: ["운동복 하나에 데님이나 스커트처럼 일상복 하나 섞기", "작은 크로스백으로 손을 가볍게", "볼캡 아래로 로우 포니테일"],
  },
  {
    key: "smart-casual", name: "스마트 캐주얼", vibe: "셔츠·블레이저를 데님이나 슬랙스와 편하게 섞은, 딱딱하지 않은 단정한 룩",
    occ: ["S", "F", "C"],
    top: [p("코튼 셔츠", { nob: ["wave"] }), p("스트라이프 셔츠"), p("브이넥 니트", { not: S }), p("크루넥 니트", { not: S }), p("반팔 니트", { not: W })],
    bottom: [p("와이드 슬랙스", WIDE), p("스트레이트 슬랙스"), p("스트레이트 데님", { nob: ["wave"] }), p("롱 스커트")],
    outer: [p("오버핏 블레이저", { not: W, nob: ["wave"] }), p("발마칸 코트", { not: S }), p("트렌치 코트", { not: SW }), p("니트 가디건", { not: W })],
    shoes: [p("슬림 로퍼"), p("발레 플랫", { not: W }), p("레더 스니커즈"), p("앵클 부츠", { not: S })],
    accessory: [p("가죽 숄더백"), p("미니 토트백"), p("실버 이어링"), p("가죽 벨트")],
    palettes: [
      { base: ["네이비", "화이트", "그레이"] },
      { base: ["블랙", "크림", "중청 데님"] },
      { base: ["차콜", "라이트 블루", "화이트"] },
    ],
    cues: ["블레이저는 단추를 풀고 소매를 살짝 걷기", "셔츠 깃을 니트 위로 꺼내기", "정장처럼 위아래 맞추지 말고 데님·니트로 풀기"],
  },
  {
    key: "evening", name: "모던 이브닝", vibe: "블랙 베이스에 은은한 광택 하나, 저녁 약속에 맞게 한 단계 힘준 룩",
    occ: ["P", "D", "F"],
    top: [p("파인 게이지 니트", { not: S }), p("새틴 셔츠"), p("슬리브리스 니트", { not: ["winter", "autumn"] }), p("오프숄더 니트", { not: S })],
    bottom: [p("슬립 스커트"), p("와이드 슬랙스", WIDE), p("부츠컷 데님"), p("롱 스커트")],
    outer: [p("롱 코트", { not: S }), p("레더 자켓", { not: S }), p("오버핏 블레이저", { not: W, nob: ["wave"] })],
    shoes: [p("앵클 부츠", { not: S }), p("스트랩 힐"), p("슬링백")],
    accessory: [p("실버 드롭 이어링"), p("미니 숄더백"), p("실버 체인 목걸이")],
    palettes: [
      { base: ["블랙", "차콜", "실버"] },
      { base: ["블랙", "아이보리", "진청 데님"], point: "와인" },
    ],
    cues: ["광택 소재는 딱 하나만", "귀걸이로 얼굴 가까이에 빛을", "블랙끼리도 소재를 다르게(니트·새틴·가죽)"],
  },
];

/* ── 퍼스널컬러별 색 계획 ──
   바탕(아우터·하의·신발·가방)은 그 사람에게 어울리는 무채색·데님·뉴트럴로,
   베스트 컬러는 얼굴 가까운 곳 한 군데에만 포인트로. (모두 베스트 컬러로 칠하면 파스텔 무지개가 됨) */
export const COLOR_PLAN: Record<ColorType, { base: string[]; points: string[]; small: string[]; note: string }> = {
  spring: {
    base: ["아이보리", "크림", "웜베이지", "카멜", "라이트 브라운", "연청 데님", "중청 데님"],
    points: ["코랄", "피치", "버터 옐로우", "애플 그린", "터콰이즈"],
    small: ["카멜", "라이트 브라운", "아이보리", "탄"],
    note: "블랙·차콜 대신 브라운·카멜로 바탕을 잡기",
  },
  summer: {
    base: ["소프트 그레이", "멜란지 그레이", "오프화이트", "네이비", "연청 데님", "중청 데님", "그레이시 베이지"],
    points: ["라벤더", "스카이 블루", "로즈", "베이비 핑크", "민트"],
    small: ["블랙", "그레이", "화이트", "네이비"],
    note: "브라운·카멜 대신 그레이·네이비로 바탕을 잡기, 블랙은 신발·가방 같은 작은 아이템에만",
  },
  autumn: {
    base: ["크림", "브라운", "카멜", "카키", "올리브", "오트밀", "진청 데님", "중청 데님"],
    points: ["테라코타", "머스타드", "딥 그린", "와인"],
    small: ["브라운", "다크 브라운", "카멜", "블랙"],
    note: "차가운 그레이·퓨어 화이트 대신 크림·브라운으로 바탕을 잡기, 블랙은 신발·가방 같은 작은 아이템에만",
  },
  winter: {
    base: ["블랙", "퓨어 화이트", "차콜", "그레이", "네이비", "진청 데님"],
    points: ["버건디", "로열 블루", "에메랄드", "아이시 핑크"],
    small: ["블랙", "화이트", "실버 그레이"],
    note: "베이지·카멜 대신 블랙·화이트·그레이로 또렷하게",
  },
};

/* 포인트 색을 줄 자리 — 얼굴 가까운 상의가 가장 효과가 크다.
   가방·모자·머플러일 때만 액세서리에 (스카이 블루 가죽 자켓·핑크 벨트처럼 어색한 조합 방지) */
function pointSlot(items: Record<Cat, string>): Cat {
  const accOk = /백|캡|비니|머플러/.test(items.accessory);
  return accOk && Math.random() < 0.3 ? "accessory" : "top";
}

/* 스타일링 디테일이 고른 아이템과 맞을 때만 (니트를 골랐는데 "셔츠 소매 걷기"가 나오지 않게) */
const CUE_NEEDS: [string, RegExp][] = [
  ["셔츠", /셔츠/], ["니트", /니트|가디건/], ["블레이저", /블레이저/], ["가죽", /레더|가죽/],
  ["귀걸이", /이어링/], ["모자", /캡|비니/], ["볼캡", /캡/], ["크로스백", /크로스백/], ["스커트", /스커트/], ["데님", /데님/],
  ["운동복", /트랙|집업|바람막이|러닝|후리스|패딩 베스트/], ["벨트", /./], ["가방", /백/], ["실버", /./],
];
function cueFits(cue: string, items: Record<Cat, string>): boolean {
  const all = Object.values(items).join(" ");
  return CUE_NEEDS.every(([kw, re]) => !cue.includes(kw) || re.test(all));
}

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
/** 계절·골격에 맞는 것 중 하나 (방금 추천한 품목은 되도록 피함) */
function pickFor(list: Pick[], season: Season, body?: BodyType, avoid: string[] = []): string {
  const ok = list.filter((x) => !(x.not ?? []).includes(season) && !(body && (x.nob ?? []).includes(body)));
  const fresh = ok.filter((x) => !avoid.some((r) => r.includes(x.name) || x.name.includes(r)));
  return pick(fresh.length ? fresh : ok.length ? ok : list).name;
}

/* ── 아이템마다 색을 정해 준다 (2026-11-09) ──
   바탕 색 목록만 주고 AI에게 나누게 했더니 "올리브 코트 + 카키 바지", "네이비 코트 + 네이비 바지"처럼
   아우터와 하의가 같은(비슷한) 색으로 뭉쳐 한 덩어리로 보였다.
   → 아이템마다 색을 하나씩 정하고, 아우터는 하의와 밝기가 확실히 다른 색으로, 상의는 아우터와 다른 색으로 고른다. */
const lum = (name: string) => {
  const h = getColorHex(name).replace("#", "");
  const [r, g, b] = [0, 2, 4].map((k) => parseInt(h.slice(k, k + 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};
/** cands 중 used와 겹치지 않고 기준 색과 밝기 차이가 gap 이상인 것 (없으면 차이가 가장 큰 것) */
function contrastPick(cands: string[], ref: string | null, gap: number, used: string[]): string {
  const free = cands.filter((c) => !used.includes(c));
  const pool = free.length ? free : cands;
  if (!ref) return pick(pool);
  const far = pool.filter((c) => Math.abs(lum(c) - lum(ref)) >= gap);
  if (far.length) return pick(far);
  return [...pool].sort((a, b) => Math.abs(lum(b) - lum(ref)) - Math.abs(lum(a) - lum(ref)))[0];
}
const GENERAL_SOLIDS = ["블랙", "화이트", "그레이", "크림", "네이비", "브라운", "차콜", "오트밀"];

export interface StyleBrief {
  direction: StyleDirection;
  items: Record<Cat, string>;
  /** 아이템마다 정한 색 */
  colors: Record<Cat, string>;
  /** 포인트 색이 들어간 자리 (없으면 무채색만) */
  pointCat?: Cat;
  cue: string;
  colorNote?: string;
}

function colorize(items: Record<Cat, string>, solids: string[], denims: string[], point: string | undefined, small: string[], metal: string): { colors: Record<Cat, string>; pointCat?: Cat } {
  const isDenim = /데님|청/.test(items.bottom);
  // 아우터: 새하얀 코트는 빼고, 가죽은 어두운 색만 (오트밀 레더 자켓 같은 어색한 조합 방지)
  let outerCands = solids.filter((c) => !/^(퓨어 )?화이트$|^오프화이트$/.test(c));
  const leather = /레더|가죽/.test(items.outer);
  if (leather) {
    const dark = outerCands.filter((c) => lum(c) < 0.45);
    outerCands = dark.length ? dark : metal === "골드" ? ["다크 브라운", "브라운"] : ["블랙"];
  }
  if (!outerCands.length) outerCands = solids;
  // 가죽처럼 아우터 색이 좁게 정해지면 아우터를 먼저, 아니면 하의를 먼저 정하고 다른 쪽을 밝기 차이로 고른다
  let bottom: string, outer: string;
  if (leather) {
    outer = pick(outerCands);
    bottom = isDenim ? pick(denims) : contrastPick(solids, outer, 0.3, [outer]);
  } else {
    bottom = isDenim ? pick(denims) : pick(solids);
    outer = contrastPick(outerCands, isDenim ? null : bottom, 0.3, [bottom]);
  }
  const pointCat = point ? pointSlot(items) : undefined;
  let top = pointCat === "top" ? point! : contrastPick(solids, outer, 0.2, [outer, bottom]);
  if (top === outer) top = contrastPick(solids, outer, 0.2, [outer, bottom]); // 포인트가 무채색이라 아우터와 겹칠 때
  // 신발: 흰색·밝은 색은 스니커즈만 (흰 부츠·흰 로퍼 방지)
  const shoeCands = /스니커/.test(items.shoes) ? small : small.filter((c) => lum(c) < 0.7);
  const shoes = pick(shoeCands.length ? shoeCands : metal === "골드" ? ["브라운"] : ["블랙"]);
  const bag = pick(small.filter((c) => c !== shoes).length ? small.filter((c) => c !== shoes) : small);
  const isJewel = /목걸이|이어링|귀걸이|반지|뱅글/.test(items.accessory);
  const accessory = pointCat === "accessory" ? point! : isJewel ? metal : bag ?? shoes;
  return { colors: { top, bottom, outer, shoes, accessory }, pointCat };
}

export function pickStyleBrief(occ: Occ, season: Season, body?: BodyType, color?: ColorType, recent: string[] = []): StyleBrief | null {
  if (occ === "M") return null; // 조문은 정해진 단정한 검정 차림
  const pool = DIRECTIONS.filter((d) => d.occ.includes(occ));
  const direction = pick(pool.length ? pool : DIRECTIONS);
  const cats: Cat[] = ["top", "bottom", "outer", "shoes", "accessory"];
  const items = Object.fromEntries(cats.map((c) => [c, pickFor(direction[c], season, body, recent)])) as Record<Cat, string>;

  // 웜톤(봄·가을)은 골드, 쿨톤(여름·겨울)은 실버 — 주얼리 이름과 디테일 문구의 금속을 맞춘다
  const warm = color === "spring" || color === "autumn";
  const metal = (t: string) => (warm ? t.replace(/실버/g, "골드") : color ? t.replace(/골드/g, "실버") : t);
  items.accessory = metal(items.accessory);
  const fitCues = direction.cues.filter((c) => cueFits(c, items));
  const cue = metal(pick(fitCues.length ? fitCues : ["상의 앞자락만 살짝 넣어 입기"]));
  const metalName = warm ? "골드" : "실버";

  if (color) {
    const plan = COLOR_PLAN[color];
    const solids = plan.base.filter((c) => !c.includes("데님"));
    const denims = plan.base.filter((c) => c.includes("데님"));
    return { direction, items, ...colorize(items, solids, denims, pick(plan.points), plan.small, metalName), cue, colorNote: plan.note };
  }
  const pal = pick(direction.palettes);
  const palSolids = pal.base.filter((c) => !c.includes("데님") && c !== "실버");
  const solids = [...palSolids, ...GENERAL_SOLIDS.filter((c) => !palSolids.includes(c))].slice(0, Math.max(palSolids.length + 2, 4));
  const denims = pal.base.filter((c) => c.includes("데님"));
  return { direction, items, ...colorize(items, solids, denims.length ? denims : ["중청 데님"], pal.point, ["블랙", "브라운", "화이트", "블랙"], metalName), cue };
}

const CAT_KO: Record<Cat, string> = { top: "상의", bottom: "하의", outer: "아우터", shoes: "신발", accessory: "액세서리" };

/** AI에게 건넬 이번 코디 방향 (user 메시지 끝에 붙인다) */
export function briefPrompt(b: StyleBrief | null, recent: string[]): string {
  const lines: string[] = ["\n\n## 이번 코디 방향 (반드시 따를 것 — 매번 다른 코디를 위해 정해짐)"];
  lines.push("- 단, 사용자가 상황에 아이템이나 조합을 직접 적었다면(예: \"셔츠 + 일자 슬랙스 조합으로\") 그 아이템을 그대로 쓰고, 아래 방향은 색·분위기 참고로만 쓸 것");
  if (b) {
    lines.push(`- 스타일: ${b.direction.name} — ${b.direction.vibe}`);
    lines.push("- 아이템 (이 품목 그대로 쓸 것. 소재·핏 수식어만 덧붙여도 되고, 다른 품목으로 바꾸지 말 것):");
    (Object.keys(CAT_KO) as Cat[]).forEach((c) => lines.push(`  · ${CAT_KO[c]}: ${b.items[c]}`));
    lines.push("- 색 (이 색 그대로 쓸 것 — 아우터와 하의를 같은 색·비슷한 색으로 맞추지 말 것):");
    (Object.keys(CAT_KO) as Cat[]).forEach((c) => lines.push(`  · ${CAT_KO[c]}: ${b.colors[c]}${b.pointCat === c ? " (포인트)" : ""}`));
    if (b.colorNote) lines.push(`- 퍼스널컬러 메모: ${b.colorNote}. 위 '피할 색'은 어떤 아이템에도 쓰지 말 것`);
    lines.push(`- 스타일링 디테일 하나: ${b.cue} (stylingTip에 녹일 것)`);
  } else {
    lines.push("- 조문 자리: 검정·짙은 남색 무지, 광택·장식 없이 단정하게");
  }
  if (recent.length) {
    lines.push(`- 이 사용자에게 방금 추천한 아이템(같은 품목·같은 색 조합 반복 금지): ${recent.join(", ")}`);
  }
  return lines.join("\n");
}

/** AI가 색 지시를 어기고 아우터·하의(또는 상의·아우터)를 같은 톤으로 칠했으면 정해 둔 색으로 바꾼다 (데님 하의는 그대로) */
export function fixToneClash<T>(o: T, b: StyleBrief | null): T {
  const items = (o as { items?: Record<string, { color?: unknown; name?: unknown }> })?.items;
  if (!b || !items) return o;
  const col = (k: Cat) => (typeof items[k]?.color === "string" ? (items[k]!.color as string) : "");
  const close = (x: string, y: string) => !!x && !!y && (x === y || Math.abs(lum(x) - lum(y)) < 0.15);
  const next = { ...items };
  const set = (k: Cat) => { if (next[k]) next[k] = { ...next[k], color: b.colors[k] }; };
  if (!/데님|청/.test(col("bottom") + String(items.bottom?.name ?? "")) && close(col("outer"), col("bottom"))) { set("outer"); set("bottom"); }
  if (close(col("top"), String(next.outer?.color ?? ""))) set("top");
  return { ...(o as object), items: next } as T;
}
