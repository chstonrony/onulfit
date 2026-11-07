/* ── 코디 방향 라이브러리 (2026-11-07) ──
   AI에게 그냥 "코디해 줘"라고 하면 늘 가장 무난한 답(아이보리 터틀넥 · 차콜 와이드 슬랙스 · 카멜 롱코트 · 로퍼)으로 모인다.
   그래서 매번 아래에서 스타일 방향 하나 · 주인공 아이템 하나 · 팔레트 하나 · 하의 형태 하나를 무작위로 골라 함께 건넨다.
   방향은 핀터레스트·패션 매거진에서 30~50대 여성에게 꾸준히 쓰이는 스타일 갈래를 우리 말로 정리한 것(이미지·문구를 가져오지 않음).
   아이템 이름은 옷 사진(GarmentArt)이 알아보는 말로 쓴다 — 트위드 자켓·메리제인·플리츠 스커트 등. */

import type { Season } from "./lookRecipes";

/** 자리 — C 일상 · S 단정 · F 격식 · D 데이트 · P 특별한 저녁 · A 야외 · M 조문 */
export type Occ = "C" | "S" | "F" | "D" | "P" | "A" | "M";

type Cat = "top" | "bottom" | "outer" | "shoes" | "accessory";
type Hero = { cat: Cat; name: string };

export interface StyleDirection {
  key: string;
  name: string;
  vibe: string;
  occ: Occ[];
  heroes: Hero[];
  palettes: string[][];
  bottoms: string[];
  cue: string;
}

const h = (cat: Cat, name: string): Hero => ({ cat, name });

export const DIRECTIONS: StyleDirection[] = [
  {
    key: "french", name: "프렌치 시크", vibe: "힘을 뺀 듯 무심하지만 선이 깔끔한 파리지앵 무드",
    occ: ["C", "D", "P", "S"],
    heroes: [h("top", "스트라이프 보트넥 티셔츠"), h("outer", "트렌치 코트"), h("shoes", "발레 플랫"), h("bottom", "스트레이트 데님"), h("accessory", "실크 스카프"), h("accessory", "베레모")],
    palettes: [["네이비", "화이트", "데님", "레드 포인트"], ["블랙", "크림", "데님", "카멜"]],
    bottoms: ["스트레이트 데님", "미디 스커트", "크롭 슬랙스"],
    cue: "한 군데만 힘주기(레드 립 색 소품 하나), 소매를 걷거나 셔츠 앞자락만 넣어 무심한 디테일",
  },
  {
    key: "quiet", name: "콰이어트 럭셔리", vibe: "로고 없이 소재와 핏으로 고급스러움을 말하는 차분한 룩",
    occ: ["S", "F", "D", "C"],
    heroes: [h("top", "실크 블라우스"), h("outer", "더블 코트"), h("shoes", "슬링백"), h("top", "캐시미어 브이넥 니트"), h("accessory", "미니멀 토트백"), h("bottom", "테일러드 슬랙스")],
    palettes: [["오트밀", "초콜릿 브라운", "크림", "골드"], ["그레이지", "네이비", "아이보리", "실버"], ["토프", "블랙", "크림", "골드"]],
    bottoms: ["테일러드 슬랙스", "롱 플리츠 스커트", "스트레이트 팬츠"],
    cue: "같은 계열 색으로 위아래를 이어 길어 보이게, 장신구는 작고 단단한 것 하나",
  },
  {
    key: "soft", name: "소프트 페미닌", vibe: "부드러운 소재와 곡선으로 다정해 보이는 룩",
    occ: ["D", "C", "F"],
    heroes: [h("top", "리본 블라우스"), h("bottom", "플리츠 스커트"), h("outer", "크롭 가디건"), h("shoes", "메리제인"), h("accessory", "진주 목걸이"), h("bottom", "슬립 스커트")],
    palettes: [["파우더 핑크", "크림", "라벤더", "펄"], ["버터 옐로우", "아이보리", "라이트 그레이", "골드"], ["더스티 로즈", "베이지", "화이트", "펄"]],
    bottoms: ["플리츠 스커트", "슬립 스커트", "A라인 스커트"],
    cue: "허리선을 살짝 드러내고, 끝단이 흔들리는 소재로 움직임을 만들기",
  },
  {
    key: "mono", name: "미니멀 모노톤", vibe: "검정·회색·흰색만으로 또렷하게 정리한 도시적인 룩",
    occ: ["S", "P", "C", "F"],
    heroes: [h("outer", "블랙 롱 코트"), h("shoes", "첼시 부츠"), h("top", "블랙 터틀넥"), h("bottom", "블랙 슬립 스커트"), h("accessory", "실버 이어링"), h("outer", "그레이 블레이저")],
    palettes: [["블랙", "차콜", "화이트", "실버"], ["그레이", "블랙", "아이보리", "실버"]],
    bottoms: ["부츠컷 슬랙스", "슬립 스커트", "와이드 데님"],
    cue: "색을 줄인 대신 소재를 섞기(니트·가죽·울), 실루엣은 하나만 크게",
  },
  {
    key: "city", name: "시티 캐주얼", vibe: "편하게 걷기 좋은데 대충 입은 것 같지 않은 주말 룩",
    occ: ["C", "A"],
    heroes: [h("top", "그레이 맨투맨"), h("outer", "바시티 재킷"), h("shoes", "스니커즈"), h("accessory", "미니 숄더백"), h("bottom", "데님 스커트"), h("outer", "크롭 가디건")],
    palettes: [["멜란지 그레이", "데님", "네이비", "화이트"], ["카키", "크림", "블랙", "데님"]],
    bottoms: ["데님 스커트", "롱 플리츠 스커트", "와이드 데님"],
    cue: "맨투맨·스니커즈 같은 캐주얼에 스커트·주얼리 같은 여성스러운 아이템을 하나 섞어 정돈",
  },
  {
    key: "preppy", name: "클래식 프레피", vibe: "단정한 학교 교복에서 온 지적이고 반듯한 룩",
    occ: ["S", "C"],
    heroes: [h("top", "카라 니트"), h("outer", "네이비 블레이저"), h("bottom", "체크 플리츠 스커트"), h("outer", "브이넥 가디건"), h("shoes", "메리제인"), h("top", "리본 블라우스")],
    palettes: [["네이비", "포레스트 그린", "크림", "버건디"], ["카멜", "네이비", "화이트", "그린"]],
    bottoms: ["체크 플리츠 스커트", "A라인 스커트", "스트레이트 데님"],
    cue: "셔츠 깃을 니트 위로 꺼내 레이어드, 양말·벨트 같은 작은 클래식 소품",
  },
  {
    key: "office", name: "모던 테일러링", vibe: "어깨선이 반듯한 재킷으로 신뢰를 주는 일하는 사람의 룩",
    occ: ["S", "F"],
    heroes: [h("outer", "테일러드 블레이저"), h("top", "실크 셔츠"), h("shoes", "포인티드 펌프스"), h("bottom", "핀스트라이프 슬랙스"), h("accessory", "구조적인 숄더백")],
    palettes: [["차콜", "스카이 블루", "화이트", "실버"], ["네이비", "아이보리", "카멜", "골드"], ["그레이", "블랙", "라이트 블루", "실버"]],
    bottoms: ["스트레이트 슬랙스", "펜슬 스커트", "와이드 슬랙스"],
    cue: "재킷과 하의를 같은 색 셋업으로, 안쪽만 밝게 해 얼굴을 환하게",
  },
  {
    key: "natural", name: "빈티지 내추럴", vibe: "자연 소재와 흙빛 색으로 편안하고 따뜻한 룩",
    occ: ["C", "A"],
    heroes: [h("top", "코튼 셔츠"), h("bottom", "롱 플리츠 스커트"), h("outer", "니트 베스트"), h("shoes", "스웨이드 부츠"), h("accessory", "라탄 백"), h("accessory", "버킷햇")],
    palettes: [["올리브", "브라운", "크림", "머스타드"], ["세이지 그린", "에크루", "카멜", "브라운"]],
    bottoms: ["롱 스커트", "와이드 코튼 팬츠", "스트레이트 데님"],
    cue: "질감이 느껴지는 소재 두 가지를 섞고, 금속 대신 나무·가죽 소품",
  },
  {
    key: "cozy", name: "스칸디 코지", vibe: "포근한 니트와 털 소재로 겨울을 즐기는 북유럽 무드",
    occ: ["C", "A"],
    heroes: [h("top", "케이블 니트"), h("outer", "숏 무스탕"), h("accessory", "니트 비니"), h("shoes", "스웨이드 부츠"), h("top", "니트 원피스"), h("outer", "숏 패딩")],
    palettes: [["오트밀", "그레이", "크림", "카키"], ["크림", "브라운", "베이지", "블랙"]],
    bottoms: ["니트 스커트", "스트레이트 데님", "와이드 팬츠"],
    cue: "부피 큰 니트엔 곧은 하의, 같은 톤의 모자·머플러로 얼굴 주변을 따뜻하게",
  },
  {
    key: "rock", name: "록시크", vibe: "가죽과 블랙으로 살짝 날을 세운 쿨한 룩",
    occ: ["P", "D", "C"],
    heroes: [h("outer", "레더 자켓"), h("shoes", "앵클 부츠"), h("bottom", "블랙 슬립 스커트"), h("accessory", "실버 체인 목걸이"), h("bottom", "부츠컷 데님")],
    palettes: [["블랙", "버건디", "실버", "화이트"], ["블랙", "데님", "그레이", "실버"]],
    bottoms: ["슬립 스커트", "부츠컷 데님", "레더 팬츠"],
    cue: "거친 소재(가죽) 하나에 부드러운 소재(실크·니트) 하나를 섞어 균형",
  },
  {
    key: "tweed", name: "레이디 트위드", vibe: "트위드와 진주로 우아하게 차려입은 클래식 룩",
    occ: ["F", "D", "S", "P"],
    heroes: [h("outer", "트위드 자켓"), h("accessory", "진주 목걸이"), h("shoes", "슬링백 힐"), h("bottom", "A라인 스커트"), h("accessory", "체인 숄더백")],
    palettes: [["핑크", "블랙", "크림", "골드"], ["네이비", "화이트", "베이지", "골드"], ["블랙", "그레이", "아이보리", "펄"]],
    bottoms: ["A라인 스커트", "와이드 슬랙스", "스트레이트 데님"],
    cue: "트위드 하나로 충분하니 나머지는 무지로, 진주는 목이나 귀 한 곳에만",
  },
  {
    key: "colorpop", name: "컬러 포인트", vibe: "차분한 바탕에 선명한 색 한 가지로 기분을 끌어올리는 룩",
    occ: ["P", "C", "D"],
    heroes: [h("top", "코발트 블루 니트"), h("accessory", "레드 숄더백"), h("bottom", "그린 미디 스커트"), h("shoes", "버건디 메리제인"), h("outer", "코랄 가디건")],
    palettes: [["코발트 블루", "크림", "그레이", "실버"], ["레드", "카멜", "블랙", "골드"], ["그린", "네이비", "아이보리", "골드"]],
    bottoms: ["미디 스커트", "와이드 슬랙스", "스트레이트 데님"],
    cue: "선명한 색은 딱 한 군데, 나머지는 그 색이 돋보이는 뉴트럴",
  },
  {
    key: "denim", name: "데님 온 데님", vibe: "청을 위아래로 겹쳐 입는 자연스럽고 경쾌한 룩",
    occ: ["C", "A"],
    heroes: [h("top", "데님 셔츠"), h("bottom", "데님 스커트"), h("outer", "데님 재킷"), h("bottom", "와이드 데님")],
    palettes: [["데님", "화이트", "브라운", "골드"], ["진청", "연청", "크림", "블랙"]],
    bottoms: ["데님 스커트", "와이드 데님", "스트레이트 데님"],
    cue: "위아래 청의 진하기를 다르게, 가죽 벨트·로퍼 대신 다른 신발로 끊어 주기",
  },
  {
    key: "sporty", name: "애슬레저", vibe: "움직이기 편한 운동복 소재를 단정하게 정리한 룩",
    occ: ["A", "C"],
    heroes: [h("outer", "패딩 베스트"), h("shoes", "러닝 스니커즈"), h("bottom", "플리츠 스커트"), h("top", "크롭 하프 집업"), h("accessory", "미니 크로스백")],
    palettes: [["네이비", "그레이", "화이트", "라임 포인트"], ["블랙", "크림", "카키", "화이트"]],
    bottoms: ["플리츠 스커트", "레깅스", "와이드 조거 팬츠"],
    cue: "운동복 하나에 스커트·작은 가방·주얼리 같은 여성스러운 일상복 하나를 섞어, 운동하러 온 느낌은 빼기",
  },
  {
    key: "tonal", name: "브라운 톤온톤", vibe: "초콜릿부터 베이지까지 한 계열로 깊이 있게 쌓은 룩",
    occ: ["C", "S", "D"],
    heroes: [h("top", "초콜릿 브라운 니트"), h("outer", "스웨이드 재킷"), h("bottom", "모카 브라운 스커트"), h("shoes", "브라운 롱부츠"), h("accessory", "브라운 호보백")],
    palettes: [["초콜릿 브라운", "모카", "베이지", "골드"], ["카멜", "코냑", "크림", "골드"]],
    bottoms: ["미디 스커트", "와이드 슬랙스", "부츠컷 팬츠"],
    cue: "같은 색 계열 3단계(진함·중간·연함)로 위에서 아래로 흐르게",
  },
  {
    key: "romantic", name: "로맨틱 이브닝", vibe: "은은한 광택과 드레이프로 특별한 저녁을 위한 룩",
    occ: ["P", "D", "F"],
    heroes: [h("bottom", "새틴 슬립 스커트"), h("top", "드레이프 블라우스"), h("shoes", "스트랩 힐"), h("accessory", "드롭 이어링"), h("accessory", "미니 클러치")],
    palettes: [["와인", "블랙", "샴페인 베이지", "골드"], ["네이비", "실버", "아이보리", "펄"], ["에메랄드", "블랙", "크림", "골드"]],
    bottoms: ["새틴 슬립 스커트", "와이드 슬랙스", "플리츠 스커트"],
    cue: "광택 소재는 한 가지만, 귀걸이로 얼굴 가까이에 빛을",
  },
];

/* 계절에 맞지 않는 아이템은 주인공에서 뺀다 */
const SUMMER_ONLY = /샌들|슬리브리스|민소매|반팔|쇼츠|린넨|라탄/;
const WINTER_ONLY = /패딩|무스탕|시어링|비니|롱부츠|코트|니트 원피스|케이블|캐시미어/;

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

export interface StyleBrief {
  direction: StyleDirection;
  hero: Hero;
  palette: string[];
  bottom: string;
}

export function pickStyleBrief(occ: Occ, season: Season): StyleBrief | null {
  if (occ === "M") return null; // 조문은 정해진 단정한 검정 차림
  const pool = DIRECTIONS.filter((d) => d.occ.includes(occ));
  const direction = pick(pool.length ? pool : DIRECTIONS);
  const okHero = direction.heroes.filter((x) =>
    season === "summer" ? !WINTER_ONLY.test(x.name) : season === "winter" ? !SUMMER_ONLY.test(x.name) : true
  );
  const hero = pick(okHero.length ? okHero : direction.heroes);
  return { direction, hero, palette: pick(direction.palettes), bottom: pick(direction.bottoms) };
}

const CAT_KO: Record<Cat, string> = { top: "상의", bottom: "하의", outer: "아우터", shoes: "신발", accessory: "액세서리" };

/** AI에게 건넬 이번 코디 방향 (user 메시지 끝에 붙인다) */
export function briefPrompt(b: StyleBrief | null, recent: string[], hasColorProfile: boolean): string {
  const lines: string[] = ["\n\n## 이번 코디 방향 (반드시 따를 것 — 매번 다른 코디를 위해 무작위로 정해짐)"];
  lines.push("- 단, 사용자가 상황에 아이템이나 조합을 직접 적었다면(예: \"셔츠 + 일자 슬랙스 조합으로\") 그 아이템을 그대로 쓰고, 아래 방향은 색·분위기 참고로만 쓸 것");
  if (b) {
    lines.push(`- 스타일: ${b.direction.name} — ${b.direction.vibe}`);
    lines.push(`- 주인공 아이템(${CAT_KO[b.hero.cat]}): "${b.hero.name}" — 이 아이템을 ${CAT_KO[b.hero.cat]}로 그대로 쓰고, 나머지를 여기에 맞출 것`);
    if (b.hero.cat !== "bottom") lines.push(`- 하의 형태: ${b.bottom}`);
    lines.push(
      hasColorProfile
        ? `- 색: 퍼스널컬러 베스트 컬러 안에서 고르되, 분위기는 ${b.palette.join("·")} 쪽으로`
        : `- 색 팔레트: ${b.palette.join(" · ")} (이 안에서 고를 것)`
    );
    lines.push(`- 스타일링 포인트: ${b.direction.cue}`);
  } else {
    lines.push("- 조문 자리: 검정·짙은 남색 무지, 광택·장식 없이 단정하게");
  }
  lines.push("- 여성복 코디: 모든 아이템은 여성복(우먼즈) 품목·핏으로. 한 벌 안에 여성스러운 실루엣이나 디테일이 또렷한 요소를 최소 하나 넣을 것(스커트·원피스, 허리선이 들어간 핏, 블라우스의 리본·드레이프, 메리제인·슬링백·발레 플랫·힐, 진주·골드 주얼리, 미니백 등). 남성복처럼 보이는 조합(옥스퍼드 셔츠+스트레이트 데님+블레이저+페니 로퍼, 맨투맨+조거+볼캡+러닝화 등)은 쓰지 말 것.");
  lines.push("- 너무 뻔한 조합 금지: '아이보리(크림) 터틀넥 니트 + 차콜 와이드 슬랙스 + 카멜 롱코트 + 로퍼'처럼 무난함만 노린 조합은 쓰지 말 것. 이 중 두 가지 이상을 한 벌에 같이 넣지 말 것(주인공 아이템인 경우만 예외).");
  if (recent.length) {
    lines.push(`- 이 사용자에게 방금 추천한 아이템(겹치지 말 것, 같은 품목·같은 색 조합 금지): ${recent.join(", ")}`);
  }
  return lines.join("\n");
}
