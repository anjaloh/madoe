export interface Highlight {
  foreground: string;
  italic?: boolean;
  bold?: boolean;
  underline?: boolean;
}

export interface Theme {
  name: string;
  appearance: 'dark' | 'light';
  colors: Record<string, string>;
  syntax: Record<string, Highlight>;
  players: Array<{ cursor: string; background: string; selection: string }>;
}

export interface Style {
  foreground: string;
  italic: boolean;
  bold: boolean;
  underline: boolean;
}

/** Resolve a color token, so that a mapping to a missing token fails the build. */
export function color(theme: Theme, token: string): string {
  const value = theme.colors[token];
  if (value === undefined) throw new Error(`Unknown color token "${token}" in ${theme.name}`);
  return value;
}

/** Resolve a syntax token to its color and font style. */
export function highlight(theme: Theme, token: string): Style {
  const source = theme.syntax[token];
  if (source === undefined) throw new Error(`Unknown syntax token "${token}" in ${theme.name}`);
  return {
    foreground: color(theme, source.foreground),
    italic: source.italic ?? false,
    bold: source.bold ?? false,
    underline: source.underline ?? false,
  };
}
