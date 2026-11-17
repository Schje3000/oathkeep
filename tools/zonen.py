#!/usr/bin/env python3
# Bestimmt für jede Szene die Laufzone des Helden: das grösste Rechteck aus freiem Boden
# im sichtbaren Band (y 240 bis 404). Bodenfarben werden vorne im Bild gemessen.
# Nutzung: zonen.py <ordner_mit_v_bildern> [ausgabe.json] [vorschau.png]
import sys, json, glob, os
from collections import Counter
from PIL import Image, ImageDraw

Q = 20          # Farbquantisierung
CELL = 6        # Rastergrösse in Pixeln
Y_MIN, Y_MAX = 240, 404

def zone(path):
    im = Image.open(path).convert('RGB'); px = im.load(); W, H = im.size
    q = lambda c: (c[0] // Q, c[1] // Q, c[2] // Q)
    cnt = Counter(q(px[x, y]) for x in range(W) for y in range(Y_MAX - 26, Y_MAX))
    tot = sum(cnt.values()); pal = set(); acc = 0
    for col, n in cnt.most_common():
        pal.add(col); acc += n
        if acc > tot * 0.85: break
    def near(c):
        if c in pal: return True
        return any(abs(c[0]-p[0]) <= 1 and abs(c[1]-p[1]) <= 1 and abs(c[2]-p[2]) <= 1 for p in pal)
    cols, rows = W // CELL, (Y_MAX - Y_MIN) // CELL
    free = [[False] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            n = sum(near(q(px[c*CELL+i, Y_MIN + r*CELL + j])) for i in range(CELL) for j in range(CELL))
            free[r][c] = n >= CELL * CELL * 0.8
    # Grösstes Rechteck (Histogramm-Verfahren), Vorrang für weiter vorne liegende Flächen
    best = None; hgt = [0] * cols
    for r in range(rows):
        for c in range(cols): hgt[c] = hgt[c] + 1 if free[r][c] else 0
        st = []
        for c in range(cols + 1):
            h = hgt[c] if c < cols else 0
            s = c
            while st and st[-1][1] >= h:
                s, hh = st.pop()
                w = c - s
                if hh >= 4 and w * CELL >= 90:
                    score = w * hh * (1 + r / rows)
                    if not best or score > best[0]: best = (score, s, c, r - hh + 1, r)
                s = s
            st.append((s, h))
    if not best: return None
    _, c0, c1, r0, r1 = best
    x0, x1 = c0 * CELL + 18, c1 * CELL - 18
    y0, y1 = Y_MIN + r0 * CELL + 10, Y_MIN + (r1 + 1) * CELL
    return [x0, x1, y0, min(y1, Y_MAX)]

if __name__ == '__main__':
    src = sys.argv[1]; out = {}
    files = sorted(glob.glob(os.path.join(src, 'v_*.png')))
    files = [f for f in files if not os.path.basename(f).startswith(('v_burg', 'v_karte', 'v_welt'))]
    for f in files:
        k = os.path.basename(f)[2:-4]; out[k] = zone(f)
    if len(sys.argv) > 2: json.dump(out, open(sys.argv[2], 'w'), indent=0)
    if len(sys.argv) > 3:
        rooms = ['thron', 'halle', 'turm', 'bib', 'garten', 'hof']
        sheet = Image.new('RGB', (9 * 370, 6 * 300), (30, 30, 30)); d = ImageDraw.Draw(sheet)
        for i, r in enumerate(rooms):
            for s in range(9):
                f = os.path.join(src, 'v_%s%d.png' % (r, s))
                if not os.path.exists(f): continue
                im = Image.open(f).convert('RGB').crop((0, 120, 360, 420)); sheet.paste(im, (s * 370, i * 300))
                z = out.get(r + str(s))
                if z: d.rectangle([s*370 + z[0], i*300 + z[2] - 120, s*370 + z[1], i*300 + z[3] - 120], outline=(255, 40, 40), width=2)
                else: d.text((s*370 + 150, i*300 + 140), 'KEINE', fill=(255, 0, 0))
        sheet.resize((sheet.width // 2, sheet.height // 2)).save(sys.argv[3])
    print(json.dumps(out))
