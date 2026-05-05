import type { Product } from '../../../types'
import { rams as localMockRams } from '../../../data/products'
import type { CatalogPage, ProductCatalogProvider, QuoteRevalidationResult } from '../types'

export function createAlltecFixtureCatalogProvider(url = '/data/alltec-products.json'): ProductCatalogProvider {
  const fallbackDdr5Rams = localMockRams.filter(ram => ram.type === 'DDR5')

  async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(url, { cache: 'no-cache' })
    if (!response.ok) throw new Error(`No se pudo cargar fixture Alltec (${response.status})`)
    const data = await response.json()
    if (!Array.isArray(data)) throw new Error('Fixture Alltec invalido')
    return data as Product[]
  }

  return {
    async listProducts(query): Promise<CatalogPage> {
      const products = await fetchProducts()
      const productsWithFallback = [...products, ...fallbackDdr5Rams]
      const term = query?.search?.trim().toLowerCase()

      return {
        products: term
          ? productsWithFallback.filter(product =>
            product.name.toLowerCase().includes(term) ||
            product.brand.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term),
          )
          : productsWithFallback,
        source: 'alltec-fixture',
        fetchedAt: new Date().toISOString(),
        warnings: products.some(product => product.dataQuality && product.dataQuality !== 'ready')
          ? [
            'Fixture demo contiene specs estimadas; no usar como fuente comercial final.',
            'Se agregaron kits DDR5 desde mock local para completar builds de demo.',
          ]
          : ['Se agregaron kits DDR5 desde mock local para completar builds de demo.'],
      }
    },
    async getProduct(externalId) {
      const products = await fetchProducts()
      return products.find(product => product.externalId === externalId || product.id === externalId) ?? null
    },
    async revalidateProducts(items): Promise<QuoteRevalidationResult> {
      const products = await fetchProducts()
      const byId = new Map(products.map(product => [product.id, product]))
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
          reason: current ? undefined : 'producto no encontrado en fixture Alltec',
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
