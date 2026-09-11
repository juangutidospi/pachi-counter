import { AppElement } from '../../../core/AppElement.js';
import { store } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { escapeHtml } from '../../../core/escape-html.js';
import '../splash-view/splash-view.js';
import '../home-view/home-view.js';
import '../detail-view/detail-view.js';
import '../settings-view/settings-view.js';
import '../shelf-view/shelf-view.js';
import '../mural-view/mural-view.js';
import '../year-view/year-view.js';
import '../create-sheet/create-sheet.js';
import '../reset-dialog/reset-dialog.js';
import '../hard-screen/hard-screen.js';
import '../celebrate-screen/celebrate-screen.js';
import { styles } from './pachi-app.css.js';

/** Mapa de ruta → etiqueta de elemento de vista. */
const VIEWS = {
  splash: 'splash-view',
  home: 'home-view',
  detail: 'detail-view',
  settings: 'settings-view',
  shelf: 'shelf-view',
  mural: 'mural-view',
  year: 'year-view',
};

/**
 * `<pachi-app>` — shell de la aplicación. Compone el marco tipo teléfono con
 * la vista activa, los overlays (crear, reiniciar, día difícil, celebración),
 * la barra de navegación y el toast. Escucha al store, al router y al tema.
 */
export class PachiApp extends AppElement {
  static styles = [styles];

  /** Suscribe el re-render a los cambios de estado y navegación. */
  connectedCallback() {
    super.connectedCallback();
    this._subs = [
      store.subscribe(() => this._paint()),
      router.subscribe(() => this._navigate()),
    ];
    // Los días se derivan de la fecha actual: recalcular al volver a la app y
    // programar un refresco automático a la medianoche local.
    this._onWake = () => { if (!document.hidden) store.tickDay(); };
    document.addEventListener('visibilitychange', this._onWake);
    window.addEventListener('focus', this._onWake);
    this._scheduleMidnight();
  }

  /** Cancela las suscripciones persistentes y temporizadores al desmontar. */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._subs) this._subs.forEach((off) => off());
    document.removeEventListener('visibilitychange', this._onWake);
    window.removeEventListener('focus', this._onWake);
    clearTimeout(this._midnightTimer);
  }

  /** Programa un `tickDay()` justo tras la próxima medianoche local y se reprograma. */
  _scheduleMidnight() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2, 0);
    clearTimeout(this._midnightTimer);
    this._midnightTimer = setTimeout(() => {
      store.tickDay();
      this._scheduleMidnight();
    }, next.getTime() - now.getTime());
  }

  /** @returns {object} Instantánea del estado de navegación/overlays. */
  _navSnapshot() {
    return {
      route: router.route, create: router.isCreateOpen, reset: router.isResetOpen,
      hard: router.isHardOpen, celebrate: !!router.celebration, toast: !!router.toast,
    };
  }

  /**
   * Navega con transición: usa la View Transitions API (crossfade/morph nativo)
   * si está disponible; si no, el repintado normal dispara la cortinilla de bloques.
   * Optimización: si lo único que cambia es abrir/cerrar la hoja de creación (misma
   * ruta), añade o quita el `<create-sheet>` sin repintar el resto — así la home no
   * se refresca (ni re-anima ni recuenta) al cancelar la creación.
   */
  _navigate() {
    const prev = this._navState;
    const cur = this._navSnapshot();
    if (prev && prev.route === cur.route) {
      const changed = Object.keys(cur).filter((k) => prev[k] !== cur[k]);
      if (changed.length === 1 && changed[0] === 'create') {
        this._navState = cur;
        this._toggleCreateSheet(cur.create);
        return;
      }
    }
    this._navState = cur;
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const changed = this._prevRoute != null && this._prevRoute !== router.route;
    if (changed && !reduce && typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => this._paint());
    } else {
      this._paint();
    }
  }

  /**
   * Añade o quita la hoja de creación sin tocar el resto del shell.
   * @param {boolean} open Si debe estar presente.
   */
  _toggleCreateSheet(open) {
    const existing = this.$('create-sheet');
    if (open) {
      if (existing) return;
      const screen = this.$('.screen');
      if (screen) screen.appendChild(document.createElement('create-sheet'));
    } else if (existing) {
      existing.remove();
    }
  }

  /** Compone el marco con la vista activa, overlays, tabbar y toast. */
  render() {
    const viewTag = VIEWS[router.route] || 'home-view';
    const showNav = router.route === 'home' || router.route === 'settings';
    // Cortinilla de bloques solo como respaldo cuando NO hay View Transitions API.
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasVT = typeof document !== 'undefined' && !!document.startViewTransition;
    const routeChanged = this._prevRoute != null && this._prevRoute !== router.route && !reduce && !hasVT;
    this._prevRoute = router.route;
    this.shadowRoot.innerHTML = `
      <div class="frame">
        <div class="screen">
          <div class="scroll"><${viewTag} class="view"></${viewTag}></div>
          ${showNav ? this._tabbarTpl : ''}
          ${router.isCreateOpen ? '<create-sheet></create-sheet>' : ''}
          ${router.isResetOpen ? '<reset-dialog></reset-dialog>' : ''}
          ${router.isHardOpen ? '<hard-screen></hard-screen>' : ''}
          ${router.celebration ? '<celebrate-screen></celebrate-screen>' : ''}
          ${router.toast ? this._toastTpl : ''}
          ${routeChanged ? this._wipeTpl : ''}
        </div>
      </div>`;
  }

  /** @returns {string} Overlay de transición: tres bloques primarios que barren. */
  get _wipeTpl() {
    return '<div class="wipe" aria-hidden="true"><span class="p p1"></span><span class="p p2"></span><span class="p p3"></span></div>';
  }

  /** @returns {string} Barra de navegación inferior. */
  get _tabbarTpl() {
    const route = router.route;
    const rings = '<svg class="tab-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"></circle></svg>';
    const gear = '<svg class="tab-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="miter"><rect x="4" y="4" width="16" height="16"></rect><path d="M4 9h16M4 15h16M10 4v16"></path></svg>';
    const plus = '<svg class="tab-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square"><path d="M12 5v14M5 12h14"></path></svg>';
    return `
      <div class="tabbar">
        <button class="tab ${route === 'home' ? 'active' : ''}" id="nav-home">${rings}<span class="tab-lb">${t('nav.streaks')}</span></button>
        <div class="tab-spacer"></div>
        <button class="tab ${route === 'settings' ? 'active' : ''}" id="nav-settings">${gear}<span class="tab-lb">${t('nav.settings')}</span></button>
        <button class="tab-new" id="nav-new" aria-label="${t('nav.add')}">${plus}<span class="tab-new-lb">${t('nav.add')}</span></button>
      </div>`;
  }

  /** @returns {string} Contenedor del toast activo. */
  get _toastTpl() {
    return `<div class="toast-host"><div class="toast">${escapeHtml(router.toast)}</div></div>`;
  }

  /** Cablea la barra de navegación y limpia el overlay de transición al acabar. */
  afterRender() {
    const home = this.$('#nav-home');
    if (home) {
      this.on(home, 'click', () => router.go('home'));
      this.on(this.$('#nav-new'), 'click', () => router.openCreate());
      this.on(this.$('#nav-settings'), 'click', () => router.go('settings'));
    }
    const wipe = this.$('.wipe');
    if (wipe) setTimeout(() => wipe.remove(), 900);
  }
}

customElements.define('pachi-app', PachiApp);
