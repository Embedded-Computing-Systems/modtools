<p align="center">
  <a href="https://mod.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="MOD logo">
    </picture>
  </a>
</p>
<p align="center">Открытый AI-агент для программирования.</p>
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

### Установка

```bash
# YOLO
curl -fsSL https://mod.ai/install | bash

# Менеджеры пакетов
npm i -g mod-ai@latest        # или bun/pnpm/yarn
scoop install mod             # Windows
choco install mod             # Windows
brew install anomalyco/tap/mod # macOS и Linux (рекомендуем, всегда актуально)
brew install mod              # macOS и Linux (официальная формула brew, обновляется реже)
sudo pacman -S mod            # Arch Linux (Stable)
paru -S mod-bin               # Arch Linux (Latest from AUR)
mise use -g mod               # любая ОС
nix run nixpkgs#mod           # или github:anomalyco/mod для самой свежей ветки dev
```

> [!TIP]
> Перед установкой удалите версии старше 0.1.x.

### Десктопное приложение (BETA)

MOD также доступен как десктопное приложение. Скачайте его со [страницы релизов](https://github.com/anomalyco/mod/releases) или с [mod.ai/download](https://mod.ai/download).

| Платформа             | Загрузка                              |
| --------------------- | ------------------------------------- |
| macOS (Apple Silicon) | `mod-desktop-darwin-aarch64.dmg` |
| macOS (Intel)         | `mod-desktop-darwin-x64.dmg`     |
| Windows               | `mod-desktop-windows-x64.exe`    |
| Linux                 | `.deb`, `.rpm` или AppImage           |

```bash
# macOS (Homebrew)
brew install --cask mod-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/mod-desktop
```

#### Каталог установки

Скрипт установки выбирает путь установки в следующем порядке приоритета:

1. `$OPENCODE_INSTALL_DIR` - Пользовательский каталог установки
2. `$XDG_BIN_DIR` - Путь, совместимый со спецификацией XDG Base Directory
3. `$HOME/bin` - Стандартный каталог пользовательских бинарников (если существует или можно создать)
4. `$HOME/.mod/bin` - Fallback по умолчанию

```bash
# Примеры
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://mod.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://mod.ai/install | bash
```

### Agents

В MOD есть два встроенных агента, между которыми можно переключаться клавишей `Tab`.

- **build** - По умолчанию, агент с полным доступом для разработки
- **plan** - Агент только для чтения для анализа и изучения кода
  - По умолчанию запрещает редактирование файлов
  - Запрашивает разрешение перед выполнением bash-команд
  - Идеален для изучения незнакомых кодовых баз или планирования изменений

Также включен сабагент **general** для сложных поисков и многошаговых задач.
Он используется внутренне и может быть вызван в сообщениях через `@general`.

Подробнее об [agents](https://mod.ai/docs/agents).

### Документация

Больше информации о том, как настроить MOD: [**наши docs**](https://mod.ai/docs).

### Вклад

Если вы хотите внести вклад в MOD, прочитайте [contributing docs](./CONTRIBUTING.md) перед тем, как отправлять pull request.

### Разработка на базе MOD

Если вы делаете проект, связанный с MOD, и используете "mod" как часть имени (например, "mod-dashboard" или "mod-mobile"), добавьте примечание в README, чтобы уточнить, что проект не создан командой MOD и не аффилирован с нами.

### FAQ

#### Чем это отличается от Claude Code?

По возможностям это очень похоже на Claude Code. Вот ключевые отличия:

- 100% open source
- Не привязано к одному провайдеру. Мы рекомендуем модели из [MOD Zen](https://mod.ai/zen); но MOD можно использовать с Claude, OpenAI, Google или даже локальными моделями. По мере развития моделей разрыв будет сокращаться, а цены падать, поэтому важна независимость от провайдера.
- Поддержка LSP из коробки
- Фокус на TUI. MOD построен пользователями neovim и создателями [terminal.shop](https://terminal.shop); мы будем раздвигать границы того, что возможно в терминале.
- Архитектура клиент/сервер. Например, это позволяет запускать MOD на вашем компьютере, а управлять им удаленно из мобильного приложения. Это значит, что TUI-фронтенд - лишь один из возможных клиентов.

---

**Присоединяйтесь к нашему сообществу** [Discord](https://discord.gg/mod) | [X.com](https://x.com/mod)
