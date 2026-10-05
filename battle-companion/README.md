# Battle Companion

Aplicación propia y separada del código upstream de AoS Community.

## Principios

- No modifica `src/dataBase.json`.
- No reescribe Builder, Warscrolls ni componentes del upstream.
- Genera un dataset normalizado de Ogor Mawtribes leyendo el snapshot upstream del fork.
- UI principal en español; el texto de reglas permanece en inglés mientras no exista una traducción revisada.
- El motor de reglas es conservador: un timing desconocido se marca como `needs_review`, nunca como acción legal.
- Persiste ejércitos y partida en localStorage.

## Desarrollo

Desde `battle-companion/`:

```bash
npm install
npm run dev
```

`npm run generate:data` lee `../src/dataBase.json` y genera `src/generated/ogor.json`.

## Alcance actual

- múltiples ejércitos;
- Ogor Mawtribes desde el dataset real del repositorio;
- unidades, puntos y general;
- inicio de partida;
- ronda, jugador activo y ventanas/fases;
- asistente de acciones por warscroll;
- frecuencia once-per-*;
- checklist de habilidades utilizadas;
- reglas ambiguas enviadas a revisión.

La futura integración con el Builder upstream se hará mediante un adaptador de lectura, sin reescribir su implementación.
