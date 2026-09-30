import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { vscodeTheme, type Theme } from './scripts/vscode.ts';
import { zedTheme } from './scripts/zed.ts';

const root = dirname(fileURLToPath(import.meta.url));
const check = process.argv.includes('--check');
const palette: { name: string; author: string; variants: Theme[] } = JSON.parse(await readFile(join(root, 'palette.json'), 'utf8'));
const notice = 'Modified by anjaloh: Madoe adapts Grok Build themes with Tokyo Night accents. See NOTICE and LICENSE.';
const files = new Map<string, string>();
const json = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

files.set('zed/themes/madoe.json', json({
  $schema: 'https://zed.dev/schema/themes/v0.2.0.json',
  name: palette.name,
  author: `${palette.author}; modified for Madoe`,
  themes: palette.variants.map(zedTheme),
}));
const ansi = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
for (const theme of palette.variants) {
  const colors = theme.colors;
  const player = theme.players[0];
  const lines = [`# ${notice}`, `# Generated from palette.json by node build.ts.`, ''];
  for (const [index, color] of ansi.entries()) {
    lines.push(`palette = ${index} = ${colors[`terminalAnsi${color[0].toUpperCase()}${color.slice(1)}`]}`);
  }
  for (const [index, color] of ansi.entries()) {
    lines.push(`palette = ${index + 8} = ${colors[`terminalAnsiBright${color[0].toUpperCase()}${color.slice(1)}`]}`);
  }
  lines.push(
    `background = ${colors.terminalBackground}`,
    `foreground = ${colors.terminalForeground}`,
    `cursor-color = ${colors[player.cursor]}`,
    `cursor-text = ${colors.terminalBackground}`,
    // Preserve the existing Ghostty port's solid selection, not an alpha blend.
    `selection-background = ${colors[player.selection].slice(0, 7)}`,
    `selection-foreground = ${colors.terminalBrightForeground}`,
  );
  files.set(`ghostty/${theme.name}`, `${lines.join('\n')}\n`);
  const variant = theme.appearance === 'dark' ? 'night' : 'day';
  files.set(`vscode/themes/madoe-${variant}-color-theme.json`, json(vscodeTheme(theme)));
}
// Include provenance and full licenses in each distributable editor extension.
for (const name of ['LICENSE', 'NOTICE']) {
  const text = await readFile(join(root, name), 'utf8');
  files.set(`vscode/${name}`, text);
  files.set(`zed/${name}`, text);
}
files.set('vscode/README.md', await readFile(join(root, 'README.md'), 'utf8'));
files.set('vscode/CHANGELOG.md', await readFile(join(root, 'CHANGELOG.md'), 'utf8'));

let stale = false;
for (const [relative, content] of files) {
  const path = join(root, relative);
  if (check) {
    const actual = await readFile(path, 'utf8').catch((error) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
    if (actual !== content) {
      console.error(`Stale or missing: ${relative}`);
      stale = true;
    }
  } else {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
}
if (stale) process.exitCode = 1;
else console.log(`${check ? 'Checked' : 'Generated'} ${files.size} files for Madoe Night and Madoe Day.`);
