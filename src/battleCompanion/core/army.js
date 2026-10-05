export const createArmy = ({
  id,
  gameId,
  factionId,
  faction,
  name,
  pointsLimit = 2000
}) => ({
  id: id || null,
  gameId,
  factionId,
  faction,
  name,
  pointsLimit,
  battleFormation: null,
  regiments: [],
  auxiliaryUnits: [],
  enhancements: [],
  spellLore: null,
  prayerLore: null,
  manifestationLore: null,
  validationStatus: 'draft'
})

export const createRegiment = ({ id, name = 'Regimiento' } = {}) => ({
  id: id || `regiment-${Date.now()}`,
  name,
  units: []
})

export const addRegiment = (army, regiment = createRegiment()) => ({
  ...army,
  regiments: [...army.regiments, regiment]
})

export const addUnitToRegiment = (army, regimentId, unit) => ({
  ...army,
  regiments: army.regiments.map(regiment =>
    regiment.id === regimentId
      ? { ...regiment, units: [...regiment.units, { quantity: 1, ...unit }] }
      : regiment
  )
})

export const setArmyGeneral = (army, unitId) => ({
  ...army,
  regiments: army.regiments.map(regiment => ({
    ...regiment,
    units: regiment.units.map(unit => ({
      ...unit,
      isGeneral: unit.id === unitId
    }))
  }))
})

export const getArmyUnits = (army) => [
  ...army.regiments.flatMap(regiment => regiment.units),
  ...army.auxiliaryUnits
]

export const getArmyPoints = (army) =>
  getArmyUnits(army).reduce(
    (total, unit) => total + ((unit.points || 0) * (unit.quantity || 1)),
    0
  )

export const validateArmy = (army) => {
  const errors = []
  const warnings = []
  const units = getArmyUnits(army)
  const points = getArmyPoints(army)
  const generals = units.filter(unit => unit.isGeneral)

  if (!army.gameId) errors.push('GAME_REQUIRED')
  if (!army.factionId) errors.push('FACTION_REQUIRED')
  if (!army.name?.trim()) errors.push('NAME_REQUIRED')
  if (points > army.pointsLimit) errors.push('POINTS_LIMIT_EXCEEDED')
  if (generals.length > 1) errors.push('MULTIPLE_GENERALS')
  if (units.length > 0 && generals.length === 0) warnings.push('GENERAL_NOT_SELECTED')

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    points,
    pointsLimit: army.pointsLimit
  }
}
