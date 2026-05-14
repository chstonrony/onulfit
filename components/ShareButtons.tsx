"use client";

import { useState } from "react";

interface ShareButtonsProps {
  situation: string;   // 공유할 상황 텍스트
  outfit?: string;     // 추천된 코디 이름 (옵션)
}

export default function ShareButtons({ situation, outfit }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = "https://onulfit.com";
  const shareText = outfit
    ? `OnulFit이 추천한 오늘의 코디: "${outfit}"\n상황: ${situation}\n\n나도 오늘의 코디 추천 받기 →`
    : `OnulFit — 오늘의 코디를 찾아보세요\n30~50대 여성을 위한 AI 패션 코디 서비스`;

  /* ── 링크 복사 ── */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ── 카카오톡 공유 ── */
  const handleKakao = () => {
    type KakaoWindow = Window & { Kakao?: { isInitialized: () => boolean; Share: { sendDefault: (opts: unknown) => void } } };
    const kakaoWindow = window as KakaoWindow;
    // 카카오 SDK가 로드된 경우
    if (typeof window !== "undefined" && kakaoWindow.Kakao?.isInitialized()) {
      const Kakao = kakaoWindow.Kakao!;
      Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "OnulFit — 오늘, 어떤 나를 찾으세요",
          description: outfit
            ? `"${situation}" → ${outfit}`
            : "상황을 알려주시면 딱 맞는 코디를 찾아드려요",
          imageUrl: `${shareUrl}/og-image.png`,
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [
          { title: "코디 추천 받기", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } },
        ],
      });
    } else {
      // SDK 없으면 카카오톡 공유 URL scheme 사용
      const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_key=&url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(kakaoUrl, "_blank", "width=500,height=600");
    }
  };

  /* ── 네이티브 공유 (모바일) ── */
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "OnulFit — 오늘의 코디",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // 사용자가 공유 취소 시 무시
      }
    } else {
      handleCopy();
    }
  };

  const btnStyle = (accent = false): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    flex: 1,
    height: "44px",
    borderRadius: "10px",
    border: `1px solid ${accent ? "transparent" : "var(--t-bdr)"}`,
    backgroundColor: accent ? "var(--t-acc)" : "transparent",
    color: accent ? "var(--t-bg)" : "var(--t-txt)",
    fontFamily: "var(--font-noto-sans), sans-serif",
    fontWeight: 400,
    fontSize: "13px",
    letterSpacing: "0.02em",
    cursor: "pointer",
    transition: "opacity 0.18s ease",
  });

  return (
    <div
      className="mt-8 pt-6"
      style={{ borderTop: "1px solid var(--t-bdr)" }}
    >
      <p style={{
        fontFamily: "var(--font-jost), sans-serif",
        fontWeight: 300,
        fontSize: "11px",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--t-sub)",
        marginBottom: "14px",
      }}>
        Share
      </p>

      <div className="flex gap-2">

        {/* 카카오톡 공유 */}
        <button onClick={handleKakao} style={btnStyle(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.52 1.38 4.75 3.5 6.14L4.5 21l4.38-2.39A11.56 11.56 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
          </svg>
          카카오톡 공유
        </button>

        {/* 링크 복사 / 모바일 네이티브 공유 */}
        <button
          onClick={handleCopy}
          style={btnStyle(false)}
        >
          {copied ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              복사됨
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              링크 복사
            </>
          )}
        </button>

      </div>
    </div>
  );
}
