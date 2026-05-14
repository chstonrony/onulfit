import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Gowun_Batang,
  Jost,
  Noto_Sans_KR,
} from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

/* ── 영문 세리프 ── */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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

/* ── 영문 산세리프 ── */
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

/* ── 한글 산세리프 ── */
const notoSans = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: false,
});

/* ── 메타데이터 ── */
export const metadata: Metadata = {
  title: "OnulFit — 매일 아침, 가장 좋은 버전의 나",
  description:
    "30~50대 여성을 위한 AI 패션 코디 서비스. 오늘의 상황을 알려주시면 상의부터 신발까지 딱 맞는 헤드투토 코디를 제안해드립니다.",
  keywords: ["패션 코디", "AI 스타일링", "여성 패션", "오늘 코디", "패션 추천", "스타일 추천"],
  authors: [{ name: "OnulFit" }],
  creator: "OnulFit",
  metadataBase: new URL("https://onulfit.com"),

  /* ── Open Graph (카카오톡·인스타 공유 미리보기) ── */
  openGraph: {
    type: "website",
    url: "https://onulfit.com",
    title: "OnulFit — 오늘, 어떤 나를 찾으세요",
    description:
      "상황을 알려주시면 상의부터 신발까지 딱 맞는 코디를 찾아드려요. 30~50대 여성을 위한 AI 패션 코디 서비스.",
    siteName: "OnulFit",
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
      className={`${cormorant.variable} ${gowunBatang.variable} ${jost.variable} ${notoSans.variable} h-full`}
    >
      <body className="h-full">{children}</body>
      <GoogleAnalytics gaId="G-01XNX2CRQD" />
    </html>
  );
}
