import assert from "node:assert/strict";
import { test } from "node:test";
import { color, highlight } from "./theme.ts";
import { variant } from "./test-palette.ts";

test("color returns the hex value of a palette token", () => {
  assert.equal(color(variant("Madoe Night"), "editorBackground"), "#0e0e0e");
  assert.equal(color(variant("Madoe Day"), "editorBackground"), "#f6f6f6");
});

test("color fails with the token and variant name when the token is unknown", () => {
  assert.throws(() => color(variant("Madoe Night"), "noSuchToken"), {
    message: 'Unknown color token "noSuchToken" in Madoe Night',
  });
});

test("highlight resolves the foreground and keeps the font style", () => {
  assert.deepEqual(highlight(variant("Madoe Night"), "comment"), {
    foreground: "#51597d",
    italic: true,
    bold: false,
    underline: false,
  });
});

test("highlight fails with the token and variant name when the syntax token is unknown", () => {
  assert.throws(() => highlight(variant("Madoe Day"), "noSuchSyntax"), {
    message: 'Unknown syntax token "noSuchSyntax" in Madoe Day',
  });
});

test("highlight fails when a syntax token points to an unknown color token", () => {
  const theme = variant("Madoe Night");
  theme.syntax.comment.foreground = "missingColor";
  assert.throws(() => highlight(theme, "comment"), {
    message: 'Unknown color token "missingColor" in Madoe Night',
  });
});
