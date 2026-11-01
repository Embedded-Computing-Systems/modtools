import { expect, test } from "bun:test"
import { selectTheme, selectThemeMode, supportsThemeMode, themeModes } from "@modtools-ai/theme/tui"
import { getModTheme } from "../../../src/theme"

test("selects complete light and dark themes independently", () => {
  const light = selectTheme(getModTheme(), "light")
  const dark = selectTheme(getModTheme(), "dark")
  expect(selectTheme(getModTheme())).toEqual(light)
  expect(light.hue).toEqual(getModTheme().light.hue)
  expect(dark.text).toEqual(getModTheme().base.text)
  expect(dark.hue).toEqual(getModTheme().dark.hue)
  expect(selectThemeMode(getModTheme(), "dark")).toEqual({ theme: dark, mode: "dark" })
})

test("selects the available mode when the requested mode is missing", () => {
  const lightOnly = { base: getModTheme().base, light: getModTheme().light } as const
  const darkOnly = { base: getModTheme().base, dark: getModTheme().dark } as const

  expect(themeModes(lightOnly)).toEqual(["light"])
  expect(themeModes(darkOnly)).toEqual(["dark"])
  expect(supportsThemeMode(lightOnly, "light")).toBeTrue()
  expect(supportsThemeMode(lightOnly, "dark")).toBeFalse()
  expect(selectThemeMode(lightOnly, "dark")).toEqual({ theme: selectTheme(getModTheme(), "light"), mode: "light" })
  expect(selectThemeMode(darkOnly, "light")).toEqual({ theme: selectTheme(getModTheme(), "dark"), mode: "dark" })
})
