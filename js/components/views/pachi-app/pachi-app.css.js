import { css } from '../../../core/css.js';

/** Estilos del shell de la app (marco tipo teléfono + tabbar + toast). */
export const styles = css`
  :host {
    display: flex; flex-direction: column; align-items: center; gap: var(--space-4);
    padding: var(--space-8) var(--space-4);
  }

  .frame {
    width: 402px; max-width: 100%; height: min(874px, calc(100vh - 2 * var(--space-8)));
    border-radius: 30px; overflow: hidden; box-shadow: var(--shadow-lg);
    border: 1px solid var(--color-divider); background: var(--color-bg);
  }
  @media (max-width: 460px) {
    :host { padding: 0; }
    .frame { height: 100vh; border-radius: 0; border: none; }
  }

  .screen {
    position: relative; width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden;
    background: var(--color-bg); color: var(--color-text);
  }

  /* — tabbar — */
  .tabbar {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 40;
    padding: var(--space-3) var(--space-6) 30px;
    display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
    /* Casi opaca: oculta limpio el contenido que scrollea por detrás, con solo
       un pequeño desvanecido en el borde superior. */
    background: linear-gradient(to top, var(--color-bg) 82%, transparent);
  }
  .tabbar .link { font-size: 12px; color: var(--color-neutral-600); }
  .tabbar .link.active { color: var(--color-accent); }
  .tabbar .new { border-radius: 999px; padding: var(--space-2) var(--space-6); }

  /* — toast — */
  .toast-host {
    position: absolute; left: 0; right: 0; top: 0; height: 100%; z-index: 95;
    display: grid; align-items: end; justify-items: center; padding-bottom: 96px; pointer-events: none;
  }
  .toast {
    max-width: 82%; padding: var(--space-2) var(--space-4); border-radius: 999px;
    background: var(--color-neutral-800); color: var(--color-neutral-100); font-size: 12.5px;
    box-shadow: var(--shadow-md); text-align: center; animation: pc-toast-in .25s ease both;
  }
`;
