declare global {
  const MOD_VERSION: string
  const MOD_CHANNEL: string
}

export const InstallationVersion = typeof MOD_VERSION === "string" ? MOD_VERSION : "local"
export const InstallationChannel = typeof MOD_CHANNEL === "string" ? MOD_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
