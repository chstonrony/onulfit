"use client";

import { ClothingItem, OutfitRecommendation } from "@/lib/types";
import ItemCard from "./ItemCard";

/* ── 코디가 도착하는 중 ──
   AI가 쓰는 대로 상황·무드부터 보이고, 아이템은 한 칸씩 완성되는 대로 카드로 바뀐다.
   다 오면 page.tsx 가 완성 화면(OutfitCard)으로 바꾼다. */

export type DraftOutfitData = Partial<Omit<OutfitRecommendation, "items">> & {
  items?: Partial<Record<keyof OutfitRecommendation["items"], Partial<ClothingItem>>>;
};

const ORDER = ["top", "bottom", "outer", "shoes", "accessory"] as const;
const LABEL: Record<(typeof ORDER)[number], string> = {
  top: "상의",
  bottom: "하의",
  outer: "아우터",
  shoes: "신발",
  accessory: "액세서리",
};

function isComplete(it?: Partial<ClothingItem>): it is ClothingItem {
  return !!(it && it.name && it.color && it.description && it.searchKeyword);
}

export default function DraftOutfit({ draft }: { draft: DraftOutfitData }) {
  const done = ORDER.filter((k) => isComplete(draft.items?.[k])).length;

  return (
    <div className="w-full" aria-live="polite">
      <div className="pb-8 mb-8" style={{ borderBottom: "1px solid var(--t-bdr)" }}>
        <p className="ed-label mb-3" style={{ color: "var(--t-sub)" }}>
          Today&apos;s Look · 스타일링 중 {done}/5
        </p>
        {draft.situation && (
          <p
            className="leading-snug mb-2"
            style={{
              fontFamily: "var(--font-cormorant), var(--font-gowun), 'Batang', serif",
              fontStyle: "italic",
              fontSize: "22px",
              wordBreak: "keep-all",
              color: "var(--t-txt)",
              animation: "cardEnter 400ms var(--ease-out) both",
            }}
          >
            {draft.situation}
          </p>
        )}
        {draft.mood && (
          <p style={{ fontSize: "12px", color: "var(--t-sub)", wordBreak: "keep-all" }}>{draft.mood}</p>
        )}
      </div>

      <div className="space-y-4">
        {ORDER.map((k, i) => {
          const it = draft.items?.[k];
          if (isComplete(it)) return <ItemCard key={k} category={k} item={it} animationIndex={0} />;
          const writing = !!it?.name || ORDER.slice(0, i).every((p) => isComplete(draft.items?.[p]));
          return (
            <div
              key={k}
              className="rounded-2xl px-5 py-5"
              style={{
                border: "1px dashed var(--t-bdr)",
                background: writing
                  ? "linear-gradient(90deg, var(--t-sk1), var(--t-sk2), var(--t-sk1))"
                  : "transparent",
                backgroundSize: "200% 100%",
                animation: writing ? "shimmer 1.4s linear infinite" : undefined,
              }}
            >
              <span className="ed-label" style={{ color: "var(--t-sub)" }}>
                {LABEL[k]} {it?.name ? `· ${it.name}` : writing ? "· 고르는 중" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
