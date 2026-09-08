import { AppElement } from '../../../core/AppElement.js';
import { store, dayIndex } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { uiIcon } from '../../../core/icons.js';
import { escapeHtml } from '../../../core/escape-html.js';
import '../../ui/counter-card/counter-card.js';
import { styles } from './home-view.css.js';

/**
 * `<home-view>` — pantalla principal: cabecera con fecha y saludo, resumen de
 * estadísticas, frase del contador en foco y lista de contadores; o el estado
 * vacío cuando no hay ninguno.
 */
export class HomeView extends AppElement {
  static styles = [styles];

  /** Compone la cabecera y el cuerpo (lista o estado vacío). */
  render() {
    this._applyEdition();
    const hasCounters = store.counters.length > 0;
    this.shadowRoot.innerHTML = `
      <div class="home">
        ${this._headTpl}
        ${hasCounters ? this._bodyTpl : this._emptyTpl}
      </div>`;
  }

  /** Aplica el acento de la «edición» según la estación (hemisferio norte). */
  _applyEdition() {
    const month = new Date(Date.now() + store.offset * 86400000).getMonth();
    const season = month <= 1 || month === 11 ? 'winter' : month <= 4 ? 'spring' : month <= 7 ? 'summer' : 'autumn';
    const map = {
      winter: ['var(--blue)', 'var(--paper)'],
      spring: ['var(--red)', 'var(--paper)'],
      summer: ['var(--yellow)', 'var(--ink)'],
      autumn: ['var(--ink)', 'var(--paper)'],
    };
    this.style.setProperty('--edition', map[season][0]);
    this.style.setProperty('--edition-on', map[season][1]);
  }

  /** @returns {string} Cabecera-masthead de publicación + saludo y ajustes. */
  get _headTpl() {
    const has = store.counters.length > 0;
    return `
      <div class="masthead">
        <span class="brand">${t('app.name1')} ${t('app.name2')}</span>
        <span class="edition">${t('home.edition', { n: this._issueNo() })}</span>
      </div>
      <div class="topbar">
        <div class="date">${this._todayLabel()}</div>
        <div class="head-actions">
          <button class="btn btn-icon btn-secondary" id="shelf" aria-label="${t('shelf.open')}">${uiIcon('shelf', 18)}</button>
          <button class="btn btn-icon btn-secondary gear" id="gear" aria-label="${t('home.settings')}">${uiIcon('gear', 18)}</button>
        </div>
      </div>
      <h2 class="greeting">${t(has ? 'home.greetingHas' : 'home.greetingEmpty')}</h2>`;
  }

  /** @returns {number} Número de edición: días desde 2026-01-01 (sube cada día). */
  _issueNo() {
    return store.today() - dayIndex('2026-01-01') + 1;
  }

  /** @returns {string} Estadísticas + foco + lista + columna editorial. */
  get _bodyTpl() {
    return `${this._statsTpl}${this._focusTpl}<div class="list" id="list"></div>${this._columnTpl}`;
  }

  /** @returns {string} Columna editorial del día (titular + dato). */
  get _columnTpl() {
    const ins = store.insight();
    if (!ins) return '';
    return `
      <div class="column">
        <div class="col-kicker">${ins.kicker}</div>
        <p class="col-headline">${escapeHtml(ins.headline)}</p>
        <div class="col-sub">${escapeHtml(ins.sub)}</div>
      </div>`;
  }

  /** @returns {string} Franja de estadísticas resumen. */
  get _statsTpl() {
    const totalDays = store.counters.reduce((sum, c) => sum + store.daysOf(c), 0);
    const gaps = store.counters.map((c) => { const n = store.nextOf(c); return n ? n - store.daysOf(c) : 9999; });
    const near = gaps.length ? Math.min(...gaps) : 9999;
    return `
      <div class="stats">
        <div class="stat"><div class="num">${totalDays}</div><div class="lbl">${t('home.stat.days')}</div></div>
        <div class="stat"><div class="num">${store.counters.length}</div><div class="lbl">${t('home.stat.streaks')}</div></div>
        <div class="stat hi"><div class="num">${near === 9999 ? '—' : near + ' d'}</div><div class="lbl">${t('home.stat.nearest')}</div></div>
      </div>`;
  }

  /** @returns {string} Bloque de la frase del contador en foco. */
  get _focusTpl() {
    const focus = store.focusCounter();
    if (!focus) return '';
    return `
      <div class="focus">
        <div class="kicker">${t('home.focusKicker', { name: escapeHtml(focus.name) })}</div>
        <p>${escapeHtml(store.quote(focus).text)}</p>
      </div>`;
  }

  /** @returns {string} Estado vacío con llamada a crear el primer contador. */
  get _emptyTpl() {
    return `
      <div class="empty">
        <div class="rings">
          <div class="ring e1"></div><div class="ring e2"></div><div class="ring e3"></div>
          <div class="zero">0</div>
        </div>
        <h4>${t('home.empty.title')}</h4>
        <p class="text-muted">${t('home.empty.body')}</p>
        <button class="btn btn-primary cta" id="create-first">${t('home.empty.cta')}</button>
      </div>`;
  }

  /** Cablea navegación y rellena la lista con las tarjetas de contador. */
  afterRender() {
    this.on(this.$('#gear'), 'click', () => router.go('settings'));
    this.on(this.$('#shelf'), 'click', () => router.go('shelf'));
    const createFirst = this.$('#create-first');
    if (createFirst) this.on(createFirst, 'click', () => router.openCreate());

    const list = this.$('#list');
    if (!list) return;
    store.sortedByNearest().forEach((c, i) => {
      const card = document.createElement('counter-card');
      card.style.setProperty('--i', i);
      card.counter = c;
      this.on(card, 'open', (e) => {
        // Etiqueta el disco pulsado para el morph (View Transitions) al detalle.
        try {
          const disc = card.shadowRoot && card.shadowRoot.querySelector('.disc');
          if (disc) disc.style.viewTransitionName = 'pc-hero';
        } catch (err) { /* sin soporte */ }
        this._open(e.detail.id);
      });
      list.appendChild(card);
    });
  }

  /**
   * Marca el contador como visto hoy y abre su detalle.
   * @param {string} id Id del contador.
   */
  _open(id) {
    store.markSeen(id);
    router.go('detail', id);
  }

  /** @returns {string} Etiqueta de la fecha de hoy (con día de la semana y offset de demo). */
  _todayLabel() {
    const now = new Date(Date.now() + store.offset * 86400000);
    const months = t('months').split(',');
    const weekdays = t('weekdays').split(',');
    const wd = weekdays[(now.getDay() + 6) % 7];
    return `${wd} · ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }
}

customElements.define('home-view', HomeView);
