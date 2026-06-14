/* ══════════════════════════════════════════════════════════
   쇼핑 링크 — 검색 URL + 제휴(어필리에이트) 태그 슬롯
   현재: 단순 검색 URL (제휴 미가입 → 수수료 0)
   제휴 승인 후: 아래 AFFILIATE 설정만 채우면 전 링크에 추적 태그 자동 부착

   제휴 가입처(국내 패션):
   - 링크프라이스(linkprice) — 무신사·W컨셉 등 다수 입점, 가장 무난한 출발점
   - 쿠팡파트너스 — 쿠팡 패션
   - 텐핑/디비디비딥 등 CPS 네트워크
   승인 후 발급받는 추적 파라미터(서브아이디/uid 등)를 AFFILIATE에 입력.
══════════════════════════════════════════════════════════ */

interface AffiliateConfig {
  enabled: boolean;
  /** 링크프라이스 등에서 발급한 추적 파라미터 (예: { a_cd: "...", o_cd: "..." }) */
  params: Record<string, string>;
}

// TODO(제휴 승인 후): enabled true + params 채우기
const AFFILIATE: AffiliateConfig = {
  enabled: false,
  params: {},
};

function withAffiliate(url: string): string {
  if (!AFFILIATE.enabled) return url;
  const u = new URL(url);
  Object.entries(AFFILIATE.params).forEach(([k, v]) => u.searchParams.set(k, v));
  return u.toString();
}

export function getMusinsaUrl(keyword: string): string {
  return withAffiliate(`https://www.musinsa.com/search/musinsa/goods?q=${encodeURIComponent(keyword)}&gender=female`);
}

export function getZigzagUrl(keyword: string): string {
  return withAffiliate(`https://zigzag.kr/search?query=${encodeURIComponent(keyword)}`);
}

/* ── W컨셉 제휴 (링크프라이스 승인 완료) ──
   딥링크: bestmore.net/click.php?m=wconcept&a={제휴ID}&l=9999&l_cd1=3&l_cd2=0&tu={타겟URL}
   tu 에 W컨셉 URL을 인코딩해 넣으면 추적+수수료 적립. */
const WCONCEPT_AID = "A100705248";
export function wconceptLink(targetUrl: string): string {
  return `https://bestmore.net/click.php?m=wconcept&a=${WCONCEPT_AID}&l=9999&l_cd1=3&l_cd2=0&tu=${encodeURIComponent(targetUrl)}`;
}
export function getWConceptUrl(keyword: string): string {
  return wconceptLink(`https://www.wconcept.co.kr/Search?keyword=${encodeURIComponent(keyword)}`);
}

/** 29cm 검색 (제휴 후보 추가) */
export function get29cmUrl(keyword: string): string {
  return withAffiliate(`https://www.29cm.co.kr/search?keyword=${encodeURIComponent(keyword)}`);
}
