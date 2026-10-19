export const kruleboyzKragnos1990 = {
  id: 'kruleboyz-kragnos-1990',
  name: 'Kruleboyz · Kragnos 1990',
  game: 'Age of Sigmar',
  grandAlliance: 'Destrucción',
  faction: 'Kruleboyz',
  pointsLimit: 2000,
  points: 1990,
  wounds: 155,
  drops: 4,
  battleFormation: 'Light Finga',
  battleTactics: ['Blazing Onslaught', 'Smokescreen'],
  spellLore: 'Lore of the Swamp',
  prayerLore: null,
  manifestationLore: null,
  factionTerrain: 'Skaregob Totem',
  warnings: ['Falta elegir Saber de Manifestaciones'],
  sourceNote: 'Preset creado a partir del roster proporcionado por el usuario para pruebas de la demo.',
  editableWithCurrentBuilder: false,
  regiments: [
    {
      name: 'Regimiento 1',
      isGeneralRegiment: false,
      units: [
        { instanceId:'killaboss-gnashtoof-1', id:'kb-killaboss-gnashtoof', name:'Killaboss on Great Gnashtoof', displayName:'Killaboss on Great Gnashtoof', points:130, quantity:1, modelCount:1, roles:['Hero','Cavalry'], tags:['Kruleboyz'], artefact:'Woggly Bogstikk', artefactDisplayName:'Woggly Bogstikk', isGeneral:false },
        { instanceId:'murknob-1', id:'kb-murknob', name:'Murknob with Belcha-banna', displayName:'Murknob with Belcha-banna', points:80, quantity:1, modelCount:1, roles:['Hero','Infantry'], tags:['Kruleboyz'], isGeneral:false },
        { instanceId:'gutrippaz-1', id:'kb-gutrippaz', name:'Gutrippaz', displayName:'Gutrippaz', points:150, quantity:1, modelCount:10, roles:['Infantry'], tags:['Kruleboyz'], isGeneral:false },
        { instanceId:'gutrippaz-2', id:'kb-gutrippaz', name:'Gutrippaz', displayName:'Gutrippaz', points:150, quantity:1, modelCount:10, roles:['Infantry'], tags:['Kruleboyz'], isGeneral:false }
      ]
    },
    {
      name: 'Regimiento 2',
      isGeneralRegiment: false,
      units: [
        { instanceId:'swampcalla-1', id:'kb-swampcalla', name:'Swampcalla Shaman with Pot-grot', displayName:'Swampcalla Shaman with Pot-grot', points:120, quantity:1, modelCount:1, roles:['Hero','Wizard','Infantry'], tags:['Kruleboyz'], isGeneral:false },
        { instanceId:'killbow-1', id:'kb-killbow', name:'Beast-skewer Killbow', displayName:'Beast-skewer Killbow', points:130, quantity:1, modelCount:1, roles:['War Machine'], tags:['Kruleboyz','Ranged'], isGeneral:false },
        { instanceId:'hobgrot-1', id:'kb-hobgrot', name:'Hobgrot Slittaz', displayName:'Hobgrot Slittaz', points:70, quantity:1, modelCount:10, roles:['Infantry'], tags:['Kruleboyz'], isGeneral:false }
      ]
    },
    {
      name: 'Regimiento 3',
      isGeneralRegiment: false,
      units: [
        { instanceId:'snatchaboss-1', id:'kb-snatchaboss', name:'Snatchaboss on Sludgeraker Beast', displayName:'Snatchaboss on Sludgeraker Beast', points:180, quantity:1, modelCount:1, roles:['Hero','Monster'], tags:['Kruleboyz'], isGeneral:false },
        { instanceId:'boltboyz-1', id:'kb-boltboyz', name:'Man-skewer Boltboyz', displayName:'Man-skewer Boltboyz', points:100, quantity:1, modelCount:3, roles:['Infantry'], tags:['Kruleboyz','Ranged'], isGeneral:false }
      ]
    },
    {
      name: 'Regimiento 4',
      isGeneralRegiment: true,
      units: [
        { instanceId:'kragnos-1', id:'kragnos', name:'Kragnos, the End of Empires', displayName:'Kragnos, el Fin de los Imperios', points:580, quantity:1, modelCount:1, roles:['Hero','Monster'], tags:['Warmaster','Unique','Destruction'], isGeneral:true },
        { instanceId:'gutrippaz-3', id:'kb-gutrippaz', name:'Gutrippaz', displayName:'Gutrippaz', points:150, quantity:1, modelCount:10, roles:['Infantry'], tags:['Kruleboyz'], isGeneral:false },
        { instanceId:'gutrippaz-4', id:'kb-gutrippaz', name:'Gutrippaz', displayName:'Gutrippaz', points:150, quantity:1, modelCount:10, roles:['Infantry'], tags:['Kruleboyz'], isGeneral:false }
      ]
    }
  ]
}

kruleboyzKragnos1990.units = kruleboyzKragnos1990.regiments.flatMap(regiment => regiment.units)
