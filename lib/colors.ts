const COLOR_MAP: Record<string, string> = {
  "아이보리": "#F5F0E8",
  "아이보리 화이트": "#F5F0E8",
  "오프화이트": "#F2EDE4",
  "화이트": "#F8F8F6",
  "블랙": "#1C1A18",
  "네이비": "#1B2A4A",
  "다크 네이비": "#0F1C34",
  "베이지": "#D4C5A9",
  "연베이지": "#E0D5C0",
  "화이트 베이지": "#F0EBE0",
  "이너 베이지": "#D4C5A9",
  "카멜": "#C19A6B",
  "버건디": "#722F37",
  "올리브": "#6B7A3E",
  "다크 올리브": "#4A5A2A",
  "카키": "#8A8A60",
  "그레이": "#9E9E9E",
  "라이트 그레이": "#D0CCC8",
  "다크 그레이": "#555050",
  "차콜": "#3A3530",
  "브라운": "#795548",
  "다크 브라운": "#4E342E",
  "초콜릿": "#4A2F28",
  "크림": "#EDE7D5",
  "모카": "#9E7B5A",
  "연청": "#A8C5D8",
  "스카이 블루": "#A8C5D8",
  "블루": "#3B6EA5",
  "로즈": "#C4978A",
  "핑크": "#E8B4B8",
  "세이지": "#87A878",
  "민트": "#A8CFC0",
  "테라코타": "#C4704A",
  "라벤더": "#C4B8E0",
  "머스타드": "#D4A830",
  "캐럿": "#E07A40",
};

export function getColorHex(colorName: string): string {
  const normalized = colorName.trim().replace(/\s+/g, " ");

  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];

  for (const [key, value] of Object.entries(COLOR_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) return value;
  }

  return "#B8AFA6";
}
