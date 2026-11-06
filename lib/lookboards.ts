/* ══════════════════════════════════════════════════════════
   오늘핏 — 룩북/비주얼 소스
   ① 핀터레스트 검색 딥링크: 승인·큐레이션 없이 지금 바로 작동 (합법 링크아웃)
   ② 핀터레스트 보드 임베드: 운영자가 보드를 만들어 URL을 넣으면 사이트에 임베드
      (핀터레스트 공식 embed 위젯 — 저작권/호스팅 문제 없음)

   ※ 인플루언서/모델 사진 직접 호스팅 금지(저작권). 위 두 방식만 사용.
══════════════════════════════════════════════════════════ */

import type { BodyType, ColorType } from "./profile";
import { BODY_META, COLOR_META } from "./profile";
import { trendSeasonTag, currentSeason, dayNumber, SEASON_LABEL, type Season } from "./lookRecipes";

export function pinterestSearchUrl(query: string): string {
  return `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
}

/* ── 계절 트렌드 키워드 (날짜마다 2개씩 돌아가며 노출 — 사람이 바꾸지 않아도 매일 새 버튼) ──
   더 넣고 싶으면 계절 목록에 [버튼 이름, 핀터레스트 검색어]를 한 줄씩 추가 */
const TREND_POOL: Record<Season, [string, string][]> = {
  winter: [
    ["롱코트 코디", "롱코트 코디 여성"],
    ["니트 레이어드", "니트 레이어드 코디 여성"],
    ["롱부츠 코디", "롱부츠 코디 여성 겨울"],
    ["머플러 스타일링", "머플러 스타일링 여성"],
    ["연말 모임룩", "연말 모임 코디 여성"],
    ["무스탕 코디", "무스탕 코디 여성"],
    ["숏패딩 코디", "숏패딩 코디 여성"],
    ["트위드 재킷", "트위드 자켓 코디 여성"],
  ],
  spring: [
    ["트렌치코트 코디", "트렌치코트 코디 여성"],
    ["봄 가디건", "봄 가디건 코디 여성"],
    ["플리츠 스커트", "플리츠 스커트 코디 여성"],
    ["봄 출근룩", "봄 출근룩 여성"],
    ["하객룩", "봄 하객룩 여성"],
    ["데님 셔츠", "데님 셔츠 코디 여성"],
  ],
  summer: [
    ["린넨 셔츠 코디", "린넨 셔츠 코디 여성"],
    ["여름 원피스", "여름 원피스 코디 여성"],
    ["샌들 코디", "샌들 코디 여성"],
    ["휴양지룩", "휴양지룩 여성"],
    ["여름 출근룩", "여름 출근룩 여성"],
    ["슬리브리스 니트", "슬리브리스 니트 코디 여성"],
  ],
  autumn: [
    ["블레이저 코디", "블레이저 코디 여성 가을"],
    ["가을 니트 베스트", "니트 베스트 코디 여성"],
    ["스웨이드 재킷", "스웨이드 자켓 코디 여성"],
    ["가을 트렌치", "가을 트렌치코트 코디 여성"],
    ["앵클부츠 코디", "앵클부츠 코디 여성"],
    ["가을 출근룩", "가을 출근룩 여성"],
  ],
};

/** 골격·컬러·계절 기반 핀터레스트 검색 칩 (링크아웃) — 계절·날짜에 따라 자동으로 바뀜 */
export function lookboardChips(body?: BodyType, color?: ColorType, d = new Date()): { label: string; url: string }[] {
  const chips: { label: string; url: string }[] = [];
  const season = currentSeason(d);
  const sKo = SEASON_LABEL[season].ko; // 겨울·봄…
  if (body) {
    const b = BODY_META[body].label;
    chips.push({ label: `${b} 체형 ${sKo} 코디`, url: pinterestSearchUrl(`${b} 체형 ${sKo} 코디 여성`) });
  }
  if (color) {
    const c = COLOR_META[color].label;
    chips.push({ label: `${c} ${sKo} 코디`, url: pinterestSearchUrl(`${c} 퍼스널컬러 ${sKo} 코디`) });
  }
  if (body && color) {
    chips.push({
      label: `${BODY_META[body].label} × ${COLOR_META[color].label}`,
      url: pinterestSearchUrl(`${BODY_META[body].label} 체형 ${COLOR_META[color].label} ${sKo} 코디`),
    });
  }
  // 시즌 트렌드 — 예: 2026 FW (날짜 기준)
  const tag = trendSeasonTag(d);
  chips.push({ label: `${tag} 트렌드`, url: pinterestSearchUrl(`${tag.toLowerCase()} women fashion trend outfit`) });
  // 오늘의 트렌드 키워드 2개 — 매일 바뀜
  const pool = TREND_POOL[season];
  const day = dayNumber(d);
  for (const k of [day % pool.length, (day + 1) % pool.length]) {
    const [label, q] = pool[k];
    chips.push({ label, url: pinterestSearchUrl(q) });
  }
  return chips;
}

/* ── 운영자 큐레이션 보드 (URL 넣으면 임베드 활성화) ──────
   핀터레스트에서 보드 만들기 → 보드 페이지 URL 복사 → 아래에 붙여넣기.
   빈 문자열이면 임베드 대신 검색 링크아웃만 노출된다. */
export const CURATED_BOARDS: {
  trend: string;
  byBody: Record<BodyType, string>;
} = {
  trend: "", // 예: "https://www.pinterest.com/<계정>/2026-fw-trend/"
  byBody: {
    straight: "",
    wave: "",
    natural: "",
  },
};
