import { AppElement } from '../../../core/AppElement.js';
import { store } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { uiIcon } from '../../../core/icons.js';
import { drawMural, muralData } from '../../../core/mural-art.js';
import { buildMuralFile, shareOrSave } from '../../../core/share-card.js';
import { styles } from './mural-view.css.js';

/**
 * `<mural-view>` — el mural generativo: una obra constructivista compuesta a
 * partir de todos los contadores (tamaño por días, un anillo por hito) y las
 * recaídas. Se puede guardar/compartir como póster o fondo de pantalla.
 */
export class MuralView extends AppElement {
  static styles = [styles];

  /** Compone la cabecera, el lienzo y la acción de guardar. */
  render() {
    const has = store.counters.length > 0;
    this.shadowRoot.innerHTML = `
      <div class="mural">
        <button class="btn btn-ghost back" id="back">${uiIcon('back', 16)} ${t('detail.back')}</button>
        <div class="head">
          <div class="kicker">${t('mural.kicker')}</div>
          <h2>${t('mural.title')}</h2>
          <p class="subtitle">${t('mural.subtitle')}</p>
        </div>
        ${has ? `
          <div class="stage"><canvas id="canvas"></canvas></div>
          <button class="btn btn-primary btn-block cta" id="save">${uiIcon('share', 16)} ${t('mural.cta')}</button>
        ` : `<div class="empty"><div class="rings"><span class="r r1"></span><span class="r r2"></span><span class="r r3"></span></div><p>${t('mural.empty')}</p></div>`}
      </div>`;
  }

  /** Cablea navegación, arranca el lienzo animado y pre-genera el póster. */
  afterRender() {
    this.on(this.$('#back'), 'click', () => router.go('shelf'));
    const canvas = this.$('#canvas');
    if (!canvas) return;
    this._data = muralData();
    this._startCanvas(canvas);

    this._file = null;
    buildMuralFile().then((f) => { this._file = f; });
    this.on(this.$('#save'), 'click', () => this._save());
  }

  /** Ajusta la resolución del lienzo y arranca el bucle de dibujo. */
  _startCanvas(canvas) {
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth || 320;
      const h = Math.round(w * 1.25);
      canvas.style.height = h + 'px';
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, w, h };
    };
    let dim = fit();
    this._onResize = () => { dim = fit(); if (reduce) drawMural(dim.ctx, dim.w, dim.h, 0, this._data); };
    window.addEventListener('resize', this._onResize);

    if (reduce) { drawMural(dim.ctx, dim.w, dim.h, 0, this._data); return; }
    const loop = (ts) => {
      drawMural(dim.ctx, dim.w, dim.h, ts, this._data);
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  /** Comparte o guarda el mural como imagen. */
  _save() {
    const text = t('mural.title');
    const done = (r) => { if (r === 'saved') router.flash(t('toast.imgSaved')); else if (r === 'error') router.flash(t('toast.imgFail')); };
    if (this._file) shareOrSave(this._file, text).then(done);
    else buildMuralFile().then((f) => shareOrSave(f, text).then(done));
  }

  /** Detiene el bucle y libera el listener de resize al desmontar. */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._onResize) window.removeEventListener('resize', this._onResize);
  }
}

customElements.define('mural-view', MuralView);
