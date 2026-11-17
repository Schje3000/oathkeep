#!/usr/bin/env python3
# Misst die Bodenlinie jeder Seitenansicht-Szene: die waagrechte Kante, die über die meiste Breite läuft
# (Oberkante des Bodenstreifens). Ergebnis: y der Füsse im Bild.
# Nutzung: boden.py <ordner_mit_s_bildern> [ausgabe.json] [vorschau.png]
import sys, json, glob, os
from PIL import Image, ImageDraw

def floor(path):
    im = Image.open(path).convert('L'); px = im.load(); W, H = im.size
    best = (0, 400)
    for y in range(300, 496):
        n = sum(1 for x in range(0, W, 2) if px[x, y] - px[x, y - 1] < -18 or px[x, y] - px[x, y - 1] > 18)
        # Kante soll über viel Breite laufen; tiefer liegende Kanten leicht bevorzugen
        score = n * (1 + (y - 300) / 800)
        if score > best[0]: best = (score, y)
    return best[1]

if __name__ == '__main__':
    src = sys.argv[1]
    files = sorted(glob.glob(os.path.join(src, 's_*.png')))
    out = {os.path.basename(f)[2:-4]: floor(f) for f in files}
    if len(sys.argv) > 2: json.dump(out, open(sys.argv[2], 'w'))
    if len(sys.argv) > 3:
        rooms = ['thron', 'halle', 'turm', 'bib', 'garten', 'hof']
        sheet = Image.new('RGB', (9 * 370, 6 * 260), (30, 30, 30)); d = ImageDraw.Draw(sheet)
        for i, r in enumerate(rooms):
            for s in range(9):
                k = r + str(s); f = os.path.join(src, 's_%s.png' % k)
                if not os.path.exists(f): continue
                y = out[k]; im = Image.open(f).convert('RGB').crop((0, y - 200, 360, y + 60))
                sheet.paste(im, (s * 370, i * 260)); d.line([(s * 370, i * 260 + 200), (s * 370 + 360, i * 260 + 200)], fill=(255, 0, 0), width=2)
        sheet.resize((sheet.width // 2, sheet.height // 2)).save(sys.argv[3])
    print(json.dumps(out))
