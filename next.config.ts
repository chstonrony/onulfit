import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 기본 보안 설정 — 다른 사이트가 오늘핏을 몰래 끼워 넣지 못하게, 파일 형식 속이기 막기 등 */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
  /* 옛 주소(stylefit-pearl.vercel.app)로 들어오면 onulfit.com 같은 페이지로 영구 이동 */
  async redirects() {
    /* 홍보용 짧은 주소 (2026-11-09) → 무료 자가진단. 채널마다 utm 이 달라 GA에서 어디서 왔는지 구분된다.
       미리보기 카드는 메인과 같은 올리브 문 카드(og-image.png). 나중에 도착지를 바꿀 수 있게 임시 이동(307). */
    const promo = (src: string, source: string, medium: string) => ({
      source: src,
      destination: `/self-check?utm_source=${source}&utm_medium=${medium}&utm_campaign=promo`,
      permanent: false,
    });
    return [
      promo("/go", "link", "promo"),
      promo("/go/insta", "instagram", "social"),
      promo("/go/threads", "threads", "social"),
      promo("/go/kakao", "kakao", "messenger"),
      promo("/go/blog", "blog", "referral"),
      {
        source: "/:path*",
        has: [{ type: "host", value: "stylefit-pearl.vercel.app" }],
        destination: "https://onulfit.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
