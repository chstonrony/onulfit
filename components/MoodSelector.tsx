"use client";

import { MoodKey, THEMES, MOOD_ORDER } from "@/lib/themes";

interface MoodSelectorProps {
  selected: MoodKey;
  onChange: (mood: MoodKey) => void;
  vars: Record<string, string>;
  compact?: boolean;
}

export default function MoodSelector({ selected, onChange, vars, compact = false }: MoodSelectorProps) {
  if (compact) {
    return (
      <div
        className="flex gap-5 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {MOOD_ORDER.map((key) => {
          const theme = THEMES[key];
          const isActive = selected === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex-shrink-0 transition-all duration-300"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontWeight: isActive ? 500 : 400,
                fontSize: "16px",
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
                padding: "2px 0 4px",
                background: "transparent",
                border: "none",
                color: isActive ? vars["--t-acc"] : vars["--t-sub"],
                opacity: isActive ? 1 : 0.5,
                borderBottom: `1.5px solid ${isActive ? vars["--t-acc"] : "transparent"}`,
              }}
            >
              {theme.name}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {/* 레이블 */}
      <p
        className="mb-2.5"
        style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontWeight: 200,
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: vars["--t-sub"],
        }}
      >
        Mood
      </p>

      {/* 무드 버튼 */}
      <div className="flex flex-wrap gap-1.5">
        {MOOD_ORDER.map((key) => {
          const theme = THEMES[key];
          const isActive = selected === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex items-center gap-1.5 transition-all duration-300"
              style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontWeight: isActive ? 300 : 200,
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "5px 10px",
                borderRadius: "9999px",
                color: isActive ? vars["--t-bg"] : vars["--t-sub"],
                backgroundColor: isActive ? vars["--t-acc"] : "transparent",
                border: `1px solid ${isActive ? vars["--t-acc"] : vars["--t-bdr"]}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: isActive ? vars["--t-bg"] : theme.dot }}
              />
              {theme.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
