import { TURN } from '../core/gameState'

const PHASE_MAP = {
  deployment: 'DEPLOYMENT', deploymentPhase: 'DEPLOYMENT',
  hero: 'HERO', heroPhase: 'HERO', startOfTurn: 'HERO',
  movement: 'MOVEMENT', movementPhase: 'MOVEMENT',
  shooting: 'SHOOTING', shootingPhase: 'SHOOTING',
  charge: 'CHARGE', chargePhase: 'CHARGE',
  combat: 'COMBAT', combatPhase: 'COMBAT',
  end: 'END', endOfTurn: 'END'
}

const cleanText = value => typeof value === 'string'
  ? value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  : ''

const phaseFrom = raw => {
  const direct = PHASE_MAP[raw.phase]
  if (direct) return direct
  const text = `${raw.phase || ''} ${raw.phaseDetails || ''}`.toLowerCase()
  if (text.includes('deployment')) return 'DEPLOYMENT'
  if (text.includes('hero')) return 'HERO'
  if (text.includes('movement')) return 'MOVEMENT'
  if (text.includes('shooting')) return 'SHOOTING'
  if (text.includes('charge')) return 'CHARGE'
  if (text.includes('combat')) return 'COMBAT'
  if (text.includes('end of') || text.includes('end phase')) return 'END'
  if (text.includes('passive')) return 'ANY'
  return null
}

const frequencyFrom = raw => {
  const text = `${raw.phaseDetails || ''} ${raw.timing || ''}`.toLowerCase()
  if (text.includes('passive')) return 'PASSIVE'
  if (text.includes('once per battle')) return 'ONCE_PER_BATTLE'
  if (text.includes('once per round')) return 'ONCE_PER_ROUND'
  if (text.includes('once per turn')) return 'ONCE_PER_TURN'
  if (text.includes('once per phase')) return 'ONCE_PER_PHASE'
  return null
}

const turnFrom = raw => {
  const text = `${raw.phaseDetails || ''} ${raw.timing || ''}`.toLowerCase()
  if (text.includes('your turn')) return TURN.YOUR
  if (text.includes('enemy turn') || text.includes('opponent')) return TURN.OPPONENT
  return TURN.ANY
}

const colorFrom = raw => {
  const phase = phaseFrom(raw)
  if (frequencyFrom(raw) === 'PASSIVE') return 'green'
  if (phase === 'DEPLOYMENT') return 'black'
  if (phase === 'COMBAT') return 'red'
  if (phase === 'END') return 'purple'
  return raw.abilityAndCommandIcon === 'command' ? 'red' : 'neutral'
}

const modifiersFrom = raw => {
  const text = cleanText(raw.effect || raw.description || raw.rules || raw.text || '')
  const matches = text.match(/[+-]\s*\d+\s+(?:to\s+)?(?:hit|wound|save|rend|damage|control|move|attacks?)/gi) || []
  const wards = text.match(/ward\s*\(?\d+\+?\)?/gi) || []
  const heals = text.match(/heal\s+(?:d\d+|\d+)/gi) || []
  return [...new Set([...matches, ...wards, ...heals].map(item => item.replace(/\s+/g, ' ').trim()))]
}

const sourceIdsFrom = raw => Object.entries(raw)
  .filter(([key, value]) => key !== 'id' && /Id$/.test(key) && typeof value === 'string')
  .map(([, value]) => value)

const looksLikeRule = raw => raw && raw.id && raw.name && (
  raw.phase != null || raw.phaseDetails != null || raw.abilityAndCommandIcon != null ||
  raw.effect != null || raw.description != null || raw.rules != null
)

export const normalizeUpstreamRule = (raw, tableName = 'upstream') => {
  const sourceIds = sourceIdsFrom(raw)
  const effect = cleanText(raw.effect || raw.description || raw.rules || raw.text || raw.lore || '')
  return {
    abilityId: raw.id,
    sourceEntityId: sourceIds[0] || 'army',
    sourceIds,
    sourceTable: tableName,
    name: raw.name,
    phase: phaseFrom(raw) || 'ANY',
    timingLabel: raw.phaseDetails || raw.phase || 'Regla',
    turn: turnFrom(raw),
    frequency: frequencyFrom(raw) || 'ONCE_PER_PHASE',
    effect,
    summary: effect,
    modifiers: modifiersFrom(raw),
    cardColor: colorFrom(raw),
    cpCost: raw.cpCost,
    scope: sourceIds.length ? 'SOURCE' : 'ARMY',
    validationStatus: 'verified',
    source: 'upstream:dataBase.json'
  }
}

export const extractUpstreamRules = database => {
  const data = database?.data || database || {}
  const seen = new Set()
  const rules = []
  Object.entries(data).forEach(([tableName, rows]) => {
    if (!Array.isArray(rows)) return
    rows.forEach(raw => {
      if (!looksLikeRule(raw) || seen.has(raw.id)) return
      seen.add(raw.id)
      rules.push(normalizeUpstreamRule(raw, tableName))
    })
  })
  return rules
}
