# Madoe

Pronounced **MAD-oh**. A personal Night/Day color theme, ported to three
places from one JSON source: **Zed**, **Ghostty**, and **VS Code**.

Local-only for now: not pushed to a remote yet, built and installed by
hand. `palette.json` captures colors already adapted by the project author
across all three apps before this repo existed, so it's not a fresh 1:1
copy of any upstream theme's exact hex values — see
[Where the colors come from](#where-the-colors-come-from) and
[NOTICE](NOTICE) for the origin and licenses of what it builds on. No
trademark, sponsorship, or endorsement of any credited project is implied.

## Repository layout

| Path                             | Role                                                                                                                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `palette.json`                   | The only hand-edited color source. Flat, neutral, named color tokens (`colors`, `syntax`, `players`), not any one editor's schema — one `variants` entry each for `Madoe Night` (dark) and `Madoe Day` (light). |
| `build.ts`                       | Reads `palette.json` and deterministically (re)writes every generated file below.                                                                                                                               |
| `scripts/zed.ts`                 | Maps `palette.json`'s named `colors`/`syntax` tokens onto Zed's own dotted UI/scope keys. Used only by `build.ts`.                                                                                              |
| `scripts/vscode.ts`              | Maps `palette.json`'s named `colors`/`syntax` tokens onto the VS Code color-theme JSON schema. Used only by `build.ts`.                                                                                         |
| `zed/`                           | Zed extension: `extension.toml` (hand-written) + generated `themes/madoe.json` + generated `LICENSE`/`NOTICE`.                                                                                                  |
| `ghostty/`                       | Generated Ghostty theme fragments, `Madoe Night` and `Madoe Day`.                                                                                                                                               |
| `vscode/`                        | VS Code extension. `package.json`/`.vscodeignore` are hand-written; `themes/*-color-theme.json` plus copies of `LICENSE`/`NOTICE`/`README.md`/`CHANGELOG.md` are generated.                                     |
| `LICENSE`, `NOTICE`              | Project docs; `build.ts` copies both, verbatim, into `vscode/` and `zed/` so they ship inside each packaged extension.                                                                                          |
| `CHANGELOG.md`, this `README.md` | Project docs; `build.ts` copies both into `vscode/`.                                                                                                                                                            |

### Generated files are committed on purpose

`zed/themes/madoe.json`, `ghostty/Madoe Night`, `ghostty/Madoe Day`, and the
generated files under `vscode/` and `zed/` (see table above) are checked
into git, not gitignored — so this repo is directly usable (copy a file,
install a `.vsix`) without anyone having to run the build first.
`build.ts` is how they get regenerated after a `palette.json` edit;
`node build.ts --check` (or `npm run check`)
re-derives the same output in memory and fails if any committed file
doesn't match `palette.json`, without writing anything, so drift is
detectable in a read-only way.

## Requirements

- **Node.js >= 24** — `build.ts`, `scripts/zed.ts`, and `scripts/vscode.ts`
  are plain TypeScript run directly via Node 24's native type-stripping.
  There is no transpile step and no `npm install` needed just to build,
  check, or copy files around.
- **Bun** (optional) — only needed for `npm run package:vscode`, which
  shells out to `bunx @vscode/vsce` to produce the `.vsix`.
- For development only (editing `build.ts`/`scripts/zed.ts`/
  `scripts/vscode.ts` with type checking): `npm install` followed by
  `npm run typecheck`, which pulls in `typescript` and `@types/node` as
  dev dependencies. Neither is required to build or package.

## Build

```sh
npm run build        # same as: node build.ts
npm run check        # same as: node build.ts --check (read-only, no writes)
```

`build.ts` rewrites `zed/themes/madoe.json`, both `ghostty/Madoe *` files,
`vscode/themes/madoe-{night,day}-color-theme.json`, and copies
`LICENSE`/`NOTICE`/`README.md`/`CHANGELOG.md` into `vscode/` and (license
and notice) into `zed/`. Run `npm run build` after any `palette.json`
change, then commit the regenerated files alongside it.

## Package the VS Code extension

```sh
npm run package:vscode
```

This rebuilds first, then runs `bunx @vscode/vsce package
--allow-missing-repository --no-rewrite-relative-links` from inside
`vscode/`, producing `dist/madoe-0.1.0.vsix`. These options keep packaging
local without inventing a repository URL. Relative documentation links
are left unchanged; licenses and notices are included in the VSIX.
Nothing is published to any registry.

## Install — Zed

```sh
mkdir -p ~/.config/zed/themes
cp zed/themes/madoe.json ~/.config/zed/themes/
```

Then set the theme in `~/.config/zed/settings.json`, either a fixed theme:

```json
"theme": "Madoe Night"
```

or the light/dark pair so Zed follows the system appearance:

```json
"theme": { "mode": "system", "light": "Madoe Day", "dark": "Madoe Night" }
```

## Install — Ghostty

The generated `ghostty/Madoe Night` and `ghostty/Madoe Day` files are
**theme fragments** (palette/background/foreground/cursor/selection only),
not full Ghostty configs — they intentionally don't touch
`background-opacity`, window decorations, fonts, or anything else in your
main config, so your existing opacity setting is preserved as-is. Selection
colors are emitted as solid RGB (matching your existing Ghostty port),
not the alpha-blended value some Zed themes use for selection.

On macOS, Ghostty's config directory is usually
`~/Library/Application Support/com.mitchellh.ghostty/` unless you already
use `~/.config/ghostty/` (XDG) — use whichever one your existing config
already lives in; below assumes the XDG path, substitute the other if
that's the one you have.

```sh
mkdir -p ~/.config/ghostty/themes
cp "ghostty/Madoe Night" "ghostty/Madoe Day" ~/.config/ghostty/themes/
```

Then in your Ghostty `config` file, point at both so Ghostty switches with
the system/terminal appearance, leaving everything else (including
`background-opacity`) untouched:

```
theme = light:Madoe Day,dark:Madoe Night
```

## Install — VS Code

```sh
npm run package:vscode
code --install-extension dist/madoe-0.1.0.vsix
```

Then in VS Code settings:

```json
"workbench.preferredDarkColorTheme": "Madoe Night",
"workbench.preferredLightColorTheme": "Madoe Day",
"window.autoDetectColorScheme": true
```

(Drop `window.autoDetectColorScheme` and just set
`workbench.colorTheme` if you don't want automatic light/dark switching.)

## Platform differences

The three platforms don't share a rendering model, so `build.ts` adapts
the same colors rather than copy-pasting values:

- **Zed** wants its own nested `style`/`players`/`syntax` object with
  dotted UI keys; `scripts/zed.ts` maps `palette.json`'s named `colors`/
  `syntax` tokens onto that shape, and `build.ts` wraps the result with
  Zed's `$schema`/`name`/`author` envelope.
- **Ghostty** wants a flat `palette = N = #hex` ANSI table plus a handful
  of named keys; `build.ts` derives that table directly from
  `palette.json`'s `terminalAnsi*` color tokens and truncates the alpha
  channel off the selection color (Ghostty's `selection-background` is
  solid, not translucent).
- **VS Code** wants nested `colors`/`tokenColors` objects keyed by its own
  UI/scope names; `scripts/vscode.ts` maps `palette.json`'s named
  `colors`/`syntax` tokens onto that shape.

## Where the colors come from

`palette.json`'s neutral background/foreground/gutter grayscale ramp and
overall structure trace back to **Grok Build**'s `GrokNight`/`GrokDay`
terminal themes (`xai-org/grok-build` on GitHub, Apache License 2.0,
Copyright 2023-2026 SpaceXAI). The colored accents layered on top (syntax
highlighting, links, selection) trace back to the original **Tokyo Night**
VS Code theme (`tokyo-night/tokyo-night-vscode-theme`, formerly published
as `enkia/tokyo-night-vscode-theme`, MIT License, Copyright (c) 2018-present
Enkia), which Grok Build itself converts into its bundled `.tmTheme`
assets.

Both are unaffiliated, unmodified-license upstream projects; Madoe is not
produced or reviewed by either. Exact file paths, pinned commits, and the
full text of both licenses (Apache-2.0 and MIT) are recorded in
[NOTICE](NOTICE); the project as a whole is licensed under
[Apache-2.0](LICENSE).
