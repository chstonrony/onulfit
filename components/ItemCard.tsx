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
        padding: "24px",
        animationDelay: `${animationIndex * 80}ms`,
        backgroundColor: "var(--t-card)",
        border: "1px solid var(--t-bdr)",
      }}
    >
      {/* 카테고리 레이블 */}
      <p
        className="mb-2"
        style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontWeight: 300,
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--t-sub)",
        }}
      >
        {label}
      </p>

      {/* 아이템명 */}
      <p
        className="leading-snug mb-4"
        style={{
          fontFamily: "var(--font-cormorant), var(--font-gowun), 'Batang', serif",
          fontWeight: 500,
          fontSize: "16px",
          letterSpacing: "0.02em",
          wordBreak: "keep-all",
          color: "var(--t-txt)",
        }}
      >
        {item.name}
      </p>

      {/* 컬러 스와치 */}
      <div className="flex items-center gap-2.5 mb-4">
        <span
          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: swatchHex, border: "1px solid var(--t-bdr)" }}
        />
        <span
          style={{
            fontFamily: "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif",
            fontWeight: 400,
            fontSize: "12px",
            letterSpacing: "0.03em",
            color: "var(--t-sub)",
            opacity: 0.75,
          }}
        >
          {item.color}
        </span>
      </div>

      {/* 설명 */}
      <p
        className="mb-5"
        style={{
          fontFamily: "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: 1.85,
          letterSpacing: "0.02em",
          wordBreak: "keep-all",
          color: "var(--t-txt)",
          opacity: 0.8,
        }}
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
