import type {
  AIOSize,
  ComponentSlot,
  CPUSocket,
  FormFactor,
  PCIeGen,
  PSUProduct,
  Product,
  RAMSlots,
  RAMType,
  StorageType,
} from '../../types'

export interface AlltecApiProduct {
  id: string | number
  sku?: string
  name: string
  brand?: string
  category: string
  price: number | string
  stock?: number | string
  available?: boolean
  imageUrl?: string
  url?: string
  description?: string
  specs?: Record<string, unknown>
}

export interface AlltecProductNormalizationResult {
  product: Product | null
  issues: string[]
}

const SLOT_ICONS: Record<ComponentSlot, string> = {
  case: '🖥️',
  cpu: '🔲',
  motherboard: '🟫',
  ram: '📊',
  gpu: '🎮',
  psu: '⚡',
  storage: '💾',
  cooler: '❄️',
}

const SOCKETS = ['AM4', 'AM5', 'LGA1200', 'LGA1700', 'LGA1851', 'STR5'] satisfies CPUSocket[]
const FORM_FACTORS = ['ATX', 'mATX', 'ITX'] satisfies FormFactor[]
const RAM_TYPES = ['DDR3', 'DDR4', 'DDR5'] satisfies RAMType[]
const PCIE_GENS = ['PCIe 4.0', 'PCIe 5.0'] satisfies PCIeGen[]
const STORAGE_TYPES = ['NVMe M.2', 'SATA SSD', 'HDD'] satisfies StorageType[]
const AIO_SIZES = [120, 240, 280, 360] satisfies AIOSize[]

function normalizeText(value: string): string {
  return value.trim().toLowerCase()
}

export function mapAlltecCategoryToSlot(category: string): ComponentSlot | null {
  const normalized = normalizeText(category)

  if (/gabinete|case|chasis|chassis/.test(normalized)) return 'case'
  if (/procesador|cpu|ryzen|athlon|intel/.test(normalized)) return 'cpu'
  if (/placa|motherboard|mainboard|para amd|para intel/.test(normalized)) return 'motherboard'
  if (/memoria|ram|ddr[345]/.test(normalized)) return 'ram'
  if (/tarjetas? de video|gpu|nvidia|geforce|radeon/.test(normalized)) return 'gpu'
  if (/fuente|psu|power supply/.test(normalized)) return 'psu'
  if (/almacenamiento|ssd|nvme|m\.2|hdd|disco/.test(normalized)) return 'storage'
  if (/refrigeracion|refrigeración|cooler|water cooling|aio/.test(normalized)) return 'cooler'

  return null
}

function parseNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value !== 'string') return 0
  const raw = value.replace(/[^\d.,-]/g, '')
  const dotThousands = /^\d{1,3}(\.\d{3})+$/.test(raw)
  const cleaned = raw.includes('.') && !raw.includes(',') && !dotThousands
    ? raw
    : raw.replace(/\./g, '').replace(',', '.')
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? Math.round(parsed) : 0
}

function stringSpec(specs: Record<string, unknown>, keys: string[], allowed?: readonly string[]): string | undefined {
  const value = keys.map(key => specs[key]).find(item => typeof item === 'string') as string | undefined
  if (!value) return undefined
  if (!allowed) return value
  return allowed.find(option => option.toLowerCase() === value.toLowerCase())
}

function numberSpec(specs: Record<string, unknown>, keys: string[]): number | undefined {
  const value = keys.map(key => specs[key]).find(item => item !== undefined)
  const parsed = parseNumber(value)
  return parsed || undefined
}

function arraySpec<T extends string>(specs: Record<string, unknown>, keys: string[], allowed: readonly T[]): T[] | undefined {
  const value = keys.map(key => specs[key]).find(Boolean)
  if (!Array.isArray(value)) return undefined
  const normalized = value
    .filter((item): item is string => typeof item === 'string')
    .map(item => allowed.find(option => option.toLowerCase() === item.toLowerCase()))
    .filter(Boolean) as T[]
  return normalized.length ? normalized : undefined
}

function requireIssue(issues: string[], condition: unknown, field: string): boolean {
  if (condition !== undefined && condition !== null && condition !== '') return true
  issues.push(`falta spec ${field}`)
  return false
}

function baseProduct(raw: AlltecApiProduct, slot: ComponentSlot, issues: string[]) {
  const price = parseNumber(raw.price)
  const stock = raw.stock === undefined ? undefined : parseNumber(raw.stock)

  if (price <= 0) issues.push('precio invalido')
  if (!raw.url) issues.push('sin URL de origen')
  if (!raw.imageUrl) issues.push('sin imagen')

  return {
    id: `alltec-${raw.id}`,
    externalId: String(raw.id),
    sku: raw.sku,
    name: raw.name.trim(),
    brand: raw.brand?.trim() || 'Alltec',
    price,
    image: SLOT_ICONS[slot],
    imageUrl: raw.imageUrl,
    sourceUrl: raw.url,
    categoryName: raw.category,
    stock,
    slot,
    inStock: raw.available ?? (stock ?? 0) > 0,
    description: raw.description?.trim() || raw.name.trim(),
    powerDraw: 0,
  }
}

function qualityFields(issues: string[]) {
  return {
    dataQuality: issues.length ? 'review_required' as const : 'ready' as const,
    reviewSeverity: issues.length ? 'critical' as const : undefined,
    reviewReasons: issues.length ? [...issues] : undefined,
  }
}

export function normalizeAlltecProduct(raw: AlltecApiProduct): AlltecProductNormalizationResult {
  const slot = mapAlltecCategoryToSlot(raw.category)
  const issues: string[] = []

  if (!slot) return { product: null, issues: [`categoría no mapeada: ${raw.category}`] }

  const specs = raw.specs ?? {}
  const base = baseProduct(raw, slot, issues)

  if (slot === 'cpu') {
    const socket = stringSpec(specs, ['socket'], SOCKETS) as CPUSocket | undefined
    const tdp = numberSpec(specs, ['tdp', 'tdpWatts'])
    requireIssue(issues, socket, 'socket')
    requireIssue(issues, tdp, 'tdp')
    return {
      issues,
      product: {
        ...base,
        ...qualityFields(issues),
        slot,
        socket: socket ?? 'AM5',
        cores: numberSpec(specs, ['cores']) ?? 0,
        threads: numberSpec(specs, ['threads']) ?? 0,
        baseClock: numberSpec(specs, ['baseClock']) ?? 0,
        boostClock: numberSpec(specs, ['boostClock']) ?? 0,
        tdp: tdp ?? 0,
        generation: stringSpec(specs, ['generation']) ?? socket ?? 'sin dato',
        brand: base.brand.toLowerCase().includes('intel') ? 'Intel' : 'AMD',
        includesCooler: Boolean(specs.includesCooler),
        powerDraw: tdp ?? 0,
      },
    }
  }

  if (slot === 'motherboard') {
    const socket = stringSpec(specs, ['socket'], SOCKETS) as CPUSocket | undefined
    const formFactor = stringSpec(specs, ['formFactor'], FORM_FACTORS) as FormFactor | undefined
    const ramType = stringSpec(specs, ['ramType'], RAM_TYPES) as RAMType | undefined
    requireIssue(issues, socket, 'socket')
    requireIssue(issues, formFactor, 'formFactor')
    requireIssue(issues, ramType, 'ramType')
    return {
      issues,
      product: {
        ...base,
        ...qualityFields(issues),
        slot,
        socket: socket ?? 'AM5',
        formFactor: formFactor ?? 'ATX',
        ramType: ramType ?? 'DDR5',
        ramSlots: (numberSpec(specs, ['ramSlots']) === 2 ? 2 : 4) as RAMSlots,
        maxRAM: numberSpec(specs, ['maxRAM']) ?? 0,
        pciegen: (stringSpec(specs, ['pciegen', 'pcieGen'], PCIE_GENS) as PCIeGen | undefined) ?? 'PCIe 4.0',
        m2Slots: numberSpec(specs, ['m2Slots']) ?? 0,
        powerDraw: numberSpec(specs, ['powerDraw']) ?? 25,
      },
    }
  }

  if (slot === 'ram') {
    const type = stringSpec(specs, ['type', 'ramType'], RAM_TYPES) as RAMType | undefined
    const capacity = numberSpec(specs, ['capacity'])
    const modules = numberSpec(specs, ['modules'])
    requireIssue(issues, type, 'type')
    requireIssue(issues, capacity, 'capacity')
    requireIssue(issues, modules, 'modules')
    return {
      issues,
      product: {
        ...base,
        ...qualityFields(issues),
        slot,
        type: type ?? 'DDR5',
        frequency: numberSpec(specs, ['frequency']) ?? 0,
        capacity: capacity ?? 0,
        modules: modules ?? 0,
        latency: stringSpec(specs, ['latency']) ?? 'sin dato',
        powerDraw: numberSpec(specs, ['powerDraw']) ?? 0,
      },
    }
  }

  if (slot === 'gpu') {
    const length = numberSpec(specs, ['length', 'lengthMm'])
    requireIssue(issues, length, 'length')
    return {
      issues,
      product: {
        ...base,
        ...qualityFields(issues),
        slot,
        vram: numberSpec(specs, ['vram']) ?? 0,
        brand: /radeon|amd/i.test(raw.name) ? 'AMD' : 'NVIDIA',
        pciegen: (stringSpec(specs, ['pciegen', 'pcieGen'], PCIE_GENS) as PCIeGen | undefined) ?? 'PCIe 4.0',
        length: length ?? 0,
        series: stringSpec(specs, ['series']) ?? 'sin dato',
        powerDraw: numberSpec(specs, ['powerDraw']) ?? 0,
      },
    }
  }

  if (slot === 'psu') {
    const wattage = numberSpec(specs, ['wattage'])
    requireIssue(issues, wattage, 'wattage')
    return {
      issues,
      product: {
        ...base,
        ...qualityFields(issues),
        slot,
        wattage: wattage ?? 0,
        efficiency: (stringSpec(specs, ['efficiency'], ['80+ Bronze', '80+ Gold', '80+ Platinum', '80+ Titanium']) as PSUProduct['efficiency'] | undefined) ?? '80+ Bronze',
        modular: stringSpec(specs, ['modular'], ['full', 'semi', 'non']) as 'full' | 'semi' | 'non' | undefined ?? 'non',
        powerDraw: 0,
      },
    }
  }

  if (slot === 'case') {
    const formFactors = arraySpec(specs, ['formFactors'], FORM_FACTORS)
    const maxAIOSize = numberSpec(specs, ['maxAIOSize']) as AIOSize | undefined
    const maxGPULength = numberSpec(specs, ['maxGPULength', 'maxGpuLength'])
    requireIssue(issues, formFactors, 'formFactors')
    requireIssue(issues, maxAIOSize, 'maxAIOSize')
    requireIssue(issues, maxGPULength, 'maxGPULength')
    return {
      issues,
      product: {
        ...base,
        ...qualityFields(issues),
        slot,
        formFactors: formFactors ?? [],
        maxAIOSize: AIO_SIZES.includes(maxAIOSize as AIOSize) ? maxAIOSize as AIOSize : 240,
        maxGPULength: maxGPULength ?? 0,
        sidePanel: stringSpec(specs, ['sidePanel'], ['glass', 'solid']) as 'glass' | 'solid' | undefined ?? 'solid',
        color: stringSpec(specs, ['color'], ['black', 'white']) as 'black' | 'white' | undefined ?? 'black',
        powerDraw: 0,
      },
    }
  }

  if (slot === 'cooler') {
    const maxTDP = numberSpec(specs, ['maxTDP', 'maxTdp'])
    const compatibleSockets = arraySpec(specs, ['compatibleSockets'], SOCKETS)
    requireIssue(issues, maxTDP, 'maxTDP')
    requireIssue(issues, compatibleSockets, 'compatibleSockets')
    return {
      issues,
      product: {
        ...base,
        ...qualityFields(issues),
        slot,
        type: stringSpec(specs, ['type'], ['air', 'aio']) as 'air' | 'aio' | undefined ?? 'air',
        aioSize: numberSpec(specs, ['aioSize']) as AIOSize | undefined,
        fanCount: numberSpec(specs, ['fanCount']) ?? 0,
        maxTDP: maxTDP ?? 0,
        compatibleSockets: compatibleSockets ?? [],
        powerDraw: numberSpec(specs, ['powerDraw']) ?? 0,
      },
    }
  }

  const type = stringSpec(specs, ['type'], STORAGE_TYPES) as StorageType | undefined
  const capacity = numberSpec(specs, ['capacity'])
  requireIssue(issues, type, 'type')
  requireIssue(issues, capacity, 'capacity')
  return {
    issues,
    product: {
      ...base,
      ...qualityFields(issues),
      slot,
      type: type ?? 'SATA SSD',
      capacity: capacity ?? 0,
      readSpeed: numberSpec(specs, ['readSpeed']) ?? 0,
      writeSpeed: numberSpec(specs, ['writeSpeed']) ?? 0,
      powerDraw: numberSpec(specs, ['powerDraw']) ?? 0,
    },
  }
}

export function normalizeAlltecCatalog(rawProducts: AlltecApiProduct[]): Product[] {
  return rawProducts
    .map(normalizeAlltecProduct)
    .filter(result => result.product)
    .map(result => result.product as Product)
}

export interface RevalidatedProductSnapshot {
  id: string
  priceChanged: boolean
  stockChanged: boolean
  currentPrice?: number
  currentStock?: number
}

export function revalidateAlltecPriceStock(
  snapshots: Array<{ id: string; price: number; stock?: number }>,
  currentProducts: Product[],
): RevalidatedProductSnapshot[] {
  const currentById = new Map(currentProducts.map(product => [product.id, product]))

  return snapshots.map(snapshot => {
    const current = currentById.get(snapshot.id)
    return {
      id: snapshot.id,
      priceChanged: Boolean(current && current.price !== snapshot.price),
      stockChanged: Boolean(current && current.stock !== snapshot.stock),
      currentPrice: current?.price,
      currentStock: current?.stock,
    }
  })
}
