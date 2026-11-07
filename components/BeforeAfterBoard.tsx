"use client";

/* ── 옷 사진 비포 / 애프터 (2026-11-07) ──
   예전엔 체형마다 사람 사진 1쌍(고정)이었다. 이제 옷 사진(59종)으로 만들어
   골격 3 × 퍼스널컬러 4 = 12가지가 모두 다르게 나온다.
   · 비포: 그 골격이 피할 모양 + 그 컬러가 피할 색
   · 애프터: 그 골격에 어울리는 모양 + 내 베스트 컬러 (넓은 면적은 바탕색, 상의는 포인트 색) */

import { useEffect, useRef, useState } from "react";
import type { BodyType, ColorType } from "@/lib/profile";
import { BODY_META, COLOR_META } from "@/lib/profile";
import { GarmentPhoto } from "./GarmentArt";
import type { GarmentKind } from "@/lib/garmentSizes";

const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

type It = { k: GarmentKind; n: string };
/* 아이템 순서: 상의 · 하의 · 아우터 · 신발 */
const LOOKS: Record<BodyType, { before: It[]; beforeWhy: string; after: It[]; afterWhy: string }> = {
  straight: {
    before: [{ k: "turtleneck", n: "오버핏 터틀넥" }, { k: "wide", n: "통 넓은 와이드 팬츠" }, { k: "padding", n: "부피 큰 패딩" }, { k: "ugly_sneaker", n: "어글리 스니커즈" }],
    beforeWhy: "목이 막히고 상체에 부피가 더해져 부해 보여요",
    after: [{ k: "shirt", n: "셔츠" }, { k: "pants", n: "일자 슬랙스" }, { k: "trench", n: "트렌치 코트" }, { k: "heel", n: "포인티드 펌프스" }],
    afterWhy: "목선이 열리고 I라인이 살아 반듯하고 날씬해 보여요",
  },
  wave: {
    before: [{ k: "sweatshirt", n: "박시 맨투맨" }, { k: "cargo_pants", n: "로우웨스트 카고" }, { k: "coat", n: "발목까지 긴 코트" }, { k: "sneaker", n: "투박한 스니커즈" }],
    beforeWhy: "얇은 상체가 옷에 묻히고 허리선이 내려가 처져 보여요",
    after: [{ k: "ribbon_blouse", n: "리본 블라우스" }, { k: "pleated_skirt", n: "하이웨스트 플리츠" }, { k: "crop_cardigan", n: "크롭 가디건" }, { k: "maryjane", n: "메리제인" }],
    afterWhy: "허리선이 올라가 다리가 길어 보이고 곡선이 우아하게 살아나요",
  },
  natural: {
    before: [{ k: "tee", n: "몸에 붙는 티셔츠" }, { k: "pants", n: "스키니 팬츠" }, { k: "jacket", n: "짧고 타이트한 재킷" }, { k: "heel", n: "얇은 스틸레토" }],
    beforeWhy: "옷이 몸에 붙을수록 어깨와 뼈대가 도드라져 딱딱해 보여요",
    after: [{ k: "cable_knit", n: "오버핏 케이블 니트" }, { k: "wide", n: "와이드 팬츠" }, { k: "coat", n: "롱 코트" }, { k: "boot", n: "앵클 부츠" }],
    afterWhy: "여유 있는 핏이 골격을 감싸 자연스럽고 멋스러워 보여요",
  },
};

/* 넓은 면적에 쓰는 바탕색(뉴트럴) — DiagnosisVisuals 와 같은 기준 */
const BASE = new Set(["아이보리", "카멜", "라이트 카키", "피치", "오프화이트", "소프트 그레이", "스카이 블루", "라벤더", "브라운", "카키", "올리브", "블랙", "퓨어 화이트", "네이비", "그레이"]);

/* 보드 한 장(150×200 기준으로 그리고 칸 너비에 맞춰 확대·축소) — 아우터를 맨 뒤에 */
const W = 150, H = 200;
const SLOTS = [
  { x: 46, y: 18, w: 70, h: 80, r: 4 },    // 상의
  { x: 92, y: 46, w: 54, h: 116, r: 3 },   // 하의
  { x: 2, y: 26, w: 80, h: 108, r: -5 },   // 아우터
  { x: 8, y: 138, w: 70, h: 54, r: -3 },   // 신발
];
const DRAW_ORDER = [2, 0, 1, 3];

function Board({ items, colors, dim }: { items: It[]; colors: string[]; dim?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} style={{ width: "100%", height: H * scale, borderRadius: "2px", overflow: "hidden", background: "#F2EDE5" }}>
      <div style={{ position: "relative", width: W, height: H, transform: `scale(${scale})`, transformOrigin: "0 0", filter: dim ? "saturate(.85)" : undefined }}>
        {DRAW_ORDER.map((i) => {
          const s = SLOTS[i];
          const it = items[i];
          return (
            <div key={i} style={{ position: "absolute", left: s.x, top: s.y, width: s.w, height: s.h, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${s.r}deg)`, filter: "drop-shadow(0 5px 6px rgba(50,35,20,.18))" }}>
              <GarmentPhoto kind={it.k} hex={colors[i]} width={s.w} height={s.h} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BeforeAfterBoard({ body, color, best, worst, hex, txt, sub, bdr, acc }: {
  body: BodyType; color: ColorType; best: string[]; worst: string[]; hex: (n: string) => string;
  txt: string; sub: string; bdr: string; acc: string;
}) {
  const look = LOOKS[body];
  const base = best.filter((c) => BASE.has(c));
  const point = best.filter((c) => !BASE.has(c));
  // 애프터: 상의 = 포인트 색(없으면 바탕색), 하의·아우터·신발 = 바탕색
  const afterNames = [point[0] ?? base[0], base[0] ?? best[0], base[1] ?? best[1], base[2] ?? base[0] ?? best[2]];
  // 비포 색: 피할 색 중 실제 옷으로 있을 만한 것(형광색은 빼고)
  const w = worst.filter((n) => n !== "형광색");
  const beforeNames = [w[0], w[1] ?? w[0], w[2] ?? w[0], w[3] ?? w[1] ?? w[0]];
  const cm = COLOR_META[color];

  const col = (kind: "before" | "after") => {
    const isAfter = kind === "after";
    const items = isAfter ? look.after : look.before;
    const names = isAfter ? afterNames : beforeNames;
    return (
      <figure style={{ margin: 0, minWidth: 0 }}>
        <div style={{ position: "relative", border: `1px solid ${isAfter ? txt : bdr}`, borderRadius: "2px", overflow: "hidden" }}>
          <Board items={items} colors={names.map(hex)} dim={!isAfter} />
          <span style={{ position: "absolute", left: 8, top: 8, fontFamily: sans, fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.08em", color: isAfter ? "#F4EFE7" : "#6B655E", background: isAfter ? "#191614" : "rgba(255,255,255,.85)", padding: "3px 8px", borderRadius: "999px" }}>
            {isAfter ? "AFTER" : "BEFORE"}
          </span>
        </div>
        <figcaption style={{ marginTop: "9px" }}>
          <span style={{ display: "block", fontFamily: sans, fontSize: "12.5px", fontWeight: 700, color: isAfter ? txt : sub, lineHeight: 1.45, wordBreak: "keep-all" }}>
            {isAfter ? look.afterWhy : look.beforeWhy}
          </span>
          <span style={{ display: "block", fontFamily: sans, fontSize: "11px", color: sub, lineHeight: 1.55, marginTop: "5px", wordBreak: "keep-all" }}>
            {items.map((it) => it.n).join(" · ")}
          </span>
          <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
            {[...new Set(names)].map((n) => (
              <span key={n} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: sans, fontSize: "10.5px", color: isAfter ? txt : sub }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: hex(n), boxShadow: "inset 0 0 0 1px rgba(0,0,0,.1)" }} />
                {n}
              </span>
            ))}
          </span>
        </figcaption>
      </figure>
    );
  };

  return (
    <div style={{ border: `1px solid ${bdr}`, borderTop: `1px solid ${txt}`, borderRadius: "2px", padding: "20px", marginBottom: "14px", backgroundColor: "var(--t-card)" }}>
      <p className="ed-label" style={{ color: acc, marginBottom: "10px" }}>LOOKBOOK · 비포 / 애프터</p>
      <p style={{ fontFamily: "var(--font-gowun), 'Batang', serif", fontSize: "20px", fontWeight: 600, color: txt, margin: "0 0 4px", wordBreak: "keep-all" }}>
        같은 {BODY_META[body].label} 체형, 옷만 바꿨어요
      </p>
      <p style={{ fontFamily: sans, fontSize: "12px", color: sub, lineHeight: 1.6, margin: "0 0 14px", wordBreak: "keep-all" }}>
        모양은 골격에 맞게, 색은 {cm.label} 베스트 컬러로 바꾼 한 벌이에요.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {col("before")}
        {col("after")}
      </div>
    </div>
  );
}
