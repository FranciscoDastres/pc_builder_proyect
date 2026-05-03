import { useMemo } from 'react'
import type { Product, SelectedBuild, ComponentSlot } from '../../../types'
import {
  canAddProduct,
  getTotalPrice,
  getTotalWatts,
  isBuildComplete,
  validateBuild,
} from '../../../domain'

export function useCompatibility(build: SelectedBuild) {
  const issues = useMemo(() => validateBuild(build), [build])

  const isCompatible = useMemo(() => (product: Product, slot: ComponentSlot): boolean => {
    return canAddProduct(build, product, slot)
  }, [build])

  const totalWatts = useMemo(() => getTotalWatts(build), [build])
  const totalPrice = useMemo(() => getTotalPrice(build), [build])
  const isComplete = useMemo(() => isBuildComplete(build), [build])

  return { issues, isCompatible, totalWatts, totalPrice, isComplete }
}
