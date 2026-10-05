import { buildFactionIndex, normalizeFactionFromUpstream } from './normalizeFaction'

const upstream = {
  data: {
    faction_keyword: [
      { id: 'ogor', name: 'Ogor Mawtribes' },
      { id: 'other', name: 'Other Faction' }
    ],
    warscroll_faction_keyword: [
      { factionKeywordId: 'ogor', warscrollId: 'gluttons' },
      { factionKeywordId: 'ogor', warscrollId: 'tyrant' },
      { factionKeywordId: 'other', warscrollId: 'other-unit' }
    ],
    warscroll: [
      { id: 'gluttons', name: 'Ogor Gluttons', points: 200, referenceKeywords: ['Infantry'] },
      { id: 'tyrant', name: 'Tyrant', points: 180, referenceKeywords: ['Hero'] },
      { id: 'other-unit', name: 'Other Unit', points: 100, referenceKeywords: [] }
    ]
  }
}

test('builds a lightweight faction index', () => {
  expect(buildFactionIndex(upstream)).toEqual([
    { id: 'ogor', name: 'Ogor Mawtribes' },
    { id: 'other', name: 'Other Faction' }
  ])
})

test('normalizes only units belonging to the requested faction', () => {
  const normalized = normalizeFactionFromUpstream(upstream, 'Ogor Mawtribes')
  expect(normalized.faction.id).toBe('ogor')
  expect(normalized.units.map(unit => unit.id)).toEqual(['gluttons', 'tyrant'])
  expect(normalized.abilities).toEqual([])
})

test('does not silently infer ability legality', () => {
  const normalized = normalizeFactionFromUpstream(upstream, 'ogor')
  expect(normalized.warnings[0]).toMatch(/Abilities are intentionally excluded/)
})

test('unknown faction is marked for review', () => {
  const normalized = normalizeFactionFromUpstream(upstream, 'missing')
  expect(normalized.validationStatus).toBe('needs_review')
  expect(normalized.units).toEqual([])
})
