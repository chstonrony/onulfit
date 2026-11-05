"use client";

import { KAKAO_CHANNEL_URL, IS_CHANNEL_READY, IS_APPLY_READY } from "@/lib/consult";
import { track } from "@/lib/track";
import { BlockButton } from "./Editorial";

/* ── 1:1 진단 컨설팅 CTA ──
   무료 진단/코디 결과 끝에 붙어, "정확한 1:1 진단"으로 연결하는 깔때기.
   주 버튼 = 신청서(/apply, 신청 건수가 GA에 잡힘), 보조 = 카카오톡 문의.
   둘 다 설정 전이면 렌더하지 않는다(빈 링크 방지).
   디자인: 포인트 컬러 풀블록. */
export default function ConsultCTA({ where }: { where: "diagnosis" | "outfit" | "self_check" }) {
  if (!IS_APPLY_READY && !IS_CHANNEL_READY) return null;
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  return (
    <section
      style={{
        marginTop: "32px",
        padding: "22px 20px 22px",
        backgroundColor: "var(--t-fill, #F0642F)",
        color: "var(--t-txt)",
        borderRadius: "2px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="ed-label">Consulting</span>
        <span className="ed-label">1:1</span>
      </div>
      <p className="ed-accent" style={{ fontSize: "38px", lineHeight: 1, margin: "22px 0 0" }}>
        Personal consulting
      </p>
      <p style={{ fontFamily: sans, fontSize: "25px", fontWeight: 800, letterSpacing: "-0.05em", margin: "12px 0 10px", lineHeight: 1.22, wordBreak: "keep-all" }}>
        결과가 더 궁금하세요?<br />1:1 진단으로 정확하게.
      </p>
      <p style={{ fontFamily: sans, fontSize: "14px", fontWeight: 500, opacity: 0.9, lineHeight: 1.7, margin: "0 0 20px", wordBreak: "keep-all" }}>
        화면 속 진단을 넘어, 퍼스널컬러·체형을 직접 봐드려요. 나에게 맞는 색과 핏을 평생 쓰는 가이드로 정리해 드립니다.
      </p>

      {IS_APPLY_READY && (
        <BlockButton href="/apply" tone="ink" onClick={() => track("consult_click", { where, method: "apply" })}>
          1:1 진단 신청하기
        </BlockButton>
      )}

      {IS_CHANNEL_READY && (
        <a
          href={KAKAO_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("consult_click", { where, method: "kakao" })}
          className="ed-link"
          style={
            IS_APPLY_READY
              ? { display: "inline-block", marginTop: "14px", fontFamily: sans, fontSize: "13.5px", fontWeight: 600, color: "var(--t-txt)" }
              : { display: "flex", alignItems: "center", justifyContent: "center", height: "56px", background: "var(--t-txt)", color: "var(--t-bg)", fontFamily: sans, fontWeight: 700, fontSize: "15px", borderRadius: "2px" }
          }
        >
          카카오톡으로 먼저 물어보기 →
        </a>
      )}
    </section>
  );
}
