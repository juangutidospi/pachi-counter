import { AppElement } from '../../../core/AppElement.js';
import { store, COUNTER_COLORS, fmtDate, isoOf, dayIndex } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { uiIcon } from '../../../core/icons.js';
import { escapeHtml } from '../../../core/escape-html.js';
import '../../ui/ring-dial/ring-dial.js';
import { styles } from './detail-view.css.js';

const DAY = 86400000;

/**
 * `<detail-view>` — detalle de un contador: anillo de progreso, frase, tres
 * métricas, heatmap de 5 semanas, escalera de hitos, nota editable y acciones
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
        ${this._dialTpl(vm)}
        ${this._phraseTpl(vm)}
        ${this._statsTpl(vm)}
        ${this._gridTpl(vm)}
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

  /** @param {object} vm Modelo de vista. @returns {string} Anillo con días. */
  _dialTpl(vm) {
    return `
      <div class="dial-wrap">
        <ring-dial offset="${vm.ringOffset}" color="${vm.color}">
          <div class="dial-days">${vm.days}</div>
          <div class="dial-word">${vm.dayWord} ${escapeHtml(vm.tail)}</div>
        </ring-dial>
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

  /** @param {object} vm Modelo de vista. @returns {string} Heatmap de 5 semanas. */
  _gridTpl(vm) {
    return `
      <div class="section-head">
        <h6>${t('detail.weeksTitle')}</h6>
        <span class="note">${vm.gridNote}</span>
      </div>
      <div class="grid">
        ${vm.grid.map((cell) => `<div class="cell" title="${escapeHtml(cell.title)}" style="background:${cell.bg};box-shadow:${cell.ring}"></div>`).join('')}
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
    const color = (COUNTER_COLORS[c.color] || COUNTER_COLORS.accent).value;
    const start = dayIndex(c.start);
    const today = store.today();

    const grid = [];
    for (let i = 34; i >= 0; i--) {
      const day = today - i;
      const inStreak = day >= start && day <= today;
      grid.push({
        bg: inStreak ? color : 'var(--color-neutral-900)',
        ring: day === today ? '0 0 0 1.5px var(--color-neutral-300)' : 'none',
        title: inStreak ? t('detail.gridDay', { n: day - start }) : t('detail.gridBefore'),
      });
    }

    return {
      days,
      dayWord: t(days === 1 ? 'word.day' : 'word.days'),
      tail: c.tail,
      color,
      kindLabel: t(c.kind === 'quit' ? 'detail.kind.quit' : 'detail.kind.build'),
      quote: store.quote(c),
      nextLabel: next ? next + ' d' : '—',
      best,
      bestColor: days >= best ? color : 'var(--color-neutral-100)',
      ringOffset: (327 * (1 - pct)).toFixed(1),
      why: c.note || '',
      grid,
      gridNote: days >= 35 ? t('detail.weeksFull') : t('detail.weeksOf', { d: days }),
      ladder: ladder.map((m) => {
        const done = m <= days;
        return {
          label: t('detail.milestoneLabel', { m, word: t(m === 1 ? 'word.day' : 'word.days'), tail: c.tail }),
          mark: done ? '✓' : '',
          dotBg: done ? color : 'transparent',
          dotFg: 'var(--color-neutral-900)',
          dotRing: done ? 'none' : 'inset 0 0 0 1px var(--color-neutral-700)',
          fg: done ? 'var(--color-neutral-100)' : 'var(--color-neutral-500)',
          meta: done ? fmtDate(isoOf((start + m) * DAY)) : t('detail.milestoneLeft', { r: m - days }),
        };
      }),
    };
  }
}

customElements.define('detail-view', DetailView);
