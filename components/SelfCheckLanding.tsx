"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { THEMES, DEFAULT_MOOD } from "@/lib/themes";
import { getProfile, BODY_META, COLOR_META, type Profile } from "@/lib/profile";
import { track } from "@/lib/track";
import Diagnosis from "./Diagnosis";
import SelfCheckGuide from "./SelfCheckGuide";
import ConsultCTA from "./ConsultCTA";
import { Wordmark, SectionHead, Reveal, BlockButton } from "./Editorial";

/* ── /self-check 자가진단 랜딩 ──
   검색("체형 자가진단 테스트", "무슨 톤인지 아는 법")과 블로그 링크가 도착하는 곳.
   무엇을 살펴보는지 먼저 한눈에 보여주고, 바로 시작할 수 있게. */

const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

export default function SelfCheckLanding() {
  const vars = THEMES[DEFAULT_MOOD].vars;
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const start = (where: string) => {
    track("diag_open", { where });
    setOpen(true);
  };

  const startBtn = (where: string, label = "자가진단 시작하기") => (
    <BlockButton onClick={() => start(where)} sub="약 1분 · 사진 업로드 없음">
      {label}
    </BlockButton>
  );

  return (
    <div className="theme-root" style={{ ...(vars as React.CSSProperties), minHeight: "100dvh", backgroundColor: "var(--t-bg)" }}>
      {open && (
        <Diagnosis vars={vars} onComplete={(p) => setProfile(p)} onClose={() => setOpen(false)} />
      )}

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "16px 20px 64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid var(--t-txt)", marginBottom: "18px" }}>
          <Link href="/" className="ed-label ed-link" style={{ color: "var(--t-txt)" }}>← OnulFit</Link>
          <Link href="/apply" className="ed-label ed-link" style={{ color: "var(--t-acc)" }}>1:1 진단</Link>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span className="ed-label" style={{ color: "var(--t-acc)" }}>Free self-check</span>
          <span className="ed-label" style={{ color: "var(--t-sub)" }}>Body · Color</span>
        </div>
        <Wordmark text="Self-check" size={24} />
        <div style={{ height: "1px", background: "var(--t-txt)", margin: "14px 0 20px" }} />

        <h1 style={{ fontFamily: sans, fontSize: "clamp(30px, 8.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 1.12, color: "var(--t-txt)", margin: 0, wordBreak: "keep-all" }}>
          무료 체형·퍼스널컬러 자가진단
        </h1>
        <p style={{ fontFamily: sans, fontSize: "15px", fontWeight: 500, lineHeight: 1.7, color: "var(--t-sub)", margin: "12px 0 18px", wordBreak: "keep-all" }}>
          거울 앞에서 10가지만 확인하면, 내 골격 타입(스트레이트·웨이브·내추럴)과 퍼스널컬러(봄웜·여름쿨·가을웜·겨울쿨)를 알려드려요.
        </p>

        {/* 한 줄 요약 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: "1px solid var(--t-txt)", borderBottom: "1px solid var(--t-txt)", marginBottom: "18px" }}>
          {[
            ["1분", "걸리는 시간"],
            ["10문항", "골격 5 · 컬러 5"],
            ["무료", "사진 업로드 없음"],
          ].map(([big, small]) => (
            <div key={big} style={{ padding: "12px 8px 12px 0", borderLeft: big === "1분" ? "none" : "1px solid var(--t-bdr)", paddingLeft: big === "1분" ? 0 : "10px" }}>
              <p style={{ fontFamily: sans, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.05em", color: "var(--t-acc)", margin: 0, lineHeight: 1.1 }}>{big}</p>
              <p style={{ fontFamily: sans, fontSize: "11.5px", fontWeight: 500, color: "var(--t-sub)", margin: "4px 0 0" }}>{small}</p>
            </div>
          ))}
        </div>

        {/* 이미 진단한 사람 */}
        {profile && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "12px 14px", marginBottom: "12px", backgroundColor: "var(--t-card)", border: "2px solid var(--t-acc)", borderRadius: "2px" }}>
            <span style={{ fontFamily: sans, fontSize: "13px", color: "var(--t-txt)", wordBreak: "keep-all" }}>
              내 결과 · <b>{BODY_META[profile.body].label}</b> × <b>{COLOR_META[profile.color].label}</b>
            </span>
            <Link href="/" style={{ flexShrink: 0, fontFamily: sans, fontSize: "12.5px", color: "var(--t-acc)", textDecoration: "none" }}>
              코디 받기 →
            </Link>
          </div>
        )}

        {startBtn("self_check_top", profile ? "다시 진단하기" : undefined)}

        {/* 이렇게 살펴봐요 */}
        <Reveal style={{ marginTop: "44px" }}>
          <SectionHead
            no="01"
            en="How it works"
            title="이렇게 살펴봐요"
            sub="준비물은 거울 하나와 밝은 곳(가능하면 자연광). 화장은 연하게 할수록 컬러 결과가 정확해요."
          />
          <SelfCheckGuide />
        </Reveal>

        {/* 결과로 알 수 있는 것 */}
        <Reveal style={{ marginTop: "44px" }}>
          <SectionHead no="02" en="What you get" title="결과로 알 수 있는 것" />
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", borderTop: "1px solid var(--t-txt)" }}>
            {[
              ["내 골격 타입", "스트레이트·웨이브·내추럴 중 어디에 가까운지, 두 타입이 섞였는지까지"],
              ["어울리는 옷 · 피할 옷", "넥라인, 상의, 하의, 아우터, 소재까지 아이템별로"],
              ["내 퍼스널컬러 팔레트", "베스트 컬러, 피하면 좋은 색, 어울리는 금속과 메이크업"],
              ["상황별 추천 코디", "결과를 바탕으로 오늘 입을 옷까지"],
            ].map(([t, d], i) => (
              <li key={t} style={{ display: "grid", gridTemplateColumns: "34px 1fr", padding: "14px 0", borderBottom: "1px solid var(--t-txt)" }}>
                <span style={{ fontFamily: "var(--font-grotesk), sans-serif", fontWeight: 800, fontSize: "12px", color: "var(--t-acc)", paddingTop: "3px" }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                <p style={{ fontFamily: sans, fontSize: "17px", fontWeight: 800, letterSpacing: "-0.035em", color: "var(--t-txt)", margin: 0 }}>{t}</p>
                <p style={{ fontFamily: sans, fontSize: "12.5px", color: "var(--t-sub)", margin: "2px 0 0", lineHeight: 1.6, wordBreak: "keep-all" }}>{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <div style={{ marginTop: "28px" }}>{startBtn("self_check_bottom")}</div>

        {/* 1:1 진단 */}
        <ConsultCTA where="self_check" />

        {/* 더 읽기 */}
        <section style={{ marginTop: "44px", borderTop: "1px solid var(--t-txt)", paddingTop: "10px" }}>
          <p className="ed-label" style={{ color: "var(--t-txt)", margin: "0 0 4px" }}>
            <span className="ed-accent" style={{ fontSize: "22px", textTransform: "none", color: "var(--t-acc)" }}>No.03</span>&nbsp;&nbsp;Read more
          </p>
          <p style={{ fontFamily: sans, fontSize: "13px", color: "var(--t-sub)", margin: "0 0 6px" }}>자가진단 방법을 글로 자세히 보고 싶다면</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              ["/guide/golgyeok-self-check", "체형 자가진단 — 골격 1분 구분법"],
              ["/guide/personal-color-guide", "퍼스널컬러 자가진단 — 나는 무슨 톤일까"],
            ].map(([href, t]) => (
              <Link key={href} href={href} style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "14px 0", borderBottom: "1px solid var(--t-txt)", fontFamily: sans, fontSize: "16px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--t-txt)", textDecoration: "none", wordBreak: "keep-all" }}>
                {t} <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
