import Script from "next/script";

/* ── GA4 (모바일 속도용) ──
   @next/third-parties 의 GoogleAnalytics 는 gtag.js(약 170KB)를 화면이 뜨자마자 받아서
   첫 화면 영상·사진과 데이터를 다퉜다. 여기서는
   · dataLayer 준비(아주 작은 코드)만 먼저 하고
   · gtag.js 는 페이지가 다 뜬 뒤(lazyOnload) 받는다.
   그 사이에 쌓인 이벤트(lib/track.ts)는 dataLayer 에 줄 서 있다가 gtag.js 가 오면 함께 전송된다. */
export default function Analytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
      <Script id="ga-src" strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
    </>
  );
}
