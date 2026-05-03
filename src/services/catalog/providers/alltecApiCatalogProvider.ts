import { normalizeAlltecCatalog, normalizeAlltecProduct, type AlltecApiProduct } from '../alltecAdapter'
import type { CatalogPage, ProductCatalogProvider, QuoteRevalidationResult } from '../types'

export function createAlltecApiCatalogProvider(endpoint: string): ProductCatalogProvider {
  async function fetchRawProducts(): Promise<AlltecApiProduct[]> {
    const response = await fetch(endpoint, { cache: 'no-cache' })
    if (!response.ok) throw new Error(`API Alltec respondio ${response.status}`)
    const data = await response.json()
    if (!Array.isArray(data)) throw new Error('API Alltec debe retornar un arreglo de productos')
    return data as AlltecApiProduct[]
  }

  return {
    async listProducts(query): Promise<CatalogPage> {
      const rawProducts = await fetchRawProducts()
      const products = normalizeAlltecCatalog(rawProducts)
      const term = query?.search?.trim().toLowerCase()

      return {
        products: term
          ? products.filter(product =>
            product.name.toLowerCase().includes(term) ||
            product.brand.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term),
          )
          : products,
        source: 'alltec-api',
        fetchedAt: new Date().toISOString(),
        warnings: products.some(product => product.dataQuality !== 'ready')
          ? ['API Alltec contiene productos con specs incompletas o pendientes de revisión.']
          : undefined,
      }
    },
    async getProduct(externalId) {
      const rawProducts = await fetchRawProducts()
      const rawProduct = rawProducts.find(product => String(product.id) === externalId || product.sku === externalId)
      return rawProduct ? normalizeAlltecProduct(rawProduct).product : null
    },
    async revalidateProducts(items): Promise<QuoteRevalidationResult> {
      const rawProducts = await fetchRawProducts()
      const currentProducts = normalizeAlltecCatalog(rawProducts)
      const byId = new Map(currentProducts.map(product => [product.id, product]))
      const checkedAt = new Date().toISOString()
      const results = items.map(item => {
        const current = byId.get(item.id) ??
          currentProducts.find(product => product.externalId === item.externalId || product.sku === item.sku)

        return {
          id: item.id,
          externalId: item.externalId,
          sku: item.sku,
          available: Boolean(current?.inStock),
          currentPrice: current?.price,
          currentStock: current?.stock,
          priceChanged: Boolean(current && current.price !== item.priceSnapshot),
          stockChanged: Boolean(current && current.stock !== item.stockSnapshot),
          reason: current ? undefined : 'producto no encontrado en API Alltec',
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
