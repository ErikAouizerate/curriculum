#!/usr/bin/env bash
# Compress a generated PDF with Ghostscript. Usage: ./scripts/compress-pdf.sh <file.pdf>
set -euo pipefail

input="${1:?usage: compress-pdf.sh <file.pdf>}"
compressed="${input%.pdf}.compressed.pdf"

if ! command -v gs >/dev/null 2>&1; then
  echo "ghostscript (gs) is required" >&2
  exit 1
fi

gs \
  -sDEVICE=pdfwrite \
  -dCompatibilityLevel=1.7 \
  -dPDFSETTINGS=/ebook \
  -dNOPAUSE \
  -dQUIET \
  -dBATCH \
  -sOutputFile="$compressed" \
  "$input"

mv "$compressed" "$input"
echo "Compressed $input ($(du -h "$input" | cut -f1))"
