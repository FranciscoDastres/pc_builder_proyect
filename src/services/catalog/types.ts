import type {
  Product,
  QuoteRequestProductSnapshot,
  QuoteRevalidationResult,
  QuoteRevalidationResultItem,
} from '../../types'

export type CatalogSource = 'alltec-api' | 'alltec-fixture' | 'local-mock'

export interface CatalogQuery {
  search?: string
  category?: string
}

export interface CatalogPage {
  products: Product[]
  source: CatalogSource
  fetchedAt: string
  cacheTtlMs?: number
  warnings?: string[]
}

export interface QuoteRevalidationItem {
  id: string
  externalId?: string
  sku?: string
  priceSnapshot: number
  stockSnapshot?: number
}

export interface ProductCatalogProvider {
  listProducts(query?: CatalogQuery): Promise<CatalogPage>
  getProduct(externalId: string): Promise<Product | null>
  revalidateProducts(items: QuoteRevalidationItem[]): Promise<QuoteRevalidationResult>
}

export function quoteSnapshotsToRevalidationItems(snapshots: QuoteRequestProductSnapshot[]): QuoteRevalidationItem[] {
  return snapshots.map(snapshot => ({
    id: snapshot.id,
    externalId: snapshot.externalId,
    sku: snapshot.sku,
    priceSnapshot: snapshot.price,
    stockSnapshot: snapshot.stock,
  }))
}

export type { QuoteRevalidationResult, QuoteRevalidationResultItem }
