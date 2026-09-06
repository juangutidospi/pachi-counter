import { css } from '../../../core/css.js';

/** Estilos de la hoja modal de creación de contador. */
export const styles = css`
  :host { display: block; }
  .scrim {
    position: absolute; inset: 0; z-index: 70; display: flex; flex-direction: column; justify-content: flex-end;
    background: color-mix(in srgb, var(--color-neutral-900) 62%, transparent);
  }
  .sheet {
    max-height: 94%; overflow: auto; padding: var(--space-4) var(--space-6) 46px;
    background: var(--color-surface); border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    box-shadow: var(--shadow-lg);
  }
  .sheet.enter { animation: pc-sheet .42s cubic-bezier(.16,1,.3,1) both; }
  .grabber { width: 38px; height: 4px; border-radius: 2px; background: var(--color-neutral-700); margin: 0 auto var(--space-6); }
  h3 { margin: 0; }
  .subtitle { font-size: 12px; margin-top: var(--space-1); }

  .field { margin-top: var(--space-4); }
  .field.gap6 { margin-top: var(--space-6); }
  .tail-row { display: flex; align-items: center; gap: var(--space-2); }
  .tail-row .prefix { font-size: 13px; color: var(--color-neutral-500); flex: none; }

  .icons { display: flex; flex-wrap: wrap; gap: var(--space-2); }
  .icon-btn {
    width: 44px; height: 44px; border-radius: var(--radius-md); display: grid; place-items: center; cursor: pointer;
    background: transparent; color: var(--color-neutral-500); border: 1px solid var(--color-divider);
  }
  .icon-btn.active { background: var(--color-accent-900); color: var(--color-accent-300); border-color: var(--color-accent); }

  .colors { display: flex; gap: var(--space-3); }
  .color-btn { width: 34px; height: 34px; border-radius: 50%; cursor: pointer; border: 1px solid var(--color-divider); }

  .ago-row { display: flex; align-items: center; gap: var(--space-3); margin-top: var(--space-3); }
  .ago-row .input { width: 92px; }
  .ago-row .suffix { font-size: 13px; color: var(--color-neutral-400); }

  .ms-preview { font-size: 11px; color: var(--color-neutral-600); margin-top: 6px; }
  .ms-custom { margin-top: var(--space-3); }
  .why-optional { color: var(--color-neutral-600); }

  .buttons { display: flex; gap: var(--space-2); margin-top: var(--space-6); }
  .buttons .cancel { flex: none; }
  .buttons .submit { flex: 1; }
`;
