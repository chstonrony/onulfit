/* 체형별 비포/애프터 룩북 — 같은 인물이 코디만 바꿨을 때의 변화를 보여주는 시각 증명.
   진단 결과(골격 카드) 바로 아래에 붙어, 텍스트 가이드를 이미지 한 장으로 설득한다.
   이미지: public/lookbook/ba-{body}-{before|after}.jpg (연출 이미지, AI 생성 표기) */

import type { BodyType } from "@/lib/profile";

interface Cut {
  before: string;
  after: string;
  beforeCap: string;
  afterCap: string;
}

const CUTS: Record<BodyType, Cut> = {
  straight: {
    before: "/lookbook/ba-straight-before.jpg",
    after: "/lookbook/ba-straight-after.jpg",
    beforeCap: "오버핏 터틀넥 + 와이드 데님 — 짧은 목이 답답해 보이고 상체가 옷에 갇혀 부해 보여요.",
    afterCap: "목선 트인 셔츠 + 벨트 + 일자 데님 — 목선이 열리고 세로 라인이 살아나요.",
  },
  wave: {
    before: "/lookbook/ba-wave-before.jpg",
    after: "/lookbook/ba-wave-after.jpg",
    beforeCap: "박시 맨투맨 + 로우웨스트 — 얇은 상체가 묻히고 허리선이 내려가 처져 보여요.",
    afterCap: "스퀘어넥 니트 + 하이웨스트 롱 스커트 — 허리선이 올라가 곡선이 우아하게 살아나요.",
  },
  natural: {
    before: "/lookbook/ba-natural-before.jpg",
    after: "/lookbook/ba-natural-after.jpg",
    beforeCap: "슬림 니트 + 스키니 — 옷이 붙을수록 어깨와 골격이 드러나 딱딱해 보여요.",
    afterCap: "셔링 블라우스 + 니트 가디건 레이어드 — 여유가 골격을 부드럽게 감싸요.",
  },
};

interface Props {
  body: BodyType;
  vars: Record<string, string>;
}

export default function BeforeAfter({ body, vars }: Props) {
  const cut = CUTS[body];
  if (!cut) return null;

  const txt = vars["--t-txt"];
  const sub = vars["--t-sub"];
  const acc = vars["--t-acc"];
  const bdr = vars["--t-bdr"];
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const serif = "var(--font-gowun), 'Batang', serif";

  const badge = (label: string, filled: boolean) => (
    <span
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        fontFamily: "var(--font-jost), sans-serif",
        fontSize: "10.5px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "3px 11px",
        borderRadius: "999px",
        color: "#fff",
        backgroundColor: filled ? acc : "rgba(30,28,25,0.6)",
      }}
    >
      {label}
    </span>
  );

  return (
    <div style={{ border: `1px solid ${bdr}`, borderRadius: "14px", padding: "20px", marginBottom: "14px", backgroundColor: "var(--t-side)" }}>
      <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: acc, marginBottom: "8px" }}>
        LOOKBOOK · 비포 / 애프터
      </p>
      <p style={{ fontFamily: serif, fontSize: "18px", color: txt, marginBottom: "14px", wordBreak: "keep-all" }}>
        같은 사람, 코디만 바꿨습니다
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div style={{ position: "relative" }}>
            {badge("Before", false)}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cut.before} alt={`${body} 체형 비포 코디`} loading="lazy"
              style={{ width: "100%", borderRadius: "10px", display: "block", border: `1px solid ${bdr}`, backgroundColor: bdr }} />
          </div>
          <p style={{ fontFamily: sans, fontSize: "11.5px", color: sub, lineHeight: 1.65, marginTop: "8px", wordBreak: "keep-all" }}>{cut.beforeCap}</p>
        </div>
        <div>
          <div style={{ position: "relative" }}>
            {badge("After", true)}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cut.after} alt={`${body} 체형 애프터 코디`} loading="lazy"
              style={{ width: "100%", borderRadius: "10px", display: "block", border: `1px solid ${bdr}`, backgroundColor: bdr }} />
          </div>
          <p style={{ fontFamily: sans, fontSize: "11.5px", color: txt, opacity: 0.85, lineHeight: 1.65, marginTop: "8px", wordBreak: "keep-all" }}>{cut.afterCap}</p>
        </div>
      </div>

      <p style={{ fontFamily: sans, fontSize: "10.5px", color: sub, opacity: 0.65, lineHeight: 1.6, marginTop: "12px", wordBreak: "keep-all" }}>
        * 체형별 스타일링 로직을 보여주기 위한 연출 이미지예요.
      </p>
    </div>
  );
}
