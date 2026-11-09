import assert from "node:assert/strict";
import { test } from "node:test";
import { t3codeColors, t3codeTheme } from "./t3code.ts";
import { variant } from "./test-palette.ts";

// A copy of THEME_COLOR_ROLES in pingdotgg/t3code at commit 4f0b74e. The T3 Code import rejects other roles.
const roles = [
  "canvas",
  "chrome",
  "toolbar",
  "toolbarForeground",
  "toolbarBorder",
  "toolbarControl",
  "toolbarControlForeground",
  "toolbarControlHover",
  "surface",
  "surfaceRaised",
  "surfaceOverlay",
  "text",
  "textMuted",
  "border",
  "input",
  "focus",
  "accent",
  "accentForeground",
  "secondary",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "placeholder",
  "secondaryLabel",
  "iconMuted",
  "error",
  "errorForeground",
  "errorSurface",
  "warning",
  "warningForeground",
  "warningSurface",
  "update",
  "updateForeground",
  "updateSurface",
  "accentSurface",
  "accentSurfaceForeground",
  "messageSurface",
  "messageForeground",
  "messageAction",
  "messageActionForeground",
  "messageActionHover",
  "codeBackground",
  "codeForeground",
  "searchMatchBackground",
  "searchMatchForeground",
  "searchMatchActiveBackground",
  "searchMatchActiveForeground",
  "sidebar",
  "sidebarForeground",
  "sidebarMutedForeground",
  "sidebarControlSurface",
  "sidebarRowHover",
  "sidebarRowActive",
  "sidebarRowSelected",
  "sidebarBorder",
  "terminalBackground",
  "terminalForeground",
  "terminalCursor",
  "terminalSelection",
  "terminalScrollbar",
  "terminalScrollbarHover",
];

test("t3codeColors maps exactly the T3 Code color roles, in order", () => {
  assert.deepEqual(Object.keys(t3codeColors(variant("Madoe Night"))), roles);
});

test("t3codeColors maps palette tokens to T3 Code roles", () => {
  const night = t3codeColors(variant("Madoe Night"));
  assert.equal(night.canvas, "#0e0e0e");
  assert.equal(night.focus, "#505058");
  assert.equal(night.accentForeground, "#0e0e0e");
  assert.equal(night.searchMatchActiveBackground, "#3d59a180");
  assert.equal(night.terminalCursor, "#c8c8c8");
  const day = t3codeColors(variant("Madoe Day"));
  assert.equal(day.sidebar, "#eaeaea");
  assert.equal(day.codeBackground, "#eaeaea");
  assert.equal(day.messageActionHover, "#2f64d2");
  assert.equal(day.terminalSelection, "#c0c0c07a");
  assert.equal(day.updateSurface, "#28448a1a");
});

test("t3codeTheme puts Night in colors and Day in variants.light", () => {
  const theme = t3codeTheme(variant("Madoe Night"), variant("Madoe Day"));
  const { colors, variants, ...header } = theme;
  assert.deepEqual(header, { version: 1, id: "madoe", name: "Madoe", appearance: "dark" });
  assert.deepEqual(Object.keys(theme), [
    "version",
    "id",
    "name",
    "appearance",
    "colors",
    "variants",
  ]);
  assert.equal(colors.canvas, "#0e0e0e");
  assert.equal(variants.light.canvas, "#f6f6f6");
});

test("t3codeTheme fails when the variants are swapped", () => {
  assert.throws(() => t3codeTheme(variant("Madoe Day"), variant("Madoe Night")), {
    message: 'T3 Code needs a dark base variant, but Madoe Day is "light"',
  });
});

test("t3codeTheme fails when the light variant is not light", () => {
  assert.throws(() => t3codeTheme(variant("Madoe Night"), variant("Madoe Night")), {
    message: 'T3 Code needs a light variant, but Madoe Night is "dark"',
  });
});

test("t3codeColors fails when a mapped color token is missing from the palette", () => {
  const theme = variant("Madoe Night");
  delete theme.colors.linkTextHover;
  assert.throws(() => t3codeColors(theme), {
    message: 'Unknown color token "linkTextHover" in Madoe Night',
  });
});
