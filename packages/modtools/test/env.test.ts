import { expect, test } from "bun:test"
import { Env } from "../src/env"

test("session environment omits server credentials", () => {
  const previousPassword = process.env.MODTOOLS_PASSWORD
  const previousLegacyPassword = process.env.MODTOOLS_SERVER_PASSWORD
  const previousValue = process.env.MODTOOLS_SESSION_ENV_TEST
  process.env.MODTOOLS_PASSWORD = "password"
  process.env.MODTOOLS_SERVER_PASSWORD = "legacy"
  process.env.MODTOOLS_SESSION_ENV_TEST = "included"

  const environment = Env.session()

  if (previousPassword === undefined) delete process.env.MODTOOLS_PASSWORD
  else process.env.MODTOOLS_PASSWORD = previousPassword
  if (previousLegacyPassword === undefined) delete process.env.MODTOOLS_SERVER_PASSWORD
  else process.env.MODTOOLS_SERVER_PASSWORD = previousLegacyPassword
  if (previousValue === undefined) delete process.env.MODTOOLS_SESSION_ENV_TEST
  else process.env.MODTOOLS_SESSION_ENV_TEST = previousValue

  expect(environment.MODTOOLS_PASSWORD).toBeUndefined()
  expect(environment.MODTOOLS_SERVER_PASSWORD).toBeUndefined()
  expect(environment.MODTOOLS_SESSION_ENV_TEST).toBe("included")
})
