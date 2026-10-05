import { AVAILABILITY, getAvailableActions } from './rulesEngine'

const emptyResult = () => ({
  available: [],
  reminders: [],
  conditional: [],
  unavailable: [],
  needsReview: []
})

export const buildBattleAssistant = (abilities, state, contextBySource = {}) =>
  getAvailableActions(abilities, state, contextBySource)
    .reduce((result, item) => {
      switch (item.evaluation.status) {
        case AVAILABILITY.AVAILABLE:
          result.available.push(item)
          break
        case AVAILABILITY.REMINDER:
          result.reminders.push(item)
          break
        case AVAILABILITY.CONDITIONAL:
          result.conditional.push(item)
          break
        case AVAILABILITY.UNAVAILABLE:
          result.unavailable.push(item)
          break
        case AVAILABILITY.NEEDS_REVIEW:
        default:
          result.needsReview.push(item)
          break
      }
      return result
    }, emptyResult())

export const buildChecklist = (assistantResult) => [
  ...assistantResult.available.map(item => ({
    abilityId: item.ability.abilityId,
    sourceEntityId: item.ability.sourceEntityId,
    label: item.ability.name,
    status: 'AVAILABLE'
  })),
  ...assistantResult.reminders.map(item => ({
    abilityId: item.ability.abilityId,
    sourceEntityId: item.ability.sourceEntityId,
    label: item.ability.name,
    status: 'REMINDER'
  })),
  ...assistantResult.conditional.map(item => ({
    abilityId: item.ability.abilityId,
    sourceEntityId: item.ability.sourceEntityId,
    label: item.ability.name,
    status: 'CONDITIONAL',
    reason: item.evaluation.reason
  }))
]
