import { describe, expect, it } from 'vitest'
import { cases, cpus, gpus, motherboards, rams } from '../../../data/products'
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
      cpuPlatformFilter: 'all',
      gpuBrandFilter: 'nvidia',
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
      cpuPlatformFilter: 'all',
      gpuBrandFilter: 'nvidia',
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
      cpuPlatformFilter: 'all',
      gpuBrandFilter: 'nvidia',
      searchTerm: 'demo',
      showOutOfStock: false,
      isCompatible: (product, slot) => canAddProduct(emptyBuild, product, slot),
    })

    expect(view.reviewCount).toBe(1)
    expect(view.filteredBySlot.ram.map(product => product.id)).toEqual(['review-ram'])
    expect(view.rows.some(row => row.type === 'product' && row.product.id === 'review-ram')).toBe(true)
  })

  it('filters cpu and motherboard by Intel/AMD platform and socket', () => {
    const intelCpu = cpus.find(cpu => cpu.brand === 'Intel') ?? cpus[0]
    const amdCpu = cpus.find(cpu => cpu.brand === 'AMD') ?? cpus[0]
    const intelBoard = motherboards.find(board => board.socket === intelCpu.socket) ?? motherboards[0]
    const amdBoard = motherboards.find(board => board.socket === amdCpu.socket) ?? motherboards[0]

    const amdView = getCatalogView({
      products: [intelCpu, amdCpu, intelBoard, amdBoard],
      build: emptyBuild,
      activeCategory: 'all',
      cpuPlatformFilter: 'amd',
      gpuBrandFilter: 'nvidia',
      searchTerm: '',
      showOutOfStock: true,
      isCompatible: (product, slot) => canAddProduct(emptyBuild, product, slot),
    })
    const intelView = getCatalogView({
      products: [intelCpu, amdCpu, intelBoard, amdBoard],
      build: emptyBuild,
      activeCategory: 'all',
      cpuPlatformFilter: 'intel',
      gpuBrandFilter: 'nvidia',
      searchTerm: '',
      showOutOfStock: true,
      isCompatible: (product, slot) => canAddProduct(emptyBuild, product, slot),
    })

    expect(amdView.filteredBySlot.cpu.map(product => product.id)).toEqual([amdCpu.id])
    expect(amdView.filteredBySlot.motherboard.map(product => product.id)).toEqual([amdBoard.id])
    expect(intelView.filteredBySlot.cpu.map(product => product.id)).toEqual([intelCpu.id])
    expect(intelView.filteredBySlot.motherboard.map(product => product.id)).toEqual([intelBoard.id])
  })

  it('filters gpu by AMD/NVIDIA brand', () => {
    const amdGpu = gpus.find(gpu => gpu.brand === 'AMD') ?? gpus[0]
    const nvidiaGpu = gpus.find(gpu => gpu.brand === 'NVIDIA') ?? gpus[0]

    const amdView = getCatalogView({
      products: [amdGpu, nvidiaGpu],
      build: emptyBuild,
      activeCategory: 'gpu',
      cpuPlatformFilter: 'all',
      gpuBrandFilter: 'amd',
      searchTerm: '',
      showOutOfStock: true,
      isCompatible: (product, slot) => canAddProduct(emptyBuild, product, slot),
    })
    const nvidiaView = getCatalogView({
      products: [amdGpu, nvidiaGpu],
      build: emptyBuild,
      activeCategory: 'gpu',
      cpuPlatformFilter: 'all',
      gpuBrandFilter: 'nvidia',
      searchTerm: '',
      showOutOfStock: true,
      isCompatible: (product, slot) => canAddProduct(emptyBuild, product, slot),
    })

    expect(amdView.filteredBySlot.gpu.map(product => product.id)).toEqual([amdGpu.id])
    expect(nvidiaView.filteredBySlot.gpu.map(product => product.id)).toEqual([nvidiaGpu.id])
  })
})
