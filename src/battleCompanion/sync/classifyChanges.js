export const CHANGE_CLASS = Object.freeze({
  SAFE_AUTO_UPDATE: 'SAFE_AUTO_UPDATE',
  REVIEW_REQUIRED: 'REVIEW_REQUIRED'
})

const SAFE_FIELDS = new Set([
  'points',
  'id',
  'move',
  'health',
  'save',
  'control'
])

const REVIEW_FIELDS = new Set([
  'name',
  'ability',
  'abilities',
  'timing',
  'phase',
  'turn',
  'frequency',
  'conditions',
  'effect',
  'duration',
  'keywords'
])

export const classifyFieldChange = (field) => {
  if (SAFE_FIELDS.has(field)) return CHANGE_CLASS.SAFE_AUTO_UPDATE
  if (REVIEW_FIELDS.has(field)) return CHANGE_CLASS.REVIEW_REQUIRED
  return CHANGE_CLASS.REVIEW_REQUIRED
}

export const diffEntity = (before = {}, after = {}) => {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)])

  return [...keys]
    .filter(key => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
    .map(field => ({
      field,
      before: before[field],
      after: after[field],
      classification: classifyFieldChange(field)
    }))
}

export const summarizeEntityDiff = ({
  entityType,
  entityId,
  entityName,
  before,
  after
}) => {
  const changes = diffEntity(before, after)
  return {
    entityType,
    entityId,
    entityName,
    changes,
    requiresReview: changes.some(
      change => change.classification === CHANGE_CLASS.REVIEW_REQUIRED
    )
  }
}
