import { css } from '../../../core/css.js';

/** Estilos de la vista home — Bauhaus. */
export const styles = css`
  :host { display: block; }
  .home { padding: 34px 22px 40px; animation: pc-fade .35s ease both; container-type: inline-size; }

  /* masthead de publicación diaria */
  .masthead {
    display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
    padding-bottom: 8px; margin-bottom: 14px; border-bottom: var(--border-w) solid var(--ink);
    font-family: var(--font-body); font-weight: 600; font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
  }
  .masthead .brand { color: var(--ink); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .masthead .edition { flex: none; white-space: nowrap; color: var(--edition-on, var(--paper)); background: var(--edition, var(--ink)); padding: 3px 8px; letter-spacing: .1em; }

  .topbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
  .topbar .date { font-family: var(--font-body); font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--dim); font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .greeting { margin: 6px 0 0; font-size: min(38px, 11cqw); line-height: .86; letter-spacing: -.035em; text-wrap: balance; }
  .head-actions { display: flex; gap: 8px; flex: none; }
  .gear { flex: none; }

  .stats { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 14px;
    border: var(--border-w) solid var(--ink); }
  .stat { padding: 10px 10px; min-width: 0; border-right: var(--border-w) solid var(--ink); }
  .stat:last-child { border-right: 0; }
  .stat.hi { background: var(--yellow); }
  .stat .num { font-family: var(--font-display); font-weight: 800; font-size: min(23px, 8cqw); line-height: 1; letter-spacing: -.03em; color: var(--ink); font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1, "zero" 1; }
  .stat .lbl { font-family: var(--font-body); font-size: 8.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--dim); margin-top: 5px; font-weight: 600; }

  .focus { margin-top: 14px; }
  .focus .kicker { font-family: var(--font-body); font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--blue); font-weight: 700; }
  .focus p { margin: 6px 0 0; font-family: var(--font-display); font-weight: 700; font-size: 15.5px; line-height: 1.25; color: var(--ink); text-wrap: pretty; }

  .list { margin-top: 14px; border-top: var(--border-w) solid var(--ink); }

  /* columna editorial del día */
  .column { margin-top: 22px; padding-top: 14px; border-top: var(--border-w) solid var(--ink); }
  .column .col-kicker { font-family: var(--font-body); font-weight: 700; font-size: 10px; letter-spacing: .18em;
    text-transform: uppercase; color: var(--red); }
  .column .col-headline { margin: 8px 0 0; font-family: var(--font-display); font-weight: 800; font-size: 22px;
    line-height: 1.05; letter-spacing: -.02em; text-transform: uppercase; color: var(--ink); text-wrap: pretty; }
  .column .col-sub { margin-top: 8px; font-family: var(--font-mono); font-size: 11px; letter-spacing: .04em; color: var(--dim); }

  .empty { padding: var(--space-8) 0; display: grid; place-items: center; text-align: center; animation: pc-up .5s cubic-bezier(.16,1,.3,1) both; }
  .empty > * { max-width: 100%; }
  .empty .rings { position: relative; width: 150px; height: 150px; display: grid; place-items: center; margin: var(--space-8) 0 var(--space-6); }
  .empty .rings .ring { position: absolute; border-radius: 50%; border: var(--border-w) solid var(--ink); }
  .empty .rings .e1 { inset: 0; } .empty .rings .e2 { inset: 26px; border-color: var(--red); } .empty .rings .e3 { inset: 52px; border-color: var(--blue); }
  .empty .rings .zero { font-family: var(--font-display); font-weight: 800; font-size: 44px; color: var(--ink); }
  .empty h4 { margin: 0; font-size: min(26px, 9cqw); line-height: 1; text-wrap: balance; }
  .empty p { max-width: min(252px, 100%); font-size: 13px; margin-top: var(--space-2); text-wrap: pretty; color: var(--dim); }
  .empty .cta { margin-top: var(--space-6); }
`;
