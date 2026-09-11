/**
 * Router mínimo de la app: mantiene la ruta principal, el contador
 * seleccionado, el estado de los overlays (crear, reset, día difícil,
 * celebración) y el toast. Emite `route:changed` en cada cambio.
 * No persiste: es estado de navegación efímero.
 */

const bus = new EventTarget();

let route = 'splash';
let selId = null;
/** @type {{create: boolean, reset: boolean, hard: boolean, celebrate: object|null}} */
let overlays = { create: false, reset: false, hard: false, celebrate: null };
let toast = '';
let toastTimer = null;

/** Notifica a los suscriptores del cambio de navegación. */
function emit() { bus.dispatchEvent(new CustomEvent('route:changed')); }

export const router = {
  /** @returns {string} Ruta principal activa. */
  get route() { return route; },
  /** @returns {string|null} Id del contador seleccionado. */
  get selId() { return selId; },
  /** @returns {boolean} Si la hoja de creación está abierta. */
  get isCreateOpen() { return overlays.create; },
  /** @returns {boolean} Si el diálogo de reinicio está abierto. */
  get isResetOpen() { return overlays.reset; },
  /** @returns {boolean} Si la pantalla «hoy me cuesta» está abierta. */
  get isHardOpen() { return overlays.hard; },
  /** @returns {object|null} Datos de la celebración activa, o null. */
  get celebration() { return overlays.celebrate; },
  /** @returns {string} Texto del toast activo (vacío si no hay). */
  get toast() { return toast; },

  /**
   * Origen del morph carátula→vinilo (rect + imagen de la mini-carátula pulsada).
   * Lo pone la tarjeta al abrirse y lo consume el shell tras pintar el detalle.
   * @type {{rect: DOMRect, img: string|null}|null}
   */
  hero: null,

  /**
   * Navega a una ruta principal (cierra la hoja de creación).
   * @param {string} next Ruta destino.
   * @param {string|null} [id] Id del contador (para `detail`).
   */
  go(next, id = null) {
    route = next;
    if (id !== null) selId = id;
    overlays.create = false;
    emit();
  },

  /** Abre la hoja de creación de contador. */
  openCreate() { overlays.create = true; emit(); },
  /** Cierra la hoja de creación. */
  closeCreate() { overlays.create = false; emit(); },

  /** Abre el diálogo «¿volver a 0?». */
  openReset() { overlays.reset = true; emit(); },
  /** Cierra el diálogo de reinicio. */
  closeReset() { overlays.reset = false; emit(); },

  /** Abre la pantalla «hoy me cuesta». */
  openHard() { overlays.hard = true; emit(); },
  /** Cierra la pantalla «hoy me cuesta». */
  closeHard() { overlays.hard = false; emit(); },

  /**
   * Abre la pantalla de celebración con sus datos.
   * @param {object} data Datos de la celebración.
   */
  openCelebration(data) { overlays.celebrate = data; emit(); },
  /** Cierra la pantalla de celebración. */
  closeCelebration() { overlays.celebrate = null; emit(); },

  /**
   * Muestra un toast temporal.
   * @param {string} message Texto a mostrar.
   */
  flash(message) {
    toast = message;
    emit();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast = ''; emit(); }, 2400);
  },

  /**
   * Suscribe un callback al cambio de navegación.
   * @param {() => void} handler Se ejecuta tras cada cambio.
   * @returns {() => void} Función para cancelar la suscripción.
   */
  subscribe(handler) {
    bus.addEventListener('route:changed', handler);
    return () => bus.removeEventListener('route:changed', handler);
  },
};
