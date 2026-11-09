import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ghosttyTheme } from './ghostty.ts';
import { variant } from './test-palette.ts';

const header = '# A header line.';

test('ghosttyTheme writes the ANSI table, the named keys, and a solid selection', () => {
  assert.equal(
    ghosttyTheme(variant('Madoe Night'), header),
    `${header}
# Generated from palette.json by node build.ts.

palette = 0 = #141414
palette = 1 = #f7768e
palette = 2 = #9ece6a
palette = 3 = #e0af68
palette = 4 = #7aa2f7
palette = 5 = #bb9af7
palette = 6 = #7dcfff
palette = 7 = #c8c8c8
palette = 8 = #5a5a5a
palette = 9 = #ff5370
palette = 10 = #9ece6a
palette = 11 = #ffdb69
palette = 12 = #7aa2f7
palette = 13 = #bb9af7
palette = 14 = #7dcfff
palette = 15 = #e1e1e1
background = #0a0a0a
foreground = #c8c8c8
cursor-color = #c8c8c8
cursor-text = #0a0a0a
selection-background = #383838
selection-foreground = #e1e1e1
`,
  );
});

test('ghosttyTheme fails when an ANSI color token is missing from the palette', () => {
  const theme = variant('Madoe Day');
  delete theme.colors.terminalAnsiBrightCyan;
  assert.throws(() => ghosttyTheme(theme, header), {
    message: 'Unknown color token "terminalAnsiBrightCyan" in Madoe Day',
  });
});
