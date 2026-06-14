/* ══════════════════════════════════════════════════════════
   완성 코디(룩북) 데이터 — 운영자(결) 큐레이션
   각 룩 = 무드 + 상품 여러 개 조합. 상품은 W컨셉 제휴(추적 링크로 변환).
   colors/bodies 가 비면 모든 진단 결과에 노출, 지정 시 해당 조합에만.
══════════════════════════════════════════════════════════ */

export interface LookItem {
  cat: string;        // 카테고리 라벨 (원피스/슈즈/가방…)
  name: string;       // 상품명 (다듬은 표기)
  price: number;      // 판매가
  orig?: number;      // 정가(할인 전) — 있으면 취소선
  image: string;      // 상품 대표 이미지 URL (W컨셉 CDN)
  url: string;        // W컨셉 상품 원본 URL (렌더 시 제휴 딥링크로 변환)
}

export interface CuratedLook {
  id: string;
  title: string;
  mood: string;       // 결의 한 줄 큐레이션 코멘트
  colors?: string[];  // 매칭 퍼스널컬러 (비면 전체)
  bodies?: string[];  // 매칭 체형 (비면 전체)
  items: LookItem[];
}

export const CURATED_LOOKS: CuratedLook[] = [
  {
    id: "daily-beige-dress",
    title: "편하지만 예쁜, 원피스 한 벌 룩",
    mood: "키높이 샌들로 비율을 살리고, 미니백으로 가볍게 휙. 너무 과하지 않아서 데일리로 딱이에요.",
    items: [
      {
        cat: "원피스",
        name: "하프 슬리브 드레스 · 라이트 베이지",
        price: 179550,
        orig: 189000,
        image: "https://product-image.wconcept.co.kr/productimg/image/img2/89/308449589_CR69986.jpg",
        url: "https://www.wconcept.co.kr/Product/308449589",
      },
      {
        cat: "슈즈",
        name: "청키 소가죽 샌들 · 5.5cm 키높이",
        price: 93000,
        orig: 155000,
        image: "https://product-image.wconcept.co.kr/productimg/image/img2/69/305862569_MA98724.jpg",
        url: "https://www.wconcept.co.kr/Product/305862569",
      },
      {
        cat: "가방",
        name: "미니 어라운드 호보백 · 블랙",
        price: 208000,
        image: "https://product-image.wconcept.co.kr/productimg/image/img2/24/301592424_MG10191.jpg",
        url: "https://www.wconcept.co.kr/Product/301592424",
      },
    ],
  },
];

/** 진단 결과(color/body)에 맞는 룩 — 없으면 전체에서 반환 */
export function looksFor(color: string, body: string): CuratedLook[] {
  return CURATED_LOOKS.filter(
    (l) =>
      (!l.colors || l.colors.includes(color)) &&
      (!l.bodies || l.bodies.includes(body))
  );
}
