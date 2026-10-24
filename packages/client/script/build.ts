import { NodeFileSystem } from "@effect/platform-node"
import { compile, emitEffectImported, emitEffectShape, emitPromise, write } from "@modtools-ai/httpapi-codegen"
import { ClientApi, effectOmitEndpoints, groupNames, promiseOmitEndpoints } from "@modtools-ai/protocol/client"
import { Agent } from "@modtools-ai/schema/agent"
import { Command } from "@modtools-ai/schema/command"
import { Config } from "@modtools-ai/schema/config"
import { Credential } from "@modtools-ai/schema/credential"
import { Event } from "@modtools-ai/schema/event"
import { EventLog } from "@modtools-ai/schema/event-log"
import { FileDiff } from "@modtools-ai/schema/file-diff"
import { FileSystem } from "@modtools-ai/schema/filesystem"
import { Form } from "@modtools-ai/schema/form"
import { Instruction } from "@modtools-ai/schema/instruction"
import { InstructionEntry } from "@modtools-ai/schema/instruction-entry"
import { Integration } from "@modtools-ai/schema/integration"
import { Location } from "@modtools-ai/schema/location"
import { Mcp } from "@modtools-ai/schema/mcp"
import { Model } from "@modtools-ai/schema/model"
import { Money } from "@modtools-ai/schema/money"
import { Permission } from "@modtools-ai/schema/permission"
import { PermissionSaved } from "@modtools-ai/schema/permission-saved"
import { Plugin } from "@modtools-ai/schema/plugin"
import { Project } from "@modtools-ai/schema/project"
import { Worktree } from "@modtools-ai/schema/worktree"
import { AgentAttachment, FileAttachment, Prompt, PromptMention } from "@modtools-ai/schema/prompt"
import { PromptInput } from "@modtools-ai/schema/prompt-input"
import { Provider } from "@modtools-ai/schema/provider"
import { Pty } from "@modtools-ai/schema/pty"
import { PtyTicket } from "@modtools-ai/schema/pty-ticket"
import { Question } from "@modtools-ai/schema/question"
import { Reference } from "@modtools-ai/schema/reference"
import { AbsolutePath, RelativePath } from "@modtools-ai/schema/schema"
import { Session } from "@modtools-ai/schema/session"
import { SessionMessage } from "@modtools-ai/schema/session-message"
import { SessionInbox } from "@modtools-ai/schema/session-inbox"
import { Shell } from "@modtools-ai/schema/shell"
import { Skill } from "@modtools-ai/schema/skill"
import { Snapshot } from "@modtools-ai/schema/snapshot"
import { Vcs } from "@modtools-ai/schema/vcs"
import { WebSearch } from "@modtools-ai/schema/websearch"
import { Workspace } from "@modtools-ai/schema/workspace"
import { Effect, Schema } from "effect"
import { fileURLToPath } from "url"

const promiseContract = compile(ClientApi, { groupNames, omitEndpoints: promiseOmitEndpoints })
const effectContract = compile(ClientApi, { groupNames, omitEndpoints: effectOmitEndpoints })
const effectTypeReferences = [
  ...namespaceTypes("Agent", "@modtools-ai/schema/agent", Agent),
  ...namespaceTypes("Command", "@modtools-ai/schema/command", Command),
  ...namespaceTypes("Config", "@modtools-ai/schema/config", Config),
  ...namespaceTypes("Credential", "@modtools-ai/schema/credential", Credential),
  ...namespaceTypes("Event", "@modtools-ai/schema/event", Event),
  ...namespaceTypes("EventLog", "@modtools-ai/schema/event-log", EventLog),
  ...namespaceTypes("FileDiff", "@modtools-ai/schema/file-diff", FileDiff),
  ...namespaceTypes("FileSystem", "@modtools-ai/schema/filesystem", FileSystem),
  ...namespaceTypes("Form", "@modtools-ai/schema/form", Form),
  ...namespaceTypes("Instruction", "@modtools-ai/schema/instruction", Instruction),
  ...namespaceTypes("InstructionEntry", "@modtools-ai/schema/instruction-entry", InstructionEntry),
  ...namespaceTypes("Integration", "@modtools-ai/schema/integration", Integration),
  typeReference("Location.PublicRef", "@modtools-ai/schema/location", Location.PublicRef),
  typeReference("Location.PublicInfo", "@modtools-ai/schema/location", Location.PublicInfo),
  ...namespaceTypes("Mcp", "@modtools-ai/schema/mcp", Mcp),
  ...namespaceTypes("Model", "@modtools-ai/schema/model", Model),
  ...namespaceTypes("Money", "@modtools-ai/schema/money", Money),
  ...namespaceTypes("Permission", "@modtools-ai/schema/permission", Permission),
  ...namespaceTypes("PermissionSaved", "@modtools-ai/schema/permission-saved", PermissionSaved),
  ...namespaceTypes("Plugin", "@modtools-ai/schema/plugin", Plugin),
  ...namespaceTypes("Project", "@modtools-ai/schema/project", Project),
  ...namespaceTypes("Worktree", "@modtools-ai/schema/worktree", Worktree),
  ...namespaceTypes("PromptInput", "@modtools-ai/schema/prompt-input", PromptInput),
  ...namespaceTypes("Provider", "@modtools-ai/schema/provider", Provider),
  ...namespaceTypes("Pty", "@modtools-ai/schema/pty", Pty),
  ...namespaceTypes("PtyTicket", "@modtools-ai/schema/pty-ticket", PtyTicket),
  ...namespaceTypes("Question", "@modtools-ai/schema/question", Question),
  ...namespaceTypes("Reference", "@modtools-ai/schema/reference", Reference),
  ...namespaceTypes("Session", "@modtools-ai/schema/session", Session),
  ...namespaceTypes("SessionMessage", "@modtools-ai/schema/session-message", SessionMessage),
  ...namespaceTypes("SessionInbox", "@modtools-ai/schema/session-inbox", SessionInbox),
  ...namespaceTypes("Shell", "@modtools-ai/schema/shell", Shell),
  ...namespaceTypes("Skill", "@modtools-ai/schema/skill", Skill),
  ...namespaceTypes("Snapshot", "@modtools-ai/schema/snapshot", Snapshot),
  ...namespaceTypes("Vcs", "@modtools-ai/schema/vcs", Vcs),
  ...namespaceTypes("WebSearch", "@modtools-ai/schema/websearch", WebSearch),
  ...namespaceTypes("Workspace", "@modtools-ai/schema/workspace", Workspace),
  typeReference("Prompt", "@modtools-ai/schema/prompt", Prompt),
  typeReference("PromptMention", "@modtools-ai/schema/prompt", PromptMention),
  typeReference("FileAttachment", "@modtools-ai/schema/prompt", FileAttachment),
  typeReference("AgentAttachment", "@modtools-ai/schema/prompt", AgentAttachment),
  typeReference("AbsolutePath", "@modtools-ai/schema/schema", AbsolutePath),
  typeReference("RelativePath", "@modtools-ai/schema/schema", RelativePath),
]

await Effect.runPromise(
  Effect.all(
    [
      write(
        emitPromise(promiseContract, {
          mutableOutputs: true,
        }),
        fileURLToPath(new URL("../src/promise/generated", import.meta.url)),
      ),
      write(
        emitEffectImported(effectContract, {
          module: "../../contract",
          api: "ClientApi",
          shapeModule: "../api/api.js",
        }),
        fileURLToPath(new URL("../src/effect/generated", import.meta.url)),
      ),
      write(
        emitEffectShape(effectContract, {
          typeReferences: effectTypeReferences,
          outputTypes: {
            "event.subscribe": {
              name: "OpenCodeEvent",
              import: 'import type { OpenCodeEvent } from "@modtools-ai/protocol/groups/event"',
            },
          },
        }),
        fileURLToPath(new URL("../src/effect/api", import.meta.url)),
      ),
    ],
    { concurrency: 3, discard: true },
  ).pipe(Effect.provide(NodeFileSystem.layer)),
)

function namespaceTypes(namespace: string, module: string, values: object) {
  return Object.entries(values).flatMap(([name, schema]) =>
    Schema.isSchema(schema) ? [typeReference(`${namespace}.${name}`, module, schema)] : [],
  )
}

function typeReference(name: string, module: string, schema: Schema.Top) {
  return {
    schema,
    name,
    import: `import type { ${name.split(".")[0]} } from ${JSON.stringify(module)}`,
  }
}
