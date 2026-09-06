import { css } from '../../../core/css.js';

/** Estilos de la portada Bauhaus (splash). */
export const styles = css`
  :host { display: block; }
  .cover {
    position: absolute; inset: 0; background: var(--paper); color: var(--ink);
    cursor: pointer; overflow: hidden;
  }

  /* rejilla milimetrada + marco técnico con nodos */
  .grid {
    position: absolute; inset: 0; animation: pc-fade .6s ease both;
    background-image:
      linear-gradient(var(--hair) 1px, transparent 1px),
      linear-gradient(90deg, var(--hair) 1px, transparent 1px);
    background-size: 33px 33px;
  }
  .frameline { position: absolute; inset: 16px; border: var(--border-w) solid var(--ink); animation: pc-fade .5s ease .1s both; }
  .tick { position: absolute; width: 12px; height: 12px; border: var(--border-w) solid var(--ink); background: var(--paper); animation: pc-fade .4s ease .25s both; }
  .tick.t1 { top: 10px; left: 10px; } .tick.t2 { top: 10px; right: 10px; }
  .tick.t3 { bottom: 10px; left: 10px; } .tick.t4 { bottom: 10px; right: 10px; }

  .scr { position: absolute; inset: 16px; padding: 24px 20px; display: flex; flex-direction: column; }

  .meta { display: flex; justify-content: space-between; align-items: center;
    font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; font-weight: 600;
    animation: pc-fade .6s ease .2s both; }
  .meta .idx { background: var(--ink); color: var(--paper); padding: 3px 8px; }

  /* emblema */
  .art { flex: 1; display: grid; place-items: center; position: relative; margin: 2px 0; }
  .art svg { width: 224px; height: 224px; overflow: visible; position: relative; z-index: 2;
    animation: pc-ring-in .8s cubic-bezier(.16,1,.3,1) .25s both; }
  .diag { position: absolute; left: 6px; top: 34px; width: 150px; height: 3px; background: var(--ink);
    transform: rotate(32deg); transform-origin: left center; z-index: 1;
    animation: pc-wipe .5s cubic-bezier(.16,1,.3,1) .5s both; }
  .diag::before, .diag::after { content: ""; position: absolute; width: 9px; height: 9px; border-radius: 50%; top: -3px; }
  .diag::before { left: -4px; background: var(--ink); }
  .diag::after { right: -4px; background: var(--red); }

  /* wordmark */
  .title { margin-top: auto; }
  .title .k { font-family: var(--font-body); font-size: 11px; letter-spacing: .2em; text-transform: uppercase;
    color: var(--red); font-weight: 700; margin-bottom: 6px; animation: pc-up .6s cubic-bezier(.16,1,.3,1) .5s both; }
  .title h1 { font-family: var(--font-display); font-weight: 800; line-height: .86; letter-spacing: -.045em; text-transform: uppercase; margin: 0; }
  .title h1 .l1 { font-size: 43px; display: block; animation: pc-up .6s cubic-bezier(.16,1,.3,1) .58s both; }
  .title h1 .l2 { font-size: 43px; display: block; -webkit-text-stroke: 2px var(--ink); color: transparent;
    animation: pc-up .6s cubic-bezier(.16,1,.3,1) .66s both; }

  .tag { margin-top: 18px; display: inline-block; align-self: flex-start; background: var(--blue); color: var(--paper);
    font-weight: 700; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; padding: 9px 14px;
    animation: pc-up .6s cubic-bezier(.16,1,.3,1) .74s both; }

  .enter { margin-top: 22px; display: flex; align-items: center; gap: 10px;
    font-family: var(--font-body); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600;
    animation: pc-fade 1s ease 1s both; }
  .enter .arrow { width: 34px; height: 34px; border-radius: 50%; background: var(--yellow); color: var(--ink);
    display: grid; place-items: center; font-size: 16px; animation: pc-ring-pulse 3s ease-in-out 1.4s infinite; }
`;
