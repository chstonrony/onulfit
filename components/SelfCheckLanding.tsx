"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { THEMES, DEFAULT_MOOD } from "@/lib/themes";
import { getProfile, BODY_META, COLOR_META, type Profile } from "@/lib/profile";
import { track } from "@/lib/track";
import Diagnosis from "./Diagnosis";
import SelfCheckGuide from "./SelfCheckGuide";
import ConsultCTA from "./ConsultCTA";

/* ── /self-check 자가진단 랜딩 ──
   검색("체형 자가진단 테스트", "무슨 톤인지 아는 법")과 블로그 링크가 도착하는 곳.
   무엇을 살펴보는지 먼저 한눈에 보여주고, 바로 시작할 수 있게. */

const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
const serif = "var(--font-gowun), 'Batang', serif";

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

  const startBtn = (where: string, label = "자가진단 시작하기 · 약 1분") => (
    <button
      onClick={() => start(where)}
      style={{
        width: "100%", height: "54px", border: "none", borderRadius: "14px", cursor: "pointer",
        backgroundColor: "var(--t-acc)", color: "#fff",
        fontFamily: sans, fontSize: "15px", fontWeight: 600, letterSpacing: "0.01em",
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="theme-root" style={{ ...(vars as React.CSSProperties), minHeight: "100dvh", backgroundColor: "var(--t-bg)" }}>
      {open && (
        <Diagnosis vars={vars} onComplete={(p) => setProfile(p)} onClose={() => setOpen(false)} />
      )}

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 18px 64px" }}>
        <Link href="/" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic", fontSize: "13px", color: "var(--t-sub)", textDecoration: "none" }}>
          ← onulfit
        </Link>

        <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic", fontSize: "14px", color: "var(--t-acc)", margin: "16px 0 4px" }}>
          Free self-check
        </p>
        <h1 style={{ fontFamily: serif, fontSize: "clamp(26px, 7vw, 34px)", fontWeight: 400, lineHeight: 1.35, color: "var(--t-txt)", margin: 0, wordBreak: "keep-all" }}>
          무료 체형·퍼스널컬러 자가진단
        </h1>
        <p style={{ fontFamily: sans, fontSize: "14px", lineHeight: 1.75, color: "var(--t-sub)", margin: "10px 0 16px", wordBreak: "keep-all" }}>
          거울 앞에서 10가지만 확인하면, 내 골격 타입(스트레이트·웨이브·내추럴)과 퍼스널컬러(봄웜·여름쿨·가을웜·겨울쿨)를 알려드려요.
        </p>

        {/* 한 줄 요약 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
          {[
            ["1분", "걸리는 시간"],
            ["10문항", "골격 5 · 컬러 5"],
            ["무료", "사진 업로드 없음"],
          ].map(([big, small]) => (
            <div key={big} style={{ textAlign: "center", padding: "12px 6px", backgroundColor: "var(--t-card)", border: "1px solid var(--t-bdr)", borderRadius: "12px" }}>
              <p style={{ fontFamily: serif, fontSize: "19px", color: "var(--t-txt)", margin: 0 }}>{big}</p>
              <p style={{ fontFamily: sans, fontSize: "11px", color: "var(--t-sub)", margin: "2px 0 0" }}>{small}</p>
            </div>
          ))}
        </div>

        {/* 이미 진단한 사람 */}
        {profile && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "12px 14px", marginBottom: "12px", backgroundColor: "var(--t-card)", border: "1px solid var(--t-acc)", borderRadius: "12px" }}>
            <span style={{ fontFamily: sans, fontSize: "13px", color: "var(--t-txt)", wordBreak: "keep-all" }}>
              내 결과 · <b>{BODY_META[profile.body].label}</b> × <b>{COLOR_META[profile.color].label}</b>
            </span>
            <Link href="/" style={{ flexShrink: 0, fontFamily: sans, fontSize: "12.5px", color: "var(--t-acc)", textDecoration: "none" }}>
              코디 받기 →
            </Link>
          </div>
        )}

        {startBtn("self_check_top", profile ? "다시 진단하기 · 약 1분" : undefined)}

        {/* 이렇게 살펴봐요 */}
        <section style={{ marginTop: "32px" }}>
          <h2 style={{ fontFamily: serif, fontSize: "21px", fontWeight: 400, color: "var(--t-txt)", margin: "0 0 4px" }}>이렇게 살펴봐요</h2>
          <p style={{ fontFamily: sans, fontSize: "13px", color: "var(--t-sub)", margin: "0 0 14px", lineHeight: 1.7, wordBreak: "keep-all" }}>
            준비물은 거울 하나와 밝은 곳(가능하면 자연광). 화장은 연하게 할수록 컬러 결과가 정확해요.
          </p>
          <SelfCheckGuide />
        </section>

        {/* 결과로 알 수 있는 것 */}
        <section style={{ marginTop: "32px" }}>
          <h2 style={{ fontFamily: serif, fontSize: "21px", fontWeight: 400, color: "var(--t-txt)", margin: "0 0 14px" }}>결과로 알 수 있는 것</h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              ["내 골격 타입", "스트레이트·웨이브·내추럴 중 어디에 가까운지, 두 타입이 섞였는지까지"],
              ["어울리는 옷 · 피할 옷", "넥라인, 상의, 하의, 아우터, 소재까지 아이템별로"],
              ["내 퍼스널컬러 팔레트", "베스트 컬러, 피하면 좋은 색, 어울리는 금속과 메이크업"],
              ["상황별 추천 코디", "결과를 바탕으로 오늘 입을 옷까지"],
            ].map(([t, d]) => (
              <li key={t} style={{ padding: "12px 14px", backgroundColor: "var(--t-card)", border: "1px solid var(--t-bdr)", borderRadius: "12px" }}>
                <p style={{ fontFamily: sans, fontSize: "14px", fontWeight: 600, color: "var(--t-txt)", margin: 0 }}>{t}</p>
                <p style={{ fontFamily: sans, fontSize: "12.5px", color: "var(--t-sub)", margin: "2px 0 0", lineHeight: 1.6, wordBreak: "keep-all" }}>{d}</p>
              </li>
            ))}
          </ul>
        </section>

        <div style={{ marginTop: "24px" }}>{startBtn("self_check_bottom")}</div>

        {/* 1:1 진단 */}
        <ConsultCTA where="self_check" />

        {/* 더 읽기 */}
        <section style={{ marginTop: "32px", borderTop: "1px solid var(--t-bdr)", paddingTop: "20px" }}>
          <p style={{ fontFamily: sans, fontSize: "12px", color: "var(--t-sub)", margin: "0 0 10px" }}>자가진단 방법을 글로 자세히 보고 싶다면</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link href="/guide/golgyeok-self-check" style={{ fontFamily: serif, fontSize: "15px", color: "var(--t-txt)", textDecoration: "none" }}>
              체형 자가진단 — 골격 1분 구분법 →
            </Link>
            <Link href="/guide/personal-color-guide" style={{ fontFamily: serif, fontSize: "15px", color: "var(--t-txt)", textDecoration: "none" }}>
              퍼스널컬러 자가진단 — 나는 무슨 톤일까 →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
