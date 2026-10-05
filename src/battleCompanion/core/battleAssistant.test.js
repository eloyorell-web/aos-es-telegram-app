import { TURN, createGameState } from './gameState'
import { buildBattleAssistant, buildChecklist } from './battleAssistant'

const verified = {
  sourceEntityId: 'tyrant',
  phase: 'HERO',
  turn: TURN.YOUR,
  frequency: 'ONCE_PER_PHASE',
  validationStatus: 'verified'
}

test('groups actions into battle-assistant sections', () => {
  const abilities = [
    { ...verified, abilityId: 'available', name: 'Available' },
    { ...verified, abilityId: 'passive', name: 'Passive', frequency: 'PASSIVE' },
    {
      ...verified,
      abilityId: 'conditional',
      name: 'Conditional',
      conditions: [{
        type: 'CONTEXT_EQUALS',
        field: 'targetIsMonster',
        value: true
      }]
    },
    { ...verified, abilityId: 'wrong-phase', name: 'Wrong phase', phase: 'COMBAT' },
    { ...verified, abilityId: 'review', name: 'Review', validationStatus: 'ambiguous' }
  ]

  const result = buildBattleAssistant(abilities, createGameState(), {
    tyrant: { targetIsMonster: false }
  })

  expect(result.available.map(item => item.ability.abilityId)).toEqual(['available'])
  expect(result.reminders.map(item => item.ability.abilityId)).toEqual(['passive'])
  expect(result.conditional.map(item => item.ability.abilityId)).toEqual(['conditional'])
  expect(result.unavailable.map(item => item.ability.abilityId)).toEqual(['wrong-phase'])
  expect(result.needsReview.map(item => item.ability.abilityId)).toEqual(['review'])
})

test('checklist only contains actionable and reminder entries', () => {
  const result = buildBattleAssistant([
    { ...verified, abilityId: 'available', name: 'Available' },
    { ...verified, abilityId: 'blocked', name: 'Blocked', phase: 'COMBAT' }
  ], createGameState())

  expect(buildChecklist(result)).toEqual([
    {
      abilityId: 'available',
      sourceEntityId: 'tyrant',
      label: 'Available',
      status: 'AVAILABLE'
    }
  ])
})
