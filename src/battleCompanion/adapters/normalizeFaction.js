const byId = (items = []) => new Map(items.map(item => [item.id, item]))

export const normalizeFactionFromUpstream = (upstream, factionSelector) => {
  const data = upstream?.data || {}
  const factions = data.faction_keyword || []
  const faction = factions.find(item =>
    item.id === factionSelector || item.name === factionSelector
  )

  if (!faction) {
    return {
      faction: null,
      units: [],
      abilities: [],
      validationStatus: 'needs_review',
      warnings: ['Faction not found in upstream data.']
    }
  }

  const warscrolls = byId(data.warscroll || [])
  const unitIds = (data.warscroll_faction_keyword || [])
    .filter(link => link.factionKeywordId === faction.id)
    .map(link => link.warscrollId)

  const units = unitIds
    .map(id => warscrolls.get(id))
    .filter(Boolean)
    .map(unit => ({
      id: unit.id,
      name: unit.name,
      points: unit.points ?? null,
      keywords: unit.referenceKeywords || [],
      source: 'upstream',
      validationStatus: 'verified_structural'
    }))

  return {
    faction: {
      id: faction.id,
      name: faction.name,
      source: 'upstream'
    },
    units,
    abilities: [],
    validationStatus: 'verified_structural',
    warnings: [
      'Abilities are intentionally excluded until timing, frequency and conditions are normalized and reviewed.'
    ]
  }
}

export const buildFactionIndex = (upstream) =>
  (upstream?.data?.faction_keyword || []).map(faction => ({
    id: faction.id,
    name: faction.name
  }))
