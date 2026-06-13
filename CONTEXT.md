# 오늘핏 — 작업 컨텍스트

> 프로젝트 현재 상태·작업 흐름 추적. **작업 후 항상 업데이트.**
> "오늘 시리즈" 3번째: 오늘무드(감정)·오늘눈치(관계 공기)·**오늘핏(패션)**

---

## 프로젝트 정체성

**오늘핏 (onulfit.com)**
- AI 패션 코디 — "오늘 뭐 입지?"를 감정·기분·날씨·상황으로 풀어주는 서비스
- 차별점: **체형 3분류(스트레이트/웨이브/내추럴) + 퍼스널컬러 4계절** 기반 개인 맞춤
- 세계관 캐릭터: **결** 🧵 — 옷장에 사는 정령, "당신에게 어울리는 결을 찾아줘요" (우걱이·낌새 대응)
- 타겟 페르소나: 30~50대 여성. 대표 = 37세 세 아이 엄마, 실용파, 동창회에 뭘 입을지 막막한 사람. "에너지 아끼게 골라준다"가 핵심 가치
- 수익: 제휴 쇼핑(무신사·지그재그·29cm 등) 수수료 + AdSense 가능성
- 비용 주의: 추천 1회당 Claude API 비용 발생(형제 사이트와 달리 정적 아님)

## 기술 스택 / 배포
- **Next.js 15** (App Router), React 19, TS, Tailwind v4
- AI: Anthropic API **fetch 직접 호출**(Edge Runtime 호환, SDK는 node:path 의존으로 미사용). 모델 claude-sonnet-4-6, 프롬프트 캐싱 사용
- **배포: Cloudflare Pages** (wrangler.toml + @cloudflare/next-on-pages). GitHub: chstonrony/onulfit. (.vercel 링크도 있으나 CF가 주)
- 데모 모드: ANTHROPIC_API_KEY 없으면 mockData 반환 (lib/mockData.ts)
- 로컬 개발 포트: 3200 (.claude/launch.json onulfit-dev — Onulmood 세션 기준)

## 구조 메모
- `app/page.tsx` — 메인(채팅형). 좌측 상황선택/우측 코디결과, 모바일 탭. THEMES(무드 5종) CSS 변수 기반
- `app/api/outfit/route.ts` — POST {situation, bodyType?, colorType?} → Claude → OutfitRecommendation JSON
- `lib/claude.ts` — SYSTEM_PROMPT(결 페르소나 포함) + `buildProfileGuide(body,color)` 프롬프트 주입 빌더
- `lib/profile.ts` — 체형·컬러 타입, BODY_META/COLOR_META(어울림·피할것·promptGuide), 자가진단 문항(BODY 5·COLOR 5), scoreBody/scoreColor, localStorage(`onulfit.profile.v1`)
- `lib/gyeol.ts` — 결 캐릭터 카피 + GYEOL_PERSONA_PROMPT
- `components/Diagnosis.tsx` — 진단 오버레이(인트로→골격5→컬러5→결과). saveProfile + onComplete
- `lib/shopping.ts` — 무신사/지그재그/W컨셉 **검색 URL**(아직 제휴 태그 X — 수수료 0)
- `lib/themes.ts` `lib/colors.ts` `lib/mockData.ts`

## 세션 로그

### 2026-06-13 세션 1 — 1단계: 결 캐릭터 + 체형·퍼스널컬러 자가진단
- 기존 사이트 진단: "범용 AI 코디 챗봇"까지만 구현돼 있고 기획 차별점(체형·컬러·옷장사진·제휴)은 미구현 상태였음
- **결 캐릭터 확정**(사용자) — 옷장 정령, 천의 "결" + "결이 맞다(어울린다)" 이중의미. glyph 🧵(임시, 추후 일러스트)
- **자가진단 도입**(사진 X): 골격 5문항(손목/살붙음/상체두께/쇄골/칭찬옷)·컬러 6문항(핏줄/금은/흰옷/얼굴/명도) → 스트레이트·웨이브·내추럴 / 봄웜·여름쿨·가을웜·겨울쿨
- **프로필 주입**: 진단 결과 localStorage 저장 → /api/outfit에 bodyType·colorType 전달 → buildProfileGuide가 골격·컬러 promptGuide를 user 메시지에 붙임 → 체형·색 맞춤 코디
- **UI**: 채팅 상단 ProfileChip(진단 진입/현재 프로필 표시), Diagnosis 오버레이(결 인트로·문항·결과 카드)
- 빌드·프리뷰 검증: 진단 플로우 완주→저장→칩 갱신("내 결 · 스트레이트 · 봄 웜")·콘솔 에러 0

## 다음 작업 후보 (로드맵)
- [ ] **2단계**: 페르소나 타겟 랜딩/카피(동창회 막막함 공감) + 상황·날씨·장소 구조화 입력
- [ ] **3단계**: 제휴 링크 정식 구조 — 무신사/지그재그/29cm 어필리에이트 **가입(사용자)** 후 태그 적용. lib/shopping.ts에 태그 자리 마련
- [ ] **4단계**: 옷장 사진 업로드 + Claude 비전으로 "내 옷 중에서 골라주기" (가장 무거움·비용/프라이버시 설계)
- [ ] SEO/AdSense: 콘텐츠(체형별 코디 가이드 등) + sitemap/robots/정책 페이지 — 오늘무드·오늘눈치 플레이북 적용
- [ ] 결 일러스트 확정(🧵 대체)
- [ ] 결과지에 결 코멘트 화자 노출 강화(OutfitCard)

*마지막 업데이트: 2026-06-13*
