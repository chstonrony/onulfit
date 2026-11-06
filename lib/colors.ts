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
  /* 2026-11-07 코디 보드용 — 자주 나오는 패션 색 */
  "오트밀": "#D9CDB8",
  "탄": "#B08A63",
  "모카 브라운": "#7E5E45",
  "웜 베이지": "#CDB596",
  "누드 베이지": "#D8BFA6",
  "샴페인 베이지": "#E3D3B5",
  "카멜 베이지": "#C9A97E",
  "골드": "#C9A24E",
  "로즈 골드": "#C99A86",
  "화이트 골드": "#E6DCC3",
  "실버": "#BFC1C2",
  "펄": "#EEE9E0",
  "딥 네이비": "#14213D",
  "인디고": "#2E3A6B",
  "데님": "#5B7896",
  "중청": "#6D8BAA",
  "진청": "#2F4563",
  "그린": "#5E7D5A",
  "세이지 그린": "#9BAA8A",
  "포레스트": "#2F4A35",
  "옐로우": "#E8C65A",
  "버터 옐로우": "#F1DF9C",
  "레드": "#B23A2E",
  "와인": "#5E2129",
  "코랄": "#E58B76",
  "퍼플": "#6B4E86",
  "멜란지": "#B9B6B1",
  "토프": "#8B7D6B",
  "코냑": "#9A5B34",
  "에크루": "#EAE2CF",
};

export function getColorHex(colorName: string): string {
  const normalized = colorName.trim().replace(/\s+/g, " ");

  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];

  // 이름 안에 든 색 중 가장 긴 것(예: "카멜 브라운"은 "카멜"보다 "카멜 브라운")
  let best = "";
  for (const key of Object.keys(COLOR_MAP)) {
    if (normalized.includes(key) && key.length > best.length) best = key;
  }
  if (best) return COLOR_MAP[best];
  for (const [key, value] of Object.entries(COLOR_MAP)) {
    if (key.includes(normalized)) return value;
  }

  return "#B8AFA6";
}

/** 무늬 옷의 줄 색 — 색 이름에 색이 둘 이상이면(예: "화이트 네이비 스트라이프") 두 번째 색. 없으면 null */
export function getLineColorHex(colorName: string): string | null {
  const text = colorName.trim().replace(/\s+/g, " ");
  const found: { at: number; key: string }[] = [];
  // 긴 이름부터 찾고, 이미 찾은 자리와 겹치면 건너뛴다
  for (const key of Object.keys(COLOR_MAP).sort((a, b) => b.length - a.length)) {
    const at = text.indexOf(key);
    if (at < 0) continue;
    if (found.some((f) => at < f.at + f.key.length && f.at < at + key.length)) continue;
    found.push({ at, key });
  }
  found.sort((a, b) => a.at - b.at);
  return found.length > 1 ? COLOR_MAP[found[1].key] : null;
}
