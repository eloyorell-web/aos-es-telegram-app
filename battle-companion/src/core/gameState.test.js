import { describe, expect, it } from 'vitest'
import { createGameState, markAbilityUsed, nextStep, PHASES } from './gameState'

describe('gameState', () => {
  it('inicia una partida en ronda 1 y comienzo de turno propio', () => {
    const state = createGameState('army-1')
    expect(state.armyId).toBe('army-1')
    expect(state.round).toBe(1)
    expect(state.activePlayer).toBe('you')
    expect(state.phase).toBe(PHASES[0])
  })

  it('avanza por las ventanas de una misma activación', () => {
    const state = createGameState('army-1')
    const next = nextStep(state)
    expect(next.phase).toBe('heroPhase')
    expect(next.activePlayer).toBe('you')
    expect(next.round).toBe(1)
  })

  it('cambia al rival al terminar el turno propio sin subir ronda', () => {
    const state = { ...createGameState('army-1'), phase: 'endOfTurn' }
    const next = nextStep(state)
    expect(next.activePlayer).toBe('opponent')
    expect(next.round).toBe(1)
    expect(next.phase).toBe('startOfTurn')
  })

  it('sube de ronda al terminar el turno rival', () => {
    const state = { ...createGameState('army-1'), activePlayer: 'opponent', phase: 'endOfTurn' }
    const next = nextStep(state)
    expect(next.activePlayer).toBe('you')
    expect(next.round).toBe(2)
  })

  it('registra el uso de una habilidad sin duplicar la misma ventana', () => {
    const state = createGameState('army-1')
    const once = markAbilityUsed(state, 'unit:ability', 'round:1:turn:you')
    const twice = markAbilityUsed(once, 'unit:ability', 'round:1:turn:you')
    expect(twice.usedAbilities['unit:ability']).toEqual(['round:1:turn:you'])
    expect(twice.events.filter(event => event.type === 'ability_used')).toHaveLength(2)
  })
})
