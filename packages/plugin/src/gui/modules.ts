// The module lists only: `gui()` reads them at build time, so this file imports nothing.

/**
 * The modules a plugin's `./gui-experimental` bundle may require that both processes provide, each its own instance.
 * Main maps `@modtools-ai/plugin/gui` to the main SDK and a window maps `@modtools-ai/plugin/gui/main` to the window SDK:
 * both export the same `Plugin`, `Store`, `Ipc`, `Contract` and `Registry`, so one definition and contract serve both
 * processes. `@modtools-ai/plugin/rpc` is here because a plugin's `./rpc` contract imports it, and its GUI imports that
 * contract.
 */
export const pluginSharedModules = [
  "effect",
  "@modtools-ai/plugin/gui",
  "@modtools-ai/plugin/gui/main",
  "@modtools-ai/plugin/rpc",
  "@modtools-ai/schema/rpc",
  "@modtools-ai/client",
  "@modtools-ai/client/effect",
] as const

/**
 * The modules only a window provides to a plugin's `./gui-experimental` bundle; main gives the bundle an inert
 * placeholder.
 */
export const pluginWindowModules = [
  "solid-js",
  "solid-js/web",
  "solid-js/store",
  "@modtools-ai/plugin/gui/file",
  "@modtools-ai/plugin/gui/review",
  "@modtools-ai/plugin/gui/browser",
  "@modtools-ai/client/solid",
] as const

/** A module name in `pluginSharedModules` or `pluginWindowModules`. */
export type PluginModule = (typeof pluginSharedModules)[number] | (typeof pluginWindowModules)[number]
