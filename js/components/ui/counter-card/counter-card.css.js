import { css } from '../../../core/css.js';

/** Estilos de la tarjeta de contador de la lista de home. */
export const styles = css`
  :host { display: block; animation: pc-up .5s cubic-bezier(.16,1,.3,1) both; }

  .card {
    padding: var(--space-4); gap: var(--space-4); cursor: pointer;
    background: linear-gradient(180deg, var(--color-neutral-900), var(--color-surface));
    transition: transform .14s ease, box-shadow .2s ease;
  }
  .card:hover { box-shadow: 0 0 0 1px var(--color-accent-700), 0 8px 22px rgba(0,0,0,.5); }
  .card:active { transform: scale(.985); }

  .row { display: flex; align-items: center; gap: var(--space-4); }
  .badge-icon {
    flex: none; width: 42px; height: 42px; border-radius: var(--radius-md);
    display: grid; place-items: center; background: var(--color-accent-900);
  }
  .info { flex: 1; min-width: 0; }
  .name-line { display: flex; align-items: center; gap: 6px; min-width: 0; }
  .name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .grew {
    flex: none; padding: 2px 7px; border-radius: 6px; font-size: 10px; letter-spacing: .04em;
    background: var(--color-accent-900); color: var(--color-accent-300);
  }
  .since { font-size: 11px; color: var(--color-neutral-500); }
  .count { text-align: right; flex: none; }
  .count-days {
    font-family: var(--font-heading); font-size: 34px; line-height: 1;
    letter-spacing: -.03em; color: var(--color-neutral-100);
  }
  .count-word { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--color-neutral-500); }

  .bar-track { height: 3px; border-radius: 2px; background: var(--color-neutral-900); overflow: hidden; }
  .bar-fill { height: 100%; width: 100%; transform-origin: left; transition: transform .6s cubic-bezier(.16,1,.3,1); }
  .foot { display: flex; justify-content: space-between; gap: var(--space-3); margin-top: 7px; font-size: 11px; }
  .foot .goal { color: var(--color-accent-300); }
  .foot .best { color: var(--color-neutral-600); }
`;
