export { getMockCatalog, getProductCatalog, revalidateActiveCatalogProducts } from './catalogService'
export type { CatalogResult } from './catalogService'
export { useProductCatalog } from './useProductCatalog'
export type {
  CatalogPage,
  CatalogQuery,
  CatalogSource,
  ProductCatalogProvider,
  QuoteRevalidationItem,
  QuoteRevalidationResult,
  QuoteRevalidationResultItem,
} from './types'
export { quoteSnapshotsToRevalidationItems } from './types'
