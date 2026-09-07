import { AppElement } from '../../../core/AppElement.js';
import { router } from '../../../core/router.js';
import { store } from '../../../core/store.js';
import { t } from '../../../core/i18n.js';
import { escapeHtml } from '../../../core/escape-html.js';
import { haptic } from '../../../core/haptics.js';
import { styles } from './celebrate-screen.css.js';

/** Colores del confeti (primarios Bauhaus). */
const CONFETTI_TONES = ['var(--blue)', 'var(--red)', 'var(--yellow)', 'var(--ink)'];

/**
 * `<celebrate-screen>` — pantalla de celebración al alcanzar un hito.
 * Muestra confeti, el número de días y la siguiente meta. Al cerrarse marca
 * el hito como visto para no repetir la celebración.
 */
export class CelebrateScreen extends AppElement {
  static styles = [styles];

  /** Compone la pantalla con el confeti y el mensaje. */
  render() {
    const cel = router.celebration;
    if (!cel) { this.shadowRoot.innerHTML = ''; return; }
    const foot = cel.next ? t('celebrate.footNext', { next: cel.next, r: cel.next - cel.days }) : t('celebrate.footNone');
    this.shadowRoot.innerHTML = `
      <div class="celebrate" id="scrim">
        <div class="confetti">${this._confettiTpl()}</div>
        <div class="content">
          <div class="logo">
            <div class="ring r1"></div><div class="ring r2"></div>
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="${cel.color}" stroke-width="3"
                stroke-linecap="round" stroke-dasharray="327" stroke-dashoffset="0"></circle>
            </svg>
            <div>
              <div class="days">${cel.days}</div>
              <div class="tail">${escapeHtml(t('celebrate.tail', { tail: cel.tail }))}</div>
            </div>
          </div>
          <p class="phrase">${escapeHtml(t('celebrate.phrase', { d: cel.days, tail: cel.tail }))}</p>
          <p class="foot">${escapeHtml(foot)}</p>
          <button class="btn btn-primary close" id="close">${t('celebrate.close')}</button>
        </div>
      </div>`;
  }

  /** @returns {string} 18 piezas de confeti con parámetros deterministas. */
  _confettiTpl() {
    let html = '';
    for (let i = 0; i < 18; i++) {
      const left = (3 + (i * 5.4) % 94).toFixed(1) + '%';
      const w = (i % 3 === 0 ? 3 : 5) + 'px';
      const h = (i % 4 === 0 ? 10 : 5) + 'px';
      const bg = CONFETTI_TONES[i % CONFETTI_TONES.length];
      const dur = (2.4 + (i % 5) * 0.45).toFixed(2) + 's';
      const delay = ((i % 7) * 0.22).toFixed(2) + 's';
      html += `<i style="left:${left};width:${w};height:${h};background:${bg};animation-duration:${dur};animation-delay:${delay}"></i>`;
    }
    return html;
  }

  /** Cablea el cierre, el registro del hito y una vibración de celebración. */
  afterRender() {
    if (!this.$('#scrim')) return;
    this.on(this.$('#scrim'), 'click', () => this._close());
    haptic([18, 40, 24]);
  }

  /** Marca el hito como visto y cierra la pantalla. */
  _close() {
    const cel = router.celebration;
    if (cel) store.markCelebrated(cel.id, cel.days);
    router.closeCelebration();
  }
}

customElements.define('celebrate-screen', CelebrateScreen);
