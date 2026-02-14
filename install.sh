#!/bin/bash
# MOD (Model of Design Toolsuite) Installation Script
# Installs both CLI and GUI versions

set -e

REPO_URL="https://github.com/Embedded-Computing-Systems/mod"
INSTALL_DIR="${HOME}/.mod"
BIN_DIR="${HOME}/.bun/bin"
APP_DIR="/Applications"

echo "Installing MOD (Model of Design Toolsuite)..."
echo "============================================"

# Detect architecture
ARCH=$(uname -m)
OS=$(uname -s | tr '[:upper:]' '[:lower:]')

if [ "$ARCH" = "arm64" ]; then
    TARGET="darwin-arm64"
    DESKTOP_TARGET="aarch64-apple-darwin"
elif [ "$ARCH" = "x86_64" ]; then
    TARGET="darwin-x64"
    DESKTOP_TARGET="x86_64-apple-darwin"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

echo "Detected: $OS $ARCH"
echo ""

# Create directories
mkdir -p "$INSTALL_DIR"
mkdir -p "$BIN_DIR"

echo "1. Installing CLI..."
echo "   Downloading mod-cli-${TARGET}..."

# Download latest CLI release
CLI_URL="${REPO_URL}/releases/latest/download/mod-${TARGET}.zip"
if curl -fsSL "$CLI_URL" -o "/tmp/mod-cli.zip" 2>/dev/null; then
    unzip -q -o "/tmp/mod-cli.zip" -d "/tmp/"
    cp "/tmp/mod-${TARGET}/bin/mod" "$BIN_DIR/mod"
    chmod +x "$BIN_DIR/mod"
    rm -rf "/tmp/mod-cli.zip" "/tmp/mod-${TARGET}"
    echo "   ✓ CLI installed to $BIN_DIR/mod"
else
    echo "   ! Could not download release. Building from source..."
    if command -v bun &> /dev/null; then
        echo "   Building with Bun..."
        bun install
        bun run --cwd packages/opencode build --single
        cp "packages/opencode/dist/mod-${TARGET}/bin/mod" "$BIN_DIR/mod"
        chmod +x "$BIN_DIR/mod"
        echo "   ✓ CLI built and installed"
    else
        echo "   ✗ Bun not found. Please install Bun first:"
        echo "      curl -fsSL https://bun.sh/install | bash"
        exit 1
    fi
fi

echo ""
echo "2. Installing GUI..."
echo "   Downloading MOD Desktop..."

# Download latest Desktop release
DMG_URL="${REPO_URL}/releases/latest/download/MOD_Dev_$(echo $DESKTOP_TARGET | tr '_' '-')"
if [ "$OS" = "darwin" ]; then
    DMG_URL="${DMG_URL}.dmg"
    if curl -fsSL "$DMG_URL" -o "/tmp/MOD Dev.dmg" 2>/dev/null; then
        echo "   Mounting DMG..."
        hdiutil attach "/tmp/MOD Dev.dmg" -nobrowse -quiet
        echo "   Copying to Applications..."
        cp -R "/Volumes/MOD Dev/MOD Dev.app" "$APP_DIR/"
        hdiutil detach "/Volumes/MOD Dev" -quiet
        rm "/tmp/MOD Dev.dmg"
        echo "   ✓ GUI installed to $APP_DIR/MOD Dev.app"
    else
        echo "   ! Could not download DMG. Building from source..."
        if command -v cargo &> /dev/null && command -v bun &> /dev/null; then
            echo "   Building with Rust + Bun..."
            bun install
            bun run --cwd packages/desktop tauri build
            cp -R "packages/desktop/src-tauri/target/release/bundle/macos/MOD Dev.app" "$APP_DIR/"
            echo "   ✓ GUI built and installed"
        else
            echo "   ✗ Rust or Bun not found. Skipping GUI installation."
            echo "     To install GUI manually, ensure you have:"
            echo "     - Rust: https://rustup.rs"
            echo "     - Bun: https://bun.sh"
        fi
    fi
else
    echo "   ✗ GUI installation not supported on $OS via this script."
    echo "     Please download manually from: $REPO_URL/releases"
fi

echo ""
echo "3. Setting up shell integration..."

# Add to PATH if not already there
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
            fish -c "set -Ux PATH $BIN_DIR \$PATH"
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
echo "============================================"
echo "Installation complete!"
echo ""
echo "Usage:"
echo "  mod --help          # CLI help"
echo "  mod                 # Start TUI"
echo "  /Applications/MOD\ Dev.app  # Launch GUI"
echo ""
echo "Note: Restart your terminal or run:"
echo "  export PATH=\"$BIN_DIR:\$PATH\""
echo ""

# Verify installation
if command -v mod &> /dev/null; then
    echo "CLI version: $(mod --version)"
else
    echo "! CLI not found in PATH. Please restart your terminal."
fi

if [ -d "/Applications/MOD Dev.app" ]; then
    echo "GUI: /Applications/MOD Dev.app ✓"
else
    echo "! GUI not installed"
fi
