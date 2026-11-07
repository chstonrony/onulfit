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
    return [
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
