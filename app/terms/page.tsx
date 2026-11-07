import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { Metadata } from "next";
import { KAKAO_CHANNEL_URL, IS_CHANNEL_READY, OPERATOR, CONTACT_EMAIL } from "@/lib/consult";
import { Wordmark } from "@/components/Editorial";

/* ── 이용약관 (2026-11-08, 시범 운영 기본 문안) ──
   사업자 등록·정식 유료 운영 시 운영 주체, 결제·환불 조항을 보완할 것. */

const TERMS_VERSION = "2026-11-08";

export const metadata: Metadata = {
  title: "이용약관 | 오늘핏",
  description: "오늘핏 AI 코디·자가진단·1:1 컨설팅 이용약관",
  alternates: { canonical: "https://onulfit.com/terms" },
};

const INK = "#1D1F16";
const ACC = "#5A6122";
const SUB = "#65665A";
const BODY = "#2E2925";
const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

export default function TermsPage() {
  const sections: [string, React.ReactNode][] = [
    ["1. 서비스 내용", <>오늘핏은 로니스튜디오가 운영하며, 체형·퍼스널컬러 무료 자가진단, AI 코디 제안, 스타일 가이드 글, 1:1 스타일 컨설팅 신청을 제공해요. 무료 기능은 회원가입 없이 쓸 수 있어요.</>],
    ["2. AI 코디와 자가진단", <>AI 코디는 인공지능(AI)이 만든 <b>참고용 제안</b>이에요. 사실과 다르거나 상황에 맞지 않을 수 있으니 최종 선택은 직접 판단해 주세요. 자가진단은 스스로 체크하는 간이 진단이라, 전문가의 대면 진단과 결과가 다를 수 있어요. 사이트의 일부 사진은 AI로 만든 연출 이미지예요.</>],
    ["3. 쇼핑 링크", <>코디에 연결된 쇼핑 링크는 외부 쇼핑몰로 이동해요. 일부는 제휴 링크라 구매 시 오늘핏에 수수료가 적립될 수 있어요(구매 가격은 같아요). 상품 구매·배송·환불은 각 쇼핑몰과의 거래이고, 오늘핏은 그 거래의 당사자가 아니에요. 가격·재고는 쇼핑몰에서 바뀔 수 있어요.</>],
    ["4. 1:1 컨설팅", <>현재 시범 운영 중이에요. 비용, 일정, 장소, 변경·취소 규정은 신청 후 개별로 안내하고, 이용자가 동의한 뒤에 진행해요. 환불 등은 관련 법령(전자상거래법·소비자기본법 등)을 따라요.</>],
    ["5. 하면 안 되는 일", <>프로그램으로 AI 코디를 반복 호출하는 등 서비스에 부담을 주는 행동, 다른 사람의 개인정보를 입력하는 행동, 사이트 글·이미지를 허락 없이 복제해 상업적으로 쓰는 행동은 하지 말아 주세요. 이런 경우 이용이 제한될 수 있어요.</>],
    ["6. 콘텐츠 권리", <>사이트의 글, 그림, 사진, 디자인의 권리는 오늘핏 또는 원저작자에게 있어요. 개인적으로 보거나 출처를 밝혀 공유하는 것은 괜찮아요.</>],
    ["7. 책임의 범위", <>오늘핏은 무료 기능을 있는 그대로 제공하며, 고의나 중대한 과실이 없는 한 AI 코디·자가진단 결과를 따라 생긴 손해에 책임지지 않아요. 서비스 점검이나 외부 서비스 장애로 일시 중단될 수 있어요.</>],
    ["8. 약관 변경", <>약관을 바꿀 때는 시행일 7일 전부터 이 페이지에 알려드려요.</>],
    [
      "9. 문의",
      <>
        운영자: {OPERATOR}
        {IS_CHANNEL_READY ? (
          <> · <a href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="ed-link" style={{ color: ACC, fontWeight: 700 }}>카카오톡 채널로 문의</a></>
        ) : null}
        {CONTACT_EMAIL ? (
          <> · 이메일 <a href={`mailto:${CONTACT_EMAIL}`} className="ed-link" style={{ color: ACC, fontWeight: 700 }}>{CONTACT_EMAIL}</a></>
        ) : null}
      </>,
    ],
  ];

  return (
    <main style={{ minHeight: "100dvh", background: "#ECEAE0", padding: "0 20px 72px", display: "flex", justifyContent: "center", ["--t-acc" as string]: ACC, ["--t-txt" as string]: INK }}>
      <article style={{ width: "100%", maxWidth: "640px", paddingTop: "16px" }}>
        <SiteHeader style={{ marginBottom: "18px" }} />
        <Wordmark text="Terms" size={24} />
        <div style={{ height: "1px", background: INK, margin: "14px 0 22px" }} />
        <h1 style={{ fontFamily: sans, fontSize: "clamp(27px, 7.5vw, 36px)", fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 1.2, color: INK, margin: 0 }}>
          이용약관
        </h1>
        <p style={{ fontFamily: sans, fontSize: "14.5px", lineHeight: 1.75, color: SUB, margin: "10px 0 0", wordBreak: "keep-all" }}>
          오늘핏을 쓰기 전에 알아두시면 좋은 약속이에요.
        </p>

        <div style={{ marginTop: "26px", borderTop: `1px solid ${INK}` }}>
          {sections.map(([t, body]) => (
            <section key={t} style={{ padding: "16px 0", borderBottom: `1px solid #D6D3C3` }}>
              <h2 style={{ fontFamily: sans, fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: INK, margin: "0 0 6px" }}>{t}</h2>
              <p style={{ fontFamily: sans, fontSize: "14.5px", lineHeight: 1.8, color: BODY, margin: 0, wordBreak: "keep-all" }}>{body}</p>
            </section>
          ))}
        </div>

        <p style={{ fontFamily: sans, fontSize: "12.5px", color: SUB, margin: "18px 0 0" }}>
          시행일: {TERMS_VERSION}
        </p>
        <SiteFooter />
      </article>
    </main>
  );
}
