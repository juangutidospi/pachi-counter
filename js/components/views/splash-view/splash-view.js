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

  /** Pinta el logotipo animado, el nombre y la invitación a entrar. */
  render() {
    this.shadowRoot.innerHTML = `
      <div class="splash">
        <div class="stack">
          <div class="logo">
            <div class="ring r1"></div><div class="ring r2"></div>
            <div class="ring r3"></div><div class="ring r4"></div>
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-accent)" stroke-width="2"
                stroke-linecap="round" stroke-dasharray="327" stroke-dashoffset="66"></circle>
            </svg>
            <div class="letter">P</div>
          </div>
          <div class="gap"></div>
          <div class="name line1">${t('app.name1')}</div>
          <div class="name line2">${t('app.name2')}</div>
          <div class="tagline">${t('app.tagline')}</div>
        </div>
        <div class="enter">${t('splash.enter')}</div>
      </div>`;
  }

  /** Cablea el toque para entrar (no hay avance automático). */
  afterRender() {
    this.on(this.$('.splash'), 'click', () => this._enter());
  }

  /** Entra a home y, si procede, lanza la celebración pendiente. */
  _enter() {
    router.go('home');
    const pending = store.pendingCelebration();
    if (pending) router.openCelebration(pending);
  }
}

customElements.define('splash-view', SplashView);
