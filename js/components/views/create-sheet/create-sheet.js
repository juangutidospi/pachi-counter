import { AppElement } from '../../../core/AppElement.js';
import { store, COUNTER_COLORS, DEF_MILESTONES } from '../../../core/store.js';
import { router } from '../../../core/router.js';
import { t } from '../../../core/i18n.js';
import { counterIcon, COUNTER_ICONS } from '../../../core/icons.js';
import { escapeHtml } from '../../../core/escape-html.js';
import '../../ui/seg-control/seg-control.js';
import { styles } from './create-sheet.css.js';

/**
 * `<create-sheet>` — hoja modal para crear un contador. Mantiene su propio
 * borrador local y solo escribe en el store al confirmar.
 */
export class CreateSheet extends AppElement {
  static styles = [styles];

  constructor() {
    super();
    this._draft = this._blank();
  }

  /** @returns {object} Borrador inicial en blanco. */
  _blank() {
    return { kind: 'quit', name: '', tail: '', icon: 'ban', color: 'accent', pastStart: false, ago: 0, msCustom: false, ms: '1, 3, 7, 21, 30', why: '' };
  }

  /** Compone la hoja modal. */
  render() {
    const d = this._draft;
    const enter = this._mounted ? '' : 'enter';
    this.shadowRoot.innerHTML = `
      <div class="scrim" id="scrim">
        <div class="sheet ${enter}" id="sheet">
          <div class="grabber"></div>
          <h3>${t('create.title')}</h3>
          <p class="text-muted subtitle">${t('create.subtitle')}</p>

          <div class="field gap6">
            <label>${t('create.kindLabel')}</label>
            <seg-control id="kind"></seg-control>
          </div>

          <div class="field">
            <label>${t('create.nameLabel')}</label>
            <input class="input" id="name" value="${escapeHtml(d.name)}" placeholder="${t('create.namePh.' + d.kind)}">
          </div>

          <div class="field">
            <label>${t('create.tailLabel')}</label>
            <div class="tail-row">
              <span class="prefix">${t('create.tailPrefix')}</span>
              <input class="input" id="tail" value="${escapeHtml(d.tail)}" placeholder="${t('create.tailPh.' + d.kind)}">
            </div>
          </div>

          <div class="field">
            <label>${t('create.iconLabel')}</label>
            <div class="icons">${this._iconsTpl}</div>
          </div>

          <div class="field">
            <label>${t('create.colorLabel')}</label>
            <div class="colors">${this._colorsTpl}</div>
          </div>

          <div class="field">
            <label>${t('create.startLabel')}</label>
            <seg-control id="start"></seg-control>
            ${d.pastStart ? `
              <div class="ago-row">
                <input class="input" type="number" min="0" max="3650" id="ago" value="${d.ago}">
                <span class="suffix">${t('create.agoSuffix')}</span>
              </div>` : ''}
          </div>

          <div class="field">
            <label>${t('create.msLabel')}</label>
            <seg-control id="ms-mode"></seg-control>
            ${d.msCustom ? `<input class="input ms-custom" id="ms" value="${escapeHtml(d.ms)}" placeholder="${t('create.msPh')}">` : ''}
            <div class="ms-preview">${this._msPreview()}</div>
          </div>

          <div class="field">
            <label>${t('create.whyLabel')} <span class="why-optional">${t('create.whyOptional')}</span></label>
            <textarea class="input" id="why" placeholder="${t('create.whyPh')}">${escapeHtml(d.why)}</textarea>
          </div>

          <div class="buttons">
            <button class="btn btn-secondary cancel" id="cancel">${t('create.cancel')}</button>
            <button class="btn btn-primary submit" id="submit" ${this._invalid() ? 'disabled' : ''}>${t('create.submit')}</button>
          </div>
        </div>
      </div>`;
  }

  /** @returns {string} Selector de iconos. */
  get _iconsTpl() {
    return Object.keys(COUNTER_ICONS).map((key) =>
      `<button class="icon-btn ${this._draft.icon === key ? 'active' : ''}" data-icon="${key}" aria-label="${key}">${counterIcon(key, 20)}</button>`
    ).join('');
  }

  /** @returns {string} Selector de acentos. */
  get _colorsTpl() {
    return Object.keys(COUNTER_COLORS).map((key) => {
      const c = COUNTER_COLORS[key];
      const ring = this._draft.color === key ? `box-shadow:0 0 0 2px var(--color-bg), 0 0 0 4px ${c.value};` : '';
      return `<button class="color-btn" data-color="${key}" aria-label="${t('create.color.' + key)}" style="background:${c.value};${ring}"></button>`;
    }).join('');
  }

  /** Cablea segmentos, pickers, inputs y acciones. */
  afterRender() {
    this._mounted = true;
    const d = this._draft;

    const kind = this.$('#kind');
    kind.options = ['quit', 'build'].map((v) => ({ value: v, label: t('create.kind.' + v) }));
    kind.value = d.kind;
    this.on(kind, 'change', (e) => this._patch({ kind: e.detail.value }));

    const start = this.$('#start');
    start.options = [{ value: 'today', label: t('create.startToday') }, { value: 'past', label: t('create.startPast') }];
    start.value = d.pastStart ? 'past' : 'today';
    this.on(start, 'change', (e) => this._patch({ pastStart: e.detail.value === 'past' }));

    const msMode = this.$('#ms-mode');
    msMode.options = [{ value: 'default', label: t('create.msDefault') }, { value: 'custom', label: t('create.msCustom') }];
    msMode.value = d.msCustom ? 'custom' : 'default';
    this.on(msMode, 'change', (e) => this._patch({ msCustom: e.detail.value === 'custom' }));

    this.on(this.$('#name'), 'change', (e) => this._patch({ name: e.target.value }, false));
    this.on(this.$('#tail'), 'change', (e) => this._patch({ tail: e.target.value }, false));
    this.on(this.$('#why'), 'change', (e) => this._patch({ why: e.target.value }, false));
    const ago = this.$('#ago');
    if (ago) this.on(ago, 'change', (e) => this._patch({ ago: Math.max(0, parseInt(e.target.value, 10) || 0) }, false));
    const ms = this.$('#ms');
    if (ms) this.on(ms, 'change', (e) => this._patch({ ms: e.target.value }, false));

    this.$$('.icon-btn').forEach((btn) => this.on(btn, 'click', () => this._patch({ icon: btn.dataset.icon })));
    this.$$('.color-btn').forEach((btn) => this.on(btn, 'click', () => this._patch({ color: btn.dataset.color })));

    this.on(this.$('#scrim'), 'click', (e) => { if (e.target === this.$('#scrim')) this._cancel(); });
    this.on(this.$('#cancel'), 'click', () => this._cancel());
    this.on(this.$('#submit'), 'click', () => this._submit());
  }

  /**
   * Mezcla un parche en el borrador.
   * @param {object} patch Campos a cambiar.
   * @param {boolean} [repaint] Si debe re-renderizar (por defecto sí).
   */
  _patch(patch, repaint = true) {
    this._draft = { ...this._draft, ...patch };
    if (repaint) this._paint();
    else this._syncSubmit();
  }

  /** Actualiza solo el estado del botón de confirmar (sin re-render). */
  _syncSubmit() {
    const submit = this.$('#submit');
    if (submit) submit.disabled = this._invalid();
    const preview = this.$('.ms-preview');
    if (preview) preview.textContent = this._msPreview();
  }

  /** @returns {number[]} Hitos parseados según el modo. */
  _milestones() {
    if (!this._draft.msCustom) return DEF_MILESTONES;
    return this._draft.ms.split(',').map((x) => parseInt(x.trim(), 10)).filter((n) => n > 0).sort((a, b) => a - b);
  }

  /** @returns {string} Texto de vista previa de los hitos. */
  _msPreview() {
    const ms = this._milestones();
    return ms.length ? t('create.msPreview', { list: ms.join(' · ') }) : t('create.msPreviewEmpty');
  }

  /** @returns {boolean} Si el borrador es inválido (no se puede crear). */
  _invalid() { return !this._draft.name.trim() || !this._milestones().length; }

  /** Cierra la hoja sin crear, con la animación inversa (encoge hacia el botón +). */
  _cancel() {
    if (this._leaving) return;
    const scrim = this.$('#scrim');
    const sheet = this.$('.sheet');
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!scrim || !sheet || reduce) { this._reset(); router.closeCreate(); return; }
    this._leaving = true;
    scrim.classList.add('leaving');
    let called = false;
    const done = () => { if (called) return; called = true; this._reset(); router.closeCreate(); };
    sheet.addEventListener('animationend', done, { once: true });
    setTimeout(done, 650);
  }

  /** Restablece el borrador para la próxima apertura. */
  _reset() { this._draft = this._blank(); this._mounted = false; }

  /** Valida y crea el contador; navega a su detalle. */
  _submit() {
    if (this._invalid()) return;
    const d = this._draft;
    const name = d.name.trim();
    const id = store.create({
      name, tail: d.tail.trim() || name.toLowerCase(), kind: d.kind, icon: d.icon, color: d.color,
      ago: d.pastStart ? d.ago : 0, milestones: this._milestones(), note: d.why.trim(),
    });
    this._reset();
    router.go('detail', id);
    router.flash(t('toast.created', { name }));
  }
}

customElements.define('create-sheet', CreateSheet);
