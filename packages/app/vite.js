import { readFileSync } from "node:fs"
import solidPlugin from "vite-plugin-solid"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from "url"

const theme = fileURLToPath(new URL("./public/mod-theme-preload.js", import.meta.url))

/**
 * @type {import("vite").PluginOption}
 */
export default [
  {
    name: "mod-desktop:config",
    config() {
      return {
        resolve: {
          alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
          },
        },
        worker: {
          format: "es",
        },
      }
    },
  },
  {
    name: "mod-desktop:theme-preload",
    transformIndexHtml(html) {
      // Support both old and new script IDs for compatibility
      return html
        .replace(
          '<script id="mod-theme-preload-script" src="/mod-theme-preload.js"></script>',
          `<script id="mod-theme-preload-script">${readFileSync(theme, "utf-8")}</script>`,
        )
        .replace(
          '<script id="oc-theme-preload-script" src="/oc-theme-preload.js"></script>',
          `<script id="oc-theme-preload-script">${readFileSync(theme, "utf-8")}</script>`,
        )
    },
  },
  tailwindcss(),
  solidPlugin(),
]
