// Handles the deep links the desktop main process forwards to the renderer.
//
// The desktop already re-emits every received URL as a `mod:deep-link` event and keeps
// them in `window.__MOD__.deepLinks` until something consumes them; nothing in the app
// read either. The result was that `mod://new-session`, which the Ask MOD Spotlight
// helper opens, navigated nowhere. This module is the consumer: it parses the grammar,
// turns a new-session link into a prefilled draft tab, and submits the prompt when the
// link asks for it.

export const deepLinkEvent = "mod:deep-link"

const parseUrl = (input: string) => {
  if (!input.startsWith("mod://")) return
  if (typeof URL.canParse === "function" && !URL.canParse(input)) return
  try {
    return new URL(input)
  } catch {
    return
  }
}

export const parseOpenProjectDeepLink = (input: string) => {
  const url = parseUrl(input)
  if (!url) return
  if (url.hostname !== "open-project") return
  const directory = url.searchParams.get("directory")
  if (!directory) return
  return directory
}

export type NewSessionLink = {
  directory: string
  prompt?: string
  /** True for shortcut-originated links, which expect the prompt to be sent. */
  submit: boolean
}

export const parseNewSessionDeepLink = (input: string): NewSessionLink | undefined => {
  const url = parseUrl(input)
  if (!url) return
  if (url.hostname !== "new-session") return
  const directory = url.searchParams.get("directory")
  if (!directory) return
  const prompt = url.searchParams.get("prompt") || undefined
  const submit = url.searchParams.get("source") === "shortcut" || url.searchParams.get("submit") === "1"
  return { directory, prompt, submit }
}

export const collectOpenProjectDeepLinks = (urls: string[]) =>
  urls.flatMap((url) => {
    const directory = parseOpenProjectDeepLink(url)
    return directory ? [directory] : []
  })

export const collectNewSessionDeepLinks = (urls: string[]) =>
  urls.flatMap((url) => {
    const link = parseNewSessionDeepLink(url)
    return link ? [link] : []
  })

type DeepLinkWindow = Window & {
  __MOD__?: {
    deepLinks?: string[]
  }
}

/** Take the queued links and clear the queue, so a reload cannot replay them. */
export const drainPendingDeepLinks = (target: DeepLinkWindow) => {
  const pending = target.__MOD__?.deepLinks ?? []
  if (pending.length === 0) return []
  if (target.__MOD__) target.__MOD__.deepLinks = []
  return pending
}

/**
 * Press Enter in the composer once the prefilled text has rendered.
 *
 * The submit pipeline belongs to the mounted composer, which does not expose it to the
 * shell, so the editor's own Enter handling is the seam available from here. Links that
 * do not ask for submission simply stay prefilled.
 */
export const submitPromptWhenReady = (text: string) => {
  const marker = text.slice(0, 40)
  const started = Date.now()
  const tick = () => {
    const editor = document.querySelector<HTMLElement>('[contenteditable="true"]')
    if (editor && (editor.textContent ?? "").includes(marker)) {
      editor.focus()
      editor.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true, cancelable: true }),
      )
      return
    }
    if (Date.now() - started < 5000) setTimeout(tick, 100)
  }
  setTimeout(tick, 150)
}
