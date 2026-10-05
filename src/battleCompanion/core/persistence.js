const STORAGE_KEY = 'battle-companion:v1'

const getStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) return null
  return window.localStorage
}

export const loadBattleCompanion = () => {
  const storage = getStorage()
  if (!storage) return { armies: [], activeGame: null, locale: 'es' }

  try {
    const raw = storage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { armies: [], activeGame: null, locale: 'es' }
  } catch {
    return { armies: [], activeGame: null, locale: 'es' }
  }
}

export const saveBattleCompanion = (data) => {
  const storage = getStorage()
  if (!storage) return false
  storage.setItem(STORAGE_KEY, JSON.stringify(data))
  return true
}

export const createArmyRepository = () => {
  const getState = () => loadBattleCompanion()

  return {
    list() {
      return getState().armies || []
    },
    save(army) {
      const state = getState()
      const armies = state.armies || []
      const id = army.id || `army-${Date.now()}`
      const storedArmy = { ...army, id, updatedAt: new Date().toISOString() }
      const nextArmies = armies.some(item => item.id === id)
        ? armies.map(item => item.id === id ? storedArmy : item)
        : [...armies, storedArmy]
      saveBattleCompanion({ ...state, armies: nextArmies })
      return storedArmy
    },
    duplicate(id) {
      const source = (getState().armies || []).find(item => item.id === id)
      if (!source) return null
      return this.save({ ...source, id: undefined, name: `${source.name || source.faction} — copia` })
    },
    remove(id) {
      const state = getState()
      saveBattleCompanion({ ...state, armies: (state.armies || []).filter(item => item.id !== id) })
    }
  }
}
