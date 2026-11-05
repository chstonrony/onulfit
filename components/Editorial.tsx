"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

/* ── 에디토리얼 공용 조각 (2026-11 리뉴얼) ──
   레퍼런스: 큰 그로테스크 워드마크 + 굵은 가로줄 + 대문자 라벨 그리드.
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

/** 화면 폭을 꽉 채우는 대형 워드마크 (컨테이너 폭 기준으로 글자 크기 자동) */
export function Wordmark({ text = "ONULFIT", color = "var(--t-acc)", size = 25.4, mark = true }: { text?: string; color?: string; size?: number; mark?: boolean }) {
  return (
    <div style={{ containerType: "inline-size", width: "100%" }}>
      <p className="ed-wordmark" style={{ fontSize: `${size}cqw`, color, margin: 0, display: "flex", alignItems: "flex-end" }}>
        {text}
        {mark && (
          <span style={{ fontSize: "0.12em", fontWeight: 700, letterSpacing: 0, marginLeft: "0.25em", marginBottom: "0.1em" }}>®</span>
        )}
      </p>
    </div>
  );
}

/** 섹션 머리 — 굵은 줄 + (번호) 영문 라벨 + 한글 제목 */
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
      <div style={{ height: "2px", background: "var(--t-txt)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0 0" }}>
        <span className="ed-label" style={{ color: "var(--t-txt)" }}>
          <span style={{ color: "var(--t-acc)" }}>({no})</span>&nbsp;&nbsp;{en}
        </span>
        {right}
      </div>
      <h2
        style={{
          fontFamily: "var(--font-noto-sans), sans-serif",
          fontWeight: 800,
          fontSize: "clamp(25px, 7vw, 30px)",
          letterSpacing: "-0.045em",
          lineHeight: 1.18,
          color: "var(--t-txt)",
          margin: "14px 0 0",
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
export function Marquee({ items, bg = "var(--t-acc)", color = "var(--t-bg)" }: { items: string[]; bg?: string; color?: string }) {
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
                  fontFamily: "var(--font-grotesk), var(--font-noto-sans), sans-serif",
                  fontWeight: 800,
                  fontSize: "15px",
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  padding: "0 14px",
                }}
              >
                {t}
                <span style={{ marginLeft: "28px", opacity: 0.7 }}>✦</span>
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
  const bg = tone === "acc" ? "var(--t-acc)" : tone === "ink" ? "var(--t-txt)" : "var(--t-bg)";
  const fg = tone === "paper" ? "var(--t-acc)" : "var(--t-bg)";
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
