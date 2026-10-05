import {lazy, Suspense, useEffect} from 'react'
import {Route, Routes} from 'react-router-dom'
import useSwipeBack from './utilities/useSwipeBack'
import Main from './screens/Main'
import Header from './components/Header'
import BattleCompanion from './battleCompanion/BattleCompanion'

import './App.css'

const MainRules = lazy(() => import('./screens/MainRules'))
const Catalog = lazy(() => import('./screens/Catalog'))
const Army = lazy(() => import('./screens/Army'))
const Units = lazy(() => import('./screens/Units'))
const Warscroll = lazy(() => import('./screens/Warscroll'))
const ArmyInfo = lazy(() => import('./screens/ArmyInfo'))
const RegimentsOfRenownList = lazy(() => import('./screens/RegimentsOfRenownList'))
const RegimentOfRenown = lazy(() => import('./screens/RegimentOfRenown'))
const Search = lazy(() => import('./screens/Search'))
const CoreDocuments = lazy(() => import('./screens/CoreDocuments'))
const RuleSections = lazy(() => import('./screens/RuleSections'))
const RuFAQ = lazy(() => import('./screens/RuFAQ'))
const RuleChapters = lazy(() => import('./screens/RuleChapters'))
const Manifestations = lazy(() => import('./screens/Manifestations'))
const Rules = lazy(() => import('./screens/Rules'))
const Battleplan = lazy(() => import('./screens/Battleplan'))
const Tactic = lazy(() => import('./screens/Tactic'))
const Legends = lazy(() => import('./screens/Legends'))
const LegendUnits = lazy(() => import('./screens/LegendUnits'))
const Registration = lazy(() => import('./screens/Registration'))
const Keywords = lazy(() => import('./screens/Keywords'))
const Lists = lazy(() => import('./builder/Lists'))
const UserLists = lazy(() => import('./builder/UserLists'))
const ChooseGrandAlliance = lazy(() => import('./builder/ChooseGrandAlliance'))
const ChooseFaction = lazy(() => import('./builder/ChooseFaction'))
const Builder = lazy(() => import('./builder/Builder'))
const AddUnit = lazy(() => import('./builder/AddUnit'))
const ChooseEnhancement = lazy(() => import('./builder/ChooseEnhancement'))
const BuilderChooseTacticsCard = lazy(() => import('./builder/BuilderChooseTacticsCard'))
const ChooseOption = lazy(() => import('./builder/ChooseOption'))
const ChooseWeapon = lazy(() => import('./builder/ChooseWeapon'))
const Export = lazy(() => import('./builder/Export'))
const RosterInfo = lazy(() => import('./builder/RosterInfo'))
const PasteList = lazy(() => import('./builder/PasteList'))
const Calculator = lazy(() => import('./calculator/Calculator'))
const SinglePlayer = lazy(() => import('./singlePlayer/SinglePlayer'))
const ChooseBattleplan = lazy(() => import('./singlePlayer/ChooseBattleplan'))
const ChooseTactics = lazy(() => import('./singlePlayer/ChooseTactics'))
const Developer = lazy(() => import('./screens/Developer'))
const Spearhead = lazy(() => import('./spearhead/Spearhead'))
const SpearheadCatalog = lazy(() => import('./spearhead/SpearheadCatalog'))
const SpearheadArmies = lazy(() => import('./spearhead/SpearheadArmies'))
const SpearheadArmy = lazy(() => import('./spearhead/SpearheadArmy'))

const tg = window.Telegram?.WebApp

const RouteFallback = () => <div className='Chapter'>Cargando…</div>

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
    <Suspense fallback={<RouteFallback />}>
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
    </Suspense>
  </div>
}

export default App
