#!/usr/bin/env bash
# extract_photo_years.sh
# Loops through images/gallery/, extracts the year each photo was taken
# (via exiftool EXIF data, or file-modification date as fallback),
# and prints a filename → year summary.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GALLERY_DIR="$SCRIPT_DIR/images/gallery"

if [ ! -d "$GALLERY_DIR" ]; then
  echo "ERROR: gallery directory not found: $GALLERY_DIR" >&2
  exit 1
fi

HAS_EXIFTOOL=0
if command -v exiftool >/dev/null 2>&1; then
  HAS_EXIFTOOL=1
fi

echo "Gallery: $GALLERY_DIR"
echo ""
printf "%-36s  %s\n" "FILENAME" "YEAR (source)"
printf "%-36s  %s\n" "--------" "-------------"

shopt -s nullglob
FILES=("$GALLERY_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG,webp,WEBP,gif,GIF})

if [ ${#FILES[@]} -eq 0 ]; then
  echo "(no image files found)"
  exit 0
fi

for file in "${FILES[@]}"; do
  fname="$(basename "$file")"
  year=""
  source=""

  if [ "$HAS_EXIFTOOL" -eq 1 ]; then
    # Prefer DateTimeOriginal (shutter time), fall back to CreateDate
    raw=$(exiftool -s3 -DateTimeOriginal "$file" 2>/dev/null)
    if [ -z "$raw" ]; then
      raw=$(exiftool -s3 -CreateDate "$file" 2>/dev/null)
    fi
    if [ -n "$raw" ]; then
      year="${raw%%:*}"   # EXIF dates are "YYYY:MM:DD HH:MM:SS"
      source="exif"
    fi
  fi

  # Fallback: file modification date (less reliable — can change on copy)
  if [ -z "$year" ]; then
    if stat --version >/dev/null 2>&1; then
      # GNU stat (Linux)
      year=$(stat -c '%y' "$file" 2>/dev/null | cut -d'-' -f1)
    else
      # BSD stat (macOS)
      year=$(stat -f '%Sm' -t '%Y' "$file" 2>/dev/null)
    fi
    source="file-mtime"
  fi

  printf "%-36s  %s  (%s)\n" "$fname" "${year:-unknown}" "${source:-none}"
done
