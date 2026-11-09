import type { Metadata } from "next";

/* 신청 페이지는 클라이언트 컴포넌트라 대표 주소 표시를 여기서 단다 */
export const metadata: Metadata = {
  /* 2026-11-09 점검: 제목이 없어 첫 화면 제목이 그대로 나오던 것 수정 */
  title: "1:1 스타일 컨설팅 신청 — 체형·퍼스널컬러 대면 진단 | 오늘핏",
  description:
    "골격(체형)과 퍼스널컬러를 1:1로 직접 진단하고, 나에게 맞는 색·핏·코디 방향을 정리해 드려요. 남양주 다산신도시, 시범 운영 중(포트폴리오 동의 시 할인).",
  alternates: { canonical: "https://onulfit.com/apply" },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
