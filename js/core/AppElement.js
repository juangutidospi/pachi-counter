import { base } from './base.css.js';
import { onI18nChanged } from './i18n.js';

/**
 * Clase base de todos los componentes de la app.
 * Concentra la fontanería común según el patrón de Web Components:
 *  - crea el Shadow DOM y adopta `[base, ...static styles]`,
 *  - re-renderiza al cambiar el idioma (evento `i18n:changed`),
 *  - `on()` registra listeners con auto-limpieza al desconectar,
 *  - `$()` / `$$()` consultan siempre dentro del shadow.
 *
 * Subclases: definir `static styles = [misEstilos]`, implementar `render()`
 * (que compone getters `_xTpl` de HTML puro) y opcionalmente `afterRender()`.
 */
export class AppElement extends HTMLElement {
  /** @type {CSSStyleSheet[]} Hojas propias del componente (además de `base`). */
  static styles = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [base, ...this.constructor.styles];
    /** @type {Array<() => void>} Limpiadores de listeners registrados con on(). */
    this._cleanups = [];
  }

  /** Ciclo de vida: primer render + suscripción a cambios de idioma. */
  connectedCallback() {
    this._paint();
    this._offI18n = onI18nChanged(() => this._paint());
  }

  /** Ciclo de vida: libera listeners e i18n para evitar fugas. */
  disconnectedCallback() {
    this._teardown();
    if (this._offI18n) this._offI18n();
  }

  /** Renderiza el markup y ejecuta el wiring. Interno. */
  _paint() {
    this._teardown();
    this.render();
    this.afterRender();
  }

  /** Ejecuta y vacía los limpiadores de listeners registrados. Interno. */
  _teardown() {
    while (this._cleanups.length) {
      const off = this._cleanups.pop();
      try { off(); } catch (e) { /* listener ya desmontado */ }
    }
  }

  /**
   * Pinta el markup del componente. Las subclases lo sobrescriben componiendo
   * getters `_xTpl` de HTML puro.
   */
  render() {}

  /**
   * Cablea comportamiento tras cada render: listeners, propiedades de
   * primitivos, carga de datos. Las subclases lo sobrescriben.
   */
  afterRender() {}

  /**
   * Registra un listener que se elimina automáticamente al desconectar
   * el componente o en el siguiente render.
   *
   * @param {EventTarget} target Objetivo del evento.
   * @param {string} type Nombre del evento.
   * @param {EventListenerOrEventListenerObject} handler Manejador.
   * @param {boolean|AddEventListenerOptions} [options] Opciones nativas.
   */
  on(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    this._cleanups.push(() => target.removeEventListener(type, handler, options));
  }

  /**
   * Consulta un elemento dentro del Shadow DOM.
   * @param {string} selector Selector CSS.
   * @returns {Element|null} Primer elemento coincidente.
   */
  $(selector) { return this.shadowRoot.querySelector(selector); }

  /**
   * Consulta todos los elementos coincidentes dentro del Shadow DOM.
   * @param {string} selector Selector CSS.
   * @returns {Element[]} Lista de elementos.
   */
  $$(selector) { return Array.from(this.shadowRoot.querySelectorAll(selector)); }
}
