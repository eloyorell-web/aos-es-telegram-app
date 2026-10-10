export function normalizeRoster(input) {
  if (!input || typeof input !== 'object') throw new Error('Roster no válido')

  const regiments = Array.isArray(input.regiments)
    ? input.regiments.map(item => typeof item === 'string' ? JSON.parse(item) : item)
    : []

  const sourceUnits = [
    ...regiments.flatMap(r => r.units || []),
    ...(input.auxiliaryUnits || input.auxiliary_units || [])
  ]

  const units = sourceUnits.map((unit, index) => ({
    instanceId: unit.instanceId || unit.instance_id || `${unit.id || 'unit'}-${index}`,
    id: unit.id || `unknown-${index}`,
    name: unit.name || 'Unidad sin nombre',
    points: Number(unit.points || 0),
    quantity: Number(unit.quantity || 1),
    keywords: unit.keywords || unit.referenceKeywords || [],
    isGeneral: Boolean(unit.isGeneral || unit.is_general)
  }))

  return {
    id: input.id || 'local-roster',
    name: input.name || 'Mi ejército',
    game: 'Age of Sigmar',
    faction: input.faction || input.allegiance || 'Sin facción',
    points: Number(input.points?.all ?? input.totalPoints ?? units.reduce((sum, unit) => sum + unit.points * unit.quantity, 0)),
    pointsLimit: Number(input.pointsLimit || input.points_limit || 2000),
    units
  }
}
