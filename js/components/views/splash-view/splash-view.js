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
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="86" fill="var(--ink)"></circle>
              <path d="M100 100 L100 14 A86 86 0 0 1 186 100 Z" fill="var(--red)"></path>
              <path d="M100 100 L100 186 A86 86 0 0 1 14 100 Z" fill="var(--yellow)"></path>
              <circle cx="100" cy="100" r="60" fill="none" stroke="var(--paper)" stroke-width="3"></circle>
              <circle cx="100" cy="100" r="40" fill="none" stroke="var(--paper)" stroke-width="3"></circle>
              <rect x="93" y="6" width="14" height="188" fill="var(--blue)"></rect>
              <circle cx="100" cy="100" r="26" fill="var(--paper)"></circle>
              <text x="100" y="101" text-anchor="middle" dominant-baseline="central"
                font-family="Syne, sans-serif" font-weight="800" font-size="34" fill="var(--ink)">P</text>
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
