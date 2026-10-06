import database from '../../dataBase.json'
import unitData from './ogorMawtribes.units.json'
import { extractBattleFormations, extractUpstreamRules } from '../adapters/upstreamRules'

const upstreamRules = extractUpstreamRules(database)
const battleFormations = extractBattleFormations(database, unitData.factionId)

export const ogorMawtribesPilot = Object.freeze({
  id: unitData.factionId,
  gameId: unitData.gameId,
  name: unitData.factionName,
  localeName: 'Tribus Ogor',
  pilot: true,
  validationStatus: 'verified_structural',
  units: unitData.units,
  battleFormations,
  abilities: upstreamRules,
  source: unitData.generatedFrom,
  note: 'Units, formations and rule cards are read from the existing upstream dataBase.json through Battle Companion adapters; upstream source code is not modified.'
})
