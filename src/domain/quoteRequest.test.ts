import { describe, expect, it } from 'vitest'
import { cases, coolers, cpus, gpus, motherboards, psus, rams, storages } from '../data/products'
import type { QuoteContact, SelectedBuild } from '../types'
import { createQuoteRequestPayload, validateQuoteRequest } from './quoteRequest'

const completeBuild: SelectedBuild = {
  case: cases[0],
  cpu: cpus[0],
  motherboard: motherboards[0],
  ram: rams[0],
  gpu: gpus[3],
  psu: psus[0],
  storage: storages[0],
  cooler: coolers[1],
}

const validContact: QuoteContact = {
  name: '  Maria Perez  ',
  emailOrPhone: 'maria@example.com',
  comuna: ' Santiago Centro ',
  comment: ' Quiero confirmar disponibilidad. ',
}

describe('quote request domain', () => {
  it('validates contact and a complete compatible build', () => {
    expect(validateQuoteRequest(validContact, completeBuild)).toEqual({
      valid: true,
      errors: [],
    })
  })

  it('rejects incomplete contact and incomplete build', () => {
    const result = validateQuoteRequest(
      { name: '', emailOrPhone: '1234', comuna: '' },
      { ...completeBuild, gpu: null },
    )

    expect(result.valid).toBe(false)
    expect(result.errors).toEqual([
      'Ingresa tu nombre.',
      'Ingresa un email valido o un telefono de al menos 8 digitos.',
      'Ingresa tu comuna.',
      'Completa todos los componentes antes de solicitar el armado.',
    ])
  })

  it('creates a mock payload with product, price and stock snapshot', () => {
    const payload = createQuoteRequestPayload(validContact, completeBuild, [], 'alltec-fixture', new Date('2026-05-02T12:00:00.000Z'))

    expect(payload).toEqual(expect.objectContaining({
      id: 'mock-1777723200000',
      createdAt: '2026-05-02T12:00:00.000Z',
      status: 'mock_submitted',
      mock: true,
      catalogSource: 'alltec-fixture',
      totals: {
        price: expect.any(Number),
        watts: expect.any(Number),
      },
      validation: {
        isComplete: true,
        issues: [],
        revalidation: undefined,
      },
    }))
    expect(payload.contact).toEqual({
      name: 'Maria Perez',
      emailOrPhone: 'maria@example.com',
      comuna: 'Santiago Centro',
      comment: 'Quiero confirmar disponibilidad.',
    })
    expect(payload.products).toHaveLength(8)
    expect(payload.build.case).toEqual(expect.objectContaining({
      id: cases[0].id,
      slot: 'case',
    }))
    expect(payload.products[0]).toEqual(expect.objectContaining({
      id: cases[0].id,
      slot: 'case',
      price: cases[0].price,
      inStock: cases[0].inStock,
    }))
  })
})
