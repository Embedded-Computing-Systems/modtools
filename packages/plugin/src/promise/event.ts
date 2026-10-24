import type { EventApi } from "@modtools-ai/client/promise/api"

export interface EventDomain extends Pick<EventApi, "subscribe"> {}
