interface ImportMetaEnv {
  readonly MODTOOLS_CHANNEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "virtual:MOD-server" {
  export namespace Server {
    export const listen: typeof import("../../../MOD/dist/types/src/node").Server.listen
    export type Listener = import("../../../MOD/dist/types/src/node").Server.Listener
  }
  export namespace Config {
    export const get: typeof import("../../../MOD/dist/types/src/node").Config.get
    export type Info = import("../../../MOD/dist/types/src/node").Config.Info
  }
  export const bootstrap: typeof import("../../../MOD/dist/types/src/node").bootstrap
}
