import { For } from "solid-js"
import { DEFAULT_THEMES, useTheme } from "@tui/context/theme"

const themeCount = Object.keys(DEFAULT_THEMES).length
const themeTip = `Use {highlight}/themes{/highlight} or {highlight}Ctrl+X T{/highlight} to switch between ${themeCount} built-in themes`

type TipPart = { text: string; highlight: boolean }

function parse(tip: string): TipPart[] {
  const parts: TipPart[] = []
  const regex = /\{highlight\}(.*?)\{\/highlight\}/g
  const found = Array.from(tip.matchAll(regex))
  const state = found.reduce(
    (acc, match) => {
      const start = match.index ?? 0
      if (start > acc.index) {
        acc.parts.push({ text: tip.slice(acc.index, start), highlight: false })
      }
      acc.parts.push({ text: match[1], highlight: true })
      acc.index = start + match[0].length
      return acc
    },
    { parts, index: 0 },
  )

  if (state.index < tip.length) {
    parts.push({ text: tip.slice(state.index), highlight: false })
  }

  return parts
}

export function Tips() {
  const theme = useTheme().theme
  const parts = parse(TIPS[Math.floor(Math.random() * TIPS.length)])

  return (
    <box flexDirection="row" maxWidth="100%">
      <text flexShrink={0} style={{ fg: theme.warning }}>
        ● Tip{" "}
      </text>
      <text flexShrink={1}>
        <For each={parts}>
          {(part) => <span style={{ fg: part.highlight ? theme.text : theme.textMuted }}>{part.text}</span>}
        </For>
      </text>
    </box>
  )
}

const TIPS = [
  "Type {highlight}@{/highlight} followed by a filename to fuzzy search and attach files",
  "Start a message with {highlight}!{/highlight} to run shell commands directly (e.g., {highlight}!ls -la{/highlight})",
  "Press {highlight}Tab{/highlight} to cycle between Build and Plan agents",
  "Use {highlight}/undo{/highlight} to revert the last message and file changes",
  "Use {highlight}/redo{/highlight} to restore previously undone messages and file changes",
  "Run {highlight}/share{/highlight} to create a public link to your conversation at modtools.ai",
  "Run {highlight}/help{/highlight} to see all available slash commands",
  "Use {highlight}Ctrl+G{/highlight} to open the command palette from anywhere",
  "Toggle between agents (e.g. explore/general) with {highlight}Tab{/highlight}",
  "Create {highlight}mod.json{/highlight} for server settings and {highlight}tui.json{/highlight} for TUI settings",
  "Place TUI settings in {highlight}~/.config/mod/tui.json{/highlight} for global config",
  "Place project-specific settings in {highlight}.mod/mod.json{/highlight} or {highlight}mod.json{/highlight}",
  "Press {highlight}Ctrl+R{/highlight} to reload your configuration and plugins",
  "Add {highlight}.md{/highlight} files to {highlight}.mod/command/{/highlight} to define reusable custom prompts",
  "Add {highlight}.md{/highlight} files to {highlight}.mod/agent/{/highlight} for specialized AI personas",
  "Define custom {highlight}instructions{/highlight} in your config file to tune agent behavior",
  "Create {highlight}.ts{/highlight} files in {highlight}.mod/tools/{/highlight} to define new LLM tools",
  "Add {highlight}.ts{/highlight} files to {highlight}.mod/plugin/{/highlight} for event hooks",
  "Use {highlight}mod run{/highlight} for non-interactive scripting",
  "Use {highlight}mod --continue{/highlight} to resume the last session",
  "Use {highlight}mod run -f file.ts{/highlight} to attach files via CLI",
  "Run {highlight}mod serve{/highlight} for headless API access to MOD",
  "Use {highlight}mod run --attach{/highlight} to connect to a running server",
  "Run {highlight}mod upgrade{/highlight} to update to the latest version",
  "Run {highlight}mod auth list{/highlight} to see all configured providers",
  "Run {highlight}mod agent create{/highlight} for guided agent creation",
  "Use {highlight}/mod{/highlight} in GitHub issues/PRs to trigger AI actions",
  "Run {highlight}mod github install{/highlight} to set up the GitHub workflow",
  "Comment {highlight}/mod fix this{/highlight} on issues to auto-create PRs",
  "Integrate with external tools via {highlight}MCP{/highlight} (Model Context Protocol)",
  "Create JSON theme files in {highlight}.mod/themes/{/highlight} directory",
  "Use {highlight}mod mcp add{/highlight} to connect new tool servers",
  "Explore and manage project files with the {highlight}explore{/highlight} agent",
  "Use {highlight}Ctrl+P{/highlight} to quickly find and attach files in the TUI",
  "Run {highlight}mod debug config{/highlight} to troubleshoot configuration",
  "Use {highlight}Ctrl+O{/highlight} to open the current file in your default editor",
  "Press {highlight}Ctrl+L{/highlight} to clear the current conversation history",
  "Run {highlight}docker run -it --rm ghcr.io/Embedded-Computing-Systems/modtools{/highlight} for containerized use",
  "Use {highlight}/connect{/highlight} with MOD Zen for curated, tested models",
  "Commit your project's {highlight}AGENTS.md{/highlight} file to Git for team sharing",
  "Use {highlight}/review{/highlight} to review uncommitted changes, branches, or PRs",
  "Run {highlight}/help{/highlight} or {highlight}Ctrl+X H{/highlight} to show the help dialog",
  "Use {highlight}/rename{/highlight} to rename the current session",
  ...(process.platform === "win32"
    ? ["Press {highlight}Ctrl+Z{/highlight} to undo changes in your prompt"]
    : ["Press {highlight}Ctrl+Z{/highlight} to suspend the terminal and return to your shell"]),
]
