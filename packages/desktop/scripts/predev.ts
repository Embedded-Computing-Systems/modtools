import { $ } from "bun"

await $`bun ./scripts/copy-icons.ts ${process.env.MODTOOLS_CHANNEL ?? "dev"}`

await $`cd ../MOD && bun script/build-node.ts`
