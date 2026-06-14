"use client";

import { forwardRef } from "react";
import { BODY_META, COLOR_META, type BodyType, type ColorType } from "@/lib/profile";
import { BODY_GUIDE, COLOR_GUIDE, CROSS_GUIDE } from "@/lib/styleGuide";

/* ══════════════════════════════════════════════════════════
   StoryCard — 9:16 인스타 스토리 공유 카드 (오늘핏 진단 결과)
   360×640 렌더 → toPng pixelRatio 3 = 1080×1920
   오늘핏 베이지 톤 + 결 캐릭터 + onulfit.com CTA (바이럴 유입)
══════════════════════════════════════════════════════════ */

const W = 360;
const H = 640;
const BG = "#FAF8F5";
const INK = "#2C2825";
const GOLD = "#B89A6A";
const SUB = "#7A7268";
const LINE = "#ECE6DD";

interface Props {
  body: BodyType;
  color: ColorType;
}

const StoryCard = forwardRef<HTMLDivElement, Props>(({ body, color }, ref) => {
  const bm = BODY_META[body];
  const cm = COLOR_META[color];
  const cg = COLOR_GUIDE[color];
  const bg = BODY_GUIDE[body];
  const cross = CROSS_GUIDE[`${body}-${color}`];
  const serif = "var(--font-gowun), 'Batang', serif";
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

  return (
    <div
      ref={ref}
      style={{
        width: W,
        height: H,
        background: BG,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: serif,
      }}
    >
      {/* 상단 골드 라인 */}
      <div style={{ height: 5, background: GOLD, flexShrink: 0 }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "26px 28px 0" }}>
        {/* 브랜드 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
          <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: INK, letterSpacing: "-0.01em" }}>
            오늘핏 · 결의 진단
          </span>
          <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 8, color: GOLD, letterSpacing: "0.18em" }}>
            STYLE REPORT
          </span>
        </div>

        {/* 라벨 */}
        <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 9, color: GOLD, letterSpacing: "0.2em", marginBottom: 10 }}>
          ▼ 내 결
        </p>

        {/* 히어로 — 체형 × 컬러 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
          <h2 style={{ fontFamily: serif, fontSize: 34, fontWeight: 600, color: INK, lineHeight: 1.3, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            {bm.label}
            <span style={{ color: GOLD, fontWeight: 400 }}> × </span>
            {cm.label}
          </h2>

          {cross && (
            <p style={{ fontFamily: serif, fontSize: 15, color: SUB, lineHeight: 1.5, margin: "0 0 22px", padding: "0 8px" }}>
              {cross.persona}
            </p>
          )}
          {!cross && <div style={{ height: 22 }} />}

          {/* 컬러 스와치 */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 22 }}>
            {cm.swatch.map((hex) => (
              <span key={hex} style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: hex, border: `1px solid ${LINE}` }} />
            ))}
          </div>

          {/* 핵심 한 줄 */}
          <div style={{ background: "#fff", border: `1px solid ${LINE}`, borderLeft: `3px solid ${GOLD}`, padding: "16px 18px", textAlign: "left", margin: "0 4px" }}>
            <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 500, color: INK, lineHeight: 1.6, margin: 0, wordBreak: "keep-all" }}>
              {bg.principle}
            </p>
            {cross && (
              <p style={{ fontFamily: sans, fontSize: 12, color: SUB, margin: "10px 0 0", lineHeight: 1.5, wordBreak: "keep-all" }}>
                <span style={{ color: GOLD }}>시그니처 · </span>{cross.signature}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 하단 CTA */}
      <div style={{ background: INK, padding: "18px 28px 22px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: serif, fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 3px" }}>
              너도 네 결 찾아봐 👗
            </p>
            <p style={{ fontFamily: sans, fontSize: 10.5, color: "#B4A890", margin: 0 }}>
              무료 진단 · 체형 + 퍼스널컬러
            </p>
          </div>
          <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 13, fontWeight: 500, color: GOLD, margin: 0, letterSpacing: "0.02em" }}>
            onulfit.com
          </p>
        </div>
      </div>
    </div>
  );
});

StoryCard.displayName = "StoryCard";
export default StoryCard;
