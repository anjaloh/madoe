import assert from "node:assert/strict";
import { test } from "node:test";
import { variant } from "./test-palette.ts";
import { zedTheme } from "./zed.ts";

test("zedTheme maps palette tokens to Zed keys", () => {
  const theme = zedTheme(variant("Madoe Night"));
  assert.equal(theme.name, "Madoe Night");
  assert.equal(theme.appearance, "dark");
  const style: Record<string, unknown> = theme.style;
  assert.equal(style["editor.background"], "#0e0e0e");
  assert.deepEqual(theme.style.syntax.comment, { color: "#51597d", font_style: "italic" });
  assert.deepEqual(theme.style.syntax.keyword, { color: "#bb9af7" });
  assert.deepEqual(theme.style.players[0], {
    cursor: "#c8c8c8",
    background: "#c8c8c8",
    selection: "#3838387a",
  });
});

test("zedTheme fails when a mapped color token is missing from the palette", () => {
  const theme = variant("Madoe Day");
  delete theme.colors.editorBackground;
  assert.throws(() => zedTheme(theme), {
    message: 'Unknown color token "editorBackground" in Madoe Day',
  });
});

test("zedTheme fails when a player points to a missing color token", () => {
  const theme = variant("Madoe Night");
  theme.players[0].selection = "missingSelection";
  assert.throws(() => zedTheme(theme), {
    message: 'Unknown color token "missingSelection" in Madoe Night',
  });
});
