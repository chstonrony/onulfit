import Link from "next/link";

/* ══════════════════════════════════════════════════════════
   OnulSeries — '오늘' 시리즈 크로스링크 (오늘무드·오늘눈치·오늘핏)
   - 오늘핏(현재 사이트)을 current로 표시
   - 다른 두 서비스는 새 탭으로 연결
   - onulfit 테마 vars 사용 (베이지 미니멀 톤 유지)
══════════════════════════════════════════════════════════ */

const SERIES = [
  {
    name: "오늘핏",
    domain: "onulfit.com",
    href: "/",
    tag: "스타일",
    desc: "오늘 뭐 입지? 기분으로 정하는 오늘의 핏",
    current: true,
  },
  {
    name: "오늘무드",
    domain: "onulmood.com",
    href: "https://onulmood.com",
    tag: "감정",
    desc: "오늘 감정, 우걱이한테 던져버리기",
    current: false,
  },
  {
    name: "오늘눈치",
    domain: "onulnunchi.com",
    href: "https://onulnunchi.com",
    tag: "분위기",
    desc: "오늘 분위기, 진짜 괜찮은 거 맞아?",
    current: false,
  },
];

interface Props {
  vars: Record<string, string>;
}

export default function OnulSeries({ vars }: Props) {
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

  return (
    <div style={{ marginTop: "40px", paddingTop: "18px", borderTop: "1px solid var(--t-bdr)" }}>
      {/* 헤더 */}
      <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "8.5px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--t-sub)", margin: "0 0 8px", opacity: 0.85 }}>
        ONEUL SERIES · 함께 보면 좋은
      </p>

      {/* 서비스 링크 (현재 사이트 제외) — 보조, 작게 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {SERIES.filter((s) => !s.current).map((s) => (
          <Link
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: "9px",
              padding: "9px 12px",
              background: "var(--t-card)",
              border: "1px solid var(--t-bdr)",
              borderRadius: "11px",
            }}>
              <span style={{
                fontFamily: "var(--font-jost), sans-serif", fontSize: "8px",
                letterSpacing: "0.06em", padding: "2px 6px",
                color: vars["--t-sub"], border: `1px solid var(--t-bdr)`, borderRadius: "8px",
                flexShrink: 0,
              }}>
                {s.tag}
              </span>
              <span style={{ fontFamily: sans, fontSize: "12px", fontWeight: 600, color: "var(--t-txt)", flexShrink: 0 }}>
                {s.name}
              </span>
              <span style={{ fontFamily: sans, fontSize: "10.5px", color: "var(--t-sub)", flex: 1, minWidth: 0, lineHeight: 1.4, wordBreak: "keep-all", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.desc}
              </span>
              <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "11px", color: "var(--t-sub)", flexShrink: 0 }}>↗</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
