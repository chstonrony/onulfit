"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import StoryCard from "./StoryCard";
import {
  BODY_QUESTIONS,
  COLOR_QUESTIONS,
  BODY_META,
  COLOR_META,
  scoreBody,
  scoreColor,
  saveProfile,
  type BodyType,
  type ColorType,
  type Profile,
} from "@/lib/profile";
import { GYEOL } from "@/lib/gyeol";
import { BODY_GUIDE, COLOR_GUIDE, CROSS_GUIDE } from "@/lib/styleGuide";
import { lookboardChips, CURATED_BOARDS } from "@/lib/lookboards";
import Lookboard from "./Lookboard";

type Step = "intro" | "body" | "color" | "result";

/* 색 이름 → 실제 hex (퍼스널컬러 칩 시각화) */
const COLOR_HEX: Record<string, string> = {
  "코랄": "#F4826F", "피치": "#FBC9A8", "아이보리": "#EFE7D6", "카멜": "#C19A6B",
  "라이트 옐로우": "#F0E2A0", "애플 그린": "#9DBE4A", "라이트 카키": "#BDB484", "터콰이즈": "#3FC9C0",
  "블랙": "#222222", "차콜": "#3A4750", "버건디": "#6E2A3A", "탁한 회색": "#8E8B86",
  "로즈": "#CE6E80", "라벤더": "#B39DDB", "스카이 블루": "#8DC6E8", "소프트 그레이": "#C2BEB8",
  "오프화이트": "#F1EBE0", "베이비 핑크": "#F2C4CC", "민트": "#A6E0C6", "연보라": "#C7B6E6",
  "머스타드": "#D2A017", "다크 브라운": "#4A3528", "오렌지": "#E8843A",
  "올리브": "#6F7D3A", "브라운": "#7A5230", "테라코타": "#C66B47", "카키": "#88824F",
  "딥 그린": "#2E4D38", "와인": "#71303A", "형광색": "#C6F542", "쨍한 핑크": "#F5379E",
  "퓨어 화이트": "#FBFAF7", "네이비": "#26324F", "그레이": "#9B9B9B", "푸시아": "#C8377E",
  "로열 블루": "#2E54C8", "에메랄드": "#2E8B6E", "베이지": "#D6C5A8",
};
function colorHex(name: string): string {
  return COLOR_HEX[name] ?? "#C9C2B8";
}

/* 결 심볼 마크 (onulfit 로고에서 심볼만 추출, 테마 색 적용) */
function GyeolMark({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: "block" }}>
      <circle cx="36" cy="36" r="26" stroke={color} strokeWidth="3.2" />
      <path d="M36 14 C36 14 36 12 36 11" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M36 11 C36 11 31 11 29.5 13.5 C28 16 30.5 18.5 36 18.5 C41.5 18.5 44.5 21 43.5 24.5 C42.5 28 36 30 29 34.5 C25.5 37 24 39.5 25 42 C26 44.5 30 46 36 46 C42 46 46 44.5 47 42" stroke={color} strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <circle cx="36" cy="11" r="3" fill={color} />
    </svg>
  );
}

interface Props {
  vars: Record<string, string>;
  onComplete: (p: Profile) => void;
  onClose: () => void;
}

export default function Diagnosis({ vars, onComplete, onClose }: Props) {
  const [step, setStep] = useState<Step>("intro");
  const [bodyAns, setBodyAns] = useState<BodyType[]>([]);
  const [colorAns, setColorAns] = useState<("warm" | "cool" | "light" | "deep")[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [result, setResult] = useState<{ body: BodyType; color: ColorType } | null>(null);

  const txt = vars["--t-txt"];
  const sub = vars["--t-sub"];
  const acc = vars["--t-acc"];
  const bdr = vars["--t-bdr"];

  function pickBody(v: BodyType) {
    const next = [...bodyAns, v];
    if (qIdx + 1 < BODY_QUESTIONS.length) {
      setBodyAns(next);
      setQIdx(qIdx + 1);
    } else {
      setBodyAns(next);
      setQIdx(0);
      setStep("color");
    }
  }

  function pickColor(v: "warm" | "cool" | "light" | "deep") {
    const next = [...colorAns, v];
    if (qIdx + 1 < COLOR_QUESTIONS.length) {
      setColorAns(next);
      setQIdx(qIdx + 1);
    } else {
      const body = scoreBody(bodyAns);
      const color = scoreColor(next);
      const profile = saveProfile(body, color);
      setResult({ body, color });
      setStep("result");
      onComplete(profile);
    }
  }

  const serif = "var(--font-gowun), 'Batang', serif";
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "var(--t-bg)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* 헤더 */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderBottom: `1px solid ${bdr}` }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "7px", fontFamily: sans, fontSize: "13px", fontWeight: 500, color: txt, letterSpacing: "0.02em" }}>
          <GyeolMark color={txt} size={18} />
          결의 진단
        </span>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", color: sub, fontSize: "20px", lineHeight: 1, padding: "4px" }}
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 px-6 py-8 max-w-[560px] mx-auto w-full">
        {step === "intro" && (
          <div style={{ animation: "cardEnter 500ms cubic-bezier(0.16,1,0.3,1) both" }}>
            <div style={{ marginBottom: "20px" }}><GyeolMark color={acc} size={46} /></div>
            <p style={{ fontFamily: serif, fontSize: "22px", lineHeight: 1.6, color: txt, wordBreak: "keep-all", marginBottom: "28px" }}>
              {GYEOL.diagIntro}
            </p>
            <button onClick={() => setStep("body")} style={ctaStyle(acc)}>
              시작하기
            </button>
          </div>
        )}

        {step === "body" && (
          <QuestionView
            kicker={`골격 ${qIdx + 1} / ${BODY_QUESTIONS.length}`}
            intro={qIdx === 0 ? GYEOL.bodyIntro : undefined}
            question={BODY_QUESTIONS[qIdx].prompt}
            kind="body"
            options={BODY_QUESTIONS[qIdx].options.map((o) => ({ label: o.label, value: o.value, onClick: () => pickBody(o.value as BodyType) }))}
            vars={vars}
          />
        )}

        {step === "color" && (
          <QuestionView
            kicker={`컬러 ${qIdx + 1} / ${COLOR_QUESTIONS.length}`}
            intro={qIdx === 0 ? GYEOL.colorIntro : undefined}
            question={COLOR_QUESTIONS[qIdx].prompt}
            kind="color"
            options={COLOR_QUESTIONS[qIdx].options.map((o) => ({ label: o.label, value: o.value, onClick: () => pickColor(o.value as "warm" | "cool" | "light" | "deep") }))}
            vars={vars}
          />
        )}

        {step === "result" && result && (
          <ResultView body={result.body} color={result.color} vars={vars} onDone={onClose} />
        )}
      </div>
    </div>
  );
}

function QuestionView({
  kicker,
  intro,
  question,
  kind,
  options,
  vars,
}: {
  kicker: string;
  intro?: string;
  question: string;
  kind: "body" | "color";
  options: { label: string; value: string; onClick: () => void }[];
  vars: Record<string, string>;
}) {
  const txt = vars["--t-txt"];
  const sub = vars["--t-sub"];
  const acc = vars["--t-acc"];
  const bdr = vars["--t-bdr"];
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const serif = "var(--font-gowun), 'Batang', serif";

  return (
    <div key={question} style={{ animation: "cardEnter 400ms cubic-bezier(0.16,1,0.3,1) both" }}>
      <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: acc, marginBottom: "14px" }}>
        {kicker}
      </p>
      {intro && (
        <p style={{ fontFamily: sans, fontSize: "13px", lineHeight: 1.7, color: sub, marginBottom: "16px", wordBreak: "keep-all" }}>
          {intro}
        </p>
      )}
      <p style={{ fontFamily: serif, fontSize: "20px", lineHeight: 1.55, color: txt, marginBottom: "28px", wordBreak: "keep-all" }}>
        {question}
      </p>
      <div className="flex flex-col gap-3">
        {options.map((o, i) => (
          <button
            key={i}
            onClick={o.onClick}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              textAlign: "left",
              padding: "14px 16px",
              fontFamily: sans,
              fontSize: "14px",
              lineHeight: 1.5,
              color: txt,
              backgroundColor: "var(--t-side)",
              border: `1px solid ${bdr}`,
              borderRadius: "12px",
              cursor: "pointer",
              transition: "border-color 0.18s, transform 0.1s",
              wordBreak: "keep-all",
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.99)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = acc; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = bdr; }}
          >
            <span style={{ flexShrink: 0, width: "52px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <OptionVisual kind={kind} value={o.value} acc={acc} />
            </span>
            <span style={{ flex: 1 }}>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function OptionVisual({ kind, value, acc }: { kind: "body" | "color"; value: string; acc: string }) {
  if (kind === "color") {
    const PAL: Record<string, string[]> = {
      warm: ["#D98E5E", "#C4945A", "#7E8A4E"],
      cool: ["#D98FB8", "#7B9BD4", "#B0A5D4"],
      light: ["#F4CBBA", "#BFE0EE", "#EBD89E"],
      deep: ["#7A3142", "#26414F", "#5A4628"],
    };
    const cols = PAL[value] ?? ["#cccccc", "#bbbbbb", "#aaaaaa"];
    return (
      <svg width="50" height="44" viewBox="0 0 50 44" aria-hidden="true">
        {cols.map((c, i) => (
          <circle key={i} cx={11 + i * 14} cy="22" r="9.5" fill={c} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
        ))}
      </svg>
    );
  }
  const BODY: Record<string, string> = {
    straight: "M15,16 L29,16 L28,52 L16,52 Z",
    wave: "M14,16 L30,16 L24,33 L28,52 L16,52 L20,33 Z",
    natural: "M11,16 L33,16 L30,52 L14,52 Z",
  };
  const d = BODY[value] ?? BODY.straight;
  return (
    <svg width="44" height="60" viewBox="0 0 44 60" aria-hidden="true">
      <circle cx="22" cy="9" r="5.5" fill={`${acc}14`} stroke={acc} strokeWidth="1.5" />
      <path d={d} fill={`${acc}14`} stroke={acc} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function ResultView({
  body,
  color,
  vars,
  onDone,
}: {
  body: BodyType;
  color: ColorType;
  vars: Record<string, string>;
  onDone: () => void;
}) {
  const txt = vars["--t-txt"];
  const sub = vars["--t-sub"];
  const acc = vars["--t-acc"];
  const bdr = vars["--t-bdr"];
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const serif = "var(--font-gowun), 'Batang', serif";
  const bm = BODY_META[body];
  const cm = COLOR_META[color];
  const bg = BODY_GUIDE[body];
  const cg = COLOR_GUIDE[color];
  const cross = CROSS_GUIDE[`${body}-${color}`];
  const storyRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  async function saveStory() {
    if (!storyRef.current || saving) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(storyRef.current, { pixelRatio: 3, cacheBust: true });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `오늘핏_내결_${bm.label}_${cm.label}.png`;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const ITEM_LABELS: { key: keyof typeof bg.items; label: string }[] = [
    { key: "neckline", label: "넥라인" },
    { key: "shoulder", label: "어깨·소매" },
    { key: "top", label: "상의" },
    { key: "bottom", label: "하의" },
    { key: "dress", label: "원피스" },
    { key: "outer", label: "아우터" },
    { key: "fabric", label: "소재" },
    { key: "shoesBag", label: "신발·가방" },
    { key: "accessory", label: "액세서리" },
  ];

  const cardStyle: React.CSSProperties = { border: `1px solid ${bdr}`, borderRadius: "14px", padding: "20px", marginBottom: "14px", backgroundColor: "var(--t-side)" };
  const kicker = (t: string) => (
    <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: acc, marginBottom: "8px" }}>{t}</p>
  );

  return (
    <div style={{ animation: "cardEnter 500ms cubic-bezier(0.16,1,0.3,1) both" }}>
      <p style={{ fontFamily: serif, fontSize: "20px", color: txt, marginBottom: "6px" }}>
        {GYEOL.glyph} {GYEOL.resultLead}
      </p>

      {/* 조합 페르소나 (있을 때) */}
      {cross && (
        <p style={{ fontFamily: serif, fontSize: "16px", color: acc, marginBottom: "20px", wordBreak: "keep-all" }}>
          “{bm.label} × {cm.label} — {cross.persona}”
        </p>
      )}
      {!cross && <div style={{ height: "14px" }} />}

      {/* 골격 카드 + 핵심 원칙 */}
      <div style={cardStyle}>
        {kicker("BODY · 골격")}
        <p style={{ fontFamily: serif, fontSize: "24px", fontWeight: 600, color: txt, marginBottom: "4px" }}>{bm.label} 체형</p>
        <p style={{ fontFamily: sans, fontSize: "13px", color: sub, lineHeight: 1.6, marginBottom: "14px", wordBreak: "keep-all" }}>{bm.tagline}</p>
        <div style={{ borderLeft: `2px solid ${acc}`, paddingLeft: "12px", marginBottom: "14px" }}>
          <p style={{ fontFamily: sans, fontSize: "13px", fontWeight: 500, color: txt, lineHeight: 1.6, wordBreak: "keep-all" }}>{bg.principle}</p>
        </div>
        <ul style={{ margin: 0, paddingLeft: "16px" }}>
          {bg.characteristics.map((c, i) => (
            <li key={i} style={{ fontFamily: sans, fontSize: "12.5px", color: sub, lineHeight: 1.8, wordBreak: "keep-all" }}>{c}</li>
          ))}
        </ul>
      </div>

      {/* 아이템별 가이드 (L1 핵심) */}
      <div style={cardStyle}>
        {kicker("STYLING · 아이템별 가이드")}
        <div className="flex flex-col gap-3 mt-1">
          {ITEM_LABELS.map(({ key, label }) => (
            <div key={key}>
              <p style={{ fontFamily: sans, fontSize: "13px", fontWeight: 600, color: txt, marginBottom: "4px" }}>{label}</p>
              <p style={{ fontFamily: sans, fontSize: "12.5px", color: txt, opacity: 0.85, lineHeight: 1.6, wordBreak: "keep-all", marginBottom: "2px" }}>
                <span style={{ color: acc, fontWeight: 600 }}>○ </span>{bg.items[key].good}
              </p>
              <p style={{ fontFamily: sans, fontSize: "12px", color: sub, lineHeight: 1.6, wordBreak: "keep-all" }}>
                <span style={{ opacity: 0.7 }}>✕ </span>{bg.items[key].avoid}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 흔한 실수 + 코디 공식 */}
      <div style={cardStyle}>
        {kicker("TIPS")}
        <p style={{ fontFamily: sans, fontSize: "13px", fontWeight: 600, color: txt, marginBottom: "6px" }}>흔한 실수</p>
        <ul style={{ margin: "0 0 14px", paddingLeft: "16px" }}>
          {bg.mistakes.map((m, i) => (
            <li key={i} style={{ fontFamily: sans, fontSize: "12.5px", color: sub, lineHeight: 1.7, wordBreak: "keep-all" }}>{m}</li>
          ))}
        </ul>
        <p style={{ fontFamily: sans, fontSize: "13px", fontWeight: 600, color: txt, marginBottom: "6px" }}>결의 코디 공식</p>
        <div className="flex flex-col gap-1.5">
          {bg.formulas.map((f, i) => (
            <p key={i} style={{ fontFamily: sans, fontSize: "12.5px", color: txt, opacity: 0.9, lineHeight: 1.5, wordBreak: "keep-all", padding: "6px 10px", border: `1px solid ${bdr}`, borderRadius: "8px" }}>{f}</p>
          ))}
        </div>
      </div>

      {/* 컬러 카드 (상세) */}
      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        {kicker("COLOR · 퍼스널컬러")}
        <p style={{ fontFamily: serif, fontSize: "24px", fontWeight: 600, color: txt, marginBottom: "4px" }}>{cm.label}</p>
        <p style={{ fontFamily: sans, fontSize: "13px", color: sub, lineHeight: 1.6, marginBottom: "14px", wordBreak: "keep-all" }}>{cg.tip}</p>
        <p style={{ fontFamily: sans, fontSize: "11px", color: txt, opacity: 0.6, marginBottom: "6px" }}>베스트 컬러</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {cg.bestColors.map((c) => (
            <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: sans, fontSize: "12px", color: txt, padding: "4px 11px 4px 7px", border: `1px solid ${bdr}`, borderRadius: "999px", wordBreak: "keep-all" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: colorHex(c), border: "0.5px solid rgba(0,0,0,0.12)", flexShrink: 0 }} />
              {c}
            </span>
          ))}
        </div>
        <TagRow label="피하면 좋아요" items={cg.worstColors} color={sub} bdr={bdr} sans={sans} />
        <div className="flex flex-col gap-1 mt-2">
          <MiniRow label="메탈" value={cg.metal} txt={txt} sub={sub} sans={sans} />
          <MiniRow label="메이크업" value={cg.makeup} txt={txt} sub={sub} sans={sans} />
          <MiniRow label="데님" value={cg.denim} txt={txt} sub={sub} sans={sans} />
        </div>
      </div>

      {/* 룩북 — 핀터레스트 비주얼 레퍼런스 */}
      <Lookboard vars={vars} chips={lookboardChips(body, color)} boardUrl={CURATED_BOARDS.byBody[body] || CURATED_BOARDS.trend} />

      {cross && (
        <p style={{ fontFamily: sans, fontSize: "12.5px", color: txt, opacity: 0.85, lineHeight: 1.7, marginBottom: "18px", wordBreak: "keep-all", padding: "12px 14px", border: `1px solid ${acc}`, borderRadius: "10px", backgroundColor: "var(--t-bai)" }}>
          <span style={{ color: acc, fontWeight: 600 }}>시그니처 룩 · </span>{cross.signature}
        </p>
      )}

      <p style={{ fontFamily: sans, fontSize: "12px", color: sub, lineHeight: 1.7, marginBottom: "20px", wordBreak: "keep-all" }}>
        이제 상황만 알려주시면, 결이 이 골격과 색에 맞춰 골라드릴게요. {GYEOL.signature}
      </p>

      {/* 결과 카드 저장 (인스타 공유 — 바이럴 유입) */}
      <button
        onClick={saveStory}
        disabled={saving}
        style={{
          width: "100%",
          padding: "15px",
          marginBottom: "10px",
          fontFamily: sans,
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "0.02em",
          color: acc,
          background: "transparent",
          border: `1px solid ${acc}`,
          borderRadius: "12px",
          cursor: saving ? "default" : "pointer",
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? "이미지 만드는 중…" : "📸 내 결 카드 저장 · 공유하기"}
      </button>

      <button onClick={onDone} style={ctaStyle(acc)}>
        코디 받으러 가기
      </button>

      {/* 오프스크린 9:16 스토리 카드 (캡처용) */}
      <div style={{ position: "fixed", left: "-9999px", top: 0, pointerEvents: "none" }} aria-hidden>
        <StoryCard ref={storyRef} body={body} color={color} />
      </div>
    </div>
  );
}

function MiniRow({ label, value, txt, sub, sans }: { label: string; value: string; txt: string; sub: string; sans: string }) {
  return (
    <p style={{ fontFamily: sans, fontSize: "12.5px", lineHeight: 1.6, wordBreak: "keep-all" }}>
      <span style={{ color: sub }}>{label} · </span>
      <span style={{ color: txt, opacity: 0.9 }}>{value}</span>
    </p>
  );
}

function TagRow({ label, items, color, bdr, sans }: { label: string; items: string[]; color: string; bdr: string; sans: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <p style={{ fontFamily: sans, fontSize: "11px", color, opacity: 0.6, marginBottom: "6px" }}>{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span key={it} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: sans, fontSize: "12px", color, padding: "4px 11px 4px 7px", border: `1px solid ${bdr}`, borderRadius: "999px", wordBreak: "keep-all", opacity: 0.7 }}>
            <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: colorHex(it), border: "0.5px solid rgba(0,0,0,0.12)", flexShrink: 0, opacity: 0.6 }} />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function ctaStyle(acc: string): React.CSSProperties {
  return {
    width: "100%",
    padding: "16px",
    fontFamily: "var(--font-noto-sans), sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "0.04em",
    color: "#fff",
    backgroundColor: acc,
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  };
}
