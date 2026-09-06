import { AppElement } from '../../../core/AppElement.js';
import { store } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { escapeHtml } from '../../../core/escape-html.js';
import { styles } from './hard-screen.css.js';

/**
 * `<hard-screen>` — pantalla de apoyo para un día difícil. Muestra la nota
 * personal del contador (o un mensaje por defecto) y anima a seguir en pie.
 */
export class HardScreen extends AppElement {
  static styles = [styles];

  /** Compone el mensaje de apoyo. */
  render() {
    const c = store.find(router.selId);
    if (!c) { this.shadowRoot.innerHTML = ''; return; }
    const days = store.daysOf(c);
    const word = t(days === 1 ? 'word.day' : 'word.days');
    const text = c.note ? c.note : t('hard.defaultText', { d: days });
    const foot = c.note ? t('hard.footNote', { tomorrow: days + 1 }) : t('hard.footDefault');
    this.shadowRoot.innerHTML = `
      <div class="hard" id="scrim">
        <div class="inner">
          <div class="kicker">${escapeHtml(t('hard.kicker', { d: days, word, tail: c.tail }))}</div>
          <p class="text">${escapeHtml(text)}</p>
          <div class="sep"></div>
          <p class="foot">${escapeHtml(foot)}</p>
          <button class="btn btn-primary close" id="close">${t('hard.close')}</button>
        </div>
      </div>`;
  }

  /** Cablea el cierre (toque en cualquier parte o en el botón). */
  afterRender() {
    if (!this.$('#scrim')) return;
    this.on(this.$('#scrim'), 'click', () => router.closeHard());
  }
}

customElements.define('hard-screen', HardScreen);
