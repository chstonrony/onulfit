/* ── AI 코디 하루 무료 횟수 (2026-11-08 사용자 결정: 하루 5번) ──
   기기(브라우저)마다 한국 날짜 기준으로 센다. 다 쓰면 1:1 진단·카톡 상담으로 안내.
   서버 쪽 남용 방지는 lib/rateLimit.ts가 따로 맡는다. */

export const FREE_DAILY = 5;
const KEY = "onulfit_ai_quota";

function todayKST(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function read(): number {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null") as { d?: string; n?: number } | null;
    return v && v.d === todayKST() && typeof v.n === "number" ? v.n : 0;
  } catch {
    return 0;
  }
}

/** 오늘 남은 무료 코디 횟수 */
export function freeLeft(): number {
  return Math.max(0, FREE_DAILY - read());
}

/** 코디를 끝까지 받았을 때 한 번 센다. 남은 횟수를 돌려준다 */
export function spendFree(): number {
  const n = read() + 1;
  try { localStorage.setItem(KEY, JSON.stringify({ d: todayKST(), n })); } catch { /* 저장 못 하면 세지 않음 */ }
  return Math.max(0, FREE_DAILY - n);
}
