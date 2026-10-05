# Battle Companion Foundation

## Purpose

This branch rebuilds the lost Battle Companion foundation without attempting to recover or recreate the historical commit SHA `c1ffdc9`.

The current repository is the source of truth. The architecture keeps the Battle Companion core independent from Telegram and from Age of Sigmar-specific content whenever practical.

## Architecture

```text
Battle Companion Core
├── gameState
├── rulesEngine
├── battleAssistant
├── army
├── persistence
├── i18n
└── freshness
        │
        ▼
Game Adapter
└── Age of Sigmar
        │
        ▼
Normalized faction data
└── Ogor Mawtribes pilot
```

Upstream data remains untouched in `src/dataBase.json`. New Battle Companion code must consume normalized structures instead of mutating upstream data.

## Implemented foundation

- dedicated Battle Companion route;
- web-safe startup when Telegram is unavailable;
- Spanish-first UI boundary with English fallback;
- local army persistence;
- multiple armies;
- duplicate/delete;
- versioned JSON export/import;
- normalized army/regiment model;
- army points and basic validation;
- game state with round, active player and phase;
- deterministic ability evaluation;
- own/opponent/any turn handling;
- once-per-phase, once-per-turn, once-per-round and once-per-battle usage;
- conditional, passive/reminder and review-required states;
- battle-assistant grouping;
- turn-scoped unit state reset;
- temporary effect lifecycle for phase/turn/round;
- event history foundation;
- normalized faction adapter;
- safe-auto-update vs review-required change classification;
- source freshness state;
- PWA manifest and same-origin offline shell cache;
- route-level code splitting;
- GitHub Actions verification.

## Rule safety

A rule may only become an actionable legal ability when its normalized metadata is explicitly verified.

Unknown conditions, ambiguous metadata and semantic upstream changes default to review-required. The rules engine must not infer legality from incomplete upstream metadata.

## Upstream sync policy

Structured fields such as points may be classified as safe automatic updates.

Semantic rule fields such as timing, phase, frequency, conditions, effects and duration always require review.

Unknown new fields default to review-required.

## Performance baseline

Before route splitting, the production main JavaScript bundle was approximately 2.64 MB gzip.

After route splitting, the initial main bundle measured approximately 73.64 kB gzip in GitHub Actions. The heavy upstream data is moved into deferred chunks and is not required for the Battle Companion initial route.

## Persistence

Code persistence: GitHub branch `battle-companion-foundation`.

User data persistence for the MVP: localStorage plus versioned JSON export/import.

## PWA

The app can run outside Telegram. The production service worker caches same-origin resources after first use and never intercepts external API requests.

## Intellectual-property boundary

The upstream repository is public, but this branch does not treat public availability as commercial permission.

No root `LICENSE` file was observed during the foundation audit of `Aletagro/aos-telegram-app`. Code, data, text, artwork, fonts and other assets therefore require a separate rights/licensing review before any commercial use.

The Battle Companion core should remain separable from third-party game content.

## Next technical steps

1. Resolve and generate a compact Ogor Mawtribes normalized dataset from upstream without bundling the full database.
2. Add verified Ogor warscroll/ability metadata incrementally.
3. Expand the Army Builder UI to regiments, units, general and enhancements.
4. Connect checklist actions to `markAbilityUsed`.
5. Add unit actions such as run/retreat/charge into Game State.
6. Add a non-destructive upstream audit workflow and human-readable changelog.
7. Replace temporary visual assets with a proprietary Battle Companion identity.
8. Validate offline behavior in browser integration testing.
9. Configure the future Telegram bot separately from the core.
