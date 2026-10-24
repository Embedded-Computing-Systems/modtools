import { Route, useParams } from "@solidjs/router"
import { createMemo, lazy, onMount, Show, Suspense, type ParentProps } from "solid-js"
import { makeEventListener } from "@solid-primitives/event-listener"
import { Home } from "@/home/route"
import {
  collectNewSessionDeepLinks,
  collectOpenProjectDeepLinks,
  deepLinkEvent,
  drainPendingDeepLinks,
  submitPromptWhenReady,
} from "@/shell/deep-links"
import { useTabs } from "@/shell/tabs/tabs"
import { ServerProvider } from "@/runtime/server/current"
import { useGlobal } from "@/runtime/server/runtime"
import { ServerConnection, useServers } from "@/runtime/server/registry"
import { SessionPanelFrame, SessionRouteFrame } from "@/session/session-frame"
import { LayoutProvider } from "@/shell/state/layout"
import { SettingsSurfaceProvider } from "@/settings/surface"
import Shell from "@/shell/shell"
import { requireServerKey } from "./session"
import { ExtensionAttachment } from "@/runtime/extension/root"

export const File = lazy(() => import("@modtools-ai/session-ui/file").then((module) => ({ default: module.File })))

const loadSessionRoute = () => Promise.all([import("@/session/route"), File.preload()]).then(([module]) => module)

const DraftRoute = lazy(() => import("@/new-session/route").then((module) => ({ default: module.DraftRoute })))

const SettingsScreen = lazy(() => import("@/settings/shell").then((module) => ({ default: module.SettingsScreen })))

const ConnectServerScreen = lazy(() =>
  import("@/servers/connect/screen").then((module) => ({ default: module.ConnectServerScreen })),
)

const TargetSessionRouteContent = lazy(() =>
  loadSessionRoute().then((module) => ({ default: module.TargetSessionRouteContent })),
)

export function preloadRoute(url: string) {
  const pathname = url.split(/[?#]/, 1)[0]

  if (pathname === "/new-session") return DraftRoute.preload().then(() => undefined)

  if (pathname === "/settings") return SettingsScreen.preload().then(() => undefined)

  if (/^\/server\/[^/]+\/session\/[^/]+$/.test(pathname))
    return TargetSessionRouteContent.preload().then(() => undefined)

  return Promise.resolve()
}

export function AppRoutes() {
  return (
    <Route component={AppLayout}>
      <Route path="/" component={Home} />
      <Route path="/settings" component={SettingsScreen} />
      <Route
        path="/server/:serverKey/session/:id"
        component={() => (
          <SessionRouteFrame>
            <Suspense
              fallback={
                <div class="flex min-h-0 flex-1 px-[var(--shell-inline-inset,8px)] pb-[var(--shell-bottom-inset,8px)] pt-[var(--shell-top-inset,8px)]">
                  <SessionPanelFrame raised />
                </div>
              }
            >
              <TargetServerRoute>
                <TargetSessionRouteContent />
              </TargetServerRoute>
            </Suspense>
          </SessionRouteFrame>
        )}
      />
      <Route path="/new-session" component={DraftRoute} />
    </Route>
  )
}

function TargetServerRoute(props: ParentProps) {
  const params = useParams<{ serverKey: string }>()
  const global = useGlobal()

  const connection = createMemo(() =>
    global.servers.list().find((item) => ServerConnection.key(item) === requireServerKey(params.serverKey)),
  )

  return (
    <Show when={connection()} keyed>
      {(connection) => <ServerProvider conn={connection}>{props.children}</ServerProvider>}
    </Show>
  )
}

function AppLayout(props: ParentProps) {
  const servers = useServers()
  const global = useGlobal()
  const tabs = useTabs()

  // Deep links (Ask MOD's mod://new-session among them) arrive as window events and, until
  // something consumes them, sit in window.__MOD__.deepLinks. The queue is drained once on
  // mount and every later link handled as it arrives, so a reload cannot replay old links.
  const handleDeepLinks = (urls: string[]) => {
    if (urls.length === 0) return
    const connection = servers.list[0]
    if (!connection) return
    const ctx = global.ensureServerCtx(connection)
    for (const directory of collectOpenProjectDeepLinks(urls)) {
      ctx.projects.open(directory)
      ctx.projects.touch(directory)
    }
    for (const link of collectNewSessionDeepLinks(urls)) {
      ctx.projects.open(link.directory)
      ctx.projects.touch(link.directory)
      void tabs.newDraft({ server: ServerConnection.key(connection), directory: link.directory }, link.prompt)
      if (link.submit && link.prompt) submitPromptWhenReady(link.prompt)
    }
  }

  onMount(() => {
    const handler = (event: Event) => {
      const urls = (event as CustomEvent<{ urls: string[] }>).detail?.urls ?? []
      handleDeepLinks(urls)
    }
    handleDeepLinks(drainPendingDeepLinks(window))
    makeEventListener(window, deepLinkEvent, handler as EventListener)
  })

  // A lone server that rejects our credentials (e.g. the web app before pairing) has nothing else to show.
  const signedOut = () => {
    const only = servers.list.length === 1 ? servers.list[0] : undefined

    if (only?.type !== "http") return

    return global.servers.health[ServerConnection.key(only)]?.unauthorized ? only : undefined
  }

  return (
    <Show when={servers.list.length > 0 && !signedOut()} fallback={<ConnectServerScreen url={signedOut()?.http.url} />}>
      <LayoutProvider>
        <SettingsSurfaceProvider>
          <ExtensionAttachment>
            <Shell>{props.children}</Shell>
          </ExtensionAttachment>
        </SettingsSurfaceProvider>
      </LayoutProvider>
    </Show>
  )
}
