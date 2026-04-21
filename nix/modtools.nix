{
  lib,
  stdenvNoCC,
  callPackage,
  bun,
  nodejs,
  sysctl,
  makeBinaryWrapper,
  models-dev,
  installShellFiles,
  versionCheckHook,
  writableTmpDirAsHomeHook,
  node_modules ? callPackage ./node-modules.nix { },
}:
stdenvNoCC.mkDerivation (finalAttrs: {
  pname = "mod";
...
  env.MODTOOLS_DISABLE_MODELS_FETCH = true;
  env.MOD_VERSION = finalAttrs.version;
  env.MOD_CHANNEL = "local";
...
      install -Dm755 dist/mod-*/bin/mod $out/bin/mod
      install -Dm644 schema.json $out/share/mod/schema.json
    ''
    # bun runs sysctl to detect if dunning on rosetta2
    + lib.optionalString stdenvNoCC.hostPlatform.isDarwin ''
      wrapProgram $out/bin/mod \
...
    # trick yargs into also generating zsh completions
    installShellCompletion --cmd mod \
      --bash <($out/bin/mod completion) \
      --zsh <(SHELL=/bin/zsh $out/bin/mod completion)
...
  passthru = {
    jsonschema = "${placeholder "out"}/share/mod/schema.json";
  };

  meta = {
    description = "MOD - AI-powered development tool";
    homepage = "https://modtools.ai/";
    license = lib.licenses.mit;
    mainProgram = "mod";
    inherit (node_modules.meta) platforms;
  };

  meta = {
    description = "MOD Tools - AI-powered development tool";
    homepage = "https://modtools.ai/";
    license = lib.licenses.mit;
    mainProgram = "modtools";
    inherit (node_modules.meta) platforms;
  };
})
