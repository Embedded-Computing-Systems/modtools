#!/bin/bash
# MOD v2 rebuild, install and install-image script (macOS first; Linux/Windows build only).
#
# Usage: ./scripts/rebuild-release-reinstall.sh [options]
#
#   --version X        release version (default: latest v2 tag, without the "v")
#   --all-platforms    build the CLI for every target, not just this machine
#   --no-cli           do not install the CLI
#   --no-gui           do not build or install MOD.app
#   --no-image         do not build the install image (DMG for other Macs)
#   --no-backup        skip the backup of MOD's config, state and desktop data
#   --build-only       build everything, install nothing
#
# Layout (v2): the CLI builds to packages/modtools/dist/cli-<os>-<arch>/bin/mod, the desktop
# prebuild copies it into packages/desktop/resources/mod-cli (MODTOOLS_CLI_DIST is required
# for prod builds) and electron-builder writes packages/desktop/dist.
#
# The CLI and the desktop's bundled CLI are built from the same binary with the release
# channel, so both open the same store (mod-v2.db). A build without a channel would use
# mod-local.db and the two would see different sessions.
#
# Installs are versioned under ~/.local/share/mod-install/<version>/ with `current` naming
# the active one; earlier versions stay for rollback (re-point `current`). The replaced
# MOD.app is kept next to them as MOD-<old version>.app.

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

VERSION=""
ALL_PLATFORMS=false
INSTALL_CLI=true
INSTALL_GUI=true
BUILD_IMAGE=true
BACKUP=true
BUILD_ONLY=false

while [ $# -gt 0 ]; do
  case $1 in
    --version) VERSION="$2"; shift 2 ;;
    --all-platforms) ALL_PLATFORMS=true; shift ;;
    --no-cli) INSTALL_CLI=false; shift ;;
    --no-gui) INSTALL_GUI=false; BUILD_IMAGE=false; shift ;;
    --no-image) BUILD_IMAGE=false; shift ;;
    --no-backup) BACKUP=false; shift ;;
    --build-only) BUILD_ONLY=true; shift ;;
    --help|-h) sed -n '2,24p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $1 (see --help)" >&2; exit 1 ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"
export PATH="$HOME/.bun/bin:$PATH"

PLATFORM=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m); [ "$ARCH" = "aarch64" ] && ARCH=arm64; [ "$ARCH" = "x86_64" ] && ARCH=x64
if [ -z "$VERSION" ]; then
  VERSION=$(git tag --list 'v2.*' --sort=-v:refname | grep -E '^v2\.[0-9]+\.[0-9]+$' | head -1 | sed 's/^v//')
fi
[ -n "$VERSION" ] || { echo -e "${RED}No v2 tag found; pass --version${NC}" >&2; exit 1; }

# The release channel: CLI "latest" and desktop "prod" are the same release line, and both
# resolve the store to mod-v2.db. MODTOOLS_RELEASE stays unset: it gates publishing.
export MODTOOLS_VERSION="$VERSION"
DIST_CLI="$PROJECT_ROOT/packages/modtools/dist"

echo -e "${BLUE}MOD v2 build $VERSION on $PLATFORM-$ARCH ($PROJECT_ROOT)${NC}"

echo -e "${YELLOW}Step 1: Dependencies${NC}"
bun install

echo -e "${YELLOW}Step 2: CLI${NC}"
if [ "$ALL_PLATFORMS" = true ]; then
  ( cd packages/modtools && MODTOOLS_CHANNEL=latest bun run script/build.ts )
else
  ( cd packages/modtools && MODTOOLS_CHANNEL=latest bun run script/build.ts --single )
fi
# x64 targets may carry a -baseline suffix, so take whichever package matches this machine
CLI_BIN=$(ls -d "$DIST_CLI/cli-${PLATFORM}-${ARCH}"*/bin/mod 2>/dev/null | head -1)
[ -f "$CLI_BIN" ] || { echo -e "${RED}CLI not built at $CLI_BIN${NC}" >&2; ls "$DIST_CLI" >&2; exit 1; }
echo -e "  ${GREEN}$("$CLI_BIN" --version </dev/null)${NC} at $CLI_BIN"

if [ "$INSTALL_GUI" = true ]; then
  echo -e "${YELLOW}Step 3: Desktop${NC}"
  (
    cd packages/desktop
    export MODTOOLS_CHANNEL=prod MODTOOLS_CLI_DIST="$DIST_CLI"
    bun run prebuild
    bun run build
    # Notarization needs Apple credentials; the installed bundle is signed ad hoc below.
    case $PLATFORM in
      darwin) bun run package:mac -c.mac.notarize=false -c.mac.identity=null ;;
      linux) bun run package:linux ;;
      *) bun run package:win ;;
    esac
  )
fi
APP_SRC="$PROJECT_ROOT/packages/desktop/dist/mac-${ARCH}/MOD.app"

echo -e "${YELLOW}Step 4: Isolation check${NC}"
# Nothing shipped may name OpenCode's app ids, its service file, its install directory, or
# read OPENCODE_* variables (the only match allowed is a third-party plugin's export name).
check() {
  local file=$1 bad=0
  for pattern in 'ai\.opencode\.desktop' 'ai\.opencode\.managed' 'opencode/service\.json' '\.opencode/bin'; do
    if LC_ALL=C grep -aqE "$pattern" "$file"; then echo -e "  ${RED}$pattern in $file${NC}"; bad=1; fi
  done
  if LC_ALL=C grep -aoE 'OPENCODE_[A-Z_]+' "$file" | grep -qv '^OPENCODE_GITLAB_AUTH_CLIENT_ID$'; then
    echo -e "  ${RED}OPENCODE_* read in $file${NC}"; bad=1
  fi
  return $bad
}
check "$CLI_BIN"
[ "$INSTALL_GUI" = true ] && [ "$PLATFORM" = darwin ] && check "$APP_SRC/Contents/Resources/app.asar"
echo -e "  ${GREEN}clean${NC}"

if [ "$BUILD_ONLY" = true ]; then
  echo -e "${GREEN}Build complete (nothing installed)${NC}"
  exit 0
fi

INSTALL_ROOT="${MOD_INSTALL_ROOT:-$HOME/.local/share/mod-install}"
mkdir -p "$INSTALL_ROOT"

if [ "$BACKUP" = true ]; then
  echo -e "${YELLOW}Step 5: Backup${NC}"
  # mod.db is never written by v2 (it is read through a read-only connection), so it is
  # not part of the archive; config, state and desktop data are.
  STAMP=$(date +%Y%m%d-%H%M%S)
  ARCHIVE="$INSTALL_ROOT/backup-$STAMP.tar.gz"
  ITEMS=()
  for item in .config/mod .local/state/mod "Library/Application Support/ai.mod.desktop"; do
    [ -e "$HOME/$item" ] && ITEMS+=("$item")
  done
  if [ ${#ITEMS[@]} -gt 0 ]; then
    tar -czf "$ARCHIVE" -C "$HOME" --exclude '*/Cache*' --exclude '*/GPUCache' --exclude '*/Code Cache' \
      --exclude '*/compile-cache' "${ITEMS[@]}"
    echo -e "  ${GREEN}$ARCHIVE ($(du -h "$ARCHIVE" | cut -f1))${NC}"
  fi
fi

if [ "$INSTALL_CLI" = true ]; then
  echo -e "${YELLOW}Step 6: Install CLI${NC}"
  INSTALL_DIR="$INSTALL_ROOT/$VERSION"
  mkdir -p "$INSTALL_DIR/bin"
  cp "$CLI_BIN" "$INSTALL_DIR/bin/mod.new" && mv -f "$INSTALL_DIR/bin/mod.new" "$INSTALL_DIR/bin/mod"
  if [ "$PLATFORM" = darwin ]; then
    xattr -cr "$INSTALL_DIR/bin/mod" 2>/dev/null || true
    codesign --force --sign - "$INSTALL_DIR/bin/mod" 2>/dev/null || true
  fi
  ln -sfn "$INSTALL_DIR" "$INSTALL_ROOT/current"
  MOD_BIN="$INSTALL_ROOT/current/bin/mod"
  for dir in "$HOME/.bun/bin" "$HOME/.local/bin"; do
    [ -d "$dir" ] || [ "$dir" = "$HOME/.local/bin" ] || continue
    mkdir -p "$dir"
    cat > "$dir/mod" <<EOF
#!/bin/bash
# MOD CLI wrapper, written by rebuild-release-reinstall.sh. The active install is
# $INSTALL_ROOT/current; earlier versions stay beside it for rollback.
if [ ! -x "$MOD_BIN" ]; then
  echo "MOD binary not found at $MOD_BIN" >&2
  echo "Installed: \$(ls -1 "$INSTALL_ROOT" | grep -vE '^(current|backup-)' | tr '\n' ' ')" >&2
  exit 1
fi
exec "$MOD_BIN" "\$@"
EOF
    chmod +x "$dir/mod"
  done
  echo -e "  ${GREEN}$("$MOD_BIN" --version </dev/null) -> $INSTALL_DIR${NC}"
fi

if [ "$INSTALL_GUI" = true ] && [ "$PLATFORM" = darwin ]; then
  echo -e "${YELLOW}Step 7: Install MOD.app${NC}"
  [ -d "$APP_SRC" ] || { echo -e "${RED}MOD.app not built at $APP_SRC${NC}" >&2; exit 1; }
  osascript -e 'quit app "MOD"' 2>/dev/null || true
  for _ in $(seq 1 20); do pgrep -f "/Applications/MOD.app/" >/dev/null || break; sleep 0.5; done
  if [ -d /Applications/MOD.app ]; then
    OLD=$(/usr/libexec/PlistBuddy -c 'Print :CFBundleShortVersionString' /Applications/MOD.app/Contents/Info.plist 2>/dev/null || echo old)
    if [ "$OLD" != "$VERSION" ]; then
      rm -rf "$INSTALL_ROOT/MOD-$OLD.app"
      mv /Applications/MOD.app "$INSTALL_ROOT/MOD-$OLD.app"
      echo -e "  ${BLUE}previous MOD.app kept at $INSTALL_ROOT/MOD-$OLD.app${NC}"
    else
      rm -rf /Applications/MOD.app
    fi
  fi
  cp -R "$APP_SRC" /Applications/
  xattr -cr /Applications/MOD.app 2>/dev/null || true
  find /Applications/MOD.app -type f \( -perm -u=x -o -name "*.dylib" -o -name "*.so" \) \
    -exec codesign --force --sign - "{}" \; 2>/dev/null || true
  codesign --force --sign - --deep /Applications/MOD.app 2>/dev/null || true
  /System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister \
    -f /Applications/MOD.app
  echo -e "  ${GREEN}MOD.app $VERSION installed${NC}"

  HELPER_BUILDER="$HOME/git/modtools/.packages/ask-mod/build-helper.sh"
  if [ -x "$HELPER_BUILDER" ]; then
    echo -e "${YELLOW}Step 8: Ask MOD helper${NC}"
    if "$HELPER_BUILDER" > /tmp/mod-askhelper.log 2>&1; then
      echo -e "  ${GREEN}Ask MOD.app installed and registered${NC}"
    else
      echo -e "  ${RED}helper build failed, see /tmp/mod-askhelper.log${NC}"
    fi
  fi
fi

if [ "$BUILD_IMAGE" = true ] && [ "$PLATFORM" = darwin ]; then
  IMAGE_BUILDER="$HOME/git/modtools/.packages/scripts/build-install-image.sh"
  if [ -x "$IMAGE_BUILDER" ]; then
    echo -e "${YELLOW}Step 9: Install image${NC}"
    if "$IMAGE_BUILDER" --worktree "$PROJECT_ROOT" > /tmp/mod-image.log 2>&1; then
      echo -e "  ${GREEN}$(grep -o 'Image ready: .*' /tmp/mod-image.log | head -1)${NC}"
    else
      echo -e "  ${RED}image build failed, see /tmp/mod-image.log${NC}"
    fi
  fi
fi

echo -e "${GREEN}Done: MOD $VERSION${NC}"
