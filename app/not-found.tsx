import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

/* ── 없는 주소로 들어왔을 때 (2026-11-08) — 기본 영어 화면 대신 한국어 안내 ── */

const INK = "#1D1F16";
const ACC = "#5A6122";
const SUB = "#65665A";
const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

export const metadata = { title: "페이지를 찾을 수 없어요 | 오늘핏", robots: { index: false } };

export default function NotFound() {
  const btn: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "56px", padding: "0 18px",
    fontFamily: sans, fontSize: "16px", fontWeight: 700, letterSpacing: "-0.025em", color: INK,
    borderRadius: "2px", textDecoration: "none",
  };
  return (
    <main style={{ minHeight: "100dvh", background: "#ECEAE0", padding: "0 20px 72px", display: "flex", justifyContent: "center", ["--t-acc" as string]: ACC, ["--t-txt" as string]: INK }}>
      <article style={{ width: "100%", maxWidth: "640px", paddingTop: "16px" }}>
        <SiteHeader style={{ marginBottom: "40px" }} />
        <p style={{ fontFamily: sans, fontSize: "13px", fontWeight: 700, color: ACC, margin: 0 }}>404</p>
        <h1 style={{ fontFamily: sans, fontSize: "clamp(26px, 7vw, 34px)", fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 1.25, color: INK, margin: "6px 0 10px", wordBreak: "keep-all" }}>
          찾으시는 페이지가 없어요
        </h1>
        <p style={{ fontFamily: sans, fontSize: "14.5px", lineHeight: 1.75, color: SUB, margin: "0 0 28px", wordBreak: "keep-all" }}>
          주소가 바뀌었거나 잘못 입력됐을 수 있어요. 아래에서 다시 시작해 보세요.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/" style={{ ...btn, background: "#BFC266" }}>오늘핏 처음으로 <span aria-hidden>→</span></Link>
          <Link href="/self-check" style={{ ...btn, border: `1px solid ${INK}` }}>무료 자가진단 <span aria-hidden>→</span></Link>
          <Link href="/guide" style={{ ...btn, border: `1px solid ${INK}` }}>스타일 가이드 <span aria-hidden>→</span></Link>
        </div>
        <SiteFooter />
      </article>
    </main>
  );
}
