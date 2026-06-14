"use client";

/* 완성 코디 카드 — 결이 큐레이션한 룩(상품 조합)을 사진+가격+사러가기로 노출 */

import { looksFor } from "@/lib/lookbookData";
import { wconceptLink } from "@/lib/shopping";

interface Props {
  color: string;
  body: string;
  vars: Record<string, string>;
}

export default function CompletedLook({ color, body, vars }: Props) {
  const looks = looksFor(color, body);
  if (!looks.length) return null;

  const txt = vars["--t-txt"];
  const sub = vars["--t-sub"];
  const acc = vars["--t-acc"];
  const bdr = vars["--t-bdr"];
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const serif = "var(--font-gowun), 'Batang', serif";

  return (
    <>
      {looks.map((look) => (
        <div key={look.id} style={{ border: `1px solid ${bdr}`, borderRadius: "14px", padding: "20px", marginBottom: "14px", backgroundColor: "var(--t-side)" }}>
          <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: acc, marginBottom: "8px" }}>
            LOOK · 결의 완성 코디
          </p>
          <p style={{ fontFamily: serif, fontSize: "18px", color: txt, marginBottom: "6px", wordBreak: "keep-all" }}>{look.title}</p>
          <p style={{ fontFamily: sans, fontSize: "12.5px", color: sub, lineHeight: 1.6, marginBottom: "16px", wordBreak: "keep-all" }}>{look.mood}</p>

          <div className="flex flex-col gap-2">
            {look.items.map((it, i) => (
              <a
                key={i}
                href={wconceptLink(it.url)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "8px", borderRadius: "10px", textDecoration: "none",
                  border: `1px solid ${bdr}`, backgroundColor: "var(--t-bai)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt={it.name} loading="lazy"
                  style={{ width: "62px", height: "80px", objectFit: "cover", borderRadius: "7px", flexShrink: 0, backgroundColor: bdr }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: "var(--font-jost), sans-serif", fontSize: "9.5px", letterSpacing: "0.12em", textTransform: "uppercase", color: acc, marginBottom: "3px" }}>{it.cat}</span>
                  <span style={{ display: "block", fontFamily: sans, fontSize: "12.5px", color: txt, lineHeight: 1.4, wordBreak: "keep-all", marginBottom: "3px" }}>{it.name}</span>
                  <span style={{ fontFamily: sans, fontSize: "12.5px", fontWeight: 600, color: txt }}>{it.price.toLocaleString()}원</span>
                  {it.orig && it.orig > it.price && (
                    <span style={{ fontFamily: sans, fontSize: "11px", color: sub, textDecoration: "line-through", marginLeft: "6px" }}>{it.orig.toLocaleString()}원</span>
                  )}
                </span>
                <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "12px", color: acc, flexShrink: 0 }}>→</span>
              </a>
            ))}
          </div>

          <p style={{ fontFamily: sans, fontSize: "11px", color: sub, opacity: 0.7, lineHeight: 1.6, marginTop: "12px", wordBreak: "keep-all" }}>
            * 결이 직접 고른 W컨셉 상품이에요. 링크를 통한 구매 시 오늘핏에 일정 수수료가 적립될 수 있어요.
          </p>
        </div>
      ))}
    </>
  );
}
