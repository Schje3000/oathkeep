#!/usr/bin/env python3
# Gemeinsame Hilfen: PixelLab-Aufruf mit Warten auf freie Plätze, Warten auf fertige Figur.
import sys, os, time, io, contextlib
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

