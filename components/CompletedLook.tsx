"use client";

/* 완성 코디 카드
   · 기본: /api/looks 가 계절·날짜·체형·컬러에 맞춰 매일 새로 짠 룩(네이버 쇼핑, W컨셉 우선)
   · 그게 없으면(키 없음 등): 결이 직접 고른 룩 중 지금 계절에 맞는 것
   · 둘 다 없으면 카드를 숨긴다(겨울에 여름 원피스가 나오지 않게) */

import { useEffect, useState } from "react";
import { looksFor } from "@/lib/lookbookData";
import { wconceptLink } from "@/lib/shopping";
import { currentSeason, SEASON_LABEL } from "@/lib/lookRecipes";
import { track } from "@/lib/track";

interface Props {
  color: string;
  body: string;
  vars: Record<string, string>;
}

interface ShownItem {
  cat: string;
  name: string;
  price: number;
  orig?: number;
  image: string;
  href: string;
  mall: string;
  sponsored: boolean;
}
interface ShownLook {
  id: string;
  title: string;
  mood: string;
  items: ShownItem[];
  live: boolean;
}

interface LiveLook {
  id: string;
  title: string;
  mood: string;
  items: { cat: string; title: string; price: number; image: string; url: string; mall: string; wconcept: boolean }[];
}

export default function CompletedLook({ color, body, vars }: Props) {
  const [live, setLive] = useState<LiveLook | null | undefined>(undefined); // undefined = 불러오는 중

  useEffect(() => {
    let alive = true;
    const qs = new URLSearchParams({ color, body });
    fetch(`/api/looks?${qs}`)
      .then((r) => (r.ok ? r.json() : { look: null }))
      .then((d: { look?: LiveLook | null }) => { if (alive) setLive(d.look ?? null); })
      .catch(() => { if (alive) setLive(null); });
    return () => { alive = false; };
  }, [color, body]);

  if (live === undefined) return null;

  const season = currentSeason();
  const looks: ShownLook[] = live
    ? [{
        id: live.id, title: live.title, mood: live.mood, live: true,
        items: live.items.map((it) => ({
          cat: it.cat, name: it.title, price: it.price, image: it.image,
          href: it.url, mall: it.mall, sponsored: it.wconcept,
        })),
      }]
    : looksFor(color, body, season).map((l) => ({
        id: l.id, title: l.title, mood: l.mood, live: false,
        items: l.items.map((it) => ({
          cat: it.cat, name: it.name, price: it.price, orig: it.orig, image: it.image,
          href: wconceptLink(it.url), mall: "W컨셉", sponsored: true,
        })),
      }));
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
        <div key={look.id} style={{ border: `1px solid ${bdr}`, borderRadius: "4px", padding: "20px", marginBottom: "14px", backgroundColor: "var(--t-side)" }}>
          <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: acc, marginBottom: "8px" }}>
            {look.live ? `TODAY'S LOOK · ${SEASON_LABEL[season].en} · 오늘의 완성 코디` : "LOOK · 결의 완성 코디"}
          </p>
          <p style={{ fontFamily: serif, fontSize: "18px", color: txt, marginBottom: "6px", wordBreak: "keep-all" }}>{look.title}</p>
          <p style={{ fontFamily: sans, fontSize: "12.5px", color: sub, lineHeight: 1.6, marginBottom: "16px", wordBreak: "keep-all" }}>{look.mood}</p>

          <div className="flex flex-col gap-2">
            {look.items.map((it, i) => (
              <a
                key={i}
                href={it.href}
                target="_blank"
                rel={it.sponsored ? "noopener noreferrer sponsored" : "noopener noreferrer"}
                onClick={() => track("look_item_click", { mall: it.mall, cat: it.cat, live: look.live ? 1 : 0 })}
                className="ed-zoom"
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "8px", borderRadius: "4px", textDecoration: "none",
                  border: `1px solid ${bdr}`, backgroundColor: "var(--t-bai)",
                }}
              >
                <span style={{ width: "62px", height: "80px", borderRadius: "3px", overflow: "hidden", flexShrink: 0, backgroundColor: bdr }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt={it.name} loading="lazy" referrerPolicy="no-referrer"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: "var(--font-jost), sans-serif", fontSize: "9.5px", letterSpacing: "0.12em", textTransform: "uppercase", color: acc, marginBottom: "3px" }}>
                    {it.cat}{look.live && <span style={{ color: sub }}> · {it.mall}</span>}
                  </span>
                  <span style={{
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                    fontFamily: sans, fontSize: "12.5px", color: txt, lineHeight: 1.4, wordBreak: "keep-all", marginBottom: "3px",
                  } as React.CSSProperties}>{it.name}</span>
                  {it.price > 0 && <span style={{ fontFamily: sans, fontSize: "12.5px", fontWeight: 600, color: txt }}>{it.price.toLocaleString()}원</span>}
                  {it.orig && it.orig > it.price && (
                    <span style={{ fontFamily: sans, fontSize: "11px", color: sub, textDecoration: "line-through", marginLeft: "6px" }}>{it.orig.toLocaleString()}원</span>
                  )}
                </span>
                <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "12px", color: acc, flexShrink: 0 }}>→</span>
              </a>
            ))}
          </div>

          <p style={{ fontFamily: sans, fontSize: "11px", color: sub, opacity: 0.7, lineHeight: 1.6, marginTop: "12px", wordBreak: "keep-all" }}>
            {look.live
              ? "* 계절과 진단 결과에 맞춰 매일 새로 골라요. W컨셉 상품은 링크를 통한 구매 시 오늘핏에 일정 수수료가 적립될 수 있어요."
              : "* 결이 직접 고른 W컨셉 상품이에요. 링크를 통한 구매 시 오늘핏에 일정 수수료가 적립될 수 있어요."}
          </p>
        </div>
      ))}
    </>
  );
}
