"use client";

/* ══════════════════════════════════════════════════════════
   Moodboard — 인스타 스토리/콜라주 그리드 스타일 (트렌드 레이아웃)
   - 상단 핸들(onulfit) + 사진 그리드 + 좋아요(하트) 오버레이
   - 우리만의 레이아웃 + 우리 핸들 + 합법 사진 → 저작권 OK
   - images 비면 샘플(placeholder)로 레이아웃 확인

   ※ 인플루언서 사진 직접 호스팅/얼굴합성 금지(저작권·초상권).
     실 사용 이미지 = AI 신규 생성 / Unsplash 라이선스 / 운영자 보유 / 제휴 상품컷.
══════════════════════════════════════════════════════════ */

interface Props {
  vars: Record<string, string>;
  images?: string[];
}

// 운영자 실사진 (public/moodboard/). 9칸(3×3), 포즈 섞어 배치.
const PHOTOS = [
  "/moodboard/1.jpg",
  "/moodboard/2.jpg",
  "/moodboard/3.jpg",
  "/moodboard/4.jpg",
  "/moodboard/5.jpg",
  "/moodboard/6.jpg",
  "/moodboard/7.jpg",
  "/moodboard/8.jpg",
  "/moodboard/9.jpg",
];

// 좋아요 하트를 올릴 타일 인덱스 (인스타 콜라주 느낌)
const LIKED = new Set([1, 6]);

function Heart() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" stroke="rgba(0,0,0,0.12)" strokeWidth="1"
      style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))" }} aria-hidden="true">
      <path d="M12 21s-7.5-4.6-10-9.2C.6 8.5 2.2 5 5.5 5c2 0 3.4 1.2 4.5 2.6C11.1 6.2 12.5 5 14.5 5 17.8 5 19.4 8.5 22 11.8 19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export default function Moodboard({ vars, images }: Props) {
  const list = images && images.length ? images : PHOTOS;
  const isSample = false;
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";
  const point = vars["--t-point"] ?? vars["--t-acc"];

  return (
    <div style={{ marginTop: "28px" }}>
      {/* 섹션 라벨 */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
        <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: point, margin: 0 }}>
          MOODBOARD
        </p>
        {isSample && (
          <span style={{ fontFamily: sans, fontSize: "10px", color: vars["--t-sub"], opacity: 0.7 }}>샘플 · 교체 예정</span>
        )}
      </div>

      {/* 인스타 스토리/콜라주 카드 */}
      <div style={{ border: `1px solid ${vars["--t-bdr"]}`, borderRadius: "16px", overflow: "hidden", backgroundColor: vars["--t-side"] }}>
        {/* 헤더 — 핸들 */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 14px" }}>
          <span style={{
            width: "34px", height: "34px", borderRadius: "50%",
            border: `1.5px solid ${point}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic", fontWeight: 500,
            fontSize: "16px", color: point, flexShrink: 0,
          }}>O</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: sans, fontSize: "13px", fontWeight: 600, color: vars["--t-txt"], margin: 0, letterSpacing: "0.01em" }}>onulfit</p>
            <p style={{ fontFamily: sans, fontSize: "11px", color: vars["--t-sub"], margin: 0 }}>오늘의 무드 · 트렌드</p>
          </div>
          <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", color: vars["--t-sub"], letterSpacing: "0.1em" }}>TODAY</span>
        </div>

        {/* 사진 그리드 (3열, 인스타 콜라주) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px" }}>
          {list.map((src, i) => (
            <div key={i} style={{ position: "relative", width: "100%", paddingBottom: "118%", overflow: "hidden", backgroundColor: vars["--t-bdr"] }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              {LIKED.has(i) && (
                <span style={{ position: "absolute", bottom: "8px", left: "8px" }}><Heart /></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
