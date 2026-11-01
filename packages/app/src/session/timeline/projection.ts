import { createReactiveTimelineProjection } from "@modtools-ai/session-ui/timeline/projection"

export { reuseTimelineRows } from "@modtools-ai/session-ui/timeline/projection"

export function createTimelineProjection(input: Parameters<typeof createReactiveTimelineProjection>[0]) {
  return createReactiveTimelineProjection(input)
}
