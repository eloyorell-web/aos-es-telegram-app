export function analyzeArmy(roster) {
  const units = roster.units || []
  const total = Number(roster.points || 0)
  const limit = Number(roster.pointsLimit || 2000)
  const heroes = units.filter(u => (u.roles || u.keywords || []).includes('Hero'))
  const wizards = units.filter(u => (u.roles || u.keywords || []).includes('Wizard'))
  const priests = units.filter(u => (u.roles || u.keywords || []).includes('Priest'))
  const monsters = units.filter(u => (u.roles || u.keywords || []).includes('Monster'))
  const ranged = units.filter(u => (u.tags || []).includes('Ranged'))
  const bodies = units.filter(u => ['Infantry','Cavalry'].some(role => (u.roles || u.keywords || []).includes(role)))
  const notes = []

  if (!units.length) {
    return [{ level:'warning', title:'Ejército vacío', text:'Añade unidades antes de iniciar una partida.' }]
  }

  if (!units.some(u => u.isGeneral)) {
    notes.push({ level:'warning', title:'Falta general', text:'Marca un héroe como general para completar la estructura básica de la lista.' })
  }

  if (total > limit) {
    notes.push({ level:'danger', title:'Excedes el límite', text:`La lista supera el límite en ${total - limit} puntos.` })
  } else if (limit - total > 250) {
    notes.push({ level:'info', title:'Muchos puntos libres', text:`Te quedan ${limit - total} puntos sin utilizar. Puede haber margen para reforzar la lista.` })
  } else {
    notes.push({ level:'good', title:'Puntos bien aprovechados', text:`Te quedan ${limit - total} puntos disponibles.` })
  }

  if (!heroes.length) {
    notes.push({ level:'warning', title:'Sin héroes', text:'La composición no contiene héroes en el catálogo estructural actual.' })
  } else if (heroes.length === 1) {
    notes.push({ level:'info', title:'Poca redundancia de mando', text:'Solo tienes un héroe. Si cae pronto, perderás opciones de apoyo y mando.' })
  }

  if (!wizards.length && !priests.length) {
    notes.push({ level:'info', title:'Sin apoyo mágico o sacerdotal', text:'No hay Wizard ni Priest en la lista. Es una observación de composición, no una ilegalidad.' })
  }

  if (!ranged.length) {
    notes.push({ level:'info', title:'Presión a distancia limitada', text:'No has añadido unidades etiquetadas como disparo en el catálogo estructural.' })
  }

  if (monsters.length >= 2) {
    notes.push({ level:'good', title:'Presencia de monstruos', text:`La lista incluye ${monsters.length} monstruos, lo que da una identidad clara de presión y movilidad.` })
  }

  if (bodies.length < 2) {
    notes.push({ level:'warning', title:'Poca presencia de mesa', text:'Tienes pocas entradas de infantería o caballería. Revisa si tendrás suficiente presencia para puntuar y ocupar objetivos.' })
  }

  return notes
}
