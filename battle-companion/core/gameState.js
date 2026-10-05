export const PHASES = ['HERO', 'MOVEMENT', 'SHOOTING', 'CHARGE', 'COMBAT', 'END']
export const PLAYERS = { YOU: 'YOU', OPPONENT: 'OPPONENT' }

const emptyUnitState = () => ({
  moved: false,
  ran: false,
  retreated: false,
  charged: false,
  fought: false
})

export function createGameState(roster) {
  return {
    version: 1,
    round: 1,
    activePlayer: PLAYERS.YOU,
    phase: 'HERO',
    roster,
    unitState: Object.fromEntries(roster.units.map(unit => [unit.instanceId, emptyUnitState()])),
    events: [{ type: 'GAME_STARTED', at: Date.now() }]
  }
}

export function setUnitAction(state, instanceId, action) {
  const current = state.unitState[instanceId] || emptyUnitState()
  const next = { ...current }
  if (action === 'MOVE') next.moved = true
  if (action === 'RUN') Object.assign(next, { moved: true, ran: true })
  if (action === 'RETREAT') Object.assign(next, { moved: true, retreated: true })
  if (action === 'CHARGE') next.charged = true
  if (action === 'FIGHT') next.fought = true
  return {
    ...state,
    unitState: { ...state.unitState, [instanceId]: next },
    events: [...state.events, { type: action, unitId: instanceId, round: state.round, phase: state.phase, at: Date.now() }]
  }
}

function resetTurnUnitState(state) {
  return Object.fromEntries(Object.keys(state.unitState).map(id => [id, emptyUnitState()]))
}

export function nextPhase(state) {
  const index = PHASES.indexOf(state.phase)
  if (index < PHASES.length - 1) {
    return { ...state, phase: PHASES[index + 1], events: [...state.events, { type: 'PHASE_CHANGED', phase: PHASES[index + 1], at: Date.now() }] }
  }
  const nextPlayer = state.activePlayer === PLAYERS.YOU ? PLAYERS.OPPONENT : PLAYERS.YOU
  const nextRound = state.activePlayer === PLAYERS.OPPONENT ? state.round + 1 : state.round
  return {
    ...state,
    round: nextRound,
    activePlayer: nextPlayer,
    phase: 'HERO',
    unitState: resetTurnUnitState(state),
    events: [...state.events, { type: 'TURN_CHANGED', player: nextPlayer, round: nextRound, at: Date.now() }]
  }
}
