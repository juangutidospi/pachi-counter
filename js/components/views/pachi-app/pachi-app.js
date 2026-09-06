import { AppElement } from '../../../core/AppElement.js';
import { store } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { escapeHtml } from '../../../core/escape-html.js';
import '../splash-view/splash-view.js';
import '../home-view/home-view.js';
import '../detail-view/detail-view.js';
import '../settings-view/settings-view.js';
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
      router.subscribe(() => this._paint()),
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

  /** Compone el marco con la vista activa, overlays, tabbar y toast. */
  render() {
    const viewTag = VIEWS[router.route] || 'home-view';
    const showNav = router.route === 'home' || router.route === 'settings';
    this.shadowRoot.innerHTML = `
      <div class="frame">
        <div class="screen">
          <${viewTag} class="view"></${viewTag}>
          ${router.isCreateOpen ? '<create-sheet></create-sheet>' : ''}
          ${router.isResetOpen ? '<reset-dialog></reset-dialog>' : ''}
          ${router.isHardOpen ? '<hard-screen></hard-screen>' : ''}
          ${router.celebration ? '<celebrate-screen></celebrate-screen>' : ''}
          ${router.toast ? this._toastTpl : ''}
          ${showNav ? this._tabbarTpl : ''}
        </div>
      </div>`;
  }

  /** @returns {string} Barra de navegación inferior. */
  get _tabbarTpl() {
    const route = router.route;
    return `
      <div class="tabbar">
        <button class="link ${route === 'home' ? 'active' : ''}" id="nav-home">${t('nav.streaks')}</button>
        <button class="new" id="nav-new">${t('nav.new')}</button>
        <button class="link ${route === 'settings' ? 'active' : ''}" id="nav-settings">${t('nav.settings')}</button>
      </div>`;
  }

  /** @returns {string} Contenedor del toast activo. */
  get _toastTpl() {
    return `<div class="toast-host"><div class="toast">${escapeHtml(router.toast)}</div></div>`;
  }

  /** Cablea la barra de navegación. */
  afterRender() {
    const home = this.$('#nav-home');
    if (home) {
      this.on(home, 'click', () => router.go('home'));
      this.on(this.$('#nav-new'), 'click', () => router.openCreate());
      this.on(this.$('#nav-settings'), 'click', () => router.go('settings'));
    }
  }
}

customElements.define('pachi-app', PachiApp);
