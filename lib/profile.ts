/* ══════════════════════════════════════════════════════════
   오늘핏 — 체형·퍼스널컬러 자가진단 프로필
   - 사진 없이 설문으로 골격(스트레이트/웨이브/내추럴) + 퍼스널컬러 4계절 진단
   - 결과는 localStorage 에만 저장 (서버 미전송)
   - 프로필은 /api/outfit 추천 프롬프트에 주입된다
══════════════════════════════════════════════════════════ */

export type BodyType = "straight" | "wave" | "natural";
export type ColorType = "spring" | "summer" | "autumn" | "winter";

export interface Profile {
  body: BodyType;
  color: ColorType;
  savedAt: string; // ISO
}

const KEY = "onulfit.profile.v1";

export function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p && p.body && p.color) return p as Profile;
    return null;
  } catch {
    return null;
  }
}

export function saveProfile(body: BodyType, color: ColorType): Profile {
  const profile: Profile = { body, color, savedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    /* storage 차단 시 무시 — 진단 결과는 이번 세션에서만 사용 */
  }
  return profile;
}

export function clearProfile(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch { /* noop */ }
}

/* ── 골격(체형) 메타 ──────────────────────────────────── */
export interface BodyMeta {
  key: BodyType;
  label: string;       // 표시명
  tagline: string;     // 한 줄 요약
  suits: string[];     // 어울리는 요소
  avoid: string[];     // 피하면 좋은 요소
  /** AI 프롬프트 주입용 가이드 (결의 안목) */
  promptGuide: string;
}

export const BODY_META: Record<BodyType, BodyMeta> = {
  straight: {
    key: "straight",
    label: "스트레이트",
    tagline: "탄탄하고 입체적인 상체, 고급스러운 직선 라인",
    suits: ["심플한 디자인", "고급 소재(실크·울)", "I라인 실루엣", "V넥·셔츠 칼라", "정석 핏"],
    avoid: ["과한 프릴·장식", "오버사이즈", "얇고 하늘거리는 소재", "로우웨스트"],
    promptGuide:
      "스트레이트(직선) 골격: 상체에 볼륨이 있고 입체적이며 탄탄함. 군더더기 없는 심플한 디자인, 고급스러운 소재, I라인 실루엣, V넥/셔츠칼라가 어울린다. 프릴·과한 디테일·오버사이즈·얇고 하늘거리는 소재는 부해 보이므로 피한다. 정석에 가까운 베이식한 핏으로 제안할 것.",
  },
  wave: {
    key: "wave",
    label: "웨이브",
    tagline: "부드럽고 곡선적인 몸, 하체에 무게중심",
    suits: ["부드러운 소재(니트·시폰)", "하이웨스트", "곡선·디테일", "세트업·핏앤플레어", "여성스러운 실루엣"],
    avoid: ["뻣뻣한 소재", "로우웨스트", "밋밋한 박시핏", "과하게 긴 기장"],
    promptGuide:
      "웨이브(곡선) 골격: 상체가 얇고 부드러우며 하체에 무게중심이 있음. 부드러운 소재, 하이웨스트로 허리를 강조, 곡선적이고 디테일 있는 디자인, 핏앤플레어가 어울린다. 뻣뻣한 소재·로우웨스트·밋밋한 박시핏·과하게 긴 기장은 피한다. 상체에 포인트를 주고 허리선을 살려 비율을 끌어올릴 것.",
  },
  natural: {
    key: "natural",
    label: "내추럴",
    tagline: "또렷한 골격과 프레임감, 러프한 멋",
    suits: ["오버사이즈·러프핏", "내추럴 소재(린넨·데님)", "레이어드", "롱기장", "캐주얼·빈티지"],
    avoid: ["몸에 딱 붙는 핏", "과한 우아함·반짝임", "지나치게 얌전한 디자인"],
    promptGuide:
      "내추럴 골격: 어깨·관절 등 골격 프레임이 또렷하고 큼. 오버사이즈·러프한 핏, 린넨·데님 등 내추럴 소재, 레이어드, 롱기장이 멋스럽게 소화된다. 몸에 딱 붙는 핏·과한 우아함·반짝이는 소재는 어색하므로 피한다. 적당히 풀어진 실루엣으로 프레임을 자연스럽게 살릴 것.",
  },
};

/* ── 퍼스널컬러 메타 ──────────────────────────────────── */
export interface ColorMeta {
  key: ColorType;
  label: string;
  tagline: string;
  palette: string[];   // 어울리는 대표 색 (한글명 — colors.ts와 호환)
  avoid: string[];
  swatch: string[];    // 표시용 hex — 실제 옷감 톤(2026-11-07 채도 낮춤)
  promptGuide: string;
}

export const COLOR_META: Record<ColorType, ColorMeta> = {
  spring: {
    key: "spring",
    label: "봄 웜",
    tagline: "맑고 화사한 따뜻함",
    palette: ["코랄", "아이보리", "카멜", "라이트 그레이", "머스타드"],
    avoid: ["블랙", "차콜", "다크 네이비"],
    swatch: ["#E2826C", "#EFC2A4", "#B98D63", "#A2AE6A"],
    promptGuide: "봄 웜톤: 맑고 밝은 따뜻한 색이 화사하게 어울림. 코랄·아이보리·카멜·머스타드 등 밝은 웜컬러 우선. 새카만 블랙·차가운 회색은 얼굴을 칙칙하게 만드니 지양.",
  },
  summer: {
    key: "summer",
    label: "여름 쿨",
    tagline: "부드럽고 시원한 파스텔",
    palette: ["로즈", "라벤더", "스카이 블루", "라이트 그레이", "오프화이트"],
    avoid: ["머스타드", "카멜", "다크 브라운"],
    swatch: ["#C07C88", "#AFA5CB", "#A5BFD6", "#BFBBB6"],
    promptGuide: "여름 쿨톤: 부드럽고 흐릿한 파스텔·쿨컬러가 어울림. 로즈·라벤더·스카이블루·소프트그레이 우선. 쨍한 원색이나 노란기 강한 웜컬러(머스타드·카멜)는 피함.",
  },
  autumn: {
    key: "autumn",
    label: "가을 웜",
    tagline: "깊고 그윽한 어스 톤",
    palette: ["카멜", "올리브", "브라운", "머스타드", "테라코타"],
    avoid: ["핑크", "스카이 블루", "라벤더"],
    swatch: ["#B98D63", "#6C7144", "#76533A", "#B0654B"],
    promptGuide: "가을 웜톤: 깊고 차분한 어스컬러가 고급스럽게 어울림. 카멜·올리브·브라운·테라코타 우선. 차가운 파스텔(핑크·스카이블루)은 얼굴을 떠 보이게 하니 지양.",
  },
  winter: {
    key: "winter",
    label: "겨울 쿨",
    tagline: "선명하고 또렷한 대비",
    palette: ["블랙", "화이트", "다크 네이비", "버건디", "그레이"],
    avoid: ["카멜", "올리브", "베이지"],
    swatch: ["#1E1D1C", "#F8F8F6", "#252F4A", "#672634"],
    promptGuide: "겨울 쿨톤: 선명하고 또렷한 색과 강한 대비가 어울림. 블랙·퓨어화이트·네이비·버건디 우선. 노란기 도는 흐린 웜컬러(카멜·올리브·베이지)는 칙칙해 보이니 지양.",
  },
};

/* ── 자가진단 설문 ────────────────────────────────────── */
/* 2026-11-09 전문가 관점 재점검
   - 손목: 일본식 골격진단 기준으로 바로잡음 (스트레이트=둥글고 도톰, 웨이브=납작하고 가늘다)
   - 어울렸던 옷: 정장 느낌 → 20대 데일리 옷으로
   - 컬러: 믿기 어려운 핏줄 문항을 빼고 립 컬러를 넣음. 명도 문항을 2개로(검정 옷·눈동자)
   - 모든 문항에 "잘 모르겠어요"(점수 0) — 억지로 고르면 결과가 더 흔들린다
   - 동점일 때는 믿을 만한 문항(손목·흰옷) 답을 따른다 */

export type BodyAnswer = BodyType | "unsure";
export type ColorValue = "warm" | "cool" | "light" | "deep";
export type ColorAnswer = ColorValue | "unsure";

export interface DiagQuestion {
  id: string;
  /** 한눈에 보기용 짧은 이름 (예: "손목") */
  short: string;
  /** 어떻게 확인하는지 한 줄 */
  hint: string;
  prompt: string;
  /** 점수 가중치 — 판단이 확실한 문항일수록 크다 */
  weight: number;
  /** 답마다 쉬운 설명 한 줄 */
  options: { label: string; value: BodyType | ColorValue; desc?: string }[];
}

/** 골격 진단 (5문항 → 가중 득표) */
export const BODY_QUESTIONS: DiagQuestion[] = [
  {
    id: "wrist",
    short: "손목뼈",
    hint: "손등을 위로 하고, 새끼손가락 쪽 손목에 있는 동그란 뼈를 보세요",
    prompt: "손목 바깥쪽 뼈(그림의 화살표)는 어떻게 보이나요?",
    weight: 1.3,
    options: [
      { label: "거의 안 보이고, 손목이 도톰하다", value: "straight", desc: "살이 탄탄하게 덮여 뼈가 잘 안 보이고, 손목이 둥글고 두께감 있어요" },
      { label: "작게 살짝 보이고, 손목이 가늘다", value: "wave", desc: "작은 뼈가 살짝 보이고, 손목이 가늘고 납작해요" },
      { label: "크게 툭 튀어나와 있다", value: "natural", desc: "뼈가 크고 단단하게 튀어나와 손목이 각져 보여요" },
    ],
  },
  {
    id: "upper",
    short: "상체 두께",
    hint: "거울 옆으로 서서, 가슴~등 두께를 보세요",
    prompt: "옆으로 서서 거울을 보면, 내 상체는?",
    weight: 1.2,
    options: [
      { label: "두툼하고 입체적이다", value: "straight", desc: "가슴이 높고 등도 두툼해요. 티셔츠를 입으면 상체가 꽉 차 보여요" },
      { label: "얇고 납작하다", value: "wave", desc: "앞뒤가 얇아 상체는 옷이 남고, 엉덩이·허벅지 쪽이 더 꽉 껴요" },
      { label: "두께보다 어깨 뼈대가 크다", value: "natural", desc: "두께는 보통인데, 어깨와 갈비뼈 프레임이 넓고 단단해요" },
    ],
  },
  {
    id: "collar",
    short: "쇄골·어깨",
    hint: "거울 앞에서 쇄골과 어깨뼈가 보이는 정도",
    prompt: "쇄골과 어깨를 보면?",
    weight: 1.1,
    options: [
      { label: "쇄골이 잘 안 보이고 어깨가 둥글다", value: "straight", desc: "살에 덮여 쇄골이 희미하고, 어깨선이 둥글게 떨어져요" },
      { label: "쇄골이 가늘게 비친다", value: "wave", desc: "가는 쇄골이 살짝 보이고, 어깨가 좁고 비스듬해요" },
      { label: "쇄골·어깨뼈가 뚜렷하게 드러난다", value: "natural", desc: "쇄골과 어깨 끝 뼈가 굵고 또렷해서 어깨가 각져 보여요" },
    ],
  },
  {
    id: "gain",
    short: "살 붙는 곳",
    hint: "살이 찔 때 어디부터 변했는지 떠올려보세요",
    prompt: "살이 찌면 주로 어디부터 변하나요?",
    weight: 1,
    options: [
      { label: "상체·윗배부터, 탄탄하게", value: "straight", desc: "얼굴·팔뚝·가슴·윗배에 먼저 붙고, 살이 단단해요" },
      { label: "하체·아랫배부터", value: "wave", desc: "엉덩이·허벅지·아랫배에 먼저 붙고, 살이 말랑해요" },
      { label: "티 안 나고 골격이 먼저 도드라진다", value: "natural", desc: "살보다 어깨·무릎 같은 뼈마디가 먼저 눈에 띄어요" },
    ],
  },
  {
    id: "compliment",
    short: "어울렸던 옷",
    hint: "‘잘 어울린다’는 말을 들었던 옷을 떠올려보세요",
    prompt: "\"잘 어울린다\"는 말을 들었던 옷은?",
    weight: 0.8,
    options: [
      { label: "깔끔한 베이직", value: "straight", desc: "셔츠·브이넥 니트·일자 데님처럼 군더더기 없는 옷" },
      { label: "부드럽고 여리여리한 옷", value: "wave", desc: "크롭 가디건·블라우스·플레어 스커트처럼 부드러운 옷" },
      { label: "툭 걸친 오버핏", value: "natural", desc: "오버핏 셔츠·와이드 데님·루즈 니트처럼 크고 편한 옷" },
    ],
  },
];

/** 퍼스널컬러 진단 (웜/쿨 3문항 + 밝기 2문항 → 4계절) */
export const COLOR_QUESTIONS: DiagQuestion[] = [
  {
    id: "metal",
    short: "금·은",
    hint: "금색·은색 액세서리(없으면 숟가락·포일)를 턱 밑에 대보세요",
    prompt: "얼굴 가까이 대보면 피부가 더 화사해지는 쪽은?",
    weight: 1,
    options: [
      { label: "골드(금색)", value: "warm", desc: "금색을 대면 생기가 돌고, 은색은 얼굴이 떠 보여요" },
      { label: "실버(은색)", value: "cool", desc: "은색을 대면 피부가 맑아지고, 금색은 누래 보여요" },
    ],
  },
  {
    id: "white",
    short: "흰옷",
    hint: "아이보리 옷과 새하얀 옷(흰 종이도 OK)을 번갈아 얼굴 밑에 대보세요",
    prompt: "얼굴 밑에 대봤을 때 피부가 더 맑아 보이는 흰색은?",
    weight: 1.3,
    options: [
      { label: "아이보리·크림색", value: "warm", desc: "새하얀 색은 얼굴이 창백하고 푸석해 보여요" },
      { label: "새하얀 순백", value: "cool", desc: "아이보리는 얼굴이 누렇고 텁텁해 보여요" },
    ],
  },
  {
    id: "lip",
    short: "립 컬러",
    hint: "‘오늘 생기 있어 보인다’는 말을 들었던 립·블러셔를 떠올려보세요",
    prompt: "바르면 혈색이 확 살아나는 립 색은?",
    weight: 1.1,
    options: [
      { label: "코랄·오렌지·브릭", value: "warm", desc: "핑크 계열은 입술만 동동 떠 보여요" },
      { label: "로즈·핑크·플럼", value: "cool", desc: "오렌지 계열은 얼굴이 노랗게 떠 보여요" },
    ],
  },
  {
    id: "black",
    short: "검정 옷",
    hint: "검정 니트나 티셔츠를 입고 거울을 봤던 때를 떠올려보세요",
    prompt: "검정 옷을 입으면 내 얼굴은?",
    weight: 1.2,
    options: [
      { label: "칙칙하고 그늘져 보인다", value: "light", desc: "다크서클·잡티가 도드라져서 밝은 색이 더 편해요" },
      { label: "또렷하고 세련돼 보인다", value: "deep", desc: "이목구비가 선명해지고 얼굴이 작아 보여요" },
    ],
  },
  {
    id: "eye",
    short: "눈동자",
    hint: "밝은 곳에서 거울을 가까이 — 눈썹·염색 전 머리색도 같이 보세요",
    prompt: "거울로 본 내 눈동자 색은?",
    weight: 1,
    options: [
      { label: "밝은 갈색, 부드러운 인상", value: "light", desc: "갈색빛이 돌고 흰자와의 경계가 부드러워요" },
      { label: "짙은 흑갈색, 또렷한 인상", value: "deep", desc: "검정에 가깝고 흰자와 대비가 선명해요" },
    ],
  },
];

/** 골격 답안 → 타입별 개수 ("잘 모르겠어요"는 빼고 센다) */
export function bodyTally(answers: BodyAnswer[]): Record<BodyType, number> {
  const tally: Record<BodyType, number> = { straight: 0, wave: 0, natural: 0 };
  answers.forEach((a) => { if (a !== "unsure") tally[a] += 1; });
  return tally;
}

/** 골격 답안(문항 순서대로) → BodyType. 가중 득표, 동점이면 앞 문항(손목→상체→쇄골…) 답을 따른다 */
export function scoreBody(answers: BodyAnswer[]): BodyType {
  const score: Record<BodyType, number> = { straight: 0, wave: 0, natural: 0 };
  answers.forEach((a, i) => { if (a !== "unsure") score[a] += BODY_QUESTIONS[i]?.weight ?? 1; });
  const max = Math.max(score.straight, score.wave, score.natural);
  const tied = (Object.keys(score) as BodyType[]).filter((t) => Math.abs(score[t] - max) < 1e-9);
  if (tied.length === 1) return tied[0];
  const first = answers.find((a): a is BodyType => a !== "unsure" && tied.includes(a));
  return first ?? tied[0];
}

/** 컬러 답안 → 웜/쿨·밝기 가중 점수 (결과 화면 막대에도 씀) */
export function colorScores(answers: ColorAnswer[]) {
  const s = { warm: 0, cool: 0, light: 0, deep: 0 };
  answers.forEach((a, i) => { if (a !== "unsure") s[a] += COLOR_QUESTIONS[i]?.weight ?? 1; });
  return s;
}

/** 컬러 답안(문항 순서대로) → ColorType.
    웜/쿨 동점(모두 모름 등)이면 흰옷 → 립 → 금은 순으로 답을 따르고, 그래도 없으면 웜.
    밝기 동점이면 밝은 쪽(봄·여름) — 부드러운 색은 틀려도 덜 어색하다 */
export function scoreColor(answers: ColorAnswer[]): ColorType {
  const s = colorScores(answers);
  let isWarm: boolean;
  if (s.warm !== s.cool) isWarm = s.warm > s.cool;
  else {
    const byId = (id: string) => answers[COLOR_QUESTIONS.findIndex((q) => q.id === id)];
    const pick = ["white", "lip", "metal"].map(byId).find((a) => a === "warm" || a === "cool");
    isWarm = pick ? pick === "warm" : true;
  }
  const isLight = s.light >= s.deep;
  if (isWarm) return isLight ? "spring" : "autumn";
  return isLight ? "summer" : "winter";
}
