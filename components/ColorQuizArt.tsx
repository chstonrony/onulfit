/* ── 퍼스널컬러 자가진단 문항 그림 (2026-11-09) ──
   예전엔 모든 컬러 문항에 웜/쿨 색동그라미 3개만 붙어 있어서
   "무엇을 대보라는 건지"가 그림으로 보이지 않았다.
   문항마다 실제로 대보는 물건(금·은 귀걸이, 흰 천, 립스틱, 검정 옷, 눈동자)을 그린다. */

type Props = { qid: string; value: string; ink: string };

const SKIN = "#EBC6A8";

export default function ColorQuizArt({ qid, value, ink }: Props) {
  const id = `cq-${qid}-${value}`;
  let body: React.ReactNode = null;

  if (qid === "metal") {
    const [a, b, c] = value === "warm" ? ["#F6DE95", "#D4A93E", "#9C7420"] : ["#FBFBFC", "#C5CAD0", "#868C94"];
    body = (
      <>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="0.5" stopColor={b} />
            <stop offset="1" stopColor={c} />
          </linearGradient>
        </defs>
        {/* 링 귀걸이 한 쌍 */}
        {[26, 54].map((cx, i) => (
          <g key={cx}>
            <path d={`M${cx},12 L${cx},20`} stroke={b} strokeWidth="2" strokeLinecap="round" />
            <circle cx={cx} cy={i ? 42 : 40} r={i ? 14 : 15} fill="none" stroke={`url(#${id})`} strokeWidth="5" />
            <path d={`M${cx - 10},${i ? 34 : 32} Q${cx - 7},${i ? 29 : 27} ${cx - 2},${i ? 28 : 26}`} fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
          </g>
        ))}
      </>
    );
  } else if (qid === "white") {
    const cloth = value === "warm" ? "#F1E4C8" : "#FFFFFF";
    body = (
      <>
        <ellipse cx="40" cy="27" rx="14" ry="17" fill={SKIN} />
        <path d="M33,42 L33,48 L47,48 L47,42" fill={SKIN} />
        <path d="M10,76 Q12,52 30,47 Q40,55 50,47 Q68,52 70,76 Z" fill={cloth} stroke={ink} strokeWidth="1.2" strokeLinejoin="round" opacity="0.95" />
        <path d="M30,47 Q40,55 50,47" fill="none" stroke={ink} strokeWidth="1.2" opacity="0.5" />
      </>
    );
  } else if (qid === "lip") {
    const cols = value === "warm" ? ["#E8735A", "#E08A3E", "#A44A33"] : ["#C85A7C", "#E583A6", "#7C3452"];
    body = (
      <>
        {cols.map((c, i) => {
          const x = 14 + i * 20;
          return (
            <g key={c}>
              <path d={`M${x},40 L${x},28 Q${x + 6},18 ${x + 12},22 L${x + 12},40 Z`} fill={c} />
              <rect x={x - 1.5} y="40" width="15" height="9" fill="#D8D2C8" stroke={ink} strokeWidth="0.8" />
              <rect x={x - 2.5} y="49" width="17" height="22" rx="1.5" fill="#2A2724" />
            </g>
          );
        })}
      </>
    );
  } else if (qid === "black") {
    const dull = value === "light";
    body = (
      <>
        <ellipse cx="40" cy="27" rx="14" ry="17" fill={dull ? "#D7BDA8" : "#F0CDB0"} />
        {dull ? (
          <>
            <path d="M31,30 Q34,33 37,30 M43,30 Q46,33 49,30" fill="none" stroke="#8C7564" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
            <ellipse cx="40" cy="27" rx="14" ry="17" fill="#6E6A66" opacity="0.18" />
          </>
        ) : (
          <>
            <path d="M62,12 L63.5,16.5 L68,18 L63.5,19.5 L62,24 L60.5,19.5 L56,18 L60.5,16.5 Z" fill="#C9A646" />
            <path d="M18,20 L19,23 L22,24 L19,25 L18,28 L17,25 L14,24 L17,23 Z" fill="#C9A646" opacity="0.8" />
          </>
        )}
        <path d="M33,42 L33,48 L47,48 L47,42" fill={dull ? "#D7BDA8" : "#F0CDB0"} />
        <path d="M10,76 Q12,52 30,47 Q40,55 50,47 Q68,52 70,76 Z" fill="#1E1D1C" />
      </>
    );
  } else if (qid === "eye") {
    const light = value === "light";
    body = (
      <>
        <defs>
          <radialGradient id={id} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.35" stopColor={light ? "#B98556" : "#2C1F19"} />
            <stop offset="0.85" stopColor={light ? "#8A5B37" : "#1A1210"} />
            <stop offset="1" stopColor={light ? "#A57A55" : "#0D0908"} />
          </radialGradient>
        </defs>
        <path d="M6,40 Q40,10 74,40 Q40,70 6,40 Z" fill="#FBF8F3" stroke={ink} strokeWidth="1.4" strokeLinejoin="round" />
        <circle cx="40" cy="40" r="15" fill={`url(#${id})`} stroke={light ? "none" : "#0D0908"} strokeWidth={light ? 0 : 1.6} />
        <circle cx="40" cy="40" r="6" fill="#120C0A" />
        <circle cx="45" cy="35" r="2.6" fill="#fff" opacity="0.9" />
      </>
    );
  }

  return (
    <svg width="88" height="88" viewBox="0 0 80 80" aria-hidden="true">
      {body}
    </svg>
  );
}

/** 그림 아래 작게 붙는 "이 그림은 무엇인지" 설명 */
export const COLOR_ART_NOTE: Record<string, string> = {
  metal: "자연광 아래 맨얼굴일수록 정확해요",
  white: "흰 종이나 수건으로 해봐도 돼요",
  lip: "가장 자주 칭찬받은 립 색을 골라주세요",
  black: "검정 옷이 없다면 짙은 남색으로 떠올려도 돼요",
  eye: "컬러렌즈는 빼고 봐주세요",
};
