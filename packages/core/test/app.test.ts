import { expect, test } from "bun:test"
import { App } from "@modtools-ai/core/app"

test("formats app metadata as a user agent", () => {
  expect(App.useragent(App.make({ name: "sdk", version: "1.2.3", channel: "beta" }))).toBe("mod/beta/1.2.3/sdk")
})
