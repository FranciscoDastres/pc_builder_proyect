import { withCatalogCache } from './catalogCache'
import { createAlltecApiCatalogProvider } from './providers/alltecApiCatalogProvider'
import { createAlltecFixtureCatalogProvider } from './providers/alltecFixtureCatalogProvider'
import { createLocalMockCatalogProvider } from './providers/localMockCatalogProvider'
import type {
  CatalogPage,
  CatalogSource,
  ProductCatalogProvider,
  QuoteRevalidationItem,
  QuoteRevalidationResult,
} from './types'

const CATALOG_CACHE_TTL_MS = 60_000
const ALLTEC_API_ENDPOINT = import.meta.env.VITE_ALLTEC_PRODUCTS_API as string | undefined

export interface CatalogResult extends CatalogPage {
  source: CatalogSource
}

function createProviderChain(): ProductCatalogProvider[] {
  const providers: ProductCatalogProvider[] = []

  if (ALLTEC_API_ENDPOINT) providers.push(createAlltecApiCatalogProvider(ALLTEC_API_ENDPOINT))

  providers.push(createAlltecFixtureCatalogProvider())
  providers.push(createLocalMockCatalogProvider())

  return providers.map(provider => withCatalogCache(provider, CATALOG_CACHE_TTL_MS))
}

const providers = createProviderChain()

let activeProvider: ProductCatalogProvider | null = null

export async function getProductCatalog(): Promise<CatalogResult> {
  const warnings: string[] = []

  for (const provider of providers) {
    try {
      const page = await provider.listProducts()
      if (page.products.length > 0) {
        activeProvider = provider
        return {
          ...page,
          warnings: [...(page.warnings ?? []), ...warnings],
        }
      }
      warnings.push(`Proveedor ${page.source} no retorno productos.`)
    } catch (error) {
      warnings.push(error instanceof Error ? error.message : 'Proveedor de catálogo falló.')
    }
  }

  throw new Error(warnings.join(' '))
}

export async function revalidateActiveCatalogProducts(items: QuoteRevalidationItem[]): Promise<QuoteRevalidationResult> {
  if (!activeProvider) {
    await getProductCatalog()
  }

  if (!activeProvider) {
    return {
      ok: false,
      checkedAt: new Date().toISOString(),
      items: items.map(item => ({
        id: item.id,
        externalId: item.externalId,
        sku: item.sku,
        available: false,
        priceChanged: false,
        stockChanged: false,
        reason: 'no hay proveedor de catálogo activo',
      })),
    }
  }

  return activeProvider.revalidateProducts(items)
}

export const getMockCatalog = getProductCatalog
