"use client";

import { IS_APPLY_READY } from "@/lib/consult";
import { track } from "@/lib/track";
import { BlockButton } from "./Editorial";

/* ── 홈 1:1 컨설팅 신청 CTA ──
   무료 진단을 넘어 "1:1 오프라인 컨설팅 신청"으로 잇는 깔때기.
   신청 폼이 준비되기 전엔 렌더하지 않는다(빈 링크 방지).
   디자인: 포인트 컬러 풀블록 — 홈에서 가장 강한 면. */
export default function ApplyCTA({ vars }: { vars: Record<string, string> }) {
  if (!IS_APPLY_READY) return null;
  void vars;
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

  return (
    <section
      className="-mx-5 lg:-mx-6"
      style={{
        marginTop: "44px",
        marginBottom: "10px",
        padding: "22px 20px 24px",
        backgroundColor: "var(--t-fill, #BFC266)",
        color: "var(--t-txt)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="ed-label">No.05 · Consulting</span>
        <span className="ed-label">1:1 · Offline</span>
      </div>
      <p className="ed-accent" style={{ fontSize: "44px", lineHeight: 1, margin: "26px 0 0" }}>
        1:1 Consulting
      </p>
      <h2 style={{ fontFamily: sans, fontWeight: 800, fontSize: "clamp(27px, 7.5vw, 32px)", letterSpacing: "-0.05em", lineHeight: 1.18, margin: "12px 0 12px", wordBreak: "keep-all" }}>
        화면 진단을 넘어,<br />직접 봐드릴게요
      </h2>
      <p style={{ fontFamily: sans, fontWeight: 500, fontSize: "14.5px", lineHeight: 1.7, opacity: 0.9, margin: "0 0 22px", maxWidth: "360px", wordBreak: "keep-all" }}>
        체형과 어울리는 색을 1:1로 함께 보고, 당신만의 코디로 번역해 드려요. 지금은 포트폴리오 멤버를 먼저 모시고 있어요.
      </p>
      <BlockButton
        href="/apply"
        tone="ink"
        onClick={() => track("consult_click", { where: "home", method: "apply" })}
      >
        1:1 컨설팅 신청하기
      </BlockButton>
    </section>
  );
}
