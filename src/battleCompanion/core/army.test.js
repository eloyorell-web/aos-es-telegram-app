import {
  addRegiment,
  addUnitToRegiment,
  createArmy,
  createRegiment,
  getArmyPoints,
  removeUnitFromRegiment,
  setArmyGeneral,
  setUnitQuantity,
  validateArmy
} from './army'

const baseArmy = () => createArmy({
  id: 'army-1',
  gameId: 'age-of-sigmar',
  factionId: 'ogor-mawtribes',
  faction: 'Ogor Mawtribes',
  name: 'Mis Ogors',
  pointsLimit: 2000
})

test('creates a game-agnostic army draft', () => {
  const army = baseArmy()
  expect(army.regiments).toEqual([])
  expect(army.validationStatus).toBe('draft')
})

test('adds units to a selected regiment with instance identity', () => {
  const regiment = createRegiment({ id: 'r1' })
  const army = addUnitToRegiment(addRegiment(baseArmy(), regiment), 'r1', {
    id: 'gluttons',
    name: 'Ogor Gluttons',
    points: 200
  })

  expect(army.regiments[0].units[0].warscrollId).toBe('gluttons')
  expect(army.regiments[0].units[0].instanceId).toBeTruthy()
})

test('allows repeated warscrolls as distinct unit instances', () => {
  const regiment = createRegiment({ id: 'r1' })
  let army = addRegiment(baseArmy(), regiment)
  army = addUnitToRegiment(army, 'r1', { id: 'gluttons', points: 200 })
  army = addUnitToRegiment(army, 'r1', { id: 'gluttons', points: 200 })

  const units = army.regiments[0].units
  expect(units).toHaveLength(2)
  expect(units[0].instanceId).not.toBe(units[1].instanceId)
  expect(units[0].warscrollId).toBe(units[1].warscrollId)
})

test('calculates points using quantity', () => {
  const regiment = createRegiment({ id: 'r1' })
  const army = addUnitToRegiment(addRegiment(baseArmy(), regiment), 'r1', {
    id: 'gluttons',
    points: 200,
    quantity: 2
  })

  expect(getArmyPoints(army)).toBe(400)
})

test('updates unit quantity through the army model', () => {
  const regiment = createRegiment({ id: 'r1' })
  let army = addRegiment(baseArmy(), regiment)
  army = addUnitToRegiment(army, 'r1', {
    id: 'gluttons',
    instanceId: 'gluttons-1',
    points: 200
  })
  army = setUnitQuantity(army, 'r1', 'gluttons-1', 2)

  expect(getArmyPoints(army)).toBe(400)
  expect(army.regiments[0].units[0].quantity).toBe(2)
})

test('removes only the selected unit instance', () => {
  const regiment = createRegiment({ id: 'r1' })
  let army = addRegiment(baseArmy(), regiment)
  army = addUnitToRegiment(army, 'r1', { id: 'gluttons', instanceId: 'g1', points: 200 })
  army = addUnitToRegiment(army, 'r1', { id: 'gluttons', instanceId: 'g2', points: 200 })
  army = removeUnitFromRegiment(army, 'r1', 'g1')

  expect(army.regiments[0].units.map(unit => unit.instanceId)).toEqual(['g2'])
})

test('sets exactly the selected unit instance as general', () => {
  const regiment = createRegiment({ id: 'r1' })
  let army = addRegiment(baseArmy(), regiment)
  army = addUnitToRegiment(army, 'r1', { id: 'tyrant', instanceId: 'tyrant-1', points: 180 })
  army = addUnitToRegiment(army, 'r1', { id: 'tyrant', instanceId: 'tyrant-2', points: 180 })
  army = setArmyGeneral(army, 'tyrant-2')

  expect(army.regiments[0].units[0].isGeneral).toBe(false)
  expect(army.regiments[0].units[1].isGeneral).toBe(true)
})

test('reports points limit errors deterministically', () => {
  const regiment = createRegiment({ id: 'r1' })
  const army = addUnitToRegiment(addRegiment(baseArmy(), regiment), 'r1', {
    id: 'expensive',
    points: 2100,
    isGeneral: true
  })
  const result = validateArmy(army)

  expect(result.valid).toBe(false)
  expect(result.errors).toContain('POINTS_LIMIT_EXCEEDED')
})

test('warns when an army with units has no selected general', () => {
  const regiment = createRegiment({ id: 'r1' })
  const army = addUnitToRegiment(addRegiment(baseArmy(), regiment), 'r1', {
    id: 'gluttons',
    points: 200
  })

  expect(validateArmy(army).warnings).toContain('GENERAL_NOT_SELECTED')
})
