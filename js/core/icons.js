/**
 * Catálogo de iconos como paths SVG (24×24, trazo).
 * Se dividen en dos grupos: iconos de contador (elegibles al crear) y
 * iconos de interfaz (engranaje, volver, compartir…).
 */

/**
 * Iconos temáticos elegibles para un contador (24×24, trazo).
 * Incluye vicios/hábitos frecuentes que la gente deja: tabaco, alcohol,
 * azúcar, comida rápida, apuestas, pantallas… además de hábitos que se
 * construyen (deporte, lectura, agua…).
 */
export const COUNTER_ICONS = {
  ban: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM6.4 6.4 17.6 17.6',
  cig: 'M4 15h11.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H4zM13 15v3M19.8 8.2c-1.3 1-1.3 2.4 0 3.4M17 8.2c-1.3 1-1.3 2.4 0 3.4',
  bottle: 'M10.2 3.5h3.6v3l1.1 2.2v10.3a1.5 1.5 0 0 1-1.5 1.5h-2.8a1.5 1.5 0 0 1-1.5-1.5V8.7l1.1-2.2zM9.4 13h5.2',
  wine: 'M8.2 4h7.6l-1 5.4a2.8 2.8 0 0 1-5.6 0zM12 14.5v5M9 20.5h6',
  cup: 'M5 8.5h10.5v4.2A5.2 5.2 0 0 1 5 12.7zM15.5 9.5h1.6a2 2 0 0 1 0 4h-1.6M8 4.2v2M11.5 4.2v2',
  pill: 'M6 12a4 4 0 0 1 4-4h4a4 4 0 0 1 0 8h-4a4 4 0 0 1-4-4zM12 8.2v7.6',
  dice: 'M6 4.5h12a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5zM9 9h.01M15 9h.01M12 12h.01M9 15h.01M15 15h.01',
  burger: 'M4.5 9.5a7.5 5 0 0 1 15 0zM4.5 9.5h15M12 13.2h6.5a3.5 3.5 0 0 1-3.5 3.3H9a3.5 3.5 0 0 1-3.5-3.3H9',
  sugar: 'M6.5 8.5 12 5l5.5 3.5v7L12 19l-5.5-3.5zM12 5v14M6.5 8.5 12 12l5.5-3.5',
  phone: 'M8.5 3.5h7a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19V5a1.5 1.5 0 0 1 1.5-1.5zM10.5 17.5h3',
  tv: 'M5 8h14a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 19 18H5a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 5 8zM9 21h6M12 4.5 15 8M12 4.5 9 8',
  money: 'M4 6.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M6.5 9.5h.01M17.5 14.5h.01',
  bolt: 'M13 3 5.5 13.2H11l-1 7.8 8-11H12z',
  drop: 'M12 3.6c3.3 3.6 5.4 6.3 5.4 9A5.4 5.4 0 0 1 12 18a5.4 5.4 0 0 1-5.4-5.4c0-2.7 2.1-5.4 5.4-9z',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z',
  heart: 'M12 20.2C7.6 16.9 5 14 5 10.9A3.9 3.9 0 0 1 12 8.5 3.9 3.9 0 0 1 19 10.9c0 3.1-2.6 6-7 9.3z',
  book: 'M6 4.5h7.5a3 3 0 0 1 3 3v12H9a3 3 0 0 1-3-3zM16.5 7.5H18v12',
  leaf: 'M19.5 4.5C10 4.5 5 8.8 5 14a5 5 0 0 0 5 5c5.2 0 9.5-5 9.5-14.5zM9 19c1.4-3.8 3.6-6.4 7-8.3',
  weight: 'M4.5 10v4M19.5 10v4M7.5 7.5v9M16.5 7.5v9M7.5 12h9',
};

/** Iconos de interfaz. */
export const UI_ICONS = {
  gear: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.4-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.8 1.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  back: 'M15 18l-6-6 6-6',
  share: 'M12 15V3m0 0L8 7m4-4 4 4M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5',
  shelf: 'M4 5h16v14H4zM9 5v14M15 5v14',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
};

/**
 * Devuelve el markup SVG de un icono de contador.
 * @param {string} key Clave dentro de COUNTER_ICONS.
 * @param {number} [size] Tamaño en px (por defecto 20).
 * @returns {string} SVG como cadena HTML.
 */
export function counterIcon(key, size = 20) {
  return svg(COUNTER_ICONS[key] || COUNTER_ICONS.bolt, size, 1.9);
}

/**
 * Devuelve el markup SVG de un icono de interfaz.
 * @param {string} key Clave dentro de UI_ICONS.
 * @param {number} [size] Tamaño en px (por defecto 17).
 * @returns {string} SVG como cadena HTML.
 */
export function uiIcon(key, size = 17) {
  return svg(UI_ICONS[key] || UI_ICONS.gear, size, 2.1);
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
