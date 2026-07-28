export * from "./client.js"
export * from "./server.js"

import { createModClient } from "./client.js"
import { createModServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export async function createMod(options?: ServerOptions) {
  const server = await createModServer({
    ...options,
  })

  const client = createModClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
