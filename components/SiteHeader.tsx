"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { track } from "@/lib/track";

/* ── 모든 화면 공통 상단 메뉴 ──
   · 로고: 누르면 맨 처음 화면으로 (홈에서는 대화·결과를 비우고 첫 화면으로)
   · ←  : 홈이 아닌 화면에서 이전 화면으로 (이전 기록이 없으면 홈으로)
   · 메뉴: 자가진단 · 가이드 · 1:1 진단 — 꼭 필요한 것만 */

const INK = "var(--t-txt, #1D1F16)";
const ACC = "var(--t-acc, #5A6122)";

const MENU = [
  { href: "/self-check", label: "자가진단" },
  { href: "/guide", label: "가이드" },
  { href: "/apply", label: "1:1 진단", accent: true },
];

export default function SiteHeader({
  onHome,
  style,
}: {
  /** 홈 화면에서 로고를 눌렀을 때 첫 화면 상태로 되돌리는 함수 */
  onHome?: () => void;
  style?: React.CSSProperties;
}) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const isHome = pathname === "/";

  const goHome = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      onHome?.();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    const fromHere =
      typeof document !== "undefined" &&
      document.referrer.startsWith(window.location.origin) &&
      window.history.length > 1;
    if (fromHere) router.back();
    else router.push("/");
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        paddingBottom: "10px",
        borderBottom: `1px solid ${INK}`,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        {!isHome && (
          <button
            type="button"
            onClick={goBack}
            aria-label="이전 화면으로"
            style={{
              background: "none",
              border: "none",
              padding: "4px 2px",
              cursor: "pointer",
              color: INK,
              fontSize: "18px",
              lineHeight: 1,
            }}
          >
            ←
          </button>
        )}
        <Link href="/" onClick={goHome} aria-label="오늘핏 처음 화면으로" style={{ display: "block", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/onulfit_logo_light.svg"
            alt="OnulFit"
            width={112}
            height={34}
            style={{ width: "104px", height: "auto", display: "block" }}
          />
        </Link>
      </div>

      <nav style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
        {MENU.map((m) => {
          const active = pathname === m.href || pathname.startsWith(m.href + "/");
          return (
            <Link
              key={m.href}
              href={m.href}
              onClick={m.href === "/apply" ? () => track("consult_click", { where: "header", method: "apply" }) : undefined}
              className="ed-label ed-link"
              aria-current={active ? "page" : undefined}
              style={{
                color: m.accent ? ACC : INK,
                backgroundSize: active ? "100% 1px" : undefined,
                whiteSpace: "nowrap",
              }}
            >
              {m.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
