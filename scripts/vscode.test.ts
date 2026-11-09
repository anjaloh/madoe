import assert from "node:assert/strict";
import { test } from "node:test";
import { variant } from "./test-palette.ts";
import { vscodeTheme } from "./vscode.ts";

test("vscodeTheme maps palette tokens to VS Code UI colors", () => {
  const theme = vscodeTheme(variant("Madoe Day"));
  assert.equal(theme.name, "Madoe Day");
  assert.equal(theme.type, "light");
  assert.equal(theme.colors["editor.background"], "#f6f6f6");
  assert.equal(theme.colors["terminal.ansiRed"], "#cd3048");
  assert.equal(theme.colors["editorCursor.foreground"], "#262626");
  assert.equal(theme.colors["editor.selectionBackground"], "#c0c0c07a");
});

test("vscodeTheme writes TextMate rules and semantic tokens with font styles", () => {
  const theme = vscodeTheme(variant("Madoe Night"));
  const comment = theme.tokenColors.find((rule) => rule.name === "comment");
  assert.deepEqual(comment?.settings, { foreground: "#51597d", fontStyle: "italic" });
  const keyword = theme.tokenColors.find((rule) => rule.name === "keyword");
  assert.deepEqual(keyword?.settings, { foreground: "#bb9af7", fontStyle: "" });
  assert.deepEqual(theme.semanticTokenColors.comment, {
    foreground: "#51597d",
    italic: true,
    bold: false,
    underline: false,
  });
});

test("vscodeTheme fails when a mapped color token is missing from the palette", () => {
  const theme = variant("Madoe Night");
  delete theme.colors.terminalAnsiRed;
  assert.throws(() => vscodeTheme(theme), {
    message: 'Unknown color token "terminalAnsiRed" in Madoe Night',
  });
});
