"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import StoryCard from "./StoryCard";
import ConsultCTA from "./ConsultCTA";
import { track } from "@/lib/track";
import SelfCheckGuide from "./SelfCheckGuide";
import { Wordmark } from "./Editorial";
import {
  BODY_QUESTIONS,
  COLOR_QUESTIONS,
  BODY_META,
  COLOR_META,
  scoreBody,
  scoreColor,
  bodyTally,
  colorScores,
  saveProfile,
  type BodyAnswer,
  type ColorAnswer,
  type BodyType,
  type ColorType,
  type Profile,
} from "@/lib/profile";
import { GYEOL } from "@/lib/gyeol";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/consult";
import { BODY_GUIDE, COLOR_GUIDE, CROSS_GUIDE } from "@/lib/styleGuide";
import { lookboardChips, CURATED_BOARDS } from "@/lib/lookboards";
import Lookboard from "./Lookboard";
import CompletedLook from "./CompletedLook";
import ZigzagPicks from "./ZigzagPicks";
import BodyQuizArt, { BODY_ART_NOTE, BODY_ART_PHOTO, prefetchBodyArt } from "./BodyQuizArt";
import ColorQuizArt, { COLOR_ART_NOTE } from "./ColorQuizArt";
import BeforeAfterBoard, { prefetchBA } from "./BeforeAfterBoard";
import { BodyForms, BodyDoDont, SeasonMap, ToneCompare, SwatchBoard, FormulaBoards, ColorShop } from "./DiagnosisVisuals";

type Step = "intro" | "body" | "half" | "color" | "result";

/* 색 이름 → 실제 hex (퍼스널컬러 칩·옷 사진에 입히는 색)
   2026-11-07: 화면용 원색이 아니라 실제 옷감에서 나오는 톤으로 다듬음(채도를 낮추고 깊이를 줌) */
const COLOR_HEX: Record<string, string> = {
  // 봄 웜
  "코랄": "#E2826C", "피치": "#EFC2A4", "아이보리": "#ECE4D3", "카멜": "#B98D63",
  "라이트 옐로우": "#E8D59A", "애플 그린": "#A2AE6A", "라이트 카키": "#B9AF88", "터콰이즈": "#5E9E98",
  // 여름 쿨
  "로즈": "#C07C88", "라벤더": "#AFA5CB", "스카이 블루": "#A5BFD6", "소프트 그레이": "#BFBBB6",
  "오프화이트": "#EFEAE0", "베이비 핑크": "#E8C4C8", "민트": "#AFCFC0", "연보라": "#C4B8D8",
  // 가을 웜
  "올리브": "#6C7144", "브라운": "#76533A", "머스타드": "#C2952F", "테라코타": "#B0654B",
  "카키": "#7F7A55", "딥 그린": "#33503F", "와인": "#6A2D39",
  // 겨울 쿨
  "블랙": "#1E1D1C", "퓨어 화이트": "#F8F8F6", "네이비": "#252F4A", "버건디": "#672634",
  "그레이": "#97979A", "푸시아": "#AE3F78", "로열 블루": "#2F4C9E", "에메랄드": "#2E7562",
  // 피할 색에만 나오는 것
  "차콜": "#3A3E44", "탁한 회색": "#8B8884", "다크 브라운": "#4B392D", "오렌지": "#D47E3E",
  "형광색": "#C9E84A", "쨍한 핑크": "#E8479A", "베이지": "#D1C0A3",
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
  /** 결과 화면에서 "이 공식으로 코디 받기" — 상황 문장을 코디 추천으로 넘긴다 */
  onAsk?: (situation: string) => void;
}

export default function Diagnosis({ vars, onComplete, onClose, onAsk }: Props) {
  const [step, setStep] = useState<Step>("intro");
  const [bodyAns, setBodyAns] = useState<BodyAnswer[]>([]);
  const [colorAns, setColorAns] = useState<ColorAnswer[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [result, setResult] = useState<{ body: BodyType; color: ColorType } | null>(null);

  const txt = vars["--t-txt"];
  const sub = vars["--t-sub"];
  const acc = vars["--t-acc"];
  const bdr = vars["--t-bdr"];

  // 진단을 열면 손목·상체 일러스트를 미리 받아둔다(첫 문항이 바로 뜨게)
  useEffect(() => { prefetchBodyArt(); }, []);

  // 마지막 컬러 문항에 오면, 나올 수 있는 결과 2가지의 비포/애프터 사진을 미리 받아둔다
  // → 결과 화면에서 코디 사진이 기다림 없이 바로 뜬다
  useEffect(() => {
    if (step !== "color" || qIdx !== COLOR_QUESTIONS.length - 1) return;
    const body = scoreBody(bodyAns);
    const keys = (["light", "deep", "unsure"] as const).map((last) => `${body}_${scoreColor([...colorAns, last])}`);
    prefetchBA([...new Set(keys)]);
  }, [step, qIdx, bodyAns, colorAns]);

  function pickBody(v: BodyAnswer) {
    const next = [...bodyAns, v];
    if (qIdx + 1 < BODY_QUESTIONS.length) {
      setBodyAns(next);
      setQIdx(qIdx + 1);
    } else {
      // 골격 끝 → 중간 쉼표 화면(결과는 가려두고 컬러로 이어가게)
      setBodyAns(next);
      setQIdx(0);
      setStep("half");
    }
  }

  /** 이전 문항으로 (마지막 답 하나를 지운다) */
  function goBack() {
    if (step === "body") {
      if (qIdx === 0) { setStep("intro"); return; }
      setBodyAns(bodyAns.slice(0, -1));
      setQIdx(qIdx - 1);
    } else if (step === "half") {
      setBodyAns(bodyAns.slice(0, -1));
      setQIdx(BODY_QUESTIONS.length - 1);
      setStep("body");
    } else if (step === "color") {
      if (qIdx === 0) { setStep("half"); return; }
      setColorAns(colorAns.slice(0, -1));
      setQIdx(qIdx - 1);
    }
  }

  function pickColor(v: ColorAnswer) {
    const next = [...colorAns, v];
    if (qIdx + 1 < COLOR_QUESTIONS.length) {
      setColorAns(next);
      setQIdx(qIdx + 1);
    } else {
      setColorAns(next);
      const body = scoreBody(bodyAns);
      const color = scoreColor(next);
      const profile = saveProfile(body, color);
      setResult({ body, color });
      setStep("result");
      track("diag_complete", { body, color });
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
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${txt}`, position: "sticky", top: 0, zIndex: 2, backgroundColor: "var(--t-bg)" }}
      >
        <span className="ed-label" style={{ display: "flex", alignItems: "center", gap: "8px", color: txt }}>
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

      <div className="flex-1 px-5 py-7 max-w-[560px] mx-auto w-full">
        {step === "intro" && (
          <div style={{ animation: "cardEnter 500ms cubic-bezier(0.16,1,0.3,1) both" }}>
            <div style={{ marginBottom: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span className="ed-label" style={{ color: acc }}>Free · 1 min</span>
                <span className="ed-label" style={{ color: sub }}>10 questions</span>
              </div>
              <Wordmark text="Self-check" size={24} />
              <div style={{ height: "1px", background: txt, marginTop: "12px" }} />
            </div>
            <p style={{ fontFamily: serif, fontSize: "24px", lineHeight: 1.4, color: txt, wordBreak: "keep-all", marginBottom: "8px" }}>
              {GYEOL.diagIntro}
            </p>
            <p style={{ fontFamily: sans, fontSize: "13px", lineHeight: 1.7, color: sub, wordBreak: "keep-all", marginBottom: "18px" }}>
              이렇게 10가지를 살펴봐요. 거울 하나와 밝은 창가면 충분해요. 컬러는 맨얼굴일수록 정확해요.
            </p>
            <div style={{ marginBottom: "22px" }}>
              <SelfCheckGuide />
            </div>
            <button onClick={() => { track("diag_start"); setStep("body"); }} style={ctaStyle()}>
              시작하기 · 약 1분
            </button>
          </div>
        )}

        {(step === "body" || step === "color") && (
          <Progress step={step} qIdx={qIdx} acc={acc} bdr={bdr} sub={sub} onBack={goBack} />
        )}

        {step === "body" && (
          <QuestionView
            kicker={`골격 ${qIdx + 1} / ${BODY_QUESTIONS.length} · ${BODY_QUESTIONS[qIdx].short}`}
            intro={qIdx === 0 ? GYEOL.bodyIntro : undefined}
            question={BODY_QUESTIONS[qIdx].prompt}
            hint={BODY_QUESTIONS[qIdx].hint}
            kind="body"
            qid={BODY_QUESTIONS[qIdx].id}
            options={BODY_QUESTIONS[qIdx].options.map((o) => ({ label: o.label, value: o.value, desc: o.desc, onClick: () => pickBody(o.value as BodyType) }))}
            onUnsure={() => pickBody("unsure")}
            vars={vars}
          />
        )}

        {step === "color" && (
          <QuestionView
            kicker={`컬러 ${qIdx + 1} / ${COLOR_QUESTIONS.length} · ${COLOR_QUESTIONS[qIdx].short}`}
            intro={qIdx === 0 ? GYEOL.colorIntro : undefined}
            question={COLOR_QUESTIONS[qIdx].prompt}
            hint={COLOR_QUESTIONS[qIdx].hint}
            kind="color"
            qid={COLOR_QUESTIONS[qIdx].id}
            options={COLOR_QUESTIONS[qIdx].options.map((o) => ({ label: o.label, value: o.value, desc: o.desc, onClick: () => pickColor(o.value as ColorAnswer) }))}
            onUnsure={() => pickColor("unsure")}
            vars={vars}
          />
        )}

        {step === "half" && (
          <HalfwayView body={scoreBody(bodyAns)} vars={vars} onNext={() => { setQIdx(0); setStep("color"); }} onBack={goBack} />
        )}

        {step === "result" && result && (
          <ResultView body={result.body} color={result.color} bodyAns={bodyAns} colorAns={colorAns} vars={vars} onDone={onClose} onAsk={onAsk} />
        )}
      </div>
    </div>
  );
}

/* 진행 막대 — 골격 5칸 + 컬러 5칸, 이전 버튼 */
function Progress({
  step,
  qIdx,
  acc,
  bdr,
  sub,
  onBack,
}: {
  step: "body" | "color";
  qIdx: number;
  acc: string;
  bdr: string;
  sub: string;
  onBack: () => void;
}) {
  const done = step === "body" ? qIdx : BODY_QUESTIONS.length + qIdx;
  const total = BODY_QUESTIONS.length + COLOR_QUESTIONS.length;
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", padding: "4px 0", cursor: "pointer", fontFamily: sans, fontSize: "12.5px", color: sub }}
        >
          ← 이전
        </button>
        <span style={{ fontFamily: sans, fontSize: "12px", color: sub }}>
          {done + 1} / {total}
        </span>
      </div>
      <div style={{ display: "flex", gap: "3px" }} aria-hidden>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: 0,
              backgroundColor: i <= done ? acc : bdr,
              opacity: i === done ? 1 : i < done ? 0.75 : 1,
              marginLeft: i === BODY_QUESTIONS.length ? "6px" : 0,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", marginTop: "5px", fontFamily: sans, fontSize: "10.5px", color: sub }}>
        <span style={{ flex: BODY_QUESTIONS.length }}>골격</span>
        <span style={{ flex: COLOR_QUESTIONS.length, paddingLeft: "6px" }}>퍼스널컬러</span>
      </div>
    </div>
  );
}

function QuestionView({
  kicker,
  intro,
  question,
  hint,
  kind,
  qid,
  options,
  onUnsure,
  vars,
}: {
  kicker: string;
  intro?: string;
  question: string;
  hint?: string;
  kind: "body" | "color";
  /** 문항 id — 문항별 그림을 고른다 */
  qid?: string;
  options: { label: string; value: string; desc?: string; onClick: () => void }[];
  /** "잘 모르겠어요" — 점수 없이 다음 문항으로 */
  onUnsure?: () => void;
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
      <p className="ed-label" style={{ color: acc, marginBottom: "14px" }}>
        {kicker}
      </p>
      {intro && (
        <p style={{ fontFamily: sans, fontSize: "13px", lineHeight: 1.7, color: sub, marginBottom: "16px", wordBreak: "keep-all" }}>
          {intro}
        </p>
      )}
      <p style={{ fontFamily: serif, fontSize: "25px", lineHeight: 1.35, color: txt, marginBottom: hint ? "12px" : "28px", wordBreak: "keep-all" }}>
        {question}
      </p>
      {hint && (
        <p style={{ display: "inline-block", fontFamily: sans, fontSize: "12.5px", lineHeight: 1.55, color: txt, opacity: 0.8, backgroundColor: "var(--t-card)", border: `1px dashed ${bdr}`, borderRadius: "2px", padding: "8px 12px", marginBottom: "22px", wordBreak: "keep-all" }}>
          {hint}
        </p>
      )}
      {qid && (kind === "body" ? BODY_ART_NOTE[qid] : COLOR_ART_NOTE[qid]) && (
        <p style={{ fontFamily: sans, fontSize: "11.5px", color: sub, marginBottom: "10px", wordBreak: "keep-all" }}>
          {kind === "body" ? BODY_ART_NOTE[qid] : COLOR_ART_NOTE[qid]}
        </p>
      )}
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
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.45,
              color: txt,
              backgroundColor: "var(--t-card)",
              border: `1px solid ${bdr}`,
              borderRadius: "2px",
              cursor: "pointer",
              transition: "border-color 0.18s, transform 0.1s",
              wordBreak: "keep-all",
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.99)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            // 휴대폰에서 탭한 자리의 테두리가 다음 문항에 남지 않게, 마우스일 때만 강조
            onPointerEnter={(e) => { if (e.pointerType === "mouse") e.currentTarget.style.borderColor = txt; }}
            onPointerLeave={(e) => { e.currentTarget.style.borderColor = bdr; }}
          >
            {qid ? (
              <span style={{ flexShrink: 0, ...(kind === "body" && BODY_ART_PHOTO.has(qid) ? { width: "96px", height: "128px", overflow: "hidden" } : { width: "96px", height: "96px" }), display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--t-bg)", borderRadius: "2px" }}>
                {kind === "body" ? <BodyQuizArt qid={qid} value={o.value} ink={txt} acc={acc} /> : <ColorQuizArt qid={qid} value={o.value} ink={txt} />}
              </span>
            ) : (
              <span style={{ flexShrink: 0, width: "52px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <OptionVisual kind={kind} value={o.value} acc={acc} />
              </span>
            )}
            <span style={{ flex: 1 }}>
              {o.label}
              {o.desc && (
                <span style={{ display: "block", marginTop: "4px", fontSize: "12.5px", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.5, color: sub }}>
                  {o.desc}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
      {onUnsure && (
        <button
          onClick={onUnsure}
          style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", padding: "8px 12px", cursor: "pointer", fontFamily: sans, fontSize: "13px", color: sub, textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          잘 모르겠어요 · 건너뛰기
        </button>
      )}
    </div>
  );
}

/* 골격 5문항을 마친 뒤 쉼표 화면 — 골격 결과를 흐리게 보여주고 컬러로 이어가게 한다 */
function HalfwayView({ body, vars, onNext, onBack }: { body: BodyType; vars: Record<string, string>; onNext: () => void; onBack: () => void }) {
  const txt = vars["--t-txt"];
  const sub = vars["--t-sub"];
  const acc = vars["--t-acc"];
  const bdr = vars["--t-bdr"];
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const serif = "var(--font-gowun), 'Batang', serif";
  return (
    <div style={{ animation: "cardEnter 450ms cubic-bezier(0.16,1,0.3,1) both" }}>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", padding: "4px 0", marginBottom: "18px", cursor: "pointer", fontFamily: sans, fontSize: "12.5px", color: sub }}
      >
        ← 이전
      </button>
      <p className="ed-label" style={{ color: acc, marginBottom: "14px" }}>골격 5 / 5 · 완료</p>
      <p style={{ fontFamily: serif, fontSize: "26px", lineHeight: 1.35, color: txt, marginBottom: "18px", wordBreak: "keep-all" }}>
        골격 결과가 나왔어요.
        <br />
        이제 어울리는 색만 남았어요.
      </p>
      <div style={{ position: "relative", border: `1px solid ${bdr}`, borderTop: `1px solid ${txt}`, backgroundColor: "var(--t-card)", padding: "18px 18px 16px", marginBottom: "14px" }}>
        <p style={{ fontFamily: sans, fontSize: "12px", color: sub, margin: "0 0 6px" }}>내 골격 타입</p>
        <p aria-hidden style={{ fontFamily: serif, fontSize: "30px", color: txt, margin: "0 0 4px", filter: "blur(9px)", userSelect: "none" }}>
          {BODY_META[body].label}
        </p>
        <p aria-hidden style={{ fontFamily: sans, fontSize: "12.5px", color: sub, margin: 0, filter: "blur(6px)", userSelect: "none" }}>
          {BODY_META[body].tagline}
        </p>
        <span style={{ position: "absolute", right: "14px", top: "16px", fontFamily: sans, fontSize: "11.5px", color: acc, border: `1px solid ${acc}`, borderRadius: "999px", padding: "3px 10px" }}>
          컬러까지 마치면 공개
        </span>
      </div>
      <p style={{ fontFamily: sans, fontSize: "13px", lineHeight: 1.7, color: sub, marginBottom: "22px", wordBreak: "keep-all" }}>
        골격(옷의 모양) × 퍼스널컬러(옷의 색)를 합쳐야 나에게 맞는 한 벌이 완성돼요. 5문항, 30초면 끝나요.
      </p>
      <button onClick={onNext} style={ctaStyle()}>
        퍼스널컬러 이어서 하기 →
      </button>
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
  bodyAns,
  colorAns,
  vars,
  onDone,
  onAsk,
}: {
  body: BodyType;
  color: ColorType;
  bodyAns: BodyAnswer[];
  colorAns: ColorAnswer[];
  vars: Record<string, string>;
  onDone: () => void;
  onAsk?: (situation: string) => void;
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

  const cardStyle: React.CSSProperties = { border: `1px solid ${bdr}`, borderTop: `1px solid ${txt}`, borderRadius: "2px", padding: "20px", marginBottom: "14px", backgroundColor: "var(--t-card)" };
  const kicker = (t: string) => (
    <p className="ed-label" style={{ color: acc, marginBottom: "10px" }}>{t}</p>
  );

  return (
    <div style={{ animation: "cardEnter 500ms cubic-bezier(0.16,1,0.3,1) both" }}>
      <p style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: serif, fontSize: "27px", lineHeight: 1.3, color: txt, marginBottom: "8px", wordBreak: "keep-all" }}>
        <GyeolMark color={acc} size={20} />
        {GYEOL.resultLead}
      </p>

      {/* 조합 페르소나 (있을 때) */}
      {cross && (
        <p style={{ fontFamily: serif, fontSize: "16px", color: acc, marginBottom: "20px", wordBreak: "keep-all" }}>
          “{bm.label} × {cm.label} — {cross.persona}”
        </p>
      )}
      {!cross && <div style={{ height: "14px" }} />}

      {/* 한눈에 요약 — 골격 + 컬러 + 답 분포 + 바로가기 */}
      <ResultSummary body={body} color={color} bodyAns={bodyAns} colorAns={colorAns} vars={vars} />

      {/* 골격 카드 + 핵심 원칙 */}
      <div id="res-body" style={{ ...cardStyle, scrollMarginTop: "16px" }}>
        {kicker("BODY · 골격")}
        <p style={{ fontFamily: serif, fontSize: "24px", fontWeight: 600, color: txt, marginBottom: "4px" }}>{bm.label} 체형</p>
        <p style={{ fontFamily: sans, fontSize: "13px", color: sub, lineHeight: 1.6, marginBottom: "10px", wordBreak: "keep-all" }}>{bm.tagline}</p>
        <div style={{ marginBottom: "18px" }}>
          <BodyForms body={body} acc={acc} txt={txt} sub={sub} bdr={bdr} />
        </div>
        <div style={{ borderLeft: `2px solid ${acc}`, paddingLeft: "12px", marginBottom: "14px" }}>
          <p style={{ fontFamily: sans, fontSize: "13px", fontWeight: 500, color: txt, lineHeight: 1.6, wordBreak: "keep-all" }}>{bg.principle}</p>
        </div>
        <ul style={{ margin: 0, paddingLeft: "16px" }}>
          {bg.characteristics.map((c, i) => (
            <li key={i} style={{ fontFamily: sans, fontSize: "12.5px", color: sub, lineHeight: 1.8, wordBreak: "keep-all" }}>{c}</li>
          ))}
        </ul>
      </div>

      {/* 비포/애프터 — 사람 사진(AI 연출), 골격 × 퍼스널컬러 12쌍이 모두 다른 모델 */}
      <BeforeAfterBoard body={body} color={color} txt={txt} sub={sub} bdr={bdr} acc={acc} />

      {/* 한눈에 — 어울리는 옷 / 피할 옷 (내 베스트 컬러를 입혀서) */}
      <div style={cardStyle}>
        {kicker("STYLING · 한눈에 보기")}
        <p style={{ fontFamily: serif, fontSize: "19px", fontWeight: 600, color: txt, margin: "0 0 14px", wordBreak: "keep-all" }}>{bm.label} 체형은 이렇게 입어요</p>
        <BodyDoDont body={body} colors={cg.bestColors.slice(0, 4).map(colorHex)} txt={txt} sub={sub} bdr={bdr} acc={acc} />
      </div>

      {/* 아이템별 가이드 (L1 핵심) — 길어서 접어 둔다 */}
      <details className="diag-more" style={cardStyle}>
        <summary style={{ listStyle: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="ed-label" style={{ color: acc }}>STYLING · 아이템별 자세한 가이드 9가지</span>
          <span className="diag-more-icon" style={{ fontFamily: sans, fontSize: "12px", color: txt }} />
        </summary>
        <div className="flex flex-col gap-3" style={{ marginTop: "14px" }}>
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
      </details>

      {/* 흔한 실수 + 코디 공식 */}
      <div style={cardStyle}>
        {kicker("TIPS")}
        <p style={{ fontFamily: sans, fontSize: "13px", fontWeight: 600, color: txt, marginBottom: "6px" }}>흔한 실수</p>
        <ul style={{ margin: "0 0 14px", paddingLeft: "16px" }}>
          {bg.mistakes.map((m, i) => (
            <li key={i} style={{ fontFamily: sans, fontSize: "12.5px", color: sub, lineHeight: 1.7, wordBreak: "keep-all" }}>{m}</li>
          ))}
        </ul>
        <p style={{ fontFamily: sans, fontSize: "13px", fontWeight: 600, color: txt, marginBottom: "4px" }}>결의 코디 공식</p>
        <p style={{ fontFamily: sans, fontSize: "11.5px", color: sub, marginBottom: "10px", wordBreak: "keep-all" }}>내 베스트 컬러로 입혀 봤어요. 옷을 누르면 W컨셉에서 비슷한 상품을 볼 수 있어요.</p>
        <FormulaBoards formulas={bg.formulas} colors={cg.bestColors.slice(0, 5).map(colorHex)} onAsk={onAsk} txt={txt} sub={sub} bdr={bdr} acc={acc} />
      </div>

      {/* 컬러 카드 (상세) */}
      <div id="res-color" style={{ ...cardStyle, marginBottom: "24px", scrollMarginTop: "16px" }}>
        {kicker("COLOR · 퍼스널컬러")}
        <p style={{ fontFamily: serif, fontSize: "24px", fontWeight: 600, color: txt, marginBottom: "4px" }}>{cm.label}</p>
        <p style={{ fontFamily: sans, fontSize: "13px", color: sub, lineHeight: 1.6, marginBottom: "16px", wordBreak: "keep-all" }}>{cg.tip}</p>
        <p style={{ fontFamily: sans, fontSize: "12.5px", fontWeight: 700, color: txt, marginBottom: "10px" }}>4계절 중 내 자리</p>
        <div style={{ marginBottom: "20px" }}>
          <SeasonMap color={color} txt={txt} sub={sub} bdr={bdr} />
        </div>
        <p style={{ fontFamily: sans, fontSize: "12.5px", fontWeight: 700, color: txt, marginBottom: "10px" }}>얼굴 가까이 두는 상의 색</p>
        <div style={{ marginBottom: "22px" }}>
          <ToneCompare goodHex={colorHex(cg.bestColors[0])} goodName={cg.bestColors[0]} badHex={colorHex(cg.worstColors[0])} badName={cg.worstColors[0]} txt={txt} sub={sub} bdr={bdr} />
        </div>
        <div style={{ marginBottom: "18px" }}>
          <SwatchBoard best={cg.bestColors} worst={cg.worstColors} hex={colorHex} txt={txt} sub={sub} />
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <MiniRow label="메탈" value={cg.metal} txt={txt} sub={sub} sans={sans} />
          <MiniRow label="메이크업" value={cg.makeup} txt={txt} sub={sub} sans={sans} />
          <MiniRow label="데님" value={cg.denim} txt={txt} sub={sub} sans={sans} />
        </div>
      </div>

      {/* 완성 코디 — 결이 큐레이션한 룩 (상품 조합) */}
      <div id="res-look" style={{ scrollMarginTop: "16px" }}>
        <CompletedLook color={color} body={body} vars={vars} />
      </div>

      {/* 지그재그 제휴 — 체형·퍼스널컬러·계절에 맞춰 직접 고른 실제 상품 (2026-11-12) */}
      <div id="res-pick" style={{ ...cardStyle, scrollMarginTop: "16px" }}>
        {kicker("PICK · 지금 입기 좋은 아이템")}
        <ZigzagPicks body={body} color={color} txt={txt} sub={sub} bdr={bdr} acc={acc} />
      </div>

      {/* 쇼핑 — W컨셉 제휴 (내 컬러로 골라보기) */}
      <div style={cardStyle}>
        {kicker("SHOP · 내 컬러로 쇼핑")}
        <p style={{ fontFamily: sans, fontSize: "13px", color: sub, lineHeight: 1.6, marginBottom: "12px", wordBreak: "keep-all" }}>
          {cm.label} 베스트 컬러를 입혀 봤어요. 옷을 누르면 W컨셉에서 그 색 상품을 둘러볼 수 있어요.
        </p>
        <ColorShop colorNames={cg.bestColors.slice(0, 6)} hex={colorHex} txt={txt} sub={sub} bdr={bdr} />
        <p style={{ fontFamily: sans, fontSize: "11px", color: sub, opacity: 0.7, lineHeight: 1.6, marginTop: "12px", wordBreak: "keep-all" }}>
          * 제휴 마케팅의 일환으로, 위 링크를 통한 구매 시 오늘핏에 일정 수수료가 적립될 수 있어요.
        </p>
      </div>

      {/* 룩북 — 핀터레스트 비주얼 레퍼런스 */}
      <Lookboard vars={vars} chips={lookboardChips(body, color)} boardUrl={CURATED_BOARDS.byBody[body] || CURATED_BOARDS.trend} />

      {cross && (
        <p style={{ fontFamily: sans, fontSize: "12.5px", color: txt, opacity: 0.85, lineHeight: 1.7, marginBottom: "18px", wordBreak: "keep-all", padding: "12px 14px", border: `1px solid ${acc}`, borderRadius: "4px", backgroundColor: "var(--t-bai)" }}>
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
          borderRadius: "4px",
          cursor: saving ? "default" : "pointer",
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? "이미지 만드는 중…" : "내 결 카드 저장 · 공유하기"}
      </button>
      <p style={{ fontFamily: sans, fontSize: "12px", color: sub, lineHeight: 1.6, textAlign: "center", margin: "0 0 14px", wordBreak: "keep-all" }}>
        스토리에 올릴 땐{" "}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("instagram_click", { where: "diagnosis_result" })}
          style={{ color: acc, fontWeight: 600, textDecoration: "none" }}
        >
          @{INSTAGRAM_HANDLE}
        </a>
        를 태그해 주세요 · 매일 코디도 올려요
      </p>

      <button onClick={onDone} style={ctaStyle()}>
        코디 받으러 가기
      </button>

      {/* 1:1 스타일 컨설팅 예약 (수익 깔때기) */}
      <div id="res-consult" style={{ scrollMarginTop: "16px" }}>
        <ConsultCTA where="diagnosis" />
      </div>

      {/* 오프스크린 9:16 스토리 카드 (캡처용) */}
      <div style={{ position: "fixed", left: "-9999px", top: 0, pointerEvents: "none" }} aria-hidden>
        <StoryCard ref={storyRef} body={body} color={color} />
      </div>
    </div>
  );
}

/* ── 결과 한눈에 요약 ──
   골격·컬러 결과를 나란히, 내 답이 어떻게 나뉘었는지 막대로.
   답이 갈렸으면(믹스 골격 / 웜쿨 반반) 1:1 컨설팅을 권한다. */
function ResultSummary({
  body,
  color,
  bodyAns,
  colorAns,
  vars,
}: {
  body: BodyType;
  color: ColorType;
  bodyAns: BodyAnswer[];
  colorAns: ColorAnswer[];
  vars: Record<string, string>;
}) {
  const txt = vars["--t-txt"];
  const sub = vars["--t-sub"];
  const acc = vars["--t-acc"];
  const bdr = vars["--t-bdr"];
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const serif = "var(--font-gowun), 'Batang', serif";
  const bm = BODY_META[body];
  const cm = COLOR_META[color];

  const tally = bodyTally(bodyAns);
  const order: BodyType[] = ["straight", "wave", "natural"];
  const runnerUp = order.filter((t) => t !== body).sort((a, b) => tally[b] - tally[a])[0];
  const bodyMixed = tally[body] - tally[runnerUp] <= 1 && tally[runnerUp] > 0;

  const warm = colorAns.filter((a) => a === "warm").length;
  const cool = colorAns.filter((a) => a === "cool").length;
  const light = colorAns.filter((a) => a === "light").length;
  const deep = colorAns.filter((a) => a === "deep").length;
  const isWarm = color === "spring" || color === "autumn";
  const isLight = color === "spring" || color === "summer";
  const cs = colorScores(colorAns);
  // 웜·쿨 가중 점수 차가 한 문항 이하이면 "섞였다"로 본다
  const colorMixed = Math.abs(cs.warm - cs.cool) < 1.05;
  const unsureN = [...bodyAns, ...colorAns].filter((a) => a === "unsure").length;

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const half: React.CSSProperties = { flex: 1, minWidth: 0, padding: "14px 14px 12px", backgroundColor: "var(--t-card)", border: `1px solid ${bdr}`, borderRadius: "4px" };
  const label: React.CSSProperties = { fontFamily: sans, fontSize: "11px", color: sub, margin: "0 0 4px" };
  const big: React.CSSProperties = { fontFamily: serif, fontSize: "21px", color: txt, margin: "0 0 4px", lineHeight: 1.3 };
  const small: React.CSSProperties = { fontFamily: sans, fontSize: "11.5px", color: sub, lineHeight: 1.5, margin: 0, wordBreak: "keep-all" };

  return (
    <div style={{ border: `2px solid ${acc}`, borderRadius: "2px", padding: "16px", marginBottom: "16px", backgroundColor: "var(--t-card)" }}>
      <p className="ed-label" style={{ color: acc, margin: "0 0 12px" }}>한눈에 보는 내 결과</p>

      {/* 골격 | 컬러 */}
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={half}>
          <p style={label}>골격</p>
          <p style={big}>{bm.label}</p>
          <p style={small}>{bm.tagline}</p>
        </div>
        <div style={half}>
          <p style={label}>퍼스널컬러</p>
          <p style={big}>{cm.label}</p>
          <div style={{ display: "flex", height: "26px", borderRadius: "3px", overflow: "hidden", margin: "6px 0 8px", border: "1px solid rgba(0,0,0,0.08)" }}>
            {cm.swatch.map((c) => (
              <span key={c} style={{ flex: 1, backgroundColor: c }} />
            ))}
          </div>
          <p style={small}>{cm.tagline}</p>
        </div>
      </div>

      {/* 답 분포 */}
      <div style={{ marginTop: "14px" }}>
        <p style={{ ...label, marginBottom: "6px" }}>내 답은 이렇게 나뉘었어요</p>
        {order.map((t) => (
          <Bar key={t} name={BODY_META[t].label} n={tally[t]} total={BODY_QUESTIONS.length} on={t === body} acc={acc} bdr={bdr} txt={txt} sub={sub} />
        ))}
        <div style={{ height: "6px" }} />
        <Bar name="웜톤" n={warm} total={3} on={isWarm} acc={acc} bdr={bdr} txt={txt} sub={sub} />
        <Bar name="쿨톤" n={cool} total={3} on={!isWarm} acc={acc} bdr={bdr} txt={txt} sub={sub} />
        <div style={{ height: "6px" }} />
        <Bar name="밝은 색" n={light} total={2} on={isLight} acc={acc} bdr={bdr} txt={txt} sub={sub} />
        <Bar name="깊은 색" n={deep} total={2} on={!isLight} acc={acc} bdr={bdr} txt={txt} sub={sub} />
        {unsureN > 0 && (
          <p style={{ fontFamily: sans, fontSize: "11px", color: sub, margin: "4px 0 0" }}>‘잘 모르겠어요’ {unsureN}개는 점수에서 뺐어요.</p>
        )}
      </div>

      {/* 답이 갈렸을 때 */}
      {(bodyMixed || colorMixed) && (
        <div style={{ marginTop: "12px", padding: "11px 12px", backgroundColor: "var(--t-card)", border: `1px dashed ${acc}`, borderRadius: "4px" }}>
          <p style={{ fontFamily: sans, fontSize: "12.5px", color: txt, lineHeight: 1.6, margin: 0, wordBreak: "keep-all" }}>
            {bodyMixed && <>골격은 <b>{BODY_META[runnerUp].label}</b> 특징도 함께 보여요. 두 타입이 섞인 경우가 흔해요. </>}
            {colorMixed && <>웜톤과 쿨톤 답이 엇갈렸어요. 조명·화장에 따라 셀프 진단은 흔들릴 수 있어요. </>}
            헷갈린다면{" "}
            <a href="/apply" onClick={() => track("consult_click", { where: "diagnosis_mixed", method: "apply" })} style={{ color: acc, fontWeight: 600 }}>
              1:1로 직접 봐드릴게요 →
            </a>
          </p>
        </div>
      )}

      {/* 바로가기 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "14px" }}>
        {[
          ["res-body", "골격 코디 가이드"],
          ["res-color", "내 컬러 팔레트"],
          ["res-look", "추천 코디"],
          ["res-consult", "1:1 컨설팅"],
        ].map(([id, t]) => (
          <button
            key={id}
            onClick={() => jump(id)}
            style={{ fontFamily: sans, fontSize: "12px", color: txt, background: "var(--t-card)", border: `1px solid ${bdr}`, borderRadius: "2px", padding: "6px 12px", cursor: "pointer" }}
          >
            {t} ↓
          </button>
        ))}
      </div>
    </div>
  );
}

function Bar({ name, n, total, on, acc, bdr, txt, sub }: { name: string; n: number; total: number; on: boolean; acc: string; bdr: string; txt: string; sub: string }) {
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const pct = total ? Math.round((n / total) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
      <span style={{ width: "54px", flexShrink: 0, fontFamily: sans, fontSize: "12px", color: on ? txt : sub, fontWeight: on ? 600 : 400 }}>{name}</span>
      <span style={{ flex: 1, height: "8px", borderRadius: 0, backgroundColor: bdr, overflow: "hidden" }}>
        <span style={{ display: "block", width: `${pct}%`, height: "100%", backgroundColor: acc, opacity: on ? 1 : 0.45, borderRadius: 0 }} />
      </span>
      <span style={{ width: "28px", textAlign: "right", fontFamily: sans, fontSize: "11.5px", color: sub }}>{n}/{total}</span>
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

function ctaStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: "16px",
    fontFamily: "var(--font-noto-sans), sans-serif",
    minHeight: "58px",
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "-0.025em",
    color: "var(--t-txt, #1D1F16)",
    backgroundColor: "var(--t-fill, #BFC266)",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
  };
}
