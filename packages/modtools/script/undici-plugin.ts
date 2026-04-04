import type { BunPlugin } from "bun";

export const undiciPlugin: BunPlugin = {
  name: "undici-plugin",
  setup(build) {
    build.onResolve({ filter: /^undici$/ }, (args) => {
      return {
        path: args.path,
        namespace: "undici-shim",
      };
    });

    build.onLoad({ filter: /.*/, namespace: "undici-shim" }, () => {
      return {
        contents: `
          export const fetch = globalThis.fetch;
          export const Request = globalThis.Request;
          export const Response = globalThis.Response;
          export const Headers = globalThis.Headers;
          export const FormData = globalThis.FormData;
          export const File = globalThis.File;
          export const Agent = class {};
          export const getGlobalDispatcher = () => ({});
          export const setGlobalDispatcher = () => {};
          export default {
            fetch,
            Request,
            Response,
            Headers,
            FormData,
            File,
            Agent,
            getGlobalDispatcher,
            setGlobalDispatcher,
          };
        `,
        loader: "js",
      };
    });
  },
};
