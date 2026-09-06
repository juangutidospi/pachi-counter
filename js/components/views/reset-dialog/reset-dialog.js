import { AppElement } from '../../../core/AppElement.js';
import { store } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { escapeHtml } from '../../../core/escape-html.js';
import { styles } from './reset-dialog.css.js';

/**
 * `<reset-dialog>` — confirmación de «¿volver a 0?». Reinicia la racha del
 * contador seleccionado, guardando la mejor racha.
 */
export class ResetDialog extends AppElement {
  static styles = [styles];

  /** Compone el diálogo con el aviso del reinicio. */
  render() {
    const c = store.find(router.selId);
    if (!c) { this.shadowRoot.innerHTML = ''; return; }
    const days = store.daysOf(c);
    const best = Math.max(c.best || 0, days);
    this.shadowRoot.innerHTML = `
      <div class="dialog-backdrop" id="backdrop">
        <div class="dialog">
          <div class="dialog-title">${t('reset.title')}</div>
          <div class="dialog-body">${escapeHtml(t('reset.body', { d: days, tail: c.tail, best }))}</div>
          <div class="dialog-actions">
            <button class="btn btn-secondary" id="keep">${t('reset.keep')}</button>
            <button class="btn btn-primary" id="confirm">${t('reset.confirm')}</button>
          </div>
        </div>
      </div>`;
  }

  /** Cablea cerrar y confirmar. */
  afterRender() {
    if (!this.$('#confirm')) return;
    this.on(this.$('#backdrop'), 'click', (e) => { if (e.target === this.$('#backdrop')) router.closeReset(); });
    this.on(this.$('#keep'), 'click', () => router.closeReset());
    this.on(this.$('#confirm'), 'click', () => {
      const best = store.reset(router.selId);
      router.closeReset();
      router.flash(t('toast.reset', { best }));
    });
  }
}

customElements.define('reset-dialog', ResetDialog);
