import { test } from 'node:test';
import assert from 'node:assert/strict';
import { es } from '../js/i18n/es.js';
import { en } from '../js/i18n/en.js';

/**
 * Aplana un objeto de traducciones a un conjunto de claves con notación de
 * puntos (`a.b.c`), ignorando el valor.
 * @param {object} obj Diccionario anidado.
 * @param {string} [prefix] Prefijo acumulado.
 * @returns {Set<string>} Conjunto de claves hoja.
 */
function leafKeys(obj, prefix = '') {
  const keys = new Set();
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const k of leafKeys(value, path)) keys.add(k);
    } else {
      keys.add(path);
    }
  }
  return keys;
}

test('es y en tienen exactamente el mismo conjunto de claves', () => {
  const esKeys = leafKeys(es);
  const enKeys = leafKeys(en);
  const missingInEn = [...esKeys].filter((k) => !enKeys.has(k));
  const missingInEs = [...enKeys].filter((k) => !esKeys.has(k));
  assert.deepEqual(missingInEn, [], `Claves en es que faltan en en: ${missingInEn.join(', ')}`);
  assert.deepEqual(missingInEs, [], `Claves en en que faltan en es: ${missingInEs.join(', ')}`);
});

test('ningún valor de traducción está vacío', () => {
  for (const [lang, dict] of [['es', es], ['en', en]]) {
    for (const key of leafKeys(dict)) {
      const value = key.split('.').reduce((o, p) => o[p], dict);
      assert.ok(String(value).length > 0, `Valor vacío en ${lang}: ${key}`);
    }
  }
});
