export const FRESHNESS = Object.freeze({
  VERIFIED: 'VERIFIED',
  POSSIBLY_OUTDATED: 'POSSIBLY_OUTDATED',
  UNVERIFIED: 'UNVERIFIED'
})

export const createSourceMetadata = ({
  source,
  sourceVersion = null,
  sourceHash = null,
  importedAt,
  validatedAt = null,
  checkedAt = null,
  officialLatestAt = null,
  validationStatus = 'needs_review'
}) => ({
  source,
  sourceVersion,
  sourceHash,
  importedAt,
  validatedAt,
  checkedAt,
  officialLatestAt,
  validationStatus
})

const timestamp = value => value ? new Date(value).getTime() : null

export const assessFreshness = (metadata) => {
  if (!metadata?.checkedAt || metadata.validationStatus !== 'verified') {
    return FRESHNESS.UNVERIFIED
  }

  const officialLatest = timestamp(metadata.officialLatestAt)
  const validated = timestamp(metadata.validatedAt || metadata.importedAt)

  if (officialLatest && (!validated || officialLatest > validated)) {
    return FRESHNESS.POSSIBLY_OUTDATED
  }

  return FRESHNESS.VERIFIED
}

export const freshnessLabel = (metadata, locale = 'es') => {
  const state = assessFreshness(metadata)
  const labels = {
    es: {
      [FRESHNESS.VERIFIED]: 'Datos verificados',
      [FRESHNESS.POSSIBLY_OUTDATED]: 'Posible desactualización',
      [FRESHNESS.UNVERIFIED]: 'Actualización no verificada'
    },
    en: {
      [FRESHNESS.VERIFIED]: 'Verified data',
      [FRESHNESS.POSSIBLY_OUTDATED]: 'Possibly outdated',
      [FRESHNESS.UNVERIFIED]: 'Update not verified'
    }
  }

  return labels[locale]?.[state] || labels.en[state]
}
