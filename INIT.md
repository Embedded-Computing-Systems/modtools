# MOD Branding Initialization

This document defines the branding guidelines for the MOD (Model of Design) CLI tool, part of the Embedded Computing Systems (ECS) ecosystem.

## Product Identity

- **Product Name**: MOD (not "OpenCode")
- **Parent Organization**: Embedded Computing Systems (ECS)
- **Full Branding**: "MOD by Embedded Computing Systems"

## Naming Conventions

### What to Use
- **MOD** — Primary product name in all CLI contexts
- **mod** — Command-line invocation (lowercase)
- **Embedded Computing Systems** — Parent organization name
- **ECS** — Abbreviation for Embedded Computing Systems (where space-constrained)

### What to Avoid
- **OpenCode** — Legacy name, should be replaced with MOD
- **Open Code** — Two-word variant, not used
- **Claude** — Do not confuse with the underlying AI model

## TUI Branding Guidelines

### Sidebar Footer

Location: `packages/modtools/src/cli/cmd/tui/feature-plugins/sidebar/footer.tsx`

The footer must display:
- Green dot (success indicator) for connected state
- **MOD** in bold with secondary text color
- Version number in muted color

```tsx
<text fg={theme().textMuted}>
  <span style={{ fg: theme().success }}>•</span>
  <span style={{ fg: theme().text }}>
    <b>MOD</b>
  </span>{" "}
  <span>{props.api.app.version}</span>
</text>
```

**Do NOT use:**
```tsx
// ❌ Legacy OpenCode branding
<span style={{ fg: theme().success }}>•</span> <b>Open</b>
<span style={{ fg: theme().text }}><b>Code</b></span>
```

### Window Title

Location: `packages/modtools/src/cli/cmd/tui/app.tsx`

Terminal window titles should use "MOD":
```typescript
renderer.setTerminalTitle("MOD")              // Home route
renderer.setTerminalTitle(`MOD | ${title}`)   // Session route
renderer.setTerminalTitle(`MOD | ${id}`)      // Plugin route
```

## Branding Verification

After making changes, verify:

1. Run the TUI: `mod --tui` or `modtui`
2. Check sidebar footer shows: `• MOD vX.X.X`
3. Check terminal title shows: `MOD` or `MOD | <session-name>`
4. Search for legacy references: `grep -r "OpenCode" packages/modtools/src/cli/`

## Rebuild and Install

To rebuild and reinstall all MOD components (CLI/TUI/GUI) from source and verify all platforms:

```bash
# From repository root, run the full rebuild script
bash .packages/scripts/rebuild-release-reinstall.sh --all-platforms
```

**Options:**
- `--no-all-platforms`: Build only for the current platform (faster).
- `--no-gui`: Skip the GUI/Desktop app build.
- `--skip-prereq-check`: Skip GUI prerequisite checks.

**Note:** The script is located at `.packages/scripts/rebuild-release-reinstall.sh`.

### macOS Code Signing

If the binary fails to run with `Killed: 9` or silent exit, it may be a code signing issue.

**Quick Fix:**
```bash
# Remove extended attributes and sign
xattr -cr packages/modtools/dist/modtools-darwin-arm64/bin/mod
codesign --force --sign - packages/modtools/dist/modtools-darwin-arm64/bin/mod
```

**Alternative (if signing fails):** Run directly with Bun:
```bash
# Use bun to run the source directly instead of compiled binary
bun run --cwd packages/modtools --conditions=browser src/index.ts

# Or create an alias in your shell profile
alias mod='bun run --cwd /Users/tage/git/modtools/packages/modtools --conditions=browser src/index.ts'
```

For the GUI app:
```bash
codesign --force --deep --sign - /Applications/MOD.app
```

## Reference Implementation

See `.packages/modtools/src/cli/cmd/tui/feature-plugins/sidebar/footer.tsx` for the canonical branded footer implementation.

## Related Files

- CLI branding assets: `.packages/cli-branding/`
- Identity assets: `.packages/identity/`
- Console branding: `.packages/console-brand/`

## Sync Points

When branding changes are made, sync to:
- `packages/modtools/src/cli/` — ASCII/terminal versions
- `packages/web/src/assets/` — Web assets
- `packages/console/app/src/asset/` — Console app assets
- `packages/desktop/src-tauri/icons/` — Desktop app icons
