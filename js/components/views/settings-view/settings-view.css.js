import { css } from '../../../core/css.js';

/** Estilos de la vista de ajustes — Bauhaus. */
export const styles = css`
  :host { display: block; }
  .settings { padding: 44px 22px 44px; animation: pc-fade .3s ease both; container-type: inline-size; }
  .back { gap: 4px; margin-left: -4px; }
  h2 { margin: var(--space-4) 0 0; font-size: min(40px, 12cqw); }

  .field { margin-top: var(--space-6); }
  .field.first { margin-top: var(--space-8); }
  .sample { font-family: var(--font-body); font-size: 12px; margin-top: var(--space-2); color: var(--dim); }
  .reminder-row { display: flex; align-items: center; gap: var(--space-3); }
  .reminder-row .input { width: 120px; }
  .reminder-row .hint { font-family: var(--font-body); font-size: 12px; color: var(--dim); }

  h6 { margin: var(--space-8) 0 var(--space-3); color: var(--ink); }

  .data { padding: var(--space-4); gap: var(--space-3); }
  .data .row { display: flex; justify-content: space-between; font-family: var(--font-body); font-size: 13px; }
  .data .row .k { color: var(--dim); }
  .data .row .v { color: var(--ink); font-weight: 600; }
  .data .row .mono { font-family: var(--font-mono); font-weight: 600; font-size: 12px; color: var(--blue); }
  .data .actions { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
  .data .actions .export { flex: 1; }
  .data .actions .wipe { color: var(--red); }
  .data .actions .wipe:hover { color: var(--paper); background: var(--red); }

  .tools-note { font-family: var(--font-body); font-size: 12px; margin: calc(var(--space-2) * -1) 0 var(--space-3); color: var(--dim); }
  .footer { font-family: var(--font-body); font-size: 11px; margin-top: var(--space-8); text-align: center; color: var(--dim); }
`;
