declare global {
  const MOD_VERSION: string
  const MOD_CHANNEL: string
}

export const VERSION = typeof MOD_VERSION === "string" ? MOD_VERSION : "local"
export const CHANNEL = typeof MOD_CHANNEL === "string" ? MOD_CHANNEL : "local"
