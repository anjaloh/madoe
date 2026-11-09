import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Read the top-level `version` of a TOML manifest. */
export function tomlVersion(text: string): string {
  const match = /^version\s*=\s*"([^"]+)"/m.exec(text);
  if (!match) throw new Error("No version in TOML manifest");
  return match[1];
}

/** Return the shared version, or fail when the manifests do not agree. */
export function sameVersion(versions: Record<string, string>): string {
  const values = new Set(Object.values(versions));
  if (values.size !== 1) {
    const list = Object.entries(versions).map(([file, version]) => `${file} ${version}`);
    throw new Error(`Versions differ: ${list.join(", ")}`);
  }
  return [...values][0];
}

/** Read the version of each manifest that ships Madoe. */
export async function manifestVersions(root: string): Promise<Record<string, string>> {
  const json = async (file: string): Promise<string> =>
    (JSON.parse(await readFile(join(root, file), "utf8")) as { version: string }).version;
  return {
    "package.json": await json("package.json"),
    "vscode/package.json": await json("vscode/package.json"),
    "zed/extension.toml": tomlVersion(await readFile(join(root, "zed/extension.toml"), "utf8")),
  };
}
