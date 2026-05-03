export {
  canAddProduct,
  getBuildIssues,
  getTotalPrice,
  getTotalWatts,
  isBuildComplete,
  isCompatible,
  totalBuildPrice,
  totalBuildWatts,
  validateBuild,
} from './compatibility'
export {
  getProductReviewReasons,
  getProductsForReview,
} from './productReview'
export type { ProductReview } from './productReview'
export {
  createQuoteRequestPayload,
  normalizeQuoteContact,
  validateQuoteRequest,
} from './quoteRequest'
export type { QuoteValidationResult } from './quoteRequest'
