{
  description = "MOD development flake";
...
            mod = final.callPackage ./nix/modtools.nix {
              inherit node_modules;
            };
            desktop = final.callPackage ./nix/desktop.nix {
              modtools = mod;
            };
          in
          {
            inherit mod;
            mod-desktop = desktop;
          };
...
          mod = pkgs.callPackage ./nix/modtools.nix {
            inherit node_modules;
          };
          desktop = pkgs.callPackage ./nix/desktop.nix {
            modtools = mod;
          };
        in
        {
          default = mod;
          inherit mod desktop;
          # Updater derivation with fakeHash - build fails and reveals correct hash
          node_modules_updater = node_modules.override {
            hash = pkgs.lib.fakeHash;
          };
        }
      );
    };
}
