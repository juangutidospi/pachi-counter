/**
 * Catálogo de iconos como paths SVG (24×24, trazo).
 * Se dividen en dos grupos: iconos de contador (elegibles al crear) y
 * iconos de interfaz (engranaje, volver, compartir…).
 */

/** Iconos temáticos elegibles para un contador. */
export const COUNTER_ICONS = {
  ban: 'M5.6 5.6 18.4 18.4M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
  bolt: 'M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z',
  drop: 'M12 3.2c3.4 3.6 5.6 6.3 5.6 9.1A5.6 5.6 0 0 1 12 18a5.6 5.6 0 0 1-5.6-5.7c0-2.8 2.2-5.5 5.6-9.1z',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z',
  heart: 'M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8.4 3.8 3.8 0 0 1 19 10.8C19 15.6 12 20 12 20z',
  book: 'M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM17 7h2v13',
  leaf: 'M20 4C10 4 5 8.5 5 14a5 5 0 0 0 5 5c5.5 0 10-5 10-15zM9 19c1.5-4 3.8-6.6 7-8.5',
  weight: 'M4 9v6M20 9v6M7 7v10M17 7v10M7 12h10',
};

/** Iconos de interfaz. */
export const UI_ICONS = {
  gear: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.4-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.8 1.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  back: 'M15 18l-6-6 6-6',
  share: 'M12 15V3m0 0L8 7m4-4 4 4M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5',
};

/**
 * Devuelve el markup SVG de un icono de contador.
 * @param {string} key Clave dentro de COUNTER_ICONS.
 * @param {number} [size] Tamaño en px (por defecto 20).
 * @returns {string} SVG como cadena HTML.
 */
export function counterIcon(key, size = 20) {
  return svg(COUNTER_ICONS[key] || COUNTER_ICONS.bolt, size, 1.6);
}

/**
 * Devuelve el markup SVG de un icono de interfaz.
 * @param {string} key Clave dentro de UI_ICONS.
 * @param {number} [size] Tamaño en px (por defecto 17).
 * @returns {string} SVG como cadena HTML.
 */
export function uiIcon(key, size = 17) {
  return svg(UI_ICONS[key] || UI_ICONS.gear, size, 1.7);
}

/**
 * Construye un SVG de trazo con un path.
 * @param {string} d Atributo `d` del path.
 * @param {number} size Tamaño en px.
 * @param {number} stroke Grosor del trazo.
 * @returns {string} SVG como cadena HTML.
 */
function svg(d, size, stroke) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
    `stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" style="display:block">` +
    `<path d="${d}"></path></svg>`;
}
