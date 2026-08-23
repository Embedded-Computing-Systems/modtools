import { registerCustomTheme } from "@pierre/diffs"
import { ModTheme } from "./marked-theme"

let registered = false

export function registerModTheme() {
  if (registered) return
  registered = true
  registerCustomTheme("MOD", () => Promise.resolve(ModTheme))
}
