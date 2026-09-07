/**
 * Punto de entrada. Importa (y con ello registra) el shell de la app.
 * Todo el estado vive en `core/store.js`, la navegación en `core/router.js`
 * y el idioma en `core/i18n.js`. El panel de demostración se registra desde
 * la vista de ajustes.
 */
import './components/views/pachi-app/pachi-app.js';

// Bloquea el zoom por gestos en iOS Safari (que ignora user-scalable=no en el
// viewport). El doble toque lo cubre `touch-action: manipulation` en el body.
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());
document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
