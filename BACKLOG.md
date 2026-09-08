# Backlog

Ideas aprobadas pero aparcadas (requieren infraestructura o salto nativo, no son
web estática pura como el resto de la app).

## #5 · Notificaciones push ("tu edición ya está")

Aviso en el móvil con la app cerrada: recordatorio diario a la hora elegida y
avisos de hito, tematizados como "edición" (p. ej. "Tu edición ya está · N.º 251").

- **Por qué no está hecho:** la web no tiene notificaciones locales fiables para
  app cerrada; hay que enviarlas desde un servidor (Web Push + claves VAPID).
  GitHub Pages es estático, así que requiere **backend/serverless** (p. ej.
  Cloudflare Workers + cron) para: guardar suscripciones y enviar los push.
- **iOS:** solo funciona con la **PWA instalada** en la pantalla de inicio
  (iOS 16.4+) y permiso concedido; no en la pestaña de Safari.
- **Piezas a construir:** (1) permiso + suscripción en el cliente, (2) almacén de
  suscripciones, (3) función programada que envía los push.
- **Nota:** el "Recordatorio diario" de Ajustes hoy es **decorativo** (guarda la
  hora pero no notifica). Cuando exista el push, se conecta aquí. Mientras tanto,
  valorar marcarlo como "próximamente".
- **Decisión (2026-09-08):** aparcado — de momento sin backend.

## #6 · App nativa (Capacitor / SwiftUI)

Presencia y distribución de "app de culto": widgets en pantalla de inicio, Live
Activity en la Isla Dinámica, háptica real de iOS, y publicación en la App Store.

- **Por qué no está hecho:** requiere envolver la app (Capacitor o SwiftUI),
  proyecto aparte del build web actual.
- **Ventaja extra:** las **notificaciones locales** nativas son simples y no
  necesitan servidor — camino más directo que el #5 si el objetivo son recordatorios.
- **Decisión (2026-09-08):** aparcado — proyecto futuro.
