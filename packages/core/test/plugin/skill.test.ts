import { describe, expect } from "bun:test"
import { Effect, Layer } from "effect"
import { AgentV2 } from "@modtools-ai/core/agent"
import { FSUtil } from "@modtools-ai/core/fs-util"
import { SkillPlugin } from "@modtools-ai/core/plugin/skill"
import { SkillV2 } from "@modtools-ai/core/skill"
import { SkillDiscovery } from "@modtools-ai/core/skill/discovery"
import { testEffect } from "../lib/effect"

const it = testEffect(
  SkillV2.layer.pipe(
    Layer.provide(FSUtil.defaultLayer),
    Layer.provide(SkillDiscovery.defaultLayer),
    Layer.provideMerge(AgentV2.locationLayer),
  ),
)

describe("SkillPlugin.Plugin", () => {
  it.effect("registers the built-in customize-MOD skill", () =>
    Effect.gen(function* () {
      const skill = yield* SkillV2.Service
      yield* SkillPlugin.Plugin.effect.pipe(Effect.provideService(SkillV2.Service, skill))

      expect(yield* skill.list()).toContainEqual(
        expect.objectContaining({
          name: "customize-MOD",
          description: expect.stringContaining("MOD's own configuration"),
        }),
      )
    }),
  )
})
