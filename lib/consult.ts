/* ── 1:1 컨설팅 예약 채널 ──
   카카오톡 채널 개설 후, 채널 홈 URL(pf.kakao.com/_xxxxx)을
   Vercel 환경변수 NEXT_PUBLIC_KAKAO_CHANNEL_URL 에 넣으면 전 버튼에 자동 반영된다.
   (개설 전엔 임시 링크) */
export const KAKAO_CHANNEL_URL =
  process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || "https://pf.kakao.com/";

/** 채널이 실제로 연결됐는지 (placeholder가 아닌지) */
export const IS_CHANNEL_READY =
  !!process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL;
