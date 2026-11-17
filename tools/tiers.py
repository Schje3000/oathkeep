#!/usr/bin/env python3
# Legt für jede Rüstungsstufe die Zustände müde und geschwächt an und erzeugt
# Laufanimationen (v3) nach Süd, Nord, Ost für alle drei Zustände.
# Nutzung: tiers.py <tiers.json>   (Liste [{"tier": "Tunika", "id": "<character_id>"}])
# Schreibt den Fortschritt nach tiers_out.json neben die Eingabe.
import json, os, sys, time, io, contextlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixellab import call

def run(tool, args):
    for _ in range(120):
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf):
                call(tool, args)
        except SystemExit:
            pass
        out = buf.getvalue()
        if "slot" in out or "at a time" in out or "parallel" in out or "rate limit" in out:
            time.sleep(10); continue
        return out
    return "Zeitüberschreitung"

def status(cid):
    return run("get_character", {"character_id": cid})

MUEDE = "Same character, tired: shoulders slumped, head tilted forward and down, weapon lowered with the tip pointing to the ground, a small sweat drop on the forehead"
SCHWACH = "Same character, weak and exhausted: thin and hunched forward, head hanging down, pale dull colours, torn clothing, dragging the weapon behind with the tip on the ground in one hand"
DIRS = {"south": "toward the viewer", "north": "away from the viewer, seen from behind", "east": "to the right, seen from the side"}
WALK = {
    "": "walking steadily {}, upright and confident, weapon held in the right hand, legs alternate in a walk cycle",
    "muede": "a slow tired trudging walk {}, shoulders slumped, head hanging forward, weapon held low with the tip pointing down, legs alternate in a heavy walk cycle",
    "schwach": "a weak exhausted shuffling walk {}, thin and hunched forward, head hanging down, dragging the weapon behind with its tip scraping along the ground, small unsteady steps",
}

src = sys.argv[1]
outp = os.path.join(os.path.dirname(src), "tiers_out.json")
res = json.load(open(outp)) if os.path.exists(outp) else {}
for t in json.load(open(src)):
    r = res.setdefault(t["tier"], {"": t["id"]})
    for key, desc in (("muede", MUEDE), ("schwach", SCHWACH)):
        if key not in r:
            out = run("create_character_state", {"character_id": t["id"], "state_name": t["tier"] + "_" + key, "edit_description": desc})
            ids = [l[4:].strip() for l in out.splitlines() if l.startswith("id: ")]
            if ids:
                r[key] = ids[0]
            print(t["tier"], key, ids or out[:200], flush=True)
            json.dump(res, open(outp, "w"), indent=1)
# Warten, bis alle Zustände fertig sind, dann Laufanimationen
for tier, r in res.items():
    for key, cid in list(r.items()):
        if key == "_done":
            continue
        for _ in range(60):
            if "status: completed" in status(cid):
                break
            time.sleep(15)
        for d, phrase in DIRS.items():
            tag = "walk_" + (key or "kraeftig") + "_" + d
            if tag in r.get("_done", []):
                continue
            out = run("animate_character", {"character_id": cid, "mode": "v3", "animation_name": "Laufen " + (key or "kraeftig"),
                                             "directions": [d], "action_description": WALK[key].format(phrase), "frame_count": 8})
            print(tier, key or "kraeftig", d, [l for l in out.splitlines() if l.startswith(("cost", "error"))], flush=True)
            r.setdefault("_done", []).append(tag)
            json.dump(res, open(outp, "w"), indent=1)
print("fertig", flush=True)
