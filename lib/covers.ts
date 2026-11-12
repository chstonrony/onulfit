/* ══════════════════════════════════════════════════════════
   가이드 글 대표 그림 (2026-11-12)
   글마다 다른 그림 한 장: public/covers/{slug}.png(공유·검색용 1200×630), {slug}.webp(글 화면용, 가벼움)
   · 그림은 사이트의 옷 그림(GarmentArt)에 글 내용에 맞는 색을 입혀 만든 것 — 남의 사진을 쓰지 않는다.
   · 여기 목록(COVERS)이 그림에 들어가는 옷이고, 대체 글(alt)도 여기서 만든다.
   · 새 글을 쓰면: 여기에 옷 3~4개를 적고 → 그림을 다시 만든다
     (만드는 방법: onulfit-kit/2026-11-12_글대표그림/README.md)
   · 그림을 바꾸면 COVER_VERSION 을 올려야 카카오톡·검색엔진이 새 그림을 다시 가져간다.
   · 목록에 없는 글은 사이트 공통 공유 그림(lib/og.ts)을 쓴다.
══════════════════════════════════════════════════════════ */

import type { GarmentKind } from "./garmentSizes";
import { OG_IMAGE } from "./og";

export interface CoverItem {
  kind: GarmentKind;
  /** 옷 이름(대체 글에 쓰임) */
  name: string;
  /** 입힐 색 */
  hex: string;
  pattern?: "stripe" | "check";
}

const COVER_VERSION = "20261112";

export const COVERS: Record<string, CoverItem[]> = {
  "golgyeok-self-check": [
    { kind: "shirt", name: "셔츠", hex: "#F1ECE2" },
    { kind: "crop_cardigan", name: "크롭 가디건", hex: "#B9A7CF" },
    { kind: "wide", name: "와이드 팬츠", hex: "#6F8FB3" },
  ],
  "straight-styling": [
    { kind: "knit", name: "니트", hex: "#2A2826" },
    { kind: "jeans", name: "일자 데님", hex: "#5B7FA6" },
    { kind: "loafer", name: "로퍼", hex: "#3B2C22" },
  ],
  "wave-styling": [
    { kind: "crop_cardigan", name: "크롭 가디건", hex: "#EADFC8" },
    { kind: "pleated_skirt", name: "플리츠 스커트", hex: "#8E8E8E" },
    { kind: "maryjane", name: "메리제인", hex: "#2A2826" },
  ],
  "natural-styling": [
    { kind: "shirt", name: "체크 셔츠", hex: "#6B6F3C", pattern: "check" },
    { kind: "wide", name: "와이드 데님", hex: "#4F6F96" },
    { kind: "boot", name: "앵클 부츠", hex: "#2A2826" },
  ],
  "body-type-coat": [
    { kind: "coat", name: "싱글 코트", hex: "#B98D63" },
    { kind: "double_coat", name: "더블 코트", hex: "#3A3E44" },
    { kind: "trench", name: "트렌치 코트", hex: "#C9B48C" },
  ],
  "body-type-denim": [
    { kind: "jeans", name: "일자 데님", hex: "#8FB0CF" },
    { kind: "wide", name: "와이드 데님", hex: "#5B7FA6" },
    { kind: "denim_skirt", name: "데님 스커트", hex: "#2F4666" },
  ],
  "body-type-knit": [
    { kind: "knit", name: "크루넥 니트", hex: "#E8DFCB" },
    { kind: "cable_knit", name: "케이블 니트", hex: "#9A8F84" },
    { kind: "turtleneck", name: "터틀넥 니트", hex: "#6B4A36" },
  ],
  "body-type-short-padding": [
    { kind: "padding", name: "숏 패딩", hex: "#2A2826" },
    { kind: "padding", name: "숏 패딩", hex: "#E6DDCB" },
    { kind: "vest", name: "니트 조끼", hex: "#6B6F3C" },
  ],
  "body-type-skirt": [
    { kind: "skirt", name: "A라인 스커트", hex: "#2A2826" },
    { kind: "pleated_skirt", name: "플리츠 스커트", hex: "#B98D63" },
    { kind: "slip_skirt", name: "슬립 스커트", hex: "#D8CDB8" },
  ],
  "wedding-guest-outfit": [
    { kind: "blazer", name: "재킷", hex: "#E8DFCB" },
    { kind: "dress", name: "원피스", hex: "#2B3A55" },
    { kind: "heel", name: "힐", hex: "#2A2826" },
  ],
  "personal-color-guide": [
    { kind: "knit", name: "봄 웜 코랄 니트", hex: "#E2826C" },
    { kind: "knit", name: "여름 쿨 라벤더 니트", hex: "#B9A7CF" },
    { kind: "knit", name: "가을 웜 테라코타 니트", hex: "#B5613F" },
    { kind: "knit", name: "겨울 쿨 로열 블루 니트", hex: "#2F5DA8" },
  ],
  "spring-warm-outfit": [
    { kind: "cardigan", name: "코랄 가디건", hex: "#E2826C" },
    { kind: "pants", name: "아이보리 팬츠", hex: "#ECE4D3" },
    { kind: "shoulder_bag", name: "카멜 숄더백", hex: "#B98D63" },
  ],
  "summer-cool-outfit": [
    { kind: "knit", name: "라벤더 니트", hex: "#B9A7CF" },
    { kind: "jeans", name: "연청 데님", hex: "#A9C3DC" },
    { kind: "shoulder_bag", name: "그레이 숄더백", hex: "#8E9299" },
  ],
  "autumn-warm-outfit": [
    { kind: "knit", name: "테라코타 니트", hex: "#B5613F" },
    { kind: "pants", name: "카키 팬츠", hex: "#7A7650" },
    { kind: "boot", name: "브라운 부츠", hex: "#4B392D" },
  ],
  "winter-cool-outfit": [
    { kind: "coat", name: "블랙 코트", hex: "#232325" },
    { kind: "knit", name: "로열 블루 니트", hex: "#2F5DA8" },
    { kind: "pants", name: "차콜 팬츠", hex: "#3A3E44" },
  ],
};

export interface Cover {
  /** 공유·검색용 PNG */
  url: string;
  /** 글 화면용 WebP */
  webp: string;
  width: number;
  height: number;
  alt: string;
}

/** 글의 대표 그림. 목록에 없으면 사이트 공통 공유 그림 */
export function coverFor(slug: string, title: string): Cover {
  const items = COVERS[slug];
  if (!items) return { url: OG_IMAGE.url, webp: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: OG_IMAGE.alt };
  const names = [...new Set(items.map((i) => i.name))].join(", ");
  return {
    url: `/covers/${slug}.png?v=${COVER_VERSION}`,
    webp: `/covers/${slug}.webp?v=${COVER_VERSION}`,
    width: 1200,
    height: 630,
    alt: `${title} — ${names} 그림`,
  };
}
