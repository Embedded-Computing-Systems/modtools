// @ts-nocheck

import { Mod } from "@modtools-ai/core"
import { ReadTool } from "@modtools-ai/core/tools"

const MOD = Mod.make({})

MOD.tool.add(ReadTool)

MOD.tool.add({
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

MOD.auth.add({
  provider: "openai",
  type: "api",
  value: process.env.OPENAI_API_KEY,
})

MOD.agent.add({
  name: "build",
  permissions: [],
  model: {
    id: "gpt-5-5",
    provider: "openai",
    variant: "xhigh",
  },
})

const sessionID = await MOD.session.create({
  agent: "build",
})

MOD.subscribe((event) => {
  console.log(event)
})

await MOD.session.prompt({
  sessionID,
  text: "hey what is up",
})

await MOD.session.prompt({
  sessionID,
  text: "what is up with this",
  files: [
    {
      mime: "image/png",
      uri: "data:image/png;base64,xxxx",
    },
  ],
})

await MOD.session.wait()

console.log(await MOD.session.messages(sessionID))
