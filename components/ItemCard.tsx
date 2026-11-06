"use client";

import { useEffect, useState } from "react";
import { ClothingItem, ProductPick } from "@/lib/types";
import { getZigzagUrl, get29cmUrl, getWConceptUrl } from "@/lib/shopping";
import { getColorHex } from "@/lib/colors";
import { track } from "@/lib/track";

const CATEGORY_LABELS: Record<string, string> = {
  top: "상의",
  bottom: "하의",
  outer: "아우터",
  shoes: "신발",
  accessory: "액세서리",
};

interface ItemCardProps {
  category: string;
  item: ClothingItem;
  animationIndex?: number;
}

/* 아이템 카드
   · 실제 옷 사진: 네이버 쇼핑(W컨셉 상품이 있으면 맨 앞, 제휴 링크) — /api/products
   · 사진을 못 가져오면(키 없음·결과 없음) 예전처럼 색 블록을 보여준다
   · 29CM·지그재그: 상품 정보를 가져올 공개 통로가 없어 브랜드 타일로 검색 결과에 연결만 */
export default function ItemCard({ category, item, animationIndex = 0 }: ItemCardProps) {
  const label = CATEGORY_LABELS[category] ?? category;
  const swatchHex = getColorHex(item.color);
  const [picks, setPicks] = useState<ProductPick[] | null>(null); // null = 불러오는 중

  useEffect(() => {
    let alive = true;
    const qs = new URLSearchParams({ q: item.searchKeyword, color: item.color });
    fetch(`/api/products?${qs}`)
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d: { items?: ProductPick[] }) => { if (alive) setPicks(d.items ?? []); })
      .catch(() => { if (alive) setPicks([]); });
    return () => { alive = false; };
  }, [item.searchKeyword, item.color]);

  const hasPhotos = !!picks && picks.length > 0;
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

  return (
    <div
      className="card-enter rounded-2xl transition-all duration-200"
      style={{
        padding: "16px",
        animationDelay: `${animationIndex * 80}ms`,
        backgroundColor: "var(--t-card)",
        border: "1px solid var(--t-bdr)",
      }}
    >
      {/* 이름 줄 — 사진이 있으면 색은 작은 점으로만 */}
      <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "12px" }}>
        {!hasPhotos && (
          <span
            className="flex-shrink-0"
            style={{
              width: "62px", height: "62px", borderRadius: "4px",
              backgroundColor: swatchHex, border: "1px solid var(--t-bdr)",
              boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.35)",
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontWeight: 300, fontSize: "10px", letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--t-sub)", marginBottom: "4px",
          }}>{label}</p>
          <p style={{
            fontFamily: "var(--font-gowun), 'Batang', serif",
            fontWeight: 500, fontSize: "16px", letterSpacing: "0.01em",
            wordBreak: "keep-all", color: "var(--t-txt)", lineHeight: 1.35,
          }}>{item.name}</p>
          <p style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: sans, fontWeight: 400, fontSize: "11.5px", letterSpacing: "0.02em",
            color: "var(--t-sub)", marginTop: "3px",
          }}>
            {hasPhotos && (
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: swatchHex, border: "1px solid var(--t-bdr)", flexShrink: 0 }} />
            )}
            {item.color}
          </p>
        </div>
      </div>

      {/* 설명 — 2줄 */}
      <p
        style={{
          fontFamily: sans, fontWeight: 400, fontSize: "12.5px", lineHeight: 1.65,
          letterSpacing: "0.01em", wordBreak: "keep-all",
          color: "var(--t-txt)", opacity: 0.68, marginBottom: "13px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        } as React.CSSProperties}
      >
        {item.description}
      </p>

      {/* 실제 옷 사진 */}
      {picks === null && (
        <div className="grid grid-cols-3 gap-2" style={{ marginBottom: "12px" }} aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ aspectRatio: "3 / 4", borderRadius: "4px" }} />
          ))}
        </div>
      )}
      {hasPhotos && (
        <div className="grid grid-cols-3 gap-2" style={{ marginBottom: "12px" }}>
          {picks!.map((p, i) => (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel={p.wconcept ? "noopener noreferrer sponsored" : "noopener noreferrer"}
              onClick={() => track("product_click", { mall: p.mall, category })}
              className="ed-zoom"
              style={{ display: "block", textDecoration: "none", color: "var(--t-txt)", minWidth: 0 }}
            >
              <span style={{ display: "block", aspectRatio: "3 / 4", borderRadius: "4px", overflow: "hidden", backgroundColor: "var(--t-bdr)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} loading="lazy" referrerPolicy="no-referrer"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </span>
              <span style={{
                display: "block", marginTop: "6px",
                fontFamily: "var(--font-grotesk), sans-serif", fontWeight: 700, fontSize: "9.5px",
                letterSpacing: "0.06em", color: p.wconcept ? "var(--t-acc)" : "var(--t-sub)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{p.mall}</span>
              <span style={{
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                fontFamily: sans, fontSize: "11px", lineHeight: 1.4, marginTop: "2px", wordBreak: "break-all",
              } as React.CSSProperties}>{p.title}</span>
              {p.price > 0 && (
                <span style={{ display: "block", fontFamily: sans, fontWeight: 700, fontSize: "12px", marginTop: "3px" }}>
                  {p.price.toLocaleString()}원
                </span>
              )}
            </a>
          ))}
        </div>
      )}

      {/* 다른 쇼핑몰에서 찾기 — 브랜드 타일(검색 결과로 연결) */}
      <div className="grid grid-cols-3 gap-2">
        <ShopTile href={get29cmUrl(item.searchKeyword)} label="29CM" bg="#111111" fg="#FFFFFF" mall="29cm" category={category} />
        <ShopTile href={getZigzagUrl(item.searchKeyword)} label="ZIGZAG" bg="#FF4D97" fg="#FFFFFF" mall="zigzag" category={category} />
        <ShopTile href={getWConceptUrl(item.searchKeyword)} label="W CONCEPT" bg="#FFFFFF" fg="#111111" mall="wconcept" category={category} sponsored />
      </div>
    </div>
  );
}

function ShopTile({ href, label, bg, fg, mall, category, sponsored }: {
  href: string; label: string; bg: string; fg: string; mall: string; category: string; sponsored?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel={sponsored ? "noopener noreferrer sponsored" : "noopener noreferrer"}
      onClick={() => track("shop_click", { mall, category })}
      aria-label={`${label}에서 검색`}
      className="shop-tile"
      style={{
        height: "40px", display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: "4px", backgroundColor: bg, color: fg,
        border: bg === "#FFFFFF" ? "1px solid #111111" : "1px solid transparent",
        fontFamily: "var(--font-grotesk), sans-serif", fontWeight: 800, fontSize: "12px",
        letterSpacing: label === "W CONCEPT" ? "0.04em" : "0.02em", textDecoration: "none",
      }}
    >
      {label}
    </a>
  );
}
