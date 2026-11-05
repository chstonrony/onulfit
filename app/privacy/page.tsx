import Link from "next/link";
import type { Metadata } from "next";
import { PRIVACY, PRIVACY_VERSION, KAKAO_CHANNEL_URL, IS_CHANNEL_READY } from "@/lib/consult";
import { Wordmark } from "@/components/Editorial";

/* ── 개인정보처리방침 ──
   1:1 컨설팅 신청서(/apply)가 개인정보를 받기 때문에 공개해 두는 안내문.
   시범 운영 단계의 기본 문안 — 정식 오픈·사업자 등록 시 운영 주체·연락처를 보완할 것. */

export const metadata: Metadata = {
  title: "개인정보처리방침 | 오늘핏",
  description: "오늘핏 1:1 컨설팅 신청서의 개인정보 수집·이용·보관 안내",
  alternates: { canonical: "https://onulfit.com/privacy" },
};

const INK = "#1B1714";
const ACC = "#B44218";
const SUB = "#6F665D";
const BODY = "#2E2925";
const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

export default function PrivacyPage() {
  const sections: [string, React.ReactNode][] = [
    ["1. 수집하는 개인정보", <>1:1 컨설팅 신청서에서 다음 정보를 받아요. {PRIVACY.items}.<br />무료 자가진단 결과는 서버로 보내지 않고, 이용자 기기(브라우저)에만 저장돼요.</>],
    ["2. 이용 목적", <>{PRIVACY.purpose}에만 써요. 광고·판매 목적으로 쓰지 않아요.</>],
    ["3. 보유 기간과 파기", <>{PRIVACY.retention} 전자 파일은 복구할 수 없는 방법으로 지워요.</>],
    ["4. 제3자 제공", <>받은 개인정보를 다른 사람이나 회사에 제공하지 않아요. 법령에 따라 요구되는 경우는 예외예요.</>],
    ["5. 처리 위탁·국외 이전", <>{PRIVACY.processor} 이 서비스는 신청서를 전달하는 데에만 쓰여요.</>],
    ["6. 자동으로 수집되는 정보", <>방문 통계를 위해 Google Analytics를 써요. 이름·연락처 같은 개인을 알아볼 수 있는 정보는 보내지 않아요. 브라우저 설정에서 쿠키를 거부할 수 있어요.</>],
    ["7. 이용자의 권리", <>언제든 내 개인정보의 열람·정정·삭제·처리정지를 요청할 수 있어요. 요청하시면 지체 없이 처리해요.</>],
    ["8. 만 14세 미만", <>만 14세 미만 아동의 개인정보는 받지 않아요.</>],
    [
      "9. 문의처",
      <>
        오늘핏 운영자{IS_CHANNEL_READY ? (
          <> · <a href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="ed-link" style={{ color: ACC, fontWeight: 700 }}>카카오톡 채널로 문의</a></>
        ) : null}
        . 신청 후 받은 연락으로 회신하셔도 돼요.
      </>,
    ],
  ];

  return (
    <main style={{ minHeight: "100dvh", background: "#EDE8E2", padding: "0 20px 72px", display: "flex", justifyContent: "center", ["--t-acc" as string]: ACC, ["--t-txt" as string]: INK }}>
      <article style={{ width: "100%", maxWidth: "640px", paddingTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: `1px solid ${INK}`, marginBottom: "18px" }}>
          <Link href="/" className="ed-label ed-link" style={{ color: INK }}>← OnulFit</Link>
          <Link href="/apply" className="ed-label ed-link" style={{ color: ACC }}>1:1 진단 신청</Link>
        </div>
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
            <section key={t} style={{ padding: "16px 0", borderBottom: `1px solid #D9D1C7` }}>
              <h2 style={{ fontFamily: sans, fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: INK, margin: "0 0 6px" }}>{t}</h2>
              <p style={{ fontFamily: sans, fontSize: "14.5px", lineHeight: 1.8, color: BODY, margin: 0, wordBreak: "keep-all" }}>{body}</p>
            </section>
          ))}
        </div>

        <p style={{ fontFamily: sans, fontSize: "12.5px", color: SUB, margin: "18px 0 0" }}>
          시행일: {PRIVACY_VERSION}
        </p>
      </article>
    </main>
  );
}
