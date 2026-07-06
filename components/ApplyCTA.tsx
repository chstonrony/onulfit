import { IS_APPLY_READY } from "@/lib/consult";

/* ── 홈 1:1 진단 신청 CTA ──
   인스타 bio 링크가 도착하는 홈에서, 무료 진단을 넘어 "1:1 오프라인 컨설팅 신청"으로 잇는 깔때기.
   신청 폼 링크(NEXT_PUBLIC_APPLY_URL)가 설정되기 전엔 렌더하지 않는다(빈 링크 방지). */
export default function ApplyCTA({ vars }: { vars: Record<string, string> }) {
  if (!IS_APPLY_READY) return null;
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const acc = vars["--t-acc"];

  return (
    <div
      style={{
        margin: "26px 0 14px",
        padding: "26px 22px",
        backgroundColor: "var(--t-card)",
        border: `1px solid ${acc}`,
        borderRadius: "18px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontStyle: "italic",
          fontSize: "14px",
          letterSpacing: "0.04em",
          color: acc,
          margin: 0,
        }}
      >
        1:1 Consulting
      </p>
      <p
        style={{
          fontFamily: "var(--font-gowun), 'Batang', serif",
          fontSize: "21px",
          fontWeight: 400,
          color: "var(--t-txt)",
          margin: "9px 0 9px",
          lineHeight: 1.5,
          wordBreak: "keep-all",
        }}
      >
        화면 진단을 넘어,<br />직접 봐드릴게요
      </p>
      <p
        style={{
          fontFamily: sans,
          fontSize: "13.5px",
          color: "var(--t-sub)",
          lineHeight: 1.75,
          margin: "0 auto 18px",
          maxWidth: "320px",
          wordBreak: "keep-all",
        }}
      >
        퍼스널컬러와 체형을 1:1로 진단하고, 당신만의 코디로 번역해 드려요. 7월, 포트폴리오 멤버를 먼저 모십니다.
      </p>
      <a
        href="/apply"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "7px",
          height: "50px",
          borderRadius: "13px",
          backgroundColor: acc,
          color: "var(--t-bg)",
          fontFamily: sans,
          fontWeight: 600,
          fontSize: "14px",
          letterSpacing: "0.02em",
          textDecoration: "none",
        }}
      >
        1:1 진단 신청하기 →
      </a>
    </div>
  );
}
