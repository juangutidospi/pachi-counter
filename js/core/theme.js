/**
 * Gestor de tema (oscuro/claro). El tema oscuro es el diseño base; el claro
 * se activa poniendo `data-theme="light"` en <html>. La preferencia se
 * persiste y se aplica al cargar.
 */

const THEME_KEY = 'pachi.theme';
const bus = new EventTarget();

/** @type {'dark'|'light'} Tema activo. */
let current = loadInitial();

/** @returns {'dark'|'light'} Tema guardado o el oscuro por defecto. */
function loadInitial() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) { /* almacenamiento no disponible */ }
  return 'dark';
}

/** Aplica el tema activo al documento. */
function apply() {
  if (current === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else document.documentElement.removeAttribute('data-theme');
}

export const theme = {
  /** @returns {'dark'|'light'} Tema activo. */
  get current() { return current; },

  /**
   * Cambia el tema, lo persiste y lo aplica.
   * @param {'dark'|'light'} next Nuevo tema.
   */
  set(next) {
    if (next !== 'light' && next !== 'dark') return;
    current = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignorar */ }
    apply();
    bus.dispatchEvent(new CustomEvent('theme:changed'));
  },

  /**
   * Suscribe un callback al cambio de tema.
   * @param {() => void} handler Se ejecuta tras cada cambio.
   * @returns {() => void} Función para cancelar la suscripción.
   */
  subscribe(handler) {
    bus.addEventListener('theme:changed', handler);
    return () => bus.removeEventListener('theme:changed', handler);
  },
};

apply();
