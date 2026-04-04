import { beforeEach, describe, expect, test } from "bun:test"

const src = await Bun.file(new URL("../public/mod-theme-preload.js", import.meta.url)).text()

const run = () => Function(src)()

beforeEach(() => {
  document.head.innerHTML = ""
  document.documentElement.removeAttribute("data-theme")
  document.documentElement.removeAttribute("data-color-scheme")
  localStorage.clear()
  Object.defineProperty(window, "matchMedia", {
    value: () =>
      ({
        matches: false,
      }) as MediaQueryList,
    configurable: true,
  })
})

describe("theme preload", () => {
  test("migrates legacy oc-1 to mod-2 before mount", () => {
    localStorage.setItem("modtools-theme-id", "oc-1")
    localStorage.setItem("modtools-theme-css-light", "--background-base:#fff;")
    localStorage.setItem("modtools-theme-css-dark", "--background-base:#000;")

    run()

    expect(document.documentElement.dataset.theme).toBe("mod-2")
    expect(document.documentElement.dataset.colorScheme).toBe("light")
    expect(localStorage.getItem("modtools-theme-id")).toBe("mod-2")
    expect(localStorage.getItem("modtools-theme-css-light")).toBeNull()
    expect(localStorage.getItem("modtools-theme-css-dark")).toBeNull()
    expect(document.getElementById("mod-theme-preload")).toBeNull()
  })

  test("keeps cached css for non-default themes", () => {
    localStorage.setItem("modtools-theme-id", "nightowl")
    localStorage.setItem("modtools-theme-css-light", "--background-base:#fff;")

    run()

    expect(document.documentElement.dataset.theme).toBe("nightowl")
    expect(document.getElementById("mod-theme-preload")?.textContent).toContain("--background-base:#fff;")
  })
})
