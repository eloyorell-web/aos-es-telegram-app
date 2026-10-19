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

import { analyzeArmy } from '../core/armyAdvisor.js'

test('advisor flags an empty army',()=>{
  const notes=analyzeArmy({units:[],points:0,pointsLimit:2000})
  assert.equal(notes[0].title,'Ejército vacío')
})

test('advisor flags missing general',()=>{
  const notes=analyzeArmy({units:[{roles:['Infantry'],tags:[]}],points:200,pointsLimit:2000})
  assert.equal(notes.some(n=>n.title==='Falta general'),true)
})

test('advisor detects points overflow',()=>{
  const notes=analyzeArmy({units:[{roles:['Hero'],tags:[],isGeneral:true}],points:2100,pointsLimit:2000})
  assert.equal(notes.some(n=>n.title==='Excedes el límite'),true)
})

import { ogorMawCult2000 } from '../data/ogorMawCult2000.js'

test('2000pt Ogor preset preserves exported roster metadata',()=>{
  assert.equal(ogorMawCult2000.points,2000)
  assert.equal(ogorMawCult2000.pointsLimit,2000)
  assert.equal(ogorMawCult2000.drops,2)
  assert.equal(ogorMawCult2000.wounds,132)
  assert.equal(ogorMawCult2000.regiments.length,2)
  assert.equal(ogorMawCult2000.units.length,8)
})

test('2000pt Ogor preset totals units plus formation correctly',()=>{
  const subtotal=ogorMawCult2000.units.reduce((sum,u)=>sum+u.points*u.quantity,0)
  assert.equal(subtotal,1990)
  assert.equal(ogorMawCult2000.unitPointsSubtotal,1990)
  assert.equal(ogorMawCult2000.battleFormationPoints,10)
  assert.equal(subtotal + ogorMawCult2000.battleFormationPoints,2000)
})

test('Bloodpelt Hunter preset carries Mantle of Entrails at zero extra points',()=>{
  const hunter=ogorMawCult2000.units.find(u=>u.name==='Bloodpelt Hunter')
  assert.equal(hunter.artefact,'Mantle of Entrails')
  assert.equal(hunter.points,130)
  assert.equal(hunter.heroicTrait,null)
})


import { kruleboyzKragnos1990 } from '../data/kruleboyzKragnos1990.js'

test('Kruleboyz demo preset preserves supplied roster metadata',()=>{
  assert.equal(kruleboyzKragnos1990.points,1990)
  assert.equal(kruleboyzKragnos1990.pointsLimit,2000)
  assert.equal(kruleboyzKragnos1990.drops,4)
  assert.equal(kruleboyzKragnos1990.wounds,155)
  assert.equal(kruleboyzKragnos1990.regiments.length,4)
  assert.equal(kruleboyzKragnos1990.units.length,13)
})

test('Kruleboyz demo preset keeps manifestation warning',()=>{
  assert.equal(kruleboyzKragnos1990.manifestationLore,null)
  assert.equal(kruleboyzKragnos1990.warnings.includes('Falta elegir Saber de Manifestaciones'),true)
})

test('Kruleboyz demo preset points add to 1990',()=>{
  const subtotal=kruleboyzKragnos1990.units.reduce((sum,u)=>sum+u.points*u.quantity,0)
  assert.equal(subtotal,1990)
})
