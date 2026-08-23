import { AgentV2 } from "@modtools-ai/core/agent"
import { AISDK } from "@modtools-ai/core/aisdk"
import { Catalog } from "@modtools-ai/core/catalog"
import { CommandV2 } from "@modtools-ai/core/command"
import { Credential } from "@modtools-ai/core/credential"
import { AppNodeBuilder } from "@modtools-ai/core/effect/app-node-builder"
import { LayerNodePlatform } from "@modtools-ai/core/effect/app-node-platform"
import { LayerNode } from "@modtools-ai/core/effect/layer-node"
import { EventV2 } from "@modtools-ai/core/event"
import { FileSystem } from "@modtools-ai/core/filesystem"
import { FSUtil } from "@modtools-ai/core/fs-util"
import { Integration } from "@modtools-ai/core/integration"
import { Location } from "@modtools-ai/core/location"
import { Npm } from "@modtools-ai/core/npm"
import { PluginV2 } from "@modtools-ai/core/plugin"
import { Reference } from "@modtools-ai/core/reference"
import { SkillV2 } from "@modtools-ai/core/skill"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: () => Effect.succeed({ directory: "", entrypoint: undefined }),
    install: () => Effect.void,
    which: () => Effect.succeed(undefined),
  }),
)

export const PluginTestLayer = AppNodeBuilder.build(
  LayerNode.group([
    FileSystem.node,
    FSUtil.node,
    Location.node,
    Npm.node,
    Credential.node,
    EventV2.node,
    LayerNodePlatform.httpClient,
    PluginV2.node,
    AgentV2.node,
    AISDK.node,
    Catalog.node,
    CommandV2.node,
    Integration.node,
    Reference.node,
    SkillV2.node,
  ]),
  [
    [Location.node, tempLocationLayer],
    [Npm.node, npmLayer],
  ],
)
