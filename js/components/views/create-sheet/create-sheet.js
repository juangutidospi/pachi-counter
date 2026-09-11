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
    return { kind: 'quit', mode: 'auto', name: '', tail: '', icon: 'ban', color: 'accent', pastStart: false, ago: 0, msCustom: false, ms: '1, 3, 7, 21, 30', why: '' };
  }

  /** Compone la hoja modal. */
  render() {
    const d = this._draft;
    const enter = this._mounted ? '' : 'enter';
    const c = COUNTER_COLORS[d.color] || COUNTER_COLORS.accent;
    const hasName = !!d.name.trim();
    const nameShown = hasName ? d.name.trim() : t('create.namePh.' + d.kind);
    const readTail = d.tail.trim() || t('create.tailPh.' + d.kind);
    this.shadowRoot.innerHTML = `
      <div class="scrim" id="scrim">
        <div class="sheet ${enter}" id="sheet" style="--acc:${c.value};--on:${c.on}">
          <button class="close" id="close" type="button" aria-label="${t('create.close')}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"><path d="M6 6l12 12M18 6 6 18"></path></svg>
          </button>
          <div class="sheet-scroll">
          <div class="grabber"></div>

          <header class="head">
            <div class="pv-disc" id="pv-disc">${counterIcon(d.icon, 30)}</div>
            <div class="head-txt">
              <span class="kicker">${t('create.badge')}</span>
              <h3 class="pv-title ${hasName ? '' : 'ph'}" id="pv-title">${escapeHtml(nameShown)}</h3>
              <p class="pv-read" id="pv-read">${t('create.tailPrefix')} · ${escapeHtml(readTail)}</p>
            </div>
          </header>

          <div class="field gap6">
            <label>${t('create.kindLabel')}</label>
            <seg-control id="kind"></seg-control>
          </div>

          <div class="field">
            <label>${t('create.modeLabel')}</label>
            <seg-control id="mode"></seg-control>
            <p class="mode-hint" id="mode-hint">${t('create.modeHint.' + (d.mode || 'auto'))}</p>
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

          <div class="field look">
            <label>${t('create.lookLabel')}</label>
            <div class="swatches">${this._colorsTpl}</div>
            <div class="icons">${this._iconsTpl}</div>
          </div>

          <div class="field">
            <label>${t('create.startLabel')}</label>
            <seg-control id="start"></seg-control>
            <div class="ago-row ${d.pastStart ? '' : 'hide'}" id="ago-row">
              <input class="input" type="number" min="0" max="3650" id="ago" value="${d.ago}">
              <span class="suffix">${t('create.agoSuffix')}</span>
            </div>
          </div>

          <div class="field">
            <label>${t('create.msLabel')}</label>
            <seg-control id="ms-mode"></seg-control>
            <input class="input ms-custom ${d.msCustom ? '' : 'hide'}" id="ms" value="${escapeHtml(d.ms)}" placeholder="${t('create.msPh')}">
            <div class="ms-preview">${this._msPreview()}</div>
          </div>

          <div class="field">
            <label>${t('create.whyLabel')} <span class="why-optional">${t('create.whyOptional')}</span></label>
            <textarea class="input" id="why" placeholder="${t('create.whyPh')}">${escapeHtml(d.why)}</textarea>
          </div>

          <div class="buttons">
            <button class="btn btn-primary btn-block submit" id="submit" ${this._invalid() ? 'disabled' : ''}>${t('create.submit')}</button>
          </div>
          </div>
        </div>
      </div>`;
  }

  /** @returns {string} Rejilla de iconos; el activo adopta el color elegido. */
  get _iconsTpl() {
    return Object.keys(COUNTER_ICONS).map((key) => {
      const active = this._draft.icon === key;
      return `<button class="icon-btn ${active ? 'active' : ''}" data-icon="${key}" aria-label="${key}" aria-pressed="${active}">${counterIcon(key, 18)}</button>`;
    }).join('');
  }

  /** @returns {string} Selector de acentos como swatches Bauhaus. */
  get _colorsTpl() {
    return Object.keys(COUNTER_COLORS).map((key) => {
      const c = COUNTER_COLORS[key];
      const active = this._draft.color === key;
      return `<button class="swatch ${active ? 'active' : ''}" data-color="${key}" aria-label="${t('create.color.' + key)}" aria-pressed="${active}" style="background:${c.value}"></button>`;
    }).join('');
  }

  /**
   * Cablea segmentos, pickers, inputs y acciones.
   * Las selecciones (tipo, color, icono, inicio, hitos) se aplican en el sitio,
   * sin re-render, para no reiniciar el scroll ni producir parpadeos.
   */
  afterRender() {
    this._mounted = true;
    const d = this._draft;

    const kind = this.$('#kind');
    kind.options = ['quit', 'build'].map((v) => ({ value: v, label: t('create.kind.' + v) }));
    kind.value = d.kind;
    this.on(kind, 'change', (e) => this._setKind(e.detail.value));

    const mode = this.$('#mode');
    mode.options = ['auto', 'manual'].map((v) => ({ value: v, label: t('create.mode.' + v) }));
    mode.value = d.mode || 'auto';
    this.on(mode, 'change', (e) => {
      this._draft.mode = e.detail.value;
      const hint = this.$('#mode-hint');
      if (hint) hint.textContent = t('create.modeHint.' + e.detail.value);
    });

    const start = this.$('#start');
    start.options = [{ value: 'today', label: t('create.startToday') }, { value: 'past', label: t('create.startPast') }];
    start.value = d.pastStart ? 'past' : 'today';
    this.on(start, 'change', (e) => this._setStart(e.detail.value === 'past'));

    const msMode = this.$('#ms-mode');
    msMode.options = [{ value: 'default', label: t('create.msDefault') }, { value: 'custom', label: t('create.msCustom') }];
    msMode.value = d.msCustom ? 'custom' : 'default';
    this.on(msMode, 'change', (e) => this._setMsMode(e.detail.value === 'custom'));

    this.on(this.$('#name'), 'input', (e) => this._patch({ name: e.target.value }, false));
    this.on(this.$('#tail'), 'input', (e) => this._patch({ tail: e.target.value }, false));
    this.on(this.$('#why'), 'input', (e) => { this._draft.why = e.target.value; });
    this.on(this.$('#ago'), 'input', (e) => { this._draft.ago = Math.max(0, parseInt(e.target.value, 10) || 0); });
    this.on(this.$('#ms'), 'input', (e) => { this._draft.ms = e.target.value; this._syncSubmit(); });

    this.$$('.icon-btn').forEach((btn) => this.on(btn, 'click', () => this._selectIcon(btn.dataset.icon)));
    this.$$('.swatch').forEach((btn) => this.on(btn, 'click', () => this._selectColor(btn.dataset.color)));

    this.on(this.$('#scrim'), 'click', (e) => { if (e.target === this.$('#scrim')) this._cancel(); });
    this.on(this.$('#close'), 'click', () => this._cancel());
    this.on(this.$('#submit'), 'click', () => this._submit());
  }

  /**
   * Cambia el tipo (dejar/hacer): actualiza placeholders y la cabecera, sin repintar.
   * @param {string} kind Nuevo tipo.
   */
  _setKind(kind) {
    this._draft.kind = kind;
    const name = this.$('#name');
    const tail = this.$('#tail');
    if (name) name.placeholder = t('create.namePh.' + kind);
    if (tail) tail.placeholder = t('create.tailPh.' + kind);
    this._refreshPreview();
  }

  /**
   * Muestra u oculta el campo de días ya cumplidos, sin repintar.
   * @param {boolean} past Si el inicio es en el pasado.
   */
  _setStart(past) {
    this._draft.pastStart = past;
    const row = this.$('#ago-row');
    if (row) row.classList.toggle('hide', !past);
  }

  /**
   * Alterna entre hitos por defecto y personalizados, sin repintar.
   * @param {boolean} custom Si se usan hitos propios.
   */
  _setMsMode(custom) {
    this._draft.msCustom = custom;
    const ms = this.$('#ms');
    if (ms) ms.classList.toggle('hide', !custom);
    this._syncSubmit();
  }

  /**
   * Selecciona un icono: actualiza el estado activo y el disco de vista previa.
   * @param {string} key Clave del icono.
   */
  _selectIcon(key) {
    this._draft.icon = key;
    this.$$('.icon-btn').forEach((btn) => {
      const on = btn.dataset.icon === key;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    const disc = this.$('#pv-disc');
    if (disc) disc.innerHTML = counterIcon(key, 30);
  }

  /**
   * Selecciona un color: actualiza el swatch activo y el acento (disco e icono).
   * @param {string} key Clave del color.
   */
  _selectColor(key) {
    this._draft.color = key;
    this.$$('.swatch').forEach((btn) => {
      const on = btn.dataset.color === key;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    const c = COUNTER_COLORS[key] || COUNTER_COLORS.accent;
    const sheet = this.$('.sheet');
    if (sheet) { sheet.style.setProperty('--acc', c.value); sheet.style.setProperty('--on', c.on); }
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

  /** Actualiza el botón de confirmar, la vista previa de hitos y la cabecera viva. */
  _syncSubmit() {
    const submit = this.$('#submit');
    if (submit) submit.disabled = this._invalid();
    const preview = this.$('.ms-preview');
    if (preview) preview.textContent = this._msPreview();
    this._refreshPreview();
  }

  /** Refresca la cabecera de vista previa (nombre y lectura) al escribir. */
  _refreshPreview() {
    const d = this._draft;
    const hasName = !!d.name.trim();
    const title = this.$('#pv-title');
    if (title) {
      title.textContent = hasName ? d.name.trim() : t('create.namePh.' + d.kind);
      title.classList.toggle('ph', !hasName);
    }
    const read = this.$('#pv-read');
    if (read) read.textContent = `${t('create.tailPrefix')} · ${d.tail.trim() || t('create.tailPh.' + d.kind)}`;
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
      name, tail: d.tail.trim() || name.toLowerCase(), kind: d.kind, mode: d.mode, icon: d.icon, color: d.color,
      ago: d.pastStart ? d.ago : 0, milestones: this._milestones(), note: d.why.trim(),
    });
    this._reset();
    router.go('detail', id);
    router.flash(t('toast.created', { name }));
  }
}

customElements.define('create-sheet', CreateSheet);
