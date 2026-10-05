import test from 'node:test'
import assert from 'node:assert/strict'
import { createGameState, nextPhase, setUnitAction, PLAYERS } from '../core/gameState.js'
import { evaluateUnit } from '../core/rulesEngine.js'

const roster={units:[{instanceId:'u1',name:'Unidad'}]}

test('starts in round 1 hero phase on your turn',()=>{
  const state=createGameState(roster)
  assert.equal(state.round,1)
  assert.equal(state.phase,'HERO')
  assert.equal(state.activePlayer,PLAYERS.YOU)
})

test('run records movement and run state',()=>{
  const state=setUnitAction(createGameState(roster),'u1','RUN')
  assert.equal(state.unitState.u1.moved,true)
  assert.equal(state.unitState.u1.ran,true)
})

test('running blocks charge with an explicit reason',()=>{
  let state=createGameState(roster)
  state=setUnitAction(state,'u1','RUN')
  state={...state,phase:'CHARGE'}
  const result=evaluateUnit(state,roster.units[0])
  assert.equal(result.available.some(a=>a.id==='CHARGE'),false)
  assert.match(result.unavailable[0].reason,/corrió/)
})

test('retreating blocks charge',()=>{
  let state=setUnitAction(createGameState(roster),'u1','RETREAT')
  state={...state,phase:'CHARGE'}
  assert.match(evaluateUnit(state,roster.units[0]).unavailable[0].reason,/retiró/)
})

test('new turn resets turn-scoped unit state',()=>{
  let state=createGameState(roster)
  state=setUnitAction(state,'u1','RUN')
  state={...state,phase:'END'}
  state=nextPhase(state)
  assert.equal(state.activePlayer,PLAYERS.OPPONENT)
  assert.equal(state.unitState.u1.ran,false)
})

test('round increments after opponent turn ends',()=>{
  let state={...createGameState(roster),activePlayer:PLAYERS.OPPONENT,phase:'END'}
  state=nextPhase(state)
  assert.equal(state.round,2)
  assert.equal(state.activePlayer,PLAYERS.YOU)
})

test('opponent turn does not invent reactions',()=>{
  const state={...createGameState(roster),activePlayer:PLAYERS.OPPONENT,phase:'CHARGE'}
  const result=evaluateUnit(state,roster.units[0])
  assert.equal(result.available.length,0)
  assert.match(result.reminders[0],/verificadas/)
})
