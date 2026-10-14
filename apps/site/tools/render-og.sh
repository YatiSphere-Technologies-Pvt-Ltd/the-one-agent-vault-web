#!/usr/bin/env bash
# Regenerate public/og.png (1200×630) from the built dist/og.svg. macOS only (QuickLook + sips).
# QuickLook renders square thumbnails and centres the drawing, so the card is wrapped in a
# 1200×1200 document, shifted down by (1200 − 630) / 2 and cropped back to 1200×630.
set -euo pipefail
cd "$(dirname "$0")/.."
work="$(mktemp -d)"
python3 - "$work" <<'PY'
import re, sys
s = open("dist/og.svg").read().strip()
inner = re.sub(r"^<svg[^>]*>", "", s)
inner = inner[: inner.rfind("</svg>")]
open(sys.argv[1] + "/sq.svg", "w").write(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">'
    '<g transform="translate(0 285)">' + inner + "</g></svg>"
)
PY
qlmanage -t -s 1200 -o "$work" "$work/sq.svg" >/dev/null 2>&1
sips -c 630 1200 --cropOffset 0 0 "$work/sq.svg.png" --out public/og.png >/dev/null
echo "public/og.png updated"
