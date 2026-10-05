import {
  FRESHNESS,
  assessFreshness,
  createSourceMetadata,
  freshnessLabel
} from './freshness'

test('unverified rules never claim to be fresh', () => {
  const metadata = createSourceMetadata({
    source: 'upstream',
    importedAt: '2026-10-01T00:00:00Z',
    checkedAt: '2026-10-05T00:00:00Z',
    validationStatus: 'needs_review'
  })

  expect(assessFreshness(metadata)).toBe(FRESHNESS.UNVERIFIED)
})

test('verified source with a completed check can be reported verified', () => {
  const metadata = createSourceMetadata({
    source: 'upstream',
    importedAt: '2026-10-01T00:00:00Z',
    validatedAt: '2026-10-02T00:00:00Z',
    checkedAt: '2026-10-05T00:00:00Z',
    validationStatus: 'verified'
  })

  expect(assessFreshness(metadata)).toBe(FRESHNESS.VERIFIED)
})

test('later official evidence marks data as possibly outdated', () => {
  const metadata = createSourceMetadata({
    source: 'upstream',
    importedAt: '2026-10-01T00:00:00Z',
    validatedAt: '2026-10-02T00:00:00Z',
    checkedAt: '2026-10-05T00:00:00Z',
    officialLatestAt: '2026-10-04T00:00:00Z',
    validationStatus: 'verified'
  })

  expect(assessFreshness(metadata)).toBe(FRESHNESS.POSSIBLY_OUTDATED)
  expect(freshnessLabel(metadata)).toBe('Posible desactualización')
})

test('English freshness labels are available as fallback-facing UI', () => {
  const metadata = createSourceMetadata({
    source: 'upstream',
    importedAt: '2026-10-01T00:00:00Z',
    checkedAt: '2026-10-05T00:00:00Z',
    validationStatus: 'needs_review'
  })

  expect(freshnessLabel(metadata, 'en')).toBe('Update not verified')
})
