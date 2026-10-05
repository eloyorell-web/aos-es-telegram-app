import unitData from './ogorMawtribes.units.json'

export const ogorMawtribesPilot = Object.freeze({
  id: unitData.factionId,
  gameId: unitData.gameId,
  name: unitData.factionName,
  localeName: 'Tribus Ogor',
  pilot: true,
  validationStatus: 'verified_structural',
  units: unitData.units,
  abilities: [],
  source: unitData.generatedFrom,
  note: 'Structural units are normalized from upstream. Ability legality remains intentionally unpopulated until reviewed.'
})
