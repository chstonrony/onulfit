"use client";

import { useState } from "react";
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
        <span style={{ fontFamily: sans, fontSize: "13px", fontWeight: 500, color: txt, letterSpacing: "0.02em" }}>
          {GYEOL.glyph} 결의 진단
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
            <span style={{ fontSize: "44px", display: "block", marginBottom: "20px" }}>{GYEOL.glyph}</span>
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
            options={BODY_QUESTIONS[qIdx].options.map((o) => ({ label: o.label, onClick: () => pickBody(o.value as BodyType) }))}
            vars={vars}
          />
        )}

        {step === "color" && (
          <QuestionView
            kicker={`컬러 ${qIdx + 1} / ${COLOR_QUESTIONS.length}`}
            intro={qIdx === 0 ? GYEOL.colorIntro : undefined}
            question={COLOR_QUESTIONS[qIdx].prompt}
            options={COLOR_QUESTIONS[qIdx].options.map((o) => ({ label: o.label, onClick: () => pickColor(o.value as "warm" | "cool" | "light" | "deep") }))}
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
  options,
  vars,
}: {
  kicker: string;
  intro?: string;
  question: string;
  options: { label: string; onClick: () => void }[];
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
              textAlign: "left",
              padding: "16px 18px",
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
            {o.label}
          </button>
        ))}
      </div>
    </div>
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
            <span key={c} style={{ fontFamily: sans, fontSize: "12px", color: txt, padding: "4px 10px", border: `1px solid ${bdr}`, borderRadius: "999px", wordBreak: "keep-all" }}>{c}</span>
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

      <button onClick={onDone} style={ctaStyle(acc)}>
        코디 받으러 가기
      </button>
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
          <span key={it} style={{ fontFamily: sans, fontSize: "12px", color, padding: "4px 10px", border: `1px solid ${bdr}`, borderRadius: "999px", wordBreak: "keep-all" }}>
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
