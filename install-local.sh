#!/bin/bash
# Local MOD Installation Script
# Installs both CLI and GUI from local build artifacts

set -e

echo "Installing MOD (Model of Design Toolsuite) from local build..."
echo "============================================================="

# Check if we're in the right directory
if [ ! -f "packages/opencode/package.json" ]; then
    echo "Error: Must run from repo root"
    exit 1
fi

BIN_DIR="${HOME}/.bun/bin"
APP_DIR="/Applications"

mkdir -p "$BIN_DIR"

echo ""
echo "1. Installing CLI..."
if [ -f "packages/opencode/dist/mod-darwin-arm64/bin/mod" ]; then
    cp "packages/opencode/dist/mod-darwin-arm64/bin/mod" "$BIN_DIR/mod"
    chmod +x "$BIN_DIR/mod"
    echo "   ✓ CLI installed: $BIN_DIR/mod"
elif [ -f "packages/opencode/dist/mod-darwin-x64/bin/mod" ]; then
    cp "packages/opencode/dist/mod-darwin-x64/bin/mod" "$BIN_DIR/mod"
    chmod +x "$BIN_DIR/mod"
    echo "   ✓ CLI installed: $BIN_DIR/mod"
else
    echo "   ✗ CLI build not found. Run: bun run --cwd packages/opencode build --single"
    exit 1
fi

echo ""
echo "2. Installing GUI..."
GUI_APP="packages/desktop/src-tauri/target/release/bundle/macos/MOD Dev.app"
if [ -d "$GUI_APP" ]; then
    rm -rf "$APP_DIR/MOD Dev.app"
    cp -R "$GUI_APP" "$APP_DIR/"
    echo "   ✓ GUI installed: $APP_DIR/MOD Dev.app"
else
    echo "   ✗ GUI build not found. Run: bun run --cwd packages/desktop tauri build"
    exit 1
fi

echo ""
echo "3. Setting up shell integration..."
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    SHELL_NAME=$(basename "$SHELL")
    case "$SHELL_NAME" in
        bash)
            echo "export PATH=\"$BIN_DIR:\$PATH\"" >> "${HOME}/.bashrc"
            echo "   ✓ Added to ~/.bashrc"
            ;;
        zsh)
            echo "export PATH=\"$BIN_DIR:\$PATH\"" >> "${HOME}/.zshrc"
            echo "   ✓ Added to ~/.zshrc"
            ;;
        fish)
            echo "set -Ux PATH $BIN_DIR \$PATH" | fish
            echo "   ✓ Added to Fish PATH"
            ;;
        *)
            echo "   ! Please add $BIN_DIR to your PATH manually"
            ;;
    esac
else
    echo "   ✓ Already in PATH"
fi

echo ""
echo "============================================================="
echo "Installation complete!"
echo ""
echo "CLI version: $(mod --version)"
echo "GUI: /Applications/MOD Dev.app"
echo ""
echo "Usage:"
echo "  mod --help     # CLI help"
echo "  mod            # Start TUI"
echo "  open /Applications/MOD\\ Dev.app  # Launch GUI"
echo ""
