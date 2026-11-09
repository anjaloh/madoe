import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { manifestVersions, sameVersion, tomlVersion } from "./version.ts";

test("tomlVersion reads the top-level version of a Zed extension manifest", () => {
  assert.equal(tomlVersion('id = "madoe"\nversion = "1.2.3"\nschema_version = 1\n'), "1.2.3");
});

test("tomlVersion reads a version without spaces around the equals sign", () => {
  assert.equal(tomlVersion('version="1.2.3"\n'), "1.2.3");
});

test("tomlVersion ignores keys that only end with version", () => {
  assert.equal(tomlVersion('schema_version = "9"\nversion = "1.2.3"\n'), "1.2.3");
});

test("manifestVersions reads the version of each manifest", async () => {
  const root = await mkdtemp(join(tmpdir(), "madoe-version-"));
  try {
    await mkdir(join(root, "vscode"));
    await mkdir(join(root, "zed"));
    await writeFile(join(root, "package.json"), '{ "version": "1.0.0" }');
    await writeFile(join(root, "vscode/package.json"), '{ "version": "2.0.0" }');
    await writeFile(join(root, "zed/extension.toml"), 'id = "madoe"\nversion = "3.0.0"\n');
    assert.deepEqual(await manifestVersions(root), {
      "package.json": "1.0.0",
      "vscode/package.json": "2.0.0",
      "zed/extension.toml": "3.0.0",
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("tomlVersion fails when the manifest has no version", () => {
  assert.throws(() => tomlVersion('id = "madoe"\nschema_version = 1\n'), {
    message: "No version in TOML manifest",
  });
});

test("sameVersion returns the version when all manifests agree", () => {
  assert.equal(sameVersion({ "package.json": "0.1.0", "vscode/package.json": "0.1.0" }), "0.1.0");
});

test("sameVersion fails and lists each manifest when the versions differ", () => {
  assert.throws(
    () =>
      sameVersion({
        "package.json": "0.2.0",
        "vscode/package.json": "0.1.0",
        "zed/extension.toml": "0.2.0",
      }),
    {
      message:
        "Versions differ: package.json 0.2.0, vscode/package.json 0.1.0, zed/extension.toml 0.2.0",
    },
  );
});
