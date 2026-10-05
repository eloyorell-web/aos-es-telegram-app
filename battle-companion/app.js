import { createGameState, nextPhase, setUnitAction, PLAYERS } from './core/gameState.js'
import { evaluateUnit } from './core/rulesEngine.js'
import { analyzeArmy } from './core/armyAdvisor.js'
import { normalizeRoster } from './adapters/rosterAdapter.js'
import { ogorPilotRoster, source } from './data/ogorPilot.js'
import { ogorCatalog, catalogById } from './data/ogorCatalog.js'

const STORAGE_KEY = 'battle-companion-product-v2'
const clone = value => JSON.parse(JSON.stringify(value))

function calculatePoints(units) {
  return units.reduce((sum, unit) => sum + Number(unit.points || 0) * Number(unit.quantity || 1), 0)
}

function newRoster() {
  return { id:'local-ogor', name:'Mi ejército Ogor', game:'Age of Sigmar', faction:'Ogor Mawtribes', points:0, pointsLimit:2000, units:[] }
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && saved.roster) return saved
  } catch (error) {}
  return { roster: clone(ogorPilotRoster), draft: null, game: null, screen: 'home' }
}

let state = load()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function setState(patch) {
  state = Object.assign({}, state, patch)
  persist()
  render()
}

const phaseLabel = { HERO:'Héroe', MOVEMENT:'Movimiento', SHOOTING:'Disparo', CHARGE:'Carga', COMBAT:'Combate', END:'Final' }

function shell(content, active) {
  active = active || 'home'
  return '<div class="app">' +
    '<header class="topbar"><div><span class="brand-kicker">BATTLE COMPANION</span><strong>Age of Sigmar</strong></div><span class="pilot">MVP</span></header>' +
    '<main>' + content + '</main>' +
    '<nav class="nav">' +
      '<button data-screen="home" class="' + (active==='home'?'active':'') + '">Partida</button>' +
      '<button data-screen="army" class="' + (active==='army'?'active':'') + '">Ejército</button>' +
      '<button data-screen="rules" class="' + (active==='rules'?'active':'') + '">Reglas</button>' +
    '</nav></div>'
}

function analysisCards(roster) {
  return analyzeArmy(roster).map(note =>
    '<article class="advice ' + note.level + '"><strong>' + note.title + '</strong><p>' + note.text + '</p></article>'
  ).join('')
}

function home() {
  const r = state.roster
  const continueCard = state.game
    ? '<button class="continue-card" data-action="continue"><span>CONTINUAR PARTIDA</span><strong>Ronda ' + state.game.round + ' · ' + (state.game.activePlayer===PLAYERS.YOU?'Mi turno':'Turno rival') + '</strong><b>' + phaseLabel[state.game.phase] + '</b></button>'
    : ''
  const content =
    '<section class="hero compact"><span class="eyebrow">BATTLE COMPANION</span><h1>Tu ejército.<br>Tu partida.</h1><p>Crea tu lista, revisa su composición y úsala durante la partida para saber qué acciones siguen disponibles.</p></section>' +
    continueCard +
    '<section class="card army-summary"><div><span class="eyebrow">MI EJÉRCITO</span><h2>' + r.name + '</h2><p>' + r.faction + ' · ' + r.points.toLocaleString('es-ES') + ' / ' + r.pointsLimit.toLocaleString('es-ES') + ' pts · ' + r.units.length + ' entradas</p></div>' +
    '<div class="stack-actions"><button class="primary" data-action="start" ' + (r.units.length?'':'disabled') + '>Iniciar partida</button><button class="secondary" data-action="new-army">Crear ejército</button></div></section>' +
    '<section class="section-title"><span>ANÁLISIS DE COMPOSICIÓN</span><small>No sustituye reglas verificadas</small></section><section class="advice-list">' + analysisCards(r) + '</section>'
  return shell(content,'home')
}

function army() {
  const r = state.roster
  const rows = r.units.length ? r.units.map(u =>
    '<article class="unit-card"><div><strong>' + u.name + '</strong><small>' + (u.isGeneral?'GENERAL · ':'') + (u.roles||u.keywords||[]).slice(0,3).join(' · ') + '</small></div><div class="points-right"><b>' + (u.points*u.quantity) + ' pts</b><small>' + u.quantity + '× ' + u.points + '</small></div></article>'
  ).join('') : '<div class="empty">Todavía no has añadido unidades.</div>'
  const content =
    '<section class="page-head"><span class="eyebrow">MI EJÉRCITO</span><h1>' + r.name + '</h1><p>' + r.faction + ' · ' + r.points + ' / ' + r.pointsLimit + ' pts</p><div class="head-actions"><button class="primary" data-action="edit-army">Editar ejército</button><button class="secondary" data-action="new-army">Nuevo</button></div></section>' +
    '<section class="unit-list">' + rows + '</section>' +
    '<section class="section-title"><span>QUÉ VEO EN TU LISTA</span><small>Composición estructural</small></section><section class="advice-list">' + analysisCards(r) + '</section>' +
    '<details class="import-box"><summary>Importar roster JSON</summary><textarea id="roster-json" placeholder="Pega aquí un roster serializado"></textarea><button class="secondary" data-action="import">Importar</button><p id="import-error"></p></details>'
  return shell(content,'army')
}

function builder() {
  const d = state.draft || newRoster()
  const selected = Object.fromEntries(d.units.map(u => [u.id,u]))
  const catalog = ogorCatalog.map(unit => {
    const current = selected[unit.id]
    const qty = current ? current.quantity : 0
    const isHero = unit.roles.includes('Hero')
    const general = isHero && qty ? '<button class="general-toggle ' + (current.isGeneral?'on':'') + '" data-unit-id="' + unit.id + '" data-builder-action="general">' + (current.isGeneral?'✓ General':'Hacer general') + '</button>' : ''
    return '<article class="catalog-row ' + (qty?'selected':'') + '">' +
      '<div class="catalog-main"><strong>' + unit.name + '</strong><small>' + unit.roles.join(' · ') + (unit.tags.length?' · '+unit.tags.join(' · '):'') + '</small></div>' +
      '<div class="catalog-points">' + unit.points + ' pts</div>' +
      '<div class="qty"><button data-unit-id="' + unit.id + '" data-builder-action="minus" ' + (qty?'':'disabled') + '>−</button><b>' + qty + '</b><button data-unit-id="' + unit.id + '" data-builder-action="plus">+</button></div>' +
      general + '</article>'
  }).join('')
  const over = d.points > d.pointsLimit
  const content =
    '<section class="builder-head"><span class="eyebrow">CREAR EJÉRCITO</span><input id="army-name" value="' + d.name.replaceAll('"','&quot;') + '" aria-label="Nombre del ejército">' +
    '<div class="limit-line ' + (over?'over':'') + '"><strong>' + d.points + ' / ' + d.pointsLimit + ' pts</strong><label>Límite <select id="points-limit">' +
    [1000,1500,2000,2500,3000].map(v=>'<option ' + (d.pointsLimit===v?'selected':'') + '>' + v + '</option>').join('') +
    '</select></label></div></section>' +
    '<div class="builder-note">Piloto Ogor Mawtribes · catálogo estructural trazado al upstream.</div>' +
    '<section class="catalog">' + catalog + '</section>' +
    '<div class="builder-footer"><button class="secondary" data-action="cancel-builder">Cancelar</button><button class="primary" data-action="save-army" ' + (over||!d.units.length?'disabled':'') + '>Guardar ejército</button></div>'
  return shell(content,'army')
}

function battle() {
  const g = state.game
  const unitRows = g.roster.units.map(unit => {
    const ev = evaluateUnit(g,unit)
    const actions = ev.available.map(a=>'<button class="action-chip" data-unit="' + unit.instanceId + '" data-unit-action="' + a.id + '">' + a.label + '</button>').join('')
    const blocked = ev.unavailable.map(a=>'<div class="blocked"><b>' + a.label + '</b><span>' + a.reason + '</span></div>').join('')
    const reminders = ev.reminders.map(r=>'<p class="reminder">⚠ ' + r + '</p>').join('')
    const us = g.unitState[unit.instanceId] || {}
    const flags = [us.ran?'Corrió':'',us.retreated?'Se retiró':'',us.charged?'Cargó':'',us.fought?'Combatió':''].filter(Boolean).join(' · ')
    return '<article class="battle-unit"><div class="unit-title"><strong>' + unit.name + (unit.isGeneral?' · GENERAL':'') + '</strong><small>' + (flags||'Sin acciones registradas') + '</small></div><div class="chips">' + actions + '</div>' + blocked + reminders + '</article>'
  }).join('')
  const phases = Object.keys(phaseLabel).map(p=>'<span class="' + (p===g.phase?'current':'') + '">' + phaseLabel[p] + '</span>').join('')
  const content =
    '<section class="battle-head"><div><span class="eyebrow">RONDA ' + g.round + '</span><h1>' + (g.activePlayer===PLAYERS.YOU?'MI TURNO':'TURNO RIVAL') + '</h1></div><span class="phase">' + phaseLabel[g.phase] + '</span></section>' +
    '<div class="phase-track">' + phases + '</div>' +
    '<section class="section-title"><span>AHORA</span><small>Según el estado registrado</small></section><section class="battle-list">' + unitRows + '</section>' +
    '<button class="primary sticky-next" data-action="next-phase">Siguiente fase →</button>'
  return shell(content,'home')
}

function rules() {
  const content =
    '<section class="page-head"><span class="eyebrow">REGLAS Y DATOS</span><h1>Fiabilidad primero</h1></section>' +
    '<section class="card"><h2>Datos estructurales</h2><p>IDs, nombres, puntos y keywords del piloto Ogor se leen y normalizan desde la fuente upstream. No reescribimos esa base.</p></section>' +
    '<section class="card"><h2>Consejos actuales</h2><p>El análisis del ejército usa composición: puntos, héroes, Wizard/Priest, presencia de mesa, disparo y monstruos. No afirma interacciones de warscroll no verificadas.</p></section>' +
    '<section class="card"><h2>Durante la partida</h2><p>El motor ya conserva estado por unidad y puede impedir acciones incompatibles registradas, como cargar después de correr o retirarse.</p></section>' +
    '<section class="source-card"><span>FUENTE ESTRUCTURAL</span><code>' + source.repository + '/' + source.path + '</code><small>blob ' + source.blobSha.slice(0,12) + '…</small></section>'
  return shell(content,'rules')
}

function updateDraftUnit(id, action) {
  const draft = clone(state.draft || newRoster())
  const base = catalogById[id]
  let item = draft.units.find(u=>u.id===id)
  if(action==='plus'){
    if(item) item.quantity += 1
    else draft.units.push(Object.assign({},base,{instanceId:id+'-1',quantity:1,isGeneral:false,keywords:base.roles}))
  }
  if(action==='minus' && item){
    item.quantity -= 1
    if(item.quantity<=0) draft.units = draft.units.filter(u=>u.id!==id)
  }
  if(action==='general' && item && base.roles.includes('Hero')){
    const turningOn = !item.isGeneral
    draft.units.forEach(u=>{u.isGeneral=false})
    item = draft.units.find(u=>u.id===id)
    if(item) item.isGeneral = turningOn
  }
  draft.points = calculatePoints(draft.units)
  setState({draft})
}

function render() {
  const root = document.querySelector('#root')
  if (state.screen==='battle' && state.game) root.innerHTML=battle()
  else if (state.screen==='builder') root.innerHTML=builder()
  else if (state.screen==='army') root.innerHTML=army()
  else if (state.screen==='rules') root.innerHTML=rules()
  else root.innerHTML=home()
}

document.addEventListener('click', event=>{
  const screenButton = event.target.closest('[data-screen]')
  if(screenButton) return setState({screen:screenButton.dataset.screen})
  const builderButton = event.target.closest('[data-builder-action]')
  if(builderButton) return updateDraftUnit(builderButton.dataset.unitId,builderButton.dataset.builderAction)
  const actionButton = event.target.closest('[data-action]')
  const action = actionButton ? actionButton.dataset.action : null
  if(action==='start') return setState({game:createGameState(state.roster),screen:'battle'})
  if(action==='continue') return setState({screen:'battle'})
  if(action==='next-phase') return setState({game:nextPhase(state.game)})
  if(action==='new-army') return setState({draft:newRoster(),screen:'builder'})
  if(action==='edit-army') return setState({draft:clone(state.roster),screen:'builder'})
  if(action==='cancel-builder') return setState({draft:null,screen:'army'})
  if(action==='save-army'){
    const draft = clone(state.draft)
    draft.points = calculatePoints(draft.units)
    return setState({roster:draft,draft:null,game:null,screen:'army'})
  }
  if(action==='import'){
    try{
      const roster = normalizeRoster(JSON.parse(document.querySelector('#roster-json').value))
      return setState({roster,game:null,screen:'army'})
    }catch(err){
      document.querySelector('#import-error').textContent = err.message
    }
  }
  const unitButton = event.target.closest('[data-unit-action]')
  if(unitButton) return setState({game:setUnitAction(state.game,unitButton.dataset.unit,unitButton.dataset.unitAction)})
})

document.addEventListener('input', event=>{
  if(state.screen!=='builder') return
  if(event.target.id==='army-name'){
    const draft=clone(state.draft)
    draft.name=event.target.value
    state=Object.assign({},state,{draft})
    persist()
  }
})

document.addEventListener('change', event=>{
  if(state.screen!=='builder') return
  if(event.target.id==='points-limit'){
    const draft=clone(state.draft)
    draft.pointsLimit=Number(event.target.value)
    setState({draft})
  }
})

render()
