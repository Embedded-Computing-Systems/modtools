import { $ } from "bun"

import { copyBinaryToSidecarFolder, getCurrentSidecar, windowsify } from "./utils"

const RUST_TARGET = Bun.env.TAURI_ENV_TARGET_TRIPLE || Bun.env.RUST_TARGET || (process.platform === "darwin" ? (process.arch === "arm64" ? "aarch64-apple-darwin" : "x86_64-apple-darwin") : (process.platform === "linux" ? (process.arch === "arm64" ? "aarch64-unknown-linux-gnu" : "x86_64-unknown-linux-gnu") : (process.arch === "arm64" ? "aarch64-pc-windows-msvc" : "x86_64-pc-windows-msvc")))

const sidecarConfig = getCurrentSidecar(RUST_TARGET)

const binaryPath = windowsify(`../modtools/dist/${sidecarConfig.modBinary}/bin/mod`)

await (sidecarConfig.modBinary.includes("-baseline")
  ? $`cd ../modtools && bun run build --single --baseline`
  : $`cd ../modtools && bun run build --single`)

await copyBinaryToSidecarFolder(binaryPath, RUST_TARGET)
