import { color, type Theme } from './theme.ts';

const ansi = ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White'];

/** Export one neutral palette variant as a Ghostty theme fragment. */
export function ghosttyTheme(theme: Theme, header: string): string {
  const player = theme.players[0];
  const lines = [header, '# Generated from palette.json by node build.ts.', ''];
  for (const [index, name] of ansi.entries()) {
    lines.push(`palette = ${index} = ${color(theme, `terminalAnsi${name}`)}`);
  }
  for (const [index, name] of ansi.entries()) {
    lines.push(`palette = ${index + 8} = ${color(theme, `terminalAnsiBright${name}`)}`);
  }
  lines.push(
    `background = ${color(theme, 'terminalBackground')}`,
    `foreground = ${color(theme, 'terminalForeground')}`,
    `cursor-color = ${color(theme, player.cursor)}`,
    `cursor-text = ${color(theme, 'terminalBackground')}`,
    // Preserve the existing Ghostty port's solid selection, not an alpha blend.
    `selection-background = ${color(theme, player.selection).slice(0, 7)}`,
    `selection-foreground = ${color(theme, 'terminalBrightForeground')}`,
  );
  return `${lines.join('\n')}\n`;
}
