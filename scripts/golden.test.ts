import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { ghosttyTheme } from "./ghostty.ts";
import { t3codeTheme } from "./t3code.ts";
import { variant } from "./test-palette.ts";
import { vscodeTheme } from "./vscode.ts";
import { zedTheme } from "./zed.ts";

// The committed theme files are the reviewed, installed output. Each full mapping must agree with them.
const committed = (file: string): string =>
  readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const plain = (value: unknown): unknown => JSON.parse(JSON.stringify(value));
const variants = [
  { name: "Madoe Night", file: "night" },
  { name: "Madoe Day", file: "day" },
] as const;

test("zedTheme agrees with the committed Zed theme for each variant", () => {
  const expected = JSON.parse(committed("zed/themes/madoe.json")) as { themes: unknown[] };
  assert.deepEqual(plain(variants.map(({ name }) => zedTheme(variant(name)))), expected.themes);
});

test("t3codeTheme agrees with the committed T3 Code theme", () => {
  const expected: unknown = JSON.parse(committed("t3code/madoe.json"));
  assert.deepEqual(plain(t3codeTheme(variant("Madoe Night"), variant("Madoe Day"))), expected);
});

for (const { name, file } of variants) {
  test(`vscodeTheme agrees with the committed VS Code theme for ${name}`, () => {
    const expected: unknown = JSON.parse(committed(`vscode/themes/madoe-${file}-color-theme.json`));
    assert.deepEqual(plain(vscodeTheme(variant(name))), expected);
  });

  test(`ghosttyTheme agrees with the committed Ghostty theme for ${name}`, () => {
    const expected = committed(`ghostty/${name}`);
    const header = expected.slice(0, expected.indexOf("\n"));
    assert.equal(ghosttyTheme(variant(name), header), expected);
  });
}
