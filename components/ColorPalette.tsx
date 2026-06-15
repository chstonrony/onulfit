"use client";

import { PaletteColor, MoodKey } from "@/lib/themes";

const MOOD_SUBTITLES: Record<MoodKey, string> = {
  everyday: "calm · grounded · effortless",
  gather:   "warm · connected · familiar",
  presence: "refined · confident · assured",
  allure:   "magnetic · radiant · feminine",
  shine:    "bold · luminous · dramatic",
};

interface ColorPaletteProps {
  palette: PaletteColor[];
  mood: MoodKey;
}

export default function ColorPalette({ palette, mood }: ColorPaletteProps) {
  const subtitle = MOOD_SUBTITLES[mood];
  const moodName = mood.charAt(0).toUpperCase() + mood.slice(1);

  return (
    <div
      key={mood}
      style={{ animation: "moodEnter 600ms cubic-bezier(0.16,1,0.3,1) both" }}
    >
      {/* ── 에디토리얼 무드 헤더 ── */}
      <div style={{ marginBottom: "20px" }}>

        {/* 무드 이름 — OnulFit 로고와 동일 서체(Georgia 이탤릭) */}
        <p
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(36px, 8vw, 60px)",
            letterSpacing: "0.01em",
            lineHeight: 1.0,
            color: "var(--t-txt)",
            marginBottom: "10px",
            userSelect: "none",
          }}
        >
          {moodName}
        </p>

        {/* 무드 부제 — Jost 300 */}
        <p
          style={{
            fontFamily: "var(--font-jost), sans-serif",
            fontWeight: 300,
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--t-sub)",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* ── 팔레트 컬러 바 스트립 ── */}
      <div>
        {/* 컬러 바 */}
        <div
          style={{
            display: "flex",
            gap: "2px",
            height: "3px",
            borderRadius: "1.5px",
            overflow: "hidden",
          }}
        >
          {palette.map(({ name, hex }) => (
            <div
              key={name}
              title={name}
              style={{ flex: 1, backgroundColor: hex }}
            />
          ))}
        </div>

        {/* 색상 이름 */}
        <div
          style={{
            display: "flex",
            gap: "2px",
            marginTop: "7px",
          }}
        >
          {palette.map(({ name }) => (
            <div
              key={name}
              style={{
                flex: 1,
                fontFamily: "var(--font-jost), sans-serif",
                fontWeight: 200,
                fontSize: "7.5px",
                letterSpacing: "0.05em",
                color: "var(--t-sub)",
                opacity: 0.6,
                textAlign: "center",
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
