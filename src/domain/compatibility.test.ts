import { describe, expect, it } from 'vitest'
import {
  canAddProduct,
  getTotalPrice,
  getTotalWatts,
  isBuildComplete,
  validateBuild,
} from './compatibility'
import {
  cases,
  coolers,
  cpus,
  gpus,
  motherboards,
  psus,
  rams,
  storages,
} from '../data/products'
import type { GPUProduct, RAMProduct, SelectedBuild } from '../types'

const emptyBuild: SelectedBuild = {
  case: null,
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  psu: null,
  storage: null,
  cooler: null,
}

const completeValidBuild: SelectedBuild = {
  case: cases[0],
  cpu: cpus[0],
  motherboard: motherboards[0],
  ram: rams[0],
  gpu: gpus[3],
  psu: psus[0],
  storage: storages[0],
  cooler: coolers[1],
}

describe('compatibility domain', () => {
  it('does not report issues for a compatible complete build', () => {
    expect(validateBuild(completeValidBuild)).toEqual([])
    expect(isBuildComplete(completeValidBuild)).toBe(true)
  })

  it('reports CPU and motherboard socket mismatch', () => {
    const issues = validateBuild({
      ...emptyBuild,
      cpu: cpus[0],
      motherboard: motherboards[3],
    })

    expect(issues).toEqual([
      expect.objectContaining({
        slot: 'motherboard',
        severity: 'error',
      }),
    ])
  })

  it('reports RAM type mismatch with selected motherboard', () => {
    const issues = validateBuild({
      ...emptyBuild,
      motherboard: motherboards[0],
      ram: rams[4],
    })

    expect(issues).toEqual([
      expect.objectContaining({
        slot: 'ram',
        severity: 'error',
      }),
    ])
  })

  it('reports GPU length overflow against selected case', () => {
    const issues = validateBuild({
      ...emptyBuild,
      case: cases[4],
      gpu: gpus[0],
    })

    expect(issues).toEqual([
      expect.objectContaining({
        slot: 'gpu',
        severity: 'error',
      }),
    ])
  })

  it('reports AIO cooler size overflow against selected case', () => {
    const issues = validateBuild({
      ...emptyBuild,
      case: cases[4],
      cooler: coolers[1],
    })

    expect(issues).toEqual([
      expect.objectContaining({
        slot: 'cooler',
        severity: 'error',
      }),
    ])
  })

  it('reports cooler socket incompatibility', () => {
    const issues = validateBuild({
      ...emptyBuild,
      cpu: cpus[0],
      cooler: { ...coolers[1], compatibleSockets: ['LGA1851'] },
    })

    expect(issues).toEqual([
      expect.objectContaining({
        slot: 'cooler',
        severity: 'error',
      }),
    ])
  })

  it('reports RAM module overflow and RAM capacity warning', () => {
    const oversizedRam: RAMProduct = {
      ...rams[0],
      modules: 4,
      capacity: 128,
    }
    const issues = validateBuild({
      ...emptyBuild,
      motherboard: motherboards[2],
      ram: oversizedRam,
    })

    expect(issues).toEqual([
      expect.objectContaining({
        slot: 'ram',
        severity: 'error',
      }),
      expect.objectContaining({
        slot: 'ram',
        severity: 'warning',
      }),
    ])
  })

  it('reports insufficient PSU wattage', () => {
    const issues = validateBuild({
      ...completeValidBuild,
      psu: { ...psus[4], wattage: 300 },
    })

    expect(issues).toEqual([
      expect.objectContaining({
        slot: 'psu',
        severity: 'error',
      }),
    ])
  })

  it('marks products with missing critical specs for review', () => {
    const incompleteGpu = { ...gpus[0], length: undefined } as unknown as GPUProduct
    const issues = validateBuild({
      ...emptyBuild,
      gpu: incompleteGpu,
    })

    expect(issues).toEqual([
      expect.objectContaining({
        slot: 'gpu',
        severity: 'review',
      }),
    ])
  })

  it('checks whether a candidate can be added to a slot', () => {
    expect(canAddProduct({ ...emptyBuild, cpu: cpus[0] }, motherboards[0], 'motherboard')).toBe(true)
    expect(canAddProduct({ ...emptyBuild, cpu: cpus[0] }, motherboards[3], 'motherboard')).toBe(false)
    expect(canAddProduct(emptyBuild, cpus[0], 'gpu')).toBe(false)
  })

  it('calculates build totals', () => {
    const selectedProducts = Object.values(completeValidBuild).filter(Boolean)
    const expectedWatts = selectedProducts.reduce((sum, product) => sum + product.powerDraw, 0)
    const expectedPrice = selectedProducts.reduce((sum, product) => sum + product.price, 0)

    expect(getTotalWatts(completeValidBuild)).toBe(expectedWatts)
    expect(getTotalPrice(completeValidBuild)).toBe(expectedPrice)
  })
})
