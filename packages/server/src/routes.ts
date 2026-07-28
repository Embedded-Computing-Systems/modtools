import { Database } from "@modtools-ai/core/database/database"
import { LayerNode } from "@modtools-ai/core/effect/layer-node"
import { httpClient } from "@modtools-ai/core/effect/app-node-platform"
import { AppNodeBuilder } from "@modtools-ai/core/effect/app-node-builder"
import { EventV2 } from "@modtools-ai/core/event"
import { Credential } from "@modtools-ai/core/credential"
import { PermissionSaved } from "@modtools-ai/core/permission/saved"
import { PtyTicket } from "@modtools-ai/core/pty/ticket"
import { SessionV2 } from "@modtools-ai/core/session"
import { SessionExecution } from "@modtools-ai/core/session/execution"
import { LocationServiceMap } from "@modtools-ai/core/location-service-map"
import { SessionExecutionLocal } from "@modtools-ai/core/session/execution/local"
import { ToolOutputStore } from "@modtools-ai/core/tool-output-store"
import { HttpRouter, HttpServer } from "effect/unstable/http"
import { HttpApiBuilder } from "effect/unstable/httpapi"
import { Layer, Option } from "effect"
import { Api } from "./api"
import { ServerAuth } from "./auth"
import { handlers } from "./handlers"
import { authorizationLayer } from "./middleware/authorization"
import { schemaErrorLayer } from "./middleware/schema-error"
import { PtyEnvironment } from "./pty-environment"
import { layer as locationLayer } from "./location"
import { sessionLocationLayer } from "./middleware/session-location"

const applicationServices = LayerNode.group([
  Database.node,
  EventV2.node,
  httpClient,
  ToolOutputStore.cleanupNode,
  SessionV2.node,
  PermissionSaved.node,
  PtyTicket.node,
  Credential.node,
  PtyEnvironment.node,
  LocationServiceMap.node,
])

export function createRoutes(password?: string) {
  return makeRoutes(
    password
      ? ServerAuth.Config.configLayer({ username: "mod", password: Option.some(password) })
      : ServerAuth.Config.layer,
  )
}

export function createEmbeddedRoutes() {
  return makeRoutes(ServerAuth.Config.configLayer({ username: "mod", password: Option.none() }))
}

function makeRoutes<AuthError, AuthServices>(auth: Layer.Layer<ServerAuth.Config, AuthError, AuthServices>) {
  const serviceLayer = AppNodeBuilder.build(applicationServices, [[SessionExecution.node, SessionExecutionLocal.node]])

  return HttpApiBuilder.layer(Api, { openapiPath: "/openapi.json" }).pipe(
    Layer.provide(handlers),
    Layer.provide(sessionLocationLayer),
    Layer.provide(locationLayer),
    Layer.provide(authorizationLayer),
    Layer.provide(schemaErrorLayer),
    Layer.provide(auth),
    Layer.provide(serviceLayer),
  )
}

export const routes = createRoutes()

export const webHandler = () =>
  HttpRouter.toWebHandler(routes.pipe(Layer.provide(HttpServer.layerServices)), { disableLogger: true })
