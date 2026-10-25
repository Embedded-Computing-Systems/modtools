import { useCommand } from "@/shell/commands/command"
import { useLayout } from "@/shell/state/layout"
import { useLanguage } from "@/runtime/i18n/language"
import { serverName } from "@/runtime/server/registry"
import { displayName } from "@modtools-ai/ui/project-avatar"
import { sessionLabel } from "@/session/title"
import { makeEventListener } from "@solid-primitives/event-listener"
import { createMemo, onCleanup, onMount } from "solid-js"
import { createStore } from "solid-js/store"
import type { HomeController } from "../model"
import { homeSessionSearchKey, type HomeSessionRecord, type HomeSessionsController } from "./controller"
import { looksLikeSessionID } from "@/session/search"

type HomeSessionSearchSource = Pick<HomeSessionsController, "data" | "session">

export function createHomeSessionSearchController(home: HomeController, sessions: HomeSessionSearchSource) {
  const command = useCommand()
  const language = useLanguage()
  const layout = useLayout()

  const [state, setState] = createStore<{
    value: string
    focused: boolean
    highlighted: string
    exact: HomeSessionRecord | undefined
    lookingUp: boolean
    remote: HomeSessionRecord[]
    searching: boolean
  }>({
    value: "",
    focused: false,
    highlighted: "",
    exact: undefined,
    lookingUp: false,
    remote: [],
    searching: false,
  })

  let lookup = 0
  let remote: AbortController | undefined
  let root: HTMLDivElement | undefined
  let input: HTMLInputElement | undefined
  let list: HTMLDivElement | undefined
  const query = createMemo(() => state.value.trim())

  const results = createMemo(() => {
    const value = query().toLowerCase()

    if (!value) return []

    const matches = (record: HomeSessionRecord) =>
      `${sessionLabel(record.session)} ${record.session.title ?? ""} ${record.projectName} ${record.session.location.directory}`
        .toLowerCase()
        .includes(value)
    const local = sessions.data.searchRecords().filter(matches)
    const known = new Set(local.map((record) => record.session.id))
    // Results from the previous query stay visible until the next response, so they pass the same filter.
    const records = [...local, ...state.remote.filter((record) => !known.has(record.session.id) && matches(record))]

    if (!state.exact || records.some((record) => record.session.id === state.exact?.session.id)) return records

    return [state.exact, ...records]
  })

  const active = createMemo(() => {
    const records = results()

    if (records.some((record) => homeSessionSearchKey(record) === state.highlighted)) return state.highlighted

    return records[0] ? homeSessionSearchKey(records[0]) : ""
  })

  const open = createMemo(() => state.focused && query().length > 0)

  const placeholder = createMemo(() => {
    const project = home.project.selected()

    if (project) return language.t("home.sessions.search.placeholder.scoped", { scope: displayName(project) })

    if (home.server.list().length > 1) {
      const conn = home.server.focused()

      if (conn) return language.t("home.sessions.search.placeholder.scoped", { scope: serverName(conn) })
    }

    return language.t("home.sessions.search.placeholder")
  })

  onCleanup(
    makeEventListener(document, "pointerdown", (event) => {
      if (!open()) return
      const target = event.target

      if (!(target instanceof Node) || root?.contains(target)) return
      close()
    }),
  )
  onCleanup(() => {
    lookup++
    remote?.abort()
  })
  onMount(() => {
    if (layout.home.searchFocus.take()) focus()
  })

  command.register("home.search", () => [
    {
      id: "home.sessions.search.focus",
      title: placeholder(),
      keybind: "mod+f",
      hidden: true,
      onSelect: focus,
    },
  ])

  function focus() {
    input?.focus()
    setState("focused", true)
  }

  function close() {
    lookup++
    remote?.abort()
    setState({ value: "", focused: false, exact: undefined, lookingUp: false, remote: [], searching: false })
  }

  function update(value: string) {
    const current = ++lookup
    const sessionID = value.trim()
    setState({ value, highlighted: "", exact: undefined, lookingUp: false })
    searchServer(sessionID)

    if (!looksLikeSessionID(sessionID)) return
    setState("lookingUp", true)
    void sessions.session.lookup(sessionID).then(
      (record) => {
        if (current !== lookup) return
        setState({ exact: record, lookingUp: false })
      },
      () => {
        if (current !== lookup) return
        setState("lookingUp", false)
      },
    )
  }

  // Typed searches wait for a pause before asking the server; local matches show at once.
  function searchServer(text: string) {
    remote?.abort()
    const controller = new AbortController()
    remote = controller

    if (!text) {
      setState({ remote: [], searching: false })
      return
    }
    setState("searching", true)
    const timer = setTimeout(() => {
      void sessions.session.search(text, controller.signal).then(
        (records) => {
          if (controller.signal.aborted) return
          setState({ remote: records, searching: false })
        },
        () => {
          if (controller.signal.aborted) return
          setState({ remote: [], searching: false })
        },
      )
    }, 150)
    controller.signal.addEventListener("abort", () => clearTimeout(timer), { once: true })
  }

  function select(record: HomeSessionRecord, options?: { background?: boolean }) {
    sessions.session.open(record.session, options)

    if (!options?.background) close()
  }

  return {
    query: {
      value: () => state.value,
      placeholder,
      open,
      focus,
      input: update,
      close,
    },
    result: {
      loading: () => sessions.data.loading() || state.lookingUp || (state.searching && results().length === 0),
      list: results,
      active,
      noResultsLabel: () => language.t("home.sessions.search.noResults", { query: query() }),
      highlight: (record: HomeSessionRecord) => setState("highlighted", homeSessionSearchKey(record)),
      move: (delta: number) => {
        const records = results()

        if (records.length === 0) return
        const index = records.findIndex((record) => homeSessionSearchKey(record) === active())
        const next = ((index === -1 ? 0 : index) + delta + records.length) % records.length
        setState("highlighted", homeSessionSearchKey(records[next]))
        list?.querySelector<HTMLElement>(`[data-key="${state.highlighted}"]`)?.scrollIntoView({ block: "nearest" })
      },
      select,
      selectActive: () => {
        const record = results().find((item) => homeSessionSearchKey(item) === active())

        if (record) select(record)
      },
    },
    element: {
      setRoot: (element: HTMLDivElement) => (root = element),
      setInput: (element: HTMLInputElement) => (input = element),
      setList: (element: HTMLDivElement) => (list = element),
    },
  }
}

export type HomeSessionSearchController = ReturnType<typeof createHomeSessionSearchController>
