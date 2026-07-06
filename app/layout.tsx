import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Gowun_Batang,
  Noto_Sans_KR,
} from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import KakaoInit from "@/components/KakaoInit";
import "./globals.css";

/* ── 영문 디스플레이 세리프 (Fraunces — 패션 매거진 톤) ──
   변수명은 기존 --font-cormorant 유지: 인라인 참조를 그대로 두고 폰트만 교체 */
const fraunces = Fraunces({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/* ── 한글 세리프 ── */
const gowunBatang = Gowun_Batang({
  variable: "--font-gowun",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
});

/* ── 한글 본문 (Noto Sans → 인라인 style에서 Pretendard로 재배선) ── */
const notoSans = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: false,
});

/* ── 메타데이터 ── */
export const metadata: Metadata = {
  title: "오늘핏 OnulFit — 매일 아침, 가장 좋은 버전의 나",
  description:
    "오늘핏(OnulFit) — 30~50대 여성을 위한 AI 패션 코디 서비스. 오늘의 상황을 알려주시면 상의부터 신발까지 딱 맞는 헤드투토 코디를 제안하고, 골격·퍼스널컬러 1:1 진단으로 이어드립니다.",
  keywords: ["오늘핏", "OnulFit", "패션 코디", "AI 스타일링", "여성 패션", "오늘 코디", "패션 추천", "스타일 추천", "퍼스널컬러 진단", "골격 진단", "30대 여성 코디", "40대 여성 코디", "주부 패션"],
  authors: [{ name: "오늘핏 OnulFit" }],
  creator: "오늘핏 OnulFit",
  metadataBase: new URL("https://onulfit.com"),

  /* ── 검색엔진 소유 확인 (서치콘솔·서치어드바이저 토큰은 Vercel 환경변수로) ── */
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
    ...(process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION && {
      other: { "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION },
    }),
  },

  /* ── Open Graph (카카오톡·인스타 공유 미리보기) ── */
  openGraph: {
    type: "website",
    url: "https://onulfit.com",
    title: "오늘핏 OnulFit — 오늘, 어떤 나를 찾으세요",
    description:
      "상황을 알려주시면 상의부터 신발까지 딱 맞는 코디를 찾아드려요. 30~50대 여성을 위한 AI 패션 코디 서비스, 오늘핏.",
    siteName: "오늘핏 OnulFit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OnulFit — 매일 아침, 가장 좋은 버전의 나",
      },
    ],
    locale: "ko_KR",
  },

  /* ── PWA + 앱 아이콘 ── */
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OnulFit",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

/* ── 뷰포트 ── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#2C2825" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${fraunces.variable} ${gowunBatang.variable} ${notoSans.variable} h-full`}
      style={{
        /* 라벨/산세리프(구 Jost) → 디스플레이 세리프(Fraunces)로 통일 */
        ["--font-jost" as string]: "var(--font-cormorant)",
        /* 한글 본문 → Pretendard (기본값 Noto Sans 탈피) */
        ["--font-noto-sans" as string]:
          '"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", sans-serif',
      } as React.CSSProperties}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {/* 검색엔진용 구조화 데이터 — 한글 브랜드명 '오늘핏' 인식 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "오늘핏",
              alternateName: ["OnulFit", "오늘핏 스타일리스트"],
              url: "https://onulfit.com",
              description:
                "30~50대 여성을 위한 AI 패션 코디 · 골격/퍼스널컬러 1:1 스타일 진단 서비스",
              inLanguage: "ko",
            }),
          }}
        />
      </head>
      <body className="h-full">{children}</body>
      <KakaoInit />
      <GoogleAnalytics gaId="G-01XNX2CRQD" />
    </html>
  );
}
