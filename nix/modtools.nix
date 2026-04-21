{
  lib,
  stdenvNoCC,
  callPackage,
  bun,
  nodejs,
  sysctl,
  makeBinaryWrapper,
  models-dev,
  ripgrep,
  installShellFiles,
  versionCheckHook,
  writableTmpDirAsHomeHook,
  node_modules ? callPackage ./node-modules.nix { },
}:
stdenvNoCC.mkDerivation (finalAttrs: {
  pname = "mod";
  inherit (node_modules) version src;
  inherit node_modules;

  nativeBuildInputs = [
    bun
    nodejs # for patchShebangs node_modules
    installShellFiles
    makeBinaryWrapper
    models-dev
    writableTmpDirAsHomeHook
  ];

  configurePhase = ''
    runHook preConfigure

    cp -R ${finalAttrs.node_modules}/. .
    patchShebangs node_modules
    patchShebangs packages/*/node_modules

    runHook postConfigure
  '';

  env.MODELS_DEV_API_JSON = "${models-dev}/dist/_api.json";
  env.MODTOOLS_DISABLE_MODELS_FETCH = true;
  env.MOD_VERSION = finalAttrs.version;
  env.MOD_CHANNEL = "local";

  buildPhase = ''
    runHook preBuild

    cd ./packages/modtools
    bun --bun ./script/build.ts --single --skip-install
    bun --bun ./script/schema.ts schema.json

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    install -Dm755 dist/mod-*/bin/mod $out/bin/mod
    install -Dm644 schema.json $out/share/mod/schema.json

    wrapProgram $out/bin/mod \
      --prefix PATH : ${
        lib.makeBinPath (
          [
            ripgrep
          ]
          # bun runs sysctl to detect if dunning on rosetta2
          ++ lib.optional stdenvNoCC.hostPlatform.isDarwin sysctl
        )
      }

    runHook postInstall
  '';

  postInstall = lib.optionalString (stdenvNoCC.buildPlatform.canExecute stdenvNoCC.hostPlatform) ''
    # trick yargs into also generating zsh completions
    installShellCompletion --cmd mod \
      --bash <($out/bin/mod completion) \
      --zsh <(SHELL=/bin/zsh $out/bin/mod completion)
  '';

  doInstallCheck = stdenvNoCC.buildPlatform.canExecute stdenvNoCC.hostPlatform;
  nativeInstallCheckBuildInputs = [
    versionCheckHook
  ];
  versionCheckProgramArg = [
    "--version"
  ];

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
})
