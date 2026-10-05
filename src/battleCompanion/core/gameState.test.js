import {
  TURN,
  addEffect,
  createGameState,
  markAbilityUsed,
  nextRound,
  setActivePlayer,
  setPhase,
  setUnitState
} from './gameState'

const ability = {
  abilityId: 'a1',
  sourceEntityId: 'u1',
  frequency: 'ONCE_PER_PHASE'
}

test('creates a game in round 1 and hero phase', () => {
  const state = createGameState({ armyId: 'army-1' })
  expect(state.round).toBe(1)
  expect(state.phase).toBe('HERO')
  expect(state.activePlayer).toBe(TURN.YOUR)
})

test('records ability use', () => {
  const state = markAbilityUsed(createGameState(), ability)
  expect(Object.keys(state.usedAbilities)).toHaveLength(1)
  expect(state.events.at(-1).type).toBe('ABILITY_USED')
})

test('once per phase use resets when phase changes', () => {
  const used = markAbilityUsed(createGameState(), ability)
  const moved = setPhase(used, 'MOVEMENT')
  expect(Object.keys(moved.usedAbilities)).toHaveLength(0)
})

test('once per turn survives phase changes but resets on turn change', () => {
  const turnAbility = { ...ability, frequency: 'ONCE_PER_TURN' }
  const used = markAbilityUsed(createGameState(), turnAbility)
  expect(Object.keys(setPhase(used, 'MOVEMENT').usedAbilities)).toHaveLength(1)
  expect(Object.keys(setActivePlayer(used, TURN.OPPONENT).usedAbilities)).toHaveLength(0)
})

test('once per round resets on the next round', () => {
  const roundAbility = { ...ability, frequency: 'ONCE_PER_ROUND' }
  const used = markAbilityUsed(createGameState(), roundAbility)
  expect(Object.keys(nextRound(used).usedAbilities)).toHaveLength(0)
})

test('once per battle survives phase, turn and round transitions', () => {
  const battleAbility = { ...ability, frequency: 'ONCE_PER_BATTLE' }
  const used = markAbilityUsed(createGameState(), battleAbility)
  const progressed = nextRound(setActivePlayer(setPhase(used, 'MOVEMENT'), TURN.OPPONENT))
  expect(Object.keys(progressed.usedAbilities)).toHaveLength(1)
})

test('tracks unit state as deterministic facts', () => {
  const state = setUnitState(createGameState(), 'gluttons-1', { hasRunThisTurn: true })
  expect(state.unitState['gluttons-1'].hasRunThisTurn).toBe(true)
})

test('turn-scoped unit facts reset when the active player changes', () => {
  const state = setUnitState(createGameState(), 'gluttons-1', {
    hasRunThisTurn: true,
    woundsAllocated: 2
  })
  const next = setActivePlayer(state, TURN.OPPONENT)

  expect(next.unitState['gluttons-1'].hasRunThisTurn).toBeUndefined()
  expect(next.unitState['gluttons-1'].woundsAllocated).toBe(2)
})

test('effects can be persistent or temporary', () => {
  const persistent = addEffect(createGameState(), { id: 'persistent', duration: 'PERSISTENT' })
  const temporary = addEffect(persistent, { id: 'phase', duration: 'UNTIL_END_OF_PHASE' })

  expect(temporary.activeEffects.map(effect => effect.id)).toEqual(['persistent'])
  expect(temporary.temporaryEffects.map(effect => effect.id)).toEqual(['phase'])
})

test('end-of-phase effects expire when phase changes', () => {
  const state = addEffect(createGameState(), { id: 'phase-effect', duration: 'UNTIL_END_OF_PHASE' })
  expect(setPhase(state, 'MOVEMENT').temporaryEffects).toEqual([])
})

test('end-of-turn temporary effects expire on turn change', () => {
  const state = {
    ...createGameState(),
    temporaryEffects: [
      { id: 'turn-effect', duration: 'UNTIL_END_OF_TURN' },
      { id: 'other-effect', duration: 'UNTIL_END_OF_ROUND' }
    ]
  }

  const next = setActivePlayer(state, TURN.OPPONENT)
  expect(next.temporaryEffects.map(effect => effect.id)).toEqual(['other-effect'])
})

test('end-of-round effects expire on the next round', () => {
  const state = {
    ...createGameState(),
    temporaryEffects: [
      { id: 'round-effect', duration: 'UNTIL_END_OF_ROUND' },
      { id: 'battle-effect', duration: 'UNTIL_END_OF_BATTLE' }
    ]
  }

  const next = nextRound(state)
  expect(next.temporaryEffects.map(effect => effect.id)).toEqual(['battle-effect'])
})
