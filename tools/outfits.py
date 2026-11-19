#!/usr/bin/env python3
# Outfits für den Helden in Seitenansicht: je Outfit ein Zustand der Grundfigur (Tunika),
# dazu müde und geschwächt, alle mit Laufen nach Osten. Fortschritt in <ausgabe.json>.
# Nutzung: outfits.py <grundfigur_id> <ausgabe.json>
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from held_seite_lib import run, ready  # noqa: E402

OUTFITS = {
    "waldlaeufer": "Same person as a forest ranger: green hooded cloak with the hood down, dark green tunic, brown leather bracers and belt, quiver of arrows on the back, holding a short sword in the right hand",
    "magier": "Same person as a wizard: long deep blue robe with small silver stars, wide pointy blue wizard hat, rope belt, holding a wooden staff with a glowing blue crystal in the right hand",
}
FIT = {
    "muede": "Same character, tired: shoulders slumped, head tilted forward and down, weapon lowered with the tip pointing to the ground, a small sweat drop on the forehead",
    "schwach": "Same character, weak and exhausted: thin and hunched forward, head hanging down, pale dull colours, torn clothing, dragging the weapon behind with the tip on the ground in one hand",
}

base, outp = sys.argv[1], sys.argv[2]
res = json.load(open(outp)) if os.path.exists(outp) else {}
save = lambda: json.dump(res, open(outp, "w"), indent=1)

def state(src, name, desc):
    out = run("create_character_state", {"character_id": src, "state_name": name, "edit_description": desc})
    ids = [l[4:].strip() for l in out.splitlines() if l.startswith("id: ")]
    print(name, ids or out[:200], flush=True)
    return ids[0] if ids else None

ready(base)
for o, d in OUTFITS.items():
    r = res.setdefault(o, {})
    if not r.get(""):
        r[""] = state(base, o, d); save()
for o, r in res.items():
    if not r.get("") or not ready(r[""]):
        continue
    for k, d in FIT.items():
        if not r.get(k):
            r[k] = state(r[""], o + "_" + k, d); save()
for o, r in res.items():
    for k in ["", "muede", "schwach"]:
        cid = r.get(k)
        if not cid or ("walk_" + k) in r.get("_done", []) or not ready(cid):
            continue
        out = run("animate_character", {"character_id": cid, "template_animation_id": "walking", "animation_name": "Laufen", "directions": ["east"]})
        print(o, k or "kraeftig", "Laufen", [l for l in out.splitlines() if l.startswith(("cost", "error"))], flush=True)
        r.setdefault("_done", []).append("walk_" + k); save()
print("fertig", flush=True)
