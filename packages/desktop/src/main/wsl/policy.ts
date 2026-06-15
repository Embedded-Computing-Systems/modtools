import type { WslDistroProbe, WslModCheck, WslServerItem } from "../../preload/types"

export function wslServerIdToRestart(servers: WslServerItem[], distro: string) {
  return servers.find((item) => item.config.distro === distro)?.config.id
}

export function clearWslDistroState(
  distroProbes: Record<string, WslDistroProbe>,
  MODChecks: Record<string, WslModCheck>,
  distro: string,
) {
  const nextDistroProbes = { ...distroProbes }
  const nextModChecks = { ...MODChecks }
  delete nextDistroProbes[distro]
  delete nextModChecks[distro]
  return { distroProbes: nextDistroProbes, MODChecks: nextModChecks }
}

export function wslTerminalArgs(distro?: string | null) {
  return ["/c", "start", "", "wsl", ...(distro ? ["-d", distro] : [])]
}

export function requireWslIpcString(name: string, value: unknown) {
  if (typeof value === "string" && value.length > 0) return value
  throw new Error(`Invalid ${name}`)
}
