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

/* ── 1:1 컨설팅 시범 운영 안내 (신청 페이지·개인정보처리방침이 함께 씀) ──
   2026-11 결정: 사업자 등록 전 시범 운영. 가격·정확한 위치는 공개하지 않고 신청 후 개별 안내. */
export const CONSULT_INFO = {
  region: "경기 남양주 다산신도시",
  place: "경기 남양주 다산신도시 · 개인 공간 (상세 위치는 일정 확정 후 안내)",
  fee: "시범 기간 소정의 비용이 있어요. 금액은 신청 후 개별로 안내드려요.",
  feeNote: "포트폴리오 사진·후기 게시에 동의하시면 할인해 드려요.",
  cancel: "일정 변경·취소 규정은 일정 확정 시 함께 안내드려요.",
} as const;

/* ── 개인정보 수집·이용 안내 (신청서 동의 체크칸 + /privacy) ── */
export const PRIVACY_VERSION = "2026-11-12";
/** 운영자 — 2026-11-08 사용자 요청. 사업자 등록 후 상호·사업자번호를 더할 것 */
/** 오늘핏 공식 인스타그램 (2026-11-09) */
export const INSTAGRAM_HANDLE = "onulfit.official";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
/** 오늘핏 네이버 블로그 (2026-11-10) — 사진·후기 위주 글. 사이트 가이드 글과 같은 글을 올리지 않는다 */
export const BLOG_URL = "https://blog.naver.com/chston";

export const OPERATOR = "로니스튜디오 · 대표 최샤론";
/** 공개 문의 이메일 — 오늘핏 전용 (2026-11-08 사용자 요청). 바꾸려면 여기 또는 NEXT_PUBLIC_CONTACT_EMAIL */
export const CONTACT_EMAIL = (process.env.NEXT_PUBLIC_CONTACT_EMAIL || "chston@naver.com").trim();
/** 개인정보 보호책임자 */
export const PRIVACY_OFFICER = "최샤론 (로니스튜디오 대표)";
export const PRIVACY = {
  items: "성함, 전화번호, 이메일 주소, 나이대, 거주 지역, 인스타 아이디(선택), 고민·원하는 변화·가능한 일정·하고 싶은 말(선택), 사진·후기 게시 동의 여부",
  purpose: "1:1 컨설팅 신청 확인, 일정·장소·비용 안내 연락, 상담 진행",
  retention: "신청일로부터 1년(상담을 진행한 경우 마지막 상담일로부터 1년) 보관 후 파기해요. 삭제를 요청하시면 바로 파기해요.",
  refuse: "동의를 거부할 수 있어요. 다만 동의하지 않으면 신청서를 보낼 수 없어요.",
  processor: "신청서는 Web3Forms(이메일 전송 서비스, 해외)를 거쳐 운영자 이메일로 전달돼요.",
} as const;
