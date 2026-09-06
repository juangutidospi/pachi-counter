/**
 * Helper de tag template `css` → construye una CSSStyleSheet adoptable.
 * Permite escribir estilos con nesting nativo del navegador y reutilizarlos
 * como hoja compartida entre instancias del mismo componente.
 *
 * @param {TemplateStringsArray} strings Fragmentos literales del template.
 * @param {...unknown} values Interpolaciones (se convierten a string).
 * @returns {CSSStyleSheet} Hoja de estilos lista para `adoptedStyleSheets`.
 */
export function css(strings, ...values) {
  const text = strings.reduce((acc, str, i) => acc + str + (i < values.length ? String(values[i]) : ''), '');
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(text);
  return sheet;
}
