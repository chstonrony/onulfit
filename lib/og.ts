/* 링크 공유 카드(카카오톡·문자·인스타 미리보기) 이미지
   원본: onulfit-kit/2026-11-06_공유카드/card.html (1200×630으로 캡처)
   이미지를 바꾸면 ?v= 값을 올려야 카카오톡 등이 새 이미지를 다시 가져간다.
   페이지에서 openGraph를 따로 쓰면 layout의 images가 사라지므로, 그때는 이 값을 같이 넣는다. */
export const OG_IMAGE = {
  url: "/og-image.png?v=20261106b",
  width: 1200,
  height: 630,
  alt: "오늘 뭐 입지? 그 답은, 오늘핏. 올리브 문 너머 린넨 셔츠 한 벌",
};

/* 홍보 링크 카드 (2026-11-09) — onulfit.com/go/* 로 뿌리는 링크와 /self-check 미리보기
   원본: onulfit-kit/2026-11-09_홍보카드/card.html (웨이브·여름 쿨 비포/애프터, AI 연출) */
export const OG_PROMO = {
  url: "/og-promo.jpg?v=20261109",
  width: 1200,
  height: 630,
  alt: "같은 사람, 옷만 바꿨어요 — 내 체형·컬러에 맞는 옷은 따로 있어요. 오늘핏 무료 자가진단",
};
