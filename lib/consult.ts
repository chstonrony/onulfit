/* ── 1:1 컨설팅 신청/예약 ──
   환경변수가 설정되기 전엔 버튼/폼을 노출하지 않는다(빈 동작 방지).

   1) 신청 폼: onulfit.com/apply (브랜드 톤 자체 폼)
      제출은 Web3Forms로 전송 → 운영자 이메일로 신청서 도착.
      NEXT_PUBLIC_WEB3FORMS_KEY 에 Web3Forms 액세스 키를 넣으면 폼이 활성화된다.
      (web3forms.com 에서 이메일만 입력하면 가입 없이 키 발급)
   2) 카카오톡 채널(선택): NEXT_PUBLIC_KAKAO_CHANNEL_URL
      → 결과 페이지 예약 CTA에 연결. */

export const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

/** 신청 폼(/apply)이 실제로 전송 가능한 상태인지 */
export const IS_APPLY_READY = !!WEB3FORMS_KEY;

export const KAKAO_CHANNEL_URL =
  process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || "https://pf.kakao.com/";

/** 카카오 채널이 실제로 연결됐는지 (placeholder가 아닌지) */
export const IS_CHANNEL_READY =
  !!process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL;
