# 잉크 워시 원본(1024 흰 바탕) → 사이트용 2개 파일
#   {kind}.webp      : 흑백 그림(곱하기로 색을 입힘)
#   {kind}-mask.png  : 옷 영역(알파) — 이 안에만 추천 색을 깐다
import sys, os
from PIL import Image, ImageDraw, ImageFilter, ImageChops
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
SIZE = 320
for fn in sorted(os.listdir(src)):
    if not fn.endswith(".png"): continue
    kind = fn[:-4]
    g = Image.open(os.path.join(src, fn)).convert("L")
    W, H = g.size
    # 1) 칠해진 곳(선+먹) = 벽, 3px 두껍게 해 틈 막기
    wall = g.point(lambda v: 255 if v < 235 else 0).filter(ImageFilter.MaxFilter(7))
    # 2) 네 귀퉁이에서 바깥 배경 채우기(128)
    for p in [(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1)]:
        if wall.getpixel(p) == 0: ImageDraw.floodfill(wall, p, 128)
    mask = wall.point(lambda v: 0 if v == 128 else 255)
    # 3) 가는 삐침 깎기(열기)
    mask = mask.filter(ImageFilter.MinFilter(15)).filter(ImageFilter.MaxFilter(15))
    # 4) 내용 영역으로 정사각형 자르기(여백 8%)
    ink = g.point(lambda v: 255 if v < 235 else 0)
    bb = ImageChops.lighter(ink, mask).getbbox() or (0, 0, W, H)
    cx, cy = (bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2
    half = max(bb[2] - bb[0], bb[3] - bb[1]) / 2 * 1.08
    box = tuple(int(round(v)) for v in (cx - half, cy - half, cx + half, cy + half))
    def crop(im, fill):
        c = Image.new(im.mode, (box[2] - box[0], box[3] - box[1]), fill)
        c.paste(im, (-box[0], -box[1]))
        return c.resize((SIZE, SIZE), Image.LANCZOS)
    crop(g, 255).convert("RGB").save(os.path.join(out, f"{kind}.webp"), quality=86)
    m = crop(mask, 0)
    rgba = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0)); rgba.putalpha(m)
    rgba.save(os.path.join(out, f"{kind}-mask.png"), optimize=True)
    cover = sum(1 for v in m.getdata() if v > 128) / (SIZE * SIZE)
    print(f"{kind:12s} cover={cover:.2f}")
