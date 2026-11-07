"use client";

import { useEffect, useRef, useState } from "react";
import s from "./CorridorHero.module.css";

/* ── 메인 첫 화면: 어두운 올리브 문 복도 → 끝 문이 반쯤 열리고, 흰 셔츠가 보일 듯 말 듯 ──
   8초 타임라인 (시댄스 영상 콘셉트 시트와 같은 순서)
   0–4.9s 복도를 따라 전진 · 4.6–6.6s 끝 문이 46%까지 올라감 · 이후 셔츠가 살짝 흔들리다 멈춤
   0.3s 첫 문구 등장 → 4.3s 사라짐 → 6.3s 마지막 문구 등장
   - videoSrc 를 주면 3D 장면 대신 영상을 깔고, 문구는 영상 재생 시간에 맞춰 바뀐다.
   - 움직임 줄이기 설정 · 느린 연결 · 2.5초 안에 재생이 안 되면 마지막 장면을 바로 보여 준다.
   - 첫 문구와 버튼은 영상을 기다리지 않고 처음부터 보인다. */

const CAM_END = 2100;
const T_END = 11; // 셔츠 흔들림이 잦아들 때까지
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const inout = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const dolly = (p: number) => 0.45 * p + 0.55 * (1 - Math.pow(1 - p, 2.2));
const sway = (t: number) => {
  const u = t - 5.4;
  return u <= 0 ? 0 : 2.6 * Math.exp(-0.6 * u) * Math.sin(2 * Math.PI * 0.55 * u);
};

export default function CorridorHero({
  onStart,
  videoSrc,
  posterSrc,
  endSrc,
}: {
  onStart: () => void;
  videoSrc?: string;
  /** 영상 첫 장면 (불러오는 동안) */
  posterSrc?: string;
  /** 영상 마지막 장면 (움직임 줄이기 · 자동재생이 막혔을 때) */
  endSrc?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    const st = stageRef.current;
    if (!st) return;
    let raf = 0;
    let ended = false;
    const at = (t: number) => {
      if (worldRef.current) {
        worldRef.current.style.transform = `translateZ(${(CAM_END * dolly(seg(t, 0, 4.9))).toFixed(1)}px)`;
      }
      st.style.setProperty("--o", inout(seg(t, 4.6, 6.6)).toFixed(4));
      st.style.setProperty("--x", (1 - seg(t, 4.3, 5)).toFixed(4));
      st.style.setProperty("--b", inout(seg(t, 6.3, 7.2)).toFixed(4));
      st.style.setProperty("--s", `${sway(t).toFixed(3)}deg`);
      if (!ended && t >= 6.3) {
        ended = true;
        setEnding(true);
      }
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const video = videoRef.current;

    if (videoSrc && video) {
      // 마지막 장면에서 멈춘 상태로 보여 주기 (움직임 줄이기 · 자동재생 막힘 · 영상 오류)
      const showEnd = () => {
        cancelAnimationFrame(raf);
        video.pause();
        if (endSrc) video.poster = endSrc;
        if (video.readyState < 2) {
          // 아직 못 받은 영상은 받기를 멈춘다 (느린 데이터를 붙잡지 않게)
          video.removeAttribute("src");
          video.load();
        } else if (video.duration) {
          video.currentTime = Math.max(0, video.duration - 0.05);
        }
        at(T_END);
      };
      // 느린 연결·데이터 절약 모드면 영상 없이 마지막 장면만
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      const slowNet = !!conn && (conn.saveData === true || /(^|-)2g|3g/.test(conn.effectiveType ?? ""));
      if (reduced || slowNet) {
        showEnd();
        return;
      }
      // 영상 재생 시간에 맞춰 문구만 바꿈 (영상 길이를 8초 타임라인으로 환산)
      const tick = () => {
        const d = video.duration || 8;
        at((video.currentTime / d) * 8);
        if (!video.ended) raf = requestAnimationFrame(tick);
        else at(T_END);
      };
      raf = requestAnimationFrame(tick);
      video.play().catch(showEnd);
      // 2.5초 안에 영상이 움직이지 않으면(버퍼링) 기다리지 않고 마지막 장면으로
      const guard = window.setTimeout(() => {
        if (video.currentTime < 0.05) showEnd();
      }, 2500);
      video.addEventListener("error", showEnd);
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(guard);
        video.removeEventListener("error", showEnd);
      };
    }

    if (reduced) {
      at(T_END);
      return;
    }

    const t0 = performance.now();
    const step = (now: number) => {
      const t = (now - t0) / 1000;
      at(t);
      if (t < T_END) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [videoSrc, endSrc]);

  return (
    <section ref={stageRef} className={s.stage} aria-label="오늘핏 — 오늘 뭐 입지?">
      {videoSrc ? (
        <video ref={videoRef} className={s.video} src={videoSrc} poster={posterSrc} muted playsInline preload="none" disablePictureInPicture aria-hidden />
      ) : (
        <div ref={worldRef} className={s.world} aria-hidden>
          <div className={s.ceil} />
          <div className={s.floor}><div className={`${s.n} ${s.noise}`} /></div>
          <div className={s.spill} />
          <div className={`${s.wall} ${s.wallL}`}><div className={`${s.n} ${s.noise}`} /></div>
          <div className={`${s.wall} ${s.wallR}`}><div className={`${s.n} ${s.noise}`} /></div>
          <div className={s.end}>
            <div className={s.frame}>
              <div className={s.inside}>
                <svg viewBox="0 0 230 300">
                  <defs>
                    <linearGradient id="chShirtBody" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#CFCCBE" />
                      <stop offset=".45" stopColor="#FFFFFF" />
                      <stop offset="1" stopColor="#D8D5C8" />
                    </linearGradient>
                    <linearGradient id="chShirtSleeve" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#F2F1EA" />
                      <stop offset="1" stopColor="#BDB9A9" />
                    </linearGradient>
                  </defs>
                  {/* 행거 봉 */}
                  <rect x="0" y="40" width="230" height="5" fill="#2a1a13" opacity=".85" />
                  {/* 화이트 셔츠 — 옷걸이 고리를 축으로 살짝 흔들림 */}
                  <g className={s.sway}>
                    <g className={s.shirt}>
                      <path d="M115 45 q0-9 7-9 q5 0 5 5" fill="none" stroke="#1e1d16" strokeWidth="2.6" />
                      <path d="M115 45 L86 64 L144 64 Z" fill="none" stroke="#1e1d16" strokeWidth="2" />
                      <path d="M84 66 L64 78 L56 176 L70 178 L80 112 Z M146 66 L166 78 L174 176 L160 178 L150 112 Z" fill="url(#chShirtSleeve)" />
                      <path d="M100 60 L84 66 L80 112 L82 206 Q115 218 148 206 L150 112 L146 66 L130 60 Q115 68 100 60 Z" fill="url(#chShirtBody)" />
                      <path d="M100 60 L106 80 L115 70 L124 80 L130 60" fill="#FFFFFF" stroke="#9c9884" strokeWidth="1.1" />
                      <path d="M115 70 V212" stroke="#aaa692" strokeWidth="1.2" />
                      <g fill="#8f8b77">
                        <circle cx="118" cy="96" r="1.6" />
                        <circle cx="118" cy="122" r="1.6" />
                        <circle cx="118" cy="148" r="1.6" />
                        <circle cx="118" cy="174" r="1.6" />
                      </g>
                      <path d="M92 96 Q97 150 93 206 M138 96 Q133 150 137 206" stroke="#c4c0b0" strokeWidth="2" fill="none" opacity=".8" />
                    </g>
                  </g>
                </svg>
              </div>
              <div className={s.roll}><div className={`${s.n} ${s.noise}`} /></div>
            </div>
          </div>
        </div>
      )}

      {!videoSrc && <div className={s.bloom} aria-hidden />}
      <div className={s.vignette} aria-hidden />
      <div className={s.grain} aria-hidden />
      <div className={s.veil} aria-hidden />

      <div className={`${s.copy} ${s.A} ${ending ? s.off : ""}`} aria-hidden={ending}>
        <p className={`${s.eyebrow} ${s.ko}`}>20대 후반 여성을 위한 AI 코디</p>
        <h1 className={s.title}>오늘{" "}<br />뭐 입지?</h1>
        <p className={s.lead}>수많은 문 앞에서 고민될 때.</p>
        <button type="button" className={s.pill} onClick={onStart} tabIndex={ending ? -1 : 0}>
          무료 자가진단 <i aria-hidden>→</i>
        </button>
      </div>

      <div className={`${s.copy} ${s.B} ${ending ? "" : s.off}`} aria-hidden={!ending}>
        <p className={`${s.eyebrow} ${s.ko}`}>20대 후반 여성을 위한 AI 코디</p>
        <h2 className={s.title}>그 답은,{" "}<br />오늘핏.</h2>
        <p className={s.lead}>문 너머, 나에게 맞는 한 벌. 1분이면 열려요.</p>
        <button type="button" className={s.pill} onClick={onStart} tabIndex={ending ? 0 : -1}>
          내 한 벌 찾기 <i aria-hidden>→</i>
        </button>
        <small className={s.note}>무료 자가진단 · 사진 없이 1분</small>
      </div>
    </section>
  );
}
