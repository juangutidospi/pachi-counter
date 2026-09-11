import { AppElement } from '../../../core/AppElement.js';
import { store, dayIndex, isoFromDayIndex, fmtDate } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { uiIcon } from '../../../core/icons.js';
import { counterHex, ARTHEX } from '../../../core/mural-art.js';
import { playChime, playTick } from '../../../core/sound.js';
import { styles } from './year-view.css.js';

const SWEEP_START = -100; // grados: día 0 arriba-izquierda
const SWEEP = 320;        // barrido total del brazo

/**
 * `<year-view>` — «Vinilo del año»: un disco grande donde arrastras el brazo
 * por los surcos para viajar por la racha, desde el día 0 hasta hoy. Cada hito
 * es una marca; al pasar por uno logrado suena un chime. El centro muestra el
 * día y la fecha en la posición del brazo.
 */
export class YearView extends AppElement {
  static styles = [styles];

  /** Compone cabecera, disco y pie. */
  render() {
    const c = store.find(router.selId) || store.counters[0];
    this._c = c;
    if (!c) {
      this.shadowRoot.innerHTML = `<div class="year"><button class="btn btn-ghost back" id="back">${uiIcon('back', 16)} ${t('detail.back')}</button><div class="empty"><p>${t('mural.empty')}</p></div></div>`;
      return;
    }
    this.shadowRoot.innerHTML = `
      <div class="year">
        <button class="btn btn-ghost back" id="back">${uiIcon('back', 16)} ${t('detail.back')}</button>
        <div class="head">
          <div class="kicker">${t('year.kicker')}</div>
          <h2>${t('year.title')}</h2>
          <p class="subtitle">${t('year.subtitle')}</p>
        </div>
        <div class="stage"><canvas id="canvas"></canvas></div>
        <p class="hint">${t('year.hint')}</p>
      </div>`;
  }

  /** Cablea navegación, arranca el lienzo y el arrastre del brazo. */
  afterRender() {
    this.on(this.$('#back'), 'click', () => router.go('detail'));
    const canvas = this.$('#canvas');
    if (!canvas || !this._c) return;

    const days = store.daysOf(this._c);
    const ladder = store.ladderOf(this._c);
    const start = dayIndex(this._c.start);
    const end = Math.max(days, ladder[ladder.length - 1] || 1, 1);
    const col = counterHex(this._c.color).fill;
    this._model = { days, ladder, start, end, col };
    this._u = end ? days / end : 0; // arranca en «hoy»
    this._prevDay = Math.round(this._u * end);

    this._fit(canvas);
    this._onResize = () => { this._fit(canvas); this._draw(); };
    window.addEventListener('resize', this._onResize);
    this._draw();

    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const at = (e) => {
      const r = canvas.getBoundingClientRect();
      const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
      let rel = a - SWEEP_START; while (rel < 0) rel += 360; while (rel > 360) rel -= 360;
      return Math.max(0, Math.min(1, rel / SWEEP));
    };
    const scrub = (e) => {
      this._u = at(e);
      const day = Math.round(this._u * this._model.end);
      if (day !== this._prevDay) {
        const lo = Math.min(day, this._prevDay), hi = Math.max(day, this._prevDay);
        const crossed = this._model.ladder.some((m) => m > lo && m <= hi && m <= this._model.days);
        if (!reduce) { if (crossed) playChime(); else playTick(); }
        this._prevDay = day;
      }
      this._draw();
    };
    this.on(canvas, 'pointerdown', (e) => { this._drag = true; try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignora */ } scrub(e); e.preventDefault(); });
    this.on(canvas, 'pointermove', (e) => { if (this._drag) scrub(e); });
    this.on(canvas, 'pointerup', () => { this._drag = false; });
    this.on(canvas, 'pointercancel', () => { this._drag = false; });
  }

  /** Ajusta la resolución del lienzo al ancho disponible (cuadrado). */
  _fit(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth || 320;
    canvas.style.height = w + 'px';
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(w * dpr);
    this._ctx = canvas.getContext('2d');
    this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._w = w;
  }

  /** Dibuja el disco, las marcas, el brazo y la lectura central. */
  _draw() {
    const ctx = this._ctx; const W = this._w; if (!ctx) return;
    const m = this._model;
    const cx = W / 2, cy = W / 2, R = W * 0.44;
    ctx.clearRect(0, 0, W, W);
    ctx.fillStyle = ARTHEX.paper; ctx.fillRect(0, 0, W, W);
    // disco
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = '#161514'; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = ARTHEX.ink; ctx.stroke();
    for (let r = R - 8; r > R * 0.42; r -= 6) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(195,186,164,.26)'; ctx.lineWidth = 1; ctx.stroke(); }
    // arco de progreso (0 → u) en color
    const a0 = SWEEP_START * Math.PI / 180;
    const a1 = (SWEEP_START + this._u * SWEEP) * Math.PI / 180;
    ctx.beginPath(); ctx.arc(cx, cy, R - 4, a0, a1); ctx.strokeStyle = m.col; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt';
    // marcas de hito
    m.ladder.forEach((mil) => {
      const u = mil / m.end; const ang = (SWEEP_START + u * SWEEP) * Math.PI / 180;
      const reached = mil <= m.days;
      const rr = R - 20; const mx = cx + Math.cos(ang) * rr, my = cy + Math.sin(ang) * rr;
      ctx.save(); ctx.translate(mx, my); ctx.rotate(ang);
      ctx.fillStyle = reached ? m.col : ARTHEX.groove; ctx.strokeStyle = ARTHEX.ink; ctx.lineWidth = 2;
      ctx.fillRect(-3, -10, 6, 20); ctx.strokeRect(-3, -10, 6, 20); ctx.restore();
    });
    // etiqueta central
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.34, 0, Math.PI * 2); ctx.fillStyle = m.col; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = ARTHEX.ink; ctx.stroke();
    const day = Math.round(this._u * m.end);
    const on = counterHex(this._c.color).on;
    ctx.fillStyle = on; ctx.textAlign = 'center';
    ctx.font = `800 ${Math.round(W * 0.11)}px Syne, sans-serif`; ctx.fillText(String(day), cx, cy + W * 0.01);
    ctx.font = `700 ${Math.round(W * 0.028)}px "Space Grotesk", sans-serif`;
    ctx.fillText(fmtDate(isoFromDayIndex(m.start + day)).toUpperCase(), cx, cy + W * 0.075);
    // brazo
    const ea = (SWEEP_START + this._u * SWEEP) * Math.PI / 180;
    const px = cx + Math.cos(ea) * (R - 14), py = cy + Math.sin(ea) * (R - 14);
    ctx.strokeStyle = ARTHEX.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(W - W * 0.08, W * 0.09); ctx.lineTo(px, py); ctx.stroke();
    ctx.fillStyle = ARTHEX.ink; ctx.beginPath(); ctx.arc(W - W * 0.08, W * 0.09, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ARTHEX.paper; ctx.strokeStyle = ARTHEX.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }

  /** Libera el listener de resize al desmontar. */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._onResize) window.removeEventListener('resize', this._onResize);
  }
}

customElements.define('year-view', YearView);
