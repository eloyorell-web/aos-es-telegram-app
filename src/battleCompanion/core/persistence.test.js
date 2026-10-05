import {
  createArmyRepository,
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
