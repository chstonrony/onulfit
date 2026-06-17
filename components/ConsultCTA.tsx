import { KAKAO_CHANNEL_URL, IS_CHANNEL_READY } from "@/lib/consult";

/* ── 1:1 진단 컨설팅 예약 CTA ──
   무료 진단/코디 결과 끝에 붙어, "정확한 1:1 진단"으로 연결하는 깔때기.
   카카오 채널 URL(NEXT_PUBLIC_KAKAO_CHANNEL_URL)이 설정되기 전엔 렌더하지 않는다(빈 링크 방지). */
export default function ConsultCTA() {
  if (!IS_CHANNEL_READY) return null;
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  return (
    <div
      style={{
        marginTop: "28px",
        padding: "22px 20px",
        backgroundColor: "var(--t-card)",
        border: "1px solid var(--t-acc)",
        borderRadius: "16px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontStyle: "italic",
          fontSize: "14px",
          color: "var(--t-acc)",
          margin: 0,
        }}
      >
        Personal consulting
      </p>
      <p
        style={{
          fontFamily: sans,
          fontSize: "17px",
          fontWeight: 600,
          color: "var(--t-txt)",
          margin: "6px 0 8px",
          lineHeight: 1.45,
          wordBreak: "keep-all",
        }}
      >
        결과가 더 궁금하세요?<br />1:1 진단으로 정확하게.
      </p>
      <p
        style={{
          fontFamily: sans,
          fontSize: "13.5px",
          color: "var(--t-sub)",
          lineHeight: 1.7,
          margin: "0 0 16px",
          wordBreak: "keep-all",
        }}
      >
        화면 속 진단을 넘어, 퍼스널컬러·체형을 직접 봐드려요. 나에게 맞는 색과 핏을 평생 쓰는 가이드로 정리해 드립니다.
      </p>
      <a
        href={KAKAO_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "7px",
          height: "48px",
          borderRadius: "12px",
          backgroundColor: "var(--t-acc)",
          color: "var(--t-bg)",
          fontFamily: sans,
          fontWeight: 600,
          fontSize: "14px",
          letterSpacing: "0.02em",
          textDecoration: "none",
        }}
      >
        카카오톡으로 1:1 진단 예약하기
      </a>
    </div>
  );
}
