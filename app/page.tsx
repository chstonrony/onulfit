"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Message, OutfitRecommendation } from "@/lib/types";
import { THEMES, DEFAULT_MOOD, MoodKey } from "@/lib/themes";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import LoadingState from "@/components/LoadingState";
import OutfitCard from "@/components/OutfitCard";
import MoodSelector from "@/components/MoodSelector";
import ColorPalette from "@/components/ColorPalette";
import SituationSelector from "@/components/SituationSelector";
import Diagnosis from "@/components/Diagnosis";
import OnulSeries from "@/components/series/OnulSeries";
import { getProfile, BODY_META, COLOR_META, type Profile } from "@/lib/profile";
import { GYEOL } from "@/lib/gyeol";

/* 무드별 로고 파일 매핑 */
function getLogoSrc(mood: MoodKey): string {
  if (mood === "presence") return "/onulfit_logo_dark.svg";
  if (mood === "allure" || mood === "shine") return "/onulfit_logo_shine.svg";
  return "/onulfit_logo_light.svg";
}

type MobileTab = "chat" | "outfit";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState<MoodKey>(DEFAULT_MOOD);
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showDiag, setShowDiag] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const theme = THEMES[mood];
  const vars = theme.vars;

  useEffect(() => {
    // 웰컴 화면(메시지 없음)에선 히어로부터 보이도록 자동 스크롤 안 함
    if (messages.length === 0) return;
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // 저장된 골격·컬러 프로필 로드
  useEffect(() => {
    setProfile(getProfile());
  }, []);

  // /guide 등에서 ?diag=1 로 진입하면 진단 자동 오픈 (URL은 정리)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("diag") === "1") {
      setShowDiag(true);
      window.history.replaceState(null, "", "/");
    }
  }, []);

  const handleSubmit = async (situation: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: situation,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    // 모바일: 로딩 시작하면 코디 탭으로 이동
    setMobileTab("outfit");

    try {
      const res = await fetch("/api/outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation,
          bodyType: profile?.body,
          colorType: profile?.color,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "알 수 없는 오류가 발생했습니다.");

      const outfit = data as OutfitRecommendation;
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "오늘의 코디를 완성했어요.",
          outfit,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setMobileTab("chat");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            err instanceof Error
              ? err.message
              : "코디 추천 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasMessages = messages.length > 0;
  const lastOutfit = [...messages].reverse().find((m) => m.outfit)?.outfit;

  return (
    <div
      className="theme-root grain-panel flex flex-col h-full lg:flex-row"
      style={vars as React.CSSProperties}
    >

      {/* 결의 진단 오버레이 */}
      {showDiag && (
        <Diagnosis
          vars={vars}
          onComplete={(p) => setProfile(p)}
          onClose={() => setShowDiag(false)}
        />
      )}

      {/* ══════════════════════════════════════════
          모바일 전용 헤더 (lg 이상에서 숨김)
      ══════════════════════════════════════════ */}
      <header
        className="lg:hidden flex-shrink-0 flex flex-col gap-2.5 px-5 py-3"
        style={{
          backgroundColor: "var(--t-side)",
          borderBottom: "1px solid var(--t-bdr)",
        }}
      >
        <Image
          key={getLogoSrc(mood)}
          src={getLogoSrc(mood)}
          alt="OnulFit"
          width={140}
          height={42}
          priority
          unoptimized
          style={{ width: "132px", height: "auto", display: "block" }}
        />
        <MoodSelector selected={mood} onChange={setMood} vars={vars} compact />
      </header>

      {/* ══════════════════════════════════════════
          왼쪽 사이드바 (데스크탑 항상 표시 / 모바일 chat 탭)
      ══════════════════════════════════════════ */}
      <div
        className={`
          flex flex-col flex-1 min-h-0
          lg:flex-none lg:w-[460px] lg:min-w-[400px] lg:h-full lg:flex
          ${mobileTab === "chat" ? "flex" : "hidden lg:flex"}
        `}
        style={{
          backgroundColor: "var(--t-side)",
          borderRight: "1px solid var(--t-bdr)",
          /* 모바일: 탭바 높이(64px) 만큼 여백 */
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* 데스크탑 전용 헤더 */}
        <header
          className="hidden lg:block flex-shrink-0 px-9 py-6"
          style={{ borderBottom: "1px solid var(--t-bdr)" }}
        >
          <div className="mb-5">
            <Image
              key={getLogoSrc(mood)}
              src={getLogoSrc(mood)}
              alt="OnulFit"
              width={160}
              height={48}
              priority
              unoptimized
              style={{
                width: "clamp(120px, 40vw, 160px)",
                height: "auto",
                display: "block",
              }}
            />
          </div>
          <MoodSelector selected={mood} onChange={setMood} vars={vars} />
        </header>

        {/* 결 프로필 칩 — 진단 진입점 (데스크탑 전용 / 모바일은 히어로 아래로 이동) */}
        <div className="hidden lg:block">
          <ProfileChip profile={profile} vars={vars} onOpen={() => setShowDiag(true)} />
        </div>

        {/* 채팅 히스토리 */}
        <div className="flex-1 overflow-y-auto px-5 lg:px-6 py-5 lg:py-6 space-y-4 min-h-0">
          {!hasMessages && (
            <WelcomeGuide onExample={handleSubmit} isLoading={isLoading} vars={vars} onDiagnose={() => setShowDiag(true)} profile={profile} />
          )}

          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div
                className="px-5 py-3"
                style={{
                  backgroundColor: "var(--t-bai)",
                  border: "1px solid var(--t-baib)",
                  borderRadius: "20px 20px 20px 5px",
                }}
              >
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: "var(--t-sub)",
                        animation: `fadePulse 900ms ease-in-out ${i * 180}ms infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* 입력창 — 모바일 하단 탭바(약 64px) 위로 올라오게 여백 확보 */}
        <div
          className="flex-shrink-0 lg:!pb-0"
          style={{ backgroundColor: "var(--t-side)", paddingBottom: "calc(64px + env(safe-area-inset-bottom))" }}
        >
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          오른쪽 결과 패널 (데스크탑 항상 표시 / 모바일 outfit 탭)
      ══════════════════════════════════════════ */}
      <div
        className={`
          flex-1 overflow-y-auto
          lg:h-full lg:flex lg:flex-col
          ${mobileTab === "outfit" ? "flex flex-col" : "hidden lg:flex lg:flex-col"}
        `}
        style={{ backgroundColor: "var(--t-bg)" }}
      >
        {/* 컬러 팔레트 */}
        <div
          className="px-6 lg:px-12 pt-8 lg:pt-10 pb-6 lg:pb-8 max-w-[720px] mx-auto w-full flex-shrink-0"
          style={{ borderBottom: "1px solid var(--t-bdr)" }}
        >
          <ColorPalette palette={theme.palette} mood={mood} />
        </div>

        {/* 메인 콘텐츠 */}
        <div
          className="px-6 lg:px-12 py-8 lg:py-10 max-w-[720px] mx-auto w-full flex-1"
          style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom))" }}
        >
          {isLoading ? (
            <LoadingState />
          ) : lastOutfit ? (
            <OutfitCard outfit={lastOutfit} profile={profile} vars={vars} />
          ) : (
            <EmptyState onExample={handleSubmit} vars={vars} />
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          모바일 하단 탭바 (lg 이상에서 숨김)
      ══════════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 flex flex-shrink-0"
        style={{
          backgroundColor: "var(--t-side)",
          borderTop: "1px solid var(--t-bdr)",
          paddingBottom: "env(safe-area-inset-bottom)",
          zIndex: 50,
        }}
      >
        {(["chat", "outfit"] as MobileTab[]).map((tab) => {
          const isActive = mobileTab === tab;
          const label = tab === "chat" ? "상황 선택" : "코디 결과";
          const icon = tab === "chat" ? (
            /* 말풍선 아이콘 */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          ) : (
            /* 옷걸이 아이콘 */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
            </svg>
          );

          return (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isActive ? "var(--t-acc)" : "var(--t-sub)",
                opacity: isActive ? 1 : 0.5,
                transition: "all 0.2s ease",
              }}
            >
              {icon}
              <span style={{
                fontFamily: "var(--font-noto-sans), sans-serif",
                fontWeight: isActive ? 500 : 400,
                fontSize: "11px",
                letterSpacing: "0.03em",
              }}>
                {label}
              </span>
              {/* 코디 결과 탭 — 결과 있을 때 점 표시 */}
              {tab === "outfit" && lastOutfit && (
                <span style={{
                  position: "absolute",
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "var(--t-acc)",
                  top: "10px",
                  transform: "translateX(12px)",
                }} />
              )}
            </button>
          );
        })}
      </nav>

    </div>
  );
}

/* ── 결 프로필 칩 (진단 진입점) ── */
function ProfileChip({
  profile,
  vars,
  onOpen,
}: {
  profile: Profile | null;
  vars: Record<string, string>;
  onOpen: () => void;
}) {
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const hasProfile = !!profile;
  const labelText = hasProfile
    ? `내 결 · ${BODY_META[profile!.body].label} · ${COLOR_META[profile!.color].label}`
    : `결에게 골격·퍼스널컬러 진단받기`;

  return (
    <div className="flex-shrink-0 px-5 lg:px-6 pt-4">
      <button
        onClick={onOpen}
        className="w-full flex items-center justify-between gap-2"
        style={{
          padding: "11px 14px",
          backgroundColor: hasProfile ? "var(--t-bai)" : "var(--t-side)",
          border: `1px solid ${hasProfile ? "var(--t-acc)" : "var(--t-bdr)"}`,
          borderRadius: "12px",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontFamily: sans, fontSize: "12.5px", fontWeight: hasProfile ? 500 : 400, color: hasProfile ? "var(--t-txt)" : "var(--t-sub)", wordBreak: "keep-all" }}>
          {labelText}
        </span>
        <span style={{ fontFamily: sans, fontSize: "11px", color: "var(--t-acc)", flexShrink: 0 }}>
          {hasProfile ? "다시 진단 ✎" : "시작 →"}
        </span>
      </button>
    </div>
  );
}

/* ── Welcome Guide ── */
function WelcomeGuide({
  onExample,
  isLoading,
  vars,
  onDiagnose,
  profile,
}: {
  onExample: (s: string) => void;
  isLoading: boolean;
  vars: Record<string, string>;
  onDiagnose: () => void;
  profile: Profile | null;
}) {
  const serif = "var(--font-gowun), 'Batang', serif";
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const point = vars["--t-point"] ?? vars["--t-acc"];
  const acc = vars["--t-acc"];
  const hasProfile = !!profile;
  const profileLabel = hasProfile
    ? `내 결 · ${BODY_META[profile!.body].label} · ${COLOR_META[profile!.color].label}`
    : `결에게 골격·퍼스널컬러 진단받기`;
  return (
    <div className="py-2">

      {/* ── 히어로 — 클린 에디토리얼 (인스타 피드 감성) ── */}
      <div className="bubble-enter" style={{ marginBottom: "30px" }}>

        {/* 풀블리드 이미지 + 미니멀 오버레이 */}
        <div style={{ position: "relative", width: "100%", borderRadius: "22px", overflow: "hidden", backgroundColor: vars["--t-bdr"] }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-main.png"
            alt="오늘핏 — 오늘의 룩"
            style={{ width: "100%", height: "548px", objectFit: "cover", objectPosition: "center 26%", display: "block" }}
          />
          {/* 사진 위 헤드라인 — 가운데 고딕, 가볍게 툭 */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "22px",
            background: "radial-gradient(ellipse 85% 55% at 50% 50%, rgba(18,13,9,0.55), rgba(18,13,9,0.14) 58%, transparent 78%)",
          }}>
            <h1 style={{ fontFamily: sans, fontSize: "40px", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.015em", color: "#fff", margin: 0, wordBreak: "keep-all", textShadow: "0 2px 22px rgba(0,0,0,0.5)" }}>
              오늘 뭐 입지?
            </h1>
            <p style={{ fontFamily: sans, fontSize: "23px", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.01em", color: "#fff", margin: "7px 0 0", wordBreak: "keep-all", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
              ‘그 고민은, <span style={{ borderBottom: `2.5px solid ${acc}`, paddingBottom: "2px" }}>결</span>에게’
            </p>
          </div>
        </div>

        {/* 서브카피 */}
        <p style={{ fontFamily: sans, fontSize: "14px", lineHeight: 1.75, color: "var(--t-txt)", opacity: 0.72, margin: "24px 2px 20px", wordBreak: "keep-all" }}>
          체형과 퍼스널컬러를 알면, 오늘 뭘 입을지 더는 헤매지 않아요. 딱 1분이면 돼요.
        </p>

        {/* CTA — 테라코타 포인트 */}
        <button
          onClick={onDiagnose}
          style={{
            width: "100%", height: "54px",
            fontFamily: sans, fontSize: "14px", fontWeight: 500, letterSpacing: "0.02em",
            color: "#fff", backgroundColor: acc, border: "none", borderRadius: "14px", cursor: "pointer",
          }}
        >
          무료로 내 결 찾기 →
        </button>

        {/* 모바일 전용 — 내 결(프로필) 칩: 진단 완료 시에만 표시 (CTA와 중복 방지) */}
        {hasProfile && (
          <button
            onClick={onDiagnose}
            className="lg:hidden"
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              marginTop: "12px", padding: "12px 15px",
              backgroundColor: "var(--t-card)",
              border: `1px solid ${acc}`,
              borderRadius: "14px", cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{ fontFamily: sans, fontSize: "12.5px", fontWeight: 500, color: "var(--t-txt)", wordBreak: "keep-all" }}>
              {profileLabel}
            </span>
            <span style={{ fontFamily: sans, fontSize: "11px", color: acc, flexShrink: 0 }}>
              다시 진단 ✎
            </span>
          </button>
        )}
      </div>

      {/* ── 상황별 코디 ── */}
      <div style={{ marginBottom: "14px" }}>
        <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: point, marginBottom: "6px" }}>
          BY SITUATION
        </p>
        <p style={{ fontFamily: sans, fontSize: "18px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--t-txt)", margin: 0, wordBreak: "keep-all" }}>
          오늘, 어떤 자리예요?
        </p>
      </div>
      <SituationSelector onSelect={onExample} isLoading={isLoading} vars={vars} />

      {/* 스타일 가이드 — 포인트 컬러 카드 (호버 시 반전) */}
      <GuideBanner vars={vars} />

      {/* 오늘 시리즈 크로스링크 */}
      <OnulSeries vars={vars} />
    </div>
  );
}

/* ── 스타일 가이드 배너 (포인트 컬러 + 호버 반전) ── */
function GuideBanner({ vars }: { vars: Record<string, string> }) {
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const point = vars["--t-point"] ?? vars["--t-acc"];

  return (
    <Link href="/guide" style={{ textDecoration: "none", display: "block" }}>
      <div
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => { setActive(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onTouchStart={() => { setActive(true); setPressed(true); }}
        onTouchEnd={() => { setActive(false); setPressed(false); }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginTop: "22px",
          padding: "16px 18px",
          border: `1px solid ${point}`,
          borderRadius: "14px",
          background: active ? point : `${point}1A`,
          transform: pressed ? "scale(0.985)" : active ? "translateY(-2px)" : "none",
          boxShadow: active && !pressed ? `0 8px 22px ${point}38` : "none",
          transition: "all 0.24s cubic-bezier(0.16,1,0.3,1)",
          cursor: "pointer",
        }}
      >
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            display: "block",
            fontFamily: "var(--font-jost), sans-serif",
            fontSize: "9.5px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: active ? "rgba(255,255,255,0.85)" : point,
            marginBottom: "4px",
            transition: "color 0.24s ease",
          }}>STYLE GUIDE</span>
          <span style={{
            display: "block",
            fontFamily: "var(--font-gowun), 'Batang', serif",
            fontSize: "16px",
            color: active ? "#fff" : "var(--t-txt)",
            lineHeight: 1.4,
            wordBreak: "keep-all",
            transition: "color 0.24s ease",
          }}>체형·퍼스널컬러 코디법 가이드</span>
        </span>
        <span style={{
          flexShrink: 0,
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: `1px solid ${active ? "rgba(255,255,255,0.7)" : point}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: "13px",
          color: active ? "#fff" : point,
          transform: active ? "translateX(3px)" : "none",
          transition: "all 0.24s ease",
        }}>→</span>
      </div>
    </Link>
  );
}

/* ── Empty State ── */
function EmptyState({
  onExample,
  vars,
}: {
  onExample: (s: string) => void;
  vars: Record<string, string>;
}) {
  return (
    <div className="flex flex-col">
      <div className="mb-12" style={{ animation: "cardEnter 500ms cubic-bezier(0.16,1,0.3,1) both" }}>
        <div style={{ height: "1px", backgroundColor: vars["--t-bdr"], marginBottom: "28px" }} />

        <p
          style={{
            fontFamily: "var(--font-gowun), 'Batang', serif",
            fontWeight: 400,
            fontSize: "clamp(26px, 5vw, 40px)",
            lineHeight: 1.45,
            letterSpacing: "0.01em",
            wordBreak: "keep-all",
            color: vars["--t-txt"],
            marginBottom: "20px",
          }}
        >
          오늘의 상황을<br />알려주세요
        </p>

        <p
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontWeight: 300,
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: vars["--t-sub"],
            opacity: 0.7,
            marginBottom: "28px",
          }}
        >
          Head-to-toe outfit · curated for you
        </p>

        <div style={{ height: "1px", backgroundColor: vars["--t-bdr"] }} />
      </div>

      <SituationSelector onSelect={onExample} isLoading={false} vars={vars} />
    </div>
  );
}
