#!/bin/bash
# Generate UI favicon files

SOURCE="/Users/tage/git/modtools/packages/identity/source-logo-rgb.png"
OUT_DIR="/Users/tage/git/modtools/packages/ui/src/assets/favicon"

# Ensure source exists
if [ ! -f "$SOURCE" ]; then
    echo "Source image not found: $SOURCE"
    exit 1
fi

echo "Generating UI favicons..."
cd "$OUT_DIR"

# Standard favicon sizes
magick "$SOURCE" -resize 16x16^ -gravity center -extent 16x16 -background white "favicon.ico"
magick "$SOURCE" -resize 32x32^ -gravity center -extent 32x32 -background white "favicon-v3.ico"
magick "$SOURCE" -resize 96x96^ -gravity center -extent 96x96 -background white "favicon-96x96.png"
magick "$SOURCE" -resize 96x96^ -gravity center -extent 96x96 -background white "favicon-96x96-v3.png"

# Apple touch icons
magick "$SOURCE" -resize 180x180^ -gravity center -extent 180x180 -background white "apple-touch-icon.png"
magick "$SOURCE" -resize 180x180^ -gravity center -extent 180x180 -background white "apple-touch-icon-v3.png"

# Web app manifest icons
magick "$SOURCE" -resize 192x192^ -gravity center -extent 192x192 -background white "web-app-manifest-192x192.png"
magick "$SOURCE" -resize 512x512^ -gravity center -extent 512x512 -background white "web-app-manifest-512x512.png"

# Generate SVG favicon
cat > "favicon.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#ffffff"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#000000">ECS</text>
</svg>
EOF

cat > "favicon-v3.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#ffffff"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#000000">ECS</text>
</svg>
EOF

echo "UI favicons generated successfully!"
ls -la *.png *.ico *.svg 2>/dev/null | tail -15