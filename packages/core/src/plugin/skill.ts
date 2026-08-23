/// <reference path="../markdown.d.ts" />

export * as SkillPlugin from "./skill"

import { define } from "./internal"
import { Effect } from "effect"
import { AbsolutePath } from "../schema"
import { SkillV2 } from "../skill"
import customizeModContent from "./skill/customize-modtools.md" with { type: "text" }

export const CustomizeModContent = customizeModContent

export const Plugin = define({
  id: "skill",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.skill.transform((draft) => {
      draft.source(
        SkillV2.EmbeddedSource.make({
          type: "embedded",
          skill: SkillV2.Info.make({
            name: "customize-mod",
            description:
              "Use ONLY when the user is editing or creating mod's own configuration: MOD.json, MOD.jsonc, files under .mod/, or files under ~/.config/mod/. Also use when creating or fixing mod agents, subagents, commands, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring mod itself.",
            location: AbsolutePath.make("/builtin/customize-mod.md"),
            content: CustomizeModContent,
          }),
        }),
      )
    })
  }),
})
