import path from "path"
import { exec } from "child_process"
import * as prompts from "@clack/prompts"
import { map, pipe, sortBy, values } from "remeda"
import { Octokit } from "@octokit/rest"
import { graphql } from "@octokit/graphql"
import * as core from "@actions/core"
import * as github from "@actions/github"
import type { Context } from "@actions/github/lib/context"
import type {
  IssueCommentEvent,
  IssuesEvent,
  PullRequestReviewCommentEvent,
  WorkflowDispatchEvent,
  WorkflowRunEvent,
  PullRequestEvent,
} from "@octokit/webhooks-types"
import { UI } from "../ui"
import { cmd } from "./cmd"
import { ModelsDev } from "../../provider"
import { Instance } from "@/project/instance"
import { bootstrap } from "../bootstrap"
import { Session } from "../../session/session"
import { Identifier } from "@modtools-ai/shared/util/identifier"
import { Provider } from "../../provider"
import { ProviderID, ModelID } from "../../provider/schema"
import { MessageID, PartID } from "../../session/schema"
import { Bus } from "../../bus"
import { MessageV2 } from "../../session/message-v2"
import { SessionPrompt } from "@/session/prompt"
import { $ } from "bun"
import { SessionShare } from "../../share/session"
import { AppRuntime } from "@/effect/app-runtime"
import { InstallationVersion } from "../../installation/version"
import { Process } from "../../util"
import fs from "fs/promises"

type GitHubAuthor = {
  login: string
  name?: string
}

type GitHubComment = {
  id: string
  databaseId: string
  body: string
  author: GitHubAuthor
  createdAt: string
}

type GitHubReviewComment = GitHubComment & {
  path: string
  line: number | null
}

type GitHubCommit = {
  oid: string
  message: string
  author: {
    name: string
    email: string
  }
}

type GitHubFile = {
  path: string
  additions: number
  deletions: number
  changeType: string
}

type GitHubReview = {
  id: string
  databaseId: string
  author: GitHubAuthor
  body: string
  state: string
  submittedAt: string
  comments: {
    nodes: GitHubReviewComment[]
  }
}

type GitHubPullRequest = {
  title: string
  body: string
  author: GitHubAuthor
  baseRefName: string
  headRefName: string
  headRefOid: string
  createdAt: string
  additions: number
  deletions: number
  state: string
  baseRepository: {
    nameWithOwner: string
  }
  headRepository: {
    nameWithOwner: string
  }
  commits: {
    totalCount: number
    nodes: Array<{
      commit: GitHubCommit
    }>
  }
  files: {
    nodes: GitHubFile[]
  }
  comments: {
    nodes: GitHubComment[]
  }
  reviews: {
    nodes: GitHubReview[]
  }
}

type GitHubIssue = {
  title: string
  body: string
  author: GitHubAuthor
  createdAt: string
  state: string
  comments: {
    nodes: GitHubComment[]
  }
}

type PullRequestQueryResponse = {
  repository: {
    pullRequest: GitHubPullRequest
  }
}

type IssueQueryResponse = {
  repository: {
    issue: GitHubIssue
  }
}

const AGENT_USERNAME = "mod-agent[bot]"
const AGENT_REACTION = "eyes"
const WORKFLOW_FILE = ".github/workflows/mod.yml"

const USER_EVENTS = ["issue_comment", "pull_request_review_comment", "issues", "pull_request"] as const
const REPO_EVENTS = ["schedule", "workflow_dispatch"] as const
const SUPPORTED_EVENTS = [...USER_EVENTS, ...REPO_EVENTS] as const

type UserEvent = (typeof USER_EVENTS)[number]
type RepoEvent = (typeof REPO_EVENTS)[number]

export function parseGitHubRemote(url: string): { owner: string; repo: string } | null {
  const match = url.match(/^(?:(?:https?|ssh):\/\/)?(?:git@)?github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/)
  if (!match) return null
  return { owner: match[1], repo: match[2] }
}

export function extractResponseText(parts: MessageV2.Part[]): string | null {
  const textPart = parts.findLast((p) => p.type === "text")
  if (textPart) return textPart.text
  if (parts.length > 0) return null
  throw new Error("Failed to parse response: no parts returned")
}

export function formatPromptTooLargeError(files: { filename: string; content: string }[]) {
  const fileList = files
    .map((f) => {
      const originalSize = Math.round((f.content.length * 3) / 4 / 1024)
      return ` - ${f.filename} (${originalSize} KB)`
    })
    .join("\n")

  return [
    "PROMPT_TOO_LARGE: The prompt exceeds the model's context limit.",
    files.length > 0 ? `\nFiles in prompt:\n${fileList}` : "",
  ]
    .filter(Boolean)
    .join("\n")
}

export const GithubCommand = cmd({
  command: "github",
  describe: "manage GitHub agent",
  builder: (yargs) => yargs.command(GithubInstallCommand).command(GithubRunCommand).demandCommand(),
  async handler() {},
})

export const GithubInstallCommand = cmd({
  command: "install",
  describe: "install the GitHub agent",
  async handler() {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        UI.empty()
        prompts.intro("Install GitHub agent")
        const app = await getAppInfo()
        await installGitHubApp()

        const providers = await AppRuntime.runPromise(Provider.Service.use((svc) => svc.list()))

        const provider = await promptProvider()
        const model = await promptModel()

        await addWorkflowFiles()
        printNextSteps()

        function printNextSteps() {
          let step2
          if (provider === "amazon-bedrock") {
            step2 =
              "Configure OIDC in AWS - https://docs.github.com/en/actions/how-tos/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services"
          } else {
            step2 = [
              `    2. Add the following secrets in org or repo (${app.owner}/${app.repo}) settings`,
              "",
              ...providers[provider as ProviderID].env.map((e: string) => `       - ${e}`),
            ].join("\n")
          }

          prompts.outro(
            [
              "Next steps:",
              "",
              `    1. Commit the \`${WORKFLOW_FILE}\` file and push`,
              step2,
              "",
              "    3. Go to a GitHub issue and comment `/mod summarize` to see the agent in action",
              "",
              "   Learn more about the GitHub agent - https://mod.tools/docs/github/#usage-examples",
            ].join("\n"),
          )
        }

        async function getAppInfo() {
          const project = Instance.project
          if (project.vcs !== "git") {
            prompts.log.error(`Could not find git repository. Please run this command from a git repository.`)
            throw new UI.CancelledError()
          }

          const info = (await $`git remote get-url origin`.quiet().nothrow().text()).trim()
          const parsed = parseGitHubRemote(info)
          if (!parsed) {
            prompts.log.error(`Could not find git repository. Please run this command from a git repository.`)
            throw new UI.CancelledError()
          }
          return { owner: parsed.owner, repo: parsed.repo, root: Instance.worktree }
        }

        async function promptProvider() {
          const priority: Record<string, number> = {
            mod: 0,
            modtools: 1,
            anthropic: 2,
            openai: 3,
            google: 4,
          }
          let provider = await prompts.select({
            message: "Select provider",
            maxItems: 8,
            options: pipe(
              providers,
              values(),
              sortBy(
                (x) => priority[x.id] ?? 99,
                (x) => x.name ?? x.id,
              ),
              map((x) => ({
                label: x.name,
                value: x.id,
                hint: priority[x.id] === 0 ? "recommended" : undefined,
              })),
            ),
          })

          if (prompts.isCancel(provider)) throw new UI.CancelledError()

          return provider
        }

        async function promptModel() {
          const providerData = providers[provider as ProviderID]!

          const model = await prompts.select({
            message: "Select model",
            maxItems: 8,
            options: pipe(
              providerData.models,
              values(),
              sortBy((x) => x.name ?? x.id),
              map((x) => ({
                label: x.name ?? x.id,
                value: x.id,
              })),
            ),
          })

          if (prompts.isCancel(model)) throw new UI.CancelledError()
          return model
        }

        async function installGitHubApp() {
          const s = prompts.spinner()
          s.start("Installing GitHub app")

          const installation = await getInstallation()
          if (installation) return s.stop("GitHub app already installed")

          const url = "https://github.com/apps/mod-agent"
          const command =
            process.platform === "darwin"
              ? `open "${url}"`
              : process.platform === "win32"
                ? `start "" "${url}"`
                : `xdg-open "${url}"`

          exec(command, (error) => {
            if (error) {
              prompts.log.warn(`Could not open browser. Please visit: ${url}`)
            }
          })

          s.message("Waiting for GitHub app to be installed")
          const MAX_RETRIES = 120
          let retries = 0
          do {
            const installation = await getInstallation()
            if (installation) break

            if (retries > MAX_RETRIES) {
              s.stop(
                `Failed to detect GitHub app installation. Make sure to install the app for the \`${app.owner}/${app.repo}\` repository.`,
              )
              throw new UI.CancelledError()
            }

            retries++
            await Bun.sleep(1000)
          } while (true)

          s.stop("Installed GitHub app")

          async function getInstallation() {
            return await fetch(
              `https://api.mod.tools/get_github_app_installation?owner=${app.owner}&repo=${app.repo}`,
            )
              .then((res) => res.json())
              .then((data) => data.installation)
          }
        }

        async function addWorkflowFiles() {
          const envStr =
            provider === "amazon-bedrock"
              ? ""
              : `\n        env:${providers[provider as ProviderID].env.map((e: string) => `\n          ${e}: \${{ secrets.${e} }}`).join("")}`

          await fs.mkdir(path.join(app.root, ".github/workflows"), { recursive: true })
          await Bun.write(
            path.join(app.root, WORKFLOW_FILE),
            `name: mod

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  mod:
    if: |
      contains(github.event.comment.body, ' /oc') ||
      startsWith(github.event.comment.body, '/oc') ||
      contains(github.event.comment.body, ' /mod') ||
      startsWith(github.event.comment.body, '/mod')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      pull-requests: read
      issues: read
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
        with:
          persist-credentials: false

      - name: Run mod
        uses: anomalyco/modtools/github@latest${envStr}
        with:
          model: ${provider}/${model}`,
          )

          prompts.log.success(`Added workflow file: "${WORKFLOW_FILE}"`)
        }
      },
    })
  },
})

export const GithubRunCommand = cmd({
  command: "run",
  describe: "run the GitHub agent",
  builder: (yargs) =>
    yargs
      .option("event", {
        type: "string",
        describe: "GitHub mock event to run the agent for",
      })
      .option("token", {
        type: "string",
        describe: "GitHub personal access token (github_pat_********)",
      }),
  async handler(args) {
    await bootstrap(process.cwd(), async () => {
      const isMock = args.token || args.event

      const context = isMock ? (JSON.parse(args.event!) as Context) : github.context
      if (!SUPPORTED_EVENTS.includes(context.eventName as (typeof SUPPORTED_EVENTS)[number])) {
        core.setFailed(`Unsupported event type: ${context.eventName}`)
        process.exit(1)
      }

      const isUserEvent = USER_EVENTS.includes(context.eventName as UserEvent)
      const isRepoEvent = REPO_EVENTS.includes(context.eventName as RepoEvent)
      const isCommentEvent = ["issue_comment", "pull_request_review_comment"].includes(context.eventName)
      const isIssuesEvent = context.eventName === "issues"
      const isScheduleEvent = context.eventName === "schedule"
      const isWorkflowDispatchEvent = context.eventName === "workflow_dispatch"

      const { providerID, modelID } = normalizeModel()
      const runId = process.env["GITHUB_RUN_ID"] || "0"
      const share = process.env["SHARE"] !== "false"
      const oidcBaseUrl = process.env["MOD_OIDC_URL"] || "https://api.mod.tools"
      const { owner, repo } = context.repo
      const payload = context.payload as any
      const issueEvent = isIssueCommentEvent(payload) ? payload : undefined
      const actor = isScheduleEvent ? undefined : context.actor

      const issueId = isRepoEvent
        ? undefined
        : context.eventName === "issue_comment" || context.eventName === "issues"
          ? (payload as IssueCommentEvent | IssuesEvent).issue.number
          : (payload as PullRequestEvent | PullRequestReviewCommentEvent).pull_request.number
      const runUrl = `/${owner}/${repo}/actions/runs/${runId}`
      const shareBaseUrl = isMock ? "https://dev.mod.tools" : "https://mod.tools"

      let appToken: string
      let octoRest: Octokit
      let octoGraph: typeof graphql
      let gitConfig: string
      let session: Session.Info
      let shareId: string | undefined
      let exitCode = 0
      type PromptFiles = Awaited<ReturnType<typeof getUserPrompt>>["promptFiles"]
      const triggerCommentId = isCommentEvent
        ? (payload as IssueCommentEvent | PullRequestReviewCommentEvent).comment.id
        : undefined
      const useGithubToken = process.env["USE_GITHUB_TOKEN"] === "true"
      const commentType = isCommentEvent
        ? context.eventName === "pull_request_review_comment"
          ? "pr_review"
          : "issue"
        : undefined

      try {
        if (useGithubToken) {
          const githubToken = process.env["GITHUB_TOKEN"]
          if (!githubToken) {
            throw new Error(
              "GITHUB_TOKEN environment variable is not set. When using use_github_token, you must provide GITHUB_TOKEN.",
            )
          }
          appToken = githubToken
        } else {
          const actionToken = isMock ? args.token! : await getOidcToken()
          appToken = await exchangeForAppToken(actionToken)
        }
        octoRest = new Octokit({ auth: appToken })
        octoGraph = graphql.defaults({
          headers: { authorization: `token ${appToken}` },
        })

        const { userPrompt, promptFiles } = await getUserPrompt()
        if (!useGithubToken) {
          await configureGit(appToken)
        }
        if (isUserEvent) {
          await assertPermissions()
          await addReaction(commentType)
        }

        const repoData = await fetchRepo()
        session = await AppRuntime.runPromise(
          Session.Service.use((svc) =>
            svc.create({
              permission: [
                {
                  permission: "question",
                  action: "deny",
                  pattern: "*",
                },
              ],
            }),
          ),
        )
        subscribeSessionEvents()
        shareId = await (async () => {
          if (share === false) return
          if (!share && repoData.data.private) return
          await AppRuntime.runPromise(SessionShare.Service.use((svc) => svc.share(session.id)))
          return session.id.slice(-8)
        })()
        console.log("MOD session", session.id)

        if (isRepoEvent) {
          if (isWorkflowDispatchEvent && actor) {
            console.log(`Triggered by: ${actor}`)
          }
          const branchPrefix = isWorkflowDispatchEvent ? "dispatch" : "schedule"
          const branch = await checkoutNewBranch(branchPrefix)
          const head = (await $`git rev-parse HEAD`.quiet().text()).trim()
          const response = await chat(userPrompt, promptFiles)
          const { dirty, uncommittedChanges } = await branchIsDirty(head)
          if (dirty) {
            const summary = await summarize(response)
            await pushToNewBranch(summary, branch, uncommittedChanges, isScheduleEvent)
            const triggerType = isWorkflowDispatchEvent ? "workflow_dispatch" : "scheduled workflow"
            const pr = await createPR(
              repoData.data.default_branch,
              branch,
              summary,
              `${response}\n\nTriggered by ${triggerType}${footer({ image: true })}`,
            )
            console.log(`Created PR #${pr}`)
          } else {
            console.log("Response:", response)
          }
        } else if (
          ["pull_request", "pull_request_review_comment"].includes(context.eventName) ||
          issueEvent?.issue.pull_request
        ) {
          const prData = await fetchPR()
          if (prData.headRepository.nameWithOwner === prData.baseRepository.nameWithOwner) {
            await checkoutLocalBranch(prData)
            const head = (await $`git rev-parse HEAD`.quiet().text()).trim()
            const dataPrompt = buildPromptDataForPR(prData)
            const response = await chat(`${userPrompt}\n\n${dataPrompt}`, promptFiles)
            const { dirty, uncommittedChanges } = await branchIsDirty(head)
            if (dirty) {
              const summary = await summarize(response)
              await pushToLocalBranch(summary, uncommittedChanges)
            }
            const hasShared = prData.comments.nodes.some((c) => c.body.includes(`${shareBaseUrl}/s/${shareId}`))
            await createComment(`${response}${footer({ image: !hasShared })}`)
            await removeReaction(commentType)
          }
          else {
            await checkoutForkBranch(prData)
            const head = (await $`git rev-parse HEAD`.quiet().text()).trim()
            const dataPrompt = buildPromptDataForPR(prData)
            const response = await chat(`${userPrompt}\n\n${dataPrompt}`, promptFiles)
            const { dirty, uncommittedChanges } = await branchIsDirty(head)
            if (dirty) {
              const summary = await summarize(response)
              await pushToForkBranch(summary, prData, uncommittedChanges)
            }
            const hasShared = prData.comments.nodes.some((c) => c.body.includes(`${shareBaseUrl}/s/${shareId}`))
            await createComment(`${response}${footer({ image: !hasShared })}`)
            await removeReaction(commentType)
          }
        }
        else {
          const branch = await checkoutNewBranch("issue")
          const head = (await $`git rev-parse HEAD`.quiet().text()).trim()
          const issueData = await fetchIssue()
          const dataPrompt = buildPromptDataForIssue(issueData)
          const response = await chat(`${userPrompt}\n\n${dataPrompt}`, promptFiles)
          const { dirty, uncommittedChanges } = await branchIsDirty(head)
          if (dirty) {
            const summary = await summarize(response)
            await pushToNewBranch(summary, branch, uncommittedChanges, false)
            const pr = await createPR(
              repoData.data.default_branch,
              branch,
              summary,
              `${response}\n\nCloses #${issueId}${footer({ image: true })}`,
            )
            await createComment(`Created PR #${pr}${footer({ image: true })}`)
            await removeReaction(commentType)
          } else {
            await createComment(`${response}${footer({ image: true })}`)
            await removeReaction(commentType)
          }
        }
      } catch (e: any) {
        exitCode = 1
        console.error(e instanceof Error ? e.message : String(e))
        let msg = e
        if (e instanceof $.ShellError) {
          msg = e.stderr.toString()
        } else if (e instanceof Error) {
          msg = e.message
        }
        if (isUserEvent) {
          await createComment(`${msg}${footer()}`)
          await removeReaction(commentType)
        }
        core.setFailed(msg)
      } finally {
        if (!useGithubToken) {
          await restoreGitConfig()
          await revokeAppToken()
        }
      }
      process.exit(exitCode)

      function normalizeModel() {
        const value = process.env["MODEL"]
        if (!value) throw new Error(`Environment variable "MODEL" is not set`)
        const { providerID, modelID } = Provider.parseModel(value)
        if (!providerID.length || !modelID.length)
          throw new Error(`Invalid model ${value}. Model must be in the format "provider/model".`)
        return { providerID, modelID }
      }

      function normalizeOidcBaseUrl(): string {
        const value = process.env["OIDC_BASE_URL"]
        if (!value) return "https://api.mod.tools"
        return value.replace(/\/+$/, "")
      }

      function isIssueCommentEvent(event: any): event is IssueCommentEvent {
        return "issue" in event && "comment" in event
      }

      function getReviewCommentContext() {
        if (context.eventName !== "pull_request_review_comment") {
          return null
        }
        const reviewPayload = payload as PullRequestReviewCommentEvent
        return {
          file: reviewPayload.comment.path,
          diffHunk: reviewPayload.comment.diff_hunk,
          line: reviewPayload.comment.line,
        }
      }

      async function getUserPrompt() {
        const customPrompt = process.env["PROMPT"]
        if (isRepoEvent || isIssuesEvent) {
          if (!customPrompt) {
            const eventType = isRepoEvent ? "scheduled and workflow_dispatch" : "issues"
            throw new Error(`PROMPT input is required for ${eventType} events`)
          }
          return { userPrompt: customPrompt, promptFiles: [] }
        }
        if (customPrompt) {
          return { userPrompt: customPrompt, promptFiles: [] }
        }
        const reviewContext = getReviewCommentContext()
        const mentions = (process.env["MENTIONS"] || "/mod,/oc")
          .split(",")
          .map((m) => m.trim().toLowerCase())
          .filter(Boolean)
        let prompt = (() => {
          if (!isCommentEvent) {
            return "Review this pull request"
          }
          const body = (payload as IssueCommentEvent | PullRequestReviewCommentEvent).comment.body.trim()
          const bodyLower = body.toLowerCase()
          if (mentions.some((m) => bodyLower === m)) {
            if (reviewContext) {
              return `Review this code change and suggest improvements for the commented lines:\n\nFile: ${reviewContext.file}\nLine: ${reviewContext.line}\n\n${reviewContext.diffHunk}`
            }
            return "Summarize this thread"
          }
          if (mentions.some((m) => bodyLower.includes(m))) {
            return body
          }
          throw new Error(`Comments must mention ${mentions.map((m) => "`" + m + "`").join(" or ")}`)
        })()

        const imgData: any[] = []
        return { userPrompt: prompt, promptFiles: imgData }
      }

      function subscribeSessionEvents() {
        const TOOL: Record<string, [string, string]> = {
          todowrite: ["Todo", UI.Style.TEXT_WARNING_BOLD],
          bash: ["Bash", UI.Style.TEXT_DANGER_BOLD],
          edit: ["Edit", UI.Style.TEXT_SUCCESS_BOLD],
          glob: ["Glob", UI.Style.TEXT_INFO_BOLD],
          grep: ["Grep", UI.Style.TEXT_INFO_BOLD],
          read: ["Read", UI.Style.TEXT_HIGHLIGHT_BOLD],
          write: ["Write", UI.Style.TEXT_SUCCESS_BOLD],
          websearch: ["Search", UI.Style.TEXT_DIM_BOLD],
        }

        function printEvent(color: string, type: string, title: string) {
          UI.println(
            color + `|`,
            UI.Style.TEXT_NORMAL + UI.Style.TEXT_DIM + ` ${type.padEnd(7, " ")}`,
            "",
            UI.Style.TEXT_NORMAL + title,
          )
        }

        let text = ""
        Bus.subscribe(MessageV2.Event.PartUpdated, async (evt) => {
          if (evt.properties.part.sessionID !== session.id) return
          const part = evt.properties.part
          if (part.type === "tool" && part.state.status === "completed") {
            const [tool, color] = TOOL[part.tool] ?? [part.tool, UI.Style.TEXT_INFO_BOLD]
            const title =
              part.state.title || Object.keys(part.state.input).length > 0
                ? JSON.stringify(part.state.input)
                : "Unknown"
            printEvent(color, tool, title)
          }
          if (part.type === "text") {
            text = part.text
            if (part.time?.end) {
              UI.empty()
              UI.println(UI.markdown(text))
              UI.empty()
              text = ""
            }
          }
        })
      }

      async function summarize(response: string) {
        try {
          return await chat(`Summarize the following in less than 40 characters:\n\n${response}`)
        } catch (e) {
          return `Agent update`
        }
      }

      async function chat(message: string, files: any[] = []) {
        console.log("Sending message to MOD...")
        const result = await AppRuntime.runPromise(
          SessionPrompt.Service.use((svc) =>
            svc.prompt({
              sessionID: session.id,
              messageID: MessageID.ascending(),
              model: { providerID, modelID },
              parts: [
                {
                  id: PartID.ascending(),
                  type: "text",
                  text: message,
                },
                ...files,
              ],
            }),
          ),
        )
        if (result.info.role === "assistant" && result.info.error) {
          throw new Error(`${result.info.error.name}`)
        }
        return extractResponseText(result.parts) ?? "Done."
      }

      async function getOidcToken() {
        return await core.getIDToken("mod-github-action")
      }

      async function exchangeForAppToken(token: string) {
        const response = await fetch(`${oidcBaseUrl}/exchange_github_app_token`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = (await response.json()) as { token: string }
        return data.token
      }

      async function configureGit(appToken: string) {
        if (isMock) return
        const config = "http.https://github.com/.extraheader"
        const ret = await $`git config --local --get ${config}`.nothrow()
        if (ret.exitCode === 0) gitConfig = ret.stdout.toString().trim()
        const newCredentials = Buffer.from(`x-access-token:${appToken}`, "utf8").toString("base64")
        await $`git config --local ${config} "AUTHORIZATION: basic ${newCredentials}"`
        await $`git config --global user.name "${AGENT_USERNAME}"`
        await $`git config --global user.email "${AGENT_USERNAME}@users.noreply.github.com"`
      }

      async function restoreGitConfig() {
        if (gitConfig === undefined) return
        await $`git config --local http.https://github.com/.extraheader "${gitConfig}"`
      }

      async function checkoutNewBranch(type: string) {
        const branch = generateBranchName(type as any)
        await $`git checkout -b ${branch}`
        return branch
      }

      async function checkoutLocalBranch(pr: GitHubPullRequest) {
        const branch = pr.headRefName
        await $`git fetch origin ${branch}`
        await $`git checkout ${branch}`
      }

      async function checkoutForkBranch(pr: GitHubPullRequest) {
        const remoteBranch = pr.headRefName
        const localBranch = generateBranchName("pr")
        await $`git remote add fork https://github.com/${pr.headRepository.nameWithOwner}.git`
        await $`git fetch fork ${remoteBranch}`
        await $`git checkout -b ${localBranch} fork/${remoteBranch}`
      }

      function generateBranchName(type: "issue" | "pr" | "schedule" | "dispatch") {
        const timestamp = Date.now()
        return `mod/${type}-${timestamp}`
      }

      async function pushToNewBranch(summary: string, branch: string, commit: boolean, isSchedule: boolean) {
        if (commit) {
          await $`git add .`
          await $`git commit -m "${summary}"`
        }
        await $`git push -u origin ${branch}`
      }

      async function pushToLocalBranch(summary: string, commit: boolean) {
        if (commit) {
          await $`git add .`
          await $`git commit -m "${summary}"`
        }
        await $`git push`
      }

      async function pushToForkBranch(summary: string, pr: GitHubPullRequest, commit: boolean) {
        const remoteBranch = pr.headRefName
        if (commit) {
          await $`git add .`
          await $`git commit -m "${summary}"`
        }
        await $`git push fork HEAD:${remoteBranch}`
      }

      async function branchIsDirty(originalHead: string) {
        const ret = await $`git status --porcelain`.quiet().text()
        if (ret.trim().length > 0) return { dirty: true, uncommittedChanges: true }
        const head = (await $`git rev-parse HEAD`.quiet().text()).trim()
        return { dirty: head !== originalHead, uncommittedChanges: false }
      }

      async function assertPermissions() {
        const response = await octoRest.repos.getCollaboratorPermissionLevel({
          owner,
          repo,
          username: actor!,
        })
        if (!["admin", "write"].includes(response.data.permission)) throw new Error("Permission denied")
      }

      async function addReaction(type?: string) {
        if (!triggerCommentId) return
        await octoRest.rest.reactions.createForIssueComment({
          owner,
          repo,
          comment_id: triggerCommentId,
          content: AGENT_REACTION,
        })
      }

      async function removeReaction(type?: string) {
        if (!triggerCommentId) return
        const reactions = await octoRest.rest.reactions.listForIssueComment({
          owner,
          repo,
          comment_id: triggerCommentId,
          content: AGENT_REACTION,
        })
        const eyes = reactions.data.find((r) => r.user?.login === AGENT_USERNAME)
        if (eyes) {
          await octoRest.rest.reactions.deleteForIssueComment({
            owner,
            repo,
            comment_id: triggerCommentId,
            reaction_id: eyes.id,
          })
        }
      }

      async function createComment(body: string) {
        await octoRest.rest.issues.createComment({ owner, repo, issue_number: issueId!, body })
      }

      async function createPR(base: string, branch: string, title: string, body: string) {
        const pr = await octoRest.rest.pulls.create({ owner, repo, head: branch, base, title, body })
        return pr.data.number
      }

      async function fetchRepo() {
        return await octoRest.rest.repos.get({ owner, repo })
      }

      async function fetchIssue() {
        const res = await octoGraph<IssueQueryResponse>(`query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){issue(number:$number){title,body,author{login},createdAt,state,comments(first:100){nodes{id,databaseId,body,author{login},createdAt}}}}}`, { owner, repo, number: issueId })
        return res.repository.issue
      }

      function buildPromptDataForIssue(issue: GitHubIssue) {
        return `<issue>\nTitle: ${issue.title}\nBody: ${issue.body}\n</issue>`
      }

      async function fetchPR() {
        const res = await octoGraph<PullRequestQueryResponse>(`query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$number){title,body,author{login},baseRefName,headRefName,headRefOid,createdAt,additions,deletions,state,baseRepository{nameWithOwner},headRepository{nameWithOwner},commits(first:100){totalCount,nodes{commit{oid,message,author{name,email}}}},files(first:100){nodes{path,additions,deletions,changeType}},comments(first:100){nodes{id,databaseId,body,author{login},createdAt}},reviews(first:100){nodes{id,databaseId,author{login},body,state,submittedAt,comments(first:100){nodes{id,databaseId,body,path,line,author{login},createdAt}}}}}}}`, { owner, repo, number: issueId })
        return res.repository.pullRequest
      }

      function buildPromptDataForPR(pr: GitHubPullRequest) {
        return `<pr>\nTitle: ${pr.title}\nBody: ${pr.body}\n</pr>`
      }

      function footer(opts?: { image?: boolean }) {
        const image = opts?.image && shareId ? `<a href="${shareBaseUrl}/s/${shareId}"><img width="200" src="https://social-cards.sst.dev/mod-share/${Buffer.from(session.title).toString("base64")}.png" /></a>\n` : ""
        const shareUrl = shareId ? `[modtools session](${shareBaseUrl}/s/${shareId}) | ` : ""
        return `\n\n${image}${shareUrl}[github run](${runUrl})`
      }

      async function revokeAppToken() {
        if (!appToken) return
        await fetch("https://api.github.com/installation/token", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${appToken}` },
        })
      }
    })
  },
})
