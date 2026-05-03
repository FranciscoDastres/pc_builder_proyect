import type { CatalogPage, ProductCatalogProvider } from './types'

interface CacheEntry {
  expiresAt: number
  page: CatalogPage
}

export function withCatalogCache(provider: ProductCatalogProvider, ttlMs: number): ProductCatalogProvider {
  let cache: CacheEntry | null = null

  return {
    async listProducts(query) {
      if (!query && cache && cache.expiresAt > Date.now()) return cache.page

      const page = await provider.listProducts(query)
      if (!query) {
        cache = {
          expiresAt: Date.now() + ttlMs,
          page: {
            ...page,
            cacheTtlMs: ttlMs,
          },
        }
      }

      return page
    },
    getProduct(externalId) {
      return provider.getProduct(externalId)
    },
    revalidateProducts(items) {
      return provider.revalidateProducts(items)
    },
  }
}
