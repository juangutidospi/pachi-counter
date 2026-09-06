/**
 * Escapa una cadena para interpolarla de forma segura dentro de HTML.
 * Se usa siempre que se inyecta contenido controlado por el usuario
 * (nombres de contadores, notas…) en los templates.
 *
 * @param {unknown} value Valor a escapar (se convierte a string).
 * @returns {string} Cadena con `& < > " '` escapados.
 */
export function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
