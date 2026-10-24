import { Config } from "effect"

export function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

const copy = process.env["MODTOOLS_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
const fff = process.env["MODTOOLS_DISABLE_FFF"]

function enabledByExperimental(key: string) {
  return process.env[key] === undefined ? truthy("MODTOOLS_EXPERIMENTAL") : truthy(key)
}

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  MODTOOLS_AUTO_HEAP_SNAPSHOT: truthy("MODTOOLS_AUTO_HEAP_SNAPSHOT"),
  MODTOOLS_GIT_BASH_PATH: process.env["MODTOOLS_GIT_BASH_PATH"],
  MODTOOLS_CONFIG: process.env["MODTOOLS_CONFIG"],
  MODTOOLS_CONFIG_CONTENT: process.env["MODTOOLS_CONFIG_CONTENT"],
  MODTOOLS_DISABLE_AUTOUPDATE: truthy("MODTOOLS_DISABLE_AUTOUPDATE"),
  MODTOOLS_ALWAYS_NOTIFY_UPDATE: truthy("MODTOOLS_ALWAYS_NOTIFY_UPDATE"),
  MODTOOLS_DISABLE_PRUNE: truthy("MODTOOLS_DISABLE_PRUNE"),
  MODTOOLS_DISABLE_TERMINAL_TITLE: truthy("MODTOOLS_DISABLE_TERMINAL_TITLE"),
  MODTOOLS_SHOW_TTFD: truthy("MODTOOLS_SHOW_TTFD"),
  MODTOOLS_DISABLE_AUTOCOMPACT: truthy("MODTOOLS_DISABLE_AUTOCOMPACT"),
  MODTOOLS_DISABLE_MODELS_FETCH: truthy("MODTOOLS_DISABLE_MODELS_FETCH"),
  MODTOOLS_DISABLE_MOUSE: truthy("MODTOOLS_DISABLE_MOUSE"),
  MODTOOLS_FAKE_VCS: process.env["MODTOOLS_FAKE_VCS"],
  MODTOOLS_SERVER_PASSWORD: process.env["MODTOOLS_SERVER_PASSWORD"],
  MODTOOLS_SERVER_USERNAME: process.env["MODTOOLS_SERVER_USERNAME"],
  MODTOOLS_DISABLE_FFF: fff === undefined ? process.platform === "win32" : truthy("MODTOOLS_DISABLE_FFF"),

  // Experimental
  MODTOOLS_EXPERIMENTAL_FILEWATCHER: Config.boolean("MODTOOLS_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  MODTOOLS_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("MODTOOLS_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  MODTOOLS_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("MODTOOLS_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  MODTOOLS_MODELS_URL: process.env["MODTOOLS_MODELS_URL"],
  MODTOOLS_MODELS_PATH: process.env["MODTOOLS_MODELS_PATH"],
  MODTOOLS_DB: process.env["MODTOOLS_DB"],

  MODTOOLS_WORKSPACE_ID: process.env["MODTOOLS_WORKSPACE_ID"],
  MODTOOLS_EXPERIMENTAL_WORKSPACES: enabledByExperimental("MODTOOLS_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.
  get MODTOOLS_DISABLE_PROJECT_CONFIG() {
    return truthy("MODTOOLS_DISABLE_PROJECT_CONFIG")
  },
  get MODTOOLS_EXPERIMENTAL_REFERENCES() {
    return enabledByExperimental("MODTOOLS_EXPERIMENTAL_REFERENCES")
  },
  get MODTOOLS_TUI_CONFIG() {
    return process.env["MODTOOLS_TUI_CONFIG"]
  },
  get MODTOOLS_CONFIG_DIR() {
    return process.env["MODTOOLS_CONFIG_DIR"]
  },
  get MODTOOLS_PURE() {
    return truthy("MODTOOLS_PURE")
  },
  get MODTOOLS_PERMISSION() {
    return process.env["MODTOOLS_PERMISSION"]
  },
  get MODTOOLS_PLUGIN_META_FILE() {
    return process.env["MODTOOLS_PLUGIN_META_FILE"]
  },
  get MODTOOLS_CLIENT() {
    return process.env["MODTOOLS_CLIENT"] ?? "cli"
  },
}
