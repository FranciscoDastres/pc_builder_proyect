import type {
  CompatibilityIssue,
  QuoteContact,
  QuoteRequestPayload,
  QuoteRequestProductSnapshot,
  QuoteRevalidationResult,
  SelectedBuild,
} from '../types'
import { getTotalPrice, getTotalWatts, isBuildComplete, validateBuild } from './compatibility'

export interface QuoteValidationResult {
  valid: boolean
  errors: string[]
}

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

function hasEmailOrPhone(value: string): boolean {
  const normalized = value.trim()
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
  const digits = normalized.replace(/\D/g, '')
  return hasEmail || digits.length >= 8
}

export function normalizeQuoteContact(contact: QuoteContact): QuoteContact {
  return {
    name: normalize(contact.name),
    emailOrPhone: normalize(contact.emailOrPhone),
    comuna: normalize(contact.comuna),
    comment: contact.comment ? contact.comment.trim() : undefined,
  }
}

export function validateQuoteRequest(contact: QuoteContact, build: SelectedBuild): QuoteValidationResult {
  const normalizedContact = normalizeQuoteContact(contact)
  const errors: string[] = []
  const issues = validateBuild(build)

  if (!normalizedContact.name) errors.push('Ingresa tu nombre.')
  if (!hasEmailOrPhone(normalizedContact.emailOrPhone)) errors.push('Ingresa un email valido o un telefono de al menos 8 digitos.')
  if (!normalizedContact.comuna) errors.push('Ingresa tu comuna.')
  if (!isBuildComplete(build)) errors.push('Completa todos los componentes antes de solicitar el armado.')
  if (issues.some(issue => issue.severity === 'error')) errors.push('Corrige las incompatibilidades bloqueantes antes de enviar.')
  if (Object.values(build).some(product => product && !product.inStock)) errors.push('Hay productos sin stock en la build.')

  return {
    valid: errors.length === 0,
    errors,
  }
}

function snapshotBuild(build: SelectedBuild): QuoteRequestProductSnapshot[] {
  return Object.values(build)
    .filter(Boolean)
    .map(product => ({
      id: product.id,
      externalId: product.externalId,
      sku: product.sku,
      slot: product.slot,
      name: product.name,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      inStock: product.inStock,
      sourceUrl: product.sourceUrl,
      dataQuality: product.dataQuality,
      reviewReasons: product.reviewReasons,
    }))
}

function snapshotBuildBySlot(build: SelectedBuild): QuoteRequestPayload['build'] {
  return snapshotBuild(build).reduce<QuoteRequestPayload['build']>((acc, product) => {
    acc[product.slot] = product
    return acc
  }, {})
}

export function createQuoteRequestPayload(
  contact: QuoteContact,
  build: SelectedBuild,
  issues: CompatibilityIssue[],
  catalogSource: QuoteRequestPayload['catalogSource'],
  now = new Date(),
  revalidation?: QuoteRevalidationResult,
): QuoteRequestPayload {
  return {
    id: `mock-${now.getTime()}`,
    createdAt: now.toISOString(),
    status: 'mock_submitted',
    mock: true,
    contact: normalizeQuoteContact(contact),
    build: snapshotBuildBySlot(build),
    products: snapshotBuild(build),
    totals: {
      price: getTotalPrice(build),
      watts: getTotalWatts(build),
    },
    validation: {
      isComplete: isBuildComplete(build),
      issues,
      revalidation,
    },
    catalogSource,
  }
}
