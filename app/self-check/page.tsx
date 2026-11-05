import type { Metadata } from "next";
import SelfCheckLanding from "@/components/SelfCheckLanding";

const URL = "https://onulfit.com/self-check";
const TITLE = "무료 체형·퍼스널컬러 자가진단 테스트 — 1분, 사진 없이 | 오늘핏";
const DESC =
  "손목·쇄골·살 붙는 곳 5가지로 골격(스트레이트·웨이브·내추럴)을, 핏줄·금은·흰옷 5가지로 퍼스널컬러(봄웜·여름쿨·가을웜·겨울쿨)를 알아보는 무료 자가진단. 결과에 맞는 코디까지 바로 알려드려요.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { type: "website", title: TITLE, description: DESC, url: URL },
};

export default function SelfCheckPage() {
  return <SelfCheckLanding />;
}
