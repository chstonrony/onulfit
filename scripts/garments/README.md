# 옷 그림(잉크 워시) 다시 만들기

코디 카드의 옷 그림은 `public/garments/`에 있다. 종류마다 2개 파일:
- `{kind}.webp` — 흑백 잉크 워시 그림 (곱하기로 추천 색 위에 겹침)
- `{kind}-mask.png` — 옷 영역 알파 (이 안에만 추천 색을 깐다)

만든 방법 (2026-11-07):
1. `prompts.py`의 공통 문장 + 종류별 설명으로 GPT Image 2(quality medium, 1:1)에서 생성 (힉스필드, 장당 1크레딧). 니트(knit)는 같은 문장의 시안 그림을 썼다.
2. 원본 1024px PNG를 `{kind}.png`로 한 폴더에 모은 뒤 `python3 process.py <원본폴더> <출력폴더>` → 출력 파일을 `public/garments/`에 복사.

종류를 고르는 규칙과 화면 표시는 `components/GarmentArt.tsx`.
원본 PNG는 볼트의 `onulfit-kit/2026-11-07_AI일러스트시안/잉크워시_세트/`에 있다.
