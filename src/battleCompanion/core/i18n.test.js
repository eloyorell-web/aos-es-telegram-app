import {
  createTranslationRecord,
  translate
} from './i18n'

test('Spanish is the primary UI language', () => {
  expect(translate('myArmies')).toBe('Mis ejércitos')
})

test('English is available as fallback locale', () => {
  expect(translate('myArmies', 'en')).toBe('My armies')
})

test('unknown keys remain visible instead of disappearing', () => {
  expect(translate('missing.key')).toBe('missing.key')
})

test('translation becomes outdated when upstream original hash changes', () => {
  const record = createTranslationRecord({
    entityId: 'ability-1',
    original: 'Old text',
    translated: 'Texto',
    originalHash: 'new-hash',
    translatedFromHash: 'old-hash',
    status: 'verified'
  })

  expect(record.status).toBe('outdated')
})
