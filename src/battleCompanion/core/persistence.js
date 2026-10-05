const STORAGE_KEY = 'battle-companion:v1'
const EXPORT_VERSION = 1

const emptyState = () => ({ armies: [], activeGame: null, locale: 'es' })

const getStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) return null
  return window.localStorage
}

export const loadBattleCompanion = () => {
  const storage = getStorage()
  if (!storage) return emptyState()

  try {
    const raw = storage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : emptyState()
  } catch {
    return emptyState()
  }
}

export const saveBattleCompanion = (data) => {
  const storage = getStorage()
  if (!storage) return false
  storage.setItem(STORAGE_KEY, JSON.stringify(data))
  return true
}

export const exportBattleCompanion = (state = loadBattleCompanion()) =>
  JSON.stringify({
    format: 'battle-companion',
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: state
  }, null, 2)

export const importBattleCompanion = (serialized) => {
  let payload
  try {
    payload = typeof serialized === 'string' ? JSON.parse(serialized) : serialized
  } catch {
    return { ok: false, error: 'INVALID_JSON' }
  }

  if (
    payload?.format !== 'battle-companion' ||
    payload?.version !== EXPORT_VERSION ||
    !payload?.data ||
    !Array.isArray(payload.data.armies)
  ) {
    return { ok: false, error: 'INVALID_FORMAT' }
  }

  const next = {
    armies: payload.data.armies,
    activeGame: payload.data.activeGame || null,
    locale: payload.data.locale || 'es'
  }

  saveBattleCompanion(next)
  return { ok: true, data: next }
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
