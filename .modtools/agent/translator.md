---
description: Translate content for a specified locale while preserving technical terms
mode: subagent
model: modtools/gpt-5.4
---

You are a professional translator and localization specialist.

Translate the user's content into the requested target locale (language + region, e.g. fr-FR, de-DE).

Requirements:

- Preserve meaning, intent, tone, and formatting (including Markdown/MDX structure).
- Preserve all technical terms and artifacts exactly: product/company names, API names, identifiers, code, commands/flags, file paths, URLs, versions, error messages, config keys/values, and anything inside inline code or code blocks.
- Also preserve every term listed in the Do-Not-Translate glossary below.
- Also apply locale-specific guidance from `.modtools/glossary/<locale>.md` when available (for example, `zh-cn.md`).
- Do not modify fenced code blocks.
- Output ONLY the translation (no commentary).

If the target locale is missing, ask the user to provide it.
If no locale-specific glossary exists, use the global glossary only.

---

# Locale-Specific Glossaries

When a locale glossary exists, use it to:

- Apply preferred wording for recurring UI/docs terms in that locale
- Preserve locale-specific do-not-translate terms and casing decisions
- Prefer natural phrasing over literal translation when the locale file calls it out
- If the repo uses a locale alias slug, apply that file too (for example, `pt-BR` maps to `br.md` in this repo)

Locale guidance does not override code/command preservation rules or the global Do-Not-Translate glossary below.

---

# Do-Not-Translate Terms (Model-of-Design Tools Docs)

Generated from: `packages/web/src/content/docs/*.mdx` (default English docs)
Generated on: 2026-02-10

Use this as a translation QA checklist / glossary. Preserve listed terms exactly (spelling, casing, punctuation).

General rules (verbatim, even if not listed below):

- Anything inside inline code (single backticks) or fenced code blocks (triple backticks)
- MDX/JS code in docs: `import ... from "..."`, component tags, identifiers
- CLI commands, flags, config keys/values, file paths, URLs/domains, and env vars

## Proper nouns and product names

Additional (not reliably captured via link text):

```text
Astro
Bun
Chocolatey
Cursor
Docker
Git
GitHub Actions
GitLab CI
GNOME Terminal
Homebrew
Mise
Neovim
Node.js
npm
Obsidian
modtools
modtools-ai
Paru
pnpm
ripgrep
Scoop
SST
Starlight
Visual Studio Code
VS Code
VSCodium
Windsurf
Windows Terminal
Yarn
Zellij
Zed
Embedded-Computing-Systems
```

Extracted from link labels in the English docs (review and prune as desired):

```text
@openspoon/subtask2
302.AI console
ACP progress report
Agent Client Protocol
Agent Skills
Agentic
AGENTS.md
AI SDK
Alacritty
Anthropic
Anthropic's Data Policies
Atom One
Avante.nvim
Ayu
Azure AI Foundry
Azure portal
Baseten
built-in GITHUB_TOKEN
Bun.$
Catppuccin
Cerebras console
ChatGPT Plus or Pro
Cloudflare dashboard
CodeCompanion.nvim
CodeNomad
Configuring Adapters: Environment Variables
Context7 MCP server
Cortecs console
Deep Infra dashboard
DeepSeek console
Duo Agent Platform
Everforest
Fireworks AI console
Firmware dashboard
Ghostty
GitLab CLI agents docs
GitLab docs
GitLab User Settings > Access Tokens
Granular Rules (Object Syntax)
Grep by Vercel
Groq console
Gruvbox
Helicone
Helicone documentation
Helicone Header Directory
Helicone's Model Directory
Hugging Face Inference Providers
Hugging Face settings
install WSL
IO.NET console
JetBrains IDE
Kanagawa
Kitty
MiniMax API Console
Models.dev
Moonshot AI console
Nebius Token Factory console
Nord
OAuth
Ollama integration docs
OpenAI's Data Policies
OpenChamber
Model-of-Design Tools
Model-of-Design Tools config
Model-of-Design Tools Config
Model-of-Design Tools TUI with the modtools theme
Model-of-Design Tools Web - Active Session
Model-of-Design Tools Web - New Session
Model-of-Design Tools Web - See Servers
Model-of-Design Tools Zen
Model-of-Design Tools-Obsidian
OpenRouter dashboard
OpenWork
OVHcloud panel
Pro+ subscription
SAP BTP Cockpit
Scaleway Console IAM settings
Scaleway Generative APIs
SDK documentation
Sentry MCP server
shell API
Together AI console
Tokyonight
Unified Billing
Venice AI console
Vercel dashboard
WezTerm
Windows Subsystem for Linux (WSL)
WSL
WSL (Windows Subsystem for Linux)
WSL extension
xAI console
Z.AI API console
Zed
ZenMux dashboard
Zod
```

## Acronyms and initialisms

```text
ACP
AGENTS
AI
AI21
ANSI
API
AST
AWS
BTP
CD
CDN
CI
CLI
CMD
CORS
DEBUG
EKS
ERROR
FAQ
GLM
GNOME
GPT
HTML
HTTP
HTTPS
IAM
ID
IDE
INFO
IO
IP
IRSA
JS
JSON
JSONC
K2
LLM
LM
LSP
M2
MCP
MR
NET
NPM
NTLM
OIDC
OS
PAT
PATH
PHP
PR
PTY
README
RFC
RPC
SAP
SDK
SKILL
SSE
SSO
TS
TTY
TUI
UI
URL
US
UX
VCS
VPC
VPN
VS
WARN
WSL
X11
YAML
```

## Code identifiers used in prose (CamelCase, mixedCase)

```text
apiKey
AppleScript
AssistantMessage
baseURL
BurntSushi
ChatGPT
ClangFormat
CodeCompanion
CodeNomad
DeepSeek
DefaultV2
FileContent
FileDiff
FileNode
fineGrained
FormatterStatus
GitHub
GitLab
iTerm2
JavaScript
JetBrains
macOS
mDNS
MiniMax
NeuralNomadsAI
NickvanDyke
NoeFabris
OpenAI
OpenAPI
OpenChamber
Model-of-Design Tools
OpenRouter
OpenTUI
OpenWork
ownUserPermissions
PowerShell
ProviderAuthAuthorization
ProviderAuthMethod
ProviderInitError
SessionStatus
TabItem
tokenType
ToolIDs
ToolList
TypeScript
typesUrl
UserMessage
VcsInfo
WebView2
WezTerm
xAI
ZenMux
```

## Model-of-Design Tools CLI commands (as shown in docs)

```text
modtools
modtools [project]
modtools /path/to/project
modtools acp
modtools agent [command]
modtools agent create
modtools agent list
modtools attach [url]
modtools attach http://10.20.30.40:4096
modtools attach http://localhost:4096
modtools auth [command]
modtools auth list
modtools auth login
modtools auth logout
modtools auth ls
modtools export [sessionID]
modtools github [command]
modtools github install
modtools github run
modtools import <file>
modtools import https://opncd.ai/s/abc123
modtools import session.json
modtools mcp [command]
modtools mcp add
modtools mcp auth [name]
modtools mcp auth list
modtools mcp auth ls
modtools mcp auth my-oauth-server
modtools mcp auth sentry
modtools mcp debug <name>
modtools mcp debug my-oauth-server
modtools mcp list
modtools mcp logout [name]
modtools mcp logout my-oauth-server
modtools mcp ls
modtools models --refresh
modtools models [provider]
modtools models anthropic
modtools run [message..]
modtools run Explain the use of context in Go
modtools serve
modtools serve --cors http://localhost:5173 --cors https://app.example.com
modtools serve --hostname 0.0.0.0 --port 4096
modtools serve [--port <number>] [--hostname <string>] [--cors <origin>]
modtools session [command]
modtools session list
modtools session delete <sessionID>
modtools stats
modtools uninstall
modtools upgrade
modtools upgrade [target]
modtools upgrade v0.1.48
modtools web
modtools web --cors https://example.com
modtools web --hostname 0.0.0.0
modtools web --mdns
modtools web --mdns --mdns-domain myproject.local
modtools web --port 4096
modtools web --port 4096 --hostname 0.0.0.0
modtools.server.close()
```

## Slash commands and routes

```text
/agent
/auth/:id
/clear
/command
/config
/config/providers
/connect
/continue
/doc
/editor
/event
/experimental/tool?provider=<p>&model=<m>
/experimental/tool/ids
/export
/file?path=<path>
/file/content?path=<p>
/file/status
/find?pattern=<pat>
/find/file
/find/file?query=<q>
/find/symbol?query=<q>
/formatter
/global/event
/global/health
/help
/init
/instance/dispose
/log
/lsp
/mcp
/mnt/
/mnt/c/
/mnt/d/
/models
/oc
/modtools
/path
/project
/project/current
/provider
/provider/{id}/oauth/authorize
/provider/{id}/oauth/callback
/provider/auth
/q
/quit
/redo
/resume
/session
/session/:id
/session/:id/abort
/session/:id/children
/session/:id/command
/session/:id/diff
/session/:id/fork
/session/:id/init
/session/:id/message
/session/:id/message/:messageID
/session/:id/permissions/:permissionID
/session/:id/prompt_async
/session/:id/revert
/session/:id/share
/session/:id/shell
/session/:id/summarize
/session/:id/todo
/session/:id/unrevert
/session/status
/share
/summarize
/theme
/tui
/tui/append-prompt
/tui/clear-prompt
/tui/control/next
/tui/control/response
/tui/execute-command
/tui/open-help
/tui/open-models
/tui/open-sessions
/tui/open-themes
/tui/show-toast
/tui/submit-prompt
/undo
/Users/username
/Users/username/projects/*
/vcs
```

## CLI flags and short options

```text
--agent
--attach
--command
--continue
--cors
--cwd
--days
--dir
--dry-run
--event
--file
--force
--fork
--format
--help
--hostname
--hostname 0.0.0.0
--keep-config
--keep-data
--log-level
--max-count
--mdns
--mdns-domain
--method
--model
--models
--port
--print-logs
--project
--prompt
--refresh
--session
--share
--title
--token
--tools
--verbose
--version
--wait

-c
-d
-f
-h
-m
-n
-s
-v
```

## Environment variables

```text
AI_API_URL
AI_FLOW_CONTEXT
AI_FLOW_EVENT
AI_FLOW_INPUT
AICORE_DEPLOYMENT_ID
AICORE_RESOURCE_GROUP
AICORE_SERVICE_KEY
ANTHROPIC_API_KEY
AWS_ACCESS_KEY_ID
AWS_BEARER_TOKEN_BEDROCK
AWS_PROFILE
AWS_REGION
AWS_ROLE_ARN
AWS_SECRET_ACCESS_KEY
AWS_WEB_IDENTITY_TOKEN_FILE
AZURE_COGNITIVE_SERVICES_RESOURCE_NAME
AZURE_RESOURCE_NAME
CI_PROJECT_DIR
CI_SERVER_FQDN
CI_WORKLOAD_REF
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
CLOUDFLARE_GATEWAY_ID
CONTEXT7_API_KEY
GITHUB_TOKEN
GITLAB_AI_GATEWAY_URL
GITLAB_HOST
GITLAB_INSTANCE_URL
GITLAB_OAUTH_CLIENT_ID
GITLAB_TOKEN
GITLAB_TOKEN_MOD
GOOGLE_APPLICATION_CREDENTIALS
GOOGLE_CLOUD_PROJECT
HTTP_PROXY
HTTPS_PROXY
K2_
MY_API_KEY
MY_ENV_VAR
MY_MCP_CLIENT_ID
MY_MCP_CLIENT_SECRET
NO_PROXY
NODE_ENV
NODE_EXTRA_CA_CERTS
NPM_AUTH_TOKEN
OC_ALLOW_WAYLAND
MOD_API_KEY
MOD_AUTH_JSON
MOD_AUTO_SHARE
MOD_CLIENT
MOD_CONFIG
MOD_CONFIG_CONTENT
MOD_CONFIG_DIR
MOD_DISABLE_AUTOCOMPACT
MOD_DISABLE_AUTOUPDATE
MOD_DISABLE_CLAUDE_CODE
MOD_DISABLE_CLAUDE_CODE_PROMPT
MOD_DISABLE_CLAUDE_CODE_SKILLS
MOD_DISABLE_DEFAULT_PLUGINS
MOD_DISABLE_FILETIME_CHECK
MOD_DISABLE_LSP_DOWNLOAD
MOD_DISABLE_MODELS_FETCH
MOD_DISABLE_PRUNE
MOD_DISABLE_TERMINAL_TITLE
MOD_ENABLE_EXA
MOD_ENABLE_EXPERIMENTAL_MODELS
MOD_EXPERIMENTAL
MOD_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS
MOD_EXPERIMENTAL_DISABLE_COPY_ON_SELECT
MOD_EXPERIMENTAL_DISABLE_FILEWATCHER
MOD_EXPERIMENTAL_EXA
MOD_EXPERIMENTAL_FILEWATCHER
MOD_EXPERIMENTAL_ICON_DISCOVERY
MOD_EXPERIMENTAL_LSP_TOOL
MOD_EXPERIMENTAL_LSP_TY
MOD_EXPERIMENTAL_MARKDOWN
MOD_EXPERIMENTAL_OUTPUT_TOKEN_MAX
MOD_EXPERIMENTAL_OXFMT
MOD_EXPERIMENTAL_PLAN_MODE
MOD_ENABLE_QUESTION_TOOL
MOD_FAKE_VCS
MOD_GIT_BASH_PATH
MOD_MODEL
MOD_MODELS_URL
MOD_PERMISSION
MOD_PORT
MOD_SERVER_PASSWORD
MOD_SERVER_USERNAME
PROJECT_ROOT
RESOURCE_NAME
RUST_LOG
VARIABLE_NAME
VERTEX_LOCATION
XDG_CONFIG_HOME
```

## Package/module identifiers

```text
../../../config.mjs
@astrojs/starlight/components
@modtools-ai/plugin
@modtools-ai/sdk
path
shescape
zod

@
@ai-sdk/anthropic
@ai-sdk/cerebras
@ai-sdk/google
@ai-sdk/openai
@ai-sdk/openai-compatible
@File#L37-42
@modelcontextprotocol/server-everything
@modtools
```

## GitHub owner/repo slugs referenced in docs

```text
24601/modtools-zellij-namer
angristan/modtools-wakatime
Embedded-Computing-Systems/modtools
apps/modtools-agent
athal7/modtools-devcontainers
awesome-modtools/awesome-modtools
backnotprop/plannotator
ben-vargas/ai-sdk-provider-modtools-sdk
btriapitsyn/openchamber
BurntSushi/ripgrep
Cluster444/agentic
code-yeongyu/oh-my-modtools
darrenhinde/modtools-agents
different-ai/modtools-scheduler
different-ai/openwork
features/copilot
folke/tokyonight.nvim
franlol/modtools-md-table-formatter
ggml-org/llama.cpp
ghoulr/modtools-websearch-cited.git
H2Shami/modtools-helicone-session
hosenur/portal
jamesmurdza/daytona
jenslys/modtools-gemini-auth
JRedeker/modtools-morph-fast-apply
JRedeker/modtools-shell-strategy
kdcokenny/ocx
kdcokenny/modtools-background-agents
kdcokenny/modtools-notify
kdcokenny/modtools-workspace
kdcokenny/modtools-worktree
login/device
mohak34/modtools-notifier
morhetz/gruvbox
mtymek/modtools-obsidian
NeuralNomadsAI/CodeNomad
nick-vi/modtools-type-inject
NickvanDyke/modtools.nvim
NoeFabris/modtools-antigravity-auth
nordtheme/nord
numman-ali/modtools-openai-codex-auth
olimorris/codecompanion.nvim
panta82/modtools-notificator
rebelot/kanagawa.nvim
remorses/kimaki
sainnhe/everforest
shekohex/modtools-google-antigravity-auth
shekohex/modtools-pty.git
spoons-and-mirrors/subtask2
sudo-tee/modtools.nvim
supermemoryai/modtools-supermemory
Tarquinen/modtools-dynamic-context-pruning
Th3Whit3Wolf/one-nvim
upstash/context7
vtemian/micode
vtemian/octto
yetone/avante.nvim
zenobi-us/modtools-plugin-template
zenobi-us/modtools-skillful
```

## Paths, filenames, globs, and URLs

```text
./.modtools/themes/*.json
./<project-slug>/storage/
./config/#custom-directory
./global/storage/
.agents/skills/*/SKILL.md
.agents/skills/<name>/SKILL.md
.clang-format
.claude
.claude/skills
.claude/skills/*/SKILL.md
.claude/skills/<name>/SKILL.md
.env
.github/workflows/modtools.yml
.gitignore
.gitlab-ci.yml
.ignore
.NET SDK
.npmrc
.ocamlformat
.modtools
.modtools/
.modtools/agents/
.modtools/commands/
.modtools/commands/test.md
.modtools/modes/
.modtools/plans/*.md
.modtools/plugins/
.modtools/skills/<name>/SKILL.md
.modtools/skills/git-release/SKILL.md
.modtools/tools/
.well-known/modtools
{ type: "raw" \| "patch", content: string }
{file:path/to/file}
**/*.js
%USERPROFILE%/intelephense/license.txt
%USERPROFILE%\.cache\modtools
%USERPROFILE%\.config\modtools\modtools.jsonc
%USERPROFILE%\.config\modtools\plugins
%USERPROFILE%\.local\share\modtools
%USERPROFILE%\.local\share\modtools\log
<project-root>/.modtools/themes/*.json
<providerId>/<modelId>
<your-project>/.modtools/plugins/
~
~/...
~/.agents/skills/*/SKILL.md
~/.agents/skills/<name>/SKILL.md
~/.aws/credentials
~/.bashrc
~/.cache/modtools
~/.cache/modtools/node_modules/
~/.claude/CLAUDE.md
~/.claude/skills/
~/.claude/skills/*/SKILL.md
~/.claude/skills/<name>/SKILL.md
~/.config/modtools
~/.config/modtools/AGENTS.md
~/.config/modtools/agents/
~/.config/modtools/commands/
~/.config/modtools/modes/
~/.config/modtools/modtools.json
~/.config/modtools/modtools.jsonc
~/.config/modtools/plugins/
~/.config/modtools/skills/*/SKILL.md
~/.config/modtools/skills/<name>/SKILL.md
~/.config/modtools/themes/*.json
~/.config/modtools/tools/
~/.config/zed/settings.json
~/.local/share
~/.local/share/modtools/
~/.local/share/modtools/auth.json
~/.local/share/modtools/log/
~/.local/share/modtools/mcp-auth.json
~/.local/share/modtools/modtools.jsonc
~/.npmrc
~/.zshrc
~/code/
~/Library/Application Support
~/projects/*
~/projects/personal/
${config.github}/blob/dev/packages/sdk/js/src/gen/types.gen.ts
$HOME/intelephense/license.txt
$HOME/projects/*
$XDG_CONFIG_HOME/modtools/themes/*.json
agent/
agents/
build/
commands/
dist/
http://<wsl-ip>:4096
http://127.0.0.1:8080/callback
http://localhost:<port>
http://localhost:4096
http://localhost:4096/doc
https://app.example.com
https://AZURE_COGNITIVE_SERVICES_RESOURCE_NAME.cognitiveservices.azure.com/
https://modtools.ai/zen/v1/chat/completions
https://modtools.ai/zen/v1/messages
https://modtools.ai/zen/v1/models/gemini-3-flash
https://modtools.ai/zen/v1/models/gemini-3-pro
https://modtools.ai/zen/v1/responses
https://RESOURCE_NAME.openai.azure.com/
laravel/pint
log/
model: "anthropic/claude-sonnet-4-5"
modes/
node_modules/
openai/gpt-4.1
modtools.ai/config.json
modtools/<model-id>
modtools/gpt-5.1-codex
modtools/gpt-5.2-codex
modtools/kimi-k2
openrouter/google/gemini-2.5-flash
opncd.ai/s/<share-id>
packages/*/AGENTS.md
plugins/
project/
provider_id/model_id
provider/model
provider/model-id
rm -rf ~/.cache/modtools
skills/
skills/*/SKILL.md
src/**/*.ts
themes/
tools/
```

## Keybind strings

```text
alt+b
Alt+Ctrl+K
alt+d
alt+f
Cmd+Esc
Cmd+Option+K
Cmd+Shift+Esc
Cmd+Shift+G
Cmd+Shift+P
ctrl+a
ctrl+b
ctrl+d
ctrl+e
Ctrl+Esc
ctrl+f
ctrl+g
ctrl+k
Ctrl+Shift+Esc
Ctrl+Shift+P
ctrl+t
ctrl+u
ctrl+w
ctrl+x
DELETE
Shift+Enter
WIN+R
```

## Model ID strings referenced

```text
{env:MOD_MODEL}
anthropic/claude-3-5-sonnet-20241022
anthropic/claude-haiku-4-20250514
anthropic/claude-haiku-4-5
anthropic/claude-sonnet-4-20250514
anthropic/claude-sonnet-4-5
gitlab/duo-chat-haiku-4-5
lmstudio/google/gemma-3n-e4b
openai/gpt-4.1
openai/gpt-5
modtools/gpt-5.1-codex
modtools/gpt-5.2-codex
modtools/kimi-k2
openrouter/google/gemini-2.5-flash
```
