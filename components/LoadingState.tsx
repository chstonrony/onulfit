"use client";

const LOADING_TEXT = "스타일링 중...";

export default function LoadingState() {
  return (
    <div className="w-full">
      <p
        className="mb-8"
        style={{
          fontFamily: "var(--font-cormorant), var(--font-gowun), serif",
          fontStyle: "italic",
          fontSize: "14px",
          color: "var(--t-sub)",
        }}
        aria-live="polite"
      >
        {LOADING_TEXT.split("").map((char, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: 0,
              animation: `fadeInChar 300ms ease ${i * 45}ms forwards`,
            }}
          >
            {char}
          </span>
        ))}
      </p>

      {/* 헤더 스켈레톤 */}
      <div className="pb-8 mb-8" style={{ borderBottom: "1px solid var(--t-bdr)" }}>
        <div className="skeleton h-2.5 w-20 rounded-full mb-3" />
        <div className="skeleton h-6 w-2/3 rounded-lg mb-2" />
        <div className="skeleton h-3.5 w-1/3 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="mb-4"><SkeletonCard /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <SkeletonCard />
        <SkeletonCard />
      </div>

      <div
        className="rounded-2xl p-7"
        style={{ backgroundColor: "var(--t-rsec)", border: "1px solid var(--t-bdr)" }}
      >
        <div className="skeleton h-2.5 w-24 rounded-full mb-3" />
        <div className="skeleton h-3.5 w-full rounded-lg mb-2" />
        <div className="skeleton h-3.5 w-4/5 rounded-lg mb-5" />
        <div className="h-px mb-5" style={{ backgroundColor: "var(--t-bdr)" }} />
        <div className="skeleton h-2.5 w-20 rounded-full mb-3" />
        <div className="skeleton h-3.5 w-full rounded-lg mb-1.5" />
        <div className="skeleton h-3.5 w-3/4 rounded-lg" />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl"
      style={{ padding: "24px", backgroundColor: "var(--t-card)", border: "1px solid var(--t-bdr)" }}
    >
      <div className="skeleton h-2.5 w-10 rounded-full mb-2" />
      <div className="skeleton h-4 w-1/2 rounded-lg mb-4" />
      <div className="flex items-center gap-2.5 mb-4">
        <div className="skeleton w-3.5 h-3.5 rounded-full flex-shrink-0" />
        <div className="skeleton h-2.5 w-1/4 rounded-full" />
      </div>
      <div className="space-y-2 mb-5">
        <div className="skeleton h-3 w-full rounded-lg" />
        <div className="skeleton h-3 w-5/6 rounded-lg" />
        <div className="skeleton h-3 w-3/4 rounded-lg" />
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton flex-1 h-9 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
