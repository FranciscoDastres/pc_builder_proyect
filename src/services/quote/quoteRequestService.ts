import type { QuoteRequestPayload } from '../../types'

export interface MockQuoteRequestResult {
  ok: true
  requestId: string
  payload: QuoteRequestPayload
}

export async function submitMockQuoteRequest(payload: QuoteRequestPayload): Promise<MockQuoteRequestResult> {
  await new Promise(resolve => window.setTimeout(resolve, 250))

  return {
    ok: true,
    requestId: payload.id,
    payload,
  }
}
