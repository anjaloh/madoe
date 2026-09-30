# Changelog

All notable changes to Madoe are documented in this file.

## [0.1.0] - Unreleased

Initial local release. Not published anywhere; built and installed locally
only.

### Added

- `palette.json`: canonical, editor-agnostic source of truth (named
  `colors`/`syntax`/`players` tokens) for both themes, `Madoe Night`
  (dark) and `Madoe Day` (light).
- `build.ts`, `scripts/zed.ts`, `scripts/vscode.ts`: generate the Zed
  theme, Ghostty configs, and VS Code color-theme JSON from
  `palette.json`, run directly via Node 24's native TypeScript
  type-stripping (no transpile step).
- Three editor/terminal ports built from the one palette:
  - Zed theme extension (`zed/`)
  - Ghostty terminal configs, `Madoe Night` and `Madoe Day` (`ghostty/`)
  - VS Code color theme extension, packaged as a local `.vsix` (`vscode/`)
- `LICENSE` (Apache-2.0) and `NOTICE` documenting the Grok Build and
  Tokyo Night provenance of the adapted colors.
