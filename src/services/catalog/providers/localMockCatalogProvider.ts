import { allProducts } from '../../../data/products'
import type { Product } from '../../../types'
import type { CatalogPage, ProductCatalogProvider, QuoteRevalidationResult } from '../types'

function filterProducts(products: Product[], search?: string): Product[] {
  if (!search) return products
  const term = search.trim().toLowerCase()
  return products.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.brand.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term),
  )
}

export function createLocalMockCatalogProvider(): ProductCatalogProvider {
  return {
    async listProducts(query): Promise<CatalogPage> {
      return {
        products: filterProducts(allProducts, query?.search),
        source: 'local-mock',
        fetchedAt: new Date().toISOString(),
      }
    },
    async getProduct(externalId) {
      return allProducts.find(product => product.externalId === externalId || product.id === externalId) ?? null
    },
    async revalidateProducts(items): Promise<QuoteRevalidationResult> {
      const byId = new Map(allProducts.map(product => [product.id, product]))
      const checkedAt = new Date().toISOString()
      const results = items.map(item => {
        const current = byId.get(item.id)

        return {
          id: item.id,
          externalId: item.externalId,
          sku: item.sku,
          available: Boolean(current?.inStock),
          currentPrice: current?.price,
          currentStock: current?.stock,
          priceChanged: Boolean(current && current.price !== item.priceSnapshot),
          stockChanged: Boolean(current && current.stock !== item.stockSnapshot),
          reason: current ? undefined : 'producto no encontrado en catálogo local',
        }
      })

      return {
        ok: results.every(item => item.available && !item.priceChanged && !item.stockChanged),
        checkedAt,
        items: results,
      }
    },
  }
}
