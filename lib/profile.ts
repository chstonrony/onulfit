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
  swatch: string[];    // 표시용 hex
  promptGuide: string;
}

export const COLOR_META: Record<ColorType, ColorMeta> = {
  spring: {
    key: "spring",
    label: "봄 웜",
    tagline: "맑고 화사한 따뜻함",
    palette: ["코랄", "아이보리", "카멜", "라이트 그레이", "머스타드"],
    avoid: ["블랙", "차콜", "다크 네이비"],
    swatch: ["#F5A38C", "#F5F0E8", "#C19A6B", "#D4A830"],
    promptGuide: "봄 웜톤: 맑고 밝은 따뜻한 색이 화사하게 어울림. 코랄·아이보리·카멜·머스타드 등 밝은 웜컬러 우선. 새카만 블랙·차가운 회색은 얼굴을 칙칙하게 만드니 지양.",
  },
  summer: {
    key: "summer",
    label: "여름 쿨",
    tagline: "부드럽고 시원한 파스텔",
    palette: ["로즈", "라벤더", "스카이 블루", "라이트 그레이", "오프화이트"],
    avoid: ["머스타드", "카멜", "다크 브라운"],
    swatch: ["#C4978A", "#C4B8E0", "#A8C5D8", "#D0CCC8"],
    promptGuide: "여름 쿨톤: 부드럽고 흐릿한 파스텔·쿨컬러가 어울림. 로즈·라벤더·스카이블루·소프트그레이 우선. 쨍한 원색이나 노란기 강한 웜컬러(머스타드·카멜)는 피함.",
  },
  autumn: {
    key: "autumn",
    label: "가을 웜",
    tagline: "깊고 그윽한 어스 톤",
    palette: ["카멜", "올리브", "브라운", "머스타드", "테라코타"],
    avoid: ["핑크", "스카이 블루", "라벤더"],
    swatch: ["#C19A6B", "#6B7A3E", "#795548", "#C4704A"],
    promptGuide: "가을 웜톤: 깊고 차분한 어스컬러가 고급스럽게 어울림. 카멜·올리브·브라운·테라코타 우선. 차가운 파스텔(핑크·스카이블루)은 얼굴을 떠 보이게 하니 지양.",
  },
  winter: {
    key: "winter",
    label: "겨울 쿨",
    tagline: "선명하고 또렷한 대비",
    palette: ["블랙", "화이트", "다크 네이비", "버건디", "그레이"],
    avoid: ["카멜", "올리브", "베이지"],
    swatch: ["#1C1A18", "#F8F8F6", "#0F1C34", "#722F37"],
    promptGuide: "겨울 쿨톤: 선명하고 또렷한 색과 강한 대비가 어울림. 블랙·퓨어화이트·네이비·버건디 우선. 노란기 도는 흐린 웜컬러(카멜·올리브·베이지)는 칙칙해 보이니 지양.",
  },
};

/* ── 자가진단 설문 ────────────────────────────────────── */
export interface DiagQuestion {
  id: string;
  prompt: string;
  options: { label: string; value: BodyType | "warm" | "cool" | "light" | "deep" }[];
}

/** 골격 진단 (5문항 → 최다 득표 타입) */
export const BODY_QUESTIONS: DiagQuestion[] = [
  {
    id: "wrist",
    prompt: "손목을 반대 손으로 감싸 쥐었을 때, 만져지는 느낌은?",
    options: [
      { label: "납작하고 단단하다", value: "straight" },
      { label: "동그랗고 가늘다", value: "wave" },
      { label: "크고 각진 뼈가 도드라진다", value: "natural" },
    ],
  },
  {
    id: "gain",
    prompt: "살이 찌면 주로 어디부터 변하나요?",
    options: [
      { label: "상체·얼굴부터, 탄탄하게", value: "straight" },
      { label: "하체·아랫배부터", value: "wave" },
      { label: "티 안 나고 골격이 먼저 도드라진다", value: "natural" },
    ],
  },
  {
    id: "upper",
    prompt: "옆에서 본 상체(가슴~등) 두께는?",
    options: [
      { label: "두껍고 입체적이다", value: "straight" },
      { label: "얇은 편이다", value: "wave" },
      { label: "보통인데 어깨 프레임이 크다", value: "natural" },
    ],
  },
  {
    id: "collar",
    prompt: "쇄골과 어깨를 보면?",
    options: [
      { label: "쇄골이 잘 안 보이고 어깨가 둥글다", value: "straight" },
      { label: "쇄골이 가늘게 비친다", value: "wave" },
      { label: "쇄골·어깨뼈가 뚜렷하게 드러난다", value: "natural" },
    ],
  },
  {
    id: "compliment",
    prompt: "\"잘 어울린다\"는 말을 들었던 옷은?",
    options: [
      { label: "심플하고 고급스러운 정장 느낌", value: "straight" },
      { label: "부드럽고 하늘하늘한 여성스러운 옷", value: "wave" },
      { label: "캐주얼하고 편한 오버핏", value: "natural" },
    ],
  },
];

/** 퍼스널컬러 진단 (웜/쿨 4문항 + 명도 2문항 → 4계절) */
export const COLOR_QUESTIONS: DiagQuestion[] = [
  {
    id: "vein",
    prompt: "손목 안쪽 핏줄 색에 가까운 것은?",
    options: [
      { label: "초록빛이 돈다", value: "warm" },
      { label: "푸른빛·보랏빛이 돈다", value: "cool" },
    ],
  },
  {
    id: "metal",
    prompt: "얼굴에 대보면 더 화사해지는 액세서리는?",
    options: [
      { label: "골드(금색)", value: "warm" },
      { label: "실버(은색)", value: "cool" },
    ],
  },
  {
    id: "white",
    prompt: "흰옷을 입으면?",
    options: [
      { label: "아이보리·크림색이 더 잘 받는다", value: "warm" },
      { label: "새하얀 순백이 더 잘 받는다", value: "cool" },
    ],
  },
  {
    id: "face",
    prompt: "얼굴이 유독 화사해 보이는 색 계열은?",
    options: [
      { label: "코랄·카멜·올리브", value: "warm" },
      { label: "핑크·블루·라벤더", value: "cool" },
    ],
  },
  {
    id: "depth",
    prompt: "어울린다는 말을 더 많이 들은 쪽은?",
    options: [
      { label: "밝고 맑은 색", value: "light" },
      { label: "선명하거나 깊은 색", value: "deep" },
    ],
  },
];

/** 골격 답안 → BodyType (최다 득표, 동점 시 우선순위 straight>wave>natural) */
export function scoreBody(answers: BodyType[]): BodyType {
  const tally: Record<BodyType, number> = { straight: 0, wave: 0, natural: 0 };
  answers.forEach((a) => { tally[a] += 1; });
  const order: BodyType[] = ["straight", "wave", "natural"];
  return order.reduce((best, t) => (tally[t] > tally[best] ? t : best), order[0]);
}

/** 컬러 답안(warm/cool + light/deep) → ColorType */
export function scoreColor(answers: ("warm" | "cool" | "light" | "deep")[]): ColorType {
  const warm = answers.filter((a) => a === "warm").length;
  const cool = answers.filter((a) => a === "cool").length;
  const isWarm = warm >= cool;
  const isLight = answers.includes("light") && !answers.includes("deep")
    ? true
    : answers.lastIndexOf("light") >= answers.lastIndexOf("deep");
  if (isWarm) return isLight ? "spring" : "autumn";
  return isLight ? "summer" : "winter";
}
