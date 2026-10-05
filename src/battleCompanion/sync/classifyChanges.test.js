import {
  CHANGE_CLASS,
  classifyFieldChange,
  diffEntity,
  summarizeEntityDiff
} from './classifyChanges'

test('points are safe structured updates', () => {
  expect(classifyFieldChange('points')).toBe(CHANGE_CLASS.SAFE_AUTO_UPDATE)
})

test('semantic rule fields always require review', () => {
  expect(classifyFieldChange('timing')).toBe(CHANGE_CLASS.REVIEW_REQUIRED)
  expect(classifyFieldChange('conditions')).toBe(CHANGE_CLASS.REVIEW_REQUIRED)
  expect(classifyFieldChange('effect')).toBe(CHANGE_CLASS.REVIEW_REQUIRED)
})

test('unknown fields default to review instead of auto-update', () => {
  expect(classifyFieldChange('newUpstreamField')).toBe(CHANGE_CLASS.REVIEW_REQUIRED)
})

test('diff only reports fields that changed', () => {
  const changes = diffEntity(
    { id: 'u1', points: 200, name: 'Gluttons' },
    { id: 'u1', points: 180, name: 'Gluttons' }
  )

  expect(changes).toEqual([
    {
      field: 'points',
      before: 200,
      after: 180,
      classification: CHANGE_CLASS.SAFE_AUTO_UPDATE
    }
  ])
})

test('semantic changes mark the entity for review', () => {
  const summary = summarizeEntityDiff({
    entityType: 'ability',
    entityId: 'a1',
    entityName: 'Ability X',
    before: { timing: 'HERO' },
    after: { timing: 'COMBAT' }
  })

  expect(summary.requiresReview).toBe(true)
  expect(summary.changes[0].classification).toBe(CHANGE_CLASS.REVIEW_REQUIRED)
})
