/* ── 골격 자가진단 문항 그림 (2026-11-07) ──
   예전엔 모든 문항에 같은 몸 실루엣 아이콘만 붙어 있어서, 무엇을 보라는 건지 알기 어려웠다.
   문항마다 "그 부위를 이렇게 보면 된다"는 그림을 따로 그린다.
   선은 글자색(ink), 눈여겨볼 곳은 포인트색(acc)으로 칠한다. */

type Props = { qid: string; value: string; ink: string; acc: string };

/** 그림 아래 작게 붙는 "이 그림은 무엇인지" 설명 */
export const BODY_ART_NOTE: Record<string, string> = {
  wrist: "손등 쪽에서 본 오른손이에요 · 화살표가 손목 바깥쪽 뼈",
  gain: "색칠된 곳이 살이 먼저 붙는 곳이에요",
  upper: "옆에서 본 모습이에요 · 화살표가 가슴~등 두께",
  collar: "목 아래 쇄골과 어깨선이에요",
  compliment: "잘 어울린다는 말을 들었던 옷과 가장 비슷한 것",
};

export default function BodyQuizArt({ qid, value, ink, acc }: Props) {
  const line = { fill: "none", stroke: ink, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const soft = `${acc}33`;
  const v = value as "straight" | "wave" | "natural";

  let body: React.ReactNode = null;

  if (qid === "wrist") {
    // 2026-11-09 다시 그림: 단면도는 알아보기 어렵다는 의견 → 손등 쪽에서 본 오른손.
    // 새끼손가락 쪽 손목뼈(화살표)가 안 보이는지 / 작게 보이는지 / 크게 튀어나왔는지로 고른다.
    const hand = {
      straight: "M25,80 L26,50 Q24,44 24,38 L23,24 Q23,8 40,8 Q57,8 57,24 L56,38 Q56,44 54,50 L55,80 Z",
      wave: "M29,80 L30,53 Q30,47 27,42 Q24,38 24,32 L23,24 Q23,8 40,8 Q57,8 57,24 L56,32 Q56,38 53,42 Q50,46 50,53 L51,80 Z",
      natural: "M25,80 L26,54 Q25,47 24,42 L23,24 Q23,8 40,8 Q57,8 57,24 L57,40 Q61,44 61,49 Q60,54 56,55 L55,80 Z",
    }[v];
    const bone = {
      straight: <circle cx="54" cy="47" r="3.6" fill="none" stroke={ink} strokeWidth="1" strokeDasharray="2 2" opacity="0.45" />,
      wave: <circle cx="50.5" cy="49" r="2.4" fill={acc} />,
      natural: <circle cx="58.5" cy="48" r="4.2" fill={acc} />,
    }[v];
    const tip = { straight: 59, wave: 54, natural: 64 }[v];
    body = (
      <>
        {/* 엄지 — 손바닥 밑에 깔리게 먼저 그린다 */}
        <path d="M27,42 Q15,37 12,28 Q11,23 15,23 Q20,25 26,31 Z" fill={soft} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
        <path d={hand} style={{ fill: "var(--t-bg, #F4F1E8)" }} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
        <path d={hand} fill={soft} />
        {/* 손가락 사이 */}
        <path d="M32,9.5 L32,21 M40,8 L40,21 M48,9.5 L48,21" stroke={ink} strokeWidth="1" strokeLinecap="round" opacity="0.45" />
        {bone}
        {/* 여기를 보세요 화살표 */}
        <path d={`M78,48 L${tip},48 M${tip + 4},44 L${tip},48 L${tip + 4},52`} fill="none" stroke={acc} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else if (qid === "gain") {
    // 앞모습 실루엣 + 살이 먼저 붙는 곳 색칠
    const fig = "M34,20 Q40,23 46,20 L54,23 Q57,24 57,28 L58,46 M26,28 Q26,24 29,23 L34,20 M26,28 L25,46 M31,24 L33,42 Q30,50 31,56 L34,76 M49,24 L47,42 Q50,50 49,56 L46,76 M40,58 L40,76";
    const mark = {
      straight: (
        <>
          <circle cx="40" cy="11" r="7.5" fill={soft} />
          <ellipse cx="40" cy="31" rx="13" ry="8" fill={acc} opacity="0.4" />
          <ellipse cx="26" cy="33" rx="3.5" ry="7" fill={acc} opacity="0.35" />
          <ellipse cx="54" cy="33" rx="3.5" ry="7" fill={acc} opacity="0.35" />
        </>
      ),
      wave: (
        <>
          <ellipse cx="40" cy="51" rx="12" ry="7" fill={acc} opacity="0.4" />
          <ellipse cx="35" cy="62" rx="4.5" ry="7" fill={acc} opacity="0.3" />
          <ellipse cx="45" cy="62" rx="4.5" ry="7" fill={acc} opacity="0.3" />
        </>
      ),
      natural: (
        <>
          {[[29, 23], [51, 23], [25.5, 37], [54.5, 37], [33, 56], [47, 56], [34, 66], [46, 66]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.6" fill={acc} />
          ))}
        </>
      ),
    }[v];
    body = (
      <>
        {mark}
        <circle cx="40" cy="11" r="6" {...line} />
        <path d={fig} {...line} />
      </>
    );
  } else if (qid === "upper") {
    // 2026-11-09 다시 그림: 몸통 덩어리만 있어 사람으로 안 읽힌다는 의견 → 머리~허벅지 옆모습(왼쪽을 봄).
    // 화살표 = 가슴~등 두께. 스트레이트는 가슴이 높고 두툼, 웨이브는 얇고 엉덩이 쪽에 무게, 내추럴은 각지고 어깨 뼈대가 큼.
    const fig = {
      straight: "M37,17 L36,21 Q26,24 25,30 Q25,35 30,37 Q31,40 31,44 Q30,48 30,53 Q30,60 31,66 L33,78 L45,78 L48,64 Q52,58 51,53 Q50,48 47,44 Q50,38 50,32 Q50,24 47,21 L43,17 Z",
      wave: "M37,17 L36,21 Q31,26 30,33 Q30,37 33,38 Q34,41 34,44 Q32,48 32,53 Q31,60 31,66 L33,78 L46,78 L49,66 Q54,60 52,54 Q50,48 44,44 Q46,38 46,32 Q46,24 45,21 L43,17 Z",
      natural: "M37,17 L35,21 Q28,23 27,30 L28,38 L30,44 L30,55 L31,66 L33,78 L45,78 L48,66 L50,55 L49,44 L51,32 L51,24 Q49,21 45,20 L43,17 Z",
    }[v];
    const [a, b, y] = { straight: [25, 50, 30], wave: [30, 46, 32], natural: [27, 51, 30] }[v];
    body = (
      <>
        <circle cx="40" cy="10" r="6.2" fill={soft} stroke={ink} strokeWidth="1.6" />
        {/* 묶은 머리(뒤) · 코(앞) — 왼쪽을 보고 선 모습 */}
        <path d="M45.5,8 Q50,8 50,13" fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M34,9 L32.6,11.4 L34.2,12" fill="none" stroke={ink} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={fig} fill={soft} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
        {v === "natural" && <circle cx="46" cy="22" r="3.4" fill={acc} />}
        <line x1={a} y1={y} x2={b} y2={y} stroke={acc} strokeWidth="2" />
        <path d={`M${a + 3},${y - 3} L${a},${y} L${a + 3},${y + 3} M${b - 3},${y - 3} L${b},${y} L${b - 3},${y + 3}`} fill="none" stroke={acc} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else if (qid === "collar") {
    // 목 아래 쇄골과 어깨선
    const shoulder = {
      straight: "M33,8 L33,26 Q24,30 16,36 Q10,40 10,50 M47,8 L47,26 Q56,30 64,36 Q70,40 70,50",
      wave: "M34,8 L34,28 Q26,33 20,40 Q17,44 16,52 M46,8 L46,28 Q54,33 60,40 Q63,44 64,52",
      natural: "M33,8 L33,24 L10,28 Q6,29 6,34 L6,52 M47,8 L47,24 L70,28 Q74,29 74,34 L74,52",
    }[v];
    const bone = {
      straight: <path d="M30,36 Q22,35 17,37 M50,36 Q58,35 63,37" fill="none" stroke={ink} strokeWidth="1" strokeDasharray="2 3" opacity="0.45" />,
      wave: <path d="M32,36 Q25,33 19,37 M48,36 Q55,33 61,37" fill="none" stroke={acc} strokeWidth="1.6" strokeLinecap="round" />,
      natural: (
        <>
          <path d="M31,34 Q20,31 10,33 M49,34 Q60,31 70,33" fill="none" stroke={acc} strokeWidth="3" strokeLinecap="round" />
          <circle cx="10" cy="31" r="3.5" fill={acc} />
          <circle cx="70" cy="31" r="3.5" fill={acc} />
        </>
      ),
    }[v];
    body = (
      <>
        <path d={shoulder} fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        {v === "straight" && <path d="M16,36 Q10,40 10,50 L70,50 Q70,40 64,36 Q56,30 47,26 L33,26 Q24,30 16,36 Z" fill={soft} />}
        {bone}
      </>
    );
  } else if (qid === "compliment") {
    // 잘 어울렸던 옷
    body = {
      straight: (
        // 브이넥 니트 — 군더더기 없는 베이직
        <>
          <path d="M26,14 L40,34 L54,14 L64,18 Q68,20 69,26 L72,44 L62,46 L60,34 L60,68 L20,68 L20,34 L18,46 L8,44 L11,26 Q12,20 16,18 Z" fill={soft} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M29,14 L40,30 L51,14" {...line} />
          <path d="M20,64 L60,64" {...line} opacity="0.6" />
        </>
      ),
      wave: (
        // 프릴 블라우스·크롭 가디건처럼 부드러운 옷
        <>
          <path d="M30,14 Q40,22 50,14 L60,20 Q64,30 58,34 L56,32 L56,62 Q48,66 40,62 Q32,66 24,62 L24,32 L22,34 Q16,30 20,20 Z" fill={soft} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M33,17 Q36,22 40,21 Q44,22 47,17" {...line} />
          <path d="M40,24 Q37,28 40,32 Q37,36 40,40 Q37,44 40,48" {...line} opacity="0.8" />
          <path d="M24,62 Q28,58 32,62 Q36,58 40,62 Q44,58 48,62 Q52,58 56,62" {...line} />
        </>
      ),
      natural: (
        // 툭 걸친 오버핏 셔츠
        <>
          <path d="M30,12 L50,12 L66,20 L74,48 L64,50 L60,34 L60,68 L20,68 L20,34 L16,50 L6,48 L14,20 Z" fill={soft} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M30,12 L40,22 L50,12 M40,22 L40,68 M20,28 L20,34 M60,28 L60,34" {...line} />
          <path d="M44,30 L52,30 L52,36 L44,36 Z" {...line} />
        </>
      ),
    }[v];
  }

  return (
    <svg width="88" height="88" viewBox="0 0 80 80" aria-hidden="true">
      {body}
    </svg>
  );
}
