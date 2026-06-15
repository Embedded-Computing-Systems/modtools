import { describe, expect, test } from "bun:test"
import { parsePluginSpecifier } from "../../src/plugin/shared"

describe("parsePluginSpecifier", () => {
  test("parses standard npm package without version", () => {
    expect(parsePluginSpecifier("acme")).toEqual({
      pkg: "acme",
      version: "latest",
    })
  })

  test("parses standard npm package with version", () => {
    expect(parsePluginSpecifier("acme@1.0.0")).toEqual({
      pkg: "acme",
      version: "1.0.0",
    })
  })

  test("parses scoped npm package without version", () => {
    expect(parsePluginSpecifier("@MOD/acme")).toEqual({
      pkg: "@MOD/acme",
      version: "latest",
    })
  })

  test("parses scoped npm package with version", () => {
    expect(parsePluginSpecifier("@MOD/acme@1.0.0")).toEqual({
      pkg: "@MOD/acme",
      version: "1.0.0",
    })
  })

  test("parses package with git+https url", () => {
    expect(parsePluginSpecifier("acme@git+https://github.com/MOD/acme.git")).toEqual({
      pkg: "acme",
      version: "git+https://github.com/MOD/acme.git",
    })
  })

  test("parses scoped package with git+https url", () => {
    expect(parsePluginSpecifier("@MOD/acme@git+https://github.com/MOD/acme.git")).toEqual({
      pkg: "@MOD/acme",
      version: "git+https://github.com/MOD/acme.git",
    })
  })

  test("parses package with git+ssh url containing another @", () => {
    expect(parsePluginSpecifier("acme@git+ssh://git@github.com/MOD/acme.git")).toEqual({
      pkg: "acme",
      version: "git+ssh://git@github.com/MOD/acme.git",
    })
  })

  test("parses scoped package with git+ssh url containing another @", () => {
    expect(parsePluginSpecifier("@MOD/acme@git+ssh://git@github.com/MOD/acme.git")).toEqual({
      pkg: "@MOD/acme",
      version: "git+ssh://git@github.com/MOD/acme.git",
    })
  })

  test("parses unaliased git+ssh url", () => {
    expect(parsePluginSpecifier("git+ssh://git@github.com/MOD/acme.git")).toEqual({
      pkg: "git+ssh://git@github.com/MOD/acme.git",
      version: "",
    })
  })

  test("parses npm alias using the alias name", () => {
    expect(parsePluginSpecifier("acme@npm:@MOD/acme@1.0.0")).toEqual({
      pkg: "acme",
      version: "npm:@MOD/acme@1.0.0",
    })
  })

  test("parses bare npm protocol specifier using the target package", () => {
    expect(parsePluginSpecifier("npm:@MOD/acme@1.0.0")).toEqual({
      pkg: "@MOD/acme",
      version: "1.0.0",
    })
  })

  test("parses unversioned npm protocol specifier", () => {
    expect(parsePluginSpecifier("npm:@MOD/acme")).toEqual({
      pkg: "@MOD/acme",
      version: "latest",
    })
  })
})
