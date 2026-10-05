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

test('does not infer legal abilities from structural unit data', () => {
  expect(ogorMawtribesPilot.abilities).toEqual([])
})

test('special Scourge variants remain review-required', () => {
  const scourge = ogorMawtribesPilot.units.filter(unit => /^Scourge of /.test(unit.name))
  expect(scourge.length).toBeGreaterThan(0)
  expect(scourge.every(unit => unit.validationStatus === 'needs_review')).toBe(true)
})
