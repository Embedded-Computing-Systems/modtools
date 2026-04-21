{
  lib,
  stdenv,
  rustPlatform,
  pkg-config,
  cargo-tauri,
  bun,
  nodejs,
  cargo,
  rustc,
  jq,
  wrapGAppsHook4,
  makeWrapper,
  dbus,
  glib,
  gtk4,
  libsoup_3,
  librsvg,
  libappindicator,
  glib-networking,
  openssl,
  webkitgtk_4_1,
  gst_all_1,
  modtools,
}:
rustPlatform.buildRustPackage (finalAttrs: {
  pname = "mod-desktop";
...
    cp ${modtools}/bin/mod packages/desktop/src-tauri/sidecars/mod-cli-${stdenv.hostPlatform.rust.rustcTarget}
...
  # darwin output is a .app bundle so no conflict
  postFixup = lib.optionalString stdenv.hostPlatform.isLinux ''
    mv $out/bin/MOD $out/bin/mod-desktop
    sed -i 's|^Exec=MOD$|Exec=mod-desktop|' $out/share/applications/MOD.desktop
  '';

  meta = {
    description = "MOD Desktop App";
    homepage = "https://modtools.ai";
    license = lib.licenses.mit;
    mainProgram = "mod-desktop";
    inherit (modtools.meta) platforms;
  };
})
