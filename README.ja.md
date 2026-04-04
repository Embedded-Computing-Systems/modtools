<p align="center">
  <a href="https://modtools.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Model-of-Design Tools logo">
    </picture>
  </a>
</p>
<p align="center">オープンソースのAIコーディングエージェント。</p>
<p align="center">
  <a href="https://modtools.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/modtools-ai"><img alt="npm" src="https://img.shields.io/npm/v/modtools-ai?style=flat-square" /></a>
  <a href="https://github.com/Embedded-Computing-Systems/modtools/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/Embedded-Computing-Systems/modtools/publish.yml?style=flat-square&branch=dev" /></a>
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

[![Model-of-Design Tools Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://modtools.ai)

---

### インストール

```bash
# YOLO
curl -fsSL https://modtools.ai/install | bash

# パッケージマネージャー
npm i -g modtools-ai@latest        # bun/pnpm/yarn でもOK
scoop install modtools             # Windows
choco install modtools             # Windows
brew install Embedded-Computing-Systems/tap/modtools # macOS と Linux（推奨。常に最新）
brew install modtools              # macOS と Linux（公式 brew formula。更新頻度は低め）
sudo pacman -S modtools            # Arch Linux (Stable)
paru -S modtools-bin               # Arch Linux (Latest from AUR)
mise use -g modtools               # どのOSでも
nix run nixpkgs#modtools           # または github:Embedded-Computing-Systems/modtools で最新 dev ブランチ
```

> [!TIP]
> インストール前に 0.1.x より古いバージョンを削除してください。

### デスクトップアプリ (BETA)

Model-of-Design Tools はデスクトップアプリとしても利用できます。[releases page](https://github.com/Embedded-Computing-Systems/modtools/releases) から直接ダウンロードするか、[modtools.ai/download](https://modtools.ai/download) を利用してください。

| プラットフォーム      | ダウンロード                          |
| --------------------- | ------------------------------------- |
| macOS (Apple Silicon) | `modtools-desktop-darwin-aarch64.dmg` |
| macOS (Intel)         | `modtools-desktop-darwin-x64.dmg`     |
| Windows               | `modtools-desktop-windows-x64.exe`    |
| Linux                 | `.deb`、`.rpm`、または AppImage       |

```bash
# macOS (Homebrew)
brew install --cask modtools-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/modtools-desktop
```

#### インストールディレクトリ

インストールスクリプトは、インストール先パスを次の優先順位で決定します。

1. `$MOD_INSTALL_DIR` - カスタムのインストールディレクトリ
2. `$XDG_BIN_DIR` - XDG Base Directory Specification に準拠したパス
3. `$HOME/bin` - 標準のユーザー用バイナリディレクトリ（存在する場合、または作成できる場合）
4. `$HOME/.modtools/bin` - デフォルトのフォールバック

```bash
# 例
MOD_INSTALL_DIR=/usr/local/bin curl -fsSL https://modtools.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://modtools.ai/install | bash
```

### Agents

Model-of-Design Tools には組み込みの Agent が2つあり、`Tab` キーで切り替えられます。

- **build** - デフォルト。開発向けのフルアクセス Agent
- **plan** - 分析とコード探索向けの読み取り専用 Agent
  - デフォルトでファイル編集を拒否
  - bash コマンド実行前に確認
  - 未知のコードベース探索や変更計画に最適

また、複雑な検索やマルチステップのタスク向けに **general** サブ Agent も含まれています。
内部的に使用されており、メッセージで `@general` と入力して呼び出せます。

[agents](https://modtools.ai/docs/agents) の詳細はこちら。

### ドキュメント

Model-of-Design Tools の設定については [**ドキュメント**](https://modtools.ai/docs) を参照してください。

### コントリビュート

Model-of-Design Tools に貢献したい場合は、Pull Request を送る前に [contributing docs](./CONTRIBUTING.md) を読んでください。

### Model-of-Design Tools の上に構築する

Model-of-Design Tools に関連するプロジェクトで、名前に "modtools"（例: "modtools-dashboard" や "modtools-mobile"）を含める場合は、そのプロジェクトが Model-of-Design Tools チームによって作られたものではなく、いかなる形でも関係がないことを README に明記してください。

### FAQ

#### Claude Code との違いは？

機能面では Claude Code と非常に似ています。主な違いは次のとおりです。

- 100% オープンソース
- 特定のプロバイダーに依存しません。[Model-of-Design Tools Zen](https://modtools.ai/zen) で提供しているモデルを推奨しますが、Model-of-Design Tools は Claude、OpenAI、Google、またはローカルモデルでも利用できます。モデルが進化すると差は縮まり価格も下がるため、provider-agnostic であることが重要です。
- そのまま使える LSP サポート
- TUI にフォーカス。Model-of-Design Tools は neovim ユーザーと [terminal.shop](https://terminal.shop) の制作者によって作られており、ターミナルで可能なことの限界を押し広げます。
- クライアント/サーバー構成。例えば Model-of-Design Tools をあなたのPCで動かし、モバイルアプリからリモート操作できます。TUI フロントエンドは複数あるクライアントの1つにすぎません。

---

**コミュニティに参加** [Discord](https://discord.gg/modtools) | [X.com](https://x.com/modtools)
