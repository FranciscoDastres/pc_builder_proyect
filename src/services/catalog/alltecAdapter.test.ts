import { describe, expect, it } from 'vitest'
import type { AlltecApiProduct } from './alltecAdapter'
import {
  mapAlltecCategoryToSlot,
  normalizeAlltecProduct,
  revalidateAlltecPriceStock,
} from './alltecAdapter'

describe('alltec catalog adapter', () => {
  it('maps known Alltec categories to builder slots', () => {
    expect(mapAlltecCategoryToSlot('Gabinetes')).toBe('case')
    expect(mapAlltecCategoryToSlot('Fuentes de Poder')).toBe('psu')
    expect(mapAlltecCategoryToSlot('Placas Madre Para AMD')).toBe('motherboard')
    expect(mapAlltecCategoryToSlot('Procesadores Intel')).toBe('cpu')
    expect(mapAlltecCategoryToSlot('Water Cooling')).toBe('cooler')
    expect(mapAlltecCategoryToSlot('Memorias DDR5')).toBe('ram')
    expect(mapAlltecCategoryToSlot('SSD NVMe')).toBe('storage')
    expect(mapAlltecCategoryToSlot('Tarjetas de Video NVIDIA')).toBe('gpu')
    expect(mapAlltecCategoryToSlot('Cables')).toBeNull()
  })

  it('normalizes a structured API CPU product as ready', () => {
    const raw: AlltecApiProduct = {
      id: 2200,
      sku: 'CPU-2200',
      name: 'AMD Ryzen 5 8600G',
      brand: 'AMD',
      category: 'Procesadores AMD',
      price: '181.900',
      stock: '4',
      imageUrl: 'https://alltec.example/cpu.jpg',
      url: 'https://alltec.example/cpu',
      description: 'CPU AM5',
      specs: {
        socket: 'AM5',
        cores: 6,
        threads: 12,
        baseClock: 4.3,
        boostClock: 5,
        tdp: 65,
      },
    }

    const result = normalizeAlltecProduct(raw)

    expect(result.issues).toEqual([])
    expect(result.product).toEqual(expect.objectContaining({
      id: 'alltec-2200',
      externalId: '2200',
      sku: 'CPU-2200',
      slot: 'cpu',
      price: 181900,
      stock: 4,
      dataQuality: 'ready',
      socket: 'AM5',
      tdp: 65,
    }))
  })

  it('marks products with missing critical specs for review', () => {
    const result = normalizeAlltecProduct({
      id: 'gpu-1',
      name: 'NVIDIA RTX demo',
      category: 'Tarjetas de Video',
      price: 399000,
      stock: 1,
      imageUrl: 'https://alltec.example/gpu.jpg',
      url: 'https://alltec.example/gpu',
      specs: {
        vram: 8,
      },
    })

    expect(result.product).toEqual(expect.objectContaining({
      slot: 'gpu',
      dataQuality: 'review_required',
      reviewSeverity: 'critical',
    }))
    expect(result.issues).toContain('falta spec length')
  })

  it('detects price and stock changes during revalidation', () => {
    const normalized = normalizeAlltecProduct({
      id: 'psu-1',
      name: 'Fuente 650W',
      category: 'Fuentes de Poder',
      price: 80000,
      stock: 3,
      imageUrl: 'https://alltec.example/psu.jpg',
      url: 'https://alltec.example/psu',
      specs: {
        wattage: 650,
      },
    }).product

    expect(normalized).not.toBeNull()

    const [result] = revalidateAlltecPriceStock(
      [{ id: 'alltec-psu-1', price: 75000, stock: 2 }],
      [normalized!],
    )

    expect(result).toEqual({
      id: 'alltec-psu-1',
      priceChanged: true,
      stockChanged: true,
      currentPrice: 80000,
      currentStock: 3,
    })
  })
})
