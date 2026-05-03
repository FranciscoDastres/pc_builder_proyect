import { describe, expect, it } from 'vitest'
import { cases, cpus, motherboards, rams } from '../../../data/products'
import { canAddProduct } from '../../../domain'
import type { Product, SelectedBuild } from '../../../types'
import { getCatalogView } from './catalogView'

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

describe('getCatalogView', () => {
  it('hides out-of-stock products by default without requiring a selected build', () => {
    const products: Product[] = [
      cases[0],
      { ...cases[1], id: 'case-out-of-stock', inStock: false, stock: 0 },
    ]

    const view = getCatalogView({
      products,
      build: emptyBuild,
      activeCategory: 'case',
      searchTerm: '',
      showOutOfStock: false,
      isCompatible: (product, slot) => canAddProduct(emptyBuild, product, slot),
    })

    expect(view.filteredBySlot.case.map(product => product.id)).toEqual([cases[0].id])
    expect(view.outOfStockCount).toBe(1)
    expect(view.hasSelectedProducts).toBe(false)
  })

  it('keeps compatible products and hides incompatible products after a build selection', () => {
    const build: SelectedBuild = {
      ...emptyBuild,
      cpu: cpus.find(cpu => cpu.socket === 'AM5') ?? cpus[0],
    }
    const compatibleBoard = motherboards.find(board => board.socket === build.cpu?.socket) ?? motherboards[0]
    const incompatibleBoard = motherboards.find(board => board.socket !== build.cpu?.socket) ?? {
      ...motherboards[0],
      id: 'forced-incompatible-board',
      socket: 'LGA1851',
    }

    const view = getCatalogView({
      products: [compatibleBoard, incompatibleBoard],
      build,
      activeCategory: 'motherboard',
      searchTerm: '',
      showOutOfStock: false,
      isCompatible: (product, slot) => canAddProduct(build, product, slot),
    })

    expect(view.filteredBySlot.motherboard.map(product => product.id)).toEqual([compatibleBoard.id])
    expect(view.hiddenBySlot.motherboard).toBe(1)
  })

  it('supports review category and search over normalized visible products', () => {
    const readyRam = {
      ...rams[0],
      sourceUrl: 'https://example.com/ready-ram',
      imageUrl: 'https://example.com/ready-ram.jpg',
      stock: 5,
      dataQuality: 'ready' as const,
      reviewReasons: undefined,
      reviewSeverity: undefined,
    }
    const reviewRam = {
      ...rams[0],
      id: 'review-ram',
      name: 'Memoria Demo Revision',
      dataQuality: 'review_required' as const,
      reviewReasons: ['capacidad estimada'],
    }

    const view = getCatalogView({
      products: [readyRam, reviewRam],
      build: emptyBuild,
      activeCategory: 'review',
      searchTerm: 'demo',
      showOutOfStock: false,
      isCompatible: (product, slot) => canAddProduct(emptyBuild, product, slot),
    })

    expect(view.reviewCount).toBe(1)
    expect(view.filteredBySlot.ram.map(product => product.id)).toEqual(['review-ram'])
    expect(view.rows.some(row => row.type === 'product' && row.product.id === 'review-ram')).toBe(true)
  })
})
