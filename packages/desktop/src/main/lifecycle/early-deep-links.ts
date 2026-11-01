import { app } from "electron"

// A link that launches the app arrives before the lifecycle layer listens for it: macOS
// delivers open-url during startup, ahead of ready and of the main bundle, and Windows and
// Linux pass it on the command line. Such links are held here until the layer takes them,
// so a cold launch from Ask MOD keeps its prompt.
const early: string[] = []

const hold = (event: Electron.Event, url: string) => {
  event.preventDefault()
  early.push(url)
}

export function captureEarlyDeepLinks() {
  early.push(...process.argv.filter((arg) => arg.startsWith("mod://")))
  app.on("open-url", hold)
}

/** Stop holding links and hand over the ones received so far. */
export function takeEarlyDeepLinks() {
  app.off("open-url", hold)
  return early.splice(0)
}
