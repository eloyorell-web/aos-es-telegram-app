import { PLAYERS } from './gameState.js'

export function evaluateUnit(state, unit) {
  const us = state.unitState[unit.instanceId] || {}
  const yourTurn = state.activePlayer === PLAYERS.YOU
  const available = []
  const unavailable = []
  const reminders = []

  if (!yourTurn) {
    reminders.push('Turno rival: solo se mostrarán reacciones cuando estén verificadas.')
    return { available, unavailable, reminders }
  }

  switch (state.phase) {
    case 'HERO':
      reminders.push('Las habilidades específicas de warscroll aún no se muestran hasta estar verificadas.')
      break
    case 'MOVEMENT':
      available.push({ id: 'MOVE', label: 'Mover' })
      available.push({ id: 'RUN', label: 'Correr' })
      available.push({ id: 'RETREAT', label: 'Retirarse' })
      break
    case 'SHOOTING':
      reminders.push('El perfil de disparo se añadirá desde datos normalizados verificados.')
      break
    case 'CHARGE':
      if (us.ran) unavailable.push({ id: 'CHARGE', label: 'Cargar', reason: 'Esta unidad corrió durante este turno.' })
      else if (us.retreated) unavailable.push({ id: 'CHARGE', label: 'Cargar', reason: 'Esta unidad se retiró durante este turno.' })
      else available.push({ id: 'CHARGE', label: 'Cargar' })
      break
    case 'COMBAT':
      if (us.fought) unavailable.push({ id: 'FIGHT', label: 'Combatir', reason: 'Esta unidad ya fue marcada como utilizada en esta fase.' })
      else available.push({ id: 'FIGHT', label: 'Combatir' })
      break
    case 'END':
      reminders.push('Fin de turno: revisa efectos que expiren al final del turno.')
      break
    default:
      break
  }

  return { available, unavailable, reminders }
}
