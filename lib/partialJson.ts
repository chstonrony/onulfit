/* ── AI가 쓰는 중인 JSON 앞부분을 안전하게 읽기 ──
   글자가 조금씩 들어오는 동안, "값 하나가 끝난 자리"(문자열 밖의 , 나 } ])까지만 잘라
   열린 괄호를 닫아 JSON.parse 한다. 쓰다 만 글자는 절대 섞이지 않는다. */

/** ```json 울타리를 벗긴 본문 */
export function stripFence(text: string): string {
  return text.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
}

export function parseSafePrefix(raw: string): unknown | null {
  const s = stripFence(raw);
  const start = s.indexOf("{");
  if (start < 0) return null;

  const stack: string[] = [];
  let inStr = false;
  let esc = false;
  let cut = -1; // 잘라 낼 위치(이 위치 앞까지 사용)
  let cutStack = "";

  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") stack.push("}");
    else if (c === "[") stack.push("]");
    else if (c === "}" || c === "]") {
      stack.pop();
      cut = i + 1;
      cutStack = stack.join("");
      if (stack.length === 0) break;
    } else if (c === ",") {
      cut = i;
      cutStack = stack.join("");
    }
  }

  if (cut < 0) return null;
  const closed = s.slice(start, cut) + cutStack.split("").reverse().join("");
  try {
    return JSON.parse(closed);
  } catch {
    return null;
  }
}
