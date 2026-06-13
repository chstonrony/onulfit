import Link from "next/link";
import type { Metadata } from "next";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "스타일 가이드 — 체형·퍼스널컬러 코디법 | 오늘핏",
  description:
    "골격 체형(스트레이트·웨이브·내추럴)과 퍼스널컬러별 코디법을 정리한 오늘핏 스타일 가이드. 내 체형에 어울리는 옷과 피할 옷을 알아보세요.",
  alternates: { canonical: "https://onulfit.com/guide" },
};

export default function GuidePage() {
  return (
    <main style={{ minHeight: "100dvh", background: "#FAF8F5", padding: "0 20px 64px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "640px", paddingTop: "32px" }}>
        <Link href="/" style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "11px", letterSpacing: "0.16em", color: "#A89880", textDecoration: "none" }}>
          ← ONULFIT
        </Link>

        <header style={{ margin: "24px 0 36px" }}>
          <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B89A6A", marginBottom: "10px" }}>
            STYLE GUIDE
          </p>
          <h1 style={{ fontFamily: "var(--font-gowun), serif", fontSize: "clamp(26px, 6vw, 36px)", fontWeight: 400, color: "#2C2825", lineHeight: 1.35, marginBottom: "10px", wordBreak: "keep-all" }}>
            내 체형에 맞는 옷, 이제 헤매지 마세요
          </h1>
          <p style={{ fontFamily: "var(--font-noto-sans), sans-serif", fontSize: "14px", color: "#7A7268", lineHeight: 1.7, wordBreak: "keep-all" }}>
            골격 체형과 퍼스널컬러를 알면 쇼핑이 쉬워집니다. 오늘핏이 정리한 체형별·컬러별 코디 가이드예요.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {ARTICLES.map((a) => (
            <Link
              key={a.slug}
              href={`/guide/${a.slug}`}
              style={{ display: "block", padding: "22px 0", borderTop: "1px solid #ECE6DD", textDecoration: "none" }}
            >
              <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B89A6A", marginBottom: "8px" }}>
                {a.category} · {a.readingTime}분
              </p>
              <h2 style={{ fontFamily: "var(--font-gowun), serif", fontSize: "19px", fontWeight: 400, color: "#2C2825", lineHeight: 1.4, marginBottom: "6px", wordBreak: "keep-all" }}>
                {a.title}
              </h2>
              <p style={{ fontFamily: "var(--font-noto-sans), sans-serif", fontSize: "13px", color: "#9A9088", lineHeight: 1.6, wordBreak: "keep-all" }}>
                {a.subtitle}
              </p>
            </Link>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #ECE6DD", marginTop: "8px", paddingTop: "32px" }}>
          <Link
            href="/"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", height: "52px",
              fontFamily: "var(--font-noto-sans), sans-serif", fontSize: "14px", fontWeight: 500,
              color: "#fff", backgroundColor: "#2C2825", borderRadius: "12px", textDecoration: "none",
            }}
          >
            내 체형·컬러 무료로 진단받기 →
          </Link>
        </div>
      </div>
    </main>
  );
}
