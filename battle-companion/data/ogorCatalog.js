export const ogorCatalog = [
  { id:'c801b5dc-1f31-47c8-9f6f-035d7d97ee56', name:'Tyrant', points:150, roles:['Hero','Infantry'], tags:['Gutbusters'] },
  { id:'eb242b63-0aa8-4ab4-a723-bd8d8c42aa23', name:'Butcher', points:170, roles:['Hero','Wizard'], tags:['Mawseekers'] },
  { id:'e36649e5-1ed8-416e-8ed8-69b8c9c2ebcf', name:'Grell Firefist', points:140, roles:['Hero','Infantry'], tags:['Unique','Gutbusters'] },
  { id:'95950a43-ee96-470f-b2e7-e4894d30ba2b', name:'Firebelly', points:150, roles:['Hero','Wizard'], tags:['Gutbusters'] },
  { id:'f49d3347-6cc0-4fb4-93e3-5771c051aa3c', name:'Bloodpelt Hunter', points:130, roles:['Hero','Infantry'], tags:['Beastclaw'] },
  { id:'d7d2f7e1-2abe-4927-ac7b-61130b357ce3', name:'Icebrow Hunter', points:130, roles:['Hero','Infantry'], tags:['Beastclaw'] },
  { id:'01cf2e41-5363-46fc-ad20-92466bc18849', name:'Gluttons', points:210, roles:['Infantry'], tags:['Gutbusters'] },
  { id:'3b6a8545-1a8e-454f-9ca8-2c5e2aebcab6', name:'Ironguts', points:200, roles:['Infantry'], tags:['Gutbusters'] },
  { id:'fba5cf66-8e96-4e8e-99e4-ade2cd7359e9', name:'Cleavers', points:220, roles:['Infantry'], tags:['Mawseekers'] },
  { id:'ff260598-5963-4e41-830a-46fbd8527dbe', name:'Gorger Mawpack', points:240, roles:['Infantry'], tags:['Mawseekers'] },
  { id:'26015cac-bb01-43df-b65f-160329c4b844', name:'Hunters with Sabrefangs', points:170, roles:['Infantry'], tags:['Beastclaw'] },
  { id:'00454651-e486-436c-89bc-7fa0747fa70b', name:'Leadbelchers', points:140, roles:['Infantry'], tags:['Gutbusters','Ranged'] },
  { id:'16846bfb-03bb-4b16-914e-3d05ee3ca547', name:'Ironblaster', points:180, roles:['War Machine'], tags:['Gutbusters','Ranged'] },
  { id:'62b71cb3-86df-4e44-9882-5be4a51a0de4', name:'Maulbeast Cavalry', points:280, roles:['Cavalry'], tags:['Gutbusters'] },
  { id:'528e48b0-9304-402c-b485-9a102aa35b66', name:'Maulbeast Raiders', points:210, roles:['Cavalry'], tags:['Beastclaw'] },
  { id:'4abcb00a-b60e-4769-9c68-05d8cfc8e01a', name:'Frostlord on Stonehorn', points:340, roles:['Hero','Monster'], tags:['Beastclaw'] },
  { id:'5cbccfe1-4174-4149-b170-8d7590ea4695', name:'Frostlord on Thundertusk', points:280, roles:['Hero','Monster'], tags:['Beastclaw'] },
  { id:'a7a95d39-4cd6-40f5-88a6-99abe22a0241', name:'Huskard on Stonehorn', points:300, roles:['Hero','Monster','Priest'], tags:['Beastclaw'] },
  { id:'2cb54b6b-ba74-4217-8cd5-549edb3acaa9', name:'Huskard on Thundertusk', points:280, roles:['Hero','Monster','Priest'], tags:['Beastclaw'] },
  { id:'2efc432e-39e5-4a0e-a0a6-6d542bd2d87e', name:'Great Mawpot', points:20, roles:['Faction Terrain'], tags:[] }
]

export const catalogById = Object.fromEntries(ogorCatalog.map(unit => [unit.id, unit]))
