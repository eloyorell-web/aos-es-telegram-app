export const TURN = Object.freeze({
  YOUR: 'YOUR_TURN',
  OPPONENT: 'OPPONENT_TURN',
  ANY: 'ANY_TURN'
})

export const PHASES = Object.freeze([
  'HERO',
  'MOVEMENT',
  'SHOOTING',
  'CHARGE',
  'COMBAT',
  'END'
])

const TURN_SCOPED_UNIT_FIELDS = Object.freeze([
  'hasRunThisTurn',
  'hasRetreatedThisTurn',
  'hasChargedThisTurn',
  'hasFoughtThisTurn',
  'hasShotThisTurn'
])

export const createGameState = ({ armyId, startingPlayer = TURN.YOUR } = {}) => ({
  gameId: `game-${Date.now()}`,
  armyId: armyId || null,
  round: 1,
  activePlayer: startingPlayer,
  phase: PHASES[0],
  usedAbilities: {},
  activeEffects: [],
  temporaryEffects: [],
  unitState: {},
  events: []
})

export const abilityUseKey = (abilityId, sourceEntityId = 'global') =>
  `${sourceEntityId}::${abilityId}`

export const markAbilityUsed = (state, ability, sourceEntityId = ability.sourceEntityId) => {
  const key = abilityUseKey(ability.abilityId, sourceEntityId)
  return {
    ...state,
    usedAbilities: {
      ...state.usedAbilities,
      [key]: {
        round: state.round,
        activePlayer: state.activePlayer,
        phase: state.phase,
        frequency: ability.frequency
      }
    },
    events: [
      ...state.events,
      {
        type: 'ABILITY_USED',
        abilityId: ability.abilityId,
        sourceEntityId,
        round: state.round,
        activePlayer: state.activePlayer,
        phase: state.phase
      }
    ]
  }
}

export const addEffect = (state, effect) => {
  const target = effect.duration === 'PERSISTENT' ? 'activeEffects' : 'temporaryEffects'
  return {
    ...state,
    [target]: [...state[target], effect],
    events: [...state.events, { type: 'EFFECT_ADDED', effectId: effect.id, duration: effect.duration }]
  }
}

const shouldKeepUse = (use, nextState) => {
  switch (use.frequency) {
    case 'ONCE_PER_BATTLE':
      return true
    case 'ONCE_PER_ROUND':
      return use.round === nextState.round
    case 'ONCE_PER_TURN':
      return use.round === nextState.round && use.activePlayer === nextState.activePlayer
    case 'ONCE_PER_PHASE':
      return use.round === nextState.round &&
        use.activePlayer === nextState.activePlayer &&
        use.phase === nextState.phase
    default:
      return false
  }
}

const resetUses = (state) => ({
  ...state,
  usedAbilities: Object.fromEntries(
    Object.entries(state.usedAbilities).filter(([, use]) => shouldKeepUse(use, state))
  )
})

const resetTurnScopedUnitState = (unitState = {}) =>
  Object.fromEntries(Object.entries(unitState).map(([unitId, state]) => {
    const nextState = { ...state }
    TURN_SCOPED_UNIT_FIELDS.forEach(field => {
      delete nextState[field]
    })
    return [unitId, nextState]
  }))

const expireEffects = (effects = [], durations = []) =>
  effects.filter(effect => !durations.includes(effect.duration))

export const setPhase = (state, phase) => {
  if (!PHASES.includes(phase)) throw new Error(`Unknown phase: ${phase}`)
  return resetUses({
    ...state,
    phase,
    temporaryEffects: expireEffects(state.temporaryEffects, ['UNTIL_END_OF_PHASE']),
    events: [...state.events, { type: 'PHASE_CHANGED', phase, round: state.round, activePlayer: state.activePlayer }]
  })
}

export const setActivePlayer = (state, activePlayer) => {
  if (![TURN.YOUR, TURN.OPPONENT].includes(activePlayer)) {
    throw new Error(`Unknown active player: ${activePlayer}`)
  }
  return resetUses({
    ...state,
    activePlayer,
    phase: PHASES[0],
    unitState: resetTurnScopedUnitState(state.unitState),
    temporaryEffects: expireEffects(state.temporaryEffects, [
      'UNTIL_END_OF_PHASE',
      'UNTIL_END_OF_TURN'
    ]),
    events: [...state.events, { type: 'TURN_CHANGED', activePlayer, round: state.round }]
  })
}

export const nextRound = (state) => resetUses({
  ...state,
  round: state.round + 1,
  activePlayer: TURN.YOUR,
  phase: PHASES[0],
  unitState: resetTurnScopedUnitState(state.unitState),
  temporaryEffects: expireEffects(state.temporaryEffects, [
    'UNTIL_END_OF_PHASE',
    'UNTIL_END_OF_TURN',
    'UNTIL_END_OF_ROUND'
  ]),
  events: [...state.events, { type: 'ROUND_STARTED', round: state.round + 1 }]
})

export const setUnitState = (state, unitId, patch) => ({
  ...state,
  unitState: {
    ...state.unitState,
    [unitId]: {
      ...(state.unitState[unitId] || {}),
      ...patch
    }
  },
  events: [...state.events, { type: 'UNIT_STATE_CHANGED', unitId, patch }]
})
