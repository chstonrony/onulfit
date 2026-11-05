"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

/* ── 에디토리얼 공용 조각 (2026-11 리뉴얼) ──
   오늘핏 원래 로고(결 심볼·이탤릭 세리프) 톤 + 다홍 포인트 + 반듯한 블록.
   색은 테마 변수(--t-*)를 따르므로 무드를 바꿔도 함께 바뀐다. */

/** 스크롤로 화면에 들어올 때 아래에서 떠오르며 나타남 */
export function Reveal({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`ed-reveal${inView ? " is-in" : ""}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/** 오늘핏 원래 로고(결 심볼 + 이탤릭 OnulFit + AI STYLIST)를 색만 바꿀 수 있게 인라인 SVG로.
    public/onulfit_logo_light.svg와 같은 도형·서체, 오른쪽 빈 여백만 잘라냄. */
export function BrandLogo({ color = "var(--t-txt)", sub = "AI STYLIST", style }: { color?: string; sub?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="8 8 206 58" role="img" aria-label="OnulFit" style={{ display: "block", width: "100%", height: "auto", color, ...style }}>
      <circle cx="36" cy="36" r="26" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M36 14 C36 14 36 12 36 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M36 11 C36 11 31 11 29.5 13.5 C28 16 30.5 18.5 36 18.5 C41.5 18.5 44.5 21 43.5 24.5 C42.5 28 36 30 29 34.5 C25.5 37 24 39.5 25 42 C26 44.5 30 46 36 46 C42 46 46 44.5 47 42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="36" cy="11" r="1.8" fill="currentColor" />
      <line x1="78" y1="22" x2="78" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <text x="92" y="46" fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fontSize="32" fill="currentColor" letterSpacing="1.5">
        OnulFit
      </text>
      <text x="93" y="60" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="300" fontSize="9" fill="currentColor" opacity="0.6" letterSpacing="5">
        {sub}
      </text>
    </svg>
  );
}

/** 결 심볼만 (작은 장식용) */
export function GyeolSymbol({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="8 8 56 56" aria-hidden style={{ display: "inline-block", flexShrink: 0, color }}>
      <circle cx="36" cy="36" r="26" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M36 11 C36 11 31 11 29.5 13.5 C28 16 30.5 18.5 36 18.5 C41.5 18.5 44.5 21 43.5 24.5 C42.5 28 36 30 29 34.5 C25.5 37 24 39.5 25 42 C26 44.5 30 46 36 46 C42 46 46 44.5 47 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="36" cy="11" r="2.4" fill="currentColor" />
    </svg>
  );
}

/** 페이지 제목용 큰 이탤릭 세리프 (로고 서체 톤과 맞춤, 컨테이너 폭 기준 크기) */
export function Wordmark({ text, color = "var(--t-txt)", size = 24 }: { text: string; color?: string; size?: number }) {
  return (
    <div style={{ containerType: "inline-size", width: "100%" }}>
      <p className="ed-wordmark" style={{ fontSize: `${size}cqw`, color, margin: 0 }}>
        {text}
      </p>
    </div>
  );
}

/** 섹션 머리 — No.번호(이탤릭) + 영문 라벨 + 굵은 한글 제목 */
export function SectionHead({
  no,
  en,
  title,
  right,
  sub,
}: {
  no: string;
  en: string;
  title: ReactNode;
  right?: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}>
        <span style={{ display: "inline-flex", alignItems: "baseline", gap: "10px" }}>
          <span className="ed-accent" style={{ fontSize: "26px", lineHeight: 1, color: "var(--t-acc)" }}>No.{no}</span>
          <span className="ed-label" style={{ color: "var(--t-sub)" }}>{en}</span>
        </span>
        {right}
      </div>
      <h2
        style={{
          fontFamily: "var(--font-noto-sans), sans-serif",
          fontWeight: 800,
          fontSize: "clamp(25px, 7vw, 30px)",
          letterSpacing: "-0.045em",
          lineHeight: 1.22,
          color: "var(--t-txt)",
          margin: "10px 0 0",
          wordBreak: "keep-all",
        }}
      >
        {title}
      </h2>
      {sub && (
        <p style={{ fontFamily: "var(--font-noto-sans), sans-serif", fontSize: "14px", lineHeight: 1.7, color: "var(--t-sub)", margin: "8px 0 0", wordBreak: "keep-all" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/** 흐르는 띠 문구 */
export function Marquee({ items, bg = "var(--t-fill, #BFC266)", color = "var(--t-txt)" }: { items: string[]; bg?: string; color?: string }) {
  const row = [...items, ...items, ...items];
  return (
    <div style={{ overflow: "hidden", background: bg, color, padding: "11px 0" }} aria-hidden>
      <div className="ed-marquee">
        {[0, 1].map((k) => (
          <div key={k} style={{ display: "flex", flexShrink: 0 }}>
            {row.map((t, i) => (
              <span
                key={`${k}-${i}`}
                style={{
                  fontFamily: "var(--font-cormorant), var(--font-noto-sans), serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "21px",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  padding: "0 14px",
                }}
              >
                {t}
                <span style={{ marginLeft: "28px", fontStyle: "normal", fontSize: "13px", opacity: 0.8 }}>●</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** 주 버튼 — 각진 블록, 호버 시 화살표가 밀려남 */
export function BlockButton({
  children,
  onClick,
  href,
  tone = "acc",
  sub,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  tone?: "acc" | "ink" | "paper";
  sub?: ReactNode;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const bg = tone === "acc" ? "var(--t-fill, #BFC266)" : tone === "ink" ? "var(--t-txt)" : "var(--t-bg)";
  const fg = tone === "acc" ? "var(--t-txt)" : tone === "ink" ? "var(--t-bg)" : "var(--t-txt)";
  const inner = (
    <>
      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", textAlign: "left" }}>
        <span style={{ fontFamily: "var(--font-noto-sans), sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "-0.025em", lineHeight: 1.3 }}>
          {children}
        </span>
        {sub && (
          <span style={{ fontFamily: "var(--font-noto-sans), sans-serif", fontWeight: 500, fontSize: "12px", opacity: 0.82, letterSpacing: "-0.01em" }}>
            {sub}
          </span>
        )}
      </span>
      <span
        aria-hidden
        style={{
          fontFamily: "var(--font-grotesk), sans-serif",
          fontWeight: 500,
          fontSize: "22px",
          transform: hover ? "translateX(5px)" : "none",
          transition: "transform 0.45s var(--ease-out)",
        }}
      >
        →
      </span>
    </>
  );
  const s: CSSProperties = {
    width: "100%",
    minHeight: sub ? "68px" : "58px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px 18px",
    background: bg,
    color: fg,
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    textDecoration: "none",
    ...style,
  };
  const h = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };
  return href ? (
    <a href={href} onClick={onClick} style={s} {...h}>{inner}</a>
  ) : (
    <button type="button" onClick={onClick} style={s} {...h}>{inner}</button>
  );
}
