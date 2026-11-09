import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sameVersion, tomlVersion } from './version.ts';

test('tomlVersion reads the top-level version of a Zed extension manifest', () => {
  assert.equal(tomlVersion('id = "madoe"\nversion = "1.2.3"\nschema_version = 1\n'), '1.2.3');
});

test('tomlVersion fails when the manifest has no version', () => {
  assert.throws(() => tomlVersion('id = "madoe"\nschema_version = 1\n'), {
    message: 'No version in TOML manifest',
  });
});

test('sameVersion returns the version when all manifests agree', () => {
  assert.equal(sameVersion({ 'package.json': '0.1.0', 'vscode/package.json': '0.1.0' }), '0.1.0');
});

test('sameVersion fails and lists each manifest when the versions differ', () => {
  assert.throws(
    () =>
      sameVersion({
        'package.json': '0.2.0',
        'vscode/package.json': '0.1.0',
        'zed/extension.toml': '0.2.0',
      }),
    {
      message:
        'Versions differ: package.json 0.2.0, vscode/package.json 0.1.0, zed/extension.toml 0.2.0',
    },
  );
});
