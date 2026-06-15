import { $ } from "bun"

await $`bun ./scripts/copy-icons.ts ${process.env.MODTOOLS_CHANNEL ?? "dev"}`

await $`cd ../modtools && bun script/build-node.ts`
