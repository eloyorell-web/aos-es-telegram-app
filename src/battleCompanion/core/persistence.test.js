import {
  createArmyRepository,
  exportBattleCompanion,
  importBattleCompanion,
  loadBattleCompanion,
  saveBattleCompanion
} from './persistence'

beforeEach(() => {
  window.localStorage.clear()
})

test('uses an empty Spanish-first state by default', () => {
  expect(loadBattleCompanion()).toEqual({
    armies: [],
    activeGame: null,
    locale: 'es'
  })
})

test('saves and lists multiple armies locally', () => {
  const repository = createArmyRepository()
  repository.save({ id: 'a1', name: 'Ogres', faction: 'Ogor Mawtribes' })
  repository.save({ id: 'a2', name: 'Spearhead', faction: 'Ogor Mawtribes' })

  expect(repository.list().map(army => army.id)).toEqual(['a1', 'a2'])
})

test('saving an existing army updates it instead of duplicating it', () => {
  const repository = createArmyRepository()
  repository.save({ id: 'a1', name: 'Original' })
  repository.save({ id: 'a1', name: 'Edited' })

  expect(repository.list()).toHaveLength(1)
  expect(repository.list()[0].name).toBe('Edited')
})

test('duplicates an army with a new id', () => {
  const repository = createArmyRepository()
  repository.save({ id: 'a1', name: 'Ogres', faction: 'Ogor Mawtribes' })
  const duplicate = repository.duplicate('a1')

  expect(duplicate.id).not.toBe('a1')
  expect(repository.list()).toHaveLength(2)
  expect(duplicate.name).toMatch(/copia/)
})

test('removes only the selected army', () => {
  const repository = createArmyRepository()
  repository.save({ id: 'a1', name: 'One' })
  repository.save({ id: 'a2', name: 'Two' })
  repository.remove('a1')

  expect(repository.list().map(army => army.id)).toEqual(['a2'])
})

test('preserves active game data when army data changes', () => {
  saveBattleCompanion({
    armies: [],
    activeGame: { gameId: 'game-1', round: 2 },
    locale: 'es'
  })
  const repository = createArmyRepository()
  repository.save({ id: 'a1', name: 'Army' })

  expect(loadBattleCompanion().activeGame).toEqual({ gameId: 'game-1', round: 2 })
})

test('exports a versioned portable snapshot', () => {
  const serialized = exportBattleCompanion({
    armies: [{ id: 'a1', name: 'Ogres' }],
    activeGame: null,
    locale: 'es'
  })
  const payload = JSON.parse(serialized)

  expect(payload.format).toBe('battle-companion')
  expect(payload.version).toBe(1)
  expect(payload.data.armies[0].id).toBe('a1')
})

test('imports a valid snapshot into local storage', () => {
  const result = importBattleCompanion(JSON.stringify({
    format: 'battle-companion',
    version: 1,
    data: {
      armies: [{ id: 'a1', name: 'Ogres' }],
      activeGame: { gameId: 'g1' },
      locale: 'en'
    }
  }))

  expect(result.ok).toBe(true)
  expect(loadBattleCompanion().locale).toBe('en')
  expect(loadBattleCompanion().armies[0].id).toBe('a1')
})

test('rejects malformed or unsupported imports safely', () => {
  expect(importBattleCompanion('not-json')).toEqual({
    ok: false,
    error: 'INVALID_JSON'
  })
  expect(importBattleCompanion(JSON.stringify({
    format: 'battle-companion',
    version: 999,
    data: { armies: [] }
  }))).toEqual({
    ok: false,
    error: 'INVALID_FORMAT'
  })
})
