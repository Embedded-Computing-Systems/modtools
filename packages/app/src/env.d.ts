interface ImportMetaEnv {
  readonly VITE_MOD_SERVER_HOST: string
  readonly VITE_MOD_SERVER_PORT: string
  readonly VITE_MOD_CHANNEL?: "dev" | "beta" | "prod"
  readonly VITE_MODTOOLS_SERVER_HOST: string
  readonly VITE_MODTOOLS_SERVER_PORT: string
  readonly VITE_MODTOOLS_CHANNEL?: "dev" | "beta" | "prod"
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export declare module "solid-js" {
  namespace JSX {
    interface Directives {
      sortable: true
    }
  }
}
