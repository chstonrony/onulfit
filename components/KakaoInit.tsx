"use client";

import Script from "next/script";

/* ── 카카오 JavaScript SDK 로드 + 초기화 ──
   NEXT_PUBLIC_KAKAO_JS_KEY 환경변수가 있을 때만 동작.
   키가 없으면 공유 버튼은 모바일 네이티브 공유(카카오톡 포함)로 자동 폴백된다. */
const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

type KakaoWindow = Window & {
  Kakao?: { isInitialized?: () => boolean; init: (key: string) => void };
};

export default function KakaoInit() {
  if (!KAKAO_JS_KEY) return null;

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        const w = window as KakaoWindow;
        if (w.Kakao && !w.Kakao.isInitialized?.()) {
          w.Kakao.init(KAKAO_JS_KEY);
        }
      }}
    />
  );
}
