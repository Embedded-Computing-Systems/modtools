import type { WslModCheck, WslServerRuntime } from "./types"

export const wslRuntimeRetryable = (runtime: WslServerRuntime) =>
  runtime.kind === "failed" || runtime.kind === "stopped"

export async function enterWslModStep(
  distro: string,
  probe: (distro: string) => Promise<unknown>,
  select: (step: "MOD") => void,
) {
  await probe(distro)
  select("MOD")
}

export function wslModAction(check?: WslModCheck) {
  if (!check) return
  if (!check.resolvedPath) return "Install Mod"
  if (check.matchesDesktop === false) return "Update Mod"
}
