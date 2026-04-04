export * from "./client.js"
export * from "./server.js"

import { createModtoolsClient } from "./client.js"
import { createModtoolsServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export async function createModtools(options?: ServerOptions) {
  const server = await createModtoolsServer({
    ...options,
  })

  const client = createModtoolsClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
