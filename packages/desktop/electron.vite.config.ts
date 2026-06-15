import { sentryVitePlugin } from "@sentry/vite-plugin"
import { defineConfig } from "electron-vite"
import appPlugin from "@modtools-ai/app/vite"
import * as fs from "node:fs/promises"

const MODTOOLS_SERVER_DIST = "../modtools/dist/node"

const channel = (() => {
  const raw = process.env.MODTOOLS_CHANNEL
  if (raw === "dev" || raw === "beta" || raw === "prod") return raw
  if (process.env.MODTOOLS_CHANNEL === "latest") return "prod"
  return "dev"
})()

const nodePtyPkg = `@lydell/node-pty-${process.platform}-${process.arch}`

const sentry =
  process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT
    ? sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        telemetry: false,
        release: {
          name: process.env.SENTRY_RELEASE ?? process.env.VITE_SENTRY_RELEASE,
        },
        sourcemaps: {
          assets: "./out/renderer/**",
          filesToDeleteAfterUpload: "./out/renderer/**/*.map",
        },
      })
    : false

export default defineConfig({
  main: {
    define: {
      "import.meta.env.MODTOOLS_CHANNEL": JSON.stringify(channel),
    },
    build: {
      rollupOptions: {
        input: { index: "src/main/index.ts", sidecar: "src/main/sidecar.ts" },
      },
      externalizeDeps: { include: [nodePtyPkg] },
    },
    plugins: [
      {
        name: "modtools:node-pty-narrower",
        enforce: "pre",
        resolveId(s) {
          if (s === "@lydell/node-pty") return nodePtyPkg
        },
      },
      {
        name: "modtools:virtual-server-module",
        enforce: "pre",
        resolveId(id) {
          if (id === "virtual:MOD-server") return this.resolve(`${MODTOOLS_SERVER_DIST}/node.js`)
        },
      },
      {
        name: "modtools:copy-server-assets",
        async writeBundle() {
          for (const l of await fs.readdir(MODTOOLS_SERVER_DIST)) {
            if (!l.endsWith(".wasm")) continue
            await fs.writeFile(`./out/main/chunks/${l}`, await fs.readFile(`${MODTOOLS_SERVER_DIST}/${l}`))
          }
        },
      },
    ],
  },
  preload: {
    build: {
      rollupOptions: {
        input: { index: "src/preload/index.ts" },
        output: {
          format: "cjs",
          entryFileNames: "[name].js",
        },
      },
    },
  },
  renderer: {
    plugins: [appPlugin, sentry],
    publicDir: "../../../app/public",
    root: "src/renderer",
    build: {
      sourcemap: true,
      rollupOptions: {
        input: {
          main: "src/renderer/index.html",
        },
      },
    },
  },
})
