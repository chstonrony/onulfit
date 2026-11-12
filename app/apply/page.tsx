"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { track } from "@/lib/track";
import Link from "next/link";
import { WEB3FORMS_KEY, IS_APPLY_READY, CONSULT_INFO, PRIVACY, PRIVACY_VERSION } from "@/lib/consult";
import { Wordmark } from "@/components/Editorial";

/* ── 1:1 진단 컨설팅 신청 페이지 ──
   인스타 bio 링크 → 이 페이지. 제출은 Web3Forms로 운영자 이메일에 도착.
   NEXT_PUBLIC_WEB3FORMS_KEY 가 없으면 "준비 중" 안내만 노출(빈 전송 방지). */

const ACCENT = "#5A6122";
const INK = "#1D1F16";
const SUB = "#65665A";
const BDR = "#D6D3C3";
const CARD = "#F6F5EE";
const SOFT = "#F6F5EE";

const serif = "var(--font-cormorant), Georgia, serif";
const gowun = "var(--font-gowun), 'Batang', serif";
const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

const STEPS = [
  ["신청서 작성", "아래 신청서를 보내주세요."],
  ["연락 드림", "적어주신 연락처로 일정·비용을 안내드려요."],
  ["일정·장소 확정", "가능한 날짜를 맞추고, 상세 위치를 알려드려요."],
  ["1:1 컨설팅", "직접 만나 체형(골격)과 어울리는 색을 함께 봐요."],
  ["결과 가이드", "나에게 맞는 색·핏·코디 방향을 정리해 드려요."],
];

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
      전화번호: fd.get("phone"),
      // Web3Forms는 email 값을 답장 주소로 쓴다
      email: fd.get("email"),
      나이대: fd.get("age"),
      거주지역: fd.get("region"),
      인스타: fd.get("instagram"),
      고민: concerns,
      원하는변화: fd.get("change"),
      가능한일정: fd.get("schedule"),
      "사진·후기 동의": fd.get("consent"),
      "개인정보 수집·이용 동의": fd.get("privacy") ? `동의 (안내문 ${PRIVACY_VERSION})` : "미동의",
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
      if (data.success) {
        // GA4 추천 이벤트 — 애널리틱스 관리 > 주요 이벤트에서 표시하면 전환으로 집계된다.
        // 이름·연락처 같은 개인정보는 보내지 않는다(나이대만).
        track("generate_lead", {
          form_name: "onulfit_apply",
          age_group: String(fd.get("age") || "미선택"),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <main style={{ minHeight: "100%", padding: "16px 20px 72px", display: "flex", justifyContent: "center", ["--t-acc" as string]: ACCENT, ["--t-txt" as string]: INK }}>
      <div style={{ width: "100%", maxWidth: "720px" }}>
        <SiteHeader style={{ marginBottom: "18px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span className="ed-label" style={{ color: ACCENT }}>1:1 Consulting</span>
          <span className="ed-label" style={{ color: SUB }}>Body · Color · Fit</span>
        </div>
        <Wordmark text="1:1 Styling" size={23} />
        <div style={{ height: "1px", background: INK, margin: "14px 0 22px" }} />
        <h1 style={{ fontFamily: sans, fontSize: "clamp(29px, 8vw, 38px)", fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 1.15, color: INK, margin: 0, wordBreak: "keep-all" }}>
          오늘핏 스타일 컨설팅 신청
        </h1>
        <p style={{ fontFamily: sans, fontSize: "15px", fontWeight: 500, lineHeight: 1.75, color: SUB, margin: "12px 0 0", wordBreak: "keep-all" }}>
          체형과 어울리는 색을 1:1로 함께 보고, 당신만의 코디로 번역해 드려요.
          지금은 포트폴리오 멤버를 먼저 모시고 있어요(사진·후기 동의 시 할인).
        </p>

        {/* ── 시범 운영 안내 ── */}
        <section style={{ marginTop: "26px", padding: "18px 18px 6px", background: CARD, border: `1px solid ${BDR}`, borderTop: `1px solid ${INK}`, borderRadius: "2px" }}>
          <p className="ed-label" style={{ color: ACCENT, margin: 0 }}>Pilot · 시범 운영 중</p>
          <p style={{ fontFamily: sans, fontSize: "17px", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.45, color: INK, margin: "8px 0 14px", wordBreak: "keep-all" }}>
            내년 정식 오픈 전, 사례를 함께 만들어 갈 분을 모시고 있어요.
          </p>
          <dl style={{ margin: 0 }}>
            {[
              ["장소", CONSULT_INFO.place],
              ["비용", `${CONSULT_INFO.fee} ${CONSULT_INFO.feeNote}`],
              ["방식", "1:1 대면 스타일 컨설팅 · 체형(골격) + 어울리는 색"],
              ["변경·취소", CONSULT_INFO.cancel],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "10px", padding: "11px 0", borderTop: `1px solid ${BDR}` }}>
                <dt style={{ fontFamily: sans, fontSize: "13px", fontWeight: 700, color: INK }}>{k}</dt>
                <dd style={{ margin: 0, fontFamily: sans, fontSize: "13.5px", lineHeight: 1.65, color: SUB, wordBreak: "keep-all" }}>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── 진행 순서 ── */}
        <section style={{ marginTop: "28px" }}>
          <p style={{ display: "flex", alignItems: "baseline", gap: "10px", margin: "0 0 10px" }}>
            <span className="ed-accent" style={{ fontSize: "24px", lineHeight: 1, color: ACCENT }}>How</span>
            <span style={{ fontFamily: sans, fontSize: "17px", fontWeight: 800, letterSpacing: "-0.035em", color: INK }}>진행 순서</span>
          </p>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, borderTop: `1px solid ${INK}` }}>
            {STEPS.map(([t, d], i) => (
              <li key={t} style={{ display: "grid", gridTemplateColumns: "34px 1fr", padding: "12px 0", borderBottom: `1px solid ${BDR}` }}>
                <span style={{ fontFamily: "var(--font-grotesk), sans-serif", fontWeight: 800, fontSize: "12px", color: ACCENT, paddingTop: "3px" }}>{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span style={{ display: "block", fontFamily: sans, fontSize: "15px", fontWeight: 700, letterSpacing: "-0.025em", color: INK }}>{t}</span>
                  <span style={{ display: "block", fontFamily: sans, fontSize: "13px", lineHeight: 1.6, color: SUB, wordBreak: "keep-all" }}>{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div style={{ height: "1px", background: INK, margin: "30px 0 0" }} />
        <p style={{ fontFamily: sans, fontSize: "17px", fontWeight: 800, letterSpacing: "-0.035em", color: INK, margin: "18px 0 0" }}>신청서</p>

        {!IS_APPLY_READY ? (
          <div style={{ marginTop: "28px", padding: "26px 22px", background: CARD, border: `1px solid ${BDR}`, borderRadius: "4px", fontFamily: sans, fontSize: "14px", lineHeight: 1.8, color: SUB, wordBreak: "keep-all" }}>
            신청 폼을 준비 중이에요. 곧 오픈합니다 🤍
          </div>
        ) : status === "done" ? (
          <div style={{ marginTop: "28px", padding: "30px 24px", background: CARD, border: `1px solid ${ACCENT}`, borderRadius: "4px", textAlign: "center" }}>
            <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "44px", lineHeight: 1, color: ACCENT, margin: 0 }}>Thank you</p>
            <p style={{ fontFamily: gowun, fontSize: "24px", color: INK, margin: "12px 0 8px", lineHeight: 1.4 }}>신청이 접수됐어요</p>
            <p style={{ fontFamily: sans, fontSize: "14px", color: SUB, lineHeight: 1.8, margin: 0, wordBreak: "keep-all" }}>
              빠른 시일 내에 적어주신 연락처로 일정·장소·비용을 안내드릴게요.<br />당신의 결을 함께 찾는 시간, 곧 만나요.
            </p>
            <Link href="/" className="ed-link" style={{ display: "inline-block", marginTop: "20px", fontFamily: sans, fontSize: "14px", fontWeight: 700, color: ACCENT }}>
              홈으로 돌아가기 →
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <input type="checkbox" name="botcheck" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

            <Field label="성함" required>
              <input name="name" required style={inputStyle} />
            </Field>
            <Field label="전화번호" required>
              <input
                name="phone" type="tel" inputMode="tel" autoComplete="tel" required
                placeholder="010-0000-0000"
                pattern="01[016789](-| )?[0-9]{3,4}(-| )?[0-9]{4}"
                title="휴대폰 번호를 010-0000-0000처럼 적어 주세요"
                style={inputStyle}
              />
            </Field>
            <Field label="이메일 주소" required>
              <input
                name="email" type="email" inputMode="email" autoComplete="email" required
                placeholder="example@naver.com"
                style={inputStyle}
              />
            </Field>
            {/* 연락처 확인 안내 — 2026-11-12 사용자 요청(번호를 잘못 적은 신청이 있었음) */}
            <p style={{ margin: "-8px 0 0", padding: "12px 14px", background: CARD, borderLeft: `3px solid ${ACCENT}`, fontFamily: sans, fontSize: "13.5px", fontWeight: 600, color: INK, lineHeight: 1.7, letterSpacing: "-0.02em", wordBreak: "keep-all" }}>
              전화번호와 이메일 주소를 <span style={{ color: ACCENT }}>한 번 더 확인</span>해 주세요.<br />
              잘못 적으시면 일정·장소 안내를 드릴 수 없어요.
            </p>
            <Field label="나이대">
              <select name="age" defaultValue="" style={inputStyle}>
                <option value="" disabled>선택해주세요</option>
                <option>20대</option><option>30대</option><option>40대</option><option>50대 이상</option>
              </select>
            </Field>
            <Field label="거주 지역 (세션 장소 안내용)">
              <input name="region" placeholder="예) 남양주 다산동, 구리시" style={inputStyle} />
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

            <Field label="포트폴리오 사진·후기 게시에 동의하시나요? (동의 시 할인)" required>
              <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                <label style={chipLabel}><input type="radio" name="consent" value="예" required style={{ accentColor: ACCENT }} /> 예</label>
                <label style={chipLabel}><input type="radio" name="consent" value="아니오" style={{ accentColor: ACCENT }} /> 아니오</label>
              </div>
            </Field>

            <Field label="하고 싶은 말 (선택)">
              <textarea name="message" rows={3} style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "vertical", lineHeight: 1.6 }} />
            </Field>

            {/* ── 개인정보 수집·이용 동의 (필수) ── */}
            <div style={{ border: `1px solid ${INK}`, borderRadius: "2px", background: CARD }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "14px 14px 12px", cursor: "pointer" }}>
                <input type="checkbox" name="privacy" value="동의" required style={{ accentColor: ACCENT, width: "18px", height: "18px", marginTop: "2px", flexShrink: 0 }} />
                <span style={{ fontFamily: sans, fontSize: "14.5px", fontWeight: 700, letterSpacing: "-0.025em", color: INK, lineHeight: 1.5 }}>
                  <span style={{ color: ACCENT }}>[필수]</span> 개인정보 수집·이용에 동의합니다
                </span>
              </label>
              <dl style={{ margin: 0, padding: "0 14px 12px" }}>
                {[
                  ["수집 항목", PRIVACY.items],
                  ["이용 목적", PRIVACY.purpose],
                  ["보유 기간", PRIVACY.retention],
                  ["전달 방식", PRIVACY.processor],
                  ["거부 권리", PRIVACY.refuse],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: "8px", padding: "7px 0", borderTop: `1px solid ${BDR}` }}>
                    <dt style={{ fontFamily: sans, fontSize: "12px", fontWeight: 700, color: INK }}>{k}</dt>
                    <dd style={{ margin: 0, fontFamily: sans, fontSize: "12px", lineHeight: 1.6, color: SUB, wordBreak: "keep-all" }}>{v}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/privacy" target="_blank" className="ed-link" style={{ display: "inline-block", margin: "0 14px 14px", fontFamily: sans, fontSize: "12.5px", fontWeight: 700, color: ACCENT }}>
                개인정보처리방침 전문 보기 →
              </Link>
            </div>

            {status === "error" && (
              <p style={{ fontFamily: sans, fontSize: "13px", color: "#C2502F", margin: 0 }}>
                전송에 실패했어요. 잠시 후 다시 시도해주세요.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                height: "60px", borderRadius: "2px", border: "none",
                background: status === "sending" ? "#A9AE4A" : "#BFC266", color: INK,
                fontFamily: sans, fontWeight: 700, fontSize: "16px", letterSpacing: "-0.025em",
                cursor: status === "sending" ? "default" : "pointer",
              }}
            >
              {status === "sending" ? "보내는 중…" : "신청서 보내기"}
            </button>
            <p style={{ fontFamily: sans, fontSize: "11.5px", color: SUB, textAlign: "center", margin: 0, lineHeight: 1.7 }}>
              제출하신 정보는 컨설팅 안내 목적으로만 사용하고, 다른 곳에 제공하지 않아요.
            </p>
          </form>
        )}
        <SiteFooter />
      </div>
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontFamily: sans, fontSize: "14px", fontWeight: 700, letterSpacing: "-0.025em", color: INK, marginBottom: "8px", wordBreak: "keep-all" }}>
        {label}{required && <span style={{ color: ACCENT }}> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", height: "50px", padding: "0 14px",
  background: SOFT, border: `1px solid ${BDR}`, borderBottom: `1.5px solid ${INK}`, borderRadius: "2px",
  fontFamily: sans, fontSize: "15px", color: INK, outline: "none",
};

const chipLabel: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "6px",
  fontFamily: sans, fontSize: "13.5px", color: INK,
  background: CARD, border: `1px solid ${INK}`, borderRadius: "2px",
  padding: "8px 14px", cursor: "pointer",
};
