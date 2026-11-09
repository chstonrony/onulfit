/* ── 골격 자가진단 문항 그림 (2026-11-07) ──
   예전엔 모든 문항에 같은 몸 실루엣 아이콘만 붙어 있어서, 무엇을 보라는 건지 알기 어려웠다.
   문항마다 "그 부위를 이렇게 보면 된다"는 그림을 따로 그린다.
   선은 글자색(ink), 눈여겨볼 곳은 포인트색(acc)으로 칠한다. */

type Props = { qid: string; value: string; ink: string; acc: string };

/** 그림 아래 작게 붙는 "이 그림은 무엇인지" 설명 */
export const BODY_ART_NOTE: Record<string, string> = {
  wrist: "손등 쪽에서 본 오른손이에요 · 동그라미가 손목 바깥쪽 뼈",
  gain: "색칠된 곳이 살이 먼저 붙는 곳이에요",
  upper: "옆에서 본 모습이에요 · 가슴~등 두께와 엉덩이 쪽을 비교해보세요",
  collar: "목 아래 쇄골과 어깨선이에요",
  compliment: "잘 어울린다는 말을 들었던 옷과 가장 비슷한 것",
};

/** 그림 대신 일러스트 사진을 쓰는 문항 (2026-11-09, GPT Image 2로 한 번 만든 것 — onulfit-kit/2026-11-09_진단문항그림)
    public/quiz/{qid}-{straight|wave|natural}.webp, 384×512 (손목은 손등~팔목, 상체는 목~허벅지만 잘라 씀) */
export const BODY_ART_PHOTO = new Set(["wrist", "upper"]);
export const bodyArtPhoto = (qid: string, value: string) => `/quiz/${qid}-${value}.webp`;

/** 진단을 열 때 일러스트 사진을 미리 받아둔다 (모두 합쳐 약 30KB) */
export function prefetchBodyArt() {
  if (typeof window === "undefined") return;
  BODY_ART_PHOTO.forEach((qid) => ["straight", "wave", "natural"].forEach((v) => { const i = new Image(); i.src = bodyArtPhoto(qid, v); }));
}

export default function BodyQuizArt({ qid, value, ink, acc }: Props) {
  if (BODY_ART_PHOTO.has(qid)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={bodyArtPhoto(qid, value)} alt="" width={96} height={128} decoding="async" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
    );
  }
  const line = { fill: "none", stroke: ink, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const soft = `${acc}33`;
  const v = value as "straight" | "wave" | "natural";

  let body: React.ReactNode = null;

  if (qid === "gain") {
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
