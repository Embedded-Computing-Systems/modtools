FROM alpine AS base

ARG BUN_RUNTIME_TRANSPILER_CACHE_PATH=0
ENV BUN_RUNTIME_TRANSPILER_CACHE_PATH=${BUN_RUNTIME_TRANSPILER_CACHE_PATH}
RUN apk add --no-cache libgcc libstdc++ ripgrep

FROM base AS build-amd64
COPY dist/cli-linux-x64-baseline-musl/bin/mod /usr/local/bin/mod

FROM base AS build-arm64
COPY dist/cli-linux-arm64-musl/bin/mod /usr/local/bin/mod

ARG TARGETARCH
FROM build-${TARGETARCH}
RUN ln -s mod /usr/local/bin/mod2 && mod --version && mod2 --version
ENTRYPOINT ["mod"]
