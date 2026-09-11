import { AppElement } from '../../../core/AppElement.js';
import { store, COUNTER_COLORS, fmtDate } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { escapeHtml } from '../../../core/escape-html.js';
import { haptic } from '../../../core/haptics.js';
import { drawMiniCover } from '../../../core/cover-art.js';
import { styles } from './counter-card.css.js';

/**
 * `<counter-card>` — fila-tarjeta de un contador en la lista de home.
 * Muestra icono, nombre, días, barra de progreso al próximo hito y récord.
 * Emite `open` con `detail.id` al pulsarla.
 *
 * API: `.counter` {object} contador del store.
 */
export class CounterCard extends AppElement {
  static styles = [styles];

  /** @param {object} c Contador a representar. */
  set counter(c) { this._counter = c; this._paint(); }
  /** @returns {object} Contador actual. */
  get counter() { return this._counter; }

  /** Pinta la tarjeta a partir del modelo derivado. */
  render() {
    const c = this._counter;
    if (!c) { this.shadowRoot.innerHTML = ''; return; }
    const vm = this._viewModel(c);
    this.shadowRoot.innerHTML = `
      <button class="card" type="button">
        <div class="cover">
          <canvas class="cvr" aria-hidden="true"></canvas>
          <span class="disc" style="background:${vm.color};color:${vm.on}">${vm.days}</span>
        </div>
        <div class="info">
          <div class="name-line">
            <div class="name">${escapeHtml(c.name)}</div>
            ${vm.grew ? `<span class="grew">${t('card.today')}</span>` : ''}
          </div>
          <div class="since">${t('card.since', { date: vm.startLabel })} · ${t('card.best', { best: vm.best })}</div>
          <div class="goal">${vm.goal}</div>
        </div>
      </button>`;
  }

  /** Emite `open` al pulsar o activar con teclado. */
  afterRender() {
    const card = this.$('.card');
    if (!card) return;
    this.on(card, 'click', () => {
      haptic(12);
      // Morph carátula→vinilo: guarda el origen (posición e imagen de la mini-
      // carátula) para que el shell lo anime al pintar el detalle.
      const cover = this.$('.cover');
      const cvr = this.$('.cvr');
      if (cover) {
        let img = null;
        try { img = cvr && cvr.toDataURL ? cvr.toDataURL() : null; } catch (e) { img = null; }
        router.hero = { rect: cover.getBoundingClientRect(), img };
      }
      this.dispatchEvent(new CustomEvent('open', { detail: { id: this._counter.id }, bubbles: true, composed: true }));
    });
    this._drawCover();
    this._animateNumber();
  }

  /** Dibuja la mini-carátula generativa del contador en el lienzo de la tarjeta. */
  _drawCover() {
    const cv = this.$('.cvr');
    if (!cv || !this._counter) return;
    const dpr = window.devicePixelRatio || 1;
    const w = 56;
    cv.width = Math.round(w * dpr); cv.height = Math.round(w * dpr);
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawMiniCover(ctx, w, w, this._counter);
  }

  /** Cancela la cuenta ascendente al desmontar. */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  /** Cuenta el número del disco desde 0 hasta los días, con leve retardo en cascada. */
  _animateNumber() {
    const el = this.$('.disc');
    if (!el || !this._counter) return;
    const target = store.daysOf(this._counter);
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || target <= 0) { el.textContent = String(target); return; }
    const index = Number(this.style.getPropertyValue('--i')) || 0;
    // Espera a que la transición de entrada termine de revelar antes de contar.
    const delay = 620 + Math.min(index * 70, 350);
    const duration = 650;
    el.textContent = '0';
    let startTs = null;
    const step = (ts) => {
      if (startTs === null) startTs = ts;
      const elapsed = ts - startTs - delay;
      if (elapsed < 0) { this._raf = requestAnimationFrame(step); return; }
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * target));
      if (p < 1) this._raf = requestAnimationFrame(step);
    };
    this._raf = requestAnimationFrame(step);
  }

  /**
   * Calcula el modelo de vista (días, progreso, textos) de un contador.
   * @param {object} c Contador.
   * @returns {object} Datos listos para pintar.
   */
  _viewModel(c) {
    const days = store.daysOf(c);
    const next = store.nextOf(c);
    const ladder = store.ladderOf(c);
    const prev = ladder.filter((m) => m <= days).pop() || 0;
    const pct = next ? Math.min(1, (days - prev) / (next - prev)) : 1;
    const gap = next ? next - days : 0;
    const color = COUNTER_COLORS[c.color] || COUNTER_COLORS.accent;
    const digits = String(days).length;
    return {
      days,
      // La cifra encoge según los dígitos para no salirse del disco (48px).
      discSize: digits <= 2 ? '20px' : digits === 3 ? '15px' : '12px',
      dayWord: t(days === 1 ? 'word.day' : 'word.days'),
      best: Math.max(c.best || 0, days),
      startLabel: fmtDate(c.start),
      color: color.value,
      on: color.on,
      pct: pct.toFixed(3),
      grew: c.mode !== 'manual' && (c.seenDay || 0) < store.today() && days > 0,
      goal: next ? (gap === 0 ? t('card.goalHitToday') : t('card.goalDaysTo', { r: gap, next })) : t('card.goalAll'),
    };
  }
}

customElements.define('counter-card', CounterCard);
