#!/usr/bin/env python3
# Bewohner in Seitenansicht mit Laufanimation nach Osten. Fortschritt in <ausgabe.json>.
# Nutzung: bewohner.py <liste.json> <ausgabe.json>   (Liste [[name, beschreibung, grösse], ...])
import json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from held_seite_lib import run, ready  # noqa: E402

STYLE = " Classic 16-bit fantasy RPG pixel art, clean dark outline, muted natural colours."
lst, outp = json.load(open(sys.argv[1])), sys.argv[2]
res = json.load(open(outp)) if os.path.exists(outp) else {}
save = lambda: json.dump(res, open(outp, "w"), indent=1)
for name, desc, size in lst:
    if name in res: continue
    out = run("create_character", {"description": desc + STYLE, "mode": "v3", "view": "side", "size": size, "detail": "high detail", "outline": "single color black outline"})
    ids = [l[4:].strip() for l in out.splitlines() if l.startswith("id: ")]
    print(name, ids or out[:200], flush=True)
    if ids: res[name] = {"id": ids[0]}; save()
for name, r in res.items():
    if r.get("walk") or not ready(r["id"]): continue
    out = run("animate_character", {"character_id": r["id"], "template_animation_id": "walking", "animation_name": "Laufen", "directions": ["east"]})
    print(name, "Laufen", [l for l in out.splitlines() if l.startswith(("cost", "error"))], flush=True)
    r["walk"] = True; save()
print("fertig", flush=True)
