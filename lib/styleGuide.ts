/* ══════════════════════════════════════════════════════════
   오늘핏 — 스타일 가이드 (제품 핵심 자산 / 유료 리포트 원천)
   3개 층으로 구성:
     L1. BODY_GUIDE     — 체형(골격)별 아이템 가이드  ← 가장 전문성 깊음(기초)
     L2. COLOR_GUIDE    — 퍼스널컬러별 상세
     L3. CROSS_GUIDE    — 체형 × 컬러 12조합 종합
     L4. SITUATION_LOOKBOOK — 상황 × 체형 적용 룩

   ※ 콘텐츠 작성 정책: Claude 1차 초안 → 운영자(스타일리스트) 감수·수정.
     아래 내용은 표준 골격진단·퍼스널컬러 이론 기반 초안입니다.
     [감수要] 표시가 없어도 자유롭게 수정하세요. 이 파일만 고치면 전체 반영됩니다.
══════════════════════════════════════════════════════════ */

import type { BodyType, ColorType } from "./profile";

/* ── L1. 체형(골격)별 아이템 가이드 ───────────────────── */

export interface ItemGuide {
  good: string;
  avoid: string;
}

export interface BodyGuide {
  characteristics: string[]; // 골격 특징 (시각/촉각)
  principle: string;         // 핵심 스타일링 원칙 한 문장
  items: {
    neckline: ItemGuide;     // 넥라인
    shoulder: ItemGuide;     // 어깨·소매
    top: ItemGuide;          // 상의 핏·기장
    bottom: ItemGuide;       // 하의 실루엣·허리
    dress: ItemGuide;        // 원피스
    outer: ItemGuide;        // 아우터
    fabric: ItemGuide;       // 소재 (골격진단 핵심)
    shoesBag: ItemGuide;     // 신발·가방
    accessory: ItemGuide;    // 액세서리
  };
  mistakes: string[];        // 흔한 실수
  formulas: string[];        // 추천 코디 공식
}

export const BODY_GUIDE: Record<BodyType, BodyGuide> = {
  straight: {
    characteristics: [
      "상체에 볼륨이 있고 입체적이며 탄탄하다",
      "가슴 두께가 있고 허리 위치가 높은 편",
      "목이 짧게 느껴지고 쇄골이 잘 드러나지 않는다",
      "살이 찌면 상체·얼굴부터, 단단하게 붙는다",
    ],
    principle: "더하지 말고 빼기. 군더더기 없는 정석 핏과 고급 소재로 입체감을 정돈한다.",
    items: {
      neckline: {
        good: "적당히 파인 V넥, 셔츠 칼라, 스퀘어넥 — 목과 가슴 위를 시원하게 비워 상체를 길어 보이게",
        avoid: "목을 조이는 터틀넥, 프릴넥, 보트넥 — 상체가 더 부해 보임",
      },
      shoulder: {
        good: "어깨선이 정확히 맞는 셋인 슬리브, 깔끔한 어깨 라인",
        avoid: "퍼프·프릴·러플 소매 — 가뜩이나 있는 상체 볼륨을 키움",
      },
      top: {
        good: "허리가 살짝 들어가는 레귤러핏, 매끈한 베이식 셔츠·니트, 살짝 도톰하되 비치지 않는 것",
        avoid: "크롭(상체 강조), 오버핏·박시, 보풀 많고 두꺼운 니트",
      },
      bottom: {
        good: "스트레이트·테이퍼드 슬랙스, 일자 데님, 하이웨스트로 다리 길이 강조",
        avoid: "통 넓은 와이드, 워싱 심한 데님, 과한 플리츠 — 부피를 더함",
      },
      dress: {
        good: "I라인·H라인 원피스, 셔츠 원피스 — 몸의 세로선을 살림",
        avoid: "티어드·과한 플레어·러플 — 실루엣이 흐트러짐",
      },
      outer: {
        good: "테일러드 재킷, 트렌치코트, 세미오버 한 벌 — 구조가 잡힌 것",
        avoid: "솜털·퍼·과한 디테일의 패딩 — 상체가 묻힘",
      },
      fabric: {
        good: "매끈하고 도톰한 고급 소재 — 울, 실크, 탄탄한 코튼, 캐시미어",
        avoid: "시폰·레이스·얇고 비치는 소재, 보풀 잘 이는 니트 — 싸 보이고 형태가 무너짐",
      },
      shoesBag: {
        good: "포인티드토·플레인 펌프스, 구조감 있는 가방 — 라인을 정돈",
        avoid: "둥근코·장식 많은 신발, 흐물거리는 가방",
      },
      accessory: {
        good: "큼직하고 심플한 골드·진주, 짧은~중간 길이 목걸이 한 개",
        avoid: "자잘한 레이어드 — 상체가 복잡해짐",
      },
    },
    mistakes: [
      "오버핏·프릴로 상체에 볼륨을 더해 부해 보이게 만든다",
      "허리 라인을 죽인 박시핏으로 입어 체형이 사각형으로 보인다",
      "얇고 비치는 저렴한 소재 — 스트레이트는 소재 티가 가장 많이 난다",
    ],
    formulas: [
      "심플 V넥 니트 + 일자 슬랙스 + 포인티드 펌프스",
      "베이식 셔츠 + 스트레이트 데님 + 트렌치코트",
      "셔츠 원피스 + 구조감 있는 토트백",
    ],
  },

  wave: {
    characteristics: [
      "상체가 얇고 부드러우며 하체에 무게중심이 있다",
      "살집이 부드럽고 허리 위치가 낮은 편",
      "목이 길고 쇄골이 가늘게 드러난다",
      "살이 찌면 하체·아랫배부터 붙는다",
    ],
    principle: "위는 화사하게, 아래는 정리. 상체에 시선과 디테일을 주고 하이웨스트로 허리를 끌어올린다.",
    items: {
      neckline: {
        good: "라운드넥, 보트넥, 프릴넥, 오프숄더 — 얇은 상체를 보강하고 화사하게",
        avoid: "깊게 파인 V넥 — 상체가 더 빈약해 보임",
      },
      shoulder: {
        good: "퍼프·프릴·셔링 소매로 상체에 볼륨을 더해도 좋음",
        avoid: "밋밋한 민소매, 처지는 드롭숄더 — 빈약해 보임",
      },
      top: {
        good: "크롭·짧은 기장, 허리가 들어가는 핏, 셔링·리본 디테일",
        avoid: "롱 기장, 박시·헐렁한 핏 — 하체가 강조되고 키가 눌림",
      },
      bottom: {
        good: "하이웨스트, 플레어·플리츠 스커트, A라인 — 허리를 높이고 곡선을 살림",
        avoid: "로우웨스트, 통 넓은 카고, 뻣뻣한 일자 — 하체가 무거워 보임",
      },
      dress: {
        good: "핏앤플레어, 랩 원피스, 하이웨스트 원피스 — 허리선이 살아있는 것",
        avoid: "H라인 일자, 로우웨스트 원피스",
      },
      outer: {
        good: "짧은 기장 재킷, 크롭 가디건, 트위드 — 상체에 머무는 것",
        avoid: "긴 롱코트(키 눌림), 박시한 아우터",
      },
      fabric: {
        good: "부드럽고 하늘거리는 소재 — 시폰, 앙고라, 레이스, 부드러운 니트",
        avoid: "뻣뻣하고 두꺼운 소재 — 가죽, 두꺼운 데님 — 딱딱해 보임",
      },
      shoesBag: {
        good: "곡선·리본 디테일, 작고 아담한 가방 — 여리한 분위기",
        avoid: "투박한 워커, 큰 토트백 — 무거워 보임",
      },
      accessory: {
        good: "자잘하고 화사한 레이어드, 진주, 가는 체인",
        avoid: "무겁고 큰 메탈 — 상체가 눌림",
      },
    },
    mistakes: [
      "롱 기장으로 키가 눌리고 하체가 강조된다",
      "상체를 너무 비워(깊은 V넥·민소매) 빈약해 보인다",
      "뻣뻣한 소재로 부드러운 몸이 딱딱하고 어색해 보인다",
    ],
    formulas: [
      "크롭 가디건 + 하이웨스트 플레어 스커트",
      "퍼프 블라우스 + 하이웨스트 일자 팬츠 + 리본 슈즈",
      "랩 원피스 + 짧은 트위드 재킷",
    ],
  },

  natural: {
    characteristics: [
      "어깨·관절 등 골격 프레임이 또렷하고 크다",
      "살이 잘 안 붙고 골격이 먼저 도드라진다",
      "손목·손이 크고 쇄골·어깨뼈가 뚜렷하다",
      "마른 편이어도 프레임 때문에 슬림핏이 어색하다",
    ],
    principle: "힘 빼고 멋스럽게. 골격을 옷으로 자연스럽게 감싸고 러프한 핏과 내추럴 소재로 분위기를 만든다.",
    items: {
      neckline: {
        good: "헨리넥, 스탠드넥, 크루넥, 살짝 풀어진 셔츠 — 자연스럽게",
        avoid: "몸에 딱 붙는 목 라인, 과한 장식 넥 — 골격이 더 도드라짐",
      },
      shoulder: {
        good: "드롭숄더, 롤업, 와이드 슬리브 — 어깨 프레임을 자연스럽게 흐림",
        avoid: "딱 맞는 셋인, 퍼프 — 어깨를 강조해 우람해 보임",
      },
      top: {
        good: "오버핏·박시, 롱 기장, 셔츠 레이어드 — 프레임을 여유 있게 감쌈",
        avoid: "슬림핏, 크롭, 몸에 붙는 핏 — 골격·마른 느낌이 드러남",
      },
      bottom: {
        good: "와이드, 카고, 일자 데님(워싱 OK), 롱 기장 — 볼륨으로 균형",
        avoid: "스키니·슬림, 짧은 기장 — 다리 골격이 도드라짐",
      },
      dress: {
        good: "롱·박시 원피스, 셔츠 원피스, 린넨 원피스 — 여유 있는 것",
        avoid: "핏앤플레어, 바디라인 드러나는 원피스",
      },
      outer: {
        good: "오버핏 코트, 트러커, 야상, 롱 아우터 — 큰 옷이 멋스럽게 소화됨",
        avoid: "짧고 딱 붙는 재킷",
      },
      fabric: {
        good: "거칠고 자연스러운 소재 — 린넨, 데님, 코듀로이, 트위드, 헤비 코튼",
        avoid: "매끈·반짝이는 소재, 얇고 하늘거리는 것 — 겉돌고 어색함",
      },
      shoesBag: {
        good: "볼륨 있는 신발(워커·로퍼·청키), 큼직한 토트·숄더백 — 프레임과 균형",
        avoid: "가늘고 여리한 힐, 미니백 — 손·발 골격이 커 보임",
      },
      accessory: {
        good: "큼직하고 빈티지한 것, 우드·메탈, 굵은 체인",
        avoid: "자잘하고 여린 액세서리 — 손이 커 보임",
      },
    },
    mistakes: [
      "슬림핏으로 입어 골격과 마른 느낌이 도드라진다",
      "과한 우아함·반짝임으로 옷이 몸에서 겉돈다",
      "작은 소품을 들어 손·발 골격이 더 커 보인다",
    ],
    formulas: [
      "오버 셔츠 + 와이드 데님 + 청키 로퍼",
      "롱 셔츠 원피스 + 트러커 재킷 + 토트백",
      "박시 니트 + 카고 팬츠 + 워커",
    ],
  },
};

/* ── L2. 퍼스널컬러별 상세 ─────────────────────────────── */

export interface ColorGuide {
  bestColors: string[];  // 베스트 팔레트
  worstColors: string[]; // 피할 색
  metal: string;         // 어울리는 금속
  makeup: string;        // 메이크업 톤
  denim: string;         // 데님 워싱
  tip: string;           // 한 줄 팁
}

export const COLOR_GUIDE: Record<ColorType, ColorGuide> = {
  spring: {
    bestColors: ["코랄", "피치", "아이보리", "카멜", "라이트 옐로우", "애플 그린", "라이트 카키", "터콰이즈"],
    worstColors: ["블랙", "차콜", "버건디", "탁한 회색"],
    metal: "옐로우 골드",
    makeup: "코랄·피치 계열 블러셔와 립, 브라운 아이",
    denim: "밝고 맑은 라이트 워싱",
    tip: "맑고 밝은 따뜻함이 핵심. 새카만 블랙 대신 카멜·아이보리로 포인트.",
  },
  summer: {
    bestColors: ["로즈", "라벤더", "스카이 블루", "소프트 그레이", "오프화이트", "베이비 핑크", "민트", "연보라"],
    worstColors: ["머스타드", "카멜", "다크 브라운", "오렌지"],
    metal: "실버·화이트 골드",
    makeup: "로즈·핑크 계열, 차분한 톤",
    denim: "부드러운 라이트~미디엄 블루",
    tip: "흐릿하고 부드러운 파스텔. 쨍한 원색·노란기 강한 색은 피할 것.",
  },
  autumn: {
    bestColors: ["카멜", "올리브", "브라운", "머스타드", "테라코타", "카키", "딥 그린", "와인"],
    worstColors: ["형광색", "쨍한 핑크", "스카이 블루", "라벤더"],
    metal: "앤티크 골드",
    makeup: "브릭·테라코타 립, 브론즈·카키 아이",
    denim: "빈티지·짙은 워싱, 인디고",
    tip: "깊고 차분한 어스 컬러가 고급스럽다. 차가운 파스텔은 얼굴을 떠 보이게 함.",
  },
  winter: {
    bestColors: ["블랙", "퓨어 화이트", "네이비", "버건디", "그레이", "푸시아", "로열 블루", "에메랄드"],
    worstColors: ["카멜", "올리브", "베이지", "머스타드"],
    metal: "실버·플래티넘",
    makeup: "선명한 레드·푸시아 립, 또렷한 아이",
    denim: "진한 인디고·블랙 데님",
    tip: "선명한 색과 강한 대비가 어울린다. 흐린 웜컬러는 칙칙해 보임.",
  },
};

/* ── L3. 체형 × 컬러 12조합 (1차 초안 — 감수要) ─────────── */

export type CrossKey = `${BodyType}-${ColorType}`;

/** 조합별 한 줄 페르소나 + 시그니처 룩 (운영자 감수·확장 예정) */
export const CROSS_GUIDE: Partial<Record<CrossKey, { persona: string; signature: string }>> = {
  "straight-winter": { persona: "도시적이고 또렷한 카리스마", signature: "블랙 V넥 + 네이비 슬랙스 + 실버 액세서리" },
  "straight-autumn": { persona: "고급스러운 미니멀 베이식", signature: "카멜 셔츠 + 브라운 슬랙스 + 골드 포인트" },
  "wave-summer":     { persona: "부드럽고 사랑스러운 파스텔", signature: "로즈 크롭 가디건 + 하이웨스트 플레어 + 진주" },
  "wave-spring":     { persona: "화사하고 발랄한 러블리", signature: "코랄 퍼프 블라우스 + 아이보리 스커트" },
  "natural-autumn":  { persona: "멋스러운 빈티지 캐주얼", signature: "올리브 오버셔츠 + 인디고 와이드 + 워커" },
  "natural-summer":  { persona: "편안하고 시원한 내추럴", signature: "소프트그레이 박시 니트 + 라이트 데님" },
  // TODO(감수): 나머지 6조합 — straight-spring, straight-summer, wave-autumn, wave-winter, natural-spring, natural-winter
};

/* ── L4. 상황별 룩북 (1차 초안 — 감수·확장要) ──────────── */

export interface SituationLook {
  key: string;
  label: string;
  desc: string;
  /** 체형별 핵심 룩 한 줄 */
  byBody: Record<BodyType, string>;
}

export const SITUATION_LOOKBOOK: SituationLook[] = [
  {
    key: "reunion",
    label: "동창회",
    desc: "오랜만에 만나는 자리 — 과하지 않게, 그러나 \"잘 지낸다\" 인상을 주는 룩",
    byBody: {
      straight: "심플한 니트 원피스 + 트렌치 + 포인티드 슈즈 — 정갈하고 고급스럽게",
      wave: "하이웨스트 플레어 원피스 + 짧은 재킷 — 여성스럽고 화사하게",
      natural: "롱 셔츠 원피스 + 토트백 + 로퍼 — 힘 뺀 멋",
    },
  },
  {
    key: "guest",
    label: "결혼식 하객",
    desc: "튀지 않되 단정하고 격식 있게",
    byBody: {
      straight: "H라인 원피스 + 미니멀 클러치 — 라인을 살린 단정함",
      wave: "랩 원피스 + 가는 힐 — 부드러운 격식",
      natural: "셋업 슈트 + 구조감 가방 — 모던한 격식",
    },
  },
  {
    key: "school",
    label: "학부모 모임",
    desc: "단정하고 편안하되 신경 쓴 티가 나는 데일리 포멀",
    byBody: {
      straight: "베이식 셔츠 + 일자 슬랙스 + 로퍼",
      wave: "니트 + 플리츠 스커트 + 발레 플랫",
      natural: "오버 셔츠 + 와이드 슬랙스 + 로퍼",
    },
  },
  // TODO(감수): 데이트, 출근룩, 나들이, 여행 등 확장
];
