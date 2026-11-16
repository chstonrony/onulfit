# Pretendard (한글 글꼴) — 사이트에서 직접 내려 주는 파일

- 출처: https://github.com/orioncactus/pretendard v1.3.9 (`packages/pretendard/dist/web/variable`의 dynamic subset)
- 라이선스: SIL Open Font License 1.1 (`LICENSE.txt`)
- 2026-11-16: 예전에는 jsdelivr CDN의 CSS를 불러 썼다. 다른 서버에 새로 연결하느라 첫 화면이 늦어져서
  같은 파일을 여기 두고 `app/layout.tsx`에서 `<link>`로 불러온다. 보관 기간(1년)은 `next.config.ts`의 `/fonts/` 규칙.
- 글자 범위별로 92조각으로 나뉘어 있어, 화면에 나온 글자가 든 조각만 받는다. 파일을 고치지 않는다.
