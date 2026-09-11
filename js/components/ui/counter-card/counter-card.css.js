import { css } from '../../../core/css.js';

/** Estilos de la tarjeta de contador de la lista de home — Bauhaus. */
export const styles = css`
  :host { display: block; animation: pc-up .45s cubic-bezier(.16,1,.3,1) both; }

  .card {
    display: flex; flex-direction: row; align-items: center; gap: 12px; padding: 11px 4px;
    border: 0; border-bottom: var(--border-w) solid var(--ink); background: transparent;
    cursor: pointer; width: 100%; text-align: left;
    transition: background .12s ease, transform .22s cubic-bezier(.34,1.56,.64,1);
  }
  .card:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
  .card:active { transform: scale(.975); }

  /* Mini-carátula (crate) con el número como chip en la esquina. */
  .cover { flex: none; width: 56px; height: 56px; position: relative; }
  .cover .cvr { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .disc {
    position: absolute; left: 0; bottom: 0; height: 22px; min-width: 22px; padding: 0 6px;
    display: inline-flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 800; font-size: 13px; line-height: 1; letter-spacing: -.02em;
    font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1, "zero" 1;
    border: var(--border-w) solid var(--ink);
  }

  .info { flex: 1; min-width: 0; }
  .name-line { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .name { flex: 1; min-width: 0; font-family: var(--font-display); font-weight: 800; font-size: 16px; line-height: 1.05;
    text-transform: uppercase; letter-spacing: -.01em; overflow-wrap: anywhere;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .grew { flex: none; font-family: var(--font-body); font-weight: 700; font-size: 8.5px; letter-spacing: .06em;
    text-transform: uppercase; background: var(--red); color: var(--paper); padding: 2px 6px; }
  .since { font-family: var(--font-body); font-size: 10.5px; color: var(--dim); margin-top: 4px; }
  .goal { font-family: var(--font-body); font-weight: 700; font-size: 11px; color: var(--blue); margin-top: 3px; }
`;
