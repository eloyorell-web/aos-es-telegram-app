import React, { useMemo, useState } from 'react'
import {
  PHASES,
  TURN,
  createGameState,
  nextRound,
  setActivePlayer,
  setPhase
} from './core/gameState'
import {
  createArmyRepository,
  exportBattleCompanion,
  importBattleCompanion,
  loadBattleCompanion,
  saveBattleCompanion
} from './core/persistence'
import {
  createArmy as createArmyModel,
  getArmyPoints
} from './core/army'
import { buildBattleAssistant } from './core/battleAssistant'
import { ogorMawtribesPilot } from './data/ogorMawtribes'
import Styles from './BattleCompanion.module.css'

const nextPhase = (state) => {
  const index = PHASES.indexOf(state.phase)
  if (index < PHASES.length - 1) return setPhase(state, PHASES[index + 1])
  return setActivePlayer(
    state,
    state.activePlayer === TURN.YOUR ? TURN.OPPONENT : TURN.YOUR
  )
}

const BattleCompanion = () => {
  const repository = useMemo(() => createArmyRepository(), [])
  const persisted = loadBattleCompanion()
  const [armies, setArmies] = useState(repository.list())
  const [activeGame, setActiveGame] = useState(persisted.activeGame)
  const [name, setName] = useState('Mi ejército Ogor')
  const [points, setPoints] = useState(2000)
  const [backupMessage, setBackupMessage] = useState('')

  const refresh = () => setArmies(repository.list())

  const persistGame = (game) => {
    const current = loadBattleCompanion()
    saveBattleCompanion({ ...current, activeGame: game })
    setActiveGame(game)
  }

  const createArmy = (event) => {
    event.preventDefault()
    repository.save(createArmyModel({
      name,
      faction: ogorMawtribesPilot.name,
      factionId: ogorMawtribesPilot.id,
      gameId: ogorMawtribesPilot.gameId,
      pointsLimit: Number(points) || 2000
    }))
    refresh()
  }

  const startGame = (army) => {
    persistGame(createGameState({ armyId: army.id }))
  }

  const exportBackup = () => {
    const blob = new Blob([exportBattleCompanion()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'battle-companion-backup.json'
    anchor.click()
    URL.revokeObjectURL(url)
    setBackupMessage('Copia exportada.')
  }

  const importBackup = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const result = importBattleCompanion(await file.text())
    if (!result.ok) {
      setBackupMessage('No se ha podido importar: archivo no válido o versión incompatible.')
      event.target.value = ''
      return
    }

    setArmies(result.data.armies)
    setActiveGame(result.data.activeGame)
    setBackupMessage('Copia importada correctamente.')
    event.target.value = ''
  }

  const advance = () => persistGame(nextPhase(activeGame))
  const advanceRound = () => persistGame(nextRound(activeGame))

  if (activeGame) {
    const army = armies.find(item => item.id === activeGame.armyId)
    const assistant = buildBattleAssistant(
      ogorMawtribesPilot.abilities,
      activeGame
    )

    return <main className={Styles.shell}>
      <header className={Styles.header}>
        <span className={Styles.eyebrow}>BATTLE COMPANION</span>
        <h1>{army?.name || 'Partida activa'}</h1>
        <p>{army?.faction || ogorMawtribesPilot.name}</p>
      </header>

      <section className={Styles.statusGrid}>
        <div><span>Ronda</span><strong>{activeGame.round}</strong></div>
        <div><span>Turno</span><strong>{activeGame.activePlayer === TURN.YOUR ? 'Mi turno' : 'Turno rival'}</strong></div>
        <div><span>Fase</span><strong>{activeGame.phase}</strong></div>
      </section>

      <section className={Styles.panel}>
        <h2>Ahora</h2>
        {assistant.available.length
          ? assistant.available.map(item => <p key={item.ability.abilityId}>🟢 {item.ability.name}</p>)
          : <p>No hay acciones verificadas disponibles para esta fase.</p>
        }
      </section>

      <section className={Styles.panel}>
        <h2>Recuerda</h2>
        {assistant.reminders.length
          ? assistant.reminders.map(item => <p key={item.ability.abilityId}>⚠️ {item.ability.name}</p>)
          : <p>No hay recordatorios verificados para esta fase.</p>
        }
      </section>

      <section className={Styles.panel}>
        <h2>Condicional</h2>
        {assistant.conditional.length
          ? assistant.conditional.map(item => <p key={item.ability.abilityId}>🟠 {item.ability.name}: {item.evaluation.reason}</p>)
          : <p>No hay acciones condicionales verificadas para esta fase.</p>
        }
        {assistant.needsReview.length
          ? <p>{assistant.needsReview.length} regla(s) requieren revisión antes de poder mostrarse como legales.</p>
          : null
        }
      </section>

      <div className={Styles.actions}>
        <button onClick={advance}>Siguiente fase</button>
        <button className={Styles.secondary} onClick={advanceRound}>Siguiente ronda</button>
        <button className={Styles.ghost} onClick={() => persistGame(null)}>Cerrar partida</button>
      </div>
    </main>
  }

  return <main className={Styles.shell}>
    <header className={Styles.header}>
      <span className={Styles.eyebrow}>BATTLE COMPANION</span>
      <h1>Mis ejércitos</h1>
      <p>Foundation · Age of Sigmar · piloto Ogor Mawtribes</p>
    </header>

    <form className={Styles.panel} onSubmit={createArmy}>
      <h2>Nuevo ejército</h2>
      <label>
        Nombre
        <input value={name} onChange={event => setName(event.target.value)} />
      </label>
      <label>
        Límite de puntos
        <input type="number" min="500" step="250" value={points} onChange={event => setPoints(event.target.value)} />
      </label>
      <button type="submit">Guardar ejército</button>
    </form>

    <section className={Styles.panel}>
      <h2>Copia de seguridad</h2>
      <p>Exporta ejércitos, idioma y partida activa a un JSON versionado.</p>
      <div className={Styles.cardActions}>
        <button type="button" className={Styles.secondary} onClick={exportBackup}>Exportar JSON</button>
        <label className={Styles.fileButton}>
          Importar JSON
          <input type="file" accept="application/json,.json" onChange={importBackup} />
        </label>
      </div>
      {backupMessage ? <p>{backupMessage}</p> : null}
    </section>

    <section className={Styles.list}>
      {armies.length === 0 ? <p className={Styles.empty}>Todavía no hay ejércitos guardados.</p> : null}
      {armies.map(army => <article className={Styles.armyCard} key={army.id}>
        <div>
          <span className={Styles.eyebrow}>{army.faction}</span>
          <h2>{army.name}</h2>
          <p>{getArmyPoints(army)} / {army.pointsLimit} pts</p>
        </div>
        <div className={Styles.cardActions}>
          <button onClick={() => startGame(army)}>Iniciar partida</button>
          <button className={Styles.secondary} onClick={() => { repository.duplicate(army.id); refresh() }}>Duplicar</button>
          <button className={Styles.ghost} onClick={() => { repository.remove(army.id); refresh() }}>Eliminar</button>
        </div>
      </article>)}
    </section>
  </main>
}

export default BattleCompanion
