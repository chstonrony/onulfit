import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { Metadata } from "next";
import { PRIVACY, PRIVACY_VERSION, PRIVACY_OFFICER, KAKAO_CHANNEL_URL, IS_CHANNEL_READY } from "@/lib/consult";
import { Wordmark } from "@/components/Editorial";

/* ── 개인정보처리방침 ──
   1:1 컨설팅 신청서(/apply)가 개인정보를 받기 때문에 공개해 두는 안내문.
   시범 운영 단계의 기본 문안 — 정식 오픈·사업자 등록 시 운영 주체·연락처를 보완할 것. */

export const metadata: Metadata = {
  title: "개인정보처리방침 | 오늘핏",
  description: "오늘핏 AI 코디·1:1 컨설팅 신청서의 개인정보 수집·이용·보관 안내",
  alternates: { canonical: "https://onulfit.com/privacy" },
};

const INK = "#1D1F16";
const ACC = "#5A6122";
const SUB = "#65665A";
const BODY = "#2E2925";
const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

export default function PrivacyPage() {
  const sections: [string, React.ReactNode][] = [
    ["1. 수집하는 개인정보", <>
      <b>1:1 컨설팅 신청서</b>: {PRIVACY.items}.<br />
      <b>AI 코디 요청</b>: 직접 적은 상황 글, 자가진단 결과(체형·퍼스널컬러 유형). 이름·연락처는 받지 않아요. 상황 글에는 이름·연락처 같은 개인정보를 적지 말아 주세요.<br />
      자가진단 결과는 이용자 기기(브라우저)에 저장되고, AI 코디를 요청할 때만 함께 보내요.
    </>],
    ["2. 이용 목적", <>{PRIVACY.purpose}, 그리고 요청한 상황에 맞는 AI 코디를 만드는 데에만 써요. 광고·판매 목적으로 쓰지 않아요.</>],
    ["3. 보유 기간과 파기", <>{PRIVACY.retention} 전자 파일은 복구할 수 없는 방법으로 지워요. AI 코디 요청 내용은 코디를 만든 뒤 따로 저장하지 않아요.</>],
    ["4. 제3자 제공", <>받은 개인정보를 다른 사람이나 회사에 제공하지 않아요. 법령에 따라 요구되는 경우는 예외예요.</>],
    ["5. 처리 위탁·국외 이전", <>
      서비스를 운영하려고 아래 해외 업체에 일을 맡기고 있어요. 이용자가 요청하는 순간 인터넷으로 전송돼요.<br />
      · <b>Anthropic</b>(미국) — AI 코디 생성. 보내는 정보: 상황 글, 체형·퍼스널컬러 유형. 코디를 만드는 데에만 쓰여요.<br />
      · <b>Web3Forms</b>(해외) — 신청서를 운영자 이메일로 전달. 보내는 정보: 신청서 항목.<br />
      · <b>Vercel</b>(미국) — 사이트 운영 서버. 접속 기록(IP 등)이 남을 수 있어요.<br />
      · <b>Google</b>(미국) — 방문 통계(아래 6번).<br />
      국외 이전을 원하지 않으시면 AI 코디와 신청서를 쓰지 않으시면 돼요. 이 경우 해당 기능만 쓸 수 없어요.
    </>],
    ["6. 자동으로 수집되는 정보", <>방문 통계를 위해 Google Analytics를 써요. 이름·연락처 같은 개인을 알아볼 수 있는 정보는 보내지 않아요. 브라우저 설정에서 쿠키를 거부할 수 있어요.</>],
    ["7. 이용자의 권리", <>언제든 내 개인정보의 열람·정정·삭제·처리정지를 요청할 수 있어요. 요청하시면 지체 없이 처리해요.</>],
    ["8. 만 14세 미만", <>만 14세 미만 아동의 개인정보는 받지 않아요.</>],
    [
      "9. 개인정보 보호책임자·문의처",
      <>
        개인정보 보호책임자: {PRIVACY_OFFICER}
        {IS_CHANNEL_READY ? (
          <> · <a href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="ed-link" style={{ color: ACC, fontWeight: 700 }}>카카오톡 채널로 문의</a></>
        ) : null}
        . 신청 후 받은 연락으로 회신하셔도 돼요.<br />
        개인정보 침해 신고·상담: 개인정보침해신고센터(국번 없이 118, privacy.kisa.or.kr)
      </>,
    ],
  ];

  return (
    <main style={{ minHeight: "100dvh", background: "#ECEAE0", padding: "0 20px 72px", display: "flex", justifyContent: "center", ["--t-acc" as string]: ACC, ["--t-txt" as string]: INK }}>
      <article style={{ width: "100%", maxWidth: "640px", paddingTop: "16px" }}>
        <SiteHeader style={{ marginBottom: "18px" }} />
        <Wordmark text="Privacy" size={24} />
        <div style={{ height: "1px", background: INK, margin: "14px 0 22px" }} />
        <h1 style={{ fontFamily: sans, fontSize: "clamp(27px, 7.5vw, 36px)", fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 1.2, color: INK, margin: 0 }}>
          개인정보처리방침
        </h1>
        <p style={{ fontFamily: sans, fontSize: "14.5px", lineHeight: 1.75, color: SUB, margin: "10px 0 0", wordBreak: "keep-all" }}>
          오늘핏은 1:1 컨설팅 신청에 꼭 필요한 정보만 받고, 안내 목적 외에는 쓰지 않아요.
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
          시행일: {PRIVACY_VERSION}
        </p>
        <SiteFooter />
      </article>
    </main>
  );
}
