interface ImportMetaEnv {
  readonly MODTOOLS_CHANNEL: string
  readonly MODTOOLS_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
