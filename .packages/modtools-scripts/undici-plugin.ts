import type { BunPlugin } from "bun"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const shimPath = path.resolve(__dirname, "undici-shim.ts")

export const undiciPlugin: BunPlugin = {
  name: "undici-plugin",
  setup(build) {
    build.onResolve({ filter: /^undici$/ }, (args) => {
      return { path: shimPath }
    })
  },
}