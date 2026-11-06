"""검정 바탕 실사 → 흑백 누끼(RGBA). 바깥 검정만 지우고 옷 안쪽 그림자(신발 안, 깃 아래)는 남긴다. (PIL만 사용)"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops
SRC, DST = "photo_raw", "photo_cut"
os.makedirs(DST, exist_ok=True)
def cut(name):
    L = Image.open(f"{SRC}/{name}.png").convert("L")
    m = L.point(lambda v: 255 if v > 26 else 0).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    w, h = m.size
    for xy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if m.getpixel(xy) == 0: ImageDraw.floodfill(m, xy, 128)
    filled = m.point(lambda v: 0 if v == 128 else 255)
    # 손잡이·귀걸이 고리·샌들 끈 사이처럼 갇힌 배경(거의 순검정, 일정 크기 이상)도 지운다
    dark = L.point(lambda v: 255 if v <= 14 else 0).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))
    alpha = ImageChops.subtract(filled, dark).filter(ImageFilter.GaussianBlur(1.2))
    # 밝기 정규화: 옷 픽셀 90% 지점 → 250
    hist = L.histogram(mask=alpha.point(lambda v: 255 if v > 200 else 0))
    tot = sum(hist); acc = 0; p90 = 255
    for v, c in enumerate(hist):
        acc += c
        if tot and acc >= tot * 0.9: p90 = v; break
    k = 250.0 / max(p90, 1)
    g = L.point(lambda v: min(255, int(v * k)))
    out = Image.merge("RGBA", [g, g, g, alpha])
    bb = alpha.getbbox()
    if bb:
        pad = 6; out = out.crop((max(bb[0]-pad,0), max(bb[1]-pad,0), min(bb[2]+pad,w), min(bb[3]+pad,h)))
    out.thumbnail((520, 520), Image.LANCZOS)
    out.save(f"{DST}/{name}.png", optimize=True)
    return out.size
names = sys.argv[1:] or [f[:-4] for f in sorted(os.listdir(SRC)) if f.endswith(".png")]
for n in names: print(n, cut(n))
