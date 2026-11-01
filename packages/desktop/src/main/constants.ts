import { app } from "electron"

type Channel = "local" | "dev" | "beta" | "prod"

const raw = import.meta.env.MODTOOLS_CHANNEL

export const CHANNEL: Channel = raw === "local" || raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

export const VERSION = app.isPackaged ? app.getVersion() : (process.env.MODTOOLS_VERSION ?? app.getVersion())

const appNames: Record<string, string> = {
  dev: "MOD Dev",
  beta: "MOD Beta",
  prod: "MOD",
}

const appIDs: Record<string, string> = {
  dev: "ai.mod.desktop.dev",
  beta: "ai.mod.desktop.beta",
  prod: "ai.mod.desktop",
}

// Local renderer/server mode keeps the dev application identity.
export const APP_NAME = app.isPackaged ? appNames[CHANNEL] : "OpenCode Dev"

export const APP_ID = app.isPackaged ? appIDs[CHANNEL] : "ai.mod.desktop.dev"
