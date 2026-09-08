import { AppElement } from '../../../core/AppElement.js';
import { escapeHtml } from '../../../core/escape-html.js';
import { styles } from './seg-control.css.js';

/**
 * `<seg-control>` — control segmentado (grupo de opciones excluyentes).
 * Reutilizado en Ajustes (tono, idioma, tema) y en la hoja de creación
 * (tipo, inicio, hitos).
 *
 * API:
 *  - `.options` {Array<{value:string,label:string}>} opciones a mostrar.
 *  - `.value`   {string} valor seleccionado.
 *  - evento `change` con `detail.value` al elegir una opción.
 */
export class SegControl extends AppElement {
  static styles = [styles];

  constructor() {
    super();
    /** @type {Array<{value:string,label:string}>} */
    this._options = [];
    this._value = null;
  }

  /** @param {Array<{value:string,label:string}>} list Opciones. */
  set options(list) { this._options = Array.isArray(list) ? list : []; this._paint(); }
  /** @returns {Array<{value:string,label:string}>} Opciones actuales. */
  get options() { return this._options; }

  /** @param {string} v Valor seleccionado. */
  set value(v) { this._value = v; this._paint(); }
  /** @returns {string} Valor seleccionado. */
  get value() { return this._value; }

  /** Pinta el grupo de segmentos como radios accesibles, con indicador deslizante. */
  render() {
    const name = 'seg-' + (this._name || (this._name = Math.random().toString(36).slice(2)));
    const n = Math.max(this._options.length, 1);
    const idx = Math.max(0, this._options.findIndex((o) => o.value === this._value));
    this.shadowRoot.innerHTML = `
      <div class="seg" role="radiogroup" style="--n:${n};--i:${idx}">
        <span class="ind" aria-hidden="true"></span>
        ${this._options.map((opt) => `
          <label class="seg-opt">
            <input type="radio" name="${name}" value="${escapeHtml(opt.value)}" ${opt.value === this._value ? 'checked' : ''}>
            <span class="seg-lb">${escapeHtml(opt.label)}</span>
          </label>`).join('')}
      </div>`;
  }

  /** Cablea el cambio de selección y desliza el indicador sin repintar. */
  afterRender() {
    this.$$('input').forEach((input, i) => {
      this.on(input, 'change', () => {
        this._value = input.value;
        const seg = this.$('.seg');
        if (seg) seg.style.setProperty('--i', String(i));
        this.dispatchEvent(new CustomEvent('change', { detail: { value: input.value }, bubbles: true, composed: true }));
      });
    });
  }
}

customElements.define('seg-control', SegControl);
