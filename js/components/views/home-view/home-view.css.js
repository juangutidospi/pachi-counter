import { css } from '../../../core/css.js';

/** Estilos de la vista home — Bauhaus. */
export const styles = css`
  :host { display: block; }
  .home { padding: 44px 22px 108px; animation: pc-fade .35s ease both; }

  .head { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); }
  .head .date { font-family: var(--font-body); font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--dim); font-weight: 600; }
  .head h2 { margin: 8px 0 0; font-size: 46px; line-height: .84; letter-spacing: -.04em; }
  .gear { flex: none; }

  .stats { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 18px;
    border: var(--border-w) solid var(--ink); }
  .stat { padding: 12px 12px; border-right: var(--border-w) solid var(--ink); }
  .stat:last-child { border-right: 0; }
  .stat.hi { background: var(--yellow); }
  .stat .num { font-family: var(--font-display); font-weight: 800; font-size: 27px; line-height: 1; letter-spacing: -.03em; color: var(--ink); }
  .stat .lbl { font-family: var(--font-body); font-size: 9px; letter-spacing: .08em; text-transform: uppercase; color: var(--dim); margin-top: 6px; font-weight: 600; }

  .focus { margin-top: 18px; padding-left: 14px; border-left: 6px solid var(--red); }
  .focus .kicker { font-family: var(--font-body); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--blue); font-weight: 700; }
  .focus p { margin: 7px 0 0; font-family: var(--font-display); font-weight: 700; font-size: 18px; line-height: 1.25; color: var(--ink); text-wrap: pretty; }

  .list { margin-top: 20px; border-top: var(--border-w) solid var(--ink); }

  .empty { padding: var(--space-8) 0; display: grid; place-items: center; text-align: center; animation: pc-up .5s cubic-bezier(.16,1,.3,1) both; }
  .empty .rings { position: relative; width: 150px; height: 150px; display: grid; place-items: center; margin: var(--space-8) 0 var(--space-6); }
  .empty .rings .ring { position: absolute; border-radius: 50%; border: var(--border-w) solid var(--ink); }
  .empty .rings .e1 { inset: 0; } .empty .rings .e2 { inset: 26px; border-color: var(--red); } .empty .rings .e3 { inset: 52px; border-color: var(--blue); }
  .empty .rings .zero { font-family: var(--font-display); font-weight: 800; font-size: 44px; color: var(--ink); }
  .empty h4 { margin: 0; font-size: 26px; }
  .empty p { max-width: 252px; font-size: 13px; margin-top: var(--space-2); text-wrap: pretty; color: var(--dim); }
  .empty .cta { margin-top: var(--space-6); }
`;
