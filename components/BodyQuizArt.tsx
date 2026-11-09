/* ── 골격 자가진단 문항 그림 (2026-11-07) ──
   예전엔 모든 문항에 같은 몸 실루엣 아이콘만 붙어 있어서, 무엇을 보라는 건지 알기 어려웠다.
   문항마다 "그 부위를 이렇게 보면 된다"는 그림을 따로 그린다.
   선은 글자색(ink), 눈여겨볼 곳은 포인트색(acc)으로 칠한다. */

type Props = { qid: string; value: string; ink: string; acc: string };

/** 그림 아래 작게 붙는 "이 그림은 무엇인지" 설명 */
export const BODY_ART_NOTE: Record<string, string> = {
  wrist: "그림은 손목을 자른 단면이에요 · 점선은 감싸 쥔 손가락",
  gain: "색칠된 곳이 살이 먼저 붙는 곳이에요",
  upper: "옆에서 본 모습이에요 · 화살표가 상체 두께",
  collar: "목 아래 쇄골과 어깨선이에요",
  compliment: "잘 어울린다는 말을 들었던 옷과 가장 비슷한 것",
};

export default function BodyQuizArt({ qid, value, ink, acc }: Props) {
  const line = { fill: "none", stroke: ink, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const soft = `${acc}33`;
  const v = value as "straight" | "wave" | "natural";

  let body: React.ReactNode = null;

  if (qid === "wrist") {
    // 손목 단면: 점선 원(감싸 쥔 손) 안에 손목 모양
    const shape = {
      // 2026-11-09 바로잡음: 스트레이트=둥글고 도톰, 웨이브=납작하고 가늘다
      straight: <circle cx="40" cy="40" r="20" fill={soft} stroke={ink} strokeWidth="1.6" />,
      wave: <ellipse cx="40" cy="40" rx="20" ry="10" fill={soft} stroke={ink} strokeWidth="1.6" />,
      natural: <path d="M20,30 Q22,22 34,22 L50,23 Q56,18 62,24 Q66,30 60,36 L60,50 Q58,58 46,58 L30,58 Q20,57 20,48 Z" fill={soft} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />,
    }[v];
    const bones = {
      straight: [<circle key="a" cx="33" cy="40" r="3.5" fill="none" stroke={ink} strokeWidth="1" opacity="0.35" />, <circle key="b" cx="47" cy="40" r="3" fill="none" stroke={ink} strokeWidth="1" opacity="0.35" />],
      wave: [<ellipse key="a" cx="31" cy="40" rx="4" ry="2.6" fill="none" stroke={ink} strokeWidth="1" opacity="0.5" />, <ellipse key="b" cx="49" cy="40" rx="3.5" ry="2.4" fill="none" stroke={ink} strokeWidth="1" opacity="0.5" />],
      natural: [<circle key="a" cx="31" cy="42" r="5" fill="none" stroke={ink} strokeWidth="1.3" />, <circle key="b" cx="55" cy="28" r="5.5" fill={acc} opacity="0.85" />],
    }[v];
    body = (
      <>
        <circle cx="40" cy="40" r="31" fill="none" stroke={ink} strokeWidth="1" strokeDasharray="3 3" opacity="0.55" />
        {shape}
        {bones}
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
    // 옆모습 상체 — 앞뒤 두께
    const torso = {
      straight: "M36,20 Q28,24 29,36 Q30,48 33,62 L50,62 Q54,50 56,40 Q60,30 52,24 Q48,21 44,20",
      wave: "M37,20 Q33,26 34,38 Q35,50 36,62 L46,62 Q47,50 48,42 Q50,30 46,23 Q44,21 43,20",
      natural: "M35,20 Q31,24 31,36 Q32,48 34,62 L48,62 Q50,50 51,42 Q53,30 49,24 Q46,21 43,20",
    }[v];
    const [a, b] = { straight: [29, 57], wave: [34, 49], natural: [31, 52] }[v];
    body = (
      <>
        <circle cx="40" cy="11" r="6" {...line} />
        <path d="M38,17 L37,21 M42,17 L43,21" {...line} />
        <path d={torso} fill={soft} stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
        {v === "natural" && <circle cx="40" cy="24" r="5" fill={acc} opacity="0.85" />}
        <line x1={a} y1="38" x2={b} y2="38" stroke={acc} strokeWidth="2" />
        <path d={`M${a + 3},35 L${a},38 L${a + 3},41 M${b - 3},35 L${b},38 L${b - 3},41`} fill="none" stroke={acc} strokeWidth="2" strokeLinecap="round" />
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
    <svg width="76" height="76" viewBox="0 0 80 80" aria-hidden="true">
      {body}
    </svg>
  );
}
