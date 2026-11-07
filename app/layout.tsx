import type { Metadata, Viewport } from "next";
import { Inter_Tight, Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import KakaoInit from "@/components/KakaoInit";
import KakaoFloat from "@/components/KakaoFloat";
import { OG_IMAGE } from "@/lib/og";
import "./globals.css";

/* ── 타이포그래피 시스템 (2026-11 리뉴얼) ──────────────────────
   · 그로테스크(영문 워드마크·라벨): Inter Tight — 크고 촘촘한 에디토리얼 헤드라인
   · 액센트 세리프(영문 이탤릭 한마디): Fraunces — 둥글고 통통한 소프트 세리프(2026-11-06, 굵은 한글과 무게 맞춤)
   · 한글(제목·본문 전부): Pretendard — 제목은 굵고 촘촘하게(globals.css)
   기존 인라인 스타일이 쓰는 변수명(--font-cormorant/-jost/-gowun/-noto-sans)은
   그대로 두고, 가리키는 폰트만 바꾼다. ─────────────────────────── */
const grotesk = Inter_Tight({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const accentSerif = Fraunces({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

/* 오늘의 코디 보드(OutfitBoard) 전용 — 제목 onulfit(Geist), 라벨 테이프 영문(JetBrains Mono) */
const boardTitle = Geist({
  variable: "--font-board-title",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});
const labelMono = JetBrains_Mono({
  variable: "--font-label-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const PRETENDARD ='"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';

/* ── 메타데이터 ── */
export const metadata: Metadata = {
  title: "오늘핏 OnulFit — 매일 아침, 가장 좋은 버전의 나",
  description:
    "오늘핏(OnulFit) — 20대 후반 여성을 위한 AI 패션 코디 서비스. 오늘의 상황을 알려주시면 상의부터 신발까지 딱 맞는 헤드투토 코디를 제안하고, 골격·퍼스널컬러 1:1 진단으로 이어드립니다.",
  keywords: ["오늘핏", "OnulFit", "패션 코디", "AI 스타일링", "여성 패션", "오늘 코디", "패션 추천", "스타일 추천", "퍼스널컬러 진단", "골격 진단", "20대 후반 코디", "20대 여성 코디", "데일리룩"],
  authors: [{ name: "오늘핏 OnulFit" }],
  creator: "오늘핏 OnulFit",
  metadataBase: new URL("https://onulfit.com"),
  /* 대표 주소 표시. 다른 페이지는 각자 자기 주소로 덮어쓴다 */
  alternates: { canonical: "https://onulfit.com" },

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
    title: "오늘 뭐 입지? 그 답은, 오늘핏",
    description:
      "문 너머, 나에게 맞는 한 벌. 체형·퍼스널컬러 무료 자가진단 1분, 오늘 상황에 맞는 코디까지 오늘핏이 찾아드려요.",
    siteName: "오늘핏 OnulFit",
    images: [OG_IMAGE],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "오늘 뭐 입지? 그 답은, 오늘핏",
    description: "문 너머, 나에게 맞는 한 벌. 체형·퍼스널컬러 무료 자가진단 1분.",
    images: [OG_IMAGE.url],
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
    { media: "(prefers-color-scheme: light)", color: "#ECEAE0" },
    { media: "(prefers-color-scheme: dark)", color: "#1D1F16" },
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
      className={`${grotesk.variable} ${accentSerif.variable} ${boardTitle.variable} ${labelMono.variable} h-full`}
      style={{
        /* 라벨·숫자 → 그로테스크(영문) + Pretendard(한글) */
        ["--font-jost" as string]: `var(--font-grotesk), ${PRETENDARD}`,
        /* 한글 제목(구 고운바탕) → Pretendard. 굵기·자간은 globals.css에서 */
        ["--font-gowun" as string]: PRETENDARD,
        ["--font-noto-sans" as string]: PRETENDARD,
      } as React.CSSProperties}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
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
                "20대 후반 여성을 위한 AI 패션 코디 · 골격/퍼스널컬러 1:1 스타일 진단 서비스",
              inLanguage: "ko",
            }),
          }}
        />
      </head>
      <body className="h-full">
        {children}
        {/* 카톡 상담 — 모든 화면에 늘 떠 있는 버튼 */}
        <KakaoFloat />
      </body>
      <KakaoInit />
      <GoogleAnalytics gaId="G-01XNX2CRQD" />
    </html>
  );
}
