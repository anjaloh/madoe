import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ghosttyTheme } from "./scripts/ghostty.ts";
import type { Theme } from "./scripts/theme.ts";
import { t3codeTheme } from "./scripts/t3code.ts";
import { manifestVersions, sameVersion } from "./scripts/version.ts";
import { vscodeTheme } from "./scripts/vscode.ts";
import { zedTheme } from "./scripts/zed.ts";

const root = dirname(fileURLToPath(import.meta.url));
const check = process.argv.includes("--check");
sameVersion(await manifestVersions(root));
const palette: { name: string; author: string; variants: Theme[] } = JSON.parse(
  await readFile(join(root, "palette.json"), "utf8"),
);
const notice =
  "Modified by anjaloh: Madoe adapts Grok Build themes with Tokyo Night accents. See NOTICE and LICENSE.";
const files = new Map<string, string>();
const json = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

files.set(
  "zed/themes/madoe.json",
  json({
    $schema: "https://zed.dev/schema/themes/v0.2.0.json",
    name: palette.name,
    author: `${palette.author}; modified for Madoe`,
    themes: palette.variants.map(zedTheme),
  }),
);
for (const theme of palette.variants) {
  files.set(`ghostty/${theme.name}`, ghosttyTheme(theme, `# ${notice}`));
  const variant = theme.appearance === "dark" ? "night" : "day";
  files.set(`vscode/themes/madoe-${variant}-color-theme.json`, json(vscodeTheme(theme)));
}
const appearance = (name: Theme["appearance"]): Theme => {
  const theme = palette.variants.find((candidate) => candidate.appearance === name);
  if (!theme) throw new Error(`palette.json has no ${name} variant`);
  return theme;
};
files.set("t3code/madoe.json", json(t3codeTheme(appearance("dark"), appearance("light"))));
// Include provenance and full licenses in each distributable editor extension.
for (const name of ["LICENSE", "NOTICE"]) {
  const text = await readFile(join(root, name), "utf8");
  files.set(`vscode/${name}`, text);
  files.set(`zed/${name}`, text);
}
files.set("vscode/README.md", await readFile(join(root, "README.md"), "utf8"));
files.set("vscode/CHANGELOG.md", await readFile(join(root, "CHANGELOG.md"), "utf8"));

let stale = false;
for (const [relative, content] of files) {
  const path = join(root, relative);
  if (check) {
    const actual = await readFile(path, "utf8").catch((error) => {
      if (error.code === "ENOENT") return null;
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
else
  console.log(
    `${check ? "Checked" : "Generated"} ${files.size} files for Madoe Night and Madoe Day.`,
  );
