declare global {
  const MODTOOLS_VERSION: string
  const MODTOOLS_CHANNEL: string
}

export const InstallationVersion = typeof MODTOOLS_VERSION === "string" ? MODTOOLS_VERSION : "local"
export const InstallationChannel = typeof MODTOOLS_CHANNEL === "string" ? MODTOOLS_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
