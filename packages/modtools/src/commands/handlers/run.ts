import { Effect, Option } from "effect"
import { Commands } from "../commands"
import { Runtime } from "../../framework/runtime"
import { ServerConnection } from "../../services/server-connection"

export default Runtime.handler(Commands.commands.run, (input) =>
  Effect.gen(function* () {
    const { runNonInteractive } = yield* Effect.promise(() => import("../../run/run"))
    const separator = process.argv.indexOf("--", 2)
    const server = yield* ServerConnection.resolve({
      server: Option.getOrUndefined(input.server),
      standalone: input.standalone,
    })
    yield* Effect.promise(() =>
      runNonInteractive({
        server,
        message: [...input.message, ...(separator === -1 ? [] : process.argv.slice(separator + 1))],
        continue: input.continue,
        session: Option.getOrUndefined(input.session),
        fork: input.fork,
        model: withVariant(Option.getOrUndefined(input.model), Option.getOrUndefined(input.variant)),
        agent: Option.getOrUndefined(input.agent),
        format: input.format,
        file: [...input.file],
        title: Option.getOrUndefined(input.title),
        thinking: input.thinking,
        auto: input.auto || input.yolo || input.dangerouslySkipPermissions,
      }),
    )
  }),
)

// A separate --variant is kept for v1 command lines; an explicit #variant in the model wins.
function withVariant(model: string | undefined, variant: string | undefined) {
  if (!model || !variant || model.includes("#")) return model
  return `${model}#${variant}`
}
