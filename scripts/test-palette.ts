import { readFileSync } from 'node:fs';
import type { Theme } from './theme.ts';

const palette: { variants: Theme[] } = JSON.parse(
  readFileSync(new URL('../palette.json', import.meta.url), 'utf8'),
);

/** Return a deep copy of a palette variant, so that a test can change it. */
export function variant(name: 'Madoe Night' | 'Madoe Day'): Theme {
  const theme = palette.variants.find((candidate) => candidate.name === name);
  if (!theme) throw new Error(`No variant ${name} in palette.json`);
  return structuredClone(theme);
}
