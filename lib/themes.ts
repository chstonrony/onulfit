export type MoodKey = "everyday" | "gather" | "presence" | "allure" | "shine";

export interface PaletteColor {
  name: string;
  hex: string;
}

export interface Theme {
  key: MoodKey;
  name: string;
  dot: string;
  palette: PaletteColor[];
  vars: Record<string, string>;
}

/* ── CSS 변수 키 가이드 ──────────────────────────────
  --t-bg      : 전체 배경
  --t-side    : 사이드바 배경
  --t-bdr     : 테두리
  --t-bu      : 사용자 말풍선 배경
  --t-bai     : AI 말풍선 배경
  --t-baib    : AI 말풍선 테두리
  --t-card    : 카드/패널 배경
  --t-rsec    : Overall Look 섹션 배경
  --t-acc     : 포인트 컬러 (버튼 활성화, 강조)
  --t-txt     : 본문 텍스트
  --t-sub     : 보조 텍스트
  --t-inp     : 입력창 배경
  --t-sk1/2   : 스켈레톤 그라디언트
  --t-warm    : 웜 미드톤 (구분선 등)
─────────────────────────────────────────────────── */

export const THEMES: Record<MoodKey, Theme> = {

  /* ── EVERYDAY: 크림 베이지 ── */
  everyday: {
    key: "everyday",
    name: "Everyday",
    dot: "#E8DDD0",
    palette: [
      { name: "베이지",   hex: "#C9B99A" },
      { name: "모카",    hex: "#7A5C4E" },
      { name: "카키",    hex: "#8A8A68" },
      { name: "크림",    hex: "#F8F3EC" },
      { name: "그레이지", hex: "#B0AAA2" },
      { name: "오트밀",  hex: "#D2C6AE" },
    ],
    vars: {
      "--t-bg":   "#FAF8F5",
      "--t-side": "#F0EBE3",
      "--t-bdr":  "#E5E0D8",
      "--t-bu":   "#E8DDD0",
      "--t-bai":  "#FFFFFF",
      "--t-baib": "#E5E0D8",
      "--t-card": "#FFFFFF",
      "--t-rsec": "#F7F3EF",
      "--t-acc":  "#2C2825",
      "--t-txt":  "#2C2825",
      "--t-sub":  "#9B8E85",
      "--t-inp":  "#FFFFFF",
      "--t-sk1":  "rgba(229,224,216,0.50)",
      "--t-sk2":  "rgba(229,224,216,0.90)",
      "--t-warm": "#C4A882",
    },
  },

  /* ── GATHER: 웜 어스 베이지 ── */
  gather: {
    key: "gather",
    name: "Gather",
    dot: "#D5CCBE",
    palette: [
      { name: "라벤더",   hex: "#C4B8D4" },
      { name: "더스티로즈", hex: "#C49090" },
      { name: "카멜",    hex: "#C4945A" },
      { name: "아이보리",  hex: "#F5EFDF" },
      { name: "세이지",   hex: "#8FA88A" },
      { name: "웜베이지",  hex: "#D4C4A8" },
    ],
    vars: {
      "--t-bg":   "#F5EFE6",
      "--t-side": "#EAE3D8",
      "--t-bdr":  "#D8D0C4",
      "--t-bu":   "#DDD5C8",
      "--t-bai":  "#FFFFFF",
      "--t-baib": "#D8D0C4",
      "--t-card": "#FFFFFF",
      "--t-rsec": "#EDE5DA",
      "--t-acc":  "#2C2825",
      "--t-txt":  "#2C2825",
      "--t-sub":  "#9B8E85",
      "--t-inp":  "#FFFFFF",
      "--t-sk1":  "rgba(216,208,196,0.50)",
      "--t-sk2":  "rgba(216,208,196,0.90)",
      "--t-warm": "#C4A882",
    },
  },

  /* ── PRESENCE: 딥 모카 ── */
  presence: {
    key: "presence",
    name: "Presence",
    dot: "#C4A882",
    palette: [
      { name: "네이비",   hex: "#1A2840" },
      { name: "차콜",    hex: "#3A3A3A" },
      { name: "버건디",   hex: "#6A2535" },
      { name: "다크그린",  hex: "#2A3828" },
      { name: "카멜",    hex: "#C4945A" },
      { name: "크림",    hex: "#F8F3EC" },
    ],
    vars: {
      "--t-bg":   "#2C2825",
      "--t-side": "#1E1A17",
      "--t-bdr":  "rgba(250,248,245,0.12)",
      "--t-bu":   "#3D3530",
      "--t-bai":  "#342E2A",
      "--t-baib": "rgba(250,248,245,0.15)",
      "--t-card": "#342E2A",
      "--t-rsec": "#252220",
      "--t-acc":  "#FAF8F5",
      "--t-txt":  "#FAF8F5",
      "--t-sub":  "rgba(250,248,245,0.45)",
      "--t-inp":  "#302A26",
      "--t-sk1":  "rgba(250,248,245,0.05)",
      "--t-sk2":  "rgba(250,248,245,0.12)",
      "--t-warm": "#C4A882",
    },
  },

  /* ── ALLURE: 미드나잇 버건디 ── */
  allure: {
    key: "allure",
    name: "Allure",
    dot: "#D4A5A5",
    palette: [
      { name: "로즈누드",  hex: "#C48878" },
      { name: "더스티핑크", hex: "#D4A0A0" },
      { name: "모브",    hex: "#B07888" },
      { name: "샴페인",   hex: "#EED8B0" },
      { name: "실버",    hex: "#C4C4C4" },
      { name: "블러시",   hex: "#EEB8B8" },
    ],
    vars: {
      "--t-bg":   "#3A1020",
      "--t-side": "#2A0D1A",
      "--t-bdr":  "rgba(212,165,165,0.22)",
      "--t-bu":   "#4A1528",
      "--t-bai":  "#3F1220",
      "--t-baib": "rgba(212,165,165,0.28)",
      "--t-card": "#3F1220",
      "--t-rsec": "#330E1C",
      "--t-acc":  "#D4A5A5",
      "--t-txt":  "#F5D5E0",
      "--t-sub":  "rgba(245,213,224,0.50)",
      "--t-inp":  "#3F1220",
      "--t-sk1":  "rgba(212,165,165,0.07)",
      "--t-sk2":  "rgba(212,165,165,0.15)",
      "--t-warm": "#D4A5A5",
    },
  },

  /* ── SHINE: 블랙 + 골드 ── */
  shine: {
    key: "shine",
    name: "Shine",
    dot: "#C9A96E",
    palette: [
      { name: "딥블랙",   hex: "#0C0C0C" },
      { name: "골드",    hex: "#C9A96E" },
      { name: "버건디",   hex: "#6A2535" },
      { name: "미드나잇",  hex: "#0A1828" },
      { name: "실버",    hex: "#C0C0C0" },
      { name: "딥레드",   hex: "#8A1A28" },
    ],
    vars: {
      "--t-bg":   "#0E0E0E",
      "--t-side": "#0A0A0A",
      "--t-bdr":  "rgba(201,169,110,0.22)",
      "--t-bu":   "#1A1A1A",
      "--t-bai":  "#161616",
      "--t-baib": "rgba(201,169,110,0.28)",
      "--t-card": "#161616",
      "--t-rsec": "#131313",
      "--t-acc":  "#C9A96E",
      "--t-txt":  "#C9A96E",
      "--t-sub":  "rgba(201,169,110,0.50)",
      "--t-inp":  "#161616",
      "--t-sk1":  "rgba(201,169,110,0.05)",
      "--t-sk2":  "rgba(201,169,110,0.12)",
      "--t-warm": "#C9A96E",
    },
  },
};

export const MOOD_ORDER: MoodKey[] = ["everyday", "gather", "presence", "allure", "shine"];
export const DEFAULT_MOOD: MoodKey = "everyday";
