"use client";

/* ── 지그재그 추천 아이템 (2026-11-12) ──
   진단 결과 화면에서 체형·퍼스널컬러·지금 계절에 맞는 실제 상품을 한 벌(아우터·상의·하의·신발/소품)로 보여 준다.
   · 옷 그림은 직접 그린 GarmentArt 에 내 추천 색을 입힌 것(지그재그 상품 사진·로고는 쓰지 않는다)
   · 매일 조합이 바뀌고, "다른 아이템 보기"로 다음 조합
   · 링크는 지그재그 공유리워드(제휴) 링크 — 링크 바로 아래에 수수료 안내를 적는다(공정위 추천·보증 지침) */

import { useState } from "react";
import type { BodyType, ColorType } from "@/lib/profile";
import { BODY_META, COLOR_META } from "@/lib/profile";
import { SEASON_LABEL } from "@/lib/lookRecipes";
import { COLOR_PLAN } from "@/lib/styleDirections";
import { getColorHex } from "@/lib/colors";
import { picksFor, colorTip, whyFor, SLOT_LABEL } from "@/lib/zigzagPicks";
import { GarmentPhoto, garmentKind, garmentPattern } from "./GarmentArt";
import { track } from "@/lib/track";

const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

/* lib/colors 에 없는 색 이름만 여기서 채운다(진단 화면의 색 견본과 같은 값) */
const EXTRA_HEX: Record<string, string> = { "피치": "#EFC2A4", "터콰이즈": "#5E9E98", "에메랄드": "#2F7D6B" };
const hexOf = (name: string) => EXTRA_HEX[name] ?? getColorHex(name);

export default function ZigzagPicks({ body, color, txt, sub, bdr, acc }: {
  body: BodyType; color: ColorType; txt: string; sub: string; bdr: string; acc: string;
}) {
  const [shift, setShift] = useState(0);
  const { picks, season, n, total } = picksFor(body, color, shift);
  if (picks.length < 2) return null; // 이 계절에 고른 상품이 모자라면 칸을 숨긴다
  const pointKey = picks.find((p) => p.face)?.key;

  return (
    <div>
      <p style={{ fontFamily: sans, fontSize: "13px", color: sub, lineHeight: 1.6, marginBottom: "6px", wordBreak: "keep-all" }}>
        {BODY_META[body].label} 체형과 {COLOR_META[color].label}, 그리고 지금 계절({SEASON_LABEL[season].ko})에 맞춰 지그재그에서 직접 고른 실제 상품이에요.
      </p>
      <p style={{ fontFamily: sans, fontSize: "11.5px", color: sub, opacity: 0.85, lineHeight: 1.6, marginBottom: "14px", wordBreak: "keep-all" }}>
        색 고르는 요령 · {COLOR_PLAN[color].note}
      </p>

      <div className="flex flex-col" style={{ gap: "10px" }}>
        {picks.map((p) => {
          // 포인트(베스트) 컬러는 한 벌에서 얼굴 가까운 한 곳에만 권한다
          const allowPoint = p.key === pointKey;
          const tip = colorTip(p, color, n, allowPoint);
          const hex = hexOf(tip.names[0]);
          return (
            <a
              key={p.key}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => track("shop_click", { mall: "zigzag", category: "diag_pick", item: p.key })}
              className="ed-zoom"
              style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: "12px", alignItems: "center", padding: "10px", border: `1px solid ${bdr}`, borderRadius: "3px", background: "var(--t-bg)", textDecoration: "none", color: txt }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "84px", height: "84px", background: "#F4EFE7", border: `1px solid ${bdr}`, borderRadius: "3px", overflow: "hidden" }}>
                <GarmentPhoto kind={garmentKind(p.slot, p.item)} hex={hex} pattern={garmentPattern(p.item)} width={70} height={70} />
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                  <span style={{ fontFamily: sans, fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.04em", color: sub }}>{SLOT_LABEL[p.slot]}</span>
                  {p.point && (
                    <span style={{ fontFamily: sans, fontSize: "9.5px", fontWeight: 700, color: acc, border: `1px solid ${acc}`, borderRadius: "2px", padding: "0 5px", lineHeight: "15px" }}>포인트</span>
                  )}
                </span>
                <span style={{ display: "block", fontFamily: sans, fontSize: "14px", fontWeight: 700, color: txt, lineHeight: 1.35, wordBreak: "keep-all" }}>
                  {p.item} <span style={{ fontWeight: 400, fontSize: "11.5px", color: sub }}>· {p.shop}</span>
                </span>
                <span style={{ display: "block", fontFamily: sans, fontSize: "12px", color: sub, lineHeight: 1.55, marginTop: "3px", wordBreak: "keep-all" }}>{whyFor(p, body)}</span>
                <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 8px", marginTop: "6px" }}>
                  <span style={{ fontFamily: sans, fontSize: "11px", fontWeight: 700, color: txt }}>{tip.label}</span>
                  {tip.names.map((c) => (
                    <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: sans, fontSize: "11px", color: sub }}>
                      <span aria-hidden style={{ width: "10px", height: "10px", borderRadius: "50%", background: hexOf(c), border: `1px solid ${bdr}` }} />
                      {c}
                    </span>
                  ))}
                </span>
                <span style={{ display: "block", fontFamily: sans, fontSize: "11.5px", fontWeight: 700, color: txt, marginTop: "7px" }}>지그재그에서 보기 →</span>
              </span>
            </a>
          );
        })}
      </div>

      {total > picks.length && (
        <button
          type="button"
          onClick={() => { track("pick_shuffle", { body, color }); setShift((s) => s + 1); }}
          style={{ marginTop: "12px", width: "100%", padding: "11px", fontFamily: sans, fontSize: "13px", fontWeight: 700, color: txt, background: "transparent", border: `1px solid ${txt}`, borderRadius: "2px", cursor: "pointer" }}
        >
          다른 아이템 보기 ↻
        </button>
      )}

      <p style={{ fontFamily: sans, fontSize: "11px", color: sub, opacity: 0.7, lineHeight: 1.6, marginTop: "12px", wordBreak: "keep-all" }}>
        * 지그재그 제휴 링크예요. 링크를 통한 구매 시 오늘핏에 일정 수수료가 적립될 수 있어요. 옷 그림은 추천 색을 입힌 참고용 그림이고, 실제 상품의 색·가격·재고는 지그재그에서 확인해 주세요.
      </p>
    </div>
  );
}
