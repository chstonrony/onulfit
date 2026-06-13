import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARTICLES, getArticle } from "@/lib/articles";

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
    <main style={{ minHeight: "100dvh", background: "#FAF8F5", padding: "0 20px 64px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article style={{ width: "100%", maxWidth: "640px", paddingTop: "32px" }}>
        <Link href="/guide" style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "11px", letterSpacing: "0.16em", color: "#A89880", textDecoration: "none" }}>
          ← 스타일 가이드
        </Link>

        <header style={{ margin: "24px 0 32px" }}>
          <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#B89A6A", marginBottom: "12px" }}>
            {a.category} · {a.readingTime}분
          </p>
          <h1 style={{ fontFamily: "var(--font-gowun), serif", fontSize: "clamp(25px, 5.5vw, 34px)", fontWeight: 400, color: "#2C2825", lineHeight: 1.4, marginBottom: "12px", wordBreak: "keep-all" }}>
            {a.title}
          </h1>
          <p style={{ fontFamily: "var(--font-noto-sans), sans-serif", fontSize: "14px", color: "#9A9088", lineHeight: 1.6, wordBreak: "keep-all" }}>
            {a.subtitle}
          </p>
        </header>

        <div>
          {a.content.split("\n\n").map((p, i) =>
            p.startsWith("## ") ? (
              <h2 key={i} style={{ fontFamily: "var(--font-gowun), serif", fontSize: "20px", fontWeight: 400, color: "#2C2825", lineHeight: 1.4, margin: "32px 0 12px", wordBreak: "keep-all" }}>
                {p.slice(3)}
              </h2>
            ) : p.startsWith("- ") ? (
              <ul key={i} style={{ margin: "0 0 14px", paddingLeft: "18px" }}>
                {p.split("\n").map((li, j) => (
                  <li key={j} style={{ fontFamily: "var(--font-noto-sans), sans-serif", fontSize: "15px", color: "#4A453F", lineHeight: 1.9, wordBreak: "keep-all" }}>
                    {li.replace(/^- /, "")}
                  </li>
                ))}
              </ul>
            ) : (
              <p key={i} style={{ fontFamily: "var(--font-noto-sans), sans-serif", fontSize: "15px", color: "#4A453F", lineHeight: 1.95, margin: "0 0 16px", wordBreak: "keep-all" }}>
                {p}
              </p>
            )
          )}
        </div>

        {/* CTA */}
        <div style={{ margin: "40px 0 32px" }}>
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

        {/* 관련 글 */}
        <div style={{ borderTop: "1px solid #ECE6DD", paddingTop: "24px" }}>
          <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#B89A6A", marginBottom: "14px" }}>
            함께 읽으면 좋은 글
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {related.map((r) => (
              <Link key={r.slug} href={`/guide/${r.slug}`} style={{ textDecoration: "none" }}>
                <p style={{ fontFamily: "var(--font-gowun), serif", fontSize: "15px", color: "#2C2825", marginBottom: "2px", wordBreak: "keep-all" }}>{r.title}</p>
                <p style={{ fontFamily: "var(--font-noto-sans), sans-serif", fontSize: "12px", color: "#9A9088", wordBreak: "keep-all" }}>{r.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
