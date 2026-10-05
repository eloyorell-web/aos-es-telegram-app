# Battle Companion

Aplicación propia y separada del código upstream de AoS Community.

## Boundary

- `Aletagro/aos-telegram-app`: upstream, solo lectura.
- `eloyorell-web/aos-es-telegram-app`: fork de trabajo.
- `battle-companion/`: producto propio.
- No se modifica `src/dataBase.json` ni se reescriben componentes upstream para implementar esta app.

## Data

El piloto Ogor contiene únicamente datos estructurales normalizados y trazables. Las reglas semánticas no se convierten en acciones legales sin revisión.

## Demo actual

- roster Ogor piloto;
- ronda, turno y fase;
- estado por unidad;
- mover / correr / retirarse;
- bloqueo determinista de carga tras correr o retirarse;
- historial de eventos;
- persistencia local;
- importación de roster JSON;
- trazabilidad visible de fuente.
