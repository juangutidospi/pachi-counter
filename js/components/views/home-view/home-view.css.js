import { css } from '../../../core/css.js';

/** Estilos de la vista home. */
export const styles = css`
  :host { display: block; }
  .home { padding: 60px var(--space-6) 100px; animation: pc-fade .35s ease both; }

  .head { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-4); }
  .head .date { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--color-neutral-500); }
  .head h2 { margin: 6px 0 0; font-size: 30px; }
  .gear { border-radius: 50%; flex: none; color: var(--color-neutral-400); }

  .stats {
    display: flex; gap: var(--space-6); margin-top: var(--space-6); padding: var(--space-4) 0;
    border-top: 1px solid var(--color-divider); border-bottom: 1px solid var(--color-divider);
  }
  .stat .num { font-family: var(--font-heading); font-size: 24px; line-height: 1; color: var(--color-neutral-100); }
  .stat .num.accent { color: var(--color-accent-300); }
  .stat .lbl { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--color-neutral-500); margin-top: 3px; }
  .divider { width: 1px; background: var(--color-divider); }

  .focus { margin-top: var(--space-6); padding-left: var(--space-4); border-left: 2px solid var(--color-accent-700); }
  .focus .kicker { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--color-accent-400); }
  .focus p {
    margin: var(--space-2) 0 0; font-family: var(--font-heading); font-size: 17px; line-height: 1.35;
    color: var(--color-neutral-100); text-wrap: pretty;
  }

  .list { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-6); }
  counter-card { animation-delay: calc(var(--i, 0) * .06s); }

  .empty { padding: var(--space-8) 0; display: grid; place-items: center; text-align: center; animation: pc-up .5s cubic-bezier(.16,1,.3,1) both; }
  .empty .rings { position: relative; width: 158px; height: 158px; display: grid; place-items: center; margin: var(--space-8) 0 var(--space-6); }
  .empty .rings .ring { position: absolute; border-radius: 50%; border: 1px dashed var(--color-neutral-800); }
  .empty .rings .e1 { inset: 0; } .empty .rings .e2 { inset: 26px; } .empty .rings .e3 { inset: 52px; }
  .empty .rings .zero { font-family: var(--font-heading); font-size: 42px; color: var(--color-neutral-700); }
  .empty h4 { margin: 0; }
  .empty p { max-width: 252px; font-size: 13px; margin-top: var(--space-2); text-wrap: pretty; }
  .empty .cta { margin-top: var(--space-6); }
`;
