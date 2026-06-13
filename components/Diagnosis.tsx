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

  return (
    <div style={{ animation: "cardEnter 500ms cubic-bezier(0.16,1,0.3,1) both" }}>
      <p style={{ fontFamily: serif, fontSize: "20px", color: txt, marginBottom: "24px" }}>
        {GYEOL.glyph} {GYEOL.resultLead}
      </p>

      {/* 골격 카드 */}
      <div style={{ border: `1px solid ${bdr}`, borderRadius: "14px", padding: "20px", marginBottom: "14px", backgroundColor: "var(--t-side)" }}>
        <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: acc, marginBottom: "8px" }}>BODY</p>
        <p style={{ fontFamily: serif, fontSize: "24px", fontWeight: 600, color: txt, marginBottom: "4px" }}>{bm.label} 체형</p>
        <p style={{ fontFamily: sans, fontSize: "13px", color: sub, lineHeight: 1.6, marginBottom: "14px", wordBreak: "keep-all" }}>{bm.tagline}</p>
        <TagRow label="잘 어울려요" items={bm.suits} color={txt} bdr={bdr} sans={sans} />
        <TagRow label="피하면 좋아요" items={bm.avoid} color={sub} bdr={bdr} sans={sans} />
      </div>

      {/* 컬러 카드 */}
      <div style={{ border: `1px solid ${bdr}`, borderRadius: "14px", padding: "20px", marginBottom: "24px", backgroundColor: "var(--t-side)" }}>
        <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: acc, marginBottom: "8px" }}>COLOR</p>
        <p style={{ fontFamily: serif, fontSize: "24px", fontWeight: 600, color: txt, marginBottom: "4px" }}>{cm.label}</p>
        <p style={{ fontFamily: sans, fontSize: "13px", color: sub, lineHeight: 1.6, marginBottom: "14px", wordBreak: "keep-all" }}>{cm.tagline}</p>
        <div className="flex gap-2 mb-3">
          {cm.swatch.map((hex) => (
            <span key={hex} style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: hex, border: `1px solid ${bdr}` }} />
          ))}
        </div>
        <TagRow label="잘 어울려요" items={cm.palette} color={txt} bdr={bdr} sans={sans} />
      </div>

      <p style={{ fontFamily: sans, fontSize: "12px", color: sub, lineHeight: 1.7, marginBottom: "20px", wordBreak: "keep-all" }}>
        이제 상황만 알려주시면, 결이 이 골격과 색에 맞춰 골라드릴게요. {GYEOL.signature}
      </p>

      <button onClick={onDone} style={ctaStyle(acc)}>
        코디 받으러 가기
      </button>
    </div>
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
