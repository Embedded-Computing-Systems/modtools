import { describe, expect, test } from "bun:test"
import { Database as BunDatabase } from "bun:sqlite"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { Effect } from "effect"
import { Database } from "@modtools-ai/core/database/database"
import { DatabaseMigration } from "@modtools-ai/core/database/migration"
import { LegacyBridge } from "@modtools-ai/core/database/legacy-bridge"
import { Global } from "@modtools-ai/util/global"

// The v1 tables as the v1 engine defines them; the bridge copies rows between two files
// that both carry this schema.
const V1_DDL = [
  `CREATE TABLE IF NOT EXISTS project (
     id text PRIMARY KEY, worktree text NOT NULL, vcs text, name text,
     sandboxes text NOT NULL DEFAULT '[]', time_created integer NOT NULL,
     time_updated integer NOT NULL, time_active integer NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS session (
     id text PRIMARY KEY, project_id text NOT NULL, parent_id text, slug text NOT NULL,
     directory text NOT NULL, title text NOT NULL, version text NOT NULL, share_url text,
     summary_additions integer, summary_deletions integer, summary_files integer,
     summary_diffs text, revert text, permission text,
     time_created integer NOT NULL, time_updated integer NOT NULL,
     time_compacting integer, time_archived integer, workspace_id text, path text,
     agent text, model text, cost real NOT NULL DEFAULT 0,
     tokens_input integer NOT NULL DEFAULT 0, tokens_output integer NOT NULL DEFAULT 0,
     tokens_reasoning integer NOT NULL DEFAULT 0, tokens_cache_read integer NOT NULL DEFAULT 0,
     tokens_cache_write integer NOT NULL DEFAULT 0, metadata text
   )`,
  `CREATE TABLE IF NOT EXISTS message (
     id text PRIMARY KEY, session_id text NOT NULL, time_created integer NOT NULL,
     time_updated integer NOT NULL, data text NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS part (
     id text PRIMARY KEY, message_id text NOT NULL, session_id text NOT NULL,
     time_created integer NOT NULL, time_updated integer NOT NULL, data text NOT NULL
   )`,
]

const makeDir = () => fs.mkdtempSync(path.join(os.tmpdir(), "mod-bridge-"))

function writeV1(file: string, sessions: { id: string; updated: number; title: string }[]) {
  const db = new BunDatabase(file)
  for (const ddl of V1_DDL) db.run(ddl)
  for (const session of sessions) {
    db.run(
      `INSERT OR REPLACE INTO session (id, project_id, slug, directory, title, version, time_created, time_updated)
       VALUES (?, 'global', 'slug', '/tmp', ?, '1.19.4', ?, ?)`,
      [session.id, session.title, session.updated, session.updated],
    )
    db.run(
      `INSERT OR REPLACE INTO message (id, session_id, time_created, time_updated, data)
       VALUES (?, ?, ?, ?, ?)`,
      [`msg_${session.id}`, session.id, session.updated, session.updated, JSON.stringify({ role: "user" })],
    )
    db.run(
      `INSERT OR REPLACE INTO part (id, message_id, session_id, time_created, time_updated, data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`prt_${session.id}`, `msg_${session.id}`, session.id, session.updated, session.updated, JSON.stringify({ type: "text" })],
    )
  }
  db.close()
}

const readV1Count = (file: string, table: string) => {
  const db = new BunDatabase(file)
  const row = db.query(`SELECT COUNT(*) AS value FROM ${table}`).get() as { value: number }
  db.close()
  return row.value
}

// The Database layer runs the migration chain and hands out the same handle the
// production importer uses.
const withDatabase = <A>(dir: string, effect: (db: Database.Interface["db"]) => Effect.Effect<A>): Promise<A> =>
  Effect.runPromise(
    Effect.scoped(
      Effect.gen(function* () {
        const layer = Database.layer({ path: path.join(dir, "mod-v2.db") })
        return yield* Effect.gen(function* () {
          const service = yield* Database.Service
          yield* DatabaseMigration.apply(service.db)
          return yield* effect(service.db).pipe(Effect.orDie)
        }).pipe(Effect.provide(layer))
      }).pipe(Effect.provideService(Global.Service, Global.make({ data: dir }))),
    ) as Effect.Effect<A>,
  )

describe("LegacyBridge", () => {
  test("copies the v1 sessions into the v2 database and records a watermark", async () => {
    const dir = makeDir()
    writeV1(path.join(dir, "mod.db"), [{ id: "ses_a", updated: 1_000, title: "first" }])

    const result = await withDatabase(dir, (db) =>
      Effect.gen(function* () {
        return yield* LegacyBridge.sync(db)
      }),
    )

    expect(result).toMatchObject({ attached: true, sessions: 1 })
    expect(readV1Count(path.join(dir, "mod-v2.db"), "session")).toBe(1)
  })

  test("is idempotent: a second sync with nothing changed copies nothing", async () => {
    const dir = makeDir()
    writeV1(path.join(dir, "mod.db"), [{ id: "ses_a", updated: 1_000, title: "first" }])

    const result = await withDatabase(dir, (db) =>
      Effect.gen(function* () {
        const first = yield* LegacyBridge.sync(db)
        const second = yield* LegacyBridge.sync(db)
        return { first, second }
      }),
    )

    expect(result.first.sessions).toBe(1)
    expect(result.second.sessions).toBe(0)
  })

  test("picks up a session that changed in the v1 store after the first sync", async () => {
    const dir = makeDir()
    const v1 = path.join(dir, "mod.db")
    writeV1(v1, [{ id: "ses_a", updated: 1_000, title: "first" }])

    const result = await withDatabase(dir, (db) =>
      Effect.gen(function* () {
        const first = yield* LegacyBridge.sync(db)
        writeV1(v1, [{ id: "ses_a", updated: 2_000, title: "second" }, { id: "ses_b", updated: 2_000, title: "new" }])
        const second = yield* LegacyBridge.sync(db)
        return { first, second }
      }),
    )

    expect(result.first.sessions).toBe(1)
    expect(result.second.sessions).toBe(2)
  })

  test("leaves the v1 store untouched", async () => {
    const dir = makeDir()
    const v1 = path.join(dir, "mod.db")
    writeV1(v1, [{ id: "ses_a", updated: 1_000, title: "first" }])
    const before = readV1Count(v1, "session")

    await withDatabase(dir, (db) => LegacyBridge.sync(db))

    expect(readV1Count(v1, "session")).toBe(before)
    expect(readV1Count(path.join(dir, "mod-v2.db"), "session")).toBe(1)
  })
})
