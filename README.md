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
| `scripts/ghostty.ts`             | Writes the Ghostty theme fragment for one variant. Used only by `build.ts`.                                                                                                                                     |
| `scripts/theme.ts`               | Shared `Theme` type. Resolves color and syntax tokens, and stops the build when a token is not in `palette.json`.                                                                                               |
| `scripts/version.ts`             | Reads the version of each manifest. The build stops when the versions are different.                                                                                                                            |
| `scripts/*.test.ts`              | Unit tests for the mappings, run with `node --test`. `scripts/test-palette.ts` gives the tests a copy of each `palette.json` variant.                                                                           |
| `stryker.config.json`            | Stryker mutation testing for `scripts/`. It does not copy `tsconfig.json`, because Stryker cannot read it with TypeScript 7.                                                                                    |
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

- **Node.js >= 26** — `build.ts` and the files in `scripts/`
  are plain TypeScript run directly via Node 26's native type-stripping.
  There is no transpile step and no `npm install` needed just to build,
  check, or copy files around.
- **Bun** (optional) — only needed for `npm run package:vscode`, which
  shells out to `bunx @vscode/vsce` to produce the `.vsix`.
- For development only: run `npm install` to get the dev dependencies
  (`typescript`, `@types/node`, `oxlint`, `oxlint-tsgolint`, `oxfmt`, and Stryker).
  You do not need them to build or package.

## Development

Before you commit, run these commands. Each command must pass:

```sh
npm test             # unit tests (node --test)
npm run typecheck    # tsc --noEmit
npm run lint         # Oxlint, with type-aware rules
npm run fmt:check    # Oxfmt, read-only (npm run fmt writes the changes)
npm run check        # the generated files agree with palette.json
npm run mutate       # Stryker mutation testing (about 10 seconds)
```

Oxfmt does not format the generated files. Their format comes from `build.ts`.

`npm run mutate` changes the code in `scripts/` and runs the tests for each change. Each change that the tests do not find is a missing test. The command fails when the mutation score is less than 100%. If a mutant cannot change the behavior, disable it with a `// Stryker disable next-line <mutator>: <reason>` comment. The HTML report is in `reports/mutation/mutation.html`.

`scripts/golden.test.ts` compares the output of each mapping with the committed theme files. If you change a mapping on purpose, run `npm run build` before `npm test`.

The build stops with an error in these conditions:

- A mapping in `scripts/` refers to a color or syntax token that is not in `palette.json`.
- `package.json`, `vscode/package.json`, and `zed/extension.toml` have different versions.

To release a new version, change the version in all three manifests.

### Continuous integration

`.github/workflows/ci.yml` runs the commands above on each push to `main` and on each pull request:

- **test:** `npm test` and `npm run check`.
- **quality:** `typecheck`, `lint`, `fmt:check`, and `mutate`. The Stryker report is an artifact (`mutation-report`).
- **package:** After the other jobs pass, it runs `npm run package:vscode`. It fails if the committed files change. The VSIX is an artifact (`madoe-vsix`).

Each action is pinned to a commit SHA. All jobs use the Node version in `.node-version`. Dependabot (`.github/dependabot.yml`) updates the actions and the npm packages each week.

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
`vscode/`, producing `dist/madoe-<version>.vsix` (for example,
`dist/madoe-0.1.0.vsix`). The version comes from `package.json`. These options keep packaging
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
