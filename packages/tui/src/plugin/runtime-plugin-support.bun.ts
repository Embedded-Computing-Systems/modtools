import { ensurePluginRuntime, provides } from "@modtools-ai/plugin/runtime"
import { Plugin, PluginContextProvider, usePlugin } from "@modtools-ai/plugin/tui"
import { ensureRuntimePluginSupport } from "@opentui/solid/runtime-plugin-support/configure"

ensurePluginRuntime()
ensureRuntimePluginSupport({
  additional: {
    "@modtools-ai/plugin/tui": { Plugin, PluginContextProvider, usePlugin },
  },
  preserve: provides,
})
