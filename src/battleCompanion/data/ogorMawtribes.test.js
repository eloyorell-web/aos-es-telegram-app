import { ogorMawtribesPilot } from './ogorMawtribes'

test('uses the real upstream faction id', () => {
  expect(ogorMawtribesPilot.id).toBe('08135df6-633c-4d58-9adb-7d4b8563b0da')
})

test('contains a compact structural unit subset', () => {
  expect(ogorMawtribesPilot.units.length).toBeGreaterThan(0)
  expect(ogorMawtribesPilot.units.every(unit => unit.points != null)).toBe(true)
})

test('keeps upstream ids unique in the normalized subset', () => {
  const ids = ogorMawtribesPilot.units.map(unit => unit.id)
  expect(new Set(ids).size).toBe(ids.length)
})

test('loads rule cards from the existing upstream database', () => {
  expect(ogorMawtribesPilot.abilities.length).toBeGreaterThan(0)
  expect(ogorMawtribesPilot.abilities.some(rule => rule.name === 'Feast of Bloodshed')).toBe(true)
})

test('upstream rules preserve timing metadata for the phase assistant', () => {
  const feast = ogorMawtribesPilot.abilities.find(rule => rule.name === 'Feast of Bloodshed')
  expect(feast.phase).toBe('END')
  expect(feast.frequency).toBe('ONCE_PER_TURN')
  expect(feast.cardColor).toBe('purple')
})

test('special Scourge variants remain review-required', () => {
  const scourge = ogorMawtribesPilot.units.filter(unit => /^Scourge of /.test(unit.name))
  expect(scourge.length).toBeGreaterThan(0)
  expect(scourge.every(unit => unit.validationStatus === 'needs_review')).toBe(true)
})
