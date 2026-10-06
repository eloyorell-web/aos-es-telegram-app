import database from '../../dataBase.json'
import unitData from './ogorMawtribes.units.json'
import { extractUpstreamRules } from '../adapters/upstreamRules'

const upstreamRules = extractUpstreamRules(database)

export const ogorMawtribesPilot = Object.freeze({
  id: unitData.factionId,
  gameId: unitData.gameId,
  name: unitData.factionName,
  localeName: 'Tribus Ogor',
  pilot: true,
  validationStatus: 'verified_structural',
  units: unitData.units,
  abilities: upstreamRules,
  source: unitData.generatedFrom,
  note: 'Units and rule cards are read from the existing upstream dataBase.json through Battle Companion adapters; upstream source code is not modified.'
})
