import { AppElement } from '../../../core/AppElement.js';
import { store } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { styles } from './demo-panel.css.js';

/**
 * `<demo-panel>` — controles de demostración fuera del marco del teléfono:
 * viajar en el tiempo, alternar el estado vacío y repetir la splash.
 * Es «chrome» global; no forma parte de ninguna vista.
 */
export class DemoPanel extends AppElement {
  static styles = [styles];

  /** Suscribe la actualización de la etiqueta de offset al store. */
  connectedCallback() {
    super.connectedCallback();
    this._off = store.subscribe(() => this._paint());
  }

  /** Cancela la suscripción al desmontar. */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._off) this._off();
  }

  /** Compone el panel de controles. */
  render() {
    const hasCounters = store.counters.length > 0;
    this.shadowRoot.innerHTML = `
      <div class="panel">
        <div class="head">
          <span class="title">${t('demo.title')}</span>
          <span class="offset">${this._offsetLabel()}</span>
        </div>
        <div class="buttons">
          <button class="btn btn-secondary" id="back1">${t('demo.back1')}</button>
          <button class="btn btn-primary" id="fwd1">${t('demo.fwd1')}</button>
          <button class="btn btn-secondary" id="fwd7">${t('demo.fwd7')}</button>
          <button class="btn btn-secondary" id="toggle">${t(hasCounters ? 'demo.empty' : 'demo.restore')}</button>
          <button class="btn btn-ghost" id="splash">${t('demo.splash')}</button>
        </div>
      </div>`;
  }

  /** Cablea los botones del panel. */
  afterRender() {
    this.on(this.$('#back1'), 'click', () => this._travel(-1));
    this.on(this.$('#fwd1'), 'click', () => this._travel(1));
    this.on(this.$('#fwd7'), 'click', () => this._travel(7));
    this.on(this.$('#toggle'), 'click', () => this._toggleEmpty());
    this.on(this.$('#splash'), 'click', () => router.go('splash'));
  }

  /**
   * Avanza/retrocede el tiempo y lanza la celebración si toca.
   * @param {number} delta Días a desplazar.
   */
  _travel(delta) {
    store.travel(delta);
    if (router.route === 'splash') return;
    const pending = store.pendingCelebration();
    if (pending && !router.celebration && !router.isCreateOpen) router.openCelebration(pending);
  }

  /** Alterna entre estado vacío y contadores de ejemplo. */
  _toggleEmpty() {
    if (store.counters.length) store.wipe();
    else store.restoreSeed();
    router.go('home');
  }

  /** @returns {string} Etiqueta del desplazamiento de días. */
  _offsetLabel() {
    const off = store.offset;
    if (off === 0) return t('demo.today');
    return t('demo.days', { sign: off > 0 ? '+' : '−', n: Math.abs(off) });
  }
}

customElements.define('demo-panel', DemoPanel);
