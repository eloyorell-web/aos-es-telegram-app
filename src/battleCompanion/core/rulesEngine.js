import { abilityUseKey, TURN } from './gameState'

export const AVAILABILITY = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  CONDITIONAL: 'CONDITIONAL',
  REMINDER: 'REMINDER',
  UNAVAILABLE: 'UNAVAILABLE',
  NEEDS_REVIEW: 'NEEDS_REVIEW'
})

const turnMatches = (abilityTurn, activePlayer) =>
  !abilityTurn ||
  abilityTurn === TURN.ANY ||
  abilityTurn === activePlayer

const phaseMatches = (abilityPhase, currentPhase) =>
  !abilityPhase ||
  abilityPhase === 'ANY' ||
  abilityPhase === currentPhase

const usedForCurrentWindow = (state, ability, sourceEntityId) => {
  const use = state.usedAbilities[abilityUseKey(ability.abilityId, sourceEntityId)]
  if (!use) return false

  switch (ability.frequency) {
    case 'ONCE_PER_BATTLE':
      return true
    case 'ONCE_PER_ROUND':
      return use.round === state.round
    case 'ONCE_PER_TURN':
      return use.round === state.round && use.activePlayer === state.activePlayer
    case 'ONCE_PER_PHASE':
      return use.round === state.round &&
        use.activePlayer === state.activePlayer &&
        use.phase === state.phase
    default:
      return false
  }
}

const evaluateCondition = (condition, state, context) => {
  switch (condition.type) {
    case 'UNIT_STATE_EQUALS': {
      const value = state.unitState?.[condition.unitId]?.[condition.field]
      return value === condition.value
    }
    case 'CONTEXT_EQUALS':
      return context?.[condition.field] === condition.value
    default:
      return null
  }
}

export const evaluateAbility = (ability, state, context = {}) => {
  const sourceEntityId = context.sourceEntityId || ability.sourceEntityId || 'global'

  if (!ability || !ability.abilityId) {
    return { status: AVAILABILITY.NEEDS_REVIEW, reason: 'Ability metadata is incomplete.' }
  }

  if (ability.validationStatus && ability.validationStatus !== 'verified') {
    return {
      status: AVAILABILITY.NEEDS_REVIEW,
      reason: 'Rule metadata is not verified.',
      validationStatus: ability.validationStatus
    }
  }

  if (!phaseMatches(ability.phase, state.phase)) {
    return { status: AVAILABILITY.UNAVAILABLE, reason: `Only available in ${ability.phase}.` }
  }

  if (!turnMatches(ability.turn, state.activePlayer)) {
    return { status: AVAILABILITY.UNAVAILABLE, reason: 'Not available in the current turn.' }
  }

  if (usedForCurrentWindow(state, ability, sourceEntityId)) {
    return { status: AVAILABILITY.UNAVAILABLE, reason: 'Already used in the current frequency window.' }
  }

  if (ability.frequency === 'PASSIVE') {
    return { status: AVAILABILITY.REMINDER, reason: 'Passive effect.' }
  }

  const conditions = ability.conditions || []
  if (conditions.length) {
    const results = conditions.map(condition => evaluateCondition(condition, state, context))
    if (results.some(result => result === null)) {
      return { status: AVAILABILITY.NEEDS_REVIEW, reason: 'Condition type is not supported deterministically.' }
    }
    if (results.some(result => result === false)) {
      return { status: AVAILABILITY.CONDITIONAL, reason: 'Required condition is not currently satisfied.' }
    }
  }

  return { status: AVAILABILITY.AVAILABLE, reason: 'Legal in the current game state.' }
}

export const getAvailableActions = (abilities, state, contextBySource = {}) =>
  abilities.map(ability => ({
    ability,
    evaluation: evaluateAbility(
      ability,
      state,
      contextBySource[ability.sourceEntityId] || {}
    )
  }))
