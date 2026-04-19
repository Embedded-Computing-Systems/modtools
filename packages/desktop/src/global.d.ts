declare global {
  interface Window {
    __MODTOOLS__?: {
      updaterEnabled?: boolean
      deepLinks?: string[]
      wsl?: boolean
    }
  }
}

export {}