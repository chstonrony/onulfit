import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARTICLES, getArticle } from "@/lib/articles";
import GuideCTA from "@/components/GuideCTA";

const INK = "#1B1714";
const ACC = "#C23B22";
const SUB = "#6F665D";
const BODY = "#2E2925";
const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

const BASE_URL = "https://onulfit.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "오늘핏" };
  return {
    title: a.seoTitle,
    description: a.seoDescription,
    alternates: { canonical: `${BASE_URL}/guide/${a.slug}` },
    openGraph: {
      type: "article",
      title: a.seoTitle,
      description: a.seoDescription,
      url: `${BASE_URL}/guide/${a.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const related = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.seoDescription,
    url: `${BASE_URL}/guide/${a.slug}`,
    inLanguage: "ko",
    datePublished: a.date,
    author: { "@type": "Organization", name: "오늘핏" },
    publisher: { "@type": "Organization", name: "오늘핏", url: BASE_URL },
  };

  return (
    <main style={{ minHeight: "100dvh", background: "#EDE8E2", padding: "0 20px 72px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article style={{ width: "100%", maxWidth: "640px", paddingTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: `1px solid ${INK}` }}>
          <Link href="/guide" className="ed-label ed-link" style={{ color: INK }}>← 스타일 가이드</Link>
          <Link href="/apply" className="ed-label ed-link" style={{ color: ACC }}>1:1 진단</Link>
        </div>

        <header style={{ margin: "28px 0 34px" }}>
          <p className="ed-label" style={{ color: ACC, marginBottom: "14px" }}>
            {a.category} · {a.readingTime}분 읽기
          </p>
          <h1 style={{ fontFamily: sans, fontSize: "clamp(29px, 7.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.055em", color: INK, lineHeight: 1.16, marginBottom: "14px", wordBreak: "keep-all" }}>
            {a.title}
          </h1>
          <p style={{ fontFamily: sans, fontSize: "16px", fontWeight: 500, color: SUB, lineHeight: 1.6, wordBreak: "keep-all", paddingBottom: "18px", borderBottom: `4px solid ${ACC}` }}>
            {a.subtitle}
          </p>
        </header>

        <div>
          {a.content.split("\n\n").map((p, i) =>
            p.startsWith("## ") ? (
              <h2 key={i} style={{ fontFamily: sans, fontSize: "23px", fontWeight: 800, letterSpacing: "-0.045em", color: INK, lineHeight: 1.3, margin: "40px 0 14px", paddingTop: "10px", borderTop: `2px solid ${INK}`, wordBreak: "keep-all" }}>
                {p.slice(3)}
              </h2>
            ) : p.startsWith("- ") ? (
              <ul key={i} style={{ margin: "0 0 14px", paddingLeft: "18px" }}>
                {p.split("\n").map((li, j) => (
                  <li key={j} style={{ fontFamily: sans, fontSize: "16px", color: BODY, lineHeight: 1.85, letterSpacing: "-0.015em", wordBreak: "keep-all" }}>
                    {li.replace(/^- /, "")}
                  </li>
                ))}
              </ul>
            ) : (
              <p key={i} style={{ fontFamily: sans, fontSize: "16px", color: BODY, lineHeight: 1.9, letterSpacing: "-0.015em", margin: "0 0 18px", wordBreak: "keep-all" }}>
                {p}
              </p>
            )
          )}
        </div>

        {/* CTA — 무료 자가진단(바로 열림) + 1:1 상담 신청 */}
        <GuideCTA slug={a.slug} />

        {/* 관련 글 */}
        <div style={{ borderTop: `2px solid ${INK}`, paddingTop: "10px" }}>
          <p className="ed-label" style={{ color: INK, marginBottom: "4px" }}>
            <span style={{ color: ACC }}>(+)</span>&nbsp;&nbsp;함께 읽으면 좋은 글
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {related.map((r) => (
              <Link key={r.slug} href={`/guide/${r.slug}`} style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "14px 0", borderBottom: `1px solid ${INK}`, textDecoration: "none", color: INK }}>
                <span>
                  <span style={{ display: "block", fontFamily: sans, fontSize: "16px", fontWeight: 800, letterSpacing: "-0.035em", marginBottom: "2px", wordBreak: "keep-all" }}>{r.title}</span>
                  <span style={{ display: "block", fontFamily: sans, fontSize: "13px", color: SUB, wordBreak: "keep-all" }}>{r.subtitle}</span>
                </span>
                <span aria-hidden style={{ fontSize: "18px" }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
