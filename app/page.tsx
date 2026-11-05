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
import ApplyCTA from "@/components/ApplyCTA";
import SelfCheckGuide from "@/components/SelfCheckGuide";
import { Reveal, GyeolSymbol, SectionHead, Marquee } from "@/components/Editorial";
import CorridorHero from "@/components/CorridorHero";
import { getProfile, BODY_META, COLOR_META, type Profile } from "@/lib/profile";
import { track } from "@/lib/track";

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
        className="lg:hidden flex-shrink-0 flex flex-col gap-2 px-5 pt-3 pb-2"
        style={{
          backgroundColor: "var(--t-side)",
          borderBottom: "1px solid var(--t-txt)",
        }}
      >
        <div className="flex items-center justify-between">
          <Image
            key={getLogoSrc(mood)}
            src={getLogoSrc(mood)}
            alt="OnulFit"
            width={140}
            height={42}
            priority
            unoptimized
            style={{ width: "112px", height: "auto", display: "block" }}
          />
          <TopNav />
        </div>
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
          className="hidden lg:block flex-shrink-0 px-6 py-5"
          style={{ borderBottom: "1px solid var(--t-txt)" }}
        >
          <div className="mb-5 flex items-center justify-between">
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
            <TopNav />
          </div>
          <MoodSelector selected={mood} onChange={setMood} vars={vars} />
        </header>

        {/* 결 프로필 칩 — 진단 진입점 (데스크탑 전용 / 모바일은 히어로 아래로 이동) */}
        <div className="hidden lg:block">
          <ProfileChip profile={profile} vars={vars} onOpen={() => { track("diag_open", { where: "profile_chip" }); setShowDiag(true); }} />
        </div>

        {/* 채팅 히스토리 */}
        <div className="flex-1 overflow-y-auto px-5 lg:px-6 py-5 lg:py-6 space-y-4 min-h-0">
          {!hasMessages && (
            <WelcomeGuide onExample={handleSubmit} isLoading={isLoading} vars={vars} onDiagnose={() => { track("diag_open", { where: "home" }); setShowDiag(true); }} profile={profile} />
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
                  borderRadius: "2px",
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
          borderTop: "1px solid var(--t-txt)",
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
                opacity: isActive ? 1 : 0.55,
                transition: "all 0.2s ease",
              }}
            >
              {icon}
              <span style={{
                fontFamily: "var(--font-noto-sans), sans-serif",
                fontWeight: isActive ? 700 : 500,
                fontSize: "11.5px",
                letterSpacing: "-0.01em",
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

/* ── 상단 링크 — 가이드 · 1:1 진단 (어느 화면에서든 상담으로 한 번에) ── */
function TopNav() {
  return (
    <nav className="flex items-center gap-4">
      <Link href="/guide" className="ed-label ed-link" style={{ color: "var(--t-txt)" }}>
        Guide
      </Link>
      <Link
        href="/apply"
        onClick={() => track("consult_click", { where: "header", method: "apply" })}
        className="ed-label ed-link"
        style={{ color: "var(--t-acc)" }}
      >
        1:1 진단
      </Link>
    </nav>
  );
}

/* ── 결 프로필 칩 (진단 진입점, 데스크탑) ── */
function ProfileChip({
  profile,
  onOpen,
}: {
  profile: Profile | null;
  vars: Record<string, string>;
  onOpen: () => void;
}) {
  const hasProfile = !!profile;
  return (
    <div className="flex-shrink-0 px-5 lg:px-6 pt-4">
      <button
        onClick={onOpen}
        className="w-full flex items-center justify-between gap-2"
        style={{
          padding: "12px 0",
          background: "transparent",
          border: "none",
          borderTop: "1px solid var(--t-txt)",
          borderBottom: "1px solid var(--t-txt)",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span className="ed-label" style={{ color: "var(--t-txt)" }}>
          {hasProfile ? (
            <>내 결 · {BODY_META[profile!.body].label} × {COLOR_META[profile!.color].label}</>
          ) : (
            "골격·퍼스널컬러 진단받기"
          )}
        </span>
        <span className="ed-label" style={{ color: "var(--t-acc)", flexShrink: 0 }}>
          {hasProfile ? "다시 진단 ↺" : "시작 →"}
        </span>
      </button>
    </div>
  );
}

/* ── Welcome — 에디토리얼 홈 (오늘핏 로고 + 다홍 포인트 + 반듯한 블록) ── */
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
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const hasProfile = !!profile;

  return (
    <div className="pt-1 pb-4">

      {/* ── 01 첫 화면: 올리브 문 복도 (채팅 열의 여백을 넘어 가장자리까지) ── */}
      <div className="-mx-5 lg:-mx-6 -mt-6 lg:-mt-7">
        <CorridorHero onStart={onDiagnose} videoSrc="/hero/corridor.mp4" posterSrc="/hero/corridor-poster.jpg" endSrc="/hero/corridor-end.jpg" />
      </div>

      <div>
        {hasProfile && (
          <button
            onClick={onDiagnose}
            className="lg:hidden w-full flex items-center justify-between"
            style={{ marginTop: "8px", padding: "12px 0", background: "transparent", border: "none", borderBottom: "1px solid var(--t-txt)", cursor: "pointer" }}
          >
            <span className="ed-label" style={{ color: "var(--t-txt)" }}>
              내 결 · {BODY_META[profile!.body].label} × {COLOR_META[profile!.color].label}
            </span>
            <span className="ed-label" style={{ color: "var(--t-acc)" }}>다시 진단 ↺</span>
          </button>
        )}
      </div>

      {/* ── 결의 한마디 (결 심볼 + 인용) ── */}
      <Reveal style={{ marginTop: "30px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <span style={{ paddingTop: "4px" }}><GyeolSymbol size={34} color="var(--t-acc)" /></span>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "19px", letterSpacing: "-0.04em", lineHeight: 1.55, color: "var(--t-txt)", margin: 0, wordBreak: "keep-all" }}>
            체형과 퍼스널컬러를 알면, 오늘 뭘 입을지 더는 헤매지 않아요. <span style={{ color: "var(--t-acc)" }}>결과에 맞는 코디까지 바로 알려드려요.</span>
          </p>
        </div>
      </Reveal>

      {/* ── 흐르는 띠 ── */}
      <div className="-mx-5 lg:-mx-6" style={{ marginTop: "34px", marginBottom: "34px" }}>
        <Marquee items={["Free self-check", "골격 진단", "Personal color", "퍼스널컬러", "1:1 Styling", "오늘의 코디"]} />
      </div>

      {/* ── 02 자가진단에서 살펴보는 10가지 ── */}
      <Reveal>
        <SectionHead
          no="02"
          en="Self-check"
          title={<>자가진단에서<br />살펴보는 10가지</>}
          right={
            <Link href="/self-check" className="ed-label ed-link" style={{ color: "var(--t-acc)" }}>
              자세히 →
            </Link>
          }
        />
        <SelfCheckGuide variant="compact" />
      </Reveal>

      {/* ── 03 상황별 코디 ── */}
      <Reveal style={{ marginTop: "44px" }}>
        <SectionHead no="03" en="By situation" title="오늘, 어떤 자리예요?" />
        <SituationSelector onSelect={onExample} isLoading={isLoading} vars={vars} />
      </Reveal>

      {/* ── 04 스타일 가이드 ── */}
      <Reveal style={{ marginTop: "44px" }}>
        <GuideBanner />
      </Reveal>

      {/* ── 05 1:1 진단 ── */}
      <Reveal>
        <ApplyCTA vars={vars} />
      </Reveal>
    </div>
  );
}

/* ── 스타일 가이드 배너 — 굵은 줄 사이 큰 링크, 호버 시 잉크로 반전 ── */
function GuideBanner() {
  const [active, setActive] = useState(false);
  return (
    <Link
      href="/guide"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      style={{
        display: "block",
        textDecoration: "none",
        padding: "18px 16px 20px",
        borderTop: "1px solid var(--t-txt)",
        borderBottom: "1px solid var(--t-txt)",
        background: active ? "var(--t-txt)" : "transparent",
        color: active ? "var(--t-bg)" : "var(--t-txt)",
        transition: "background-color 0.4s var(--ease-out), color 0.4s var(--ease-out)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "baseline", gap: "10px" }}>
          <span className="ed-accent" style={{ fontSize: "26px", lineHeight: 1, color: active ? "var(--t-bg)" : "var(--t-acc)" }}>No.04</span>
          <span className="ed-label">Style guide</span>
        </span>
        <span className="ed-label">5 articles</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px", marginTop: "14px" }}>
        <span style={{ fontFamily: "var(--font-noto-sans), sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.045em", lineHeight: 1.2, wordBreak: "keep-all" }}>
          체형·퍼스널컬러<br />코디법 가이드
        </span>
        <span aria-hidden style={{ fontFamily: "var(--font-grotesk), sans-serif", fontSize: "30px", lineHeight: 1, transform: active ? "translateX(6px)" : "none", transition: "transform 0.45s var(--ease-out)" }}>→</span>
      </div>
    </Link>
  );
}

/* ── Empty State (오른쪽 패널 / 모바일 코디 탭) ── */
function EmptyState({
  onExample,
  vars,
}: {
  onExample: (s: string) => void;
  vars: Record<string, string>;
}) {
  return (
    <div className="flex flex-col">
      <div className="mb-10" style={{ animation: "cardEnter 700ms var(--ease-out) both" }}>
        <div style={{ height: "1px", backgroundColor: "var(--t-txt)", marginBottom: "10px" }} />
        <span className="ed-label" style={{ color: "var(--t-acc)" }}>Head-to-toe · curated for you</span>
        <p
          style={{
            fontFamily: "var(--font-noto-sans), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(34px, 6vw, 56px)",
            lineHeight: 1.08,
            letterSpacing: "-0.055em",
            wordBreak: "keep-all",
            color: vars["--t-txt"],
            margin: "18px 0 0",
          }}
        >
          오늘의 상황을<br />알려주세요
        </p>
      </div>

      <SituationSelector onSelect={onExample} isLoading={false} vars={vars} />
    </div>
  );
}
