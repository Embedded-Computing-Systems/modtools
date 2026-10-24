<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="شعار MOD">
    </picture>
  </a>
</p>
<p align="center">وكيل برمجة بالذكاء الاصطناعي مفتوح المصدر.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/@modtools-ai/cli"><img alt="npm" src="https://img.shields.io/npm/v/@modtools-ai/cli?style=flat-square" /></a>
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

[![MOD Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://opencode.ai)

---

### التثبيت

```bash
# YOLO
curl -fsSL https://opencode.ai/v2/install | bash

# مديري الحزم
npm i -g @modtools-ai/cli@latest      # او bun/pnpm/yarn
brew install anomalyco/tap/MOD-v2 # macOS و Linux (موصى به، دائما محدث)
brew install MOD              # macOS و Linux (صيغة brew الرسمية، تحديث اقل)
sudo pacman -S MOD            # Arch Linux (Stable)
paru -S MOD-beta              # Arch Linux (Latest from AUR)
mise use -g MOD               # اي نظام
nix run github:anomalyco/MOD  # Nix
```

> [!TIP]
> احذف الاصدارات الاقدم من 0.1.x قبل التثبيت.

### تطبيق سطح المكتب (BETA)

يتوفر MOD ايضا كتطبيق سطح مكتب. قم بالتنزيل من [opencode.ai/download](https://opencode.ai/download).

| المنصة                | التنزيل                            |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `MOD-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `MOD-desktop-mac-x64.dmg`     |
| Windows               | `MOD-desktop-win-x64.exe`     |
| Linux                 | `.deb` او `.rpm` او AppImage       |

```bash
# macOS (Homebrew)
brew install --cask MOD-desktop
```

#### مجلد التثبيت

يثبت سكربت التثبيت MOD في `$HOME/.mod/bin`.

### Agents

يتضمن MOD وكيليْن (Agents) مدمجين يمكنك التبديل بينهما باستخدام زر `Tab`.

- **build** - الافتراضي، وكيل بصلاحيات كاملة لاعمال التطوير
- **plan** - وكيل للقراءة فقط للتحليل واستكشاف الكود
  - يرفض تعديل الملفات افتراضيا
  - يطلب الاذن قبل تشغيل اوامر bash
  - مثالي لاستكشاف قواعد كود غير مألوفة او لتخطيط التغييرات

بالاضافة الى ذلك يوجد وكيل فرعي **general** للبحث المعقد والمهام متعددة الخطوات.
يستخدم داخليا ويمكن استدعاؤه بكتابة `@general` في الرسائل.

تعرف على المزيد حول [agents](https://opencode.ai/v2/docs/agents).

### التوثيق

لمزيد من المعلومات حول كيفية ضبط MOD، [**راجع التوثيق**](https://opencode.ai/v2/docs).

### المساهمة

اذا كنت مهتما بالمساهمة في MOD، يرجى قراءة [contributing docs](./CONTRIBUTING.md) قبل ارسال pull request.

### البناء فوق MOD

اذا كنت تعمل على مشروع مرتبط بـ MOD ويستخدم "MOD" كجزء من اسمه (مثل "MOD-dashboard" او "MOD-mobile")، يرجى اضافة ملاحظة في README توضح انه ليس مبنيا بواسطة فريق MOD ولا يرتبط بنا بأي شكل.

---

**انضم الى مجتمعنا** [Discord](https://discord.gg/MOD) | [X.com](https://x.com/MOD)
