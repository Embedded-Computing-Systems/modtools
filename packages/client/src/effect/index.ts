// TODO: Keep additional network capabilities inside Schema and Protocol as the client grows; /effect must never import
// Core or Server. Preserve these datatype exports so internal model reorganizations do not require caller migrations.
import type { Effect } from "effect"
import type { OpenCode } from "./client.js"

export * from "./generated/index"
export { OpenCode } from "./client.js"
export type {
  AgentApi,
  AppApi,
  CommandApi,
  ConfigApi,
  EventApi,
  IntegrationApi,
  ModelApi,
  PluginApi,
  ProviderApi,
  ReferenceApi,
  RpcApi,
  RpcClient,
  WebSearchApi,
  SessionApi,
  SkillApi,
} from "./api.js"
export { Agent } from "@modtools-ai/schema/agent"
export { Command } from "@modtools-ai/schema/command"
export { Config } from "@modtools-ai/schema/config"
export { Credential } from "@modtools-ai/schema/credential"
export { Event } from "@modtools-ai/schema/event"
export { EventLog } from "@modtools-ai/schema/event-log"
export { FileSystem } from "@modtools-ai/schema/filesystem"
export { Form } from "@modtools-ai/schema/form"
export { Integration } from "@modtools-ai/schema/integration"
export { Location } from "@modtools-ai/schema/location"
export { Model } from "@modtools-ai/schema/model"
export { Permission } from "@modtools-ai/schema/permission"
export { PermissionSaved } from "@modtools-ai/schema/permission-saved"
export { Project } from "@modtools-ai/schema/project"
export { Worktree } from "@modtools-ai/schema/worktree"
export { Vcs } from "@modtools-ai/schema/vcs"
export { Provider } from "@modtools-ai/schema/provider"
export { Pty } from "@modtools-ai/schema/pty"
export { Question } from "@modtools-ai/schema/question"
export { Reference } from "@modtools-ai/schema/reference"
export { WebSearch } from "@modtools-ai/schema/websearch"
export { AbsolutePath, RelativePath } from "@modtools-ai/schema/schema"
export { Session } from "@modtools-ai/schema/session"
export { SessionInbox } from "@modtools-ai/schema/session-inbox"
export { SessionMessage } from "@modtools-ai/schema/session-message"
export { Skill } from "@modtools-ai/schema/skill"
export { Prompt } from "@modtools-ai/schema/prompt"
export { PromptInput } from "@modtools-ai/schema/prompt-input"
export type { OpenCodeEvent } from "@modtools-ai/protocol/groups/event"
export type OpenCodeClient = Effect.Success<ReturnType<typeof OpenCode.make>>
