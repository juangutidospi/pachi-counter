import { css } from '../../../core/css.js';

/** Estilos del panel de demostración (control de tiempo) — Bauhaus. */
export const styles = css`
  :host { display: block; width: 100%; }
  .panel {
    padding: var(--space-4); border: var(--border-w) solid var(--ink); border-radius: 0;
    display: flex; flex-direction: column; gap: var(--space-3);
  }
  .head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
  .head .title { font-family: var(--font-body); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--dim); font-weight: 600; }
  .head .offset { font-family: var(--font-mono); font-size: 11px; color: var(--blue); font-weight: 600; }
  .buttons { display: flex; gap: var(--space-2); flex-wrap: wrap; }
  .buttons .btn { font-size: 11px; padding: 8px 12px; }
`;
