import { css } from '../../../core/css.js';

/** Estilos del panel de demostración (control de tiempo). */
export const styles = css`
  :host { display: block; width: 402px; max-width: 100%; }
  .panel {
    padding: var(--space-3) var(--space-4); border: 1px solid var(--color-divider);
    border-radius: var(--radius-md); display: flex; flex-direction: column; gap: var(--space-3);
  }
  .head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
  .head .title { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--color-neutral-600); }
  .head .offset { font-size: 11px; color: var(--color-accent-300); }
  .buttons { display: flex; gap: var(--space-2); flex-wrap: wrap; }
  .buttons .btn { font-size: 12px; }
`;
