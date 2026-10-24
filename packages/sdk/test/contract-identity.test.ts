import { expect, test } from "bun:test"
import { EnvironmentDriver } from "@modtools-ai/core/environment/driver"
import { EnvironmentFiles } from "@modtools-ai/core/environment/files"
import { Location as CoreLocation } from "@modtools-ai/core/location"
import { WorkspaceDriver } from "@modtools-ai/core/workspace/driver"
import { SessionInbox as CoreSessionInbox } from "@modtools-ai/core/session/inbox"
import { SessionMessage as CoreSessionMessage } from "@modtools-ai/core/session/message"
import { Agent } from "@modtools-ai/schema/agent"
import { Config } from "@modtools-ai/schema/config"
import { Event } from "@modtools-ai/schema/event"
import { Location } from "@modtools-ai/schema/location"
import { Model } from "@modtools-ai/schema/model"
import { Project } from "@modtools-ai/schema/project"
import { Provider } from "@modtools-ai/schema/provider"
import { WebSearch } from "@modtools-ai/schema/websearch"
import { Session } from "@modtools-ai/schema/session"
import { SessionInbox } from "@modtools-ai/schema/session-inbox"
import { SessionMessage } from "@modtools-ai/schema/session-message"
import { Workspace } from "@modtools-ai/schema/workspace"
import { Worktree } from "@modtools-ai/schema/worktree"
import { Api } from "@modtools-ai/server/api"
import { ClientApi, groupNames, promiseOmitEndpoints } from "@modtools-ai/protocol/client"
import { compile, emitPromise } from "@modtools-ai/httpapi-codegen"

const SDK = await import("../src/index")
const SDKEffect = await import("../src/effect")
const CoreAgent = await import("@modtools-ai/core/agent")
const CoreModel = await import("@modtools-ai/core/model")
const CoreProject = await import("@modtools-ai/core/project")
const CoreSession = await import("@modtools-ai/core/session")
const CoreWorktree = await import("@modtools-ai/core/worktree")

test("re-exports canonical contracts directly from Schema", () => {
  expect(SDK.Agent).toBe(Agent)
  expect(SDK.Config).toBe(Config)
  expect(SDK.Event).toBe(Event)
  expect(SDK.Model).toBe(Model)
  expect(SDK.WebSearch).toBe(WebSearch)
  expect(SDK.Session).toBe(Session)
  expect(SDK.Worktree).toBe(Worktree)
  expect(SDK.Workspace).toBe(Workspace)
  expect(Object.keys(SDK).sort()).toEqual([
    "AbsolutePath",
    "Agent",
    "ClientError",
    "Command",
    "Config",
    "Credential",
    "Event",
    "FileSystem",
    "Integration",
    "Location",
    "Model",
    "MOD",
    "Permission",
    "PermissionSaved",
    "Project",
    "Prompt",
    "PromptInput",
    "Provider",
    "Pty",
    "Question",
    "Reference",
    "RelativePath",
    "Session",
    "SessionInbox",
    "SessionMessage",
    "Skill",
    "Tool",
    "WebSearch",
    "Workspace",
    "Worktree",
  ])
})

test("Core and Server reuse the authoritative Schema and Protocol values", () => {
  expect(CoreAgent.ID).toBe(Agent.ID)
  expect(CoreLocation.Ref).toBe(Location.Ref)
  expect(CoreModel.Ref).toBe(Model.Ref)
  expect(CoreSession.Info).toBe(Session.Info)
  expect(CoreProject.Current).toBe(Project.Current)
  expect(CoreWorktree.DirectoryUnavailableError).toBeDefined()
  expect(CoreWorktree.List).toBe(Worktree.List)
  expect(CoreWorktree.Info).toBe(Worktree.Info)
  expect(CoreSessionInbox.Item).toBe(SessionInbox.Item)
  expect(CoreSessionInbox.User).toBe(SessionInbox.User)
  expect(CoreSessionInbox.Synthetic).toBe(SessionInbox.Synthetic)
  expect(CoreSessionMessage.Info).toBe(SessionMessage.Info)
  expect(CoreSessionMessage.AssistantText).toBe(SessionMessage.AssistantText)
  expect(Api.groups["server.session"].identifier).toBe("server.session")
  expect(Api.groups["server.project"].identifier).toBe("server.project")
  expect(Object.keys(ClientApi.groups)).toEqual(Object.keys(Api.groups))
  expect(Session.ID.create()).toStartWith("ses_")
  expect(String(Project.ID.global)).toBe("global")
  expect(String(Provider.ID.anthropic)).toBe("anthropic")
  expect(Workspace.ID.create()).toStartWith("wrk_")
})

test("client and Server contracts generate identically", () => {
  const server = compile(Api, { groupNames, omitEndpoints: promiseOmitEndpoints })
  const client = compile(ClientApi, { groupNames, omitEndpoints: promiseOmitEndpoints })

  expect(emitPromise(client)).toEqual(emitPromise(server))
})

test("re-exports workspace and environment driver contracts from @modtools-ai/sdk/effect", () => {
  expect(SDKEffect.WorkspaceDriver).toBe(WorkspaceDriver)
  expect(SDKEffect.EnvironmentDriver).toBe(EnvironmentDriver)
  expect(SDKEffect.EnvironmentFiles).toBe(EnvironmentFiles)
})
