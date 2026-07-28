import { Flag } from "@modtools-ai/core/flag/flag"
import { Effect } from "effect"
import path from "path"

const preserveExerciseGlobalRoot = !!process.env.MODTOOLS_HTTPAPI_EXERCISE_GLOBAL
export const exerciseGlobalRoot =
  process.env.MODTOOLS_HTTPAPI_EXERCISE_GLOBAL ??
  path.join(process.env.TMPDIR ?? "/tmp", `mod-httpapi-global-${process.pid}`)
process.env.XDG_DATA_HOME = path.join(exerciseGlobalRoot, "data")
process.env.XDG_CONFIG_HOME = path.join(exerciseGlobalRoot, "config")
process.env.XDG_STATE_HOME = path.join(exerciseGlobalRoot, "state")
process.env.XDG_CACHE_HOME = path.join(exerciseGlobalRoot, "cache")
process.env.MODTOOLS_DISABLE_SHARE = "true"
export const exerciseConfigDirectory = path.join(exerciseGlobalRoot, "config", "mod")
export const exerciseDataDirectory = path.join(exerciseGlobalRoot, "data", "mod")

const preserveExerciseDatabase = !!process.env.MODTOOLS_HTTPAPI_EXERCISE_DB
export const exerciseDatabasePath =
  process.env.MODTOOLS_HTTPAPI_EXERCISE_DB ??
  path.join(process.env.TMPDIR ?? "/tmp", `mod-httpapi-exercise-${process.pid}.db`)
process.env.MODTOOLS_DB = exerciseDatabasePath
Flag.MODTOOLS_DB = exerciseDatabasePath

export const original = {
  MODTOOLS_SERVER_PASSWORD: Flag.MODTOOLS_SERVER_PASSWORD,
  MODTOOLS_SERVER_USERNAME: Flag.MODTOOLS_SERVER_USERNAME,
}

export const cleanupExercisePaths = Effect.promise(async () => {
  const fs = await import("fs/promises")
  if (!preserveExerciseDatabase) {
    await Promise.all(
      [exerciseDatabasePath, `${exerciseDatabasePath}-wal`, `${exerciseDatabasePath}-shm`].map((file) =>
        fs.rm(file, { force: true }).catch(() => undefined),
      ),
    )
  }
  if (!preserveExerciseGlobalRoot)
    await fs.rm(exerciseGlobalRoot, { recursive: true, force: true }).catch(() => undefined)
})
