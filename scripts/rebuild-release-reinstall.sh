#!/bin/bash
# MOD Rebuild, Release, and Reinstall Script
# Usage: ./scripts/rebuild-release-reinstall.sh [options]
#
# Options:
#   --all-platforms  Build for all platforms
#   --no-cli        Skip CLI installation
#   --no-tui        Skip TUI installation (same as CLI)
#   --no-gui        Skip GUI build and installation
#   --no-all-platforms  Build only for current platform
#   --help          Show this help message
#
# By default, builds all platforms and installs CLI, TUI, and GUI.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default: install everything
INSTALL_CLI=true
INSTALL_TUI=true
INSTALL_GUI=true
BUILD_ALL_PLATFORMS=true
SKIP_PREREQ_CHECK=false
RERUN=true
RELEASE=true
RELEASE_VERSION=""
DEV_MODE=false

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --no-cli|--no-tui)
      INSTALL_CLI=false
      INSTALL_TUI=false
      shift
      ;;
    --no-gui)
      INSTALL_GUI=false
      shift
      ;;
    --no-all-platforms)
      BUILD_ALL_PLATFORMS=false
      shift
      ;;
    --skip-prereq-check)
      SKIP_PREREQ_CHECK=true
      shift
      ;;
    --no-rerun)
      RERUN=false
      shift
      ;;
    --release)
      RELEASE=true
      shift
      ;;
    --dev)
      DEV_MODE=true
      RELEASE=false
      shift
      ;;
    --version)
      if [[ -n "$2" && "$2" != --* ]]; then
        RELEASE_VERSION="$2"
        shift 2
      else
        echo "Error: --version requires a version argument (e.g., --version 1.2.3)"
        exit 1
      fi
      ;;
    --gui)
      # Legacy flag - now default behavior
      shift
      ;;
    --all-platforms)
      # Legacy flag - now default behavior
      shift
      ;;
    --help|-h)
      echo "MOD Rebuild, Release, and Reinstall Script"
      echo ""
      echo "Usage: $0 [options]"
      echo ""
      echo "Options:"
      echo "  --all-platforms       Build for all platforms (default)"
      echo "  --no-cli              Skip CLI/TUI installation"
      echo "  --no-gui              Skip GUI build and installation"
      echo "  --no-all-platforms    Build only for current platform"
      echo "  --skip-prereq-check   Skip GUI prerequisite checks"
      echo "  --no-rerun            Do not relaunch and verify after installing"
      echo "  --dev                 Build dev version (0.0.0-dev) instead of release"
      echo "  --version <ver>       Set specific version (overrides git tag)"
      echo "  --help                Show this help message"
      echo ""
      echo "By default, builds RELEASE version from latest git tag for all platforms."
      echo ""
      echo "Examples:"
      echo "  $0                      # Release build from git tag (default)"
      echo "  $0 --dev                # Dev build (0.0.0-dev-*)"
      echo "  $0 --version 1.2.3      # Release build with specific version"
      echo "  $0 --no-gui             # Release build, CLI/TUI only"
      echo "  $0 --no-cli             # Release build, GUI only"
      echo "  $0 --no-all-platforms   # Release build, current platform only"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Run '$0 --help' for usage information."
      exit 1
      ;;
  esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  MOD Rebuild & Reinstall${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Build configuration:"
echo "  All Platforms: $BUILD_ALL_PLATFORMS"
echo "  Install CLI/TUI: $INSTALL_CLI"
echo "  Install GUI: $INSTALL_GUI"
echo ""

# Get project root (script is in scripts/, so need to go up 1 level)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"
echo -e "${BLUE}Project root: $PROJECT_ROOT${NC}"

# Detect platform
PLATFORM=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ]; then
  ARCH="arm64"
fi

echo -e "${BLUE}Detected platform: $PLATFORM-$ARCH${NC}"
echo ""

# ============================================
# STEP 1: Clean Previous Builds
# ============================================
echo -e "${YELLOW}Step 1: Cleaning previous builds...${NC}"

# Clean modtools dist
if [ -d "packages/modtools/dist" ]; then
  rm -rf packages/modtools/dist
  echo -e "  ${GREEN}Cleaned packages/modtools/dist${NC}"
fi

# Clean SDK dist
if [ -d "packages/sdk/js/dist" ]; then
  rm -rf packages/sdk/js/dist
  echo -e "  ${GREEN}Cleaned packages/sdk/js/dist${NC}"
fi

# Clean desktop dist
if [ -d "packages/desktop/dist" ]; then
  rm -rf packages/desktop/dist
  echo -e "  ${GREEN}Cleaned packages/desktop/dist${NC}"
fi

# Clean Electron build output
if [ -d "packages/desktop/out" ]; then
  rm -rf packages/desktop/out
  echo -e "  ${GREEN}Cleaned packages/desktop/out${NC}"
fi

# Clean node_modules/.cache if it exists
if [ -d "node_modules/.cache" ]; then
  rm -rf node_modules/.cache
  echo -e "  ${GREEN}Cleaned node_modules/.cache${NC}"
fi

echo ""

# ============================================
# STEP 2: Install Dependencies
# ============================================
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
bun install

# Apply undici shim patch (replaces undici import with globalThis shim for Bun compile mode)
UNDICI_SHIM='/**
 * @since 1.0.0
 * Shim: replaced undici with globalThis equivalents for Bun compile mode.
 */
export const fetch = globalThis.fetch
export const Request = globalThis.Request
export const Response = globalThis.Response
export const Headers = globalThis.Headers
export const FormData = globalThis.FormData
export const File = globalThis.File
export const Agent = class {}
export const getGlobalDispatcher = () => ({})
export const setGlobalDispatcher = () => {}
export default {
  fetch: globalThis.fetch,
  Request: globalThis.Request,
  Response: globalThis.Response,
  Headers: globalThis.Headers,
  FormData: globalThis.FormData,
  File: globalThis.File,
  Agent,
  getGlobalDispatcher,
  setGlobalDispatcher,
}'

for f in $(find node_modules -name 'Undici.js' -path '*@effect*platform-node*dist*' 2>/dev/null); do
  echo "$UNDICI_SHIM" > "$f"
  echo -e "  ${BLUE}Patched undici shim: $f${NC}"
done

echo -e "  ${GREEN}Dependencies installed${NC}"
echo ""

# ============================================
# STEP 3: Build SDK
# ============================================
echo -e "${YELLOW}Step 3: Building SDK...${NC}"
cd packages/sdk/js

# Generate SDK if needed
if [ -f "./script/build.ts" ]; then
  bun run ./script/build.ts
elif [ -f "../../app/sst-env.d.ts" ]; then
  # Copy environment types if they exist
  cp ../../app/sst-env.d.ts ./sst-env.d.ts 2>/dev/null || true
fi

cd "$PROJECT_ROOT"
echo -e "  ${GREEN}SDK built${NC}"
echo ""

# ============================================
# STEP 4: Check Prerequisites for GUI
# ============================================
if [ "$INSTALL_GUI" = true ] && [ "$SKIP_PREREQ_CHECK" = false ]; then
  echo -e "${YELLOW}Step 4: Checking GUI build prerequisites...${NC}"

  MISSING_DEPS=""

  # Upstream replaced Tauri with Electron, so the GUI needs no Rust toolchain.
  if [ ! -d "packages/desktop/node_modules/electron" ]; then
    MISSING_DEPS="$MISSING_DEPS\n  - electron (run: bun install)"
  else
    ELECTRON_VERSION=$(cat packages/desktop/node_modules/electron/package.json 2>/dev/null | grep -m1 '"version"' | cut -d'"' -f4)
    echo -e "  ${GREEN}Electron found: $ELECTRON_VERSION${NC}"
  fi

  if [ ! -d "packages/desktop/node_modules/electron-builder" ]; then
    MISSING_DEPS="$MISSING_DEPS\n  - electron-builder (run: bun install)"
  else
    echo -e "  ${GREEN}electron-builder found${NC}"
  fi

  # Platform-specific checks
  if [ "$PLATFORM" = "darwin" ]; then
    # Check for Xcode Command Line Tools (needed for signing)
    if ! xcode-select -p >/dev/null 2>&1; then
      echo -e "  ${YELLOW}Warning: Xcode Command Line Tools not found${NC}"
      echo -e "    Install with: xcode-select --install"
    fi
  fi

  if [ -n "$MISSING_DEPS" ]; then
    echo -e "${RED}Missing prerequisites for GUI build:${NC}"
    echo -e "$MISSING_DEPS"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  1. Install missing dependencies and re-run"
    echo "  2. Skip GUI build: ./scripts/rebuild-release-reinstall.sh --no-gui"
    echo ""
    read -p "Continue without GUI? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      INSTALL_GUI=false
      echo -e "${YELLOW}Skipping GUI build${NC}"
    else
      exit 1
    fi
  else
    echo -e "  ${GREEN}All GUI prerequisites satisfied${NC}"
  fi
  echo ""
fi

# ============================================
# STEP 5: Build CLI/TUI (modtools)
# ============================================
echo -e "${YELLOW}Step 5: Building CLI/TUI...${NC}"
cd packages/modtools

# Set build flags
if [ "$RELEASE" = true ]; then
  echo -e "  ${BLUE}Building RELEASE version...${NC}"
  # Deliberately NOT setting MODTOOLS_RELEASE: in build.ts that flag gates
  # `gh release upload`, i.e. publishing artifacts to the GitHub repo. A local
  # rebuild only needs a real version number, which MODTOOLS_VERSION provides.
  export MODTOOLS_CHANNEL="latest"
  if [ -n "$RELEASE_VERSION" ]; then
    export MODTOOLS_VERSION="$RELEASE_VERSION"
    echo -e "  ${BLUE}Channel: latest | Version: $RELEASE_VERSION${NC}"
  else
    # Get version from latest git tag, fallback to 1.0.0
    GIT_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
    if [ -n "$GIT_TAG" ]; then
      # Remove 'v' prefix if present
      TAG_VERSION="${GIT_TAG#v}"
      export MODTOOLS_VERSION="$TAG_VERSION"
      echo -e "  ${BLUE}Channel: latest | Version: $TAG_VERSION (from git tag $GIT_TAG)${NC}"
    else
      echo -e "  ${YELLOW}No git tag found, using auto-detected version${NC}"
    fi
  fi
fi

if [ "$BUILD_ALL_PLATFORMS" = true ]; then
  echo -e "  ${BLUE}Building for all platforms...${NC}"
  bun run script/build.ts
else
  echo -e "  ${BLUE}Building for current platform ($PLATFORM-$ARCH)...${NC}"
  bun run script/build.ts --single --skip-install
fi

cd "$PROJECT_ROOT"
  echo -e "  ${GREEN}CLI/TUI built${NC}"

  # Copy built CLI to desktop sidecars for bundling
  if [ "$INSTALL_GUI" = true ]; then
    echo -e "  ${BLUE}Updating desktop sidecar...${NC}"
    LOCAL_BIN="packages/modtools/dist/modtools-${PLATFORM}-${ARCH}/bin/mod"
    if [ -f "$LOCAL_BIN" ]; then
      # v1.17.7 uses Electron; copy sidecar into resources/ for electron-builder
      SIDECAR_DIR="packages/desktop/resources"
      mkdir -p "$SIDECAR_DIR"
      cp "$LOCAL_BIN" "$SIDECAR_DIR/modtools-cli"

      # Sign the sidecar for macOS
      if [ "$PLATFORM" = "darwin" ]; then
        codesign --remove-signature "$SIDECAR_DIR/modtools-cli" 2>/dev/null || true
        codesign --force --sign - --deep "$SIDECAR_DIR/modtools-cli" 2>/dev/null || true
      fi
      echo -e "  ${GREEN}Updated sidecar: $SIDECAR_DIR/modtools-cli${NC}"
    else
      echo -e "  ${YELLOW}Warning: Could not find built binary at $LOCAL_BIN${NC}"
    fi
  fi

  echo ""

  # ============================================
  # STEP 5: Build Desktop GUI
  # ============================================
  if [ "$INSTALL_GUI" = true ]; then
    echo -e "${YELLOW}Step 5: Building Desktop GUI...${NC}"
    cd packages/desktop

  cd "$PROJECT_ROOT"

  # The Electron main process embeds the server from packages/modtools/dist/node
  # (electron.vite.config.ts resolves virtual:mod-server against it), so that bundle
  # has to exist before the renderer is built. It is not the CLI sidecar binary.
  echo -e "  ${BLUE}Building Node server bundle...${NC}"
  bun run --cwd packages/modtools script/build-node.ts

  cd packages/desktop
  bun run typecheck
  bun run build

  # Package with electron-builder. Signing identity and notarization are disabled:
  # notarization needs Apple credentials and would fail on a local rebuild, and an
  # ad-hoc signature is applied to the installed bundle further down.
  # electron-builder picks productName by channel, and anything other than
  # dev/beta/prod falls back to "dev" -- which builds "MOD Dev.app" and leaves the
  # install step below (which expects MOD.app) with nothing to copy.
  export MODTOOLS_CHANNEL=prod
  echo -e "  ${BLUE}Packaging Electron app (channel: prod)...${NC}"
  if [ "$PLATFORM" = "darwin" ]; then
    bun run package:mac -c.mac.notarize=false -c.mac.identity=null
  elif [ "$PLATFORM" = "linux" ]; then
    bun run package:linux
  else
    bun run package:win
  fi

  cd "$PROJECT_ROOT"
  echo -e "  ${GREEN}Desktop GUI built${NC}"
  echo ""
fi

# ============================================
# STEP 6: Install CLI/TUI
# ============================================
if [ "$INSTALL_CLI" = true ] || [ "$INSTALL_TUI" = true ]; then
  echo -e "${YELLOW}Step 6: Installing CLI/TUI...${NC}"

  # Find the built binary
  MOD_PACKAGE_NAME="@modtools-ai/mod"
  DIST_DIR="packages/modtools/dist"

  # Determine the correct binary name based on platform
  if [ "$PLATFORM" = "darwin" ]; then
    PLATFORM_NAME="darwin"
    BINARY_NAME="mod"
  elif [ "$PLATFORM" = "linux" ]; then
    PLATFORM_NAME="linux"
    BINARY_NAME="mod"
  else
    PLATFORM_NAME="windows"
    BINARY_NAME="mod.exe"
  fi

  # Check for AVX2 support for x64
  if [ "$ARCH" = "x64" ] || [ "$ARCH" = "amd64" ]; then
    if [ "$PLATFORM" = "darwin" ]; then
      if sysctl -n hw.optional.avx2_0 2>/dev/null | grep -q "1"; then
        HAS_AVX2=true
      else
        HAS_AVX2=false
      fi
    elif [ "$PLATFORM" = "linux" ]; then
      if grep -q "avx2" /proc/cpuinfo 2>/dev/null; then
        HAS_AVX2=true
      else
        HAS_AVX2=false
      fi
    else
      HAS_AVX2=false
    fi

    if [ "$HAS_AVX2" = false ]; then
      PLATFORM_SUFFIX="${PLATFORM_NAME}-x64-baseline"
    else
      PLATFORM_SUFFIX="${PLATFORM_NAME}-x64"
    fi
  else
    PLATFORM_SUFFIX="${PLATFORM_NAME}-arm64"
  fi

  # Check for musl on Linux
  if [ "$PLATFORM" = "linux" ]; then
    if [ -f /etc/alpine-release ] || (ldd --version 2>&1 | grep -q musl); then
      if [[ "$PLATFORM_SUFFIX" == *"x64"* ]]; then
        if [[ "$PLATFORM_SUFFIX" == *"baseline"* ]]; then
          PLATFORM_SUFFIX="${PLATFORM_NAME}-x64-baseline-musl"
        else
          PLATFORM_SUFFIX="${PLATFORM_NAME}-x64-musl"
        fi
      else
        PLATFORM_SUFFIX="${PLATFORM_NAME}-arm64-musl"
      fi
    fi
  fi

  PACKAGE_NAME="modtools-${PLATFORM_SUFFIX}"
  BINARY_PATH="${DIST_DIR}/${PACKAGE_NAME}/bin/${BINARY_NAME}"

  if [ ! -f "$BINARY_PATH" ]; then
    echo -e "  ${RED}Error: Built binary not found at $BINARY_PATH${NC}"
    echo -e "  ${YELLOW}Available binaries:${NC}"
    find "$DIST_DIR" -name "mod" -o -name "mod.exe" 2>/dev/null | head -10
    exit 1
  fi

  echo -e "  ${GREEN}Found binary: $BINARY_PATH${NC}"

  # Sign binary on macOS (required for Bun-compiled binaries)
  if [ "$PLATFORM" = "darwin" ]; then
    echo -e "  ${BLUE}Signing binary for macOS...${NC}"
    # Remove any existing signatures and extended attributes
    codesign --remove-signature "$BINARY_PATH" 2>/dev/null || true
    xattr -cr "$BINARY_PATH" 2>/dev/null || true
    # Ad-hoc sign the binary with deep signing
    codesign --force --sign - --deep "$BINARY_PATH" 2>/dev/null || true
  fi

  # Get absolute path to binary
  MOD_BIN_PATH="$(cd "$(dirname "$BINARY_PATH")" && pwd)/$(basename "$BINARY_PATH")"

  # Determine which bin directory to use (prefer ~/.bun/bin if in PATH, else ~/.local/bin)
  BUN_BIN_DIR="$HOME/.bun/bin"
  LOCAL_BIN_DIR="$HOME/.local/bin"

  if [[ ":$PATH:" == *":$BUN_BIN_DIR:"* ]]; then
    GLOBAL_BIN_DIR="$BUN_BIN_DIR"
    echo -e "  ${BLUE}Using ~/.bun/bin (found earlier in PATH)${NC}"
  else
    GLOBAL_BIN_DIR="$LOCAL_BIN_DIR"
    if [ ! -d "$GLOBAL_BIN_DIR" ]; then
      mkdir -p "$GLOBAL_BIN_DIR"
    fi
    echo -e "  ${BLUE}Using ~/.local/bin${NC}"
  fi

  WRAPPER_TARGET="$GLOBAL_BIN_DIR/mod"

  # Create wrapper script using native binary
  cat > "$WRAPPER_TARGET" << EOF
#!/bin/bash
# MOD CLI Wrapper - Auto-generated by rebuild script
# Binary: $MOD_BIN_PATH

if [ ! -f "$MOD_BIN_PATH" ]; then
  echo "Error: MOD binary not found at $MOD_BIN_PATH"
  echo "Please run: bash .packages/scripts/rebuild-release-reinstall.sh"
  exit 1
fi

exec "$MOD_BIN_PATH" "\$@"
EOF

  chmod +x "$WRAPPER_TARGET"
  echo -e "  ${GREEN}Installed wrapper script to $WRAPPER_TARGET${NC}"

  # Also install to the other location for consistency
  OTHER_BIN_DIR=""
  if [ "$GLOBAL_BIN_DIR" = "$BUN_BIN_DIR" ]; then
    OTHER_BIN_DIR="$LOCAL_BIN_DIR"
  else
    OTHER_BIN_DIR="$BUN_BIN_DIR"
  fi

  if [ -d "$OTHER_BIN_DIR" ]; then
    cp "$WRAPPER_TARGET" "$OTHER_BIN_DIR/mod"
    chmod +x "$OTHER_BIN_DIR/mod"
    echo -e "  ${GREEN}Also installed to $OTHER_BIN_DIR/mod${NC}"
  fi

  # Verify CLI installation
  echo ""
  echo -e "${YELLOW}Verifying CLI installation...${NC}"
  if "$WRAPPER_TARGET" --version 2>/dev/null; then
    echo -e "  ${GREEN}CLI installation verified!${NC}"
  else
    echo -e "  ${YELLOW}Warning: Could not verify CLI version${NC}"
  fi
fi

# ============================================
# STEP 7: Install GUI
# ============================================
if [ "$INSTALL_GUI" = true ]; then
  echo ""
  echo -e "${YELLOW}Step 7: Installing GUI...${NC}"

  # electron-builder writes to packages/desktop/dist (directories.output).
  DESKTOP_DIST="packages/desktop/dist"

  if [ "$PLATFORM" = "darwin" ]; then
    # macOS: Install .app bundle to /Applications
    APP_BUNDLE=$(find "$DESKTOP_DIST" -maxdepth 2 -name "*.app" -type d 2>/dev/null | head -1)
    DMG_FILE=$(ls "$DESKTOP_DIST/"*.dmg 2>/dev/null | head -1)

    if [ -d "$APP_BUNDLE" ]; then
      echo -e "  ${BLUE}Installing MOD.app to /Applications...${NC}"

      # Remove old app if exists
      if [ -d "/Applications/MOD.app" ]; then
        echo -e "  ${YELLOW}Removing existing MOD.app...${NC}"
        rm -rf "/Applications/MOD.app"
      fi

      # Copy new app
      cp -R "$APP_BUNDLE" /Applications/
      
      # Final sign of the installed app (ensures sidecars are signed and work on macOS)
      if [ "$PLATFORM" = "darwin" ]; then
        echo -e "  ${BLUE}Performing final code signing of MOD.app...${NC}"
        # Force sign all binaries in the bundle
        find "/Applications/MOD.app" -type f \( -perm -u=x -o -name "*.dylib" -o -name "*.so" \) -exec codesign --force --sign - --deep "{}" 2>/dev/null \;
        codesign --force --sign - --deep "/Applications/MOD.app" 2>/dev/null || true
      fi

      echo -e "  ${GREEN}MOD.app installed to /Applications${NC}"

      # Also show DMG location if available
      if [ -n "$DMG_FILE" ] && [ -f "$DMG_FILE" ]; then
        echo -e "  ${BLUE}DMG installer available at:${NC}"
        echo "    $DMG_FILE"
      fi
    else
      echo -e "  ${RED}Error: MOD.app bundle not found${NC}"
      echo "    Expected: $APP_BUNDLE"
      echo "    Build may have failed."
    fi

  elif [ "$PLATFORM" = "linux" ]; then
    # Linux: Install .deb or AppImage
    DEB_FILE=$(ls "$DESKTOP_DIST/"*.deb 2>/dev/null | head -1)
    APPIMAGE_FILE=$(ls "$DESKTOP_DIST/"*.AppImage 2>/dev/null | head -1)

    if [ -n "$DEB_FILE" ] && [ -f "$DEB_FILE" ]; then
      echo -e "  ${BLUE}Installing MOD via dpkg...${NC}"
      echo "    Package: $DEB_FILE"
      sudo dpkg -i "$DEB_FILE" || echo -e "  ${YELLOW}dpkg installation may require manual dependency resolution${NC}"
    elif [ -n "$APPIMAGE_FILE" ] && [ -f "$APPIMAGE_FILE" ]; then
      echo -e "  ${BLUE}Installing MOD AppImage...${NC}"
      mkdir -p "$HOME/.local/bin"
      cp "$APPIMAGE_FILE" "$HOME/.local/bin/MOD"
      chmod +x "$HOME/.local/bin/MOD"
      echo -e "  ${GREEN}MOD AppImage installed to ~/.local/bin/MOD${NC}"
    else
      echo -e "  ${RED}Error: No Linux installer found (.deb or .AppImage)${NC}"
    fi

  else
    # Windows: Show installer location
    INSTALLER_FILE=$(ls "$DESKTOP_DIST/"*.exe 2>/dev/null | head -1)
    MSI_FILE=$(ls "$DESKTOP_DIST/"*.msi 2>/dev/null | head -1)

    if [ -n "$INSTALLER_FILE" ] && [ -f "$INSTALLER_FILE" ]; then
      echo -e "  ${GREEN}Windows installer available:${NC}"
      echo "    $INSTALLER_FILE"
      echo ""
      echo "  Run the installer to install MOD:"
      echo "    $INSTALLER_FILE"
    elif [ -n "$MSI_FILE" ] && [ -f "$MSI_FILE" ]; then
      echo -e "  ${GREEN}Windows MSI installer available:${NC}"
      echo "    $MSI_FILE"
      echo ""
      echo "  Run the installer to install MOD:"
      echo "    msiexec /i $MSI_FILE"
    else
      echo -e "  ${RED}Error: No Windows installer found${NC}"
    fi
  fi
fi

# ============================================
# STEP 8: Relaunch & Verify
# ============================================
if [ "$RERUN" = true ]; then
  echo ""
  echo -e "${YELLOW}Step 8: Relaunching and verifying...${NC}"

  if [ "$INSTALL_CLI" = true ] || [ "$INSTALL_TUI" = true ]; then
    if MOD_REPORTED_VERSION=$("$WRAPPER_TARGET" --version 2>/dev/null); then
      echo -e "  ${GREEN}CLI responds: $MOD_REPORTED_VERSION${NC}"
    else
      echo -e "  ${RED}CLI did not respond to --version${NC}"
    fi
  fi

  if [ "$INSTALL_GUI" = true ] && [ "$PLATFORM" = "darwin" ] && [ -d "/Applications/MOD.app" ]; then
    # Restart so the freshly installed bundle is the one running, and so LaunchServices
    # re-reads the URL scheme registration that Ask MOD depends on.
    if pgrep -f "/Applications/MOD.app/Contents/MacOS/" >/dev/null 2>&1; then
      echo -e "  ${BLUE}Quitting the running MOD.app...${NC}"
      osascript -e 'quit app "MOD"' >/dev/null 2>&1 || pkill -f "/Applications/MOD.app/Contents/MacOS/" || true
      sleep 2
    fi
    # Launch by path, not by name: `open -a MOD` resolves through LaunchServices, which
    # still carries registrations for older MOD.app bundles (Tauri builds, mounted DMGs)
    # and will happily start one of those instead of what we just installed.
    echo -e "  ${BLUE}Launching /Applications/MOD.app...${NC}"
    open /Applications/MOD.app || echo -e "  ${YELLOW}Could not launch MOD.app${NC}"
    sleep 8
    if pgrep -f "/Applications/MOD.app/Contents/MacOS/" >/dev/null 2>&1; then
      echo -e "  ${GREEN}MOD.app is running${NC}"
    else
      echo -e "  ${YELLOW}MOD.app did not stay running — check Console.app for crashes${NC}"
    fi
  fi
fi

# ============================================
# Summary
# ============================================
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}  Rebuild & Installation Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ "$INSTALL_CLI" = true ] || [ "$INSTALL_TUI" = true ]; then
  echo "CLI/TUI:"
  echo "  Binary: $MOD_BIN_PATH"
  echo "  Wrapper: $WRAPPER_TARGET"
  echo "  Command: mod"
  echo ""
fi

if [ "$INSTALL_GUI" = true ]; then
  echo "GUI:"
  if [ "$PLATFORM" = "darwin" ]; then
    echo "  Location: /Applications/MOD.app"
    echo "  Run: open -a MOD"
  elif [ "$PLATFORM" = "linux" ]; then
    if command -v mod &>/dev/null; then
      echo "  Command: mod (AppImage)"
    else
      echo "  Installed via system package manager"
    fi
  else
    echo "  Installer available in: packages/desktop/dist/"
  fi
  echo ""
fi

echo "All builds available in:"
echo "  CLI/TUI: packages/modtools/dist/"
if [ "$INSTALL_GUI" = true ]; then
  echo "  GUI: packages/desktop/dist/"
fi
echo ""
