import { OutfitRecommendation } from "@/lib/types";
import ItemCard from "./ItemCard";
import ShareButtons from "./ShareButtons";

interface OutfitCardProps {
  outfit: OutfitRecommendation;
}

export default function OutfitCard({ outfit }: OutfitCardProps) {
  const LABEL: React.CSSProperties = {
    fontFamily: "var(--font-jost), sans-serif",
    fontWeight: 300,
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--t-sub)",
  };

  const KO_BODY: React.CSSProperties = {
    fontFamily: "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: 1.85,
    letterSpacing: "0.02em",
    wordBreak: "keep-all",
  };

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div
        className="pb-8 mb-8"
        style={{ borderBottom: "1px solid var(--t-bdr)" }}
      >
        <p style={LABEL} className="mb-3">Today&apos;s Look</p>
        <p
          className="leading-snug mb-2"
          style={{
            fontFamily: "var(--font-cormorant), var(--font-gowun), 'Batang', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "22px",
            letterSpacing: "0.01em",
            wordBreak: "keep-all",
            color: "var(--t-txt)",
          }}
        >
          {outfit.situation}
        </p>
        <p style={{ ...KO_BODY, fontSize: "12px", color: "var(--t-sub)" }}>
          {outfit.mood}
        </p>
      </div>

      {/* 아이템 그리드 */}
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ItemCard category="top" item={outfit.items.top} animationIndex={0} />
          <ItemCard category="bottom" item={outfit.items.bottom} animationIndex={1} />
        </div>
        <ItemCard category="outer" item={outfit.items.outer} animationIndex={2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ItemCard category="shoes" item={outfit.items.shoes} animationIndex={3} />
          <ItemCard category="accessory" item={outfit.items.accessory} animationIndex={4} />
        </div>
      </div>

      {/* Overall Look + Styling Tip */}
      <div
        className="rounded-2xl p-7"
        style={{
          backgroundColor: "var(--t-rsec)",
          border: "1px solid var(--t-bdr)",
        }}
      >
        <div className="mb-5">
          <p style={LABEL} className="mb-3">Overall Look</p>
          <p style={{ ...KO_BODY, color: "var(--t-txt)" }}>{outfit.overallLook}</p>
        </div>

        <div className="h-px mb-5" style={{ backgroundColor: "var(--t-bdr)" }} />

        <div className="flex gap-4">
          <div
            className="w-px flex-shrink-0 self-stretch rounded-full opacity-60"
            style={{ backgroundColor: "var(--t-warm)" }}
          />
          <div>
            <p style={LABEL} className="mb-2.5">Styling Tip</p>
            <p style={{ ...KO_BODY, fontSize: "12px", color: "var(--t-txt)", opacity: 0.75 }}>
              {outfit.stylingTip}
            </p>
          </div>
        </div>
      </div>

      {/* 공유 버튼 */}
      <ShareButtons situation={outfit.situation} outfit={outfit.items.top.name} />
    </div>
  );
}
