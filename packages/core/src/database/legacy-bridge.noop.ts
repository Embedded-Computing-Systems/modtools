import { Effect } from "effect"

// The v1 store is a SQLite file read by the Bun runtime; under Node there is nothing to
// attach, so the sync is a no-op exactly as the importer is.
export const MIGRATION_STATE_KEY = "migration.v1-v2"

export type SyncResult = {
  readonly attached: boolean
  readonly sessions: number
  readonly skipped: number
}

export const sync = (_db: unknown) => Effect.succeed<SyncResult>({ attached: false, sessions: 0, skipped: 0 })
