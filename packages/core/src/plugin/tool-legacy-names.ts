export * as ToolLegacyNamesPlugin from "./tool-legacy-names.js"

import { define } from "@modtools-ai/plugin/effect/plugin"
import { Effect, Predicate } from "effect"

// Sessions imported from v1 carry tool calls under v1 names and argument shapes, and models
// copy them. A call to a v1 name that no registered tool answers is moved to its v2 tool with
// the arguments renamed; a registered tool of the same name always wins.
type Rename = { readonly tool: string; readonly input: (input: Record<string, unknown>) => Record<string, unknown> }

const rename =
  (fields: Record<string, string>) =>
  (input: Record<string, unknown>): Record<string, unknown> =>
    Object.fromEntries(Object.entries(input).map(([key, value]) => [fields[key] ?? key, value]))

const filePath = rename({ filePath: "path" })

export const legacy: Record<string, Rename> = {
  bash: { tool: "shell", input: rename({}) },
  read: { tool: "read", input: filePath },
  write: { tool: "write", input: filePath },
  edit: { tool: "edit", input: filePath },
  list: { tool: "read", input: (input) => ({ path: input.path ?? "." }) },
  task: { tool: "subagent", input: rename({ subagent_type: "agent", task_id: "sessionID" }) },
  apply_patch: { tool: "patch", input: rename({}) },
  skill: { tool: "skill", input: rename({ name: "id" }) },
}

export const Plugin = define({
  id: "mod.tool.legacy-names",
  effect: (ctx) =>
    ctx.tool.hook("execute.before", (event) =>
      Effect.gen(function* () {
        const tools = yield* ctx.tool.list()
        const known = (name: string) => tools.some((tool) => tool.id === name)
        const entry = legacy[event.tool]
        const input = typeof event.input === "string" ? parse(event.input) : event.input
        if (!entry || !Predicate.isObject(input)) return
        // Same-name entries only rename v1 argument keys the v2 schema lacks.
        if (entry.tool !== event.tool && known(event.tool)) return
        if (!known(entry.tool)) return
        event.tool = entry.tool
        event.input = entry.input(input as Record<string, unknown>)
      }),
    ),
})

function parse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}
