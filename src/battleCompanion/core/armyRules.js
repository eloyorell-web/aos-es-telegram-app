import { getArmyUnits } from './army'

export const getArmySourceIds = (army) => {
  if (!army) return new Set()
  const unitIds = getArmyUnits(army).flatMap(unit => [unit.id, unit.warscrollId, unit.instanceId]).filter(Boolean)
  const selectionIds = [
    army.battleFormation?.id || army.battleFormation,
    ...(army.enhancements || []).flatMap(item => [item?.id, item?.sourceEntityId]),
    army.spellLore?.id || army.spellLore,
    army.prayerLore?.id || army.prayerLore,
    army.manifestationLore?.id || army.manifestationLore
  ].filter(Boolean)
  return new Set([...unitIds, ...selectionIds, 'army', army.factionId].filter(Boolean))
}

export const getAbilitiesForArmy = (army, abilities = []) => {
  const sourceIds = getArmySourceIds(army)
  return abilities.filter(ability => {
    if (!ability) return false
    if (ability.scope === 'ARMY') return true
    const sources = [
      ...(ability.sourceIds || []), ability.sourceEntityId, ability.unitId,
      ability.warscrollId, ability.selectionId
    ].filter(Boolean)
    return sources.some(source => sourceIds.has(source))
  })
}

export const getAbilityPresentation = (ability) => ({
  cardColor: ability.cardColor || ability.color || 'neutral',
  timingLabel: ability.timingLabel || ability.phase || 'Regla',
  summary: ability.summary || ability.effect || ability.text || '',
  modifiers: ability.modifiers || [],
  keywords: ability.keywords || [],
  sourceLabel: ability.sourceLabel || ability.sourceName || ''
})
