import { AppElement } from '../../../core/AppElement.js';
import { router } from '../../../core/router.js';
import { store } from '../../../core/store.js';
import { t } from '../../../core/i18n.js';
import { styles } from './splash-view.css.js';

/**
 * `<splash-view>` — pantalla de bienvenida animada. Solo avanza a home
 * cuando el usuario toca; no hay avance automático.
 */
export class SplashView extends AppElement {
  static styles = [styles];

  /** Pinta la portada Bauhaus: marco técnico, emblema, wordmark y CTA. */
  render() {
    this.shadowRoot.innerHTML = `
      <div class="cover">
        <div class="grid"></div>
        <div class="frameline"></div>
        <span class="tick t1"></span><span class="tick t2"></span>
        <span class="tick t3"></span><span class="tick t4"></span>

        <div class="scr">
          <div class="meta"><span>${t('app.name1')} ${t('app.name2')}</span><span class="idx">N°01 · 2026</span></div>

          <div class="art">
            <div class="diag"></div>
            <svg class="emblem" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <clipPath id="pc-clip"><circle cx="100" cy="100" r="86"></circle></clipPath>
                <linearGradient id="pc-sheen" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stop-color="#fff" stop-opacity="0"></stop>
                  <stop offset="0.5" stop-color="#fff" stop-opacity="0.55"></stop>
                  <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                </linearGradient>
              </defs>

              <g class="disc">
                <circle class="base" cx="100" cy="100" r="86" fill="var(--ink)"></circle>
                <path class="q q-red" d="M100 100 L100 14 A86 86 0 0 1 186 100 Z" fill="var(--red)"></path>
                <path class="q q-yellow" d="M100 100 L100 186 A86 86 0 0 1 14 100 Z" fill="var(--yellow)"></path>
                <g class="grooves" fill="none" stroke="var(--paper)" stroke-width="3" stroke-linecap="round">
                  <circle class="groove g1" cx="100" cy="100" r="72" pathLength="100"></circle>
                  <circle class="groove g2" cx="100" cy="100" r="58" pathLength="100"></circle>
                  <circle class="groove g3" cx="100" cy="100" r="44" pathLength="100"></circle>
                </g>
              </g>

              <rect class="bar" x="93" y="6" width="14" height="188" fill="var(--blue)"></rect>

              <g class="hub">
                <circle cx="100" cy="100" r="26" fill="var(--paper)"></circle>
                <text x="100" y="101" text-anchor="middle" dominant-baseline="central"
                  font-family="Syne, sans-serif" font-weight="800" font-size="34" fill="var(--ink)">P</text>
              </g>

              <rect class="sheen" x="-40" y="-20" width="46" height="240" fill="url(#pc-sheen)" clip-path="url(#pc-clip)"></rect>
            </svg>
          </div>

          <div class="title">
            <div class="k">— ${t('splash.kicker')}</div>
            <h1><span class="l1">${t('app.name1')}</span><span class="l2">${t('app.name2')}</span></h1>
            <span class="tag">${t('app.tagline')}</span>
            <div class="enter"><span class="arrow">↑</span> ${t('splash.enter')}</div>
          </div>
        </div>
      </div>`;
  }

  /** Cablea el toque para entrar (no hay avance automático). */
  afterRender() {
    this.on(this.$('.cover'), 'click', () => this._enter());
  }

  /** Entra a home y, si procede, lanza la celebración pendiente. */
  _enter() {
    router.go('home');
    const pending = store.pendingCelebration();
    if (pending) router.openCelebration(pending);
  }
}

customElements.define('splash-view', SplashView);
