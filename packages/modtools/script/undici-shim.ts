// Shim for undici that replaces the full undici module with native fetch-based equivalents.
// This is needed because the compiled Bun binary cannot resolve the undici npm module at runtime,
// and bundling undici directly causes ReferenceError due to __esm/__reExport patterns.
//
// This file is used by the build plugin (undici-plugin.ts) to provide a compatible shim.

export const fetch = globalThis.fetch
export const Request = globalThis.Request
export const Response = globalThis.Response
export const Headers = globalThis.Headers
export const FormData = globalThis.FormData
export const File = globalThis.File
export const Agent = class {}
export const getGlobalDispatcher = () => ({})
export const setGlobalDispatcher = () => {}

export default {
  fetch: globalThis.fetch,
  Request: globalThis.Request,
  Response: globalThis.Response,
  Headers: globalThis.Headers,
  FormData: globalThis.FormData,
  File: globalThis.File,
  Agent,
  getGlobalDispatcher,
  setGlobalDispatcher,
}