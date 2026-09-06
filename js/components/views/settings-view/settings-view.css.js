import { css } from '../../../core/css.js';

/** Estilos de la vista de ajustes. */
export const styles = css`
  :host { display: block; }
  .settings { padding: 60px var(--space-6) 100px; animation: pc-fade .3s ease both; }
  .back { gap: 4px; margin-left: calc(var(--space-2) * -1); }
  h2 { margin: var(--space-4) 0 0; font-size: 28px; }

  .field { margin-top: var(--space-6); }
  .field.first { margin-top: var(--space-8); }
  .sample { font-size: 12px; margin-top: var(--space-2); }
  .reminder-row { display: flex; align-items: center; gap: var(--space-3); }
  .reminder-row .input { width: 120px; }
  .reminder-row .hint { font-size: 12px; color: var(--color-neutral-500); }

  h6 { margin: var(--space-8) 0 var(--space-3); color: var(--color-neutral-500); }
  .data { padding: var(--space-4); gap: var(--space-3); }
  .data .row { display: flex; justify-content: space-between; font-size: 13px; }
  .data .row .k { color: var(--color-neutral-400); }
  .data .row .v { color: var(--color-neutral-300); }
  .data .row .mono { font-family: var(--font-mono); font-size: 12px; color: var(--color-accent-300); }
  .data .actions { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
  .data .actions .export { flex: 1; font-size: 13px; }
  .data .actions .wipe { color: var(--color-neutral-500); font-size: 13px; }

  .tools-note { font-size: 12px; margin: calc(var(--space-2) * -1) 0 var(--space-3); }

  .footer { font-size: 11px; margin-top: var(--space-8); text-align: center; }
`;
