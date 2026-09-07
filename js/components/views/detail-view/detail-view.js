import { AppElement } from '../../../core/AppElement.js';
import { store, COUNTER_COLORS, fmtDate, isoFromDayIndex, dayIndex } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { uiIcon } from '../../../core/icons.js';
import { escapeHtml } from '../../../core/escape-html.js';
import { styles } from './detail-view.css.js';

/**
 * `<detail-view>` — detalle de un contador: disco de vinilo personal (surcos =
 * hitos), frase, tres métricas, escalera de hitos, nota editable y acciones
 * (día difícil, reiniciar, eliminar).
 */
export class DetailView extends AppElement {
  static styles = [styles];

  /** Compone el detalle a partir del contador seleccionado. */
  render() {
    const c = store.find(router.selId) || store.counters[0];
    if (!c) { this.shadowRoot.innerHTML = ''; return; }
    this._c = c;
    const vm = this._viewModel(c);
    this.shadowRoot.innerHTML = `
      <div class="detail">
        ${this._topTpl(vm)}
        ${this._vinylTpl(vm)}
        ${this._phraseTpl(vm)}
        ${this._statsTpl(vm)}
        ${this._ladderTpl(vm)}
        ${this._noteTpl(vm)}
        ${this._actionsTpl}
      </div>`;
  }

  /** @param {object} vm Modelo de vista. @returns {string} Barra superior. */
  _topTpl(vm) {
    return `
      <div class="top">
        <button class="btn btn-ghost back" id="back">${uiIcon('back', 16)} ${t('detail.back')}</button>
        <div class="right">
          <span class="tag tag-neutral">${vm.kindLabel}</span>
          <button class="btn btn-icon btn-secondary share" id="share" aria-label="${t('detail.share')}">${uiIcon('share', 16)}</button>
        </div>
      </div>`;
  }

  /** @param {object} vm Modelo de vista. @returns {string} Disco de vinilo personal. */
  _vinylTpl(vm) {
    const grooves = vm.grooves.map((g) =>
      `<circle cx="130" cy="130" r="${g.r}" fill="none" stroke="${g.reached ? vm.color : 'var(--color-neutral-800)'}" stroke-width="${g.reached ? 4 : 2}"></circle>`
    ).join('');
    return `
      <div class="vinyl-wrap">
        <div class="vinyl">
          <svg class="disc" viewBox="0 0 260 260" aria-hidden="true">
            <circle cx="130" cy="130" r="122" fill="var(--ink)"></circle>
            <rect x="129" y="10" width="2" height="120" fill="var(--color-neutral-700)" opacity="0.55"></rect>
            ${grooves}
          </svg>
          <svg class="progress" viewBox="0 0 260 260" aria-hidden="true">
            <circle cx="130" cy="130" r="118" fill="none" stroke="var(--color-neutral-800)" stroke-width="4"></circle>
            <circle class="prog-arc" cx="130" cy="130" r="118" fill="none" stroke="${vm.color}" stroke-width="4"
              stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100 - vm.progressPct}"></circle>
          </svg>
          <div class="label" style="background:${vm.color};color:${vm.on}">
            <div class="num" id="odo" style="font-size:${vm.labelSize}">${vm.days}</div>
            <div class="tail">${escapeHtml(vm.dayWord)} ${escapeHtml(vm.tail)}</div>
          </div>
        </div>
      </div>`;
  }

  /** @param {object} vm Modelo de vista. @returns {string} Tarjeta de frase. */
  _phraseTpl(vm) {
    return `
      <div class="phrase">
        <div class="kicker">${escapeHtml(vm.quote.kicker)}</div>
        <p>${escapeHtml(vm.quote.text)}</p>
      </div>`;
  }

  /** @param {object} vm Modelo de vista. @returns {string} Tres métricas. */
  _statsTpl(vm) {
    return `
      <div class="stats3">
        <div class="card elev-sm stat3"><div class="num">${vm.days}</div><div class="lbl">${t('detail.stat.current')}</div></div>
        <div class="card elev-sm stat3"><div class="num" style="color:${vm.bestColor}">${vm.best}</div><div class="lbl">${t('detail.stat.best')}</div></div>
        <div class="card elev-sm stat3"><div class="num">${vm.nextLabel}</div><div class="lbl">${t('detail.stat.next')}</div></div>
      </div>`;
  }

  /** @param {object} vm Modelo de vista. @returns {string} Escalera de hitos. */
  _ladderTpl(vm) {
    return `
      <h6 style="margin:var(--space-8) 0 var(--space-3);color:var(--color-neutral-500)">${t('detail.milestonesTitle')}</h6>
      <div class="ladder">
        ${vm.ladder.map((m) => `
          <div class="item">
            <div class="dot" style="background:${m.dotBg};color:${m.dotFg};box-shadow:${m.dotRing}">${m.mark}</div>
            <div class="lbl" style="color:${m.fg}">${escapeHtml(m.label)}</div>
            <div class="meta">${escapeHtml(m.meta)}</div>
          </div>`).join('')}
      </div>`;
  }

  /** @param {object} vm Modelo de vista. @returns {string} Nota editable. */
  _noteTpl(vm) {
    return `
      <div class="note-block">
        <div class="section-head" style="margin-top:0">
          <h6>${t('detail.noteTitle')}</h6>
          <span class="note">${t('detail.noteAutosave')}</span>
        </div>
        <textarea class="input" id="note" placeholder="${t('detail.notePh')}">${escapeHtml(vm.why)}</textarea>
      </div>`;
  }

  /** @returns {string} Acciones inferiores. */
  get _actionsTpl() {
    return `
      <button class="btn btn-primary btn-block actions-main" id="hard">${t('detail.hard')}</button>
      <div class="actions-row">
        <button class="btn btn-secondary reset" id="reset">${t('detail.reset')}</button>
        <button class="btn btn-ghost remove" id="remove">${t('detail.remove')}</button>
      </div>`;
  }

  /** Cablea navegación, edición de nota y acciones. */
  afterRender() {
    if (!this._c) return;
    this.on(this.$('#back'), 'click', () => router.go('home'));
    this.on(this.$('#share'), 'click', () => this._share());
    this.on(this.$('#hard'), 'click', () => router.openHard());
    this.on(this.$('#reset'), 'click', () => router.openReset());
    this.on(this.$('#remove'), 'click', () => this._remove());
    this.on(this.$('#note'), 'change', (e) => store.setNote(this._c.id, e.target.value));
    this._animateOdometer();
  }

  /** Limpia la animación del odómetro al desmontar. */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  /** Anima el número central contando desde 0 hasta los días actuales. */
  _animateOdometer() {
    const el = this.$('#odo');
    if (!el) return;
    const target = store.daysOf(this._c);
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || target <= 0) { el.textContent = String(target); return; }
    const duration = 850;
    let startTs = null;
    const step = (ts) => {
      if (startTs === null) startTs = ts;
      const p = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * target));
      if (p < 1) this._raf = requestAnimationFrame(step);
    };
    this._raf = requestAnimationFrame(step);
  }

  /** Copia la racha al portapapeles y muestra un toast. */
  _share() {
    const days = store.daysOf(this._c);
    const text = t('toast.copied', { d: days, tail: this._c.tail });
    if (navigator.clipboard) navigator.clipboard.writeText(`${days} ${t('word.days')} ${this._c.tail}`).catch(() => {});
    router.flash(text);
  }

  /** Elimina el contador y vuelve a home. */
  _remove() {
    store.remove(this._c.id);
    router.go('home');
    router.flash(t('toast.removed'));
  }

  /**
   * Calcula el modelo de vista del contador.
   * @param {object} c Contador.
   * @returns {object} Datos listos para pintar.
   */
  _viewModel(c) {
    const days = store.daysOf(c);
    const ladder = store.ladderOf(c);
    const next = store.nextOf(c);
    const prev = ladder.filter((m) => m <= days).pop() || 0;
    const pct = next ? Math.min(1, (days - prev) / (next - prev)) : 1;
    const best = Math.max(c.best || 0, days);
    const cc = COUNTER_COLORS[c.color] || COUNTER_COLORS.accent;
    const color = cc.value;
    const on = cc.on;
    const start = dayIndex(c.start);

    // Surcos del vinilo: un anillo por hito, del interior al exterior; los
    // hitos alcanzados se graban en color, el resto quedan como surco oscuro.
    const innerR = 60;
    const outerR = 104;
    const n = ladder.length;
    const grooves = ladder.map((m, i) => ({
      r: (n <= 1 ? outerR : innerR + (i / (n - 1)) * (outerR - innerR)).toFixed(1),
      reached: m <= days,
    }));
    const digits = String(days).length;

    return {
      days,
      dayWord: t(days === 1 ? 'word.day' : 'word.days'),
      tail: c.tail,
      color,
      on,
      kindLabel: t(c.kind === 'quit' ? 'detail.kind.quit' : 'detail.kind.build'),
      quote: store.quote(c),
      nextLabel: next ? next + ' d' : '—',
      best,
      bestColor: days >= best ? color : 'var(--color-neutral-100)',
      why: c.note || '',
      grooves,
      progressPct: (pct * 100).toFixed(1),
      labelSize: digits <= 2 ? '46px' : digits === 3 ? '34px' : '26px',
      ladder: ladder.map((m) => {
        const done = m <= days;
        return {
          label: t('detail.milestoneLabel', { m, word: t(m === 1 ? 'word.day' : 'word.days'), tail: c.tail }),
          mark: done ? '✓' : '',
          dotBg: done ? color : 'transparent',
          dotFg: done ? on : 'transparent',
          dotRing: done ? 'none' : 'inset 0 0 0 2px var(--ink)',
          fg: done ? 'var(--ink)' : 'var(--dim)',
          meta: done ? fmtDate(isoFromDayIndex(start + m)) : t('detail.milestoneLeft', { r: m - days }),
        };
      }),
    };
  }
}

customElements.define('detail-view', DetailView);
