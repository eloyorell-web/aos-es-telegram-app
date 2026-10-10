export const ogorMawCult2000 = {
  id: 'ogor-maw-cult-2000',
  name: 'Ogor Mawtribes · Maw-Cult Fanatics',
  game: 'Age of Sigmar',
  grandAlliance: 'Destrucción',
  faction: 'Ogor Mawtribes',
  pointsLimit: 2000,
  points: 2000,
  unitPointsSubtotal: 1990,
  wounds: 132,
  drops: 2,
  battleFormation: 'Maw-Cult Fanatics',
  battleTactics: ['Blazing Onslaught', 'Siege of Ashes'],
  spellLore: 'Lore of Gut Magic',
  prayerLore: 'Lore of the Everwinter',
  manifestationLore: 'Aetherwrought Machineries',
  factionTerrain: 'Mawpit',
  sourceNote: 'Lista proporcionada por el usuario. El export declara 2000/2000 pts; el subtotal visible de unidades es 1990 pts.',
  regiments: [
    {
      name: 'Regimiento 1',
      isGeneralRegiment: true,
      units: [
        { instanceId:'redd-1', id:'815589be-3ebf-45a2-a0c4-89a6d08fa7b5', name:'Redd the Maw, High Slaughtermaster', displayName:'Redd el Fauces, Gran Carnicero', points:420, quantity:1, roles:['Hero','Wizard','War Machine'], tags:['Warmaster','Unique','Mawseekers'], isGeneral:true },
        { instanceId:'gluttons-1', id:'01cf2e41-5363-46fc-ad20-92466bc18849', name:'Gluttons', displayName:'Glotones', points:210, quantity:2, modelCount:10, roles:['Infantry'], tags:['Gutbusters'] },
        { instanceId:'maulbeast-cavalry-1', id:'62b71cb3-86df-4e44-9882-5be4a51a0de4', name:'Maulbeast Cavalry', displayName:'Caballería Brutizampa', points:280, quantity:1, modelCount:2, roles:['Cavalry'], tags:['Gutbusters'] },
        { instanceId:'hunters-1', id:'26015cac-bb01-43df-b65f-160329c4b844', name:'Hunters with Sabrefangs', displayName:'Cazadores con Colmillosables', points:170, quantity:1, modelCount:5, roles:['Infantry'], tags:['Beastclaw'] },
        { instanceId:'bloodpelt-1', id:'f49d3347-6cc0-4fb4-93e3-5771c051aa3c', name:'Bloodpelt Hunter', displayName:'Cazador Pellejosangriento', points:130, quantity:1, modelCount:1, roles:['Hero','Infantry'], tags:['Beastclaw'] }
      ]
    },
    {
      name: 'Regimiento 2',
      isGeneralRegiment: false,
      units: [
        { instanceId:'butcher-1', id:'eb242b63-0aa8-4ab4-a723-bd8d8c42aa23', name:'Butcher', displayName:'Matarife', points:170, quantity:1, modelCount:1, roles:['Hero','Wizard'], tags:['Mawseekers'] },
        { instanceId:'ironguts-1', id:'3b6a8545-1a8e-454f-9ca8-2c5e2aebcab6', name:'Ironguts', displayName:'Tripasduras', points:200, quantity:1, modelCount:3, roles:['Infantry'], tags:['Gutbusters'] },
        { instanceId:'gutseers-1', id:'f574e6e0-6b22-4354-96c4-c4d8a33a4b85', name:'Gutseers', displayName:'Gutseers', points:200, quantity:1, modelCount:3, roles:['Infantry'], tags:['Mawseekers'] }
      ]
    }
  ]
}

ogorMawCult2000.units = ogorMawCult2000.regiments.flatMap(regiment => regiment.units)
