"use client";

/* ── 사람 사진 비포 / 애프터 (2026-11-09) ──
   골격 3 × 퍼스널컬러 4 = 12쌍. 조합마다 다른 모델(그 골격·컬러가 한눈에 보이는 사람)이고,
   한 쌍 안에서는 같은 사람이 옷만 바꿨다. AI로 만든 연출 이미지(정적 파일).
   · 비포: 길에서 흔히 보는 평범한 옷인데, 핏·길이·색이 그 골격·컬러와 안 맞는 옷
   · 애프터: 그 골격·컬러에 맞춘 핀터레스트 스트릿 룩
   사진: public/lookbook/ba/{body}_{color}-{before|after}.jpg
   (예전 옷 그림 보드는 git 기록에, 체형별 사람 사진 1쌍은 BeforeAfter.tsx 에 남아 있음) */

import type { BodyType, ColorType } from "@/lib/profile";
import { BODY_META, COLOR_META } from "@/lib/profile";

const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

const BODY_WHY: Record<BodyType, { before: string; after: string }> = {
  straight: {
    before: "박시한 오버핏이 상체에 부피를 더해 부해 보이고 허리선이 사라져요",
    after: "브이넥과 넣어 입은 허리선으로 상체가 슬림해지고 다리가 길어 보여요",
  },
  wave: {
    before: "뻣뻣하고 긴 옷이 작은 상체를 덮고 허리선이 내려가 키가 작아 보여요",
    after: "짧고 부드러운 상의와 하이웨이스트로 비율이 살아나 키가 커 보여요",
  },
  natural: {
    before: "몸에 붙는 옷이 어깨와 관절을 도드라지게 해 앙상하고 딱딱해 보여요",
    after: "여유 있는 핏이 골격을 감싸 모델처럼 자연스럽고 멋스러워 보여요",
  },
};

const COLOR_WHY: Record<ColorType, { before: string; after: string }> = {
  spring: {
    before: "블랙·차콜처럼 무겁고 어두운 색은 밝은 얼굴을 칙칙하게 만들어요",
    after: "아이보리·코랄·카멜 같은 따뜻하고 밝은 색에 얼굴이 환해져요",
  },
  summer: {
    before: "머스터드·카멜·브라운은 핑크빛 피부를 누렇고 붉어 보이게 해요",
    after: "하늘색·그레이·로즈 같은 부드러운 쿨톤에 피부가 맑아 보여요",
  },
  autumn: {
    before: "핑크·하늘색·라벤더 같은 차가운 파스텔은 얼굴을 누렇고 흐리게 해요",
    after: "브라운·카라멜·러스트 같은 깊고 따뜻한 색에 피부가 윤기 있어 보여요",
  },
  winter: {
    before: "베이지·카멜·올리브는 맑은 피부를 누렇게 만들고 검은 머리만 무거워 보여요",
    after: "블랙·화이트·진청의 또렷한 대비에 얼굴이 환하고 선명해져요",
  },
};

/* 사진 속 옷 (생성 프롬프트와 같은 내용) */
const ITEMS: Record<`${BodyType}_${ColorType}`, { before: string; after: string }> = {
  straight_spring: {
    before: "블랙 오버핏 맨투맨 · 블랙 와이드 팬츠 · 블랙 어글리 스니커즈 · 백팩",
    after: "아이보리 브이넥 가디건 · 연청 롱 스트레이트 데님 · 탄 스웨이드 스니커즈 · 카멜 숄더백",
  },
  straight_summer: {
    before: "머스터드 오버핏 맨투맨 · 브라운 코듀로이 배기 팬츠 · 베이지 스니커즈",
    after: "연하늘 셔츠(넣어 입기) · 중청 롱 스트레이트 데님 · 그레이 스웨이드 스니커즈 · 로즈 숄더백",
  },
  straight_autumn: {
    before: "베이비 핑크 오버핏 후드티 · 연청 로우라이즈 배기진 · 흰 운동화 · 라벤더 에코백",
    after: "브라운 가죽 재킷 · 카라멜 브이넥 니트 · 롱 스트레이트 데님 · 브라운 플랫",
  },
  straight_winter: {
    before: "베이지 롱 니트 가디건 · 올리브 카고 팬츠 · 베이지 운동화 · 카멜 토트백",
    after: "블랙 가죽 재킷 · 화이트 스쿱넥 티 · 진청 롱 와이드 데님 · 블랙 발레 플랫",
  },
  wave_spring: {
    before: "블랙 오버핏 바람막이 · 차콜 와이드 트랙 팬츠 · 블랙 운동화 · 백팩",
    after: "코랄 크롭 가디건 · 에크루 하이웨이스트 부츠컷 · 탄 발레 플랫 · 카멜 미니백",
  },
  wave_summer: {
    before: "머스터드 박시 워크 재킷 · 브라운 카고 팬츠 · 브라운 등산화풍 운동화",
    after: "하늘색 크롭 가디건 · 연청 하이웨이스트 부츠컷 · 실버 발레 플랫 · 그레이 미니백",
  },
  wave_autumn: {
    before: "하늘색 오버핏 청재킷 · 핑크 후드티 · 연청 배기진 · 라벤더 에코백",
    after: "러스트 터틀넥 · 초콜릿 스웨이드 미디 스커트 · 브라운 플랫 · 코냑 숄더백",
  },
  wave_winter: {
    before: "종아리까지 오는 카멜 롱코트 · 베이지 후드티 · 올리브 와이드 팬츠 · 베이지 운동화",
    after: "블랙 스퀘어넥 티 · 진청 하이웨이스트 부츠컷 · 블랙 발레 플랫 · 버건디 미니백",
  },
  natural_spring: {
    before: "몸에 붙는 블랙 골지 티 · 블랙 스키니진 · 블랙 플랫 · 블랙 미니 크로스백",
    after: "크림 꽈배기 니트 + 흰 셔츠 레이어드 · 연청 롱 와이드 데님 · 탄 스웨이드 스니커즈",
  },
  natural_summer: {
    before: "머스터드 짧은 골지 가디건 · 브라운 스키니 팬츠 · 카멜 플랫 · 카멜 에나멜 백",
    after: "연하늘 스트라이프 오버 셔츠 · 연청 롱 와이드 데님 · 그레이 스웨이드 스니커즈",
  },
  natural_autumn: {
    before: "연핑크 짧은 골지 가디건 · 하늘색 스키니진 · 흰 플랫 · 라벤더 미니 크로스백",
    after: "초콜릿 코듀로이 셔츠 재킷 · 크림 티 · 중청 롱 와이드 데님 · 코냑 토트백",
  },
  natural_winter: {
    before: "몸에 붙는 베이지 골지 티 · 올리브 스키니 팬츠 · 베이지 플랫 · 카멜 미니 크로스백",
    after: "블랙 오버핏 니트 + 흰 셔츠 레이어드 · 진청 롱 와이드 데님 · 블랙 숄더백",
  },
};

export default function BeforeAfterBoard({ body, color, txt, sub, bdr, acc }: {
  body: BodyType; color: ColorType; txt: string; sub: string; bdr: string; acc: string;
}) {
  const key = `${body}_${color}` as const;
  const items = ITEMS[key];

  const col = (kind: "before" | "after") => {
    const isAfter = kind === "after";
    const src = `/lookbook/ba/${key}-${kind}.jpg`;
    return (
      <figure style={{ margin: 0, minWidth: 0 }}>
        <a href={src} target="_blank" rel="noopener" style={{ display: "block", position: "relative", border: `1px solid ${isAfter ? txt : bdr}`, borderRadius: "2px", overflow: "hidden", background: "#EDE7DE" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${BODY_META[body].label} 체형 · ${COLOR_META[color].label} ${isAfter ? "애프터: 어울리는 옷" : "비포: 안 어울리는 옷"}`}
            loading="lazy"
            decoding="async"
            style={{ display: "block", width: "100%", aspectRatio: "3 / 4", objectFit: "cover", objectPosition: "center top" }}
          />
          <span style={{ position: "absolute", left: 8, top: 8, fontFamily: sans, fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.08em", color: isAfter ? "#F4EFE7" : "#6B655E", background: isAfter ? "#191614" : "rgba(255,255,255,.88)", padding: "3px 8px", borderRadius: "999px" }}>
            {isAfter ? "AFTER" : "BEFORE"}
          </span>
        </a>
        <figcaption style={{ marginTop: "9px" }}>
          <span style={{ display: "block", fontFamily: sans, fontSize: "12.5px", fontWeight: 700, color: isAfter ? txt : sub, lineHeight: 1.45, wordBreak: "keep-all" }}>
            {BODY_WHY[body][kind]}
          </span>
          <span style={{ display: "block", fontFamily: sans, fontSize: "12px", color: isAfter ? txt : sub, lineHeight: 1.5, marginTop: "4px", wordBreak: "keep-all" }}>
            {COLOR_WHY[color][kind]}
          </span>
          <span style={{ display: "block", fontFamily: sans, fontSize: "11px", color: sub, lineHeight: 1.55, marginTop: "6px", wordBreak: "keep-all" }}>
            {items[kind]}
          </span>
        </figcaption>
      </figure>
    );
  };

  return (
    <div style={{ border: `1px solid ${bdr}`, borderTop: `1px solid ${txt}`, borderRadius: "2px", padding: "20px", marginBottom: "14px", backgroundColor: "var(--t-card)" }}>
      <p className="ed-label" style={{ color: acc, marginBottom: "10px" }}>LOOKBOOK · 비포 / 애프터</p>
      <p style={{ fontFamily: "var(--font-gowun), 'Batang', serif", fontSize: "20px", fontWeight: 600, color: txt, margin: "0 0 4px", wordBreak: "keep-all" }}>
        같은 사람, 옷만 바꿨어요
      </p>
      <p style={{ fontFamily: sans, fontSize: "12px", color: sub, lineHeight: 1.6, margin: "0 0 14px", wordBreak: "keep-all" }}>
        {BODY_META[body].label} 체형 · {COLOR_META[color].label}. 흔히 입는 옷이라도 골격과 컬러에 안 맞으면 이렇게 달라 보여요.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {col("before")}
        {col("after")}
      </div>
      <p style={{ fontFamily: sans, fontSize: "10.5px", color: sub, lineHeight: 1.55, margin: "12px 0 0", wordBreak: "keep-all" }}>
        * AI로 만든 연출 이미지예요. 같은 사람이 옷만 바꿨을 때의 차이를 보여드리려고 만들었어요.
      </p>
    </div>
  );
}
