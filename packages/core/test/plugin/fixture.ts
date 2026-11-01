import { Agent } from "@modtools-ai/core/agent"
import { Artifact } from "@modtools-ai/core/artifact"
import { AISDK } from "@modtools-ai/core/aisdk"
import { Command } from "@modtools-ai/core/command"
import { Config } from "@modtools-ai/core/config"
import { Credential } from "@modtools-ai/core/credential"
import { Database } from "@modtools-ai/core/database/database"
import { Environment } from "@modtools-ai/core/environment/index"
import { FileAccess } from "@modtools-ai/core/file-access"
import { LayerNodePlatform } from "@modtools-ai/util/effect/app-node-platform"
import { AppProcess } from "@modtools-ai/util/process"
import { LayerNode } from "@modtools-ai/util/effect/layer-node"
import { Bus } from "@modtools-ai/core/bus"
import { FileSystem } from "@modtools-ai/core/filesystem"
import { FSUtil } from "@modtools-ai/util/fs-util"
import { Global } from "@modtools-ai/util/global"
import { Form } from "@modtools-ai/core/form"
import { Generate } from "@modtools-ai/core/generate"
import { Integration } from "@modtools-ai/core/integration"
import { Job } from "@modtools-ai/core/job"
import { KV } from "@modtools-ai/core/kv"
import { Location } from "@modtools-ai/core/location"
import { Mcp } from "@modtools-ai/core/mcp/index"
import { Model } from "@modtools-ai/core/model"
import { Npm } from "@modtools-ai/util/npm"
import { Plugin } from "@modtools-ai/core/plugin"
import { PluginHooks } from "@modtools-ai/core/plugin/hooks"
import { Provider } from "@modtools-ai/core/provider"
import { Session } from "@modtools-ai/core/session"
import { InstructionEntry } from "@modtools-ai/core/session/instruction-entry"
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
import { WebSearch } from "@modtools-ai/core/websearch"
import { Worktree } from "@modtools-ai/core/worktree"
import { WorktreeStrategies } from "@modtools-ai/core/worktree/strategies"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"
import { emptyMcpLayer } from "../fixture/mcp"
import { offlineModels } from "../fixture/models"

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

const generateLayer = Layer.succeed(
  Generate.Service,
  Generate.Service.of({
    text: () => Effect.succeed(""),
    image: () => Effect.die("unused"),
    decisions: () => Effect.die("unused"),
  }),
)

const configLayer = Config.testLayer()

const permissionLayer = Layer.succeed(
  Permission.Service,
  Permission.Service.of({
    close: Effect.void,
    ask: (input) => Effect.succeed({ id: input.id ?? Permission.ID.create(), effect: "ask" }),
    assert: () => Effect.void,
    assertNotDenied: () => Effect.void,
    allows: () => Effect.succeed(false),
    reply: () => Effect.void,
    get: () => Effect.succeed(undefined),
    forSession: () => Effect.succeed([]),
    list: () => Effect.succeed([]),
  }),
)

export const makePluginTestLayer = (permission = permissionLayer, generate = generateLayer) =>
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
      Environment.node,
      FileAccess.node,
      Global.node,
      Bus.node,
      Form.node,
      Generate.node,
      LayerNodePlatform.httpClient,
      Plugin.node,
      Agent.node,
      Artifact.node,
      AISDK.node,
      Provider.node,
      Model.node,
      Command.node,
      Integration.node,
      Job.node,
      KV.node,
      Mcp.node,
      Session.node,
      InstructionEntry.node,
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
      Generate.node.replace(generate),
      Permission.node.replace(permission),
      offlineModels,
    ],
  ).pipe(Layer.provideMerge(configLayer))

export const PluginTestLayer = makePluginTestLayer()
