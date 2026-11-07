import type { Metadata } from "next";

/* 신청 페이지는 클라이언트 컴포넌트라 대표 주소 표시를 여기서 단다 */
export const metadata: Metadata = {
  alternates: { canonical: "https://onulfit.com/apply" },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
