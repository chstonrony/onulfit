"use client";

import { useRef, useState, KeyboardEvent } from "react";

interface ChatInputProps {
  onSubmit: (situation: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const canSend = !!value.trim() && !isLoading;

  return (
    <div
      className="px-6 pb-6 pt-4"
      style={{ borderTop: "1px solid var(--t-bdr)" }}
    >
      <div
        className="flex items-end gap-3 px-5 py-3.5 transition-all duration-200"
        style={{
          backgroundColor: "var(--t-inp)",
          border: `1.5px solid ${focused ? "var(--t-acc)" : "var(--t-bdr)"}`,
          borderRadius: "9999px",
          boxShadow: focused ? "0 0 0 3px color-mix(in srgb, var(--t-acc) 10%, transparent)" : "none",
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="오늘의 상황을 알려주세요..."
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none bg-transparent focus:outline-none disabled:opacity-50"
          style={{
            fontFamily: "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif",
            fontWeight: 300,
            fontSize: "13px",
            lineHeight: 1.8,
            letterSpacing: "0.02em",
            wordBreak: "keep-all",
            color: "var(--t-txt)",
            minHeight: "22px",
            maxHeight: "120px",
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={!canSend}
          aria-label="전송"
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
          style={{
            backgroundColor: canSend ? "var(--t-acc)" : "transparent",
            border: canSend ? "none" : "1.5px solid var(--t-bdr)",
            color: canSend ? "var(--t-bg)" : "var(--t-sub)",
          }}
        >
          {isLoading ? (
            <span className="flex gap-0.5 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: "var(--t-sub)",
                    animation: `fadePulse 900ms ease-in-out ${i * 180}ms infinite`,
                  }}
                />
              ))}
            </span>
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
