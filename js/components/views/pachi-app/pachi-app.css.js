import { css } from '../../../core/css.js';

/** Estilos del shell de la app (marco tipo teléfono + tabbar + toast) — Bauhaus. */
export const styles = css`
  :host {
    display: flex; flex-direction: column; align-items: center; gap: var(--space-4);
    padding: var(--space-8) var(--space-4);
  }

  .frame {
    width: 402px; max-width: 100%; height: min(844px, calc(100vh - 2 * var(--space-8)));
    border-radius: 26px; overflow: hidden; box-shadow: 8px 8px 0 var(--ink);
    border: var(--border-w) solid var(--ink); background: var(--paper);
  }
  @media (max-width: 460px) {
    :host { padding: 0; }
    .frame { height: 100vh; border-radius: 0; border: none; box-shadow: none; }
  }

  .screen {
    position: relative; width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden;
    background: var(--paper); color: var(--ink);
  }

  /* — tabbar — */
  .tabbar {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 40;
    display: flex; align-items: stretch; justify-content: space-between;
    border-top: var(--border-w) solid var(--ink); background: var(--paper);
  }
  .tabbar .link {
    flex: 1; padding: 16px 10px; text-align: center; border-radius: 0; border: none;
    font-family: var(--font-heading); font-weight: 700; font-size: 12px; letter-spacing: .04em;
    text-transform: uppercase; color: var(--dim); background: transparent;
  }
  .tabbar .link.active { color: var(--ink); }
  .tabbar .new {
    flex: none; padding: 16px 22px; border-radius: 0;
    border-left: var(--border-w) solid var(--ink); border-right: var(--border-w) solid var(--ink);
    background: var(--blue); color: var(--paper); font-family: var(--font-heading); font-weight: 700;
    font-size: 12px; letter-spacing: .04em; text-transform: uppercase; cursor: pointer;
  }
  .tabbar .new:hover { background: var(--ink); }

  /* — toast — */
  .toast-host {
    position: absolute; left: 0; right: 0; top: 0; height: 100%; z-index: 95;
    display: grid; align-items: end; justify-items: center; padding-bottom: 92px; pointer-events: none;
  }
  .toast {
    max-width: 84%; padding: 10px 16px; border-radius: 0;
    background: var(--ink); color: var(--paper); font-family: var(--font-body); font-weight: 500; font-size: 12.5px;
    box-shadow: 4px 4px 0 var(--blue); text-align: center; animation: pc-toast-in .25s ease both;
  }
`;
