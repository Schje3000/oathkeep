#!/usr/bin/env python3
# Baut Sprite-Blätter für die Seitenansicht aus PixelLab-Exporten.
# Zelle 96 x 96, Füsse auf y 90, Figur waagrecht über die Bildmitte zentriert.
# Spalten: Ruhe Süd, Ruhe Ost, dann 6 Bilder Laufen Ost. Eine Zeile je Zustand-Ordner.
# Nutzung: blatt.py <ziel.png> <zustand_ordner> [<zustand_ordner> ...]
import sys, glob, os
from PIL import Image

C, FOOT, N = 96, 90, 6

def feet(im):
    bb = im.getbbox()
    return bb[3] if bb else im.height

def row(d):
    rot = lambda n: Image.open(os.path.join(d, 'rotations', n + '.png')).convert('RGBA')
    walk = sorted(glob.glob(os.path.join(d, 'animations', '*', 'east', 'frame_*.png')))[:N]
    frames = [rot('south'), rot('east')] + [Image.open(f).convert('RGBA') for f in walk]
    base = feet(frames[0])
    return frames, base

def main():
    out, dirs = sys.argv[1], sys.argv[2:]
    sheet = Image.new('RGBA', (C * (2 + N), C * len(dirs)))
    for r, d in enumerate(dirs):
        frames, base = row(d)
        for i, im in enumerate(frames):
            dy = FOOT - (base if i < 2 else max(feet(f) for f in frames[2:]))
            sheet.alpha_composite(im, (i * C + (C - im.width) // 2, r * C + dy), )
    sheet.save(out, optimize=True)

if __name__ == '__main__':
    main()
