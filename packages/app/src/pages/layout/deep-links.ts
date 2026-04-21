export const deepLinkEvent = "mod:deep-link"

function parseUrl(input: string) {
  if (!input.startsWith("mod://")) return
  try {
    return new URL(input)
  } catch {
    return
  }
}

export const parseDeepLink = (input: string) => {
  const url = parseUrl(input)
  if (!url) return
  if (url.hostname !== "open-project") return
  const directory = url.searchParams.get("directory")
  if (!directory) return
  return directory
}

export const parseNewSessionDeepLink = (input: string) => {
  const url = parseUrl(input)
  if (!url) return
  if (url.hostname !== "new-session") return
  const directory = url.searchParams.get("directory")
  if (!directory) return
  const prompt = url.searchParams.get("prompt") || undefined
  if (!prompt) return { directory }
  return { directory, prompt }
}

export const parseAskDeepLink = (input: string) => {
  const url = parseUrl(input)
  if (!url) return
  if (url.hostname !== "ask") return
  const prompt = url.searchParams.get("q")
  if (!prompt) return
  return { prompt }
}

export const collectOpenProjectDeepLinks = (urls: string[]) =>
  urls.map(parseDeepLink).filter((directory): directory is string => !!directory)

export const collectNewSessionDeepLinks = (urls: string[]) =>
  urls.map(parseNewSessionDeepLink).filter((link): link is { directory: string; prompt?: string } => !!link)

export const collectAskDeepLinks = (urls: string[]) =>
  urls.map(parseAskDeepLink).filter((link): link is { prompt: string } => !!link)

type ModWindow = Window & {
  __MOD__?: {
    deepLinks?: string[]
  }
}

export function drainPendingDeepLinks(target = window as any as ModWindow) {
  const pending = target.__MOD__?.deepLinks ?? []

  if (target.__MOD__) target.__MOD__.deepLinks = []
  return pending
}
