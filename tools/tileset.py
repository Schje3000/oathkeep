#!/usr/bin/env python3
# Wartet auf einen PixelLab-Kachelsatz und speichert Bild und Eckentabelle.
# Nutzung: tileset.py <tileset_id> <ziel.png>
# Gibt die Tabelle als JSON aus: Schlüssel "NW NE SW SE" (1 = obere Fläche laut Metadaten).
import json, sys, time, urllib.request
tid, dst = sys.argv[1], sys.argv[2]
base = "https://api.pixellab.ai/mcp/tilesets/" + tid
for _ in range(60):
    try:
        with urllib.request.urlopen(base + "/image?inline=true", timeout=60) as r:
            data = r.read()
        if data[:4] == b"\x89PNG":
            break
    except Exception:
        pass
    time.sleep(8)
else:
    sys.exit("nicht fertig")
open(dst, "wb").write(data)
meta = json.loads(urllib.request.urlopen(base + "/metadata", timeout=60).read())
out = {}
for t in meta["tileset_data"]["tiles"]:
    k = "".join("1" if t["corners"][c] == "upper" else "0" for c in ("NW", "NE", "SW", "SE"))
    out[k] = [t["bounding_box"]["x"], t["bounding_box"]["y"]]
print(json.dumps(out, sort_keys=True))
