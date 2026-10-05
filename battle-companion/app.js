import { createGameState, nextPhase, setUnitAction, PLAYERS } from './core/gameState.js'
import { evaluateUnit } from './core/rulesEngine.js'
import { normalizeRoster } from './adapters/rosterAdapter.js'
import { ogorPilotRoster, source } from './data/ogorPilot.js'

const STORAGE_KEY = 'battle-companion-product-v1'
let state = load()

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved?.roster) return saved
  } catch {}
  return { roster: structuredClone(ogorPilotRoster), game: null, screen: 'home' }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function setState(patch) {
  state = { ...state, ...patch }
  persist()
  render()
}

const phaseLabel = {
  HERO: 'Héroe',
  MOVEMENT: 'Movimiento',
  SHOOTING: 'Disparo',
  CHARGE: 'Carga',
  COMBAT: 'Combate',
  END: 'Final'
}

function shell(content, active='home') {
  return `
    <div class="app">
      <header class="topbar">
        <div>
          <span class="brand-kicker">BATTLE COMPANION</span>
          <strong>Age of Sigmar</strong>
        </div>
        <span class="pilot">PILOTO</span>
      </header>
      <main>${content}</main>
      <nav class="nav">
        <button data-screen="home" class="${active==='home'?'active':''}">Partida</button>
        <button data-screen="army" class="${active==='army'?'active':''}">Ejército</button>
        <button data-screen="rules" class="${active==='rules'?'active':''}">Reglas</button>
      </nav>
    </div>`
}

function home() {
  const r=state.roster
  return shell(`
    <section class="hero">
      <span class="eyebrow">TU MESA, SIN RUIDO</span>
      <h1>Lo importante,<br>en el momento correcto.</h1>
      <p>El Companion usa el estado de la partida para filtrar acciones y recordatorios. No inventa legalidad cuando una regla todavía no está verificada.</p>
    </section>
    ${state.game ? `
      <button class="continue-card" data-action="continue">
        <span>CONTINUAR PARTIDA</span>
        <strong>Ronda ${state.game.round} · ${state.game.activePlayer===PLAYERS.YOU?'Mi turno':'Turno rival'}</strong>
        <b>${phaseLabel[state.game.phase]}</b>
      </button>` : ''}
    <section class="card army-summary">
      <div>
        <span class="eyebrow">MI EJÉRCITO</span>
        <h2>${r.faction}</h2>
        <p>${r.points.toLocaleString('es-ES')} / ${r.pointsLimit.toLocaleString('es-ES')} pts · ${r.units.length} entradas</p>
      </div>
      <button class="primary" data-action="start">${state.game?'Reiniciar partida':'Iniciar partida'}</button>
    </section>
    <section class="trust">
      <span class="dot"></span>
      <div><strong>Datos estructurales trazados</strong><small>Habilidades específicas: pendientes de validación antes de mostrarse como legales.</small></div>
    </section>
  `,'home')
}

function army() {
  const rows=state.roster.units.map(u=>`
    <article class="unit-card">
      <div><strong>${u.name}</strong><small>${u.isGeneral?'GENERAL · ':''}${u.keywords.slice(0,3).join(' · ')}</small></div>
      <b>${u.points * u.quantity} pts</b>
    </article>`).join('')
  return shell(`
    <section class="page-head"><span class="eyebrow">MI EJÉRCITO</span><h1>${state.roster.faction}</h1><p>${state.roster.points} / ${state.roster.pointsLimit} pts</p></section>
    <section class="unit-list">${rows}</section>
    <details class="import-box"><summary>Importar roster JSON</summary><textarea id="roster-json" placeholder="Pega aquí un roster serializado"></textarea><button class="secondary" data-action="import">Importar</button><p id="import-error"></p></details>
  `,'army')
}

function battle() {
  const g=state.game
  const unitRows=g.roster.units.map(unit=>{
    const ev=evaluateUnit(g,unit)
    const actions=ev.available.map(a=>`<button class="action-chip" data-unit="${unit.instanceId}" data-unit-action="${a.id}">${a.label}</button>`).join('')
    const blocked=ev.unavailable.map(a=>`<div class="blocked"><b>${a.label}</b><span>${a.reason}</span></div>`).join('')
    const reminders=ev.reminders.map(r=>`<p class="reminder">⚠ ${r}</p>`).join('')
    const us=g.unitState[unit.instanceId]||{}
    const flags=[us.ran?'Corrió':'',us.retreated?'Se retiró':'',us.charged?'Cargó':'',us.fought?'Combatió':''].filter(Boolean).join(' · ')
    return `<article class="battle-unit"><div class="unit-title"><strong>${unit.name}</strong><small>${flags||'Sin acciones registradas'}</small></div><div class="chips">${actions}</div>${blocked}${reminders}</article>`
  }).join('')
  return shell(`
    <section class="battle-head">
      <div><span class="eyebrow">RONDA ${g.round}</span><h1>${g.activePlayer===PLAYERS.YOU?'MI TURNO':'TURNO RIVAL'}</h1></div>
      <span class="phase">${phaseLabel[g.phase]}</span>
    </section>
    <div class="phase-track">${Object.keys(phaseLabel).map(p=>`<span class="${p===g.phase?'current':''}">${phaseLabel[p]}</span>`).join('')}</div>
    <section class="section-title"><span>AHORA</span><small>Acciones derivadas del estado</small></section>
    <section class="battle-list">${unitRows}</section>
    <button class="primary sticky-next" data-action="next-phase">Siguiente fase →</button>
  `,'home')
}

function rules() {
  return shell(`
    <section class="page-head"><span class="eyebrow">TRAZABILIDAD</span><h1>Reglas y datos</h1></section>
    <section class="card"><h2>Qué está verificado</h2><p>En esta demo solo consideramos verificados los datos estructurales del piloto Ogor: IDs, nombres, puntos y keywords normalizados.</p></section>
    <section class="card"><h2>Qué NO hacemos</h2><p>Una habilidad, timing o condición no se muestra como legal hasta que su metadata haya sido revisada. Ante duda, el sistema bloquea la automatización.</p></section>
    <section class="source-card"><span>FUENTE</span><code>${source.repository}/${source.path}</code><small>blob ${source.blobSha.slice(0,12)}…</small></section>
  `,'rules')
}

function render() {
  const root=document.querySelector('#root')
  if (state.screen==='battle' && state.game) root.innerHTML=battle()
  else if (state.screen==='army') root.innerHTML=army()
  else if (state.screen==='rules') root.innerHTML=rules()
  else root.innerHTML=home()
}

document.addEventListener('click', event=>{
  const screen=event.target.closest('[data-screen]')?.dataset.screen
  if(screen) return setState({screen})
  const action=event.target.closest('[data-action]')?.dataset.action
  if(action==='start') return setState({game:createGameState(state.roster),screen:'battle'})
  if(action==='continue') return setState({screen:'battle'})
  if(action==='next-phase') return setState({game:nextPhase(state.game)})
  if(action==='import'){
    try{
      const roster=normalizeRoster(JSON.parse(document.querySelector('#roster-json').value))
      return setState({roster,game:null,screen:'army'})
    }catch(err){
      document.querySelector('#import-error').textContent=err.message
    }
  }
  const unitButton=event.target.closest('[data-unit-action]')
  if(unitButton) return setState({game:setUnitAction(state.game,unitButton.dataset.unit,unitButton.dataset.unitAction)})
})

render()
