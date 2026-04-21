<p align="center">
  <a href="https://mod.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="MOD logo">
    </picture>
  </a>
</p>
<p align="center">Den open source AI-kodeagent.</p>
<p align="center">
  <a href="https://mod.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/mod-ai"><img alt="npm" src="https://img.shields.io/npm/v/mod-ai?style=flat-square" /></a>
  <a href="https://github.com/anomalyco/mod/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/anomalyco/mod/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![MOD Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://mod.ai)

---

### Installation

```bash
# YOLO
curl -fsSL https://mod.ai/install | bash

# Pakkehåndteringer
npm i -g mod-ai@latest        # eller bun/pnpm/yarn
scoop install mod             # Windows
choco install mod             # Windows
brew install anomalyco/tap/mod # macOS og Linux (anbefalet, altid up to date)
brew install mod              # macOS og Linux (officiel brew formula, opdateres sjældnere)
sudo pacman -S mod            # Arch Linux (Stable)
paru -S mod-bin               # Arch Linux (Latest from AUR)
mise use -g mod               # alle OS
nix run nixpkgs#mod           # eller github:anomalyco/mod for nyeste dev-branch
```

> [!TIP]
> Fjern versioner ældre end 0.1.x før installation.

### Desktop-app (BETA)

MOD findes også som desktop-app. Download direkte fra [releases-siden](https://github.com/anomalyco/mod/releases) eller [mod.ai/download](https://mod.ai/download).

| Platform              | Download                              |
| --------------------- | ------------------------------------- |
| macOS (Apple Silicon) | `mod-desktop-darwin-aarch64.dmg` |
| macOS (Intel)         | `mod-desktop-darwin-x64.dmg`     |
| Windows               | `mod-desktop-windows-x64.exe`    |
| Linux                 | `.deb`, `.rpm`, eller AppImage        |

```bash
# macOS (Homebrew)
brew install --cask mod-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/mod-desktop
```

#### Installationsmappe

Installationsscriptet bruger følgende prioriteringsrækkefølge for installationsstien:

1. `$OPENCODE_INSTALL_DIR` - Tilpasset installationsmappe
2. `$XDG_BIN_DIR` - Sti der følger XDG Base Directory Specification
3. `$HOME/bin` - Standard bruger-bin-mappe (hvis den findes eller kan oprettes)
4. `$HOME/.mod/bin` - Standard fallback

```bash
# Eksempler
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://mod.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://mod.ai/install | bash
```

### Agents

MOD har to indbyggede agents, som du kan skifte mellem med `Tab`-tasten.

- **build** - Standard, agent med fuld adgang til udviklingsarbejde
- **plan** - Skrivebeskyttet agent til analyse og kodeudforskning
  - Afviser filredigering som standard
  - Spørger om tilladelse før bash-kommandoer
  - Ideel til at udforske ukendte kodebaser eller planlægge ændringer

Derudover findes der en **general**-subagent til komplekse søgninger og flertrinsopgaver.
Den bruges internt og kan kaldes via `@general` i beskeder.

Læs mere om [agents](https://mod.ai/docs/agents).

### Dokumentation

For mere info om konfiguration af MOD, [**se vores docs**](https://mod.ai/docs).

### Bidrag

Hvis du vil bidrage til MOD, så læs vores [contributing docs](./CONTRIBUTING.md) før du sender en pull request.

### Bygget på MOD

Hvis du arbejder på et projekt der er relateret til MOD og bruger "mod" som en del af navnet; f.eks. "mod-dashboard" eller "mod-mobile", så tilføj en note i din README, der tydeliggør at projektet ikke er bygget af MOD-teamet og ikke er tilknyttet os på nogen måde.

### FAQ

#### Hvordan adskiller dette sig fra Claude Code?

Det minder meget om Claude Code i forhold til funktionalitet. Her er de vigtigste forskelle:

- 100% open source
- Ikke låst til en udbyder. Selvom vi anbefaler modellerne via [MOD Zen](https://mod.ai/zen); kan MOD bruges med Claude, OpenAI, Google eller endda lokale modeller. Efterhånden som modeller udvikler sig vil forskellene mindskes og priserne falde, så det er vigtigt at være provider-agnostic.
- LSP-support out of the box
- Fokus på TUI. MOD er bygget af neovim-brugere og skaberne af [terminal.shop](https://terminal.shop); vi vil skubbe grænserne for hvad der er muligt i terminalen.
- Klient/server-arkitektur. Det kan f.eks. lade MOD køre på din computer, mens du styrer den eksternt fra en mobilapp. Det betyder at TUI-frontend'en kun er en af de mulige clients.

---

**Bliv en del af vores community** [Discord](https://discord.gg/mod) | [X.com](https://x.com/mod)
