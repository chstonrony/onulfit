import Link from "next/link";
import { KAKAO_CHANNEL_URL, IS_CHANNEL_READY, OPERATOR, CONTACT_EMAIL } from "@/lib/consult";

/* ── 모든 화면 공통 하단 (2026-11-08) ──
   개인정보처리방침은 누구나 쉽게 볼 수 있어야 해서 모든 화면 맨 아래에 둔다.
   사업자 등록 후 상호·대표자·사업자번호·연락처를 여기에 더할 것. */

const INK = "var(--t-txt, #1D1F16)";
const SUB = "var(--t-sub, #65665A)";
const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

export default function SiteFooter({ style }: { style?: React.CSSProperties }) {
  const link: React.CSSProperties = { color: INK, fontWeight: 700, textDecoration: "none" };
  return (
    <footer
      style={{
        fontFamily: sans, fontSize: "11.5px", lineHeight: 1.7, color: SUB,
        borderTop: `1px solid ${INK}`, marginTop: "48px", padding: "16px 0 8px",
        wordBreak: "keep-all", ...style,
      }}
    >
      <nav style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginBottom: "8px" }}>
        <Link href="/terms" style={link}>이용약관</Link>
        <Link href="/privacy" style={link}>개인정보처리방침</Link>
        {IS_CHANNEL_READY && (
          <a href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer" style={link}>카톡 문의</a>
        )}
        {CONTACT_EMAIL && <a href={`mailto:${CONTACT_EMAIL}`} style={link}>이메일 문의</a>}
      </nav>
      <p style={{ margin: 0 }}>
        AI 코디는 AI가 만든 참고용 제안이에요. 일부 쇼핑 링크는 제휴 링크라 구매 시 오늘핏에 수수료가 적립될 수 있어요.
      </p>
      <p style={{ margin: "4px 0 0" }}>운영 {OPERATOR}{CONTACT_EMAIL ? ` · ${CONTACT_EMAIL}` : ""}</p>
      <p style={{ margin: "2px 0 0" }}>© {new Date().getFullYear()} 오늘핏 OnulFit</p>
    </footer>
  );
}
