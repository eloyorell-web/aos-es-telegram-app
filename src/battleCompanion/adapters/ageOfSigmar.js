import { PHASES, TURN } from '../core/gameState'

export const ageOfSigmarAdapter = Object.freeze({
  gameId: 'age-of-sigmar',
  name: 'Age of Sigmar',
  phases: PHASES,
  turns: TURN,
  terminology: {
    army: 'ejército',
    round: 'ronda',
    turn: 'turno',
    phase: 'fase'
  }
})

export const normalizeAbility = (raw, source = {}) => ({
  abilityId: raw.id || raw.abilityId,
  sourceEntityId: source.id || raw.sourceEntityId || null,
  gameId: 'age-of-sigmar',
  name: raw.name || 'Unnamed ability',
  phase: raw.phase || null,
  timing: raw.timing || null,
  turn: raw.turn || TURN.ANY,
  type: raw.type || null,
  frequency: raw.frequency || null,
  conditions: raw.conditions || [],
  targets: raw.targets || [],
  range: raw.range || null,
  effect: raw.effect || null,
  duration: raw.duration || null,
  keywords: raw.keywords || [],
  source: raw.source || 'upstream',
  sourceVersion: raw.sourceVersion || null,
  validationStatus: raw.validationStatus || 'needs_review'
})
