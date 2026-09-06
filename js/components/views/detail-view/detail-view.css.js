import { css } from '../../../core/css.js';

/** Estilos de la vista de detalle — Bauhaus. */
export const styles = css`
  :host { display: block; }
  .detail { padding: 44px 22px 108px; animation: pc-fade .3s ease both; }

  .top { display: flex; align-items: center; justify-content: space-between; }
  .top .back { gap: 4px; margin-left: -4px; }
  .top .right { display: flex; align-items: center; gap: var(--space-2); }

  .dial-wrap { display: grid; place-items: center; margin-top: var(--space-6); }
  .dial-days { font-family: var(--font-display); font-weight: 800; font-size: 76px; line-height: .8; letter-spacing: -.05em; color: var(--ink); }
  .dial-word { font-family: var(--font-body); font-weight: 600; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--dim); margin-top: 8px; }

  .phrase { margin-top: var(--space-6); padding-left: 14px; border-left: 6px solid var(--red); }
  .phrase .kicker { font-family: var(--font-body); font-weight: 700; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--blue); }
  .phrase p { margin: 8px 0 0; font-family: var(--font-display); font-weight: 700; font-size: 19px; line-height: 1.25; color: var(--ink); text-wrap: pretty; }

  .stats3 { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: var(--space-6); border: var(--border-w) solid var(--ink); }
  .stat3 { background: transparent !important; border: 0 !important; border-right: var(--border-w) solid var(--ink) !important;
    border-radius: 0; padding: 12px; gap: 4px; }
  .stat3:last-child { border-right: 0 !important; }
  .stat3 .num { font-family: var(--font-display); font-weight: 800; font-size: 22px; line-height: 1; color: var(--ink); }
  .stat3 .lbl { font-family: var(--font-body); font-size: 8.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--dim); font-weight: 600; }

  .section-head { display: flex; align-items: baseline; justify-content: space-between; margin: var(--space-8) 0 var(--space-3); }
  .section-head h6 { margin: 0; color: var(--ink); }
  .section-head .note { font-family: var(--font-body); font-size: 11px; color: var(--dim); }

  .grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; }
  .grid .cell { aspect-ratio: 1; border: 1px solid var(--hair); }

  .ladder { display: flex; flex-direction: column; }
  .ladder .item { display: flex; align-items: center; gap: var(--space-3); padding: 11px 0; border-bottom: var(--border-w) solid var(--hair); }
  .ladder .item:first-child { border-top: var(--border-w) solid var(--ink); }
  .ladder .dot { flex: none; width: 22px; height: 22px; display: grid; place-items: center; font-size: 11px; font-weight: 700; }
  .ladder .lbl { flex: 1; font-family: var(--font-body); font-weight: 500; font-size: 14px; }
  .ladder .meta { font-family: var(--font-body); font-size: 11px; color: var(--dim); }

  .note-block { margin-top: var(--space-8); }

  .actions-main { margin-top: var(--space-8); }
  .actions-row { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
  .actions-row .reset { flex: 1; }
  .actions-row .remove { flex: none; color: var(--red); }
  .actions-row .remove:hover { color: var(--paper); background: var(--red); }
`;
