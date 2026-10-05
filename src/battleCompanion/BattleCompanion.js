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
  loadBattleCompanion,
  saveBattleCompanion
} from './core/persistence'
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

  const refresh = () => setArmies(repository.list())

  const persistGame = (game) => {
    const current = loadBattleCompanion()
    saveBattleCompanion({ ...current, activeGame: game })
    setActiveGame(game)
  }

  const createArmy = (event) => {
    event.preventDefault()
    repository.save({
      name,
      faction: ogorMawtribesPilot.name,
      factionId: ogorMawtribesPilot.id,
      gameId: ogorMawtribesPilot.gameId,
      pointsLimit: Number(points) || 2000,
      points: 0,
      units: [],
      validationStatus: 'needs_review'
    })
    refresh()
  }

  const startGame = (army) => {
    persistGame(createGameState({ armyId: army.id }))
  }

  const advance = () => persistGame(nextPhase(activeGame))
  const advanceRound = () => persistGame(nextRound(activeGame))

  if (activeGame) {
    const army = armies.find(item => item.id === activeGame.armyId)
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
        <p>No hay habilidades Ogor verificadas cargadas todavía. El foundation no convierte metadatos dudosos en acciones legales.</p>
      </section>

      <section className={Styles.panel}>
        <h2>Checklist</h2>
        <p>La infraestructura de uso/reset ya está activa y cubierta por tests. Las reglas se incorporarán solo tras normalización y validación.</p>
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

    <section className={Styles.list}>
      {armies.length === 0 ? <p className={Styles.empty}>Todavía no hay ejércitos guardados.</p> : null}
      {armies.map(army => <article className={Styles.armyCard} key={army.id}>
        <div>
          <span className={Styles.eyebrow}>{army.faction}</span>
          <h2>{army.name}</h2>
          <p>{army.points || 0} / {army.pointsLimit} pts</p>
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
