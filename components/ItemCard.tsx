import { ClothingItem } from "@/lib/types";
import { getMusinsaUrl, getZigzagUrl, getWConceptUrl } from "@/lib/shopping";
import { getColorHex } from "@/lib/colors";

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

export default function ItemCard({ category, item, animationIndex = 0 }: ItemCardProps) {
  const label = CATEGORY_LABELS[category] ?? category;
  const swatchHex = getColorHex(item.color);

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
      {/* 색 블록(비주얼) + 이름 */}
      <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "12px" }}>
        <span
          className="flex-shrink-0"
          style={{
            width: "62px",
            height: "62px",
            borderRadius: "14px",
            backgroundColor: swatchHex,
            border: "1px solid var(--t-bdr)",
            boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.35)",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontWeight: 300, fontSize: "10px", letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--t-sub)", marginBottom: "4px",
          }}>{label}</p>
          <p style={{
            fontFamily: "var(--font-cormorant), var(--font-gowun), 'Batang', serif",
            fontWeight: 500, fontSize: "16px", letterSpacing: "0.01em",
            wordBreak: "keep-all", color: "var(--t-txt)", lineHeight: 1.35,
          }}>{item.name}</p>
          <p style={{
            fontFamily: "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif",
            fontWeight: 400, fontSize: "11.5px", letterSpacing: "0.02em",
            color: "var(--t-sub)", marginTop: "3px",
          }}>{item.color}</p>
        </div>
      </div>

      {/* 설명 — 2줄로 축소(텍스트 절제) */}
      <p
        style={{
          fontFamily: "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif",
          fontWeight: 400, fontSize: "12.5px", lineHeight: 1.65,
          letterSpacing: "0.01em", wordBreak: "keep-all",
          color: "var(--t-txt)", opacity: 0.68, marginBottom: "13px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        } as React.CSSProperties}
      >
        {item.description}
      </p>

      {/* 쇼핑 버튼 */}
      <div className="flex gap-2">
        <ShopLink href={getMusinsaUrl(item.searchKeyword)} label="무신사" />
        <ShopLink href={getZigzagUrl(item.searchKeyword)} label="지그재그" />
        <ShopLink href={getWConceptUrl(item.searchKeyword)} label="W컨셉" />
      </div>
    </div>
  );
}

function ShopLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="shop-btn flex-1 h-9 flex items-center justify-center rounded-lg transition-all duration-150"
      style={{
        fontFamily: "var(--font-jost), sans-serif",
        fontWeight: 300,
        fontSize: "10px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--t-acc)",
        border: "1px solid var(--t-acc)",
        backgroundColor: "transparent",
      }}
    >
      {label}
    </a>
  );
}
