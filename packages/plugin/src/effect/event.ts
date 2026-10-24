import type { EventApi } from "@modtools-ai/client/effect/api"

export interface EventDomain extends Pick<EventApi<unknown>, "subscribe"> {}
