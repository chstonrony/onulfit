"""실사 누끼용 프롬프트 (GPT Image 2, medium) — 오프화이트 옷을 검정 바탕에 찍어
   흑백 누끼로 만든 뒤, 사이트에서 추천 색·무늬를 입힌다. (knit/pants/loafer는 2026-11-07 테스트분)"""
import json, sys

T = ("Pinterest-style flat lay product photo shot from directly above: {d}, in plain undyed off-white {m}, "
     "laid flat with natural relaxed wrinkles and realistic material detail. Soft natural daylight, subtle film grain, "
     "editorial and effortless. The item sits centered on a pure solid black background with nothing else in the frame, "
     "clean edges, generous margin. No people, no hands, no props, no text, no logo, no pattern.")
S = ("Pinterest-style product photo from a three-quarter top-down angle: {d}, in plain off-white {m}, realistic material detail. "
     "Soft natural daylight, subtle film grain, editorial and effortless. Centered on a pure solid black background with nothing "
     "else in the frame, clean edges, generous margin. No people, no hands, no props, no text, no logo.")

ITEMS = {  # kind: (설명, 소재, 템플릿)
 # 기존 29종 중 남은 26종
 "turtleneck": ("a single women's fitted ribbed turtleneck knit top with long sleeves", "fine wool knit", T),
 "cardigan": ("a single women's classic crew-neck button-front knit cardigan", "wool knit", T),
 "vest": ("a single women's V-neck sleeveless knit sweater vest", "wool knit", T),
 "shirt": ("a single women's relaxed oversized button-up shirt with collar and cuffs", "cotton poplin", T),
 "tee": ("a single women's relaxed crew-neck short-sleeve t-shirt", "cotton jersey", T),
 "sleeveless": ("a single women's sleeveless ribbed tank top", "cotton rib knit", T),
 "wide": ("a single pair of women's high-waisted wide-leg trousers with front pleats", "wool-blend fabric", T),
 "jeans": ("a single pair of women's straight-leg five-pocket jeans with visible stitching", "ecru denim", T),
 "skirt": ("a single women's A-line midi skirt", "cotton twill", T),
 "miniskirt": ("a single women's A-line mini skirt", "wool", T),
 "dress": ("a single women's long-sleeve midi dress with a defined waist", "crepe fabric", T),
 "coat": ("a single women's long single-breasted coat with notch lapels", "wool", T),
 "trench": ("a single women's classic double-breasted trench coat with belt", "cotton gabardine", T),
 "jacket": ("a single women's short cropped jacket with collar and button front", "cotton twill", T),
 "padding": ("a single women's short puffer down jacket with quilted channels", "matte nylon", T),
 "boot": ("a pair of women's ankle boots with a low block heel", "smooth leather", S),
 "longboot": ("a pair of women's knee-high boots with a low block heel", "smooth leather", S),
 "heel": ("a pair of women's pointed-toe pumps with a mid heel", "smooth leather", S),
 "sneaker": ("a pair of women's minimal low-top lace-up sneakers", "leather", S),
 "sandal": ("a pair of women's flat strappy sandals", "leather", S),
 "scarf": ("a single long rectangular muffler scarf with fringe, loosely folded", "wool knit", T),
 "bag": ("a single women's structured top-handle handbag", "smooth leather", S),
 "earring": ("a pair of chunky hoop earrings", "matte enamel", S),
 "necklace": ("a single delicate chain necklace with a small round pendant, laid in a loose curve", "matte pale metal", T),
 "belt": ("a single women's belt with a simple rounded buckle, loosely coiled", "leather", T),
 "hat": ("a single women's wide-brim fedora hat", "wool felt", S),
 # 디테일 30종
 "cable_knit": ("a single women's chunky crew-neck sweater with bold braided cable-knit pattern", "wool knit", T),
 "polo_knit": ("a single women's long-sleeve knit polo sweater with collar and short button placket", "fine knit", T),
 "vneck_cardigan": ("a single women's fitted V-neck button cardigan", "fine wool knit", T),
 "crop_cardigan": ("a single women's cropped short knit cardigan with small buttons", "soft knit", T),
 "ribbon_blouse": ("a single women's long-sleeve blouse with a tie-neck ribbon bow", "silky satin", T),
 "sweatshirt": ("a single women's relaxed crew-neck sweatshirt", "cotton fleece", T),
 "hoodie": ("a single women's oversized pullover hoodie with drawstrings and kangaroo pocket", "cotton fleece", T),
 "knit_dress": ("a single women's long-sleeve ribbed knit midi dress", "rib knit", T),
 "shirt_dress": ("a single women's collared button-front shirt dress with a fabric belt", "cotton", T),
 "pleated_skirt": ("a single women's knife-pleated midi skirt", "lightweight wool", T),
 "slip_skirt": ("a single women's bias-cut slip midi skirt", "satin", T),
 "cargo_pants": ("a single pair of women's relaxed cargo pants with flap side pockets", "cotton twill", T),
 "shorts": ("a single pair of women's tailored bermuda shorts with front pleats", "wool-blend fabric", T),
 "denim_skirt": ("a single women's denim midi skirt with a front slit", "ecru denim", T),
 "tweed_jacket": ("a single women's boxy collarless jacket with frayed trim and buttons", "boucle tweed", T),
 "double_coat": ("a single women's long double-breasted coat with wide lapels", "wool", T),
 "leather_jacket": ("a single women's cropped biker jacket with zips", "leather", T),
 "blazer": ("a single women's oversized single-breasted blazer with notch lapels", "wool", T),
 "shearling": ("a single women's aviator jacket with fleece collar and fleece lining", "suede and shearling", T),
 "varsity": ("a single women's varsity bomber jacket with ribbed collar and cuffs", "wool with leather sleeves", T),
 "maryjane": ("a pair of women's mary jane flats with a buckle strap", "patent leather", S),
 "chelsea": ("a pair of women's chelsea boots with elastic side panels", "smooth leather", S),
 "ugly_sneaker": ("a pair of women's chunky dad sneakers with layered panels", "leather and mesh", S),
 "mule": ("a pair of women's square-toe slip-on mules with a low heel", "smooth leather", S),
 "ballet": ("a pair of women's ballet flats with a small bow", "soft leather", S),
 "tote": ("a single large soft tote bag", "leather", S),
 "shoulder_bag": ("a single small baguette shoulder bag with a short strap", "smooth leather", S),
 "beanie": ("a single ribbed knit beanie with a folded cuff", "wool knit", S),
 "cap": ("a single six-panel baseball cap with a curved brim", "cotton twill", S),
 "beret": ("a single classic beret", "wool felt", S),
}

def prompt(k):
    d, m, t = ITEMS[k]
    return t.format(d=d, m=m)

if __name__ == "__main__":
    keys = list(ITEMS)
    start, end = int(sys.argv[1]), int(sys.argv[2])
    print(json.dumps([{"index": i, "params": {"model": "gpt_image_2", "aspect_ratio": "1:1", "quality": "medium", "count": 1, "prompt": prompt(keys[i])}}
                      for i in range(start, min(end, len(keys)))], ensure_ascii=False))
