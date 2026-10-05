import { createGameState, markAbilityUsed, setUnitState, TURN } from './gameState'
import { AVAILABILITY, evaluateAbility } from './rulesEngine'

const baseAbility = {
  abilityId: 'a1',
  sourceEntityId: 'u1',
  phase: 'HERO',
  turn: TURN.YOUR,
  frequency: 'ONCE_PER_PHASE',
  validationStatus: 'verified'
}

test('verified legal ability is available', () => {
  expect(evaluateAbility(baseAbility, createGameState()).status).toBe(AVAILABILITY.AVAILABLE)
})

test('wrong phase is unavailable', () => {
  const state = { ...createGameState(), phase: 'MOVEMENT' }
  expect(evaluateAbility(baseAbility, state).status).toBe(AVAILABILITY.UNAVAILABLE)
})

test('opponent turn restriction is enforced', () => {
  const ability = { ...baseAbility, turn: TURN.OPPONENT }
  expect(evaluateAbility(ability, createGameState()).status).toBe(AVAILABILITY.UNAVAILABLE)
})

test('used ability becomes unavailable in its frequency window', () => {
  const state = markAbilityUsed(createGameState(), baseAbility)
  expect(evaluateAbility(baseAbility, state).status).toBe(AVAILABILITY.UNAVAILABLE)
})

test('failed deterministic condition is conditional', () => {
  const ability = {
    ...baseAbility,
    conditions: [{ type: 'UNIT_STATE_EQUALS', unitId: 'u1', field: 'hasRunThisTurn', value: false }]
  }
  const state = setUnitState(createGameState(), 'u1', { hasRunThisTurn: true })
  expect(evaluateAbility(ability, state).status).toBe(AVAILABILITY.CONDITIONAL)
})

test('unknown condition types are never silently treated as legal', () => {
  const ability = { ...baseAbility, conditions: [{ type: 'UNKNOWN_CONDITION' }] }
  expect(evaluateAbility(ability, createGameState()).status).toBe(AVAILABILITY.NEEDS_REVIEW)
})

test('unverified metadata is blocked for review', () => {
  const ability = { ...baseAbility, validationStatus: 'needs_review' }
  expect(evaluateAbility(ability, createGameState()).status).toBe(AVAILABILITY.NEEDS_REVIEW)
})
