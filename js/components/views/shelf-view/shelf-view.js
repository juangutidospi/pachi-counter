import { AppElement } from '../../../core/AppElement.js';
import { store, COUNTER_COLORS, fmtDate } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { uiIcon } from '../../../core/icons.js';
import { escapeHtml } from '../../../core/escape-html.js';
import { grooveTexture } from '../../../core/groove-seed.js';
import { buildAnnualFile, shareOrSave } from '../../../core/share-card.js';
import { styles } from './shelf-view.css.js';

/**
 * `<shelf-view>` — la colección: cada racha reiniciada o eliminada se «prensa»
 * como un disco y se archiva aquí, formando una estantería que crece contigo.
 */
export class ShelfView extends AppElement {
  static styles = [styles];

  /** Compone la cabecera y la rejilla de discos (o el estado vacío). */
  render() {
    const pressings = store.pressings;
    const totalDays = pressings.reduce((sum, p) => sum + p.days, 0);
    this.shadowRoot.innerHTML = `
      <div class="shelf">
        <button class="btn btn-ghost back" id="back">${uiIcon('back', 16)} ${t('detail.back')}</button>
        <div class="head">
          <div class="kicker">${t('shelf.kicker')}</div>
          <h2>${t('shelf.title')}</h2>
          ${pressings.length ? `<div class="count">${t('shelf.count', { n: pressings.length, days: totalDays })}</div>` : ''}
        </div>
        ${store.counters.length ? `<button class="btn btn-secondary btn-block mural" id="mural">${uiIcon('grid', 15)} ${t('shelf.mural')}</button>` : ''}
        ${pressings.length ? `<button class="btn btn-primary btn-block annual" id="annual">${t('shelf.annual')}</button>` : ''}
        ${pressings.length ? `<div class="grid">${pressings.map((p, i) => this._recordTpl(p, i)).join('')}</div>` : this._emptyTpl}
      </div>`;
  }

  /** @returns {string} Estado vacío de la colección. */
  get _emptyTpl() {
    return `
      <div class="empty">
        <div class="rings"><span class="r r1"></span><span class="r r2"></span><span class="r r3"></span></div>
        <p>${t('shelf.empty')}</p>
      </div>`;
  }

  /**
   * @param {object} p Disco prensado.
   * @param {number} i Índice (para el escalonado).
   * @returns {string} Tarjeta de disco.
   */
  _recordTpl(p, i) {
    const col = COUNTER_COLORS[p.color] || COUNTER_COLORS.accent;
    const grooves = grooveTexture(p.id || p.name, 9, 30, 54)
      .map((g) => `<circle cx="60" cy="60" r="${g.r}" fill="none" stroke="rgba(214,203,182,.14)" stroke-width="1" opacity="${g.opacity}"${g.gap ? ' stroke-dasharray="2 4"' : ''}></circle>`).join('');
    const size = String(p.days).length >= 3 ? 15 : 22;
    const gid = 'pcbody' + i;
    return `
      <div class="rec" style="animation-delay:${Math.min(i * 40, 300)}ms">
        <svg class="mini" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <radialGradient id="${gid}" cx="38%" cy="34%" r="75%">
              <stop offset="0" stop-color="#26221e"></stop><stop offset="55%" stop-color="#141210"></stop><stop offset="100%" stop-color="#050505"></stop>
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="56" fill="url(#${gid})" stroke="var(--ink)" stroke-width="2"></circle>
          ${grooves}
          <circle cx="60" cy="60" r="26" fill="${col.value}" stroke="var(--ink)" stroke-width="2"></circle>
          <ellipse cx="60" cy="52" rx="15" ry="6" fill="rgba(255,255,255,.22)"></ellipse>
          <text x="60" y="61" text-anchor="middle" dominant-baseline="central" fill="${col.on}"
            font-family="Syne, sans-serif" font-weight="800" font-size="${size}">${p.days}</text>
        </svg>
        <div class="name">${escapeHtml(p.name)}</div>
        <div class="range">${t('shelf.range', { start: fmtDate(p.start), end: fmtDate(p.end) })}</div>
      </div>`;
  }

  /** Cablea la navegación y la prensa anual. */
  afterRender() {
    this.on(this.$('#back'), 'click', () => router.go('home'));
    const mural = this.$('#mural');
    if (mural) this.on(mural, 'click', () => router.go('mural'));
    const annual = this.$('#annual');
    if (annual) {
      this._annualFile = null;
      buildAnnualFile().then((f) => { this._annualFile = f; });
      this.on(annual, 'click', () => this._shareAnnual());
    }
  }

  /** Comparte la prensa anual (resumen del año). */
  _shareAnnual() {
    const text = t('shelf.annual');
    const done = (r) => { if (r === 'saved') router.flash(t('toast.imgSaved')); else if (r === 'error') router.flash(t('toast.imgFail')); };
    if (this._annualFile) shareOrSave(this._annualFile, text).then(done);
    else buildAnnualFile().then((f) => shareOrSave(f, text).then(done));
  }
}

customElements.define('shelf-view', ShelfView);
