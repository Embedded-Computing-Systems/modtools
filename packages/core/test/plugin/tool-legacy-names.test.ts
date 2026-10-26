import { expect } from "bun:test"
import { Effect, Schema } from "effect"
import { Agent } from "@modtools-ai/core/agent"
import { Plugin } from "@modtools-ai/core/plugin"
import { ToolInputRepairPlugin } from "@modtools-ai/core/plugin/tool-input-repair"
import { ToolLegacyNamesPlugin } from "@modtools-ai/core/plugin/tool-legacy-names"
import { Session } from "@modtools-ai/core/session"
import { SessionMessage } from "@modtools-ai/core/session/message"
import { Tool } from "@modtools-ai/core/tool"
import { testEffect } from "../lib/effect"
import { PluginTestLayer } from "./fixture"

const it = testEffect(PluginTestLayer)
const identity = {
  sessionID: Session.ID.make("ses_legacy"),
  agent: Agent.ID.make("build"),
  messageID: SessionMessage.ID.make("msg_legacy"),
}

const recorder = (executed: Array<[string, unknown]>, name: string, input: Schema.Codec<any, any>) => ({
  name,
  options: { codemode: false },
  description: name,
  input,
  execute: (value: unknown) => Effect.sync(() => executed.push([name, value])).pipe(Effect.as({ content: "ok" })),
})

it.effect("moves v1 tool calls to their v2 tools with v2 argument names", () =>
  Effect.gen(function* () {
    const plugins = yield* Plugin.Service
    const registry = yield* Tool.Service
    const executed: Array<[string, unknown]> = []
    yield* plugins.activate([
      { ...ToolLegacyNamesPlugin.Plugin, revision: "1" },
      { ...ToolInputRepairPlugin.Plugin, revision: "1" },
      {
        id: "v2-tools",
        revision: "1",
        effect: (ctx) =>
          ctx.tool.transform((draft) => {
            draft.add(recorder(executed, "shell", Schema.Struct({ command: Schema.String })))
            draft.add(recorder(executed, "read", Schema.Struct({ path: Schema.String })))
            draft.add(
              recorder(
                executed,
                "subagent",
                Schema.Struct({ agent: Schema.String, description: Schema.String, prompt: Schema.String }),
              ),
            )
          }),
      },
    ])
    const snapshot = yield* registry.snapshot()
    const call = (id: string, name: string, input: unknown) =>
      snapshot.execute({ ...identity, call: { type: "tool-call", id, name, input } })

    yield* call("c1", "bash", '{"command":"ls","description":"List files"}')
    yield* call("c2", "read", { filePath: "/tmp/a.txt" })
    yield* call("c3", "task", { subagent_type: "general", description: "Look", prompt: "Find it" })
    expect(executed).toEqual([
      ["shell", { command: "ls" }],
      ["read", { path: "/tmp/a.txt" }],
      ["subagent", { agent: "general", description: "Look", prompt: "Find it" }],
    ])
  }),
)

it.effect("leaves a registered tool with a v1 name alone", () =>
  Effect.gen(function* () {
    const plugins = yield* Plugin.Service
    const registry = yield* Tool.Service
    const executed: Array<[string, unknown]> = []
    yield* plugins.activate([
      { ...ToolLegacyNamesPlugin.Plugin, revision: "1" },
      {
        id: "own-bash",
        revision: "1",
        effect: (ctx) =>
          ctx.tool.transform((draft) => {
            draft.add(recorder(executed, "bash", Schema.Struct({ command: Schema.String })))
            draft.add(recorder(executed, "shell", Schema.Struct({ command: Schema.String })))
          }),
      },
    ])
    const snapshot = yield* registry.snapshot()
    yield* snapshot.execute({ ...identity, call: { type: "tool-call", id: "c1", name: "bash", input: { command: "ls" } } })
    expect(executed).toEqual([["bash", { command: "ls" }]])
  }),
)
