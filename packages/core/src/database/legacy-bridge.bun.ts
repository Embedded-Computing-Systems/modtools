// Carries the v1 fork's sessions into the v2 store without ever writing the v1 database.
//
// v2 keeps its sessions in its own file (mod-v2.db) and its schema migration drops and
// rebuilds tables that the v1 binaries still read, so mod.db is opened read-only on a
// separate connection. The sessions that changed since the last sync are copied into this
// database's staging tables in the v1 row shape, and v2's own importer, which already
// knows how to translate that shape, runs unchanged. The bridge clears the importer's
// completion marker for each delta and records a per-session watermark so only sessions
// that actually moved are translated again.
//
// The v1 engine keeps working throughout, sessions created there appear here on the next
// sync, and rollback is simply running the v1 binary.

import { Database as SQLiteDatabase } from "bun:sqlite"
import { existsSync } from "node:fs"
import path from "node:path"
import { sql } from "drizzle-orm"
import { Effect } from "effect"
import { Database } from "./database.js"

export const MIGRATION_STATE_KEY = "migration.v1-v2"
const SESSION_TABLES = ["session", "message", "part"] as const

export type SyncResult = {
  readonly attached: boolean
  readonly sessions: number
  readonly skipped: number
}

const NONE: SyncResult = { attached: false, sessions: 0, skipped: 0 }

/** The file backing the open connection, or undefined for an in-memory database. */
export function mainFile(db: Database.Interface["db"]) {
  return db.all<{ file: string }>(sql`SELECT file FROM pragma_database_list WHERE name = 'main'`).pipe(
    Effect.map((rows) => rows[0]?.file || undefined),
    Effect.orDie,
    Effect.catch(() => Effect.succeed(undefined)),
  )
}

function legacyFile(main: string) {
  const candidate = path.join(path.dirname(main), "mod.db")
  return candidate === main ? undefined : candidate
}

/**
 * Columns of a v1 table, without its constraints.
 *
 * A database that started on v2 never had the v1 tables, because v2's migration chain
 * builds the event-sourced store instead, so the delta needs somewhere to land. The
 * columns are read from the v1 file rather than written down here, so a v1 column added
 * after this was written still copies.
 */
export function stagingDdl(ddl: string) {
  const open = ddl.indexOf("(")
  const close = ddl.lastIndexOf(")")
  if (open < 0 || close < open) return undefined
  const body = ddl.slice(open + 1, close)
  const columns: string[] = []
  let depth = 0
  let current = ""
  for (const char of body) {
    if (char === "(") depth += 1
    if (char === ")") depth -= 1
    if (char === "," && depth === 0) {
      columns.push(current)
      current = ""
      continue
    }
    current += char
  }
  columns.push(current)
  const kept = columns.map((part) => part.trim()).filter((part) => part && !/^CONSTRAINT\b/i.test(part))
  return kept.join(", ")
}

const quote = (value: string) => `"${value.replaceAll('"', '""')}"`

/** A value as SQL. Rows come from our own v1 tables; strings are escaped, not trusted. */
const literal = (value: unknown): string => {
  if (value === null || value === undefined) return "NULL"
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL"
  if (typeof value === "bigint") return value.toString()
  if (value instanceof Uint8Array) return `x'${Buffer.from(value).toString("hex")}'`
  return `'${String(value).replaceAll("'", "''")}'`
}

/**
 * Copy the sessions that changed in the v1 store since the last sync into this database's
 * staging tables and clear the importer's completion marker so they are translated again.
 *
 * A session that also changed here since it was imported is a conflict: the v2 copy wins
 * and the v1 version is reported, with a warning naming it.
 */
export function sync(
  db: Database.Interface["db"],
  options: { force?: boolean } = {},
): Effect.Effect<SyncResult, never, never> {
  return Effect.gen(function* () {
    const main = yield* mainFile(db)
    if (!main) return NONE
    const file = legacyFile(main)
    if (!file || !existsSync(file)) return NONE

    const legacy = new SQLiteDatabase(file, { readonly: true })
    const finish = <A>(value: A) =>
      Effect.sync(() => {
        legacy.close()
        return value
      })

    yield* db.run(sql`
      CREATE TABLE IF NOT EXISTS legacy_sync (
        session_id text PRIMARY KEY,
        synced_updated integer NOT NULL,
        imported_at integer NOT NULL
      )
    `)

    for (const table of SESSION_TABLES) {
      const row = legacy
        .query<{ sql: string }, [string]>(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?`)
        .get(table)
      const columns = row?.sql ? stagingDdl(row.sql) : undefined
      if (!columns) return yield* finish(NONE)
      yield* db.run(`CREATE TABLE IF NOT EXISTS ${quote(table)} (${columns})`)
    }

    const watermark = new Map(
      (yield* db.all<{ session_id: string; synced_updated: number; imported_at: number }>(
        sql`SELECT session_id, synced_updated, imported_at FROM legacy_sync`,
      )).map((row) => [row.session_id, row] as const),
    )

    const candidates = yield* Effect.sync(() =>
      legacy
        .query<{ id: string; time_updated: number }, []>(`SELECT id, time_updated FROM "session"`)
        .all()
        .filter((row) => row.time_updated > (watermark.get(row.id)?.synced_updated ?? -1)),
    )

    const conflicts: string[] = []
    const delta: { id: string; time_updated: number }[] = []
    for (const row of candidates) {
      const known = watermark.get(row.id)
      if (!known) {
        delta.push(row)
        continue
      }
      const current = (yield* db.all<{ time_updated: number }>(
        sql`SELECT time_updated FROM session_v2 WHERE id = ${row.id}`,
      ))[0]
      if (current && current.time_updated > known.imported_at) conflicts.push(row.id)
      else delta.push(row)
    }

    yield* Effect.forEach(
      conflicts,
      (id) => Effect.logWarning("V1 session changed in both stores; keeping the v2 copy", { sessionID: id }),
      { discard: true },
    )

    if (delta.length === 0 && !options.force)
      return yield* finish({ attached: true, sessions: 0, skipped: conflicts.length })

    const now = Date.now()
    const staged = delta.map((row) => ({
      row,
      session: legacy
        .query<Record<string, unknown>, [string]>(`SELECT * FROM "session" WHERE id = ?`)
        .get(row.id),
      messages: legacy
        .query<Record<string, unknown>, [string]>(`SELECT * FROM "message" WHERE session_id = ?`)
        .all(row.id),
      parts: legacy
        .query<Record<string, unknown>, [string]>(`SELECT * FROM "part" WHERE session_id = ?`)
        .all(row.id),
    }))

    yield* db
      .transaction((tx) =>
        Effect.gen(function* () {
          const insert = (table: string, rows: Record<string, unknown>[]) =>
            Effect.forEach(
              rows.filter((row) => Object.keys(row).length > 0),
              (row) => {
                const columns = Object.keys(row)
                const values = columns.map((column) => literal(row[column])).join(", ")
                return tx.run(
                  sql.raw(
                    `INSERT OR REPLACE INTO ${quote(table)} (${columns.map(quote).join(", ")}) VALUES (${values})`,
                  ),
                )
              },
              { discard: true },
            )
          // The staging tables hold only the delta, so the importer's scan is proportional
          // to what moved rather than to the whole history. Children go first: part
          // references message, and message references session.
          for (const table of [...SESSION_TABLES].reverse())
            yield* tx.run(`DELETE FROM ${quote(table)}`)
          for (const item of staged) {
            if (item.session) yield* insert("session", [item.session])
            yield* insert("message", item.messages)
            yield* insert("part", item.parts)
            yield* tx.run(sql`
              INSERT INTO legacy_sync (session_id, synced_updated, imported_at)
              VALUES (${item.row.id}, ${item.row.time_updated}, ${now})
              ON CONFLICT(session_id) DO UPDATE SET
                synced_updated = excluded.synced_updated,
                imported_at = excluded.imported_at
            `)
          }
          // Clearing the marker makes the importer translate the delta on this start.
          yield* tx.run(sql`
            INSERT INTO kv (key, value, time_created, time_updated)
            VALUES (${MIGRATION_STATE_KEY}, ${JSON.stringify({ phase: "sessions" })}, ${now}, ${now})
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, time_updated = excluded.time_updated
          `)
        }),
      )
      .pipe(Effect.orDie)

    return yield* finish({ attached: true, sessions: delta.length, skipped: conflicts.length })
  }).pipe(
    Effect.tapError((error) => Effect.logWarning("V1 session sync failed", { error })),
    Effect.orElseSucceed(() => NONE),
  ) as Effect.Effect<SyncResult>
}
