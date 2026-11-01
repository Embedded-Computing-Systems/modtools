export const available = true

export async function resolveBinary() {
  return process.env.MODTOOLS_PTY_BIN || "opencode-pty"
}
