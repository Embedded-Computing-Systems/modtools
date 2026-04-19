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
  pname = "modtools";
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
  env.MODTOOLS_VERSION = finalAttrs.version;
  env.MODTOOLS_CHANNEL = "local";

  buildPhase = ''
    runHook preBuild

    cd ./packages/modtools
    bun --bun ./script/build.ts --single --skip-install
    bun --bun ./script/schema.ts schema.json

    runHook postBuild
  '';

  installPhase =
    ''
      runHook preInstall

      install -Dm755 dist/modtools-*/bin/modtools $out/bin/modtools
      install -Dm644 schema.json $out/share/modtools/schema.json
    ''
    # bun runs sysctl to detect if dunning on rosetta2
    + lib.optionalString stdenvNoCC.hostPlatform.isDarwin ''
      wrapProgram $out/bin/modtools \
        --prefix PATH : ${
          lib.makeBinPath [
            sysctl
          ]
        }
    ''
    + ''
      runHook postInstall
    '';

  postInstall = lib.optionalString (stdenvNoCC.buildPlatform.canExecute stdenvNoCC.hostPlatform) ''
    # trick yargs into also generating zsh completions
    installShellCompletion --cmd modtools \
      --bash <($out/bin/modtools completion) \
      --zsh <(SHELL=/bin/zsh $out/bin/modtools completion)
  '';

  nativeInstallCheckInputs = [
    versionCheckHook
    writableTmpDirAsHomeHook
  ];
  doInstallCheck = true;
  versionCheckKeepEnvironment = [ "HOME" "MODTOOLS_DISABLE_MODELS_FETCH" ];
  versionCheckProgramArg = "--version";

  passthru = {
    jsonschema = "${placeholder "out"}/share/modtools/schema.json";
  };

  meta = {
    description = "MOD Tools - AI-powered development tool";
    homepage = "https://modtools.ai/";
    license = lib.licenses.mit;
    mainProgram = "modtools";
    inherit (node_modules.meta) platforms;
  };
})
