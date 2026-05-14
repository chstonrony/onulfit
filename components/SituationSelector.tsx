"use client";

import { useState } from "react";

interface Situation {
  label: string;
  prompt: string;
}

interface SituationCategory {
  category: string;
  en: string;
  situations: Situation[];
}

export const SITUATION_CATEGORIES: SituationCategory[] = [
  {
    category: "일상",
    en: "Daily",
    situations: [
      { label: "카페 · 브런치",  prompt: "친구랑 카페 브런치 약속이에요. 편하면서도 예쁘게 입고 싶어요." },
      { label: "마트 · 쇼핑",   prompt: "마트랑 쇼핑몰에 갈 건데, 편하지만 너무 허술해 보이지 않게 입고 싶어요." },
      { label: "산책 · 나들이", prompt: "날씨 좋은 날 나들이 가요. 가볍고 산뜻하게 입고 싶어요." },
      { label: "재택근무",      prompt: "재택근무인데 오후에 잠깐 외출할 수도 있어요. 집에서도 단정해 보이게 입고 싶어요." },
    ],
  },
  {
    category: "모임",
    en: "Gather",
    situations: [
      { label: "친구 모임",        prompt: "오랜만에 친구들 만나요. 자연스럽게 예뻐 보이고 싶어요." },
      { label: "동창회",           prompt: "고등학교 동창회가 있어요. 오랜만에 만나는 자리라 잘 보이고 싶은데, 너무 과하지 않게요." },
      { label: "엄마 · 학부모 모임", prompt: "학교 학부모 모임이에요. 세련되고 단정하게, 너무 튀지 않으면서도 예쁘게 입고 싶어요." },
      { label: "가족 모임 · 명절",  prompt: "가족 모임이에요. 단정하면서도 편안하게, 어른들 보기에도 좋게 입고 싶어요." },
    ],
  },
  {
    category: "격식",
    en: "Presence",
    situations: [
      { label: "출근 · 직장",      prompt: "출근해요. 전문적이면서도 너무 딱딱하지 않게, 하루 종일 편하게 입고 싶어요." },
      { label: "중요한 미팅",      prompt: "오늘 중요한 비즈니스 미팅이 있어요. 신뢰감 있고 세련되게 보이고 싶어요." },
      { label: "임원 자리 · 격식", prompt: "임원들이 참석하는 격식 있는 자리예요. 단정하고 신뢰감 있게 보이고 싶어요." },
      { label: "강의 · 발표",      prompt: "강의나 발표가 있어요. 자신감 있어 보이면서도 청중에게 편안한 인상을 주고 싶어요." },
    ],
  },
  {
    category: "특별한 날",
    en: "Allure",
    situations: [
      { label: "소개팅 · 맞선",  prompt: "소개팅이에요. 매력적으로 보이고 싶은데, 자연스럽고 부담스럽지 않게요." },
      { label: "기념일 데이트",  prompt: "남편 또는 파트너와 기념일 데이트예요. 특별하고 매력적으로 보이고 싶어요." },
      { label: "콘서트 · 공연",  prompt: "콘서트나 공연을 보러 가요. 분위기 있으면서도 실용적이게, 사진도 예쁘게 나오고 싶어요." },
      { label: "결혼식 하객",    prompt: "지인 결혼식에 하객으로 가요. 예의 바르면서도 우아하게, 주인공보다 튀지 않게 입고 싶어요." },
      { label: "파티 · 행사",    prompt: "파티나 특별한 행사가 있어요. 과감하고 눈에 띄게, 완전히 변신하고 싶어요." },
    ],
  },
  {
    category: "아이와 함께",
    en: "Family",
    situations: [
      { label: "아이 학교 행사",    prompt: "아이 학교 행사에 가요. 단정하면서도 예쁘게, 아이가 보기에도 자랑스러운 엄마로 보이고 싶어요." },
      { label: "패밀리 나들이",     prompt: "아이와 함께 나들이 가요. 편하면서도 예쁘게, 아이 옷 색상이랑도 잘 어울리면 좋겠어요." },
      { label: "가족 사진 촬영",    prompt: "가족 사진 촬영이에요. 사진에서 예쁘게 나오면서 가족 전체 톤이랑 잘 어울리고 싶어요." },
      { label: "아이 생일 · 행사",  prompt: "아이 생일파티나 행사예요. 활동적이면서도 예쁘게, 즐거운 느낌으로 입고 싶어요." },
    ],
  },
  {
    category: "여행",
    en: "Travel",
    situations: [
      { label: "해외 여행",          prompt: "해외 여행이에요. 이동하기 편하면서도 현지에서 사진 예쁘게 나올 것 같은 코디를 원해요." },
      { label: "국내 여행 · 드라이브", prompt: "국내 여행이나 드라이브 가요. 활동적이고 편하면서도 세련되게 입고 싶어요." },
    ],
  },
  {
    category: "감정",
    en: "Feeling",
    situations: [
      { label: "기분이 가라앉을 때",   prompt: "오늘 기분이 좀 가라앉아 있어요. 옷이라도 예쁘게 입으면 기분이 나아질 것 같아요. 따뜻하고 나를 감싸주는 느낌의 코디를 원해요." },
      { label: "나를 위로하고 싶을 때", prompt: "요즘 지쳐있어요. 오늘만큼은 나를 좀 위로해주고 싶어요. 부드럽고 포근한 느낌의 코디면 좋겠어요." },
      { label: "기쁘고 설레는 날",     prompt: "오늘 너무 기분이 좋아요! 이 기분을 코디에도 담고 싶어요. 밝고 생기 있는 코디를 원해요." },
      { label: "자신감이 필요한 날",   prompt: "오늘 좀 자신감이 필요해요. 나 자신이 강하고 멋있어 보이는 코디를 입고 싶어요." },
      { label: "나만의 시간",          prompt: "오늘은 온전히 나를 위한 하루예요. 아무도 신경 쓰지 않고 내가 가장 나답게 입고 싶어요." },
    ],
  },
];

interface SituationSelectorProps {
  onSelect: (prompt: string) => void;
  isLoading: boolean;
  vars: Record<string, string>;
}

export default function SituationSelector({ onSelect, isLoading, vars }: SituationSelectorProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const current = SITUATION_CATEGORIES[activeCategory];

  return (
    <div className="w-full">

      {/* ── 카테고리 탭: Cormorant Garamond 이탤릭 ── */}
      <div
        className="flex flex-wrap gap-x-6 gap-y-1 mb-7"
        style={{ borderBottom: `1px solid ${vars["--t-bdr"]}`, paddingBottom: "16px" }}
      >
        {SITUATION_CATEGORIES.map((cat, i) => {
          const isActive = i === activeCategory;
          return (
            <button
              key={cat.en}
              onClick={() => setActiveCategory(i)}
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontStyle: "italic",
                fontWeight: isActive ? 500 : 400,
                fontSize: "17px",
                letterSpacing: "0.02em",
                color: isActive ? vars["--t-txt"] : vars["--t-sub"],
                opacity: isActive ? 1 : 0.45,
                background: "none",
                border: "none",
                padding: "2px 0",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s ease",
              }}
            >
              {cat.en}
              {isActive && (
                <span style={{
                  position: "absolute",
                  bottom: -3,
                  left: 0,
                  right: 0,
                  height: "1px",
                  backgroundColor: vars["--t-acc"],
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── 상황 리스트 ── */}
      <div className="flex flex-col">
        {current.situations.map((s, i) => (
          <SituationRow
            key={s.label}
            index={i + 1}
            label={s.label}
            onClick={() => !isLoading && onSelect(s.prompt)}
            disabled={isLoading}
            vars={vars}
          />
        ))}
      </div>

    </div>
  );
}

/* ── 상황 한 줄 ── */
function SituationRow({
  index,
  label,
  onClick,
  disabled,
  vars,
}: {
  index: number;
  label: string;
  onClick: () => void;
  disabled: boolean;
  vars: Record<string, string>;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center text-left w-full"
      style={{
        padding: "11px 0",
        background: "none",
        border: "none",
        borderBottom: `1px solid ${vars["--t-bdr"]}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.3 : 1,
        transition: "all 0.18s ease",
        gap: "14px",
      }}
    >
      {/* 번호 */}
      <span
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "13px",
          letterSpacing: "0.05em",
          color: hovered ? vars["--t-acc"] : vars["--t-sub"],
          opacity: 0.7,
          minWidth: "20px",
          transition: "color 0.18s ease",
          flexShrink: 0,
        }}
      >
        {String(index).padStart(2, "0")}
      </span>

      {/* 상황 이름 — Noto Sans KR: 모바일 가독성 최우선 */}
      <span
        style={{
          fontFamily: "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif",
          fontWeight: 400,
          fontSize: "15px",
          letterSpacing: "0.02em",
          color: hovered ? vars["--t-acc"] : vars["--t-txt"],
          flex: 1,
          transition: "all 0.18s ease",
          wordBreak: "keep-all",
          lineHeight: 1.5,
        }}
      >
        {label}
      </span>

      {/* 화살표 */}
      <span
        style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: "11px",
          color: vars["--t-acc"],
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-4px)",
          transition: "all 0.18s ease",
          flexShrink: 0,
        }}
      >
        →
      </span>
    </button>
  );
}
