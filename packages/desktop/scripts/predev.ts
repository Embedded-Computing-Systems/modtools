import { $ } from "bun"
import { downloadCliToResources } from "./utils"

await $`bun run install-electron`

await $`bun ./scripts/copy-icons.ts ${process.env.MODTOOLS_CHANNEL ?? "dev"}`

await $`cd ../modtools && bun script/build-node.ts`
await downloadCliToResources()
