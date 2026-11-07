"use client";

/* ── 자가진단 결과를 그림으로 (2026-11-07) ──
   글로만 읽던 결과를 한눈에 보이게 한다.
   · BodyForms     — 세 골격을 드레스폼(마네킹 몸통)으로 나란히, 내 골격을 크게 + 특징 표시
   · BodyDoDont    — 내 골격에 어울리는 옷 / 피할 옷을 옷 사진으로 (내 베스트 컬러를 입혀서)
   · SeasonMap     — 웜·쿨 × 밝음·깊음 4칸 지도에서 내 자리
   · ToneCompare   — 같은 니트를 베스트 컬러 vs 피할 색으로 나란히
   · SwatchBoard   — 베스트 컬러를 옷감 스와치로(바탕색 / 포인트 색), 피할 색은 작게 */

import type { BodyType, ColorType } from "@/lib/profile";
import { BODY_META, COLOR_META } from "@/lib/profile";
import { GarmentPhoto, garmentKind, garmentPattern } from "./GarmentArt";
import { getWConceptUrl } from "@/lib/shopping";
import { track } from "@/lib/track";
import type { GarmentKind } from "@/lib/garmentSizes";

const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

/* ── 드레스폼 모양 ──
   오른쪽 반쪽 점(중심에서 x만큼, 높이 y)을 이어 부드러운 곡선으로 만들고 좌우를 뒤집어 붙인다. */
type Pt = [number, number];
const FORM: Record<BodyType, Pt[]> = {
  // 상체가 두껍고 입체적, 허리 높고 완만, 직선적인 하체
  straight: [[5, 14], [6, 25], [27, 33], [33, 52], [31, 66], [24, 82], [26, 104], [27, 124], [24, 138]],
  // 어깨 얇고 둥글게 처짐, 허리 낮고 잘록, 골반·하체에 무게
  wave: [[5, 14], [6, 27], [22, 37], [25, 54], [22, 72], [17, 92], [27, 116], [32, 130], [28, 142]],
  // 어깨 프레임이 넓고 각짐, 허리선이 거의 일자, 뼈대감
  natural: [[5, 14], [6, 23], [35, 29], [33, 50], [29, 70], [26, 88], [27, 108], [28, 124], [26, 138]],
};
/* 특징 표시선 — [높이, 짧은 설명] */
const MARKS: Record<BodyType, [number, string][]> = {
  straight: [[50, "상체가 두껍고 입체적"], [80, "허리 위치가 높음"], [124, "직선적인 하체"]],
  wave: [[37, "어깨가 얇고 둥글게"], [92, "허리가 낮고 잘록"], [130, "하체에 무게중심"]],
  natural: [[29, "어깨 프레임이 넓음"], [88, "허리선이 일자에 가까움"], [124, "뼈대가 또렷"]],
};

function smooth(pts: Pt[]): string {
  // Catmull-Rom → 베지어
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}
function formPath(type: BodyType, cx = 60): string {
  const right: Pt[] = FORM[type].map(([x, y]) => [cx + x, y]);
  const left: Pt[] = [...FORM[type]].reverse().map(([x, y]) => [cx - x, y]);
  const r = smooth(right);
  const l = smooth(left).replace(/^M/, "L");
  return `${r} ${l} Z`;
}

function DressForm({ type, fill, line, width, marks }: { type: BodyType; fill: string; line: string; width: number; marks?: boolean }) {
  const pts = FORM[type];
  const bottom = pts[pts.length - 1][1];
  return (
    <svg width={width} viewBox={marks ? "0 0 260 200" : "0 0 120 200"} aria-hidden style={{ display: "block", overflow: "visible" }}>
      <g>
        {/* 받침대 */}
        <line x1="60" y1={bottom} x2="60" y2="186" stroke={line} strokeWidth="2" />
        <path d="M44,192 Q60,184 76,192" stroke={line} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* 목 뚜껑 */}
        <ellipse cx="60" cy="13" rx="7" ry="2.6" fill={line} />
        {/* 몸통 */}
        <path d={formPath(type)} fill={fill} stroke={line} strokeWidth="1.6" strokeLinejoin="round" />
        {/* 가운데 솔기 */}
        <path d={`M60,24 L60,${bottom - 2}`} stroke={line} strokeWidth="0.8" strokeDasharray="2 3" opacity=".5" />
      </g>
      {marks &&
        MARKS[type].map(([y, t], i) => {
          // 그 높이에서 몸통 오른쪽 끝
          const pts2 = FORM[type];
          let x = pts2[0][0];
          for (let k = 0; k < pts2.length - 1; k++) {
            const [x1, y1] = pts2[k], [x2, y2] = pts2[k + 1];
            if (y >= y1 && y <= y2) { x = x1 + ((x2 - x1) * (y - y1)) / Math.max(1, y2 - y1); break; }
          }
          const sx = 60 + x + 3;
          return (
            <g key={i}>
              <line x1={sx} y1={y} x2={150} y2={y} stroke={line} strokeWidth="0.9" strokeDasharray="2 2" />
              <circle cx={sx} cy={y} r="2.4" fill={line} />
              <text x={155} y={y + 4} fontSize="11" fontFamily={sans} fill={line} fontWeight={600}>{t}</text>
            </g>
          );
        })}
    </svg>
  );
}

/** 내 골격을 크게(특징 표시) + 세 골격 비교 */
export function BodyForms({ body, acc, txt, sub, bdr }: { body: BodyType; acc: string; txt: string; sub: string; bdr: string }) {
  const order: BodyType[] = ["straight", "wave", "natural"];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", padding: "6px 0 2px" }}>
        <div style={{ width: "100%", maxWidth: 340 }}>
          <DressForm type={body} fill={`${acc}2E`} line={txt} width={340} marks />
        </div>
      </div>
      <p style={{ fontFamily: sans, fontSize: "11px", color: sub, margin: "10px 0 8px" }}>세 골격 비교</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
        {order.map((t) => {
          const on = t === body;
          return (
            <div
              key={t}
              style={{
                padding: "10px 4px 8px",
                border: `1px solid ${on ? txt : bdr}`,
                borderRadius: "3px",
                background: on ? "var(--t-bai)" : "transparent",
                textAlign: "center",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", opacity: on ? 1 : 0.55 }}>
                <DressForm type={t} fill={on ? `${acc}38` : "transparent"} line={on ? txt : sub} width={58} />
              </div>
              <p style={{ fontFamily: sans, fontSize: "12.5px", fontWeight: on ? 700 : 500, color: on ? txt : sub, margin: "4px 0 0" }}>
                {BODY_META[t].label}{on ? " · 나" : ""}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 어울리는 옷 / 피할 옷 ── */
type G = { k: GarmentKind; t: string; q?: string }; // q = 쇼핑몰 검색어
const DO_DONT: Record<BodyType, { good: G[]; avoid: G[] }> = {
  straight: {
    good: [{ k: "shirt", t: "셔츠 칼라", q: "베이직 셔츠" }, { k: "pants", t: "일자 슬랙스" }, { k: "trench", t: "트렌치 코트" }, { k: "heel", t: "포인티드 펌프스" }],
    avoid: [{ k: "ribbon_blouse", t: "프릴·리본" }, { k: "sweatshirt", t: "박시 오버핏" }, { k: "padding", t: "부피 큰 패딩" }],
  },
  wave: {
    good: [{ k: "ribbon_blouse", t: "디테일 블라우스", q: "리본 블라우스" }, { k: "pleated_skirt", t: "하이웨스트 플리츠", q: "플리츠 스커트" }, { k: "crop_cardigan", t: "짧은 가디건", q: "크롭 가디건" }, { k: "maryjane", t: "메리제인" }],
    avoid: [{ k: "sweatshirt", t: "밋밋한 박시핏" }, { k: "cargo_pants", t: "로우웨스트 카고" }, { k: "coat", t: "너무 긴 기장" }],
  },
  natural: {
    good: [{ k: "cable_knit", t: "오버핏 니트", q: "오버핏 케이블 니트" }, { k: "wide", t: "와이드 팬츠" }, { k: "coat", t: "롱 코트" }, { k: "boot", t: "부츠", q: "앵클 부츠" }],
    avoid: [{ k: "knit_dress", t: "몸에 붙는 핏" }, { k: "ribbon_blouse", t: "과한 프릴" }, { k: "slip_skirt", t: "반짝이는 새틴" }],
  },
};

export function BodyDoDont({ body, colors, txt, sub, bdr, acc }: { body: BodyType; colors: string[]; txt: string; sub: string; bdr: string; acc: string }) {
  const { good, avoid } = DO_DONT[body];
  const tile = (g: G, hex: string, ok: boolean, i: number) => {
    const Wrap = ok ? "a" : "div";
    const link = ok ? { href: getWConceptUrl(g.q ?? g.t), target: "_blank", rel: "noopener noreferrer sponsored", onClick: () => track("shop_click", { mall: "wconcept", category: "diag_body" }) } : {};
    return (
    <Wrap key={`${g.k}-${i}`} {...link} className={ok ? "ed-zoom" : undefined} style={{ display: "block", textAlign: "center", minWidth: 0, textDecoration: "none" }}>
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4EFE7",
          border: `1px solid ${ok ? bdr : "transparent"}`,
          borderRadius: "3px",
          opacity: ok ? 1 : 0.62,
          overflow: "hidden",
        }}
      >
        <GarmentPhoto kind={g.k} hex={hex} width={ok ? 66 : 54} height={ok ? 66 : 54} />
        {ok && (
          <span style={{ position: "absolute", right: 4, bottom: 4, fontFamily: sans, fontSize: "9.5px", fontWeight: 700, color: "#191614", background: "rgba(255,255,255,.85)", padding: "1px 5px", borderRadius: "2px" }}>보기 →</span>
        )}
        {!ok && (
          <svg viewBox="0 0 40 40" style={{ position: "absolute", inset: "18%", width: "64%", height: "64%" }} aria-hidden>
            <path d="M6 6 L34 34 M34 6 L6 34" stroke="#B4473C" strokeWidth="3" strokeLinecap="round" opacity=".8" />
          </svg>
        )}
      </div>
      <p style={{ fontFamily: sans, fontSize: "11.5px", lineHeight: 1.35, color: ok ? txt : sub, margin: "5px 0 0", wordBreak: "keep-all" }}>{g.t}</p>
    </Wrap>
    );
  };
  return (
    <div>
      <p style={{ fontFamily: sans, fontSize: "12.5px", fontWeight: 700, color: acc, margin: "0 0 8px" }}>○ 이렇게 입으면 살아나요 <span style={{ fontWeight: 400, color: sub }}>· 누르면 W컨셉에서 보기</span></p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
        {good.map((g, i) => tile(g, colors[i % colors.length], true, i))}
      </div>
      <p style={{ fontFamily: sans, fontSize: "12.5px", fontWeight: 700, color: sub, margin: "16px 0 8px" }}>✕ 이건 피하는 게 좋아요</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
        {avoid.map((g, i) => tile(g, "#A9A39A", false, i))}
      </div>
    </div>
  );
}

/* ── 4계절 지도 ── */
export function SeasonMap({ color, txt, sub, bdr }: { color: ColorType; txt: string; sub: string; bdr: string }) {
  const cells: { k: ColorType; row: number; col: number }[] = [
    { k: "spring", row: 0, col: 0 },
    { k: "summer", row: 0, col: 1 },
    { k: "autumn", row: 1, col: 0 },
    { k: "winter", row: 1, col: 1 },
  ];
  const axis: React.CSSProperties = { fontFamily: sans, fontSize: "10.5px", color: sub, letterSpacing: "0.02em" };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "30px 1fr 1fr", gridTemplateRows: "18px 1fr 1fr", gap: "5px" }}>
        <span />
        <span style={{ ...axis, textAlign: "center" }}>웜톤 (노란빛)</span>
        <span style={{ ...axis, textAlign: "center" }}>쿨톤 (푸른빛)</span>
        {[0, 1].map((row) => (
          <FragmentRow key={row}>
            <span style={{ ...axis, textAlign: "center", alignSelf: "center", wordBreak: "keep-all", lineHeight: 1.3 }}>{row === 0 ? "밝고 맑음" : "깊고 진함"}</span>
            {cells.filter((c) => c.row === row).map((c) => {
              const m = COLOR_META[c.k];
              const on = c.k === color;
              return (
                <div
                  key={c.k}
                  style={{
                    position: "relative",
                    padding: "10px 10px 9px",
                    border: on ? `2px solid ${txt}` : `1px solid ${bdr}`,
                    borderRadius: "3px",
                    background: on ? "var(--t-card)" : "transparent",
                    opacity: on ? 1 : 0.6,
                  }}
                >
                  {on && (
                    <span style={{ position: "absolute", top: 7, right: 7, fontFamily: sans, fontSize: "10.5px", fontWeight: 700, color: "var(--t-bg)", background: txt, padding: "1px 7px", borderRadius: "999px" }}>나</span>
                  )}
                  <div style={{ display: "flex", height: "22px", borderRadius: "2px", overflow: "hidden", marginBottom: "6px" }}>
                    {m.swatch.map((s) => <span key={s} style={{ flex: 1, background: s }} />)}
                  </div>
                  <p style={{ fontFamily: sans, fontSize: "13px", fontWeight: on ? 700 : 500, color: txt, margin: 0 }}>{m.label}</p>
                  <p style={{ fontFamily: sans, fontSize: "10.5px", color: sub, margin: "1px 0 0", wordBreak: "keep-all" }}>{m.tagline}</p>
                </div>
              );
            })}
          </FragmentRow>
        ))}
      </div>
    </div>
  );
}
function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/* ── 얼굴 가까이 두는 상의 색 비교 ──
   같은 니트를 베스트 컬러와 피할 색으로 나란히. (사람 얼굴 그림 대신 실제 옷 사진으로) */
export function ToneCompare({ goodHex, goodName, badHex, badName, txt, sub, bdr }: { goodHex: string; goodName: string; badHex: string; badName: string; txt: string; sub: string; bdr: string }) {
  const box = (hex: string, name: string, good: boolean) => (
    <figure style={{ margin: 0, minWidth: 0 }}>
      <div style={{ position: "relative", aspectRatio: "4 / 5", display: "flex", alignItems: "center", justifyContent: "center", background: "#F2EDE5", border: `1px solid ${good ? txt : bdr}`, borderRadius: "2px", overflow: "hidden" }}>
        <GarmentPhoto kind="knit" hex={hex} width={128} height={128} />
        <span style={{ position: "absolute", left: 10, top: 10, fontFamily: sans, fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.06em", color: good ? "#F4EFE7" : "#6B655E", background: good ? "#191614" : "rgba(255,255,255,.8)", padding: "3px 8px", borderRadius: "999px" }}>
          {good ? "BEST" : "AVOID"}
        </span>
      </div>
      <figcaption style={{ marginTop: "8px" }}>
        <span style={{ display: "block", fontFamily: sans, fontSize: "13px", fontWeight: 700, color: good ? txt : sub }}>{name} 니트</span>
        <span style={{ display: "block", fontFamily: sans, fontSize: "11.5px", lineHeight: 1.5, color: sub, marginTop: "2px", wordBreak: "keep-all" }}>
          {good ? "얼굴에 혈색이 돌고 피부가 맑아 보여요" : "그늘·다크서클이 도드라져 보이기 쉬워요"}
        </span>
      </figcaption>
    </figure>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      {box(goodHex, goodName, true)}
      {box(badHex, badName, false)}
    </div>
  );
}

/* ── 옷감 스와치 ──
   색 칩을 납작한 원색 대신 옷감처럼(은은한 짜임 + 빛) 보여 준다. */
function Swatch({ hex, size, muted }: { hex: string; size?: number; muted?: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: "block",
        width: size ?? "100%",
        aspectRatio: "4 / 5",
        borderRadius: "2px",
        backgroundColor: hex,
        backgroundImage: [
          "linear-gradient(160deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,0) 45%, rgba(0,0,0,.10) 100%)",
          "repeating-linear-gradient(0deg, rgba(0,0,0,.035) 0 1px, transparent 1px 3px)",
          "repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 1px, transparent 1px 3px)",
        ].join(","),
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06), 0 1px 2px rgba(40,30,20,.08)",
        filter: muted ? "saturate(.55)" : undefined,
        opacity: muted ? 0.7 : 1,
      }}
    />
  );
}

/* 옷 전체에 써도 되는 바탕색(뉴트럴) — 나머지는 포인트 색 */
const BASE = new Set(["아이보리", "카멜", "라이트 카키", "피치", "오프화이트", "소프트 그레이", "스카이 블루", "라벤더", "브라운", "카키", "올리브", "블랙", "퓨어 화이트", "네이비", "그레이"]);

/** 베스트 컬러를 '바탕색 / 포인트 색'으로 나눠 옷감 스와치로, 피할 색은 작게 */
export function SwatchBoard({ best, worst, hex, txt, sub }: { best: string[]; worst: string[]; hex: (n: string) => string; txt: string; sub: string }) {
  const base = best.filter((c) => BASE.has(c));
  const point = best.filter((c) => !BASE.has(c));
  const group = (title: string, note: string, names: string[]) => (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px", marginBottom: "8px" }}>
        <p style={{ fontFamily: sans, fontSize: "12.5px", fontWeight: 700, color: txt, margin: 0 }}>{title}</p>
        <p style={{ fontFamily: sans, fontSize: "11px", color: sub, margin: 0, textAlign: "right", wordBreak: "keep-all" }}>{note}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
        {names.map((n) => (
          <div key={n} style={{ minWidth: 0 }}>
            <Swatch hex={hex(n)} />
            <p style={{ fontFamily: sans, fontSize: "11.5px", color: txt, margin: "5px 0 0", wordBreak: "keep-all", lineHeight: 1.3 }}>{n}</p>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div>
      {group("바탕색", "코트·니트·팬츠처럼 넓은 면적에", base)}
      {point.length > 0 && group("포인트 색", "상의 하나·스카프·가방으로 한 곳만", point)}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,.08)" }}>
        <p style={{ fontFamily: sans, fontSize: "12px", fontWeight: 700, color: sub, margin: 0 }}>피하면 좋은 색</p>
        {worst.map((n) => (
          <span key={n} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: sans, fontSize: "11.5px", color: sub }}>
            <Swatch hex={hex(n)} size={16} muted />
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 요약 칸용 작은 드레스폼 */
export function MiniForm({ body, acc, txt }: { body: BodyType; acc: string; txt: string }) {
  return <DressForm type={body} fill={`${acc}38`} line={txt} width={44} />;
}

/* ── 글자로만 있던 코디 공식·쇼핑을 옷 사진 + 링크로 (2026-11-07) ── */

/** 옷 이름 → 카테고리 → 옷 사진 종류 */
function catOf(text: string): string {
  if (/슈즈|힐|펌프스|로퍼|부츠|워커|플랫|스니커|샌들|뮬|메리제인|슬링백/.test(text)) return "shoes";
  if (/백$|백\s|가방|목걸이|이어링|스카프|머플러|벨트|모자|베레|버킷햇|클러치/.test(text)) return "accessory";
  if (/원피스|드레스|가디건|블라우스|셔츠(?!\s?원피스)|니트|티셔츠|맨투맨/.test(text) && !/재킷|자켓|코트/.test(text)) return "top";
  if (/재킷|자켓|코트|트렌치|점퍼|패딩|무스탕|블레이저/.test(text)) return "outer";
  if (/스커트|팬츠|슬랙스|데님|바지|청바지/.test(text)) return "bottom";
  return "top";
}
export function kindOf(text: string): GarmentKind {
  if (/리본\s?슈즈|플랫\s?슈즈|발레리나/.test(text)) return "ballet";
  return garmentKind(catOf(text), text);
}

/** 옷 한 칸 — 사진 + 이름, 누르면 쇼핑몰 검색 */
function ShopTile({ name, hex, href, txt, bdr, onClick, size = 64 }: { name: string; hex: string; href: string; txt: string; sub?: string; bdr: string; onClick?: () => void; size?: number }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer sponsored" onClick={onClick} className="ed-zoom" style={{ display: "block", minWidth: 0, textDecoration: "none", color: txt }}>
      <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "1 / 1", background: "#F4EFE7", border: `1px solid ${bdr}`, borderRadius: "3px", overflow: "hidden" }}>
        <GarmentPhoto kind={kindOf(name)} hex={hex} pattern={garmentPattern(name)} width={size} height={size} />
        <span style={{ position: "absolute", right: 4, bottom: 4, fontFamily: sans, fontSize: "9.5px", fontWeight: 700, color: "#191614", background: "rgba(255,255,255,.85)", padding: "1px 5px", borderRadius: "2px" }}>보기 →</span>
      </span>
      <span style={{ display: "block", fontFamily: sans, fontSize: "11.5px", lineHeight: 1.35, color: txt, marginTop: "5px", textAlign: "center", wordBreak: "keep-all" }}>{name}</span>
    </a>
  );
}

/** 결의 코디 공식 — 공식 하나 = 옷 사진 한 줄, 누르면 W컨셉에서 그 옷 / 버튼으로 이 공식대로 코디 받기 */
export function FormulaBoards({ formulas, colors, onAsk, txt, sub, bdr, acc }: {
  formulas: string[]; colors: string[]; onAsk?: (situation: string) => void; txt: string; sub: string; bdr: string; acc: string;
}) {
  return (
    <div className="flex flex-col" style={{ gap: "12px" }}>
      {formulas.map((f, fi) => {
        const parts = f.split(/\s*\+\s*/).filter(Boolean);
        return (
          <div key={f} style={{ border: `1px solid ${bdr}`, borderRadius: "3px", padding: "12px", background: "var(--t-bg)" }}>
            <p style={{ fontFamily: sans, fontSize: "11px", fontWeight: 700, color: acc, margin: "0 0 8px", letterSpacing: "0.04em" }}>공식 {fi + 1}</p>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(3, parts.length)}, 1fr)`, gap: "6px" }}>
              {parts.map((p, i) => (
                <ShopTile
                  key={p}
                  name={p}
                  hex={colors[(fi + i) % colors.length]}
                  href={getWConceptUrl(p)}
                  onClick={() => track("shop_click", { mall: "wconcept", category: "diag_formula" })}
                  txt={txt} sub={sub} bdr={bdr}
                  size={58}
                />
              ))}
            </div>
            {onAsk && (
              <button
                type="button"
                onClick={() => { track("diag_formula_ask", { i: fi }); onAsk(`${parts.join(", ")} 조합으로 오늘 입을 코디 짜 주세요`); }}
                style={{ marginTop: "10px", width: "100%", padding: "10px", fontFamily: sans, fontSize: "13px", fontWeight: 700, color: txt, background: "transparent", border: `1px solid ${txt}`, borderRadius: "2px", cursor: "pointer" }}
              >
                이 공식으로 내 코디 받기 →
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** 내 컬러로 쇼핑 — 품목마다 베스트 컬러를 입힌 옷 사진, 누르면 W컨셉 검색 */
export function ColorShop({ colorNames, hex, txt, sub, bdr }: { colorNames: string[]; hex: (n: string) => string; txt: string; sub: string; bdr: string }) {
  const items = ["원피스", "블라우스", "니트", "슬랙스", "스커트", "가디건"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
      {items.map((it, i) => {
        const c = colorNames[i % colorNames.length];
        const kw = `${c} ${it}`;
        return (
          <ShopTile
            key={it}
            name={kw}
            hex={hex(c)}
            href={getWConceptUrl(kw)}
            onClick={() => track("shop_click", { mall: "wconcept", category: "diag_color" })}
            txt={txt} sub={sub} bdr={bdr}
            size={70}
          />
        );
      })}
    </div>
  );
}
