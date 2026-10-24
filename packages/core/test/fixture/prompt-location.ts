import type { FileSystem } from "@modtools-ai/core/filesystem"
import { Bus } from "@modtools-ai/core/bus"
import { Image } from "@modtools-ai/core/image"
import { LocationServiceMap } from "@modtools-ai/core/location-service-map"
import type { LocationServices } from "@modtools-ai/core/location-services"
import { Plugin } from "@modtools-ai/core/plugin"
import { PluginHooks } from "@modtools-ai/core/plugin/hooks"
import { Skill } from "@modtools-ai/core/skill"
import type { Location } from "@modtools-ai/schema/location"
import { makeGlobalNode } from "@modtools-ai/util/effect/app-node"
import { LayerNode } from "@modtools-ai/util/effect/layer-node"
import { Effect, Layer, LayerMap } from "effect"

// Plain-prompt unit fixtures use virtual directories.
export const promptLocationNode = makeGlobalNode({
  service: LocationServiceMap.Service,
  layer: Layer.effect(
    LocationServiceMap.Service,
    Effect.gen(function* () {
      const bus = yield* Bus.Service
      return yield* LayerMap.make(
        (_ref: Location.Ref) =>
          LayerNode.compile(LayerNode.group([PluginHooks.node, Image.node, Skill.node, Plugin.node]), {
            replacements: [
              Bus.node.replace(Layer.succeed(Bus.Service, bus)),
              Plugin.node.replace(Layer.mock(Plugin.Service, { awaitActivation: Effect.void })),
            ],
          }) as unknown as Layer.Layer<LocationServices, FileSystem.DirectoryNotFoundError>,
      )
    }),
  ),
  deps: [Bus.node],
})
