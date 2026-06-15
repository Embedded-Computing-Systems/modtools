/// <reference path="../markdown.d.ts" />

export * as SkillPlugin from "./skill"

import { Effect } from "effect"
import { PluginV2 } from "../plugin"
import { AbsolutePath } from "../schema"
import { SkillV2 } from "../skill"
import customizeModContent from "./skill/customize-modtools.md" with { type: "text" }

export const CustomizeModContent = customizeModContent

export const Plugin = PluginV2.define({
  id: PluginV2.ID.make("skill"),
  effect: Effect.gen(function* () {
    const skill = yield* SkillV2.Service
    const transform = yield* skill.transform()

    yield* transform((editor) => {
      editor.source(
        new SkillV2.EmbeddedSource({
          type: "embedded",
          skill: new SkillV2.Info({
            name: "customize-modtools",
            description:
              "Use ONLY when the user is editing or creating MOD's own configuration: MOD.json, MOD.jsonc, files under .modtools/, or files under ~/.config/MOD/. Also use when creating or fixing MOD agents, subagents, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring MOD itself.",
            location: AbsolutePath.make("/builtin/customize-modtools.md"),
            content: CustomizeModContent,
          }),
        }),
      )
    })
  }),
})
