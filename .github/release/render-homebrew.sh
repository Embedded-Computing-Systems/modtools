#!/usr/bin/env bash
# render-homebrew.sh <sign-macos dir> <build-archives dir> <tap dir>: writes Formula mod-v2.rb with the
# hashes of the signed macOS and the Linux archives.
. "$(dirname "$0")/lib.sh"

macos=$1 archives=$2 tap=$3
sum() { sha256 "$1" | cut -c1-64; }
base="https://opencode.ai/files/bin/$MODTOOLS_VERSION"
cat > "$tap/mod-v2.rb" <<FORMULA
# typed: false
# frozen_string_literal: true

class ModV2 < Formula
  desc "MOD V2 - the AI coding agent for the terminal"
  homepage "https://github.com/Embedded-Computing-Systems/modtools"
  version "$MODTOOLS_VERSION"
  license "MIT"

  depends_on "ripgrep"
  conflicts_with "mod", because: "both install an mod binary"

  on_macos do
    if Hardware::CPU.arm?
      url "$base/mod-darwin-arm64.zip"
      sha256 "$(sum "$macos/mod-darwin-arm64.zip")"
    else
      url "$base/mod-darwin-x64-baseline.zip"
      sha256 "$(sum "$macos/mod-darwin-x64-baseline.zip")"
    end
  end

  on_linux do
    if Hardware::CPU.arm?
      url "$base/mod-linux-arm64.tar.gz"
      sha256 "$(sum "$archives/mod-linux-arm64.tar.gz")"
    else
      url "$base/mod-linux-x64-baseline.tar.gz"
      sha256 "$(sum "$archives/mod-linux-x64-baseline.tar.gz")"
    end
  end

  def install
    bin.install "mod"
  end
end
FORMULA
cat "$tap/mod-v2.rb"
