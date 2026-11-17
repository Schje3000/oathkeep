#!/usr/bin/env python3
# Erzeugt PixelLab-Bilder nacheinander (Trial: 1 Auftrag gleichzeitig).
# Nutzung: batch.py <liste.json> <zielordner>
# liste.json: [{"name": "kamin", "w": 96, "h": 96, "d": "Beschreibung", "bg": false}, ...]
# Vorhandene Dateien werden übersprungen.
import json, os, sys, time, urllib.request, urllib.error
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import io, contextlib
from pixellab import call

STYLE = (", seen from the front at a low top-down angle, 16-bit fantasy RPG pixel art, "
         "clean dark outline, detailed shading, muted natural colours")

def run(tool, args):
    for _ in range(360):
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf):
                call(tool, args)
        except SystemExit:
            pass
        out = buf.getvalue()
        if "job slots" in out or "at a time" in out or "rate limit" in out:
            time.sleep(10)
            continue
        return out
    raise RuntimeError("kein freier Auftragsplatz")

def fetch(job, path):
    url = "https://api.pixellab.ai/mcp/images/%s/download" % job
    for _ in range(60):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                data = r.read()
            if data[:4] == b"\x89PNG":
                open(path, "wb").write(data)
                return True
        except urllib.error.HTTPError:
            pass
        time.sleep(6)
    return False

items = json.load(open(sys.argv[1]))
dst = sys.argv[2]
os.makedirs(dst, exist_ok=True)
for it in items:
    path = os.path.join(dst, it["name"] + ".png")
    if os.path.exists(path):
        continue
    args = {"description": it["d"] + ("" if it.get("raw") else STYLE), "width": it["w"], "height": it["h"],
            "no_background": not it.get("bg", False)}
    if not it.get("bg"):
        args["outline"] = "single color black outline"
    out = run("create_image_pixen", args)
    job = [l[4:] for l in out.splitlines() if l.startswith("id: ")]
    if not job:
        print(it["name"], "FEHLER", out[:300]); continue
    ok = fetch(job[0].strip(), path)
    print(it["name"], "ok" if ok else "nicht geladen", flush=True)
