import { createEffect, onMount, Suspense, type ParentProps } from "solid-js"
import { createStore } from "solid-js/store"
import { makeEventListener } from "@solid-primitives/event-listener"
import { DebugBar } from "@/components/debug-bar"
import { TabsInfoPopup } from "@/components/help-button"
import { Titlebar, type TitlebarUpdate } from "@/components/titlebar"
import { usePlatform } from "@/context/platform"
import { useServer } from "@/context/server"
import { useTabs } from "@/context/tabs"
import { collectNewSessionDeepLinks, deepLinkEvent, drainPendingDeepLinks } from "@/pages/layout/deep-links"
import { setV2Toast, ToastRegion } from "@/utils/toast"

export default function NewLayout(props: ParentProps) {
  const platform = usePlatform()
  const server = useServer()
  const tabs = useTabs()
  const [state, setState] = createStore({ debugTools: true })

  createEffect(() => setV2Toast(true))

  // Deep links were only handled by the legacy layout, which never mounts under
  // the new design, so mod://new-session (Ask MOD, Spotlight) silently did
  // nothing. A new-session link becomes a prefilled draft tab here.
  const handleDeepLinks = (urls: string[]) => {
    if (!server.isLocal()) return
    for (const link of collectNewSessionDeepLinks(urls)) {
      void tabs.newDraft({ server: server.key, directory: link.directory }, link.prompt)
    }
  }

  onMount(() => {
    const handler = (event: Event) => {
      const urls = (event as CustomEvent<{ urls: string[] }>).detail?.urls ?? []
      if (urls.length) handleDeepLinks(urls)
    }
    handleDeepLinks(drainPendingDeepLinks(window))
    makeEventListener(window, deepLinkEvent, handler as EventListener)
  })

  const update: TitlebarUpdate = {
    version: () => {
      const state = platform.updater?.state()
      if (state?.status !== "ready") return
      return state.version
    },
    installing: () => platform.updater?.state().status === "installing",
    install: () => void platform.updater?.install(),
  }

  return (
    <div
      class="relative bg-v2-background-bg-deep flex-1 min-h-0 min-w-0 flex flex-col select-none [&_input]:select-text [&_textarea]:select-text [&_[contenteditable]]:select-text"
      style={{
        "padding-top": "env(safe-area-inset-top, 0px)",
        "padding-bottom": "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <Titlebar
        update={update}
        debugTools={
          import.meta.env.DEV
            ? { visible: state.debugTools, toggle: () => setState("debugTools", (value) => !value) }
            : undefined
        }
      />
      <main class="flex-1 min-h-0 min-w-0 overflow-x-hidden flex flex-col items-start contain-strict">
        <Suspense>{props.children}</Suspense>
      </main>
      {import.meta.env.DEV && state.debugTools && <DebugBar inline />}
      <TabsInfoPopup />
      <ToastRegion v2 />
    </div>
  )
}
