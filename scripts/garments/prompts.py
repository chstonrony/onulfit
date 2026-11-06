import json
T=("Fashion illustrator's ink wash drawing of {x}, {v}, floating on its own (no model, no mannequin, no hanger, no body), centered with generous white space around it. "
"Fine black ink pen lines with slightly loose, elegant strokes and a clearly closed continuous outline, showing {d}, a few delicate pencil hatching marks, "
"and soft diluted gray ink washes that pool gently in the folds and shadows, bleeding slightly at the edges like watercolor. Plenty of untouched white highlights. "
"Refined, calm, elegant fashion atelier sketchbook mood. Strictly monochrome black and gray ink only, pure flat white background, no paper texture, no color, no text, no logo, no signature.")
G=[
("turtleneck","a single women's fitted ribbed turtleneck knit sweater","front view with soft natural drape","the folded ribbed turtleneck collar, ribbed cuffs and hem"),
("cardigan","a single women's V-neck button-front knit cardigan, buttoned","front view with soft natural drape","the V-neckline, button placket with small buttons, ribbed cuffs and hem"),
("vest","a single women's V-neck sleeveless knit vest","front view","the ribbed V-neck, ribbed armholes and hem"),
("shirt","a single women's silk button-up blouse with a soft collar","front view with gentle drape","the collar, button placket, cuffs and soft folds of the silk"),
("tee","a single women's crew-neck short-sleeve cotton t-shirt","front view","the crew neckline, short sleeves and soft fabric folds"),
("sleeveless","a single women's sleeveless fine-knit top","front view","the rounded neckline, clean armholes and hem"),
("pants","a single pair of women's straight tailored trousers (slacks)","front view, legs straight down","the waistband, front pleats, pressed center creases and slanted pockets"),
("wide","a single pair of women's high-waisted wide-leg pleated trousers","front view, legs straight down","the waistband, deep pleats and the flowing wide legs"),
("jeans","a single pair of women's straight-leg denim jeans","front view, legs straight down","the waistband, button, front pockets, topstitching and slight denim wrinkles"),
("skirt","a single women's flowing pleated midi skirt","front view","the waistband and soft flowing pleats"),
("miniskirt","a single women's A-line mini skirt","front view","the waistband and a gently flared A-line hem"),
("dress","a single women's long-sleeve knee-length dress","front view with soft natural drape","the neckline, sleeves, defined waist and gently flared skirt"),
("coat","a single women's long double-breasted wool coat","front view","the wide lapels, double row of buttons, pockets and long clean silhouette"),
("trench","a single women's classic belted trench coat","front view","the storm flap, lapels, double-breasted buttons, tied waist belt and epaulettes"),
("jacket","a single women's tailored single-breasted blazer","front view","the notched lapels, two buttons, flap pockets and structured shoulders"),
("padding","a single women's cropped quilted puffer down jacket with a high collar","front view","the puffy horizontal quilted channels, zipper and high collar"),
("boot","a single women's leather ankle boot with a block heel","side view","the block heel, sole, side seam and soft leather creases"),
("longboot","a single women's knee-high leather boot with a slim heel","side view","the tall shaft, heel, sole and soft leather creases"),
("heel","a single women's pointed-toe leather pump high heel","side view","the pointed toe, slim heel and elegant curved silhouette"),
("loafer","a single women's leather penny loafer","side three-quarter view","the moc-toe stitching, penny strap and low heel"),
("sneaker","a single women's minimal low-top leather sneaker","side view","the laces, eyelets, rubber sole and clean panels"),
("sandal","a single women's strappy flat leather sandal","side three-quarter view","the thin straps, buckle and flat sole"),
("scarf","a single long knit wool muffler scarf loosely folded and draped","front view","the knit texture, soft folds and fringed ends"),
("bag","a single women's structured leather shoulder bag with a top handle","front view","the flap, clasp, handle, stitching and soft leather sheen"),
("earring","a single pair of elegant drop earrings","front view, side by side","the small hooks and teardrop-shaped drops"),
("necklace","a single delicate fine chain necklace with a small pendant, laid in a soft curve","front view","the fine chain links and small pendant"),
("belt","a single women's leather belt loosely coiled","top view","the buckle, belt holes, stitching and leather texture"),
("hat","a single soft wool beret","three-quarter view","the soft fold, slight slouch and small stem on top"),
]
json.dump([{"index":i,"kind":k,"prompt":T.format(x=x,v=v,d=d)} for i,(k,x,v,d) in enumerate(G)],open(__import__("sys").argv[1],"w"),ensure_ascii=False,indent=0)
print(len(G))
