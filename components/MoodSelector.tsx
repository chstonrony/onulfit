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
        className="flex gap-4 overflow-x-auto"
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
                fontFamily: "var(--font-grotesk), sans-serif",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                padding: "4px 0 5px",
                background: "transparent",
                border: "none",
                color: isActive ? vars["--t-txt"] : vars["--t-sub"],
                opacity: isActive ? 1 : 0.55,
                borderBottom: `2px solid ${isActive ? vars["--t-acc"] : "transparent"}`,
                cursor: "pointer",
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
          fontFamily: "var(--font-grotesk), sans-serif",
          fontWeight: 700,
          fontSize: "11px",
          letterSpacing: "0.06em",
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
                fontFamily: "var(--font-grotesk), sans-serif",
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                padding: "6px 10px",
                borderRadius: "2px",
                cursor: "pointer",
                color: isActive ? vars["--t-bg"] : vars["--t-sub"],
                backgroundColor: isActive ? vars["--t-acc"] : "transparent",
                border: `1px solid ${isActive ? vars["--t-acc"] : vars["--t-txt"]}`,
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
