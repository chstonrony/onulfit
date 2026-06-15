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
- **배포: Vercel (실제 라이브)** — onulfit.com은 Vercel 서빙(server: Vercel 확인, 프로젝트명 stylefit, 오늘무드·오늘눈치와 같은 팀). **git push로 자동배포 안 됨 → `vercel --prod`로 배포**. wrangler.toml/@cloudflare/next-on-pages는 옛 실험 흔적(미사용). GitHub: chstonrony/onulfit
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

### 2026-06-15 세션 10 — 홈 히어로 리디자인 (거울셀카 실사 + 클린 인플루언서 피드) [배포 완료]
- **무드 디렉션 확정**(대표님 레퍼 5장): 집에서 찍은 실사·편안+정제미·베이지/브라운/카키+한 끗 포인트. 차별화 컨셉으로 "무드보드/핀보드" 제안 → 홈에 폴라로이드(테이프·기울임·종이매트·손글씨캡션) 1차 시안. 대표님 "폴라로이드는 올드" → **클린 인플루언서 피드**로 선회
- **히어로 최종**(app/page.tsx WelcomeView): 풀블리드 둥근(22px) 이미지 + 프로스티드 글래스 '오늘의 무드' 칩 + onulfit 워터마크 + 정돈된 헤드라인('결'만 테라코타) + 테라코타 CTA
- **히어로 이미지 교체**: AI 스튜디오 화보(촌스러움) → **실사 거울셀카**(Midjourney 생성, 흰 캐미+올리브 스커트+브라운 부츠, 흐트러진 침대 일상감). 파일 `public/hero-main.png`(대표님이 public 루트에 png로 저장 → src를 /hero-main.png로 지정), objectFit cover 500px center 30%
- 사진 워크플로: 채팅 업로드 이미지는 코드로 직접 못 가져옴 → 대표님이 MJ로 생성·다운로드해 폴더에 저장하는 협업 방식. MJ 프롬프트는 온이 작성(거울셀카 일상스냅 감성, --style raw --s 50, 이미지 --sref 권장)
- 검증: 빌드 통과, 로컬 모바일 스샷, 라이브 onulfit.com 200·hero-main.png 200. 커밋 3513235
- **다음**: 결과 화면을 같은 클린 톤으로(이미지 중심) / 더 "집컷" 같은 히어로 사진 추가 생성 / 무신사·지그재그 제휴는 트래픽 후 재도전(쿠팡은 안 붙이기로)

### 2026-06-15 세션 9 — 시그니처 컬러(테라코타) + Pretendard 로딩 버그 수정 [배포 완료]
- **시그니처 컬러**: everyday 테마 포인트색이 사실상 먹색(--t-acc #2C2825)이라 "눈에 안 띔". 3안(와인/테라코타/딥로즈)을 로컬 dev에 실제 입혀 모바일 스샷 비교 → 대표님 **테라코타(#B0512E)** 선택. --t-point #C2683F, 보조텍스트 대비 #9B8E85→#6E635B. 활성 무드 알약·CTA·칩·하단탭 등 --t-acc 구동부 전반에 적용(themes.ts everyday만 변경, 타 무드 유지)
- **Pretendard 로딩 버그(중요)**: 세션8에서 globals.css `@import url(pretendard)`로 넣었으나 Tailwind v4 `@import "tailwindcss"` 전개 뒤로 밀려 "@import must precede all rules" 위반 → dev 500, **프로덕션선 한글 본문이 폴백 폰트로 표시 중이었음**(인라인 --font-noto-sans 변수만 있고 폰트 파일 미로드). globals.css @import 제거 + layout.tsx `<head><link rel=stylesheet>`로 교체 → dev `document.fonts.check` true 확인
- 검증: 빌드 통과, 로컬 모바일 스샷(테라코타·Pretendard), 라이브 onulfit.com 200·Pretendard link 노출·#B0512E 번들 반영. 커밋 fb08405, `vercel --prod`
- **다음 후보**: 대비 추가 손질(로고/서브텍스트), CTA·결과 카드에 테라코타 활용 확대, 다른 무드 테마도 포인트색 점검

### 2026-06-15 세션 8 — 타이포 개편 (폰트 정체성) [배포 완료]
- **문제**: 대표님 — 전체 디자인이 눈에 안 띔 + "에브리데이 폰트" 안 어울림. 확인 결과 ① 본문 Jost(템플릿 느낌)+한글 Noto Sans(기본값) ② 무드 헤더(ColorPalette) 대형 이탤릭 "Everyday"가 모바일에서 과대
- **layout.tsx**: 디스플레이/라벨 폰트 **Jost 제거 → Fraunces**(패션 매거진 세리프, 변수 --font-cormorant 유지해 인라인 참조 무수정). 한글 본문 **Noto Sans KR → Pretendard**(globals.css CDN @import + <html> 인라인 style로 --font-noto-sans 재배선, --font-jost→var(--font-cormorant))
- **ColorPalette.tsx**: 무드명 clamp(62~92px)→clamp(36~60px) 축소. 최종 대표님 지정 — **OnulFit 로고와 동일 서체 Georgia 이탤릭**(로고 SVG가 Georgia italic). 이탤릭 정자 논의 후 로고 통일로 확정
- 검증: 로컬 dev(3200) 모바일 393px 스샷 비교(데모 강제→원복), 라이브 onulfit.com 200·HTML 인라인 "Pretendard Variable" 확인. 커밋 5686173, `vercel --prod`
- ※ 프리뷰(vercel 비-prod) URL은 Deployment Protection으로 401 → 폰 확인 불가라 프로덕션 직접 배포함
- **다음**: 시그니처 컬러 + 대비 강화("눈에 확 띄게")는 별도 시안 후 진행 예정(폰트만으론 임팩트 부족 — 색·대비 문제)

### 2026-06-15 세션 7 — 무신사·지그재그 검색 링크 실작동 수정 [배포 완료]
- **증상**: ItemCard의 무신사·지그재그·W컨셉 버튼은 이미 노출돼 있었으나, 검색 키워드에 색상어·성별어가 붙어(`아이보리 실크 블라우스 여성`) 클릭 시 결과 0~몇 건 → "링크 눌렀는데 아무것도 없음"
- **shopping.ts**: `normalizeKeyword()` 추가(성별어 제거+공백 정리, LLM 생성분까지 보호). 무신사 검색 URL `/search/musinsa/goods?q=` → `/search/goods?keyword=`(옛 308→새 200 확인). zigzag/W컨셉/29cm도 정규화 적용
- **mockData.ts**: 데모 searchKeyword 전부 품목 위주로 단축(`새틴 미디 스커트 베이지 여성`→`새틴 미디 스커트` 등)
- **claude.ts**: SYSTEM_PROMPT에 "searchKeyword = 짧은 품목 키워드 2~3단어, 색·성별어 제외" 규칙 명시(예: 누드 스트랩 힐 여성 베이지→스트랩 힐)
- 로컬 빌드 통과(12/12) → `vercel --prod` 배포(dpl_5UfXxnY8…, READY), onulfit.com 200·zigzag 검색 200 확인. 커밋 dd33641
- ※ 직전 배포 에러는 빌드/CLI 문제 아니었음(이번 로컬 빌드·vercel 로그인 정상). 현 시점 정상 배포됨

### 2026-06-15 세션 6 — 첫인상 리디자인 + W컨셉 제휴 연결 (수익 구조 첫 가동) [전부 배포]
- **메인 히어로 AI 화보**: 미드저니 생성 패션 화보(베이지 트렌치·아이보리 니트·와이드 팬츠)를 단일 풀화면 히어로로(콜라주 폐기). 4컷 `public/lookbook/`(hero-main + look-a/b/c). objectPosition center 22%. 대표님: 일상 스냅 콜라주 임팩트 약함 → AI 화보로
- **진단 선택지 시각화**(Diagnosis.tsx): 골격 선택지에 체형 실루엣 SVG(straight/wave/natural), 컬러 선택지에 색 스와치. QuestionView에 kind+value 전달. OptionVisual 컴포넌트
- **퍼스널컬러 색칩**: 결과 베스트/피해야 할 색을 COLOR_HEX 매핑으로 실제 색 동그라미 표시(텍스트만 → 시각)
- **가이드→진단 흐름 버그 수정**: /guide CTA가 홈으로만 가서 진단 안 열리던 문제 → href `/?diag=1` + 홈에서 감지해 자동 오픈(history.replaceState로 URL 정리). 문구 "무료로 내 결 찾기" 통일
- **모바일 첫화면 스크롤 버그 수정**: 웰컴 화면에서 chatBottomRef 자동 스크롤이 히어로를 지나치던 문제 → messages.length===0이면 스크롤 생략
- **실타래 이모지(🧵) 전면 제거**: GYEOL.glyph ''→ 로고 심볼 GyeolMark(원+실타래, onulfit 로고서 추출, 테마색). 헤더·인트로·결과리드·ProfileChip·StoryCard 전부
- **W컨셉 제휴 연결**(수익 첫 가동): 링크프라이스 승인(제휴ID A100705248, 최대 2.1%). `shopping.ts` wconceptLink(딥링크 `bestmore.net/click.php?m=wconcept&a=...&l=9999&l_cd1=3&l_cd2=0&tu={타겟URL}`). 결과에 'SHOP·내 컬러로 쇼핑'(베스트컬러+아이템 검색칩)
- **완성 코디 카드**(대표님 핵심 비전): `lib/lookbookData.ts`(CuratedLook, looksFor) + `components/CompletedLook.tsx`. 결 큐레이션 룩=상품 조합(사진+가격+딥링크). 첫 룩=원피스(179,550)+청키샌들(93,000)+미니호보백(208,000). W컨셉 상품 메타는 curl+브라우저UA로 og:image/itemName/price 추출(WebFetch는 403). CDN 핫링크 onulfit referer 200 확인
- **제휴 현황**: W컨셉 승인·라이브. 무신사 큐레이터(creatormarketplace, 수수료~10%) 신청 완료·심사 대기. 지그재그 크리에이터 라운지·29cm(무신사 계열)는 후보. 지그재그/29cm/무신사는 링크프라이스 미입점 → 각사 크리에이터 프로그램(인스타 whatareyoudoin_rua로 신청). 링크프라이스 실명인증 미완(W컨셉 수수료 출금 시 필요)
- **다음**: 무신사 승인 시 링크 연결 / W컨셉 컬러별 완성 코디 확장(여름쿨·가을웜) / 메인 개인화(진단 프로필 맞춤 룩) / 유료 1:1 코디는 트래픽·신뢰 후
- **BM 방향**: 무료(제휴 수수료)로 트래픽·신뢰 → 트래픽 쌓이면 유료 프리미엄 1:1 맞춤 코디(19,000~49,000)

### 2026-06-13 세션 5 — 홈 비주얼 리디자인 (히어로 콜라주·시리즈 링크·반전 배너) [배포 완료]
- **히어로 전환**: 단일 얼굴 셀카(hero.jpg) → 운영자 실사진 다양한 룩 6컷 **반복 콜라주**(2열, 490px). 얼굴 노출 줄이고(워킹·옆/뒷모습) 핀터레스트 보드 감성. 카피 "오늘 뭐 입지, 그 고민은 결에게" 그라디언트 오버레이. 대표님 요청("내 얼굴 메인 부담 → 반복되는 사진 감성")
- **무드보드 정리**: 히어로가 그리드 역할 → 하단 중복 `<Moodboard>` 제거(import도 삭제). 9컷은 운영자 신규 추가분 다양한 룩으로 재구성 + PIL `exif_transpose` 방향 보정(돌아간 사진 0)
- **서브카피 폰트**: 산세리프(Noto Sans) → **고운바탕 세리프**(헤드라인과 톤 통일, 15px/행간1.85)
- **OnulSeries 신설**(components/series/OnulSeries.tsx): 오늘핏(현재)·오늘무드·오늘눈치 크로스링크 카드. 홈 하단 배치. 테마 vars 사용(베이지 톤)
- **스타일 가이드 배너 GuideBanner**: 흰 카드 → 포인트(골드 `${point}1A`) 틴트 카드. 호버/탭 시 골드 solid 배경 + 글씨 흰색 반전 + lift + shadow + 화살표 이동. 테마별 포인트색 자동 적용. 대표님 요청("거기만 다른 색, 클릭하면 재미나게")
- 빌드 12/12, 라이브 200(onulfit.com·hero.jpg·moodboard 전부), 커밋 790d2ee
- **배포 방식**: `vercel --prod --yes`(Vercel project "stylefit"). GitHub push는 자동배포 ❌ — Vercel CLI 직접 배포가 맞음
- hero.jpg(선글라스 셀카)는 폴더에 보존(향후 공유카드·about 등 활용 가능)

### 2026-06-13 세션 4 — 콘텐츠/SEO 기반 (A단계, 제휴 승인용 매체 콘텐츠)
- **콘텐츠 시스템 신설**: lib/articles.ts + /guide(목록) + /guide/[slug](상세, SSG) + sitemap.ts + robots.ts
- **가이드 글 5편**(styleGuide와 일관): golgyeok-self-check(골격 자가진단)·straight/wave/natural-styling(체형별 코디)·personal-color-guide(퍼스널컬러 4계절). 각 ## 소제목·리스트·코디공식, 진단 CTA·관련글 내부링크
- 상세에 BlogPosting JSON-LD, canonical, OG. 홈 WelcomeGuide에 /guide 링크
- 빌드 13/13 SSG, sitemap 7 URL, robots, 콘솔 0 검증
- **글 5편 800자+로 확장 완료**(843~1037자): 각 글에 아우터·소품/넥라인·원피스/헷갈릴때·활용 섹션 + 상황(동창회·하객) 적용 추가. 담백한 정보형 톤 유지(결 캐릭터는 진단/코디에만)
- ※ 배포: 이번 세션 커밋들 **GitHub 미푸시 = 라이브 미반영**. push 시 Cloudflare Pages 빌드

### 2026-06-13 세션 3 — 비주얼(핀터레스트) + 제휴 코드 자리
- **저작권 원칙 확정**: 인스타·핀터레스트 인플루언서/모델 사진 직접 호스팅 ❌(저작권+ToS, API로도 임의 피드 불가). → 합법 대안만 사용
- **lib/lookboards.ts + components/Lookboard.tsx**: ① 핀터레스트 검색 딥링크 칩(승인·큐레이션 없이 즉시 작동 — 체형/컬러/교차/2025SS) ② 운영자 보드 큐레이션 시 임베드(CURATED_BOARDS에 URL 넣으면 pinit.js 임베드 활성). 진단 리포트에 LOOKBOOK 섹션으로 노출
- **lib/shopping.ts 제휴 자리 마련**: withAffiliate() + AFFILIATE config(enabled/params). 현재 enabled=false(수수료 0). 29cm 추가. 승인 후 config만 채우면 전 링크 추적 태그 자동 부착
- 빌드·프리뷰 검증(룩북 칩 4종·콘솔 0)

#### ▶ 운영자 액션 (수익·비주얼 활성화 — 직접 해야 함)
1. **핀터레스트 보드 큐레이션**: 핀터레스트 계정에서 "2025 SS 트렌드"·체형별 보드 만들고 → 보드 URL을 lib/lookboards.ts CURATED_BOARDS에 붙여넣기 → 임베드 활성
2. **제휴 가입**(수익 본게임): 링크프라이스(무신사·W컨셉 등 다수)부터 추천 → 쿠팡파트너스. 승인 후 추적 파라미터를 lib/shopping.ts AFFILIATE.params에 입력 + enabled=true

### 2026-06-13 세션 2 — 스타일 가이드 심화 (전문가급 리포트 기반 = 유료 상품 원천)
- **lib/styleGuide.ts 신설** — 제품 핵심 자산, 4개 층:
  - L1 BODY_GUIDE: 체형 3종 × 아이템 9축(넥라인·어깨소매·상의·하의·원피스·아우터·소재·신발가방·액세서리) good/avoid + 골격특징·핵심원칙·흔한실수·코디공식. **3체형 모두 풀 작성(1차 초안)**
  - L2 COLOR_GUIDE: 4계절 × 베스트/워스트 컬러·메탈·메이크업·데님·팁
  - L3 CROSS_GUIDE: 체형×컬러 12조합 — 6조합 초안 + 6조합 TODO(감수)
  - L4 SITUATION_LOOKBOOK: 동창회·하객·학부모모임 3종(체형별 한 줄) + 데이트/출근 등 TODO
- **진단 결과 UI를 전문 리포트로 확장**(Diagnosis ResultView): 조합 페르소나 → 골격(원칙·특징) → 아이템별 ○/✕ 가이드 → 흔한 실수·코디 공식 → 컬러 상세(베스트팔레트·메탈·메이크업·데님) → 시그니처 룩
- **AI 추천 정밀화**(buildProfileGuide): styleGuide의 원칙·아이템 규칙·베스트컬러·실수를 프롬프트에 주입 → 색은 베스트 컬러 안에서만 선택
- **콘텐츠 정책**: Claude 1차 초안 → 운영자(스타일리스트) 감수·수정. styleGuide.ts 단일 파일만 고치면 전체 반영. [감수要]·TODO 표시
- 빌드·프리뷰 검증(웨이브×여름쿨 조합 리포트 전 섹션 렌더, 콘솔 0). ※ HMR 일시 오류는 서버 재시작으로 해소
- **다음**: 나머지 6 교차조합·상황 룩북 채우기(감수), 유료 상세 리포트 분기(B단계)

### 2026-06-13 세션 1 — 1단계: 결 캐릭터 + 체형·퍼스널컬러 자가진단
- 기존 사이트 진단: "범용 AI 코디 챗봇"까지만 구현돼 있고 기획 차별점(체형·컬러·옷장사진·제휴)은 미구현 상태였음
- **결 캐릭터 확정**(사용자) — 옷장 정령, 천의 "결" + "결이 맞다(어울린다)" 이중의미. glyph 🧵(임시, 추후 일러스트)
- **자가진단 도입**(사진 X): 골격 5문항(손목/살붙음/상체두께/쇄골/칭찬옷)·컬러 6문항(핏줄/금은/흰옷/얼굴/명도) → 스트레이트·웨이브·내추럴 / 봄웜·여름쿨·가을웜·겨울쿨
- **프로필 주입**: 진단 결과 localStorage 저장 → /api/outfit에 bodyType·colorType 전달 → buildProfileGuide가 골격·컬러 promptGuide를 user 메시지에 붙임 → 체형·색 맞춤 코디
- **UI**: 채팅 상단 ProfileChip(진단 진입/현재 프로필 표시), Diagnosis 오버레이(결 인트로·문항·결과 카드)
- 빌드·프리뷰 검증: 진단 플로우 완주→저장→칩 갱신("내 결 · 스트레이트 · 봄 웜")·콘솔 에러 0

## 수익 모델 — 우선순위 (★ 사용자 최우선 관심사)

> 핵심 판단(2026-06-13 논의): **제휴 수수료 단독 모델은 약함.**
> - 패션 제휴 = 박리(1~5%)×저전환(실구매 1~3%) → 트래픽 수십만 단위 전엔 사실상 0
> - **최대 리스크 = AI 비용 역마진**: 추천 1회마다 Claude 비용. 인기 끌수록 적자 가능 (형제 사이트와 결정적 차이)
> - "내 옷장 코디"는 에이클로짓 등 강자 선점 → 정면승부 불리
> - 단, 골격진단·퍼스널컬러 **트렌드는 진짜** + 만드는 비용 거의 0 + 브랜드 시리즈 자산 → 사이드로 키울 가치 충분
> **결론: 수익 기대를 "제휴"에서 "진단 상품 + 콘텐츠 트래픽 + CPA"로 이전.**

### 수익 우선순위 (높은 마진·단가 순)
1. **무료 트래픽 자산부터 (역마진 방지)** — 비용 안 드는 SEO 콘텐츠로 사람 먼저 모음. 유료 AI 추천을 트래픽 엔진으로 쓰지 말 것
   - 체형별 코디 가이드, 퍼스널컬러별 옷색, "동창회 룩북", "40대 하객룩" 등 검색의도형 글 (오늘무드·오늘눈치 플레이북)
   - 자가진단(설문)은 AI 비용 0 → 무료 진단을 트래픽 미끼로 적극 활용
2. **진단 상품화 (고마진, 100%)** — 무료 간이진단 → "상세 스타일 리포트 PDF / 내 체형·컬러 코디 가이드"를 소액 유료. 디지털 상품이라 AI 비용 1회성, 마진 100%
3. **CPA 리드젠 (고단가)** — 오프라인 퍼스널컬러·골격 컨설팅샵 제휴 → 예약 연결 건당 수수료(의류 제휴 대비 단가 수십 배)
4. **제휴(보조)** — 무신사/지그재그/29cm 어필리에이트. *주 수익 아님, 트래픽 커진 뒤 보조.* 가입(사용자)+태그 적용
5. **AdSense(보조)** — 콘텐츠 페이지에만. 도구 페이지는 PV 적어 효율 낮음

### 비용 가드레일 (역마진 방지 — 반드시 지킬 것)
- AI 추천에 rate limit / 일일 한도 / 캐싱 고려. "무제한 추천"으로 트래픽 받으면 비용 폭발
- 비용 안 드는 자산(진단 설문·SEO 글)으로 트래픽을 먼저, 유료 AI는 전환 깔때기 뒤쪽에 배치

## 기능 로드맵 (위 수익 우선순위를 받쳐주는 순서)
- [ ] **A. 콘텐츠/SEO 기반** (수익1 받침): 체형·퍼스널컬러 가이드 글 + sitemap/robots/정책/about + 결 세계관. 오늘무드·오늘눈치 플레이북 그대로
- [ ] **B. 진단 상품화** (수익2): 무료 결과 + 상세 리포트(유료) 분기. 결제는 토스페이먼츠/카카오페이 등 검토
- [ ] **C. 페르소나 랜딩** (전환): 동창회 막막함 공감 카피 + 상황·날씨·장소 구조화 입력
- [ ] **D. CPA 제휴** (수익3): 컨설팅샵 연결 자리 마련
- [ ] **E. 제휴 태그**(수익4) / **AdSense**(수익5): 트래픽 붙은 뒤
- [ ] **F. 옷장 사진 코디** (수익 아님·차별화): Claude 비전. 가장 무겁고 비용 큼 → 맨 나중, 유료 기능 후보
- [ ] 결 일러스트 확정(🧵 대체), OutfitCard에 결 코멘트 화자 강화

*마지막 업데이트: 2026-06-15 (세션 10)*
