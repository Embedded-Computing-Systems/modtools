import { $ } from "bun"

import { copyBinaryToSidecarFolder, getCurrentSidecar, windowsify } from "./utils"

await $`bun ./scripts/copy-icons.ts ${process.env.MOD_CHANNEL ?? "dev"}`

const RUST_TARGET = Bun.env.RUST_TARGET

const sidecarConfig = getCurrentSidecar(RUST_TARGET)

const binaryPath = windowsify(`../modtools/dist/${sidecarConfig.ocBinary}/bin/modtools`)

await (sidecarConfig.ocBinary.includes("-baseline")
  ? $`cd ../modtools && bun run build --single --baseline`
  : $`cd ../modtools && bun run build --single`)

await copyBinaryToSidecarFolder(binaryPath, RUST_TARGET)
