{
  inputs,
  pkgs,
  ...
}:
{

  # overlays = [ inputs.rust-overlay.overlays.default ];

  # cachix.enable = true;
  # cachix.pull = [ "wrangler" ];
  dotenv.enable = true;
  languages.javascript = {
    enable = true;
    npm.install.enable = false;
    pnpm.install.enable = false;
  };
  packages =
    with pkgs;
    [
      nodePackages_latest.pnpm
      typescript
      biome
      openjdk_headless
      # wasm-pack
      # (rust-bin.nightly.latest.default.override { extensions = [ "rust-src" ]; })
      # netlify-cli
    ];
    # ++ [ inputs.wrangler.packages.${pkgs.system}.default ];
}
