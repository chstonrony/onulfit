"use client";

import { useEffect } from "react";

interface Props {
  vars: Record<string, string>;
  chips: { label: string; url: string }[];
  /** 운영자 큐레이션 핀터레스트 보드 URL (있으면 임베드) */
  boardUrl?: string;
}

/* 핀터레스트 비주얼 — 검색 칩(즉시) + 보드 임베드(URL 있을 때)
   인플루언서 사진을 호스팅하지 않고, 핀터레스트로 합법 링크아웃/임베드 */
export default function Lookboard({ vars, chips, boardUrl }: Props) {
  const txt = vars["--t-txt"];
  const sub = vars["--t-sub"];
  const acc = vars["--t-acc"];
  const bdr = vars["--t-bdr"];
  const sans = "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif";

  // 보드 URL 있으면 핀터레스트 embed 스크립트 로드/빌드
  useEffect(() => {
    if (!boardUrl) return;
    const w = window as unknown as { PinUtils?: { build?: () => void } };
    const existing = document.getElementById("pinit-js");
    if (!existing) {
      const s = document.createElement("script");
      s.id = "pinit-js";
      s.src = "https://assets.pinterest.com/js/pinit.js";
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    } else {
      w.PinUtils?.build?.();
    }
  }, [boardUrl]);

  return (
    <div style={{ border: `1px solid ${bdr}`, borderRadius: "14px", padding: "20px", marginBottom: "14px", backgroundColor: "var(--t-side)" }}>
      <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: acc, marginBottom: "8px" }}>
        LOOKBOOK · 비주얼 레퍼런스
      </p>
      <p style={{ fontFamily: sans, fontSize: "13px", color: sub, lineHeight: 1.6, marginBottom: "14px", wordBreak: "keep-all" }}>
        이런 느낌으로 더 찾아보세요. 핀터레스트에서 실제 코디 사진을 모아 보여드려요.
      </p>

      {/* 큐레이션 보드 임베드 (URL 있을 때) */}
      {boardUrl && (
        <div style={{ marginBottom: "14px", display: "flex", justifyContent: "center" }}>
          <a
            data-pin-do="embedBoard"
            data-pin-board-width="320"
            data-pin-scale-height="240"
            data-pin-scale-width="100"
            href={boardUrl}
          />
        </div>
      )}

      {/* 검색 칩 (항상 — 즉시 작동) */}
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <a
            key={c.label}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: sans,
              fontSize: "12.5px",
              color: txt,
              padding: "8px 14px",
              border: `1px solid ${bdr}`,
              borderRadius: "999px",
              textDecoration: "none",
              wordBreak: "keep-all",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {c.label}
            <span style={{ color: acc, fontSize: "11px" }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
