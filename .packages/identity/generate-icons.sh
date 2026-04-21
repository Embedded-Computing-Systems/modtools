#!/bin/bash
set -e

OUT_DIR="/Users/tage/git/modtools/packages/identity"

FAVICON_URL="https://images.squarespace-cdn.com/content/v1/639deaadeb9741740df7b18e/710acf29-5f14-46c7-b471-f647addf34b6/favicon.ico"
WHITE_LOGO_URL="https://images.squarespace-cdn.com/content/v1/639deaadeb9741740df7b18e/d95d3e9f-0e71-4182-9902-97955dba0a47/Embedded+Computing+Systems-logo-white.png"
BLACK_LOGO_URL="https://images.squarespace-cdn.com/content/639deaadeb9741740df7b18e/ee655b8f-1943-462c-9f43-5b80cdb541c2/Embedded+Computing+Systems-logo-black.png"

MARK_SVG="$OUT_DIR/mark.svg"
MARK_LIGHT_SVG="$OUT_DIR/mark-light.svg"
MARK_BLACK_SVG="$OUT_DIR/mark-black.svg"

TAURI_ICONS_DIR="/Users/tage/git/modtools/packages/desktop/src-tauri/icons"

TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

echo "----------------------------------------"
echo "Downloading source images..."
echo "----------------------------------------"

curl -sL "$FAVICON_URL" -o "$TMPDIR/favicon.ico"
curl -sL "$WHITE_LOGO_URL" -o "$TMPDIR/white-wide.png"
curl -sL "$BLACK_LOGO_URL" -o "$TMPDIR/black-wide.png"

echo "----------------------------------------"
echo "Generating square PNG marks (from favicon)..."
echo "----------------------------------------"

# Extract largest icon from favicon.ico if it's a multi-res ico
magick "$TMPDIR/favicon.ico[0]" -resize 512x512 "$TMPDIR/source-square.png"

magick "$TMPDIR/source-square.png" -resize 512x512 "$OUT_DIR/mark-512x512.png"
magick "$TMPDIR/source-square.png" -resize 192x192 "$OUT_DIR/mark-192x192.png"
magick "$TMPDIR/source-square.png" -resize 96x96 "$OUT_DIR/mark-96x96.png"

echo "✓ Square marks generated from favicon"

echo "----------------------------------------"
echo "Generating wide logo PNGs (from full logo)..."
echo "----------------------------------------"

magick "$TMPDIR/black-wide.png" "$OUT_DIR/source-logo-rgb.png"
magick "$TMPDIR/white-wide.png" "$OUT_DIR/source-logo-white.png"
magick "$TMPDIR/black-wide.png" "$OUT_DIR/source-logo.png"

echo "✓ Wide logo PNGs generated"

echo "----------------------------------------"
echo "Generating Tauri GUI Icons..."
echo "----------------------------------------"

# Use the source-square.png to generate Tauri icons
echo "Generating Tauri icons using 'magick'..."
# Generate for prod, dev, and beta
for env in prod dev beta; do
  TARGET_DIR="$TAURI_ICONS_DIR/$env"
  mkdir -p "$TARGET_DIR"

  # Basic sizes
  magick "$TMPDIR/source-square.png" -resize 32x32 -define png:format=png32 "$TARGET_DIR/32x32.png"
  magick "$TMPDIR/source-square.png" -resize 64x64 -define png:format=png32 "$TARGET_DIR/64x64.png"
  magick "$TMPDIR/source-square.png" -resize 128x128 -define png:format=png32 "$TARGET_DIR/128x128.png"
  magick "$TMPDIR/source-square.png" -resize 256x256 -define png:format=png32 "$TARGET_DIR/128x128@2x.png"
  magick "$TMPDIR/source-square.png" -resize 256x256 -define png:format=png32 "$TARGET_DIR/256x256.png"
  magick "$TMPDIR/source-square.png" -resize 512x512 -define png:format=png32 "$TARGET_DIR/512x512.png"

  # Main icons
  magick "$TMPDIR/source-square.png" -resize 512x512 -define png:format=png32 "$TARGET_DIR/icon.png"

  # .ico (Windows) - include multiple sizes
  magick "$TMPDIR/source-square.png" -define icon:auto-resize=256,128,64,48,32,16 "$TARGET_DIR/icon.ico"

  # .icns (macOS)
  magick "$TMPDIR/source-square.png" "$TARGET_DIR/icon.icns" || echo "Warning: Failed to generate .icns for $env"

  # Additional Windows/Store icons
  magick "$TMPDIR/source-square.png" -resize 30x30 -define png:format=png32 "$TARGET_DIR/Square30x30Logo.png"
  magick "$TMPDIR/source-square.png" -resize 44x44 -define png:format=png32 "$TARGET_DIR/Square44x44Logo.png"
  magick "$TMPDIR/source-square.png" -resize 71x71 -define png:format=png32 "$TARGET_DIR/Square71x71Logo.png"
  magick "$TMPDIR/source-square.png" -resize 89x89 -define png:format=png32 "$TARGET_DIR/Square89x89Logo.png"
  magick "$TMPDIR/source-square.png" -resize 107x107 -define png:format=png32 "$TARGET_DIR/Square107x107Logo.png"
  magick "$TMPDIR/source-square.png" -resize 142x142 -define png:format=png32 "$TARGET_DIR/Square142x142Logo.png"
  magick "$TMPDIR/source-square.png" -resize 150x150 -define png:format=png32 "$TARGET_DIR/Square150x150Logo.png"
  magick "$TMPDIR/source-square.png" -resize 284x284 -define png:format=png32 "$TARGET_DIR/Square284x284Logo.png"
  magick "$TMPDIR/source-square.png" -resize 310x310 -define png:format=png32 "$TARGET_DIR/Square310x310Logo.png"
  magick "$TMPDIR/source-square.png" -resize 50x50 -define png:format=png32 "$TARGET_DIR/StoreLogo.png"
done

echo "✓ Tauri icons generated"

echo "----------------------------------------"
echo "Rendering SVG marks to PNG..."
echo "----------------------------------------"

# Ensure we use existing SVGs as sources
if [ -f "$MARK_SVG" ]; then
  magick "$MARK_SVG" -resize 512x512 "$OUT_DIR/mark-512x512-svg.png"
fi
if [ -f "$MARK_BLACK_SVG" ]; then
  magick "$MARK_BLACK_SVG" -resize 512x512 "$OUT_DIR/mark-black-svg.png"
fi
if [ -f "$MARK_LIGHT_SVG" ]; then
  magick "$MARK_LIGHT_SVG" -resize 512x512 "$OUT_DIR/mark-light-svg.png"
fi

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