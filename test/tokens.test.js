import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Prefijos de tokens de tema que deben estar definidos en tokens.css. */
const THEME_PREFIXES = ['--color-', '--space-', '--radius-', '--shadow-', '--font-'];

/**
 * Recorre un directorio recursivamente devolviendo rutas de archivos.
 * @param {string} dir Directorio raíz.
 * @param {(f: string) => boolean} match Filtro por ruta.
 * @returns {string[]} Rutas coincidentes.
 */
function walk(dir, match) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full, match));
    else if (match(full)) out.push(full);
  }
  return out;
}

test('todos los tokens de tema usados están definidos en tokens.css', () => {
  const tokensCss = readFileSync(join(root, 'css', 'tokens.css'), 'utf8');
  const defined = new Set([...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));

  const sources = [
    join(root, 'index.html'),
    ...walk(join(root, 'js'), (f) => f.endsWith('.css.js') || f.endsWith('.js')),
    join(root, 'css', 'tokens.css'),
  ];

  const used = new Set();
  for (const file of sources) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(/var\((--[a-z0-9-]+)/g)) {
      if (THEME_PREFIXES.some((p) => m[1].startsWith(p))) used.add(m[1]);
    }
  }

  const missing = [...used].filter((token) => !defined.has(token));
  assert.deepEqual(missing, [], `Tokens usados sin definir en tokens.css: ${missing.join(', ')}`);
});

test('el tema claro redefine los tokens estructurales de superficie', () => {
  const tokensCss = readFileSync(join(root, 'css', 'tokens.css'), 'utf8');
  const lightBlock = tokensCss.slice(tokensCss.indexOf('[data-theme="light"]'));
  for (const token of ['--color-bg', '--color-surface', '--color-text', '--color-accent']) {
    assert.ok(lightBlock.includes(token), `El tema claro no redefine ${token}`);
  }
});
