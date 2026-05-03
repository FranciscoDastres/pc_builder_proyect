import type { ComponentSlot, Product, SelectedBuild } from '../../../types'

export const BUILD_STORAGE_KEY = 'pc-builder:selected-build-v1'
const componentSlots: readonly ComponentSlot[] = ['case', 'cpu', 'motherboard', 'ram', 'gpu', 'psu', 'storage', 'cooler']

function isComponentSlot(value: string): value is ComponentSlot {
  return componentSlots.includes(value as ComponentSlot)
}

export function serializeBuildSelection(build: SelectedBuild): Partial<Record<ComponentSlot, string>> {
  return Object.fromEntries(
    Object.entries(build)
      .filter((entry): entry is [ComponentSlot, Product] => Boolean(entry[1]))
      .map(([slot, product]) => [slot, product.id]),
  )
}

export function encodeBuildSelection(selection: Partial<Record<ComponentSlot, string>>): string {
  return componentSlots
    .flatMap(slot => {
      const productId = selection[slot]
      return productId ? [`${slot}:${encodeURIComponent(productId)}`] : []
    })
    .join(',')
}

export function decodeBuildSelection(value: string | null): Partial<Record<ComponentSlot, string>> {
  if (!value) return {}

  return value.split(',').reduce<Partial<Record<ComponentSlot, string>>>((acc, part) => {
    const separatorIndex = part.indexOf(':')
    if (separatorIndex <= 0) return acc

    const slot = part.slice(0, separatorIndex)
    const productId = part.slice(separatorIndex + 1)
    if (!isComponentSlot(slot) || !productId) return acc

    acc[slot] = decodeURIComponent(productId)
    return acc
  }, {})
}

export function createBuildShareUrl(build: SelectedBuild, currentUrl: string): string {
  const url = new URL(currentUrl)
  const encoded = encodeBuildSelection(serializeBuildSelection(build))

  if (encoded) {
    url.searchParams.set('build', encoded)
  } else {
    url.searchParams.delete('build')
  }

  return url.toString()
}

export function restoreBuildSelection(
  saved: Partial<Record<ComponentSlot, string>>,
  products: Product[],
  emptyBuild: SelectedBuild,
): SelectedBuild | null {
  const byId = new Map(products.map(product => [product.id, product]))
  const next: SelectedBuild = { ...emptyBuild }

  for (const [slot, id] of Object.entries(saved) as [ComponentSlot, string][]) {
    const product = byId.get(id)
    if (!product || product.slot !== slot) continue

    if (slot === 'case' && product.slot === 'case') {
      next.case = product
    } else if (slot === 'cpu' && product.slot === 'cpu') {
      next.cpu = product
    } else if (slot === 'motherboard' && product.slot === 'motherboard') {
      next.motherboard = product
    } else if (slot === 'ram' && product.slot === 'ram') {
      next.ram = product
    } else if (slot === 'gpu' && product.slot === 'gpu') {
      next.gpu = product
    } else if (slot === 'psu' && product.slot === 'psu') {
      next.psu = product
    } else if (slot === 'storage' && product.slot === 'storage') {
      next.storage = product
    } else if (slot === 'cooler' && product.slot === 'cooler') {
      next.cooler = product
    }
  }

  return Object.values(next).some(Boolean) ? next : null
}

export function saveBuildToStorage(build: SelectedBuild, storage: Storage = localStorage): void {
  storage.setItem(BUILD_STORAGE_KEY, JSON.stringify(serializeBuildSelection(build)))
}

export function loadBuildFromStorage(
  products: Product[],
  emptyBuild: SelectedBuild,
  storage: Storage = localStorage,
): SelectedBuild | null {
  const raw = storage.getItem(BUILD_STORAGE_KEY)
  if (!raw) return null

  try {
    return restoreBuildSelection(JSON.parse(raw) as Partial<Record<ComponentSlot, string>>, products, emptyBuild)
  } catch {
    return null
  }
}
