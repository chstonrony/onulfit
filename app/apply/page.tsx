"use client";

import { useState } from "react";
import { WEB3FORMS_KEY, IS_APPLY_READY } from "@/lib/consult";

/* ── 1:1 진단 컨설팅 신청 페이지 ──
   인스타 bio 링크 → 이 페이지. 제출은 Web3Forms로 운영자 이메일에 도착.
   NEXT_PUBLIC_WEB3FORMS_KEY 가 없으면 "준비 중" 안내만 노출(빈 전송 방지). */

const ACCENT = "#8A7C6E";
const POINT = "#6B5F55";
const INK = "#2C2825";
const SUB = "#7A7168";
const BDR = "#E5E1DA";
const CARD = "#FFFFFF";
const SOFT = "#F0ECE6";

const serif = "var(--font-cormorant), Georgia, serif";
const gowun = "var(--font-gowun), 'Batang', serif";
const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

const CONCERNS = [
  "퍼스널컬러를 모르겠다",
  "내 체형에 뭐가 맞는지 모르겠다",
  "옷은 있는데 코디를 못 하겠다",
  "쇼핑 실패가 잦다",
];

export default function ApplyPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("botcheck")) return; // 허니팟

    const concerns = fd.getAll("concern").join(", ");
    const payload = {
      access_key: WEB3FORMS_KEY,
      subject: `[오늘핏 신청] ${fd.get("name") || "이름없음"}`,
      from_name: "오늘핏 신청 폼",
      성함: fd.get("name"),
      연락처: fd.get("contact"),
      나이대: fd.get("age"),
      거주지역: fd.get("region"),
      인스타: fd.get("instagram"),
      고민: concerns,
      원하는변화: fd.get("change"),
      가능한일정: fd.get("schedule"),
      "사진·후기 동의": fd.get("consent"),
      하고싶은말: fd.get("message"),
    };

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setStatus(data.success ? "done" : "error");
      if (data.success) window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <main style={{ minHeight: "100%", padding: "40px 18px 70px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <a href="/" style={{ fontFamily: serif, fontStyle: "italic", fontSize: "13px", color: SUB, textDecoration: "none" }}>
          ← onulfit
        </a>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "14px", letterSpacing: "0.04em", color: ACCENT, margin: "14px 0 4px" }}>
          1:1 Consulting
        </p>
        <h1 style={{ fontFamily: gowun, fontSize: "30px", fontWeight: 400, lineHeight: 1.35, color: INK, margin: 0, wordBreak: "keep-all" }}>
          오늘핏 스타일 컨설팅 신청
        </h1>
        <p style={{ fontFamily: sans, fontSize: "14px", lineHeight: 1.8, color: SUB, margin: "12px 0 0", wordBreak: "keep-all" }}>
          퍼스널컬러와 체형을 1:1로 진단하고, 당신만의 코디로 번역해 드려요.
          7월, 포트폴리오 멤버를 먼저 모십니다(사진·후기 동의 시 특가).
        </p>
        <div style={{ height: "2px", width: "46px", background: ACCENT, margin: "18px 0 0" }} />

        {!IS_APPLY_READY ? (
          <div style={{ marginTop: "28px", padding: "26px 22px", background: CARD, border: `1px solid ${BDR}`, borderRadius: "16px", fontFamily: sans, fontSize: "14px", lineHeight: 1.8, color: SUB, wordBreak: "keep-all" }}>
            신청 폼을 준비 중이에요. 곧 오픈합니다 🤍
          </div>
        ) : status === "done" ? (
          <div style={{ marginTop: "28px", padding: "30px 24px", background: CARD, border: `1px solid ${ACCENT}`, borderRadius: "16px", textAlign: "center" }}>
            <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "26px", color: ACCENT, margin: 0 }}>Thank you</p>
            <p style={{ fontFamily: gowun, fontSize: "19px", color: INK, margin: "10px 0 8px", lineHeight: 1.5 }}>신청이 접수됐어요</p>
            <p style={{ fontFamily: sans, fontSize: "14px", color: SUB, lineHeight: 1.8, margin: 0, wordBreak: "keep-all" }}>
              빠른 시일 내에 적어주신 연락처로 일정과 장소를 안내드릴게요.<br />당신의 결을 함께 찾는 시간, 곧 만나요.
            </p>
            <a href="/" style={{ display: "inline-block", marginTop: "20px", fontFamily: sans, fontSize: "13px", color: ACCENT, textDecoration: "none" }}>
              홈으로 돌아가기 →
            </a>
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ marginTop: "26px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <input type="checkbox" name="botcheck" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

            <Field label="성함" required>
              <input name="name" required style={inputStyle} />
            </Field>
            <Field label="연락처 (카톡 ID 또는 전화번호)" required>
              <input name="contact" required style={inputStyle} />
            </Field>
            <Field label="나이대">
              <select name="age" defaultValue="" style={inputStyle}>
                <option value="" disabled>선택해주세요</option>
                <option>20대</option><option>30대</option><option>40대</option><option>50대 이상</option>
              </select>
            </Field>
            <Field label="거주 지역 (세션 장소 안내용)">
              <input name="region" placeholder="예) 서울 마포구" style={inputStyle} />
            </Field>
            <Field label="인스타 아이디 (선택)">
              <input name="instagram" placeholder="@" style={inputStyle} />
            </Field>

            <Field label="가장 큰 고민은? (복수 선택 가능)">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                {CONCERNS.map((c) => (
                  <label key={c} style={chipLabel}>
                    <input type="checkbox" name="concern" value={c} style={{ accentColor: ACCENT }} /> {c}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="원하는 변화를 한 줄로 적어주세요">
              <textarea name="change" rows={2} style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "vertical", lineHeight: 1.6 }} />
            </Field>
            <Field label="가능한 날짜·시간대">
              <input name="schedule" placeholder="예) 평일 오전, 주말 오후" style={inputStyle} />
            </Field>

            <Field label="포트폴리오 사진·후기 게시에 동의하시나요? (모델 모집 조건)" required>
              <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                <label style={chipLabel}><input type="radio" name="consent" value="예" required style={{ accentColor: ACCENT }} /> 예</label>
                <label style={chipLabel}><input type="radio" name="consent" value="아니오" style={{ accentColor: ACCENT }} /> 아니오</label>
              </div>
            </Field>

            <Field label="하고 싶은 말 (선택)">
              <textarea name="message" rows={3} style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "vertical", lineHeight: 1.6 }} />
            </Field>

            {status === "error" && (
              <p style={{ fontFamily: sans, fontSize: "13px", color: "#C2502F", margin: 0 }}>
                전송에 실패했어요. 잠시 후 다시 시도해주세요.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                height: "52px", borderRadius: "13px", border: "none",
                background: status === "sending" ? POINT : ACCENT, color: "#FAF8F6",
                fontFamily: sans, fontWeight: 600, fontSize: "15px", letterSpacing: "0.02em",
                cursor: status === "sending" ? "default" : "pointer",
              }}
            >
              {status === "sending" ? "보내는 중…" : "신청서 보내기"}
            </button>
            <p style={{ fontFamily: sans, fontSize: "11.5px", color: SUB, textAlign: "center", margin: 0, lineHeight: 1.7 }}>
              제출하신 정보는 컨설팅 안내 목적으로만 사용돼요.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontFamily: sans, fontSize: "13px", fontWeight: 500, color: INK, marginBottom: "7px", wordBreak: "keep-all" }}>
        {label}{required && <span style={{ color: ACCENT }}> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", height: "46px", padding: "0 14px",
  background: SOFT, border: `1px solid ${BDR}`, borderRadius: "11px",
  fontFamily: sans, fontSize: "14px", color: INK, outline: "none",
};

const chipLabel: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "6px",
  fontFamily: sans, fontSize: "13.5px", color: INK,
  background: CARD, border: `1px solid ${BDR}`, borderRadius: "999px",
  padding: "8px 14px", cursor: "pointer",
};
