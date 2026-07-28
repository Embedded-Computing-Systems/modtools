import { run as runTui, type TuiInput } from "@modtools-ai/tui"
import { Global } from "@modtools-ai/core/global"
import { AppNodeBuilder } from "@modtools-ai/core/effect/app-node-builder"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(AppNodeBuilder.build(Global.node)))
}
