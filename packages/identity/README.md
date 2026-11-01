# Identity Build System

Source-of-truth branding assets for Embedded Computing Systems.

## Source Assets

- `mark.svg`: ECS microchip icon — dark variant (dark bg `#131010`, white traces, inner square `#5A5858`)
- `mark-light.svg`: ECS microchip icon — light variant (light bg `#FDFCFC`, dark traces `#17181C`)
- `mark-black.svg`: Vector trace from favicon (potrace, for legacy use)
- `source-logo-rgb.png`: Center-cropped square from wide logo (for raster fallbacks)
- `source-logo-white.png`: White logo on transparent (for dark backgrounds)
- `source-logo.png`: Negated version of source-logo-rgb

## Generation

Run `./generate-icons.sh` to regenerate all PNG derivatives from the SVGs and sync to the workspace.

The SVGs are the canonical source. PNGs are derived from them.

## Workspace Sync

Branding is propagated to:

- `packages/web/src/assets/`
- `packages/console/app/src/asset/`
- `packages/desktop/src-tauri/icons/`
- `packages/mod/src/cli/` (ASCII version)
