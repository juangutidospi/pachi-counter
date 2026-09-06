import { AppElement } from '../../../core/AppElement.js';
import { store } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { theme } from '../../../core/theme.js';
import { t, getLang, setLang } from '../../../core/i18n.js';
import { uiIcon } from '../../../core/icons.js';
import { escapeHtml } from '../../../core/escape-html.js';
import '../../ui/seg-control/seg-control.js';
import { styles } from './settings-view.css.js';

/**
 * `<settings-view>` — ajustes: tono de las frases, recordatorio diario,
 * idioma, tema y gestión de datos (exportar / borrar).
 */
export class SettingsView extends AppElement {
  static styles = [styles];

  /** Compone la pantalla de ajustes. */
  render() {
    this.shadowRoot.innerHTML = `
      <div class="settings">
        <button class="btn btn-ghost back" id="back">${uiIcon('back', 16)} ${t('detail.back')}</button>
        <h2>${t('settings.title')}</h2>

        <div class="field first">
          <label>${t('settings.toneLabel')}</label>
          <seg-control id="tone"></seg-control>
          <p class="text-muted sample" id="sample">${escapeHtml(t('settings.toneSample.' + store.tone))}</p>
        </div>

        <div class="field">
          <label>${t('settings.reminderLabel')}</label>
          <div class="reminder-row">
            <input class="input" type="time" id="reminder" value="${escapeHtml(store.reminder)}">
            <span class="hint">${t('settings.reminderHint')}</span>
          </div>
        </div>

        <div class="field">
          <label>${t('settings.langLabel')}</label>
          <seg-control id="lang"></seg-control>
        </div>

        <div class="field">
          <label>${t('settings.themeLabel')}</label>
          <seg-control id="theme"></seg-control>
        </div>

        <h6>${t('settings.dataTitle')}</h6>
        <div class="card elev-sm data">
          <div class="row"><span class="k">${t('settings.savedIn')}</span><span class="mono">localStorage · pachi.v1</span></div>
          <div class="row"><span class="k">${t('settings.size')}</span><span class="v">${t('settings.bytes', { n: store.storeSize() })}</span></div>
          <div class="actions">
            <button class="btn btn-secondary export" id="export">${t('settings.export')}</button>
            <button class="btn btn-ghost wipe" id="wipe">${t('settings.wipe')}</button>
          </div>
        </div>

        <p class="text-muted footer">${t('settings.footer')}</p>
      </div>`;
  }

  /** Cablea los controles segmentados, el recordatorio y los datos. */
  afterRender() {
    this.on(this.$('#back'), 'click', () => router.go('home'));

    const tone = this.$('#tone');
    tone.options = ['warm', 'direct', 'sober'].map((v) => ({ value: v, label: t('settings.tone.' + v) }));
    tone.value = store.tone;
    this.on(tone, 'change', (e) => {
      store.setTone(e.detail.value);
      this.$('#sample').textContent = t('settings.toneSample.' + e.detail.value);
    });

    const lang = this.$('#lang');
    lang.options = ['es', 'en'].map((v) => ({ value: v, label: t('settings.lang.' + v) }));
    lang.value = getLang();
    this.on(lang, 'change', (e) => setLang(e.detail.value));

    const themeCtl = this.$('#theme');
    themeCtl.options = ['dark', 'light'].map((v) => ({ value: v, label: t('settings.theme.' + v) }));
    themeCtl.value = theme.current;
    this.on(themeCtl, 'change', (e) => theme.set(e.detail.value));

    this.on(this.$('#reminder'), 'change', (e) => store.setReminder(e.target.value));
    this.on(this.$('#export'), 'click', () => this._export());
    this.on(this.$('#wipe'), 'click', () => this._wipe());
  }

  /** Copia el JSON de datos al portapapeles. */
  _export() {
    if (navigator.clipboard) navigator.clipboard.writeText(store.exportJson()).catch(() => {});
    router.flash(t('toast.exported'));
  }

  /** Borra todos los datos y vuelve a home. */
  _wipe() {
    store.wipe();
    router.go('home');
    router.flash(t('toast.wiped'));
  }
}

customElements.define('settings-view', SettingsView);
