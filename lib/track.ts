/* ── GA4 이벤트 ──
   어디서 진단·상담으로 넘어가는지 숫자로 보기 위한 최소 이벤트.
   - diag_open      : 자가진단 오버레이 열림 (where: home | guide | profile_chip)
   - diag_start     : 인트로에서 "시작" 누름
   - diag_complete  : 진단 결과까지 완료 (body, color)
   - consult_click  : 1:1 상담 신청/카톡 버튼 클릭 (where, method: apply | kakao)
   - generate_lead  : 신청서 전송 성공 (app/apply/page.tsx)
   개인정보(이름·연락처)는 절대 보내지 않는다. */
export function track(name: string, params: Record<string, string | number> = {}) {
  try {
    /* components/Analytics.tsx 가 만든 dataLayer 에 넣는다 (gtag.js 가 늦게 와도 줄 서 있다가 전송) */
    const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
    if (typeof w.gtag === "function") {
      w.gtag("event", name, params);
    } else {
      // gtag 규칙: arguments 객체 모양으로 넣어야 한다
      w.dataLayer = w.dataLayer || [];
      const q = w.dataLayer;
      (function () { q.push(arguments); } as (...a: unknown[]) => void)("event", name, params);
    }
  } catch {
    /* GA가 아직 없거나 차단돼도 화면 동작에는 영향 없음 */
  }
}
