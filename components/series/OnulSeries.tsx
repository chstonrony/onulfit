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
  const point = vars["--t-point"] ?? vars["--t-acc"];
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const serif = "var(--font-gowun), 'Batang', serif";

  return (
    <div style={{ marginTop: "30px" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: "12px" }}>
        <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: point, margin: 0 }}>
          ONEUL SERIES
        </p>
        <p style={{ fontFamily: serif, fontSize: "14px", color: "var(--t-sub)", margin: "4px 0 0", lineHeight: 1.6 }}>
          하루를 처음부터 끝까지, 같이.
        </p>
      </div>

      {/* 서비스 카드 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {SERIES.map((s) => (
          <Link
            key={s.name}
            href={s.href}
            target={s.current ? "_self" : "_blank"}
            rel={s.current ? undefined : "noopener noreferrer"}
            style={{ textDecoration: "none" }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: "13px",
              padding: "13px 15px",
              background: s.current ? "var(--t-bai)" : "var(--t-side)",
              border: `1px solid ${s.current ? point : "var(--t-bdr)"}`,
              borderLeft: `3px solid ${point}`,
              borderRadius: "0 12px 12px 0",
            }}>
              <span style={{
                fontFamily: "var(--font-jost), sans-serif", fontSize: "9px",
                letterSpacing: "0.08em", padding: "3px 8px",
                color: point, border: `1px solid ${point}`, borderRadius: "10px",
                flexShrink: 0,
              }}>
                {s.tag}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: serif, fontSize: "14.5px", fontWeight: 600, color: "var(--t-txt)" }}>
                    {s.name}
                  </span>
                  {s.current && (
                    <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "9px", letterSpacing: "0.06em", color: point }}>
                      ← 지금 여기
                    </span>
                  )}
                </div>
                <p style={{ fontFamily: sans, fontSize: "11.5px", color: "var(--t-sub)", margin: "2px 0 0", lineHeight: 1.5, wordBreak: "keep-all" }}>
                  {s.desc}
                </p>
              </div>
              {!s.current && (
                <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "12px", color: point, flexShrink: 0 }}>↗</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
