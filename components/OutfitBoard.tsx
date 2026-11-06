"use client";

/* 오늘의 코디 보드 — 핀터레스트 무드보드처럼 옷 사진을 종이 위에 툭 겹쳐 놓고, 검정 라벨 테이프로 이름을 붙인다.
   · 옷 사진: GarmentPhoto(실사 누끼 59종 + 추천 색·무늬), 코디가 바뀔 때마다 자동으로 다시 짜인다
   · 360×470 기준으로 그리고, 화면 폭에 맞춰 통째로 확대·축소한다 */

import { useEffect, useRef, useState } from "react";
import { OutfitRecommendation, ClothingItem } from "@/lib/types";
import { getColorHex, getLineColorHex } from "@/lib/colors";
import { GarmentPhoto, garmentKind, garmentPattern } from "./GarmentArt";

const W = 360, H = 470;
type Cat = "outer" | "top" | "bottom" | "shoes" | "accessory";

/* 자리(아래에 깔리는 것부터) — x·y·w·h = 사진이 들어갈 칸, r = 기울기 */
const SLOTS: { cat: Cat; x: number; y: number; w: number; h: number; r: number }[] = [
  { cat: "outer", x: 8, y: 70, w: 172, h: 228, r: -5 },
  { cat: "top", x: 116, y: 88, w: 150, h: 165, r: 4 },
  { cat: "bottom", x: 248, y: 66, w: 102, h: 238, r: 3 },
  { cat: "shoes", x: 20, y: 300, w: 152, h: 112, r: -3 },
  { cat: "accessory", x: 192, y: 312, w: 100, h: 92, r: 6 },
];
/* 라벨 테이프 자리 */
const TAGS: Record<Cat, React.CSSProperties> = {
  outer: { left: 12, top: 250, transform: "rotate(-3deg)" },
  top: { left: 150, top: 230, transform: "rotate(2deg)" },
  bottom: { right: 10, top: 304, transform: "rotate(3deg)" },
  shoes: { left: 22, top: 412, transform: "rotate(-2deg)" },
  accessory: { right: 16, top: 400, transform: "rotate(2deg)" },
};

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const short = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

export default function OutfitBoard({ outfit }: { outfit: OutfitRecommendation }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [date, setDate] = useState("");

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    const d = new Date();
    setDate(`${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${DAYS[d.getDay()]}`);
    return () => ro.disconnect();
  }, []);

  const items = outfit.items as Record<Cat, ClothingItem>;
  const mono = "var(--font-label-mono), ui-monospace, monospace";
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

  return (
    <div ref={box} style={{ width: "100%", maxWidth: 440, margin: "0 auto", height: H * scale }}>
      <div
        className="outfit-board"
        role="img"
        aria-label={`오늘의 코디 보드: ${SLOTS.map((s) => items[s.cat]?.name).filter(Boolean).join(", ")}`}
        style={{
          position: "relative", width: W, height: H, transform: `scale(${scale})`, transformOrigin: "0 0",
          background: "#F4EFE7", borderRadius: 3, overflow: "hidden",
          boxShadow: "0 18px 40px -18px rgba(60,40,20,.35)", color: "#191614",
        }}
      >
        {/* 머리 */}
        <div style={{ position: "absolute", left: 20, top: 16, font: "600 30px/1 var(--font-board-title), sans-serif", letterSpacing: "-0.055em" }}>onulfit</div>
        <div style={{ position: "absolute", right: 18, top: 24, font: `700 9.5px/1 ${mono}`, letterSpacing: "0.1em" }}>{date}</div>
        <div style={{ position: "absolute", left: 20, top: 54, right: 20, font: `500 10px/1.2 ${mono}`, letterSpacing: "0.04em", color: "#7a6f64", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {"// "}{short(outfit.situation, 28)}
        </div>

        {/* 옷 사진 */}
        {SLOTS.map((s, i) => {
          const it = items[s.cat];
          if (!it) return null;
          const text = `${it.name} ${it.color} ${it.searchKeyword}`;
          return (
            <div
              key={s.cat}
              style={{
                position: "absolute", left: s.x, top: s.y, width: s.w, height: s.h, zIndex: i + 1,
                display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${s.r}deg)`,
              }}
            >
              <div className="card-enter" style={{ animationDelay: `${i * 90}ms`, filter: "drop-shadow(0 10px 12px rgba(50,35,20,.22)) drop-shadow(0 2px 2px rgba(50,35,20,.18))" }}>
                <GarmentPhoto kind={garmentKind(s.cat, text)} hex={getColorHex(it.color)} pattern={garmentPattern(text)} lineHex={getLineColorHex(it.color)} width={s.w} height={s.h} />
              </div>
            </div>
          );
        })}

        {/* 마스킹 테이프 */}
        <span style={{ position: "absolute", left: 66, top: 66, width: 58, height: 17, background: "rgba(232,220,196,.82)", transform: "rotate(-14deg)", zIndex: 9 }} />
        <span style={{ position: "absolute", left: 270, top: 60, width: 58, height: 17, background: "rgba(232,220,196,.82)", transform: "rotate(9deg)", zIndex: 9 }} />

        {/* 라벨 테이프 */}
        {SLOTS.map((s) => {
          const it = items[s.cat];
          if (!it) return null;
          const kind = garmentKind(s.cat, `${it.name} ${it.color} ${it.searchKeyword}`);
          return (
            <div
              key={`t-${s.cat}`}
              style={{
                position: "absolute", zIndex: 10, ...TAGS[s.cat], maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                background: "#191614", color: "#F4EFE7", padding: "5px 8px 4px", borderRadius: 2, boxShadow: "0 2px 3px rgba(0,0,0,.25)",
                font: `700 11px/1 ${sans}`, letterSpacing: "0.03em",
              }}
            >
              {short(it.name, 13)}
              <span style={{ font: `500 9px/1 ${mono}`, opacity: 0.6, marginLeft: 6, letterSpacing: "0.04em" }}>{kind.replace(/_/g, " ")}</span>
            </div>
          );
        })}

        {/* 오늘의 색 */}
        <div style={{ position: "absolute", left: 20, bottom: 16, display: "flex", gap: 5, zIndex: 10 }}>
          {SLOTS.map((s) => items[s.cat] && (
            <span key={`c-${s.cat}`} title={items[s.cat].color} style={{ width: 16, height: 16, borderRadius: "50%", background: getColorHex(items[s.cat].color), border: "1.5px solid #fff", boxShadow: "0 1px 3px rgba(0,0,0,.18)" }} />
          ))}
        </div>

        {/* 종이 질감 */}
        <span aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 11, pointerEvents: "none", opacity: 0.2, mixBlendMode: "multiply",
          backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .4  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }} />
      </div>
    </div>
  );
}
