"use client";

import Link from "next/link";
import { IS_APPLY_READY } from "@/lib/consult";
import { track } from "@/lib/track";
import { BlockButton } from "./Editorial";

/* ── 가이드 글 하단 CTA ──
   검색으로 가이드 글에 바로 들어온 사람을
   ① 무료 자가진단(홈 진단 오버레이 자동 오픈) ② 1:1 진단 신청으로 잇는다. */

const INK = "#1B1714";
const ACC = "#C23B22";
const PAPER = "#EDE8E2";
const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

export default function GuideCTA({ slug }: { slug: string }) {
  return (
    <div style={{ margin: "48px 0 36px", display: "flex", flexDirection: "column", gap: "14px", ["--t-acc" as string]: ACC, ["--t-txt" as string]: INK, ["--t-bg" as string]: PAPER }}>
      {/* 무료 자가진단 */}
      <Link
        href="/?diag=1"
        onClick={() => track("diag_open", { where: "guide", slug })}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "62px", padding: "0 18px",
          fontFamily: sans, fontSize: "16px", fontWeight: 700, letterSpacing: "-0.025em",
          color: PAPER, backgroundColor: INK, borderRadius: "2px", textDecoration: "none",
        }}
      >
        내 체형·퍼스널컬러 무료 자가진단 <span style={{ fontSize: "20px" }}>→</span>
      </Link>

      {/* 1:1 상담 신청 */}
      {IS_APPLY_READY && (
        <div style={{ padding: "22px 20px", background: ACC, color: PAPER, borderRadius: "2px" }}>
          <span className="ed-label">Consulting · 1:1</span>
          <p className="ed-accent" style={{ fontSize: "36px", lineHeight: 1, margin: "18px 0 0" }}>
            1:1 Consulting
          </p>
          <p style={{ fontFamily: sans, fontSize: "23px", fontWeight: 800, letterSpacing: "-0.05em", margin: "10px 0 8px", lineHeight: 1.25, wordBreak: "keep-all" }}>
            혼자 해봐도 헷갈린다면, 직접 봐드릴게요
          </p>
          <p style={{ fontFamily: sans, fontSize: "14px", fontWeight: 500, opacity: 0.9, lineHeight: 1.7, margin: "0 0 18px", wordBreak: "keep-all" }}>
            골격과 퍼스널컬러를 1:1로 진단하고, 지금 가진 옷으로 어떻게 입으면 되는지까지 정리해 드려요.
          </p>
          <BlockButton href="/apply" tone="paper" onClick={() => track("consult_click", { where: "guide", method: "apply", slug })}>
            1:1 진단 신청하기
          </BlockButton>
        </div>
      )}
    </div>
  );
}
