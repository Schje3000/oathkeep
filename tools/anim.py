#!/usr/bin/env python3
# Reiht Laufanimationen (v3) für Heldenzustände ein, wartet bei vollen Auftragsplätzen.
# Nutzung: anim.py <liste.json>
# liste.json: [{"c": "<character_id>", "name": "Laufen v3", "dir": "south", "d": "Bewegung", "group": "<optional>"}]
import json, os, sys, time, io, contextlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixellab import call

for it in json.load(open(sys.argv[1])):
    args = {"character_id": it["c"], "mode": "v3", "animation_name": it["name"], "directions": [it["dir"]],
            "action_description": it["d"], "frame_count": 8}
    if it.get("group"):
        args["animation_group_id"] = it["group"]
    for _ in range(90):
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf):
                call("animate_character", args)
        except SystemExit:
            pass
        out = buf.getvalue()
        if "slot" in out or "at a time" in out or "parallel" in out:
            time.sleep(10); continue
        break
    print(it["c"][:8], it["dir"], [l for l in out.splitlines() if l.startswith(("group", "cost", "error"))], flush=True)
