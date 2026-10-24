import { Agent } from "@modtools-ai/core/agent"
import { AISDK } from "@modtools-ai/core/aisdk"
import { Command } from "@modtools-ai/core/command"
import { Config } from "@modtools-ai/core/config"
import { Credential } from "@modtools-ai/core/credential"
import { Database } from "@modtools-ai/core/database/database"
import { FileAccess } from "@modtools-ai/core/file-access"
import { LayerNodePlatform } from "@modtools-ai/util/effect/app-node-platform"
import { AppProcess } from "@modtools-ai/util/process"
import { LayerNode } from "@modtools-ai/util/effect/layer-node"
import { Bus } from "@modtools-ai/core/bus"
import { FileSystem } from "@modtools-ai/core/filesystem"
import { FSUtil } from "@modtools-ai/util/fs-util"
import { Form } from "@modtools-ai/core/form"
import { Generate } from "@modtools-ai/core/generate"
import { Integration } from "@modtools-ai/core/integration"
import { KV } from "@modtools-ai/core/kv"
import { Location } from "@modtools-ai/core/location"
import { ManagedPolicy } from "@modtools-ai/core/managed-policy"
import { Mcp } from "@modtools-ai/core/mcp/index"
import { Model } from "@modtools-ai/core/model"
import { Npm } from "@modtools-ai/util/npm"
import { Plugin } from "@modtools-ai/core/plugin"
import { PluginHooks } from "@modtools-ai/core/plugin/hooks"
import { Provider } from "@modtools-ai/core/provider"
import { Session } from "@modtools-ai/core/session"
import { PersistentPty } from "@modtools-ai/core/persistent-pty"
import { LocationServiceMap } from "@modtools-ai/core/location-service-map"
import { AppNodeBuilder } from "@modtools-ai/core/effect/app-node-builder"
import { Permission } from "@modtools-ai/core/permission"
import { Reference } from "@modtools-ai/core/reference"
import { Rpc } from "@modtools-ai/core/rpc"
import { Skill } from "@modtools-ai/core/skill"
import { SkillDiscovery } from "@modtools-ai/core/skill/discovery"
import { Watcher } from "@modtools-ai/core/filesystem/watcher"
import { Tool } from "@modtools-ai/core/tool"
import { Vcs } from "@modtools-ai/core/vcs"
import { Voice } from "@modtools-ai/core/voice"
import { WebSearch } from "@modtools-ai/core/websearch"
import { Worktree } from "@modtools-ai/core/worktree"
import { WorktreeStrategies } from "@modtools-ai/core/worktree/strategies"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"
import { emptyMcpLayer } from "../fixture/mcp"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: (name) => Effect.succeed({ directory: "", name }),
    resolve: (name) => Effect.succeed({ directory: "", name }),
    check: () => Effect.succeed(false),
    update: (name) => Effect.succeed({ directory: "", name }),
    which: () => Effect.undefined,
  }),
)

const generateLayer = Layer.succeed(Generate.Service, Generate.Service.of({ text: () => Effect.succeed("") }))

const configLayer = Config.testLayer()

const permissionLayer = Layer.succeed(
  Permission.Service,
  Permission.Service.of({
    close: Effect.void,
    ask: (input) => Effect.succeed({ id: input.id ?? Permission.ID.create(), effect: "ask" }),
    assert: () => Effect.void,
    reply: () => Effect.void,
    get: () => Effect.succeed(undefined),
    forSession: () => Effect.succeed([]),
    list: () => Effect.succeed([]),
  }),
)

export const makePluginTestLayer = (permission = permissionLayer) =>
  AppNodeBuilder.build(
    LayerNode.group([
      AppProcess.node,
      FileSystem.node,
      FSUtil.node,
      Location.node,
      Npm.node,
      Credential.node,
      Config.node,
      Database.node,
      FileAccess.node,
      Bus.node,
      Form.node,
      Generate.node,
      LayerNodePlatform.httpClient,
      Plugin.node,
      Agent.node,
      AISDK.node,
      Provider.node,
      Model.node,
      Command.node,
      Integration.node,
      KV.node,
      ManagedPolicy.node,
      Mcp.node,
      Session.node,
      PersistentPty.node,
      LocationServiceMap.node,
      Permission.node,
      PluginHooks.node,
      Reference.node,
      Rpc.node,
      Skill.node,
      SkillDiscovery.node,
      Tool.node,
      Vcs.node,
      Voice.node,
      Watcher.node,
      WebSearch.node,
      Worktree.node,
      WorktreeStrategies.node,
    ]),
    [
      Location.node.replace(tempLocationLayer),
      Npm.node.replace(npmLayer),
      Config.node.replace(configLayer),
      Mcp.node.replace(emptyMcpLayer),
      Generate.node.replace(generateLayer),
      Permission.node.replace(permission),
    ],
  ).pipe(Layer.provideMerge(configLayer))

export const PluginTestLayer = makePluginTestLayer()
