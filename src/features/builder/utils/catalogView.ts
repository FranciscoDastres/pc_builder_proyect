import { slotOrder } from '../../../data/products'
import { getProductsForReview } from '../../../domain'
import type { ComponentSlot, Product, SelectedBuild } from '../../../types'

export type ActiveCatalogCategory = ComponentSlot | 'all' | 'review'

export type CatalogRow =
  | { type: 'header'; slot: ComponentSlot; count: number; reviewCount: number }
  | { type: 'product'; product: Product; reasons?: string[] }

export interface CatalogViewInput {
  products: Product[]
  build: SelectedBuild
  activeCategory: ActiveCatalogCategory
  searchTerm: string
  showOutOfStock: boolean
  isCompatible: (product: Product, slot: ComponentSlot) => boolean
}

export interface CatalogView {
  rows: CatalogRow[]
  visibleSlots: readonly ComponentSlot[]
  filteredBySlot: Record<string, Product[]>
  hiddenBySlot: Record<string, number>
  outOfStockBySlot: Record<string, number>
  outOfStockCount: number
  hasVisibleProducts: boolean
  hasSelectedProducts: boolean
  reviewCount: number
  reviewCountBySlot: Record<string, number>
  reviewReasonsById: Map<string, string[]>
}

function groupProductsBySlot(products: Product[]): Record<string, Product[]> {
  const grouped = slotOrder.reduce<Record<string, Product[]>>((acc, slot) => {
    acc[slot] = []
    return acc
  }, {})

  for (const product of products) {
    grouped[product.slot]?.push(product)
  }

  return grouped
}

export function getCatalogView({
  products,
  build,
  activeCategory,
  searchTerm,
  showOutOfStock,
  isCompatible,
}: CatalogViewInput): CatalogView {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const hasSelectedProducts = Object.values(build).some(Boolean)
  const reviews = getProductsForReview(products)
  const reviewReasonsById = new Map(reviews.map(review => [review.product.id, review.reasons]))
  const reviewCountBySlot = reviews.reduce<Record<string, number>>((acc, review) => {
    acc[review.product.slot] = (acc[review.product.slot] ?? 0) + 1
    return acc
  }, {})
  const grouped = groupProductsBySlot(products)
  const visibleSlots: readonly ComponentSlot[] = activeCategory === 'all' || activeCategory === 'review'
    ? slotOrder as readonly ComponentSlot[]
    : [activeCategory]

  const filteredBySlot = visibleSlots.reduce<Record<string, Product[]>>((acc, slot) => {
    const slotProducts = showOutOfStock
      ? grouped[slot] ?? []
      : (grouped[slot] ?? []).filter(product => product.inStock)
    const reviewFilteredProducts = activeCategory === 'review'
      ? slotProducts.filter(product => reviewReasonsById.has(product.id))
      : slotProducts
    const compatibleProducts = hasSelectedProducts
      ? reviewFilteredProducts.filter(product =>
        build[product.slot as ComponentSlot]?.id === product.id ||
        isCompatible(product, product.slot as ComponentSlot)
      )
      : reviewFilteredProducts

    acc[slot] = normalizedSearch
      ? compatibleProducts.filter(product =>
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.brand.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch)
      )
      : compatibleProducts
    return acc
  }, {})

  const hiddenBySlot = hasSelectedProducts
    ? visibleSlots.reduce<Record<string, number>>((acc, slot) => {
      const sourceProducts = activeCategory === 'review'
        ? (grouped[slot] ?? []).filter(product => (showOutOfStock || product.inStock) && reviewReasonsById.has(product.id))
        : (showOutOfStock ? grouped[slot] ?? [] : (grouped[slot] ?? []).filter(product => product.inStock))
      const visibleProducts = filteredBySlot[slot] ?? []
      acc[slot] = Math.max(0, sourceProducts.length - visibleProducts.length)
      return acc
    }, {})
    : {}

  const outOfStockBySlot = visibleSlots.reduce<Record<string, number>>((acc, slot) => {
    acc[slot] = (grouped[slot] ?? []).filter(product => !product.inStock).length
    return acc
  }, {})
  const outOfStockCount = Object.values(outOfStockBySlot).reduce((sum, count) => sum + count, 0)
  const hasVisibleProducts = visibleSlots.some(slot => filteredBySlot[slot]?.length > 0)
  const rows = visibleSlots.flatMap(slot => {
    const items = filteredBySlot[slot] ?? []
    if (!items.length) return []
    return [
      {
        type: 'header' as const,
        slot: slot as ComponentSlot,
        count: items.length,
        reviewCount: reviewCountBySlot[slot] ?? 0,
      },
      ...items.map(product => ({
        type: 'product' as const,
        product,
        reasons: reviewReasonsById.get(product.id),
      })),
    ]
  })

  return {
    rows,
    visibleSlots,
    filteredBySlot,
    hiddenBySlot,
    outOfStockBySlot,
    outOfStockCount,
    hasVisibleProducts,
    hasSelectedProducts,
    reviewCount: reviews.length,
    reviewCountBySlot,
    reviewReasonsById,
  }
}
