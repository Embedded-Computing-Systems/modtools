import { Option, Schema } from "effect"

declare const MODTOOLS_VERSION: string
declare const MODTOOLS_CHANNEL: string
declare const MODTOOLS_ARTIFACT: string
declare const MODTOOLS_RELEASE_HIGHLIGHTS: string

const version = typeof MODTOOLS_VERSION === "string" ? MODTOOLS_VERSION : "local"
const channel = typeof MODTOOLS_CHANNEL === "string" ? MODTOOLS_CHANNEL : "local"
const artifact = typeof MODTOOLS_ARTIFACT === "string" ? MODTOOLS_ARTIFACT : "cli"
// Stable release builds embed the release notes' Highlights; every other build has none.
const highlights =
  typeof MODTOOLS_RELEASE_HIGHLIGHTS === "string"
    ? Option.getOrElse(
        Schema.decodeUnknownOption(
          Schema.fromJsonString(Schema.Array(Schema.Struct({ title: Schema.String, body: Schema.String }))),
        )(MODTOOLS_RELEASE_HIGHLIGHTS),
        () => [],
      )
    : []

export {
  version as MODTOOLS_VERSION,
  channel as MODTOOLS_CHANNEL,
  artifact as MODTOOLS_ARTIFACT,
  highlights as MODTOOLS_HIGHLIGHTS,
}
export const MODTOOLS_LOCAL = channel === "local"
