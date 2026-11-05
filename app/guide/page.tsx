import Link from "next/link";
import type { Metadata } from "next";
import { ARTICLES } from "@/lib/articles";
import { Wordmark } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "스타일 가이드 — 체형·퍼스널컬러 코디법 | 오늘핏",
  description:
    "골격 체형(스트레이트·웨이브·내추럴)과 퍼스널컬러별 코디법을 정리한 오늘핏 스타일 가이드. 내 체형에 어울리는 옷과 피할 옷을 알아보세요.",
  alternates: { canonical: "https://onulfit.com/guide" },
};

const INK = "#1D1F16";
const ACC = "#5A6122";
const SUB = "#65665A";
const PAPER = "#ECEAE0";
const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

export default function GuidePage() {
  return (
    <main style={{ minHeight: "100dvh", background: PAPER, padding: "0 20px 72px", display: "flex", flexDirection: "column", alignItems: "center", ["--t-acc" as string]: ACC, ["--t-txt" as string]: INK }}>
      <div style={{ width: "100%", maxWidth: "720px", paddingTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: `1px solid ${INK}` }}>
          <Link href="/" className="ed-label ed-link" style={{ color: INK }}>← OnulFit</Link>
          <Link href="/apply" className="ed-label ed-link" style={{ color: ACC }}>1:1 진단</Link>
        </div>

        <header style={{ margin: "18px 0 36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span className="ed-label" style={{ color: ACC }}>Style guide</span>
            <span className="ed-label" style={{ color: SUB }}>{ARTICLES.length} articles</span>
          </div>
          <Wordmark text="Style guide" size={22} />
          <div style={{ height: "1px", background: INK, margin: "14px 0 22px" }} />
          <h1 style={{ fontFamily: sans, fontSize: "clamp(28px, 7.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.055em", color: INK, lineHeight: 1.15, margin: "0 0 12px", wordBreak: "keep-all" }}>
            내 체형에 맞는 옷, 이제 헤매지 마세요
          </h1>
          <p style={{ fontFamily: sans, fontSize: "15px", fontWeight: 500, color: SUB, lineHeight: 1.7, wordBreak: "keep-all" }}>
            골격 체형과 퍼스널컬러를 알면 쇼핑이 쉬워집니다. 오늘핏이 정리한 체형별·컬러별 코디 가이드예요.
          </p>
        </header>

        <div style={{ borderTop: `1px solid ${INK}` }}>
          {ARTICLES.map((a, i) => (
            <Link
              key={a.slug}
              href={`/guide/${a.slug}`}
              className="guide-row"
              style={{ display: "grid", gridTemplateColumns: "40px 1fr 24px", gap: "6px", alignItems: "start", padding: "20px 0 22px", borderBottom: `1px solid ${INK}`, textDecoration: "none", color: INK }}
            >
              <span style={{ fontFamily: "var(--font-grotesk), sans-serif", fontWeight: 800, fontSize: "13px", color: ACC, paddingTop: "4px" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="ed-label" style={{ display: "block", color: SUB, marginBottom: "8px" }}>
                  {a.category} · {a.readingTime}분
                </span>
                <span style={{ display: "block", fontFamily: sans, fontSize: "21px", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.3, marginBottom: "6px", wordBreak: "keep-all" }}>
                  {a.title}
                </span>
                <span style={{ display: "block", fontFamily: sans, fontSize: "14px", color: SUB, lineHeight: 1.6, wordBreak: "keep-all" }}>
                  {a.subtitle}
                </span>
              </span>
              <span aria-hidden style={{ fontFamily: "var(--font-grotesk), sans-serif", fontSize: "20px", paddingTop: "22px" }}>→</span>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: "32px" }}>
          <Link
            href="/?diag=1"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "62px", padding: "0 18px",
              fontFamily: sans, fontSize: "16px", fontWeight: 700, letterSpacing: "-0.025em",
              color: INK, backgroundColor: "#BFC266", borderRadius: "2px", textDecoration: "none",
            }}
          >
            무료로 내 결 찾기 <span aria-hidden style={{ fontSize: "20px" }}>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
