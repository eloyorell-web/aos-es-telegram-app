import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const here=path.dirname(fileURLToPath(import.meta.url))
const sourcePath=path.resolve(here,'../../src/dataBase.json')
const outputDir=path.resolve(here,'../src/generated')
const outputPath=path.join(outputDir,'ogor.json')
const source=JSON.parse(fs.readFileSync(sourcePath,'utf8'))
const data=source.data
const faction=data.faction_keyword.find(item=>item.name==='Ogor Mawtribes')
if(!faction) throw new Error('No se ha encontrado la facción Ogor Mawtribes en src/dataBase.json')
const ids=new Set(data.warscroll_faction_keyword.filter(item=>item.factionKeywordId===faction.id).map(item=>item.warscrollId))
const warscrolls=data.warscroll.filter(item=>ids.has(item.id)).filter(item=>!item.isLegends&&!item.isSpearhead).map(item=>({id:item.id,name:item.name,points:Number(item.points||0),modelCount:Number(item.modelCount||1),move:item.move,save:item.save,control:item.control,health:item.health,keywords:String(item.referenceKeywords||'').split(',').map(v=>v.trim()).filter(Boolean),abilities:data.warscroll_ability.filter(a=>a.warscrollId===item.id).map(a=>({id:a.id,name:a.name,phase:a.phase,phaseDetails:a.phaseDetails,declare:a.declare,effect:a.effect,cpCost:a.cpCost,reaction:Boolean(a.reaction),icon:a.abilityAndCommandIcon}))})).sort((a,b)=>a.name.localeCompare(b.name))
const normalized={schemaVersion:1,game:'Age of Sigmar',faction:{id:faction.id,name:faction.name},source:{repository:'Aletagro/aos-telegram-app',forkSnapshot:'eloyorell-web/aos-es-telegram-app',dataVersion:source.metadata?.data_version??null},warscrolls}
fs.mkdirSync(outputDir,{recursive:true});fs.writeFileSync(outputPath,JSON.stringify(normalized,null,2)+'\n')
console.log(`Ogor dataset generado: ${warscrolls.length} warscrolls · data_version ${normalized.source.dataVersion}`)
