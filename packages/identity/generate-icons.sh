#!/bin/bash
set -e

OUT_DIR="/Users/tage/git/modtools/packages/identity"

FAVICON_URL="https://images.squarespace-cdn.com/content/v1/639deaadeb9741740df7b18e/710acf29-5f14-46c7-b471-f647addf34b6/favicon.ico?format=500w"
BLACK_LOGO_URL="https://images.squarespace-cdn.com/content/v1/639deaadeb9741740df7b18e/ee655b8f-1943-462c-9f43-5b80cdb541c2/Embedded+Computing+Systems-logo-black.png?format=1500w"
WHITE_LOGO_URL="https://images.squarespace-cdn.com/content/v1/639deaadeb9741740df7b18e/d95d3e9f-0e71-4182-9902-97955dba0a47/Embedded+Computing+Systems-logo-white.png?format=1500w"

MARK_SVG="$OUT_DIR/mark.svg"
MARK_LIGHT_SVG="$OUT_DIR/mark-light.svg"
MARK_BLACK_SVG="$OUT_DIR/mark-black.svg"

TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

echo "----------------------------------------"
echo "Downloading source images..."
echo "----------------------------------------"

curl -sL "$FAVICON_URL" -o "$TMPDIR/favicon.webp"
curl -sL "$BLACK_LOGO_URL" -o "$TMPDIR/black-wide.webp"
curl -sL "$WHITE_LOGO_URL" -o "$TMPDIR/white-wide.webp"

echo "----------------------------------------"
echo "Generating square PNG marks (from favicon)..."
echo "----------------------------------------"

magick "$TMPDIR/favicon.webp" -resize 512x512 -background white -flatten "$OUT_DIR/mark-512x512.png"
magick "$TMPDIR/favicon.webp" -resize 192x192 -background white -flatten "$OUT_DIR/mark-192x192.png"
magick "$TMPDIR/favicon.webp" -resize 96x96 -background white -flatten "$OUT_DIR/mark-96x96.png"
magick "$TMPDIR/favicon.webp" -resize 512x512 -background white -alpha off -negate -fuzz 1% -fill '#131010' -opaque black "$OUT_DIR/mark-512x512-dark.png"
magick "$TMPDIR/favicon.webp" -resize 512x512 -background white -flatten -fuzz 1% -fill white -opaque '#FDFDFD' "$OUT_DIR/mark-512x512-light.png"

echo "✓ Square marks generated from favicon"

echo "----------------------------------------"
echo "Generating wide logo PNGs (from full logo)..."
echo "----------------------------------------"

magick "$TMPDIR/black-wide.webp" -background white -flatten "$OUT_DIR/source-logo-rgb.png"
magick "$TMPDIR/white-wide.webp" "$OUT_DIR/source-logo-white.png"
magick "$TMPDIR/black-wide.webp" -negate "$OUT_DIR/source-logo.png"

echo "✓ Wide logo PNGs generated"

echo "----------------------------------------"
echo "Rendering SVG marks to PNG..."
echo "----------------------------------------"

magick "$MARK_SVG" -resize 512x512 "$OUT_DIR/mark-512x512-svg.png"
magick "$MARK_BLACK_SVG" -resize 512x512 "$OUT_DIR/mark-black-svg.png"
magick "$MARK_LIGHT_SVG" -resize 512x512 "$OUT_DIR/mark-light-svg.png"

echo "✓ SVG marks rendered"

echo "----------------------------------------"
echo "Syncing SVG Marks to Workspace..."
echo "----------------------------------------"

cp "$MARK_SVG" "/Users/tage/git/modtools/packages/web/src/assets/logo-dark.svg"
cp "$MARK_LIGHT_SVG" "/Users/tage/git/modtools/packages/web/src/assets/logo-light.svg"
cp "$MARK_SVG" "/Users/tage/git/modtools/packages/console/app/src/asset/logo.svg"
cp "$MARK_LIGHT_SVG" "/Users/tage/git/modtools/packages/console/app/src/asset/lander/logo-light.svg"
cp "$MARK_BLACK_SVG" "/Users/tage/git/modtools/packages/console/app/src/asset/lander/logo-dark.svg"

echo "✓ SVGs synced to web/console"
echo ""
echo "Files in identity:"
ls -la "$OUT_DIR"/mark*.{png,svg} "$OUT_DIR"/source*.{png,webp} 2>/dev/null