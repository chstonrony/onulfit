"use client";

import { MoodKey, THEMES, MOOD_ORDER } from "@/lib/themes";

interface MoodSelectorProps {
  selected: MoodKey;
  onChange: (mood: MoodKey) => void;
  vars: Record<string, string>;
}

export default function MoodSelector({ selected, onChange, vars }: MoodSelectorProps) {
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
