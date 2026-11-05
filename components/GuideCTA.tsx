"use client";

import Link from "next/link";
import { IS_APPLY_READY } from "@/lib/consult";
import { track } from "@/lib/track";

/* ── 가이드 글 하단 CTA ──
   검색으로 가이드 글에 바로 들어온 사람을
   ① 무료 자가진단(홈 진단 오버레이 자동 오픈) ② 1:1 진단 신청으로 잇는다. */

const INK = "#2C2825";
const SUB = "#7A7168";
const ACC = "#8A7C6E";
const BDR = "#E5E1DA";
const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
const serif = "var(--font-gowun), 'Batang', serif";

export default function GuideCTA({ slug }: { slug: string }) {
  return (
    <div style={{ margin: "40px 0 32px", display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* 무료 자가진단 */}
      <Link
        href="/?diag=1"
        onClick={() => track("diag_open", { where: "guide", slug })}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", height: "52px",
          fontFamily: sans, fontSize: "14px", fontWeight: 500,
          color: "#fff", backgroundColor: INK, borderRadius: "12px", textDecoration: "none",
        }}
      >
        내 체형·퍼스널컬러 무료 자가진단 →
      </Link>

      {/* 1:1 상담 신청 */}
      {IS_APPLY_READY && (
        <div style={{ padding: "22px 20px", background: "#fff", border: `1px solid ${BDR}`, borderRadius: "16px" }}>
          <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic", fontSize: "13px", color: ACC, margin: 0 }}>
            1:1 Consulting
          </p>
          <p style={{ fontFamily: serif, fontSize: "19px", color: INK, margin: "6px 0 8px", lineHeight: 1.45, wordBreak: "keep-all" }}>
            혼자 해봐도 헷갈린다면, 직접 봐드릴게요
          </p>
          <p style={{ fontFamily: sans, fontSize: "13.5px", color: SUB, lineHeight: 1.75, margin: "0 0 16px", wordBreak: "keep-all" }}>
            골격과 퍼스널컬러를 1:1로 진단하고, 지금 가진 옷으로 어떻게 입으면 되는지까지 정리해 드려요.
          </p>
          <Link
            href="/apply"
            onClick={() => track("consult_click", { where: "guide", method: "apply", slug })}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", height: "48px",
              fontFamily: sans, fontSize: "14px", fontWeight: 600,
              color: "#FAF8F6", backgroundColor: ACC, borderRadius: "12px", textDecoration: "none",
            }}
          >
            1:1 진단 신청하기 →
          </Link>
        </div>
      )}
    </div>
  );
}
