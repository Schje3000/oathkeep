#!/usr/bin/env python3
# Held in Seitenansicht: Rüstungsstufen als Zustände der Grundfigur (Tunika), je müde und geschwächt,
# dazu Laufen nach Osten (Westen wird gespiegelt). Fortschritt in <ausgabe.json>, Neustart setzt fort.
# Nutzung: held_seite.py <grundfigur_id> <ausgabe.json>
import json, os, sys, time, io, contextlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixellab import call

def run(tool, args):
    for _ in range(200):
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf):
                call(tool, args)
        except SystemExit:
            pass
        out = buf.getvalue()
        if "slot" in out or "rate limit" in out or "429" in out or "concurrent" in out or "at a time" in out or "parallel" in out or "still being generated" in out:
            time.sleep(10); continue
        return out
    return "Zeitüberschreitung"

def ready(cid):
    for _ in range(80):
        if "status: completed" in run("get_character", {"character_id": cid}): return True
        time.sleep(15)
    return False

TIERS = {
 "leder": "Same person in light leather armour: brown boiled leather jerkin with shoulder pads, leather bracers, belt with pouch, no helmet, short worn brown cloak, holding a simple iron short sword in the right hand",
 "kette": "Same person in chainmail armour: grey chainmail shirt with a red tabard, simple round steel helmet without visor, short red cape, holding an iron longsword in the right hand",
 "platte": "Same person as a knight in full polished grey-blue steel plate armour, open-faced steel helmet with a small red plume, red cape, holding a longsword with a gold crossguard in the right hand",
 "gold": "Same person as a knight in magnificent ornate golden plate armour, golden helmet with a tall white plume, royal blue cape with gold trim, holding a shining longsword with a golden crossguard in the right hand"}
FIT = {
 "muede": "Same character, tired: shoulders slumped, head tilted forward and down, weapon lowered with the tip pointing to the ground, a small sweat drop on the forehead",
 "schwach": "Same character, weak and exhausted: thin and hunched forward, head hanging down, pale dull colours, torn clothing, dragging the weapon behind with the tip on the ground in one hand"}

base, outp = sys.argv[1], sys.argv[2]
res = json.load(open(outp)) if os.path.exists(outp) else {}
save = lambda: json.dump(res, open(outp, "w"), indent=1)
res.setdefault("tunika", {})[""] = base
def state(src, name, desc):
    out = run("create_character_state", {"character_id": src, "state_name": name, "edit_description": desc})
    ids = [l[4:].strip() for l in out.splitlines() if l.startswith("id: ")]
    print(name, ids or out[:200], flush=True)
    return ids[0] if ids else None
ready(base)
for t, d in TIERS.items():
    r = res.setdefault(t, {})
    if "" not in r:
        r[""] = state(base, t, d); save()
for t, r in res.items():
    if not ready(r[""]): continue
    for k, d in FIT.items():
        if k not in r:
            r[k] = state(r[""], t + "_" + k, d); save()
for t, r in res.items():
    for k in ["", "muede", "schwach"]:
        cid = r.get(k)
        if not cid or ("walk_" + k) in r.get("_done", []): continue
        if not ready(cid): continue
        out = run("animate_character", {"character_id": cid, "template_animation_id": "walking", "animation_name": "Laufen", "directions": ["east"]})
        print(t, k or "kraeftig", "Laufen", [l for l in out.splitlines() if l.startswith(("cost", "error"))], flush=True)
        r.setdefault("_done", []).append("walk_" + k); save()
print("fertig", flush=True)
