import { expect, test } from "bun:test"
import type { Configuration } from "electron-builder"

const legacyDesktopEntry = "resources/linux/modtools-desktop.desktop"

const channels = [
  { channel: "dev", appId: "ai.mod.desktop.dev" },
  { channel: "beta", appId: "ai.mod.desktop.beta" },
  { channel: "prod", appId: "ai.mod.desktop" },
] as const

for (const channel of channels) {
  test(`uses one Linux desktop identity for ${channel.channel}`, async () => {
    const previous = process.env.MODTOOLS_CHANNEL
    process.env.MODTOOLS_CHANNEL = channel.channel

    const module = await import(`./electron-builder.config.ts?channel=${channel.channel}`)
    const config = module.default as Configuration

    if (previous === undefined) delete process.env.MODTOOLS_CHANNEL
    else process.env.MODTOOLS_CHANNEL = previous

    expect(config.appId).toBe(channel.appId)
    expect(config.extraMetadata?.desktopName).toBe(`${channel.appId}.desktop`)
    expect(config.linux?.executableName).toBe(channel.appId)
    expect(config.linux?.desktop?.entry?.StartupWMClass).toBe(channel.appId)
    expect(config.deb?.fpm).toContainEqual(expect.stringContaining(`/usr/share/metainfo/${channel.appId}.metainfo.xml`))
    expect(config.rpm?.fpm).toContainEqual(expect.stringContaining(`/usr/share/metainfo/${channel.appId}.metainfo.xml`))
  })
}

test("keeps a hidden prod launcher for old Linux pins", async () => {
  const previous = process.env.MODTOOLS_CHANNEL
  process.env.MODTOOLS_CHANNEL = "prod"

  const module = await import("./electron-builder.config.ts?compat=prod")
  const config = module.default as Configuration

  if (previous === undefined) delete process.env.MODTOOLS_CHANNEL
  else process.env.MODTOOLS_CHANNEL = previous

  expect(
    config.deb?.fpm?.some((entry) =>
      entry.endsWith("mod-desktop.desktop=/usr/share/applications/mod-desktop.desktop"),
    ),
  ).toBe(true)
  expect(
    config.rpm?.fpm?.some((entry) =>
      entry.endsWith("mod-desktop.desktop=/usr/share/applications/mod-desktop.desktop"),
    ),
  ).toBe(true)

  const desktop = await Bun.file(legacyDesktopEntry).text()
  expect(desktop).toContain("Exec=/opt/MOD/ai.mod.desktop %U")
  expect(desktop).toContain("Icon=ai.mod.desktop")
  expect(desktop).toContain("StartupWMClass=ai.mod.desktop")
  expect(desktop).toContain("NoDisplay=true")
})

test("bundles the CLI outside the dev app archive", async () => {
  const previous = process.env.MODTOOLS_CHANNEL
  process.env.MODTOOLS_CHANNEL = "dev"
  const module = await import("./electron-builder.config.ts?cli-resource")
  const config = module.default as Configuration
  if (previous === undefined) delete process.env.MODTOOLS_CHANNEL
  else process.env.MODTOOLS_CHANNEL = previous

  expect(config.files).toContain("!resources/mod-cli*")
  expect(config.extraResources).toContainEqual({
    from: "resources/",
    to: "",
    filter: ["mod-cli*"],
  })
})

for (const channel of ["beta", "prod"] as const) {
  test(`does not bundle the CLI in ${channel} builds`, async () => {
    const previous = process.env.MODTOOLS_CHANNEL
    process.env.MODTOOLS_CHANNEL = channel
    const module = await import(`./electron-builder.config.ts?no-cli-resource=${channel}`)
    const config = module.default as Configuration
    if (previous === undefined) delete process.env.MODTOOLS_CHANNEL
    else process.env.MODTOOLS_CHANNEL = previous

    expect(config.extraResources).not.toContainEqual({
      from: "resources/",
      to: "",
      filter: ["mod-cli*"],
    })
  })
}
