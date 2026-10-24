export * as Instance from "./service.js"
export type { Services } from "../instance.js"

import { Context, type Effect } from "effect"
import type { Session } from "@modtools-ai/schema/session"
import { Node } from "@modtools-ai/util/effect/app-node"
import { LayerNode } from "@modtools-ai/util/effect/layer-node"
import type { Services, Error } from "../instance.js"

/** Selects Session capabilities; implementations own caching and lifetime. */
export interface Interface {
  readonly provide: (
    session: Session.Info,
  ) => <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E | Error, Exclude<R, Services>>
}

export class Service extends Context.Service<Service, Interface>()("@modtools-ai/Instance") {}

export const node = LayerNode.unbound(Service, Node.tags.values.global)
