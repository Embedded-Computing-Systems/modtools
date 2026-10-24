import type { ElectronNative } from "../preload/types"

declare global {
  interface ImportMetaEnv {
    readonly MODTOOLS_TEST_ONBOARDING: boolean
  }

  interface Window {
    electron: ElectronNative
    __MOD__?: {
      deepLinks?: string[]
    }
  }
}
