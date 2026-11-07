export interface ClothingItem {
  name: string;
  color: string;
  description: string;
  searchKeyword: string;
}

export interface OutfitRecommendation {
  situation: string;
  mood: string;
  items: {
    top: ClothingItem;
    bottom: ClothingItem;
    outer: ClothingItem;
    shoes: ClothingItem;
    accessory: ClothingItem;
  };
  stylingTip: string;
  overallLook: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  outfit?: OutfitRecommendation;
  /** "limit" = 오늘 무료 코디를 다 써서 상담 안내 카드를 보여 줌 */
  kind?: "limit";
  timestamp: Date;
}

/** 아이템별 실제 상품(네이버 쇼핑 검색 결과, /api/products) */
export interface ProductPick {
  title: string;
  image: string;
  price: number;
  mall: string;
  url: string;
  /** W컨셉 상품이면 제휴 링크로 감싸 둠 */
  wconcept: boolean;
}
