#!/usr/bin/env python3
# Aufruf eines PixelLab-MCP-Werkzeugs. Schlüssel setzt der Proxy ein.
# Nutzung: pl.py <werkzeug> '<json-argumente>'
import json, sys, urllib.request

def call(name, args):
    body = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/call",
                       "params": {"name": name, "arguments": args}}).encode()
    req = urllib.request.Request("https://api.pixellab.ai/mcp", data=body, headers={
        "Content-Type": "application/json", "Accept": "application/json, text/event-stream"})
    with urllib.request.urlopen(req, timeout=300) as r:
        raw = r.read().decode()
    for line in raw.splitlines():
        if line.startswith("data: "):
            d = json.loads(line[6:])
            if "result" in d:
                for c in d["result"].get("content", []):
                    if c.get("type") == "text":
                        print(c["text"])
                    else:
                        print("[" + c.get("type", "?") + "]")
                if d["result"].get("isError"):
                    sys.exit(1)
            else:
                print(json.dumps(d)); sys.exit(1)

if __name__ == "__main__":
    call(sys.argv[1], json.loads(sys.argv[2]) if len(sys.argv) > 2 else {})
