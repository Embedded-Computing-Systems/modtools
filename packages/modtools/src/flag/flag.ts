import { Config } from "effect"

function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

function falsy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "false" || value === "0"
}

export namespace Flag {
  export const MOD_AUTO_SHARE = truthy("MOD_AUTO_SHARE")
  export const MOD_AUTO_HEAP_SNAPSHOT = truthy("MOD_AUTO_HEAP_SNAPSHOT")
  export const MOD_GIT_BASH_PATH = process.env["MOD_GIT_BASH_PATH"]
  export const MOD_CONFIG = process.env["MOD_CONFIG"]
  export declare const MOD_PURE: boolean
  export declare const MOD_TUI_CONFIG: string | undefined
  export declare const MOD_CONFIG_DIR: string | undefined
  export declare const MOD_PLUGIN_META_FILE: string | undefined
  export const MOD_CONFIG_CONTENT = process.env["MOD_CONFIG_CONTENT"]
  export const MOD_DISABLE_AUTOUPDATE = truthy("MOD_DISABLE_AUTOUPDATE")
  export const MOD_ALWAYS_NOTIFY_UPDATE = truthy("MOD_ALWAYS_NOTIFY_UPDATE")
  export const MOD_DISABLE_PRUNE = truthy("MOD_DISABLE_PRUNE")
  export const MOD_DISABLE_TERMINAL_TITLE = truthy("MOD_DISABLE_TERMINAL_TITLE")
  export const MOD_SHOW_TTFD = truthy("MOD_SHOW_TTFD")
  export const MOD_PERMISSION = process.env["MOD_PERMISSION"]
  export const MOD_DISABLE_DEFAULT_PLUGINS = truthy("MOD_DISABLE_DEFAULT_PLUGINS")
  export const MOD_DISABLE_LSP_DOWNLOAD = truthy("MOD_DISABLE_LSP_DOWNLOAD")
  export const MOD_ENABLE_EXPERIMENTAL_MODELS = truthy("MOD_ENABLE_EXPERIMENTAL_MODELS")
  export const MOD_DISABLE_AUTOCOMPACT = truthy("MOD_DISABLE_AUTOCOMPACT")
  export const MOD_DISABLE_MODELS_FETCH = truthy("MOD_DISABLE_MODELS_FETCH")
  export const MOD_DISABLE_CLAUDE_CODE = truthy("MOD_DISABLE_CLAUDE_CODE")
  export const MOD_DISABLE_CLAUDE_CODE_PROMPT =
    MOD_DISABLE_CLAUDE_CODE || truthy("MOD_DISABLE_CLAUDE_CODE_PROMPT")
  export const MOD_DISABLE_CLAUDE_CODE_SKILLS =
    MOD_DISABLE_CLAUDE_CODE || truthy("MOD_DISABLE_CLAUDE_CODE_SKILLS")
  export const MOD_DISABLE_EXTERNAL_SKILLS =
    MOD_DISABLE_CLAUDE_CODE_SKILLS || truthy("MOD_DISABLE_EXTERNAL_SKILLS")
  export declare const MOD_DISABLE_PROJECT_CONFIG: boolean
  export const MOD_FAKE_VCS = process.env["MOD_FAKE_VCS"]
  export declare const MOD_CLIENT: string
  export const MOD_SERVER_PASSWORD = process.env["MOD_SERVER_PASSWORD"]
  export const MOD_SERVER_USERNAME = process.env["MOD_SERVER_USERNAME"]
  export const MOD_ENABLE_QUESTION_TOOL = truthy("MOD_ENABLE_QUESTION_TOOL")

  // Experimental
  export const MOD_EXPERIMENTAL = truthy("MOD_EXPERIMENTAL")
  export const MOD_EXPERIMENTAL_FILEWATCHER = Config.boolean("MOD_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  )
  export const MOD_EXPERIMENTAL_DISABLE_FILEWATCHER = Config.boolean(
    "MOD_EXPERIMENTAL_DISABLE_FILEWATCHER",
  ).pipe(Config.withDefault(false))
  export const MOD_EXPERIMENTAL_ICON_DISCOVERY =
    MOD_EXPERIMENTAL || truthy("MOD_EXPERIMENTAL_ICON_DISCOVERY")

  const copy = process.env["MOD_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
  export const MOD_EXPERIMENTAL_DISABLE_COPY_ON_SELECT =
    copy === undefined ? process.platform === "win32" : truthy("MOD_EXPERIMENTAL_DISABLE_COPY_ON_SELECT")
  export const MOD_ENABLE_EXA =
    truthy("MOD_ENABLE_EXA") || MOD_EXPERIMENTAL || truthy("MOD_EXPERIMENTAL_EXA")
  export const MOD_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS = number("MOD_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS")
  export const MOD_EXPERIMENTAL_OUTPUT_TOKEN_MAX = number("MOD_EXPERIMENTAL_OUTPUT_TOKEN_MAX")
  export const MOD_EXPERIMENTAL_OXFMT = MOD_EXPERIMENTAL || truthy("MOD_EXPERIMENTAL_OXFMT")
  export const MOD_EXPERIMENTAL_LSP_TY = truthy("MOD_EXPERIMENTAL_LSP_TY")
  export const MOD_EXPERIMENTAL_LSP_TOOL = MOD_EXPERIMENTAL || truthy("MOD_EXPERIMENTAL_LSP_TOOL")
  export const MOD_DISABLE_FILETIME_CHECK = Config.boolean("MOD_DISABLE_FILETIME_CHECK").pipe(
    Config.withDefault(false),
  )
  export const MOD_EXPERIMENTAL_PLAN_MODE = MOD_EXPERIMENTAL || truthy("MOD_EXPERIMENTAL_PLAN_MODE")
  export const MOD_EXPERIMENTAL_WORKSPACES = MOD_EXPERIMENTAL || truthy("MOD_EXPERIMENTAL_WORKSPACES")
  export const MOD_EXPERIMENTAL_MARKDOWN = !falsy("MOD_EXPERIMENTAL_MARKDOWN")
  export const MOD_MODELS_URL = process.env["MOD_MODELS_URL"]
  export const MOD_MODELS_PATH = process.env["MOD_MODELS_PATH"]
  export const MOD_DISABLE_EMBEDDED_WEB_UI = truthy("MOD_DISABLE_EMBEDDED_WEB_UI")
  export const MOD_DB = process.env["MOD_DB"]
  export const MOD_DISABLE_CHANNEL_DB = truthy("MOD_DISABLE_CHANNEL_DB")
  export const MOD_SKIP_MIGRATIONS = truthy("MOD_SKIP_MIGRATIONS")
  export const MOD_STRICT_CONFIG_DEPS = truthy("MOD_STRICT_CONFIG_DEPS")

  function number(key: string) {
    const value = process.env[key]
    if (!value) return undefined
    const parsed = Number(value)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
  }
}

// Dynamic getter for MOD_DISABLE_PROJECT_CONFIG
// This must be evaluated at access time, not module load time,
// because external tooling may set this env var at runtime
Object.defineProperty(Flag, "MOD_DISABLE_PROJECT_CONFIG", {
  get() {
    return truthy("MOD_DISABLE_PROJECT_CONFIG")
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for MOD_TUI_CONFIG
// This must be evaluated at access time, not module load time,
// because tests and external tooling may set this env var at runtime
Object.defineProperty(Flag, "MOD_TUI_CONFIG", {
  get() {
    return process.env["MOD_TUI_CONFIG"]
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for MOD_CONFIG_DIR
// This must be evaluated at access time, not module load time,
// because external tooling may set this env var at runtime
Object.defineProperty(Flag, "MOD_CONFIG_DIR", {
  get() {
    return process.env["MOD_CONFIG_DIR"]
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for MOD_PURE
// This must be evaluated at access time, not module load time,
// because the CLI can set this flag at runtime
Object.defineProperty(Flag, "MOD_PURE", {
  get() {
    return truthy("MOD_PURE")
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for MOD_PLUGIN_META_FILE
// This must be evaluated at access time, not module load time,
// because tests and external tooling may set this env var at runtime
Object.defineProperty(Flag, "MOD_PLUGIN_META_FILE", {
  get() {
    return process.env["MOD_PLUGIN_META_FILE"]
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for MOD_CLIENT
// This must be evaluated at access time, not module load time,
// because some commands override the client at runtime
Object.defineProperty(Flag, "MOD_CLIENT", {
  get() {
    return process.env["MOD_CLIENT"] ?? "cli"
  },
  enumerable: true,
  configurable: false,
})
