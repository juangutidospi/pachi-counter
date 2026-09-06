import { css } from '../../../core/css.js';

/** Estilos de la vista de detalle de un contador. */
export const styles = css`
  :host { display: block; }
  .detail { padding: 60px var(--space-6) 100px; animation: pc-fade .3s ease both; }

  .top { display: flex; align-items: center; justify-content: space-between; }
  .top .back { gap: 4px; margin-left: calc(var(--space-2) * -1); }
  .top .right { display: flex; align-items: center; gap: var(--space-2); }
  .top .share { border-radius: 50%; width: 32px; height: 32px; color: var(--color-neutral-400); }

  .dial-wrap { display: grid; place-items: center; margin-top: var(--space-6); }
  .dial-days { font-family: var(--font-heading); font-size: 74px; line-height: .95; letter-spacing: -.045em; color: var(--color-neutral-100); }
  .dial-word { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--color-neutral-500); margin-top: 6px; }

  .phrase {
    margin-top: var(--space-4); padding: var(--space-4) var(--space-4) var(--space-6);
    border-radius: var(--radius-lg); background: linear-gradient(140deg, var(--color-accent-900), var(--color-surface));
    box-shadow: var(--shadow-sm);
  }
  .phrase .kicker { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--color-accent-400); }
  .phrase p { margin: var(--space-3) 0 0; font-family: var(--font-heading); font-size: 20px; line-height: 1.32; color: var(--color-accent-100); text-wrap: pretty; }

  .stats3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-2); margin-top: var(--space-3); }
  .stat3 { gap: 2px; padding: var(--space-3); }
  .stat3 .num { font-family: var(--font-heading); font-size: 21px; color: var(--color-neutral-100); }
  .stat3 .lbl { font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--color-neutral-500); }

  .section-head { display: flex; align-items: baseline; justify-content: space-between; margin: var(--space-8) 0 var(--space-3); }
  .section-head h6 { margin: 0; color: var(--color-neutral-500); }
  .section-head .note { font-size: 11px; color: var(--color-neutral-600); }

  .grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; }
  .grid .cell { aspect-ratio: 1; border-radius: 3px; }

  .ladder { display: flex; flex-direction: column; gap: var(--space-2); }
  .ladder .item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-divider); }
  .ladder .dot { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; }
  .ladder .lbl { flex: 1; font-size: 14px; }
  .ladder .meta { font-size: 11px; color: var(--color-neutral-600); }

  .note-block { margin-top: var(--space-8); }
  .note-block textarea { min-height: 76px; font-size: 13px; line-height: 1.6; }

  .actions-main { margin-top: var(--space-8); }
  .actions-row { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
  .actions-row .reset { flex: 1; }
  .actions-row .remove { flex: none; color: var(--color-neutral-600); }
`;
