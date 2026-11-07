/* ── AI 코디 남용 막기 (2026-11-08) ──
   AI 코디는 부를 때마다 Claude 크레딧이 든다. 누가 프로그램으로 반복 호출하지 못하게
   1) 우리 사이트에서 보낸 요청인지(Origin) 확인하고
   2) 같은 IP가 짧은 시간에 너무 많이 부르면 잠시 막는다.
   Edge 서버 인스턴스마다 따로 세는 간단한 방식이라 완벽하진 않다.
   최종 안전장치는 Anthropic 콘솔의 월 사용 한도다. */

const ALLOWED_ORIGIN = /^https:\/\/(onulfit\.com|stylefit-[a-z0-9-]+\.vercel\.app)$|^http:\/\/localhost(:\d+)?$/;

/** 브라우저는 POST 요청에 Origin을 항상 붙인다. 없거나 다른 사이트면 거절 */
export function isAllowedOrigin(origin: string | null): boolean {
  return !!origin && ALLOWED_ORIGIN.test(origin);
}

const WINDOWS = [
  { ms: 60_000, max: 6 },        // 1분에 6번
  { ms: 60 * 60_000, max: 40 },  // 1시간에 40번
];
const hits = new Map<string, number[]>();

export function clientIp(headers: Headers): string {
  return (headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || headers.get("x-real-ip") || "unknown";
}

/** 허용이면 0, 막아야 하면 다시 시도할 수 있을 때까지 남은 초 */
export function rateLimit(key: string, now = Date.now()): number {
  const longest = WINDOWS[WINDOWS.length - 1].ms;
  const list = (hits.get(key) ?? []).filter((t) => now - t < longest);
  for (const w of WINDOWS) {
    const inWin = list.filter((t) => now - t < w.ms);
    if (inWin.length >= w.max) {
      hits.set(key, list);
      return Math.max(1, Math.ceil((inWin[0] + w.ms - now) / 1000));
    }
  }
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > longest) hits.delete(k);
  }
  return 0;
}
