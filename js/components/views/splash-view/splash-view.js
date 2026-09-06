import { AppElement } from '../../../core/AppElement.js';
import { router } from '../../../core/router.js';
import { store } from '../../../core/store.js';
import { t } from '../../../core/i18n.js';
import { styles } from './splash-view.css.js';

/** Milisegundos que dura la splash antes de avanzar sola a home. */
const SPLASH_MS = 2900;

/**
 * `<splash-view>` — pantalla de bienvenida animada. Avanza a home al tocar
 * o automáticamente tras `SPLASH_MS`.
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

  /** Cablea el toque para saltar y arranca el temporizador de avance. */
  afterRender() {
    this.on(this.$('.splash'), 'click', () => this._enter());
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this._enter(), SPLASH_MS);
  }

  /** Limpia el temporizador al desmontar. */
  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._timer);
  }

  /** Entra a home y, si procede, lanza la celebración pendiente. */
  _enter() {
    clearTimeout(this._timer);
    router.go('home');
    const pending = store.pendingCelebration();
    if (pending) router.openCelebration(pending);
  }
}

customElements.define('splash-view', SplashView);
