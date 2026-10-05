import {useEffect} from 'react'
import {Route, Routes} from 'react-router-dom'
import useSwipeBack from './utilities/useSwipeBack'
import Main from './screens/Main'
import MainRules from './screens/MainRules'
import Catalog from './screens/Catalog'
import Army from './screens/Army'
import Units from './screens/Units'
import Warscroll from './screens/Warscroll'
import ArmyInfo from './screens/ArmyInfo'
import RegimentsOfRenownList from './screens/RegimentsOfRenownList'
import RegimentOfRenown from './screens/RegimentOfRenown'
import Search from './screens/Search'
import CoreDocuments from './screens/CoreDocuments'
import RuleSections from './screens/RuleSections'
import RuFAQ from './screens/RuFAQ'
import RuleChapters from './screens/RuleChapters'
import Manifestations from './screens/Manifestations'
import Rules from './screens/Rules'
import Battleplan from './screens/Battleplan'
import Tactic from './screens/Tactic'
import Legends from './screens/Legends'
import LegendUnits from './screens/LegendUnits'
import Registration from './screens/Registration'
import Keywords from './screens/Keywords'
import Header from './components/Header'
import Lists from './builder/Lists'
import UserLists from './builder/UserLists'
import ChooseGrandAlliance from './builder/ChooseGrandAlliance'
import ChooseFaction from './builder/ChooseFaction'
import Builder from './builder/Builder'
import AddUnit from './builder/AddUnit'
import ChooseEnhancement from './builder/ChooseEnhancement'
import BuilderChooseTacticsCard from './builder/BuilderChooseTacticsCard'
import ChooseOption from './builder/ChooseOption'
import ChooseWeapon from './builder/ChooseWeapon'
import Export from './builder/Export'
import RosterInfo from './builder/RosterInfo'
import PasteList from './builder/PasteList'
import Calculator from './calculator/Calculator'
import SinglePlayer from './singlePlayer/SinglePlayer'
import ChooseBattleplan from './singlePlayer/ChooseBattleplan'
import ChooseTactics from './singlePlayer/ChooseTactics'
import Developer from './screens/Developer'
import Spearhead from './spearhead/Spearhead'
import SpearheadCatalog from './spearhead/SpearheadCatalog'
import SpearheadArmies from './spearhead/SpearheadArmies'
import SpearheadArmy from './spearhead/SpearheadArmy'
import BattleCompanion from './battleCompanion/BattleCompanion'

import './App.css'

const tg = window.Telegram?.WebApp

function App() {
  useSwipeBack()

  useEffect(() => {
    if (!tg) return
    tg.ready()
    if (!tg.isExpanded) {
      tg.expand()
    }
    if (!tg.isClosingConfirmationEnabled) {
      tg.enableClosingConfirmation()
    }
  }, [])

  return <div>
    <Header />
    <Routes>
      <Route index element={<Main />} />
      <Route path={'battle-companion'} element={<BattleCompanion />} />
      <Route path={'mainRules'} element={<MainRules />} />
      <Route path={'catalog'} element={<Catalog />} />
      <Route path={'army'} element={<Army />} />
      <Route path={'armyOfRenown'} element={<Army />} />
      <Route path={'units'} element={<Units />} />
      <Route path={'warscroll'} element={<Warscroll />} />
      <Route path={'calculator'} element={<Calculator />} />
      <Route path={'armyInfo'} element={<ArmyInfo />} />
      <Route path={'builder'} element={<Builder />} />
      <Route path={'addUnit'} element={<AddUnit />} />
      <Route path={'regimentOfRenown'} element={<RegimentOfRenown />} />
      <Route path={'regimentOfRenownList'} element={<RegimentsOfRenownList />} />
      <Route path={'chooseEnhancement'} element={<ChooseEnhancement />} />
      <Route path={'builderChooseTacticsCard'} element={<BuilderChooseTacticsCard />} />
      <Route path={'chooseOption'} element={<ChooseOption />} />
      <Route path={'chooseWeapon'} element={<ChooseWeapon />} />
      <Route path={'search'} element={<Search />} />
      <Route path={'coreDocuments'} element={<CoreDocuments />} />
      <Route path={'ruFAQ'} element={<RuFAQ />} />
      <Route path={'ruleSections'} element={<RuleSections />} />
      <Route path={'ruleChapters'} element={<RuleChapters />} />
      <Route path={'rules'} element={<Rules />} />
      <Route path={'battleplan'} element={<Battleplan />} />
      <Route path={'tactic'} element={<Tactic />} />
      <Route path={'manifestations'} element={<Manifestations />} />
      <Route path={'legends'} element={<Legends />} />
      <Route path={'legendUnits'} element={<LegendUnits />} />
      <Route path={'lists'} element={<Lists />} />
      <Route path={'userLists'} element={<UserLists />} />
      <Route path={'chooseGrandAlliance'} element={<ChooseGrandAlliance />} />
      <Route path={'chooseFaction'} element={<ChooseFaction />} />
      <Route path={'export'} element={<Export />} />
      <Route path={'registration'} element={<Registration />} />
      <Route path={'keywords'} element={<Keywords />} />
      <Route path={'rosterInfo'} element={<RosterInfo />} />
      <Route path={'pasteList'} element={<PasteList />} />
      <Route path={'singlePlayer'} element={<SinglePlayer />} />
      <Route path={'chooseTactics'} element={<ChooseTactics />} />
      <Route path={'chooseBattleplan'} element={<ChooseBattleplan />} />
      <Route path={'developer'} element={<Developer />} />
      <Route path={'spearhead'} element={<Spearhead />} />
      <Route path={'spearheadCatalog'} element={<SpearheadCatalog />} />
      <Route path={'SpearheadArmies'} element={<SpearheadArmies />} />
      <Route path={'spearheadArmy'} element={<SpearheadArmy />} />
    </Routes>
  </div>
}

export default App