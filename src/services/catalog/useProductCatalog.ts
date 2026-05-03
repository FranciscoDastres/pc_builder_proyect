import { useEffect, useState } from 'react'
import type { Product } from '../../types'
import { getProductCatalog } from './catalogService'
import type { CatalogSource } from './types'

interface CatalogState {
  products: Product[]
  loading: boolean
  error: string | null
  source: CatalogSource | null
  fetchedAt: string | null
  warnings: string[]
}

export function useProductCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({
    products: [],
    loading: true,
    error: null,
    source: null,
    fetchedAt: null,
    warnings: [],
  })

  useEffect(() => {
    let active = true

    async function loadCatalog() {
      try {
        const result = await getProductCatalog()
        if (!active) return
        setState({
          products: result.products,
          loading: false,
          error: null,
          source: result.source,
          fetchedAt: result.fetchedAt,
          warnings: result.warnings ?? [],
        })
      } catch {
        if (!active) return
        setState({
          products: [],
          loading: false,
          error: 'No se pudo cargar el catálogo de componentes.',
          source: null,
          fetchedAt: null,
          warnings: [],
        })
      }
    }

    loadCatalog()

    return () => {
      active = false
    }
  }, [])

  return state
}
