#!/bin/bash
# Generate all desktop app icons from source logo

SOURCE="/Users/tage/git/modtools/packages/identity/source-logo-rgb.png"
OUT_DIR="/Users/tage/git/modtools/packages/desktop/src-tauri/icons"

# Ensure source exists
if [ ! -f "$SOURCE" ]; then
    echo "Source image not found: $SOURCE"
    exit 1
fi

# Generate DEV icons (square with padding for desktop)
echo "Generating DEV icons..."

# Standard sizes for Tauri
cd "$OUT_DIR/dev"

# Generate main sizes with RGBA format (required by Tauri)
magick "$SOURCE" -resize 32x32^ -gravity center -extent 32x32 -background none -colorspace sRGB -define png:color-type=6 "32x32.png"
magick "$SOURCE" -resize 64x64^ -gravity center -extent 64x64 -background none -colorspace sRGB -define png:color-type=6 "64x64.png"
magick "$SOURCE" -resize 128x128^ -gravity center -extent 128x128 -background none -colorspace sRGB -define png:color-type=6 "128x128.png"
magick "$SOURCE" -resize 256x256^ -gravity center -extent 256x256 -background none -colorspace sRGB -define png:color-type=6 "128x128@2x.png"
magick "$SOURCE" -resize 256x256^ -gravity center -extent 256x256 -background none -colorspace sRGB -define png:color-type=6 "256x256.png"
magick "$SOURCE" -resize 256x256^ -gravity center -extent 256x256 -background none -colorspace sRGB -define png:color-type=6 "icon.png"

# Windows Store logos
magick "$SOURCE" -resize 30x30^ -gravity center -extent 30x30 -background none -colorspace sRGB "Square30x30Logo.png"
magick "$SOURCE" -resize 44x44^ -gravity center -extent 44x44 -background none -colorspace sRGB "Square44x44Logo.png"
magick "$SOURCE" -resize 71x71^ -gravity center -extent 71x71 -background none -colorspace sRGB "Square71x71Logo.png"
magick "$SOURCE" -resize 89x89^ -gravity center -extent 89x89 -background none -colorspace sRGB "Square89x89Logo.png"
magick "$SOURCE" -resize 107x107^ -gravity center -extent 107x107 -background none -colorspace sRGB "Square107x107Logo.png"
magick "$SOURCE" -resize 142x142^ -gravity center -extent 142x142 -background none -colorspace sRGB "Square142x142Logo.png"
magick "$SOURCE" -resize 150x150^ -gravity center -extent 150x150 -background none -colorspace sRGB "Square150x150Logo.png"
magick "$SOURCE" -resize 284x284^ -gravity center -extent 284x284 -background none -colorspace sRGB "Square284x284Logo.png"
magick "$SOURCE" -resize 310x310^ -gravity center -extent 310x310 -background none -colorspace sRGB "Square310x310Logo.png"
magick "$SOURCE" -resize 50x50^ -gravity center -extent 50x50 -background none -colorspace sRGB "StoreLogo.png"

# Generate ICO files (multi-resolution)
magick "$SOURCE" -resize 256x256^ -gravity center -extent 256x256 -background none -colorspace sRGB "icon.ico"

echo "DEV icons generated"

# Generate PROD icons (copy of dev for now, can customize later)
echo "Generating PROD icons..."
cd "$OUT_DIR/prod"

cp "$OUT_DIR/dev/"*.png . 2>/dev/null || true
cp "$OUT_DIR/dev/icon.ico" . 2>/dev/null || true

echo "PROD icons generated"

# Generate iOS icons
echo "Generating iOS icons..."
cd "$OUT_DIR/dev/ios"

magick "$SOURCE" -resize 20x20^ -gravity center -extent 20x20 -background none -colorspace sRGB "AppIcon-20x20@1x.png"
magick "$SOURCE" -resize 40x40^ -gravity center -extent 40x40 -background none -colorspace sRGB "AppIcon-20x20@2x.png"
cp "AppIcon-20x20@2x.png" "AppIcon-20x20@2x-1.png"
magick "$SOURCE" -resize 60x60^ -gravity center -extent 60x60 -background none -colorspace sRGB "AppIcon-20x20@3x.png"
magick "$SOURCE" -resize 29x29^ -gravity center -extent 29x29 -background none -colorspace sRGB "AppIcon-29x29@1x.png"
magick "$SOURCE" -resize 58x58^ -gravity center -extent 58x58 -background none -colorspace sRGB "AppIcon-29x29@2x.png"
cp "AppIcon-29x29@2x.png" "AppIcon-29x29@2x-1.png"
magick "$SOURCE" -resize 87x87^ -gravity center -extent 87x87 -background none -colorspace sRGB "AppIcon-29x29@3x.png"
magick "$SOURCE" -resize 40x40^ -gravity center -extent 40x40 -background none -colorspace sRGB "AppIcon-40x40@1x.png"
magick "$SOURCE" -resize 80x80^ -gravity center -extent 80x80 -background none -colorspace sRGB "AppIcon-40x40@2x.png"
cp "AppIcon-40x40@2x.png" "AppIcon-40x40@2x-1.png"
magick "$SOURCE" -resize 120x120^ -gravity center -extent 120x120 -background none -colorspace sRGB "AppIcon-40x40@3x.png"
magick "$SOURCE" -resize 120x120^ -gravity center -extent 120x120 -background none -colorspace sRGB "AppIcon-60x60@2x.png"
magick "$SOURCE" -resize 180x180^ -gravity center -extent 180x180 -background none -colorspace sRGB "AppIcon-60x60@3x.png"
magick "$SOURCE" -resize 76x76^ -gravity center -extent 76x76 -background none -colorspace sRGB "AppIcon-76x76@1x.png"
magick "$SOURCE" -resize 152x152^ -gravity center -extent 152x152 -background none -colorspace sRGB "AppIcon-76x76@2x.png"
magick "$SOURCE" -resize 167x167^ -gravity center -extent 167x167 -background none -colorspace sRGB "AppIcon-83.5x83.5@2x.png"
magick "$SOURCE" -resize 1024x1024^ -gravity center -extent 1024x1024 -background none -colorspace sRGB "AppIcon-512@2x.png"

# Generate Android icons
echo "Generating Android icons..."
cd "$OUT_DIR/dev/android"

# mipmap-mdpi (48x48)
cd "$OUT_DIR/dev/android/mipmap-mdpi"
magick "$SOURCE" -resize 48x48^ -gravity center -extent 48x48 -background none -colorspace sRGB "ic_launcher.png"
magick "$SOURCE" -resize 48x48^ -gravity center -extent 48x48 -background none -colorspace sRGB "ic_launcher_foreground.png"
magick "$SOURCE" -resize 48x48^ -gravity center -extent 48x48 -background none -colorspace sRGB "ic_launcher_round.png"

# mipmap-hdpi (72x72)
cd "$OUT_DIR/dev/android/mipmap-hdpi"
magick "$SOURCE" -resize 72x72^ -gravity center -extent 72x72 -background none -colorspace sRGB "ic_launcher.png"
magick "$SOURCE" -resize 72x72^ -gravity center -extent 72x72 -background none -colorspace sRGB "ic_launcher_foreground.png"
magick "$SOURCE" -resize 72x72^ -gravity center -extent 72x72 -background none -colorspace sRGB "ic_launcher_round.png"

# mipmap-xhdpi (96x96)
cd "$OUT_DIR/dev/android/mipmap-xhdpi"
magick "$SOURCE" -resize 96x96^ -gravity center -extent 96x96 -background none -colorspace sRGB "ic_launcher.png"
magick "$SOURCE" -resize 96x96^ -gravity center -extent 96x96 -background none -colorspace sRGB "ic_launcher_foreground.png"
magick "$SOURCE" -resize 96x96^ -gravity center -extent 96x96 -background none -colorspace sRGB "ic_launcher_round.png"

# mipmap-xxhdpi (144x144)
cd "$OUT_DIR/dev/android/mipmap-xxhdpi"
magick "$SOURCE" -resize 144x144^ -gravity center -extent 144x144 -background none -colorspace sRGB "ic_launcher.png"
magick "$SOURCE" -resize 144x144^ -gravity center -extent 144x144 -background none -colorspace sRGB "ic_launcher_foreground.png"
magick "$SOURCE" -resize 144x144^ -gravity center -extent 144x144 -background none -colorspace sRGB "ic_launcher_round.png"

# mipmap-xxxhdpi (192x192)
cd "$OUT_DIR/dev/android/mipmap-xxxhdpi"
magick "$SOURCE" -resize 192x192^ -gravity center -extent 192x192 -background none -colorspace sRGB "ic_launcher.png"
magick "$SOURCE" -resize 192x192^ -gravity center -extent 192x192 -background none -colorspace sRGB "ic_launcher_foreground.png"
magick "$SOURCE" -resize 192x192^ -gravity center -extent 192x192 -background none -colorspace sRGB "ic_launcher_round.png"

# Force RGBA using Python PIL (required by Tauri)
echo "Forcing RGBA format on all icons..."
python3 -c "
import os
from PIL import Image
for root, dirs, files in os.walk('$OUT_DIR'):
    for file in files:
        if file.endswith('.png'):
            path = os.path.join(root, file)
            img = Image.open(path).convert('RGBA')
            img.save(path)
"

echo "All desktop icons generated successfully!"
