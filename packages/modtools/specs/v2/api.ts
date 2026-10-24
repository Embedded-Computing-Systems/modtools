// @ts-nocheck

import { OpenCode } from "@modtools-ai/core"
import { ReadTool } from "@modtools-ai/core/tools"

const mod = OpenCode.make({})

mod.tool.add(ReadTool)

mod.tool.add({
  name: "bash",
  schema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The command to run.",
      },
    },
    required: ["command"],
  },
  execute(input, ctx) {},
})

mod.auth.add({
  provider: "openai",
  type: "api",
  value: process.env.OPENAI_API_KEY,
})

mod.agent.add({
  name: "build",
  permissions: [],
  model: {
    id: "gpt-5-5",
    provider: "openai",
    variant: "xhigh",
  },
})

const sessionID = await mod.session.create({
  agent: "build",
})

mod.subscribe((event) => {
  console.log(event)
})

await mod.session.prompt({
  sessionID,
  text: "hey what is up",
})

await mod.session.prompt({
  sessionID,
  text: "what is up with this",
  files: [
    {
      mime: "image/png",
      uri: "data:image/png;base64,xxxx",
    },
  ],
})

await mod.session.wait()

console.log(await mod.session.messages(sessionID))
