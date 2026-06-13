/* ══════════════════════════════════════════════════════════
   오늘핏 — 룩북/비주얼 소스
   ① 핀터레스트 검색 딥링크: 승인·큐레이션 없이 지금 바로 작동 (합법 링크아웃)
   ② 핀터레스트 보드 임베드: 운영자가 보드를 만들어 URL을 넣으면 사이트에 임베드
      (핀터레스트 공식 embed 위젯 — 저작권/호스팅 문제 없음)

   ※ 인플루언서/모델 사진 직접 호스팅 금지(저작권). 위 두 방식만 사용.
══════════════════════════════════════════════════════════ */

import type { BodyType, ColorType } from "./profile";
import { BODY_META, COLOR_META } from "./profile";

export function pinterestSearchUrl(query: string): string {
  return `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
}

/** 골격·컬러·상황 기반 핀터레스트 검색 칩 (링크아웃) */
export function lookboardChips(body?: BodyType, color?: ColorType): { label: string; url: string }[] {
  const chips: { label: string; url: string }[] = [];
  if (body) {
    const b = BODY_META[body].label;
    chips.push({ label: `${b} 체형 코디`, url: pinterestSearchUrl(`${b} 체형 코디 여성`) });
  }
  if (color) {
    const c = COLOR_META[color].label;
    chips.push({ label: `${c} 코디`, url: pinterestSearchUrl(`${c} 퍼스널컬러 코디`) });
  }
  if (body && color) {
    chips.push({
      label: `${BODY_META[body].label} × ${COLOR_META[color].label}`,
      url: pinterestSearchUrl(`${BODY_META[body].label} 체형 ${COLOR_META[color].label} 코디`),
    });
  }
  // 트렌드(시즌) — 편집 키워드
  chips.push({ label: "2025 SS 트렌드", url: pinterestSearchUrl("2025 ss women fashion trend outfit") });
  return chips;
}

/* ── 운영자 큐레이션 보드 (URL 넣으면 임베드 활성화) ──────
   핀터레스트에서 보드 만들기 → 보드 페이지 URL 복사 → 아래에 붙여넣기.
   빈 문자열이면 임베드 대신 검색 링크아웃만 노출된다. */
export const CURATED_BOARDS: {
  trend: string;
  byBody: Record<BodyType, string>;
} = {
  trend: "", // 예: "https://www.pinterest.com/<계정>/2025-ss-trend/"
  byBody: {
    straight: "",
    wave: "",
    natural: "",
  },
};
