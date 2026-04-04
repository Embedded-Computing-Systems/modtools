import { addons, types } from "storybook/manager-api"
import { ThemeTool } from "./theme-tool"

addons.register("modtools/theme-toggle", () => {
  addons.add("modtools/theme-toggle/tool", {
    type: types.TOOL,
    title: "Theme",
    match: ({ viewMode }) => viewMode === "story" || viewMode === "docs",
    render: ThemeTool,
  })
})
