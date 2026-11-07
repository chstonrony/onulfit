import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
