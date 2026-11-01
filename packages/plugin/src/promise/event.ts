import type { OpenCodeEvent } from "@modtools-ai/client"
import type { SelectedEvent, SubscribeOptions } from "@modtools-ai/client/promise/api"

type EventType = Exclude<OpenCodeEvent["type"], "server.connected">

export interface EventDomain {
  readonly subscribe: <Type extends EventType = EventType>(
    options?: SubscribeOptions<Type>,
  ) => AsyncIterable<SelectedEvent<OpenCodeEvent, Type>>
}
