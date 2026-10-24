import path from "node:path"
import { MODTOOLS_CHANNEL } from "./version"

export function databasePath(data: string) {
  const filename =
    process.env.MODTOOLS_DB ??
    (["latest", "dev", "beta", "next", "prod"].includes(MODTOOLS_CHANNEL) ||
    process.env.MODTOOLS_DISABLE_CHANNEL_DB === "1" ||
    process.env.MODTOOLS_DISABLE_CHANNEL_DB === "true"
      ? "mod.db"
      : `mod-${MODTOOLS_CHANNEL.replace(/[^a-zA-Z0-9._-]/g, "-")}.db`)
  return filename === ":memory:" ? filename : path.resolve(data, filename)
}
