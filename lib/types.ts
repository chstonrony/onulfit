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
  timestamp: Date;
}
