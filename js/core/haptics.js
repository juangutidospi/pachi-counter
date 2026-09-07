/**
 * Vibración háptica ligera donde el navegador la soporte (Android/Chrome).
 * En iOS Safari `navigator.vibrate` no existe: la llamada se ignora sin error.
 *
 * @param {number|number[]} pattern Duración en ms o patrón de vibración.
 */
export function haptic(pattern) {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch (e) { /* no soportado */ }
}
