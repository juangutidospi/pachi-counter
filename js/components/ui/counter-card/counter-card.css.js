import { css } from '../../../core/css.js';

/** Estilos de la tarjeta de contador de la lista de home — Bauhaus. */
export const styles = css`
  :host { display: block; animation: pc-up .45s cubic-bezier(.16,1,.3,1) both; }

  .card {
    display: flex; flex-direction: row; align-items: center; gap: 14px; padding: 16px 4px;
    border: 0; border-bottom: var(--border-w) solid var(--ink); background: transparent;
    cursor: pointer; width: 100%; text-align: left;
    transition: background .12s ease, transform .1s ease;
  }
  .card:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
  .card:active { transform: translate(1px, 1px); }

  .disc {
    flex: none; width: 58px; height: 58px; border-radius: 50%; display: grid; place-items: center;
    font-family: var(--font-display); font-weight: 800; font-size: 24px; line-height: 1; letter-spacing: -.03em;
    border: var(--border-w) solid var(--ink);
  }
  .disc small { display: none; }

  .info { flex: 1; min-width: 0; }
  .name-line { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .name { font-family: var(--font-display); font-weight: 800; font-size: 19px; line-height: 1;
    text-transform: uppercase; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .grew { flex: none; font-family: var(--font-body); font-weight: 700; font-size: 9px; letter-spacing: .06em;
    text-transform: uppercase; background: var(--red); color: var(--paper); padding: 2px 6px; }
  .since { font-family: var(--font-body); font-size: 11px; color: var(--dim); margin-top: 5px; }
  .goal { font-family: var(--font-body); font-weight: 700; font-size: 11.5px; color: var(--blue); margin-top: 4px; }
`;
