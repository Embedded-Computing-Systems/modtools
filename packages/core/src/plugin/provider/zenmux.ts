import { Effect } from "effect"
import { define } from "@modtools-ai/plugin/effect/plugin"

export const ZenmuxPlugin = define({
  id: "mod.provider.zenmux",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.provider.transform((evt) => {
      for (const item of evt.list()) {
        if (item.provider.package !== "@modtools-ai/ai/providers/openai-compatible") continue
        if (item.provider.settings?.baseURL !== "https://zenmux.ai/api/v1") continue
        evt.update(item.provider.id, (provider) => {
          provider.headers = {
            "HTTP-Referer": "https://modtools.ai/",
            "X-Title": "mod",
            ...provider.headers,
          }
        })
      }
    })
  }),
})
