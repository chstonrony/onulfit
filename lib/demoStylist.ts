/* ══════════════════════════════════════════════════════════
   데모 스타일리스트 — AI 키가 없을 때도 상황마다 다른 코디를 짜 준다 (2026-11-07)
   · 상황 글에서 자리(격식·데이트·야외…)와 기분을 읽고
   · 계절(한국 시간)·퍼스널컬러·골격에 맞는 아이템과 색 팔레트를 골라 조합한다
   · 같은 상황을 다시 넣어도 매번 다른 조합이 나온다(무작위)
   아이템 이름은 GarmentArt 가 사진 종류를 찾을 수 있는 말로 짓는다(예: 트위드 자켓, 메리제인).
══════════════════════════════════════════════════════════ */

import type { OutfitRecommendation, ClothingItem } from "./types";
import type { BodyType, ColorType } from "./profile";
import { BODY_GUIDE, COLOR_GUIDE } from "./styleGuide";
import { currentSeason, type Season } from "./lookRecipes";
import { pickStyleBrief } from "./styleDirections";

/* ── 자리 ── C 일상 · S 단정(회의·학부모) · F 격식(하객) · D 데이트 · P 파티·공연 · A 야외·활동 · M 조문 */
type Occ = "C" | "S" | "F" | "D" | "P" | "A" | "M";

const OCCASIONS: { id: Occ; kw: string[]; label: string; mood: string[]; line: string[]; tip: string[]; look: string[] }[] = [
  {
    id: "M", kw: ["장례", "조문", "문상", "추도", "발인"], label: "조문",
    mood: ["차분하고 예의 바른"],
    line: ["장식 없이 조용한 디자인이라 예의를 갖추기 좋아요.", "광택 없는 소재를 고르면 더 단정해 보여요."],
    tip: ["조문 자리에서는 액세서리를 최소로 하고, 광택 있는 소재와 큰 로고는 피하는 게 예의예요."],
    look: ["눈에 띄지 않고 조용히 마음을 전하는 단정한 차림이에요."],
  },
  {
    id: "F", kw: ["결혼식", "하객", "웨딩", "상견례", "돌잔치", "시상식", "졸업식", "입학식", "예배", "교회", "연회", "격식"], label: "격식 있는 자리",
    mood: ["우아하고 단정한", "품위 있고 화사한"],
    line: ["격식 있는 자리에서도 단정하게 어울려요.", "사진에 찍혀도 단아하게 나와요.", "과하지 않게 예의를 갖춘 느낌을 줘요."],
    tip: ["하객 자리에서는 흰색 원피스처럼 주인공과 겹치는 색만 피하면, 은은한 광택 소재 하나로 충분히 화사해요.", "격식 있는 자리일수록 색은 두세 가지로 줄이고 소재로 고급스러움을 더하세요."],
    look: ["단정하지만 밋밋하지 않은, 품위 있는 자리의 정석 같은 룩이에요.", "어른들 앞에서도, 사진 속에서도 단아하게 빛나는 차림이에요."],
  },
  {
    id: "S", kw: ["미팅", "회의", "출근", "면접", "발표", "강의", "상담", "학부모", "엄마 모임", "엄마모임", "학교", "비즈니스", "거래처", "세미나", "회사", "업무", "동창회"], label: "단정한 자리",
    mood: ["단정하고 신뢰감 있는", "깔끔하고 지적인"],
    line: ["단정한 자리에서도 믿음직해 보여요.", "깔끔한 인상을 주면서도 딱딱하지 않아요.", "오래 앉아 있어도 구김이 적어 편해요."],
    tip: ["단정한 자리에서는 상의나 아우터 중 하나만 각을 세우고 나머지는 부드러운 소재로 풀어 주면 딱딱해 보이지 않아요.", "신뢰감을 주고 싶은 날은 무채색에 한 가지 색만 더하는 게 가장 안전해요."],
    look: ["처음 만나는 사람에게도 '믿을 만한 사람'이라는 인상을 주는 깔끔한 룩이에요.", "단정하지만 내 취향은 살아 있는, 일 잘하는 사람의 차림이에요."],
  },
  {
    id: "D", kw: ["소개팅", "데이트", "맞선", "기념일", "남편", "남자친구", "썸", "레스토랑", "디너", "첫 만남"], label: "데이트",
    mood: ["부드럽고 설레는", "은은하게 매력적인"],
    line: ["부드러운 인상을 줘서 처음 만나는 자리에도 잘 어울려요.", "가까이서 볼수록 매력이 느껴지는 아이템이에요.", "사진 속에서도 분위기 있게 나와요."],
    tip: ["데이트 날은 얼굴 가까이에 밝은 색이나 부드러운 소재를 두면 표정이 한결 화사해 보여요.", "힘을 준 아이템은 하나만, 나머지는 편하게 두면 자연스럽게 매력이 살아나요."],
    look: ["애쓴 티는 덜 나고 분위기는 더 나는, 은은하게 설레는 룩이에요.", "마주 앉았을 때 부드럽고 따뜻한 인상을 남기는 차림이에요."],
  },
  {
    id: "P", kw: ["파티", "콘서트", "공연", "뮤지컬", "송년회", "연말", "클럽", "전시", "회식", "생일", "축제"], label: "특별한 저녁",
    mood: ["세련되고 존재감 있는", "분위기 있고 감각적인"],
    line: ["조명 아래에서 더 멋스럽게 보여요.", "특별한 저녁에 존재감을 살려 줘요.", "평소보다 한 단계 힘을 준 느낌을 줘요."],
    tip: ["저녁 자리는 조명이 어두우니 광택 있는 소재나 진한 색 하나를 넣으면 존재감이 확 살아요.", "포인트는 한 군데에만 주고 나머지는 어두운 색으로 정리하면 세련돼 보여요."],
    look: ["오늘 밤만큼은 평소보다 한 걸음 더 나간, 감각 있는 사람의 룩이에요.", "조명 아래에서 은은하게 빛나는 세련된 저녁 차림이에요."],
  },
  {
    id: "A", kw: ["등산", "캠핑", "운동", "산책", "나들이", "소풍", "여행", "공원", "놀이공원", "아이랑", "아이와", "등원", "피크닉", "골프", "야외", "가족"], label: "야외 나들이",
    mood: ["산뜻하고 활동적인", "편안하고 경쾌한"],
    line: ["오래 걷고 움직여도 편해요.", "활동적인 날에도 멋이 흐트러지지 않아요.", "야외 사진에서 경쾌하게 나와요."],
    tip: ["오래 걷는 날은 신발부터 편한 것으로 고르고, 겉옷은 벗어서 들기 쉬운 가벼운 것으로 고르세요.", "야외에서는 밝은 색 하나를 넣으면 사진이 훨씬 생기 있어 보여요."],
    look: ["편하게 움직이면서도 사진 속 내가 예쁜, 활동적인 날의 룩이에요.", "아이와 뛰어도, 오래 걸어도 끄떡없는 산뜻한 차림이에요."],
  },
  {
    id: "C", kw: [], label: "일상",
    mood: ["편안하고 자연스러운", "꾸민 듯 안 꾸민 듯 세련된"],
    line: ["힘주지 않아도 자연스럽게 멋스러워요.", "하루 종일 입어도 편안해요.", "어디에 들러도 어색하지 않은 무난함이 있어요."],
    tip: ["일상 룩은 톤을 비슷하게 맞추기만 해도 '원래 취향이 좋은 사람'처럼 보여요.", "편한 날일수록 신발과 가방만 깔끔하게 정리하면 전체가 단정해 보여요."],
    look: ["억지로 꾸민 것 없이 자연스럽게 예쁜, 취향 좋은 사람의 일상 룩이에요.", "편안함과 세련됨 사이를 잘 잡은 오늘의 데일리 룩이에요."],
  },
];

/* ── 기분 ── */
type Feel = "down" | "up" | "bold" | null;
const FEELINGS: { id: Exclude<Feel, null>; kw: string[]; vibe: Vibe[]; tip: string }[] = [
  { id: "down", kw: ["우울", "가라앉", "지쳐", "지친", "힘들", "위로", "슬프", "슬픔", "피곤"], vibe: ["soft", "calm"], tip: "마음이 가라앉은 날엔 부드러운 촉감과 따뜻한 색이 스스로를 다독여 줘요." },
  { id: "up", kw: ["기쁘", "설레", "행복", "신나", "기분 좋", "기분이 좋"], vibe: ["bright", "soft"], tip: "기분 좋은 날엔 밝은 색 하나를 얼굴 가까이에 두면 그 기분이 더 잘 드러나요." },
  { id: "bold", kw: ["자신감", "당당", "강해", "강하게", "멋있", "카리스마"], vibe: ["bold"], tip: "자신감이 필요한 날엔 진한 색과 선명한 실루엣이 자세까지 바로 세워 줘요." },
];

/* ── 색 팔레트: [아우터, 상의, 하의, 신발, 가방, 금속] ── */
type Vibe = "calm" | "soft" | "bright" | "bold";
const PALETTES: { name: string; vibe: Vibe; for: ColorType[]; c: [string, string, string, string, string, string] }[] = [
  { name: "오트밀 모노톤", vibe: "calm", for: ["spring", "autumn"], c: ["카멜", "아이보리", "오트밀", "탄 브라운", "카멜 베이지", "골드"] },
  { name: "브라운 그라데이션", vibe: "calm", for: ["autumn"], c: ["브라운", "크림", "베이지", "다크 브라운", "코냑", "골드"] },
  { name: "코랄 포인트", vibe: "bright", for: ["spring"], c: ["베이지", "코랄", "아이보리", "탄", "카멜", "골드"] },
  { name: "버터 옐로우", vibe: "bright", for: ["spring"], c: ["크림", "버터 옐로우", "웜 베이지", "탄", "카멜 베이지", "골드"] },
  { name: "카멜 & 아이보리", vibe: "soft", for: ["spring", "autumn"], c: ["카멜", "에크루", "아이보리", "카멜 브라운", "탄", "골드"] },
  { name: "카키 어스", vibe: "calm", for: ["autumn"], c: ["카키", "에크루", "브라운", "코냑", "카멜", "골드"] },
  { name: "테라코타", vibe: "bold", for: ["autumn"], c: ["카멜", "테라코타", "크림", "브라운", "코냑", "골드"] },
  { name: "올리브 & 머스타드", vibe: "bold", for: ["autumn"], c: ["올리브", "머스타드", "아이보리", "다크 브라운", "코냑", "골드"] },
  { name: "와인 오텀", vibe: "bold", for: ["autumn", "winter"], c: ["차콜", "와인", "베이지", "다크 브라운", "버건디", "골드"] },
  { name: "쿨 그레이 모노", vibe: "calm", for: ["winter", "summer"], c: ["차콜", "라이트 그레이", "그레이", "블랙", "차콜", "실버"] },
  { name: "네이비 클래식", vibe: "calm", for: ["winter", "summer"], c: ["네이비", "화이트", "베이지", "블랙", "네이비", "실버"] },
  { name: "라벤더 소프트", vibe: "soft", for: ["summer"], c: ["라이트 그레이", "라벤더", "화이트", "그레이", "라이트 그레이", "실버"] },
  { name: "스카이 블루", vibe: "bright", for: ["summer"], c: ["네이비", "스카이 블루", "아이보리", "화이트", "네이비", "실버"] },
  { name: "로즈 핑크", vibe: "soft", for: ["summer"], c: ["그레이", "로즈", "화이트", "그레이", "로즈", "실버"] },
  { name: "블랙 & 화이트", vibe: "bold", for: ["winter"], c: ["블랙", "화이트", "블랙", "블랙", "블랙", "실버"] },
  { name: "버건디 포인트", vibe: "bold", for: ["winter"], c: ["블랙", "버건디", "차콜", "블랙", "버건디", "골드"] },
  { name: "민트 & 네이비", vibe: "bright", for: ["summer", "winter"], c: ["네이비", "민트", "화이트", "화이트", "네이비", "실버"] },
];
const MOURNING = { name: "블랙 모노톤", vibe: "calm" as Vibe, for: [] as ColorType[], c: ["블랙", "블랙", "블랙", "블랙", "블랙", "실버"] as [string, string, string, string, string, string] };

/* ── 아이템 ── o: 어울리는 자리, s: 계절(없으면 사계절), b: 더 잘 맞는 골격, p: 무늬 아이템 */
type Item = { n: string; k: string; o: string; s?: Season[]; b?: BodyType; p?: boolean; why: string };
const FW: Season[] = ["autumn", "winter"], SFA: Season[] = ["spring", "summer", "autumn"], SAW: Season[] = ["spring", "autumn", "winter"], SA: Season[] = ["spring", "autumn"], SU: Season[] = ["summer"], WI: Season[] = ["winter"], SS: Season[] = ["spring", "summer"];

const TOPS: Item[] = [
  { n: "케이블 니트", k: "케이블 니트", o: "CDA", s: FW, b: "natural", why: "도톰한 꽈배기 짜임이 포근하고 여유로운 인상을 줘요." },
  { n: "터틀넥 니트", k: "터틀넥 니트", o: "CSDFM", s: FW, b: "straight", why: "목선을 따라 올라오는 깔끔한 라인이 얼굴을 또렷하게 잡아줘요." },
  { n: "라운드 울 니트", k: "울 니트", o: "CSD", s: SAW, why: "군더더기 없는 라운드넥이라 어떤 아우터와도 잘 겹쳐져요." },
  { n: "브이넥 니트", k: "브이넥 니트", o: "SDC", s: SAW, b: "straight", why: "브이넥이 목선을 길어 보이게 해서 상체가 시원해 보여요." },
  { n: "카라 니트", k: "카라 니트", o: "SDC", s: SAW, b: "wave", why: "카라가 얼굴 가까이에 단정한 포인트를 만들어 줘요." },
  { n: "리본 블라우스", k: "리본 블라우스", o: "SFD", b: "wave", why: "목에 맨 리본이 시선을 위로 모아 화사해 보여요." },
  { n: "실크 블라우스", k: "실크 블라우스", o: "SFDP", b: "wave", why: "은은한 광택이 얼굴에 빛을 더해 줘요." },
  { n: "옥스포드 셔츠", k: "옥스포드 셔츠", o: "CSA", s: SFA, b: "straight", why: "빳빳한 코튼 셔츠라 단정하면서도 편안해요." },
  { n: "스트라이프 셔츠", k: "스트라이프 셔츠", o: "CS", s: SFA, b: "straight", p: true, why: "줄무늬가 상체를 시원하고 산뜻하게 보이게 해요." },
  { n: "스트라이프 티셔츠", k: "스트라이프 티셔츠", o: "CA", s: SFA, p: true, why: "경쾌한 줄무늬 하나로 캐주얼한 멋이 살아나요." },
  { n: "맨투맨", k: "맨투맨", o: "CA", s: SAW, b: "natural", why: "도톰한 스웨트 소재라 활동하기 편하고 따뜻해요." },
  { n: "후드티", k: "후드티", o: "A", s: SAW, b: "natural", why: "후드가 캐주얼한 볼륨감을 더해 줘요." },
  { n: "반팔 티셔츠", k: "반팔 티셔츠", o: "CA", s: SU, why: "탄탄한 코튼 소재라 혼자 입어도 핏이 살아요." },
  { n: "슬리브리스 니트", k: "슬리브리스 니트", o: "CDP", s: SU, b: "wave", why: "어깨선이 드러나 여름에 가볍고 산뜻해요." },
  { n: "새틴 캐미솔", k: "새틴 캐미솔", o: "PD", s: SU, b: "wave", why: "흐르는 새틴 소재가 여름 저녁에 은근한 분위기를 더해요." },
];
const BOTTOMS: Item[] = [
  { n: "와이드 슬랙스", k: "와이드 슬랙스", o: "SFCDM", b: "natural", why: "떨어지는 와이드 핏이 다리 라인을 길고 곧게 정리해 줘요." },
  { n: "테이퍼드 슬랙스", k: "테이퍼드 슬랙스", o: "SFCM", b: "straight", why: "발목으로 갈수록 좁아지는 핏이라 단정하고 깔끔해요." },
  { n: "스트레이트 데님", k: "스트레이트 데님", o: "CAD", b: "straight", why: "곧게 떨어지는 일자 핏이라 어떤 신발과도 잘 맞아요." },
  { n: "와이드 데님", k: "와이드 데님", o: "CA", b: "natural", why: "넉넉한 와이드 핏이라 편하면서도 요즘 느낌이 나요." },
  { n: "플리츠 스커트", k: "플리츠 스커트", o: "SDFC", b: "wave", why: "걸을 때마다 주름이 살랑여 여성스러운 움직임이 생겨요." },
  { n: "새틴 슬립 스커트", k: "새틴 스커트", o: "DPF", b: "wave", why: "은은한 광택이 흐르는 실루엣이라 특별한 날에 잘 어울려요." },
  { n: "롱 플레어 스커트", k: "롱 스커트", o: "CDF", why: "발목까지 내려오는 플레어 라인이 우아한 실루엣을 만들어요." },
  { n: "체크 울 스커트", k: "체크 스커트", o: "SCD", s: FW, p: true, why: "클래식한 체크가 가을·겨울 분위기를 단번에 살려 줘요." },
  { n: "울 미니 스커트", k: "미니 스커트", o: "DP", s: SAW, b: "wave", why: "짧은 기장이 다리를 길어 보이게 하고 발랄한 인상을 줘요." },
  { n: "카고 팬츠", k: "카고 팬츠", o: "A", b: "natural", why: "넉넉한 주머니와 여유 있는 핏이라 활동하기 편해요." },
  { n: "버뮤다 쇼츠", k: "버뮤다 쇼츠", o: "CA", s: SU, why: "무릎 위 기장이라 시원하면서도 단정해 보여요." },
  { n: "데님 스커트", k: "데님 스커트", o: "CA", s: SS, why: "캐주얼한 데님 소재라 편하게 손이 가요." },
  { n: "레더 팬츠", k: "레더 팬츠", o: "P", s: FW, b: "straight", why: "매끈한 가죽 질감이 저녁 자리에서 멋스러운 존재감을 줘요." },
];
const OUTERS: Item[] = [
  { n: "울 롱코트", k: "울 롱코트", o: "CSFDM", s: FW, b: "straight", why: "무릎 아래로 떨어지는 롱코트가 전체 실루엣을 길고 우아하게 잡아줘요." },
  { n: "더블 코트", k: "더블 코트", o: "SFD", s: FW, b: "straight", why: "두 줄 단추가 클래식하고 격식 있는 분위기를 줘요." },
  { n: "핸드메이드 코트", k: "핸드메이드 코트", o: "CDF", s: WI, b: "natural", why: "가볍고 부드러운 핸드메이드 울이라 오래 입어도 편해요." },
  { n: "숏 패딩", k: "숏패딩", o: "CA", s: WI, why: "짧은 기장이라 다리가 길어 보이고 움직이기 편해요." },
  { n: "롱 패딩", k: "롱패딩", o: "A", s: WI, why: "무릎까지 덮어 주는 기장이라 추운 날 야외에서도 든든해요." },
  { n: "트렌치 코트", k: "트렌치 코트", o: "CSDF", s: SA, why: "허리끈 하나로 실루엣을 조절할 수 있는 간절기 필수 아우터예요." },
  { n: "트위드 자켓", k: "트위드 자켓", o: "SFDP", s: SAW, b: "wave", why: "트위드 특유의 짜임이 고급스럽고 여성스러운 인상을 줘요." },
  { n: "레더 자켓", k: "레더 자켓", o: "CPD", s: SA, b: "straight", why: "매끈한 가죽이 룩 전체에 시크한 긴장감을 줘요." },
  { n: "무스탕 자켓", k: "무스탕", o: "CD", s: WI, b: "natural", why: "포근한 양털 안감이 따뜻하고 멋스러운 겨울 분위기를 만들어요." },
  { n: "블레이저", k: "블레이저", o: "SFCM", s: SAW, b: "straight", why: "어깨선이 잡힌 블레이저 하나로 전체가 단정해져요." },
  { n: "체크 블레이저", k: "체크 블레이저", o: "SC", s: SA, p: true, why: "은은한 체크가 단정함 속에 멋을 더해 줘요." },
  { n: "크롭 가디건", k: "크롭 가디건", o: "CD", s: SFA, b: "wave", why: "짧은 기장이 허리선을 올려 비율을 좋아 보이게 해요." },
  { n: "브이넥 가디건", k: "브이넥 가디건", o: "CSF", s: SFA, why: "가볍게 걸치기 좋은 기본 가디건이라 실내외 온도 차에 딱이에요." },
  { n: "니트 베스트", k: "니트 베스트", o: "CS", s: SA, why: "셔츠 위에 겹쳐 입으면 단정하고 지적인 느낌이 나요." },
  { n: "바시티 자켓", k: "바시티 자켓", o: "A", s: SA, b: "natural", why: "스포티한 바시티 자켓이 활동적인 날에 경쾌함을 더해요." },
  { n: "데님 자켓", k: "데님 자켓", o: "CA", s: SFA, why: "어디에나 툭 걸치기 좋은 캐주얼 아우터예요." },
  { n: "린넨 셔츠 자켓", k: "린넨 자켓", o: "CSD", s: SU, why: "통기성 좋은 린넨이라 여름에도 가볍게 걸칠 수 있어요." },
];
const SHOES: Item[] = [
  { n: "페니 로퍼", k: "페니 로퍼", o: "CSFDM", why: "굽 없이도 단정한 클래식 로퍼라 오래 걸어도 편해요." },
  { n: "첼시 부츠", k: "첼시 부츠", o: "CSD", s: FW, b: "straight", why: "발목을 감싸는 깔끔한 라인이 바지와 스커트 모두에 어울려요." },
  { n: "롱부츠", k: "롱부츠", o: "DPC", s: FW, b: "wave", why: "다리 라인을 길게 이어 주는 롱부츠가 스커트와 특히 잘 어울려요." },
  { n: "앵클 부츠", k: "앵클 부츠", o: "CSDP", s: FW, why: "적당한 굽의 앵클 부츠라 편하면서도 세련돼 보여요." },
  { n: "메리제인", k: "메리제인 슈즈", o: "CDS", s: SAW, b: "wave", why: "발등 스트랩이 사랑스럽고 클래식한 포인트가 돼요." },
  { n: "발레 플랫", k: "발레 플랫", o: "CSD", s: SFA, why: "가볍고 납작한 플랫이라 하루 종일 편하게 신을 수 있어요." },
  { n: "레더 뮬", k: "뮬", o: "CSD", s: SS, why: "뒤꿈치가 트여 신고 벗기 편하고 발목이 가늘어 보여요." },
  { n: "캔버스 스니커즈", k: "캔버스 스니커즈", o: "CA", s: SFA, why: "어디에나 어울리는 기본 스니커즈라 활동적인 날에 딱이에요." },
  { n: "레더 스니커즈", k: "레더 스니커즈", o: "CAS", why: "깔끔한 가죽 스니커즈라 편하면서도 단정해 보여요." },
  { n: "어글리 스니커즈", k: "어글리 스니커즈", o: "A", b: "natural", why: "도톰한 밑창이 쿠션감이 좋고 키도 살짝 커 보여요." },
  { n: "슬링백 힐", k: "슬링백", o: "SFDP", s: SFA, b: "wave", why: "뒤꿈치 스트랩과 적당한 굽이 우아한 걸음을 만들어요." },
  { n: "펌프스", k: "펌프스", o: "FSPM", b: "straight", why: "군더더기 없는 펌프스가 전체 룩을 단정하게 마무리해요." },
  { n: "스트랩 샌들", k: "스트랩 샌들", o: "CDP", s: SU, why: "가는 스트랩이 여름 발끝을 가볍고 시원하게 보여 줘요." },
];
const ACCS: Item[] = [
  { n: "토트백", k: "토트백", o: "CSF", why: "넉넉한 수납의 토트백이라 하루 일정을 거뜬히 담아요." },
  { n: "미니 숄더백", k: "미니 숄더백", o: "DPCF", why: "작은 숄더백이 룩에 단정한 포인트를 더해 줘요." },
  { n: "크로스백", k: "크로스백", o: "CA", why: "두 손이 자유로운 크로스백이라 활동적인 날에 편해요." },
  { n: "캐시미어 머플러", k: "캐시미어 머플러", o: "CSDAM", s: FW, why: "얼굴 가까이 부드러운 소재가 닿아 따뜻하고 화사해 보여요." },
  { n: "실크 스카프", k: "실크 스카프", o: "SFD", s: SA, why: "목이나 가방에 툭 묶기만 해도 룩이 한층 세련돼져요." },
  { n: "니트 비니", k: "니트 비니", o: "A", s: WI, why: "귀까지 덮어 주는 비니가 따뜻하고 캐주얼한 멋을 더해요." },
  { n: "볼캡", k: "볼캡", o: "A", s: SFA, why: "햇빛도 가리고 경쾌한 분위기도 더해 주는 아이템이에요." },
  { n: "울 베레모", k: "베레모", o: "DC", s: FW, why: "베레모 하나로 프렌치 무드가 살아나요." },
  { n: "링 귀걸이", k: "링 귀걸이", o: "FSDM", why: "작은 링 귀걸이가 얼굴 가까이에서 환하게 반짝여요." },
  { n: "체인 목걸이", k: "체인 목걸이", o: "DPC", why: "가는 체인 목걸이가 목선에 반짝이는 포인트를 줘요." },
  { n: "레더 벨트", k: "레더 벨트", o: "SC", why: "허리에 벨트 하나를 더하면 비율이 정돈돼 보여요." },
  { n: "버킷햇", k: "버킷햇", o: "A", s: SS, why: "자외선도 막고 캐주얼한 분위기도 살려 줘요." },
  { n: "클러치", k: "클러치", o: "FP", why: "손에 드는 작은 클러치가 격식 있는 자리를 우아하게 완성해요." },
];

/* ── 도움 함수 ── */
const pickOne = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
function weighted<T>(a: T[], w: (x: T) => number): T {
  const ws = a.map(w);
  let r = Math.random() * ws.reduce((s, x) => s + x, 0);
  for (let i = 0; i < a.length; i++) { r -= ws[i]; if (r <= 0) return a[i]; }
  return a[a.length - 1];
}
const short = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

function pickItem(pool: Item[], occ: Occ, season: Season, body?: BodyType, noPattern = false): Item {
  const ok = (x: Item) => (!x.s || x.s.includes(season)) && !(noPattern && x.p);
  let c = pool.filter((x) => ok(x) && x.o.includes(occ));
  if (!c.length) c = pool.filter(ok);
  if (!c.length) c = pool;
  return weighted(c, (x) => (body && x.b === body ? 3 : 1) * (x.p ? 0.6 : 1));
}

function pickPalette(occ: Occ, feel: Feel, color?: ColorType) {
  if (occ === "M") return MOURNING;
  let c = color ? PALETTES.filter((p) => p.for.includes(color)) : PALETTES;
  if (!c.length) c = PALETTES;
  const want = feel ? FEELINGS.find((f) => f.id === feel)!.vibe : occ === "P" ? ["bold", "bright"] : occ === "F" || occ === "S" ? ["calm", "soft"] : occ === "A" ? ["bright", "calm"] : [];
  return weighted(c, (p) => (want.includes(p.vibe) ? 3 : 1));
}

const ROLE = {
  outer: "전체 분위기를 잡아줘요",
  top: "얼굴 가까이에서 인상을 밝혀줘요",
  bottom: "룩 전체를 차분하게 받쳐줘요",
  shoes: "발끝까지 깔끔하게 마무리해요",
  accessory: "작지만 확실한 포인트가 돼요",
};

/** 상황 글 → 코디 한 벌 (AI 키가 없을 때 쓰는 데모용) */
/** 상황 글에서 자리(조문·격식·단정·데이트·저녁·야외·일상)를 찾는다 — AI 코디 방향 고르기에도 쓴다 */
export function detectOccasion(situation: string): Occ {
  const text = situation.toLowerCase();
  return (OCCASIONS.find((o) => o.kw.some((k) => text.includes(k))) ?? OCCASIONS[OCCASIONS.length - 1]).id;
}

/** 상황 글에 계절이 적혀 있으면 그 계절, 아니면 오늘의 계절 */
export function detectSeason(situation: string, now = new Date()): Season {
  const text = situation.toLowerCase();
  return /여름|휴가|바캉스|해변/.test(text) ? "summer" : /겨울|크리스마스|눈 오는/.test(text) ? "winter" : /봄|벚꽃/.test(text) ? "spring" : /가을|단풍/.test(text) ? "autumn" : currentSeason(now);
}

export function composeOutfit(situation: string, bodyType?: BodyType, colorType?: ColorType, now = new Date()): OutfitRecommendation {
  const text = situation.toLowerCase();
  const occ = OCCASIONS.find((o) => o.kw.some((k) => text.includes(k))) ?? OCCASIONS[OCCASIONS.length - 1];
  const feel = (FEELINGS.find((f) => f.kw.some((k) => text.includes(k)))?.id ?? null) as Feel;
  // 상황에 계절이 적혀 있으면 그 계절로(예: "봄 소풍")
  const season: Season =
    /여름|휴가|바캉스|해변/.test(text) ? "summer" : /겨울|크리스마스|눈 오는/.test(text) ? "winter" : /봄|벚꽃/.test(text) ? "spring" : /가을|단풍/.test(text) ? "autumn" : currentSeason(now);
  /* 조문이 아니면 AI와 같은 코디 방향(핀터레스트·29CM 스트릿 데일리)으로 짠다 (2026-11-09) */
  const brief = pickStyleBrief(occ.id, season, bodyType, colorType);
  if (brief) {
    const lines = [...occ.line].sort(() => Math.random() - 0.5);
    const colorFor = brief.colors;
    const make = (cat: keyof typeof ROLE, i: number): ClothingItem => ({
      name: brief.items[cat],
      color: colorFor[cat],
      description: `${colorFor[cat]} 컬러가 ${ROLE[cat]}. ${lines[i % lines.length]}`,
      searchKeyword: brief.items[cat].replace(/^(슬림|베이직|파인 게이지)\s/, ""),
    });
    const tip = [`${brief.cue}만 해도 훨씬 감각 있어 보여요.`];
    if (bodyType && BODY_GUIDE[bodyType]) tip.push(`골격 포인트 — ${BODY_GUIDE[bodyType].principle}`);
    return {
      situation: short(situation.trim().replace(/\s+/g, " "), 30),
      mood: `${pickOne(occ.mood)} · ${brief.direction.name}`,
      items: { top: make("top", 0), bottom: make("bottom", 1), outer: make("outer", 2), shoes: make("shoes", 3), accessory: make("accessory", 4) },
      stylingTip: tip.join(" "),
      overallLook: `${brief.direction.vibe}. ${pickOne(occ.look)}`,
    };
  }

  const pal = pickPalette(occ.id, feel, colorType);
  // 퍼스널컬러에서 피할 색은 무난한 색으로 바꾼다
  const worst = colorType ? COLOR_GUIDE[colorType].worstColors : [];
  const SAFE: Record<ColorType, string> = { spring: "아이보리", summer: "그레이", autumn: "브라운", winter: "그레이" };
  const [cOuter, cTop, cBottom, cShoes, cBag, cMetal] = pal.c
    .map((c) => (colorType && worst.includes(c) ? SAFE[colorType] : c))
    // 하객 자리에서는 신부와 겹치는 흰색을 피한다
    .map((c) => (occ.id === "F" && /화이트|아이보리|에크루/.test(c) ? "라이트 그레이" : c));

  // 무늬는 한 벌에 한 개까지 · 조문 자리는 무늬 없음
  let patterned = occ.id === "M";
  const take = (pool: Item[]) => {
    const it = pickItem(pool, occ.id, season, bodyType, patterned);
    if (it.p) patterned = true;
    return it;
  };
  const order = [["top", TOPS], ["outer", OUTERS], ["bottom", BOTTOMS], ["shoes", SHOES], ["accessory", ACCS]] as const;
  const picked = {} as Record<(typeof order)[number][0], Item>;
  for (const [cat, pool] of [...order].sort(() => Math.random() - 0.5)) picked[cat] = take(pool as unknown as Item[]);

  const lines = [...occ.line].sort(() => Math.random() - 0.5);
  const colorOf = (cat: keyof typeof ROLE, it: Item): string => {
    if (cat === "accessory") {
      if (/귀걸이|목걸이/.test(it.n)) return cMetal;
      return cBag;
    }
    const base = { outer: cOuter, top: cTop, bottom: cBottom, shoes: cShoes }[cat];
    if (!it.p) return base;
    // 무늬 옷: 바탕색 + 줄 색(다른 팔레트 색)
    const line = [cOuter, cBottom, cShoes].find((c) => c !== base) ?? "블랙";
    return `${base} ${line}`;
  };
  const make = (cat: keyof typeof ROLE, i: number): ClothingItem => {
    const it = picked[cat];
    const color = colorOf(cat, it);
    const shownColor = color.split(" ").slice(0, 2).join(" ");
    // 이름 앞 색: 무늬 옷은 바탕색만, 나머지는 색 이름 그대로(예: 다크 브라운 롱부츠, 골드 링 귀걸이)
    const prefix = it.p ? color.split(" ")[0] : color;
    return {
      name: `${prefix ? prefix + " " : ""}${it.n}`,
      color,
      description: `${it.why} ${shownColor} 컬러가 ${ROLE[cat]}. ${lines[i % lines.length]}`,
      searchKeyword: it.k,
    };
  };

  const feeling = feel ? FEELINGS.find((f) => f.id === feel)! : null;
  const tipParts = [pickOne(occ.tip)];
  if (feeling) tipParts.push(feeling.tip);
  if (bodyType && BODY_GUIDE[bodyType]) tipParts.push(`골격 포인트 — ${BODY_GUIDE[bodyType].principle}`);

  return {
    situation: short(situation.trim().replace(/\s+/g, " "), 30),
    mood: `${pickOne(occ.mood)} · ${pal.name}`,
    items: {
      top: make("top", 0),
      bottom: make("bottom", 1),
      outer: make("outer", 2),
      shoes: make("shoes", 3),
      accessory: make("accessory", 4),
    },
    stylingTip: tipParts.join(" "),
    overallLook: `${pal.name} 컬러로 맞춘 ${occ.label} 룩. ${pickOne(occ.look)}`,
  };
}
