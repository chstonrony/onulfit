"use client";

import { usePathname } from "next/navigation";
import { KAKAO_CHANNEL_URL, IS_CHANNEL_READY } from "@/lib/consult";
import { track } from "@/lib/track";

/* ── 카톡 상담 버튼 — 모든 화면 오른쪽 아래에 늘 떠 있음 ──
   누르면 오늘핏 카카오톡 채널의 1:1 채팅이 바로 열린다.
   홈(휴대폰)에서는 아래 입력창·탭바를 가리지 않게 그 위로 올려 둔다.
   휴대폰은 동그란 카톡 아이콘만, PC는 "카톡 상담" 글자까지. */

const chatUrl = KAKAO_CHANNEL_URL.replace(/\/+$/, "").replace(/\/chat$/, "") + "/chat";

export default function KakaoFloat() {
  const pathname = usePathname() || "/";
  if (!IS_CHANNEL_READY) return null;
  const isHome = pathname === "/";

  return (
    <a
      href={chatUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("consult_click", { where: "float", method: "kakao" })}
      aria-label="카카오톡으로 상담하기"
      className={`fixed right-4 lg:right-6 inline-flex w-[52px] h-[52px] lg:w-auto lg:h-[44px] lg:pl-[13px] lg:pr-4 ${
        isHome ? "bottom-[calc(150px+env(safe-area-inset-bottom))] lg:bottom-6" : "bottom-[calc(20px+env(safe-area-inset-bottom))] lg:bottom-6"
      }`}
      style={{
        zIndex: 45,
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        borderRadius: "999px",
        background: "#FEE500",
        color: "#191600",
        fontFamily: "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif",
        fontWeight: 700,
        fontSize: "14px",
        letterSpacing: "-0.02em",
        textDecoration: "none",
        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#191600"
          d="M12 3.5c-5.25 0-9.5 3.3-9.5 7.38 0 2.64 1.78 4.95 4.46 6.26l-.9 3.33a.35.35 0 0 0 .53.38l3.95-2.62c.48.06.97.1 1.46.1 5.25 0 9.5-3.3 9.5-7.45S17.25 3.5 12 3.5z"
        />
      </svg>
      {/* 휴대폰: 동그란 아이콘만(글을 덜 가리게) · PC: 글자까지 */}
      <span className="hidden lg:inline">카톡 상담</span>
    </a>
  );
}
