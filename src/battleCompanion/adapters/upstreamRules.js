import { TURN } from '../core/gameState'

const PHASE_MAP = { deployment:'DEPLOYMENT', deploymentPhase:'DEPLOYMENT', hero:'HERO', heroPhase:'HERO', startOfTurn:'HERO', movement:'MOVEMENT', movementPhase:'MOVEMENT', shooting:'SHOOTING', shootingPhase:'SHOOTING', charge:'CHARGE', chargePhase:'CHARGE', combat:'COMBAT', combatPhase:'COMBAT', end:'END', endOfTurn:'END' }
const cleanText = value => typeof value === 'string' ? value.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim() : ''
const phaseFrom = raw => { const direct=PHASE_MAP[raw.phase]; if(direct)return direct; const t=`${raw.phase||''} ${raw.phaseDetails||''}`.toLowerCase(); if(t.includes('deployment'))return'DEPLOYMENT'; if(t.includes('hero'))return'HERO'; if(t.includes('movement'))return'MOVEMENT'; if(t.includes('shooting'))return'SHOOTING'; if(t.includes('charge'))return'CHARGE'; if(t.includes('combat'))return'COMBAT'; if(t.includes('end of')||t.includes('end phase'))return'END'; if(t.includes('passive'))return'ANY'; return null }
const frequencyFrom = raw => { const t=`${raw.phaseDetails||''} ${raw.timing||''}`.toLowerCase(); if(t.includes('passive'))return'PASSIVE'; if(t.includes('once per battle'))return'ONCE_PER_BATTLE'; if(t.includes('once per round'))return'ONCE_PER_ROUND'; if(t.includes('once per turn'))return'ONCE_PER_TURN'; if(t.includes('once per phase'))return'ONCE_PER_PHASE'; return null }
const turnFrom = raw => { const t=`${raw.phaseDetails||''} ${raw.timing||''}`.toLowerCase(); if(t.includes('your turn'))return TURN.YOUR; if(t.includes('enemy turn')||t.includes('opponent'))return TURN.OPPONENT; return TURN.ANY }
const colorFrom = raw => { const p=phaseFrom(raw); if(frequencyFrom(raw)==='PASSIVE')return'green'; if(p==='DEPLOYMENT')return'black'; if(p==='COMBAT')return'red'; if(p==='END')return'purple'; return raw.abilityAndCommandIcon==='command'?'red':'neutral' }
const modifiersFrom = raw => { const t=cleanText(raw.effect||raw.description||raw.rules||raw.text||''); const a=t.match(/[+-]\s*\d+\s+(?:to\s+)?(?:hit|wound|save|rend|damage|control|move|attacks?)/gi)||[]; const w=t.match(/ward\s*\(?\d+\+?\)?/gi)||[]; const h=t.match(/heal\s+(?:d\d+|\d+)/gi)||[]; return [...new Set([...a,...w,...h].map(x=>x.replace(/\s+/g,' ').trim()))] }
const sourceIdsFrom = raw => Object.entries(raw).filter(([k,v])=>k!=='id'&&/Id$/.test(k)&&typeof v==='string').map(([,v])=>v)
const looksLikeRule = raw => raw&&raw.id&&raw.name&&(raw.phase!=null||raw.phaseDetails!=null||raw.abilityAndCommandIcon!=null||raw.effect!=null||raw.description!=null||raw.rules!=null)

export const normalizeUpstreamRule = (raw, tableName='upstream') => { const sourceIds=sourceIdsFrom(raw); const effect=cleanText(raw.effect||raw.description||raw.rules||raw.text||raw.lore||''); return { abilityId:raw.id, sourceEntityId:sourceIds[0]||'army', sourceIds, sourceTable:tableName, name:raw.name, phase:phaseFrom(raw)||'ANY', timingLabel:raw.phaseDetails||raw.phase||'Regla', turn:turnFrom(raw), frequency:frequencyFrom(raw)||'ONCE_PER_PHASE', effect, summary:effect, modifiers:modifiersFrom(raw), cardColor:colorFrom(raw), cpCost:raw.cpCost, scope:sourceIds.length?'SOURCE':'ARMY', validationStatus:'verified', source:'upstream:dataBase.json' } }

export const extractUpstreamRules = database => { const data=database?.data||database||{}; const seen=new Set(); const rules=[]; Object.entries(data).forEach(([tableName,rows])=>{ if(!Array.isArray(rows))return; rows.forEach(raw=>{ if(!looksLikeRule(raw)||seen.has(raw.id))return; seen.add(raw.id); rules.push(normalizeUpstreamRule(raw,tableName)) }) }); return rules }

export const extractBattleFormations = (database, factionId) => {
  const data=database?.data||database||{}
  const referenced=new Set()
  Object.values(data).forEach(rows=>Array.isArray(rows)&&rows.forEach(row=>{ if(row?.battleFormationId) referenced.add(row.battleFormationId) }))
  const found=[]; const seen=new Set()
  Object.values(data).forEach(rows=>Array.isArray(rows)&&rows.forEach(row=>{
    if(row?.factionId===factionId&&referenced.has(row.id)&&row.name&&!seen.has(row.id)){ seen.add(row.id); found.push({id:row.id,name:row.name}) }
  }))
  return found.sort((a,b)=>a.name.localeCompare(b.name))
}
