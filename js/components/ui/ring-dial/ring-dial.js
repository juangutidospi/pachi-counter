import { AppElement } from '../../../core/AppElement.js';
import { styles } from './ring-dial.css.js';

/**
 * `<ring-dial>` — anillo de progreso circular con contenido central por slot.
 * Reutilizado en el detalle y en la celebración.
 *
 * Propiedades (vía atributos o JS):
 *  - `size`   {number} diámetro en px (por defecto 236).
 *  - `offset` {number} stroke-dashoffset 0–327 (0 = completo, 327 = vacío).
 *  - `color`  {string} color del trazo de progreso (token o valor).
 *  - `width`  {number} grosor del trazo (por defecto 4).
 */
export class RingDial extends AppElement {
  static styles = [styles];
  static observedAttributes = ['size', 'offset', 'color', 'width'];

  /** Re-renderiza al cambiar cualquier atributo observado. */
  attributeChangedCallback() { if (this.isConnected) this._paint(); }

  /** Pinta el anillo y el hueco central (slot). */
  render() {
    const size = this.getAttribute('size') || 236;
    const offset = this.getAttribute('offset') || 0;
    const color = this.getAttribute('color') || 'var(--color-accent)';
    const width = this.getAttribute('width') || 4;
    this.style.setProperty('--size', size + 'px');
    this.shadowRoot.innerHTML = `
      <div class="dial">
        <svg viewBox="0 0 120 120">
          <circle class="track" cx="60" cy="60" r="52" fill="none" stroke-width="${width}"></circle>
          <circle class="value" cx="60" cy="60" r="52" fill="none" stroke="${color}"
            stroke-width="${width}" stroke-dasharray="327" stroke-dashoffset="${offset}"></circle>
        </svg>
        <div class="center"><slot></slot></div>
      </div>`;
  }
}

customElements.define('ring-dial', RingDial);
