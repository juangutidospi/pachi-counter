import { es } from '../i18n/es.js';
import { en } from '../i18n/en.js';

const DICTS = { es, en };
const LANG_KEY = 'pachi.lang';
const bus = new EventTarget();

/** @type {'es'|'en'} Idioma activo. */
let current = detectInitial();

/**
 * Determina el idioma inicial: preferencia guardada → idioma del navegador → es.
 * @returns {'es'|'en'} Código de idioma soportado.
 */
function detectInitial() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && DICTS[saved]) return saved;
  } catch (e) { /* almacenamiento no disponible */ }
  const nav = (navigator.language || 'es').slice(0, 2);
  return DICTS[nav] ? nav : 'es';
}

/**
 * Traduce una clave al idioma activo, interpolando `{param}` con `params`.
 * Si la clave no existe, devuelve la propia clave (facilita detectar huecos).
 *
 * @param {string} key Clave con notación de puntos (p. ej. `home.title`).
 * @param {Record<string, unknown>} [params] Valores para interpolar.
 * @returns {string} Texto traducido.
 */
export function t(key, params) {
  const dict = DICTS[current] || es;
  let value = key.split('.').reduce((obj, part) => (obj && obj[part] != null ? obj[part] : null), dict);
  if (value == null) value = key;
  if (typeof value === 'function') value = value(params || {});
  if (typeof value === 'string' && params) {
    value = value.replace(/\{(\w+)\}/g, (m, name) => (params[name] != null ? String(params[name]) : m));
  }
  return String(value);
}

/**
 * Cambia el idioma activo, lo persiste y notifica a los componentes.
 * @param {'es'|'en'} lang Nuevo idioma.
 */
export function setLang(lang) {
  if (!DICTS[lang] || lang === current) return;
  current = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignorar */ }
  document.documentElement.lang = lang;
  bus.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
}

/** @returns {'es'|'en'} Idioma activo actual. */
export function getLang() { return current; }

/**
 * Suscribe un callback al cambio de idioma.
 * @param {() => void} handler Se ejecuta tras cada cambio.
 * @returns {() => void} Función para cancelar la suscripción.
 */
export function onI18nChanged(handler) {
  bus.addEventListener('i18n:changed', handler);
  return () => bus.removeEventListener('i18n:changed', handler);
}

document.documentElement.lang = current;
