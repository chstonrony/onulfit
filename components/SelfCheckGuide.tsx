import { BODY_QUESTIONS, COLOR_QUESTIONS } from "@/lib/profile";

/* ── 자가진단 "이렇게 살펴봐요" 한눈에 보기 ──
   골격 5가지 + 퍼스널컬러 5가지를 시작 전에 한 화면에 보여준다.
   테마 CSS 변수(--t-*) 안에서 렌더된다(홈, 진단 인트로, /self-check).
   variant="full"   : 항목 + 확인 방법 한 줄
   variant="compact": 항목 이름만 칩으로 */

/* 컬러 항목 옆에 보여줄 비교 스와치 (웜 쪽 / 쿨 쪽) */
const COLOR_PAIR: Record<string, [string, string]> = {
  vein: ["#6F8F5A", "#6C7FB8"],
  metal: ["#D4AF37", "#C0C4C8"],
  white: ["#F1E8D6", "#FFFFFF"],
  face: ["#F08A6E", "#E7A2BE"],
  depth: ["#F4D6C4", "#5A2E3A"],
};

const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
const serif = "var(--font-gowun), 'Batang', serif";

export default function SelfCheckGuide({ variant = "full" }: { variant?: "full" | "compact" }) {
  const compact = variant === "compact";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: compact ? "1fr 1fr" : "1fr",
        gap: compact ? "10px" : "14px",
      }}
    >
      <Group
        title="골격"
        caption="몸의 뼈대와 살집"
        items={BODY_QUESTIONS.map((q) => ({ id: q.id, short: q.short, hint: q.hint }))}
        compact={compact}
      />
      <Group
        title="퍼스널컬러"
        caption="얼굴이 맑아 보이는 색"
        items={COLOR_QUESTIONS.map((q) => ({ id: q.id, short: q.short, hint: q.hint, pair: COLOR_PAIR[q.id] }))}
        compact={compact}
      />
    </div>
  );
}

function Group({
  title,
  caption,
  items,
  compact,
}: {
  title: string;
  caption: string;
  items: { id: string; short: string; hint: string; pair?: [string, string] }[];
  compact: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--t-card)",
        border: "1px solid var(--t-bdr)",
        borderRadius: "14px",
        padding: compact ? "14px 12px" : "16px 16px 10px",
      }}
    >
      <p style={{ display: "flex", alignItems: "baseline", gap: "6px", margin: "0 0 10px", flexWrap: "wrap" }}>
        <span style={{ fontFamily: serif, fontSize: compact ? "15px" : "17px", color: "var(--t-txt)" }}>{title}</span>
        <span style={{ fontFamily: sans, fontSize: "11.5px", color: "var(--t-sub)" }}>
          {items.length}가지{compact ? "" : ` · ${caption}`}
        </span>
      </p>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: compact ? "6px" : "0" }}>
        {items.map((it, i) => (
          <li
            key={it.id}
            style={{
              display: "flex",
              alignItems: compact ? "center" : "flex-start",
              gap: "10px",
              padding: compact ? 0 : "9px 0",
              borderTop: compact || i === 0 ? "none" : "1px dashed var(--t-bdr)",
            }}
          >
            {it.pair ? (
              <span aria-hidden style={{ display: "inline-flex", flexShrink: 0, marginTop: compact ? 0 : "2px" }}>
                <span style={dot(it.pair[0])} />
                <span style={{ ...dot(it.pair[1]), marginLeft: "-5px" }} />
              </span>
            ) : (
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: "19px",
                  height: "19px",
                  borderRadius: "50%",
                  border: "1px solid var(--t-acc)",
                  color: "var(--t-acc)",
                  fontFamily: sans,
                  fontSize: "10.5px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: compact ? 0 : "1px",
                }}
              >
                {i + 1}
              </span>
            )}
            <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span style={{ fontFamily: sans, fontSize: compact ? "12.5px" : "14px", fontWeight: 600, color: "var(--t-txt)", wordBreak: "keep-all" }}>
                {it.short}
              </span>
              {!compact && (
                <span style={{ fontFamily: sans, fontSize: "12.5px", color: "var(--t-sub)", lineHeight: 1.55, wordBreak: "keep-all" }}>
                  {it.hint}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function dot(c: string): React.CSSProperties {
  return {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    backgroundColor: c,
    border: "1px solid rgba(0,0,0,0.12)",
    display: "inline-block",
  };
}
