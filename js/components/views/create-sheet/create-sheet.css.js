import { css } from '../../../core/css.js';

/** Estilos de la hoja modal de creación de contador — Bauhaus. */
export const styles = css`
  :host { display: block; }
  .scrim {
    position: absolute; inset: 0; z-index: 70; display: flex; flex-direction: column; justify-content: flex-end;
    background: color-mix(in srgb, var(--ink) 40%, transparent);
  }
  .sheet {
    max-height: 94%; overflow: auto; padding: var(--space-4) var(--space-6) 46px;
    background: var(--paper); border-top: var(--border-w) solid var(--ink);
    box-shadow: 0 -6px 0 rgba(17,16,16,.12);
  }
  .sheet.enter { animation: pc-sheet .42s cubic-bezier(.16,1,.3,1) both; }
  .grabber { width: 44px; height: 4px; background: var(--ink); margin: 0 auto var(--space-6); }
  h3 { margin: 0; font-size: 28px; }
  .subtitle { font-family: var(--font-body); font-size: 12px; margin-top: var(--space-1); color: var(--dim); }

  .field { margin-top: var(--space-4); }
  .field.gap6 { margin-top: var(--space-6); }
  .tail-row { display: flex; align-items: center; gap: var(--space-2); }
  .tail-row .prefix { font-family: var(--font-body); font-size: 13px; color: var(--dim); flex: none; }

  .icons { display: flex; flex-wrap: wrap; gap: var(--space-2); }
  .icon-btn {
    width: 44px; height: 44px; display: grid; place-items: center; cursor: pointer;
    background: var(--paper); color: var(--ink); border: var(--border-w) solid var(--ink); border-radius: 0;
  }
  .icon-btn.active { background: var(--ink); color: var(--paper); }

  .colors { display: flex; gap: var(--space-3); }
  .color-btn { width: 36px; height: 36px; cursor: pointer; border: var(--border-w) solid var(--ink); border-radius: 50%; }

  .ago-row { display: flex; align-items: center; gap: var(--space-3); margin-top: var(--space-3); }
  .ago-row .input { width: 92px; }
  .ago-row .suffix { font-family: var(--font-body); font-size: 13px; color: var(--dim); }

  .ms-preview { font-family: var(--font-body); font-size: 11px; color: var(--dim); margin-top: 6px; }
  .ms-custom { margin-top: var(--space-3); }
  .why-optional { color: var(--dim); font-weight: 400; }

  .buttons { display: flex; gap: var(--space-2); margin-top: var(--space-6); }
  .buttons .cancel { flex: none; }
  .buttons .submit { flex: 1; }
`;
