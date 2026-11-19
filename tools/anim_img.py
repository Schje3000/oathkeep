#!/usr/bin/env python3
# Animiert vorhandene Sprites mit PixelLab animate_image als Schleife (letztes Bild = erstes Bild).
# Nutzung: anim_img.py <liste.json> <quellordner> <zielordner>
# liste.json: [{"name": "kessel", "action": "the brew bubbling", "frames": 8}]
# Ergebnis je Name: <ziel>/<name>_f<i>.png (alle Bilder in voller Leinwand). Vorhandene werden übersprungen.
import json, os, sys, time, base64, io, contextlib, urllib.request, urllib.error
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixellab import call

def run(args):
    for _ in range(200):
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf):
                call("animate_image", args)
        except SystemExit:
            pass
        out = buf.getvalue()
        if any(k in out for k in ("slot", "rate limit", "429", "concurrent", "at a time")):
            time.sleep(10); continue
        return out
    return ""

def fetch(job, idx, path):
    url = "https://api.pixellab.ai/mcp/images/%s/download?index=%d" % (job, idx)
    for _ in range(80):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                data = r.read()
            if data[:4] == b"\x89PNG":
                open(path, "wb").write(data); return True
        except urllib.error.HTTPError as e:
            if e.code == 404 and idx > 0: return False
        except Exception:
            pass
        time.sleep(6)
    return False

lst, src, dst = json.load(open(sys.argv[1])), sys.argv[2], sys.argv[3]
os.makedirs(dst, exist_ok=True)
for it in lst:
    n, fc = it["name"], it.get("frames", 8)
    if os.path.exists(os.path.join(dst, "%s_f%d.png" % (n, fc))):
        continue
    b64 = base64.b64encode(open(os.path.join(src, n + ".png"), "rb").read()).decode()
    url = "data:image/png;base64," + b64
    out = run({"first_frame_url": url, "last_frame_url": url, "action": it["action"], "frame_count": fc, "no_background": True})
    job = [l.split(":", 1)[1].strip() for l in out.splitlines() if l.startswith(("id:", "job_id:"))]
    if not job:
        print(n, "FEHLER", out[:200], flush=True); continue
    ok = all(fetch(job[0], i, os.path.join(dst, "%s_f%d.png" % (n, i))) for i in range(fc + 1))
    print(n, "ok" if ok else "unvollständig", flush=True)
