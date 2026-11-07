"use client";

import { IS_APPLY_READY, IS_CHANNEL_READY, KAKAO_CHANNEL_URL } from "@/lib/consult";
import { FREE_DAILY } from "@/lib/freeQuota";
import { track } from "@/lib/track";
import { BlockButton } from "./Editorial";

/* ── 오늘 무료 AI 코디를 다 썼을 때 — 1:1 진단 신청·카톡 상담으로 잇는 카드 ── */
export default function FreeLimitCard() {
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  return (
    <div
      className="bubble-enter"
      style={{ border: "1px solid var(--t-txt)", background: "var(--t-bg)", padding: "18px 18px 16px", borderRadius: "2px" }}
    >
      <p className="ed-label" style={{ color: "var(--t-acc)", margin: 0 }}>Today · {FREE_DAILY}/{FREE_DAILY}</p>
      <p style={{ fontFamily: sans, fontWeight: 800, fontSize: "18px", letterSpacing: "-0.04em", lineHeight: 1.4, color: "var(--t-txt)", margin: "8px 0 6px", wordBreak: "keep-all" }}>
        오늘 무료 코디 {FREE_DAILY}번을 다 쓰셨어요
      </p>
      <p style={{ fontFamily: sans, fontSize: "13.5px", lineHeight: 1.7, color: "var(--t-sub)", margin: "0 0 16px", wordBreak: "keep-all" }}>
        내일 다시 {FREE_DAILY}번 받을 수 있어요. 매일 코디가 고민이라면, 1:1 진단에서 내 체형·컬러에 꼭 맞는 옷 입는 공식을 직접 받아보세요.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {IS_APPLY_READY && (
          <BlockButton href="/apply" sub="퍼스널컬러·체형 1:1 오프라인 진단" onClick={() => track("consult_click", { where: "ai_limit", method: "apply" })}>
            1:1 진단 신청하기
          </BlockButton>
        )}
        {IS_CHANNEL_READY && (
          <a
            href={KAKAO_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("consult_click", { where: "ai_limit", method: "kakao" })}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "52px", padding: "0 18px",
              fontFamily: sans, fontWeight: 700, fontSize: "15px", letterSpacing: "-0.025em",
              color: "#191919", background: "#FEE500", borderRadius: "2px", textDecoration: "none",
            }}
          >
            카톡으로 먼저 물어보기 <span aria-hidden>→</span>
          </a>
        )}
      </div>
    </div>
  );
}
