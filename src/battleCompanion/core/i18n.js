export const DEFAULT_LOCALE = 'es'
export const FALLBACK_LOCALE = 'en'

const messages = {
  es: {
    appName: 'Battle Companion',
    myArmies: 'Mis ejércitos',
    newArmy: 'Nuevo ejército',
    startGame: 'Iniciar partida',
    duplicate: 'Duplicar',
    remove: 'Eliminar',
    nextPhase: 'Siguiente fase',
    nextRound: 'Siguiente ronda',
    myTurn: 'Mi turno',
    opponentTurn: 'Turno rival'
  },
  en: {
    appName: 'Battle Companion',
    myArmies: 'My armies',
    newArmy: 'New army',
    startGame: 'Start game',
    duplicate: 'Duplicate',
    remove: 'Delete',
    nextPhase: 'Next phase',
    nextRound: 'Next round',
    myTurn: 'My turn',
    opponentTurn: 'Opponent turn'
  }
}

export const translate = (key, locale = DEFAULT_LOCALE) =>
  messages[locale]?.[key] ??
  messages[FALLBACK_LOCALE]?.[key] ??
  key

export const createTranslationRecord = ({
  entityId,
  original,
  translated,
  originalHash,
  translatedFromHash,
  status = 'machine_proposed'
}) => ({
  entityId,
  original,
  translated,
  originalHash,
  translatedFromHash,
  status: originalHash && translatedFromHash && originalHash !== translatedFromHash
    ? 'outdated'
    : status
})
