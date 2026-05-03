export type CPUSocket = 'AM4' | 'AM5' | 'LGA1200' | 'LGA1700' | 'LGA1851' | 'STR5'
export type FormFactor = 'ATX' | 'mATX' | 'ITX'
export type RAMType = 'DDR3' | 'DDR4' | 'DDR5'
export type RAMSlots = 2 | 4
export type PCIeGen = 'PCIe 4.0' | 'PCIe 5.0'
export type CoolerType = 'air' | 'aio'
export type AIOSize = 120 | 240 | 280 | 360
export type StorageType = 'NVMe M.2' | 'SATA SSD' | 'HDD'

export type ComponentSlot =
  | 'case'
  | 'cpu'
  | 'motherboard'
  | 'ram'
  | 'gpu'
  | 'psu'
  | 'storage'
  | 'cooler'

export interface BaseProduct {
  id: string
  externalId?: string
  sku?: string
  dataQuality?: 'ready' | 'incomplete' | 'review_required' | 'disabled'
  reviewReasons?: string[]
  reviewSeverity?: 'critical' | 'warning'
  reviewFields?: string[]
  name: string
  brand: string
  price: number
  image: string
  imageUrl?: string
  sourceUrl?: string
  categoryName?: string
  stock?: number
  slot: ComponentSlot
  inStock: boolean
  description: string
  powerDraw: number
}

export interface CaseProduct extends BaseProduct {
  slot: 'case'
  formFactors: FormFactor[]
  maxAIOSize: AIOSize
  maxGPULength: number
  sidePanel: 'glass' | 'solid'
  color: 'black' | 'white'
}

export interface CPUProduct extends BaseProduct {
  slot: 'cpu'
  socket: CPUSocket
  cores: number
  threads: number
  baseClock: number
  boostClock: number
  tdp: number
  generation: string
  brand: 'AMD' | 'Intel'
  includesCooler: boolean
}

export interface MotherboardProduct extends BaseProduct {
  slot: 'motherboard'
  socket: CPUSocket
  formFactor: FormFactor
  ramType: RAMType
  ramSlots: RAMSlots
  maxRAM: number
  pciegen: PCIeGen
  m2Slots: number
}

export interface RAMProduct extends BaseProduct {
  slot: 'ram'
  type: RAMType
  frequency: number
  capacity: number
  modules: number
  latency: string
}

export interface GPUProduct extends BaseProduct {
  slot: 'gpu'
  vram: number
  brand: 'NVIDIA' | 'AMD'
  pciegen: PCIeGen
  length: number
  series: string
}

export interface PSUProduct extends BaseProduct {
  slot: 'psu'
  wattage: number
  efficiency: '80+ Bronze' | '80+ Gold' | '80+ Platinum' | '80+ Titanium'
  modular: 'full' | 'semi' | 'non'
}

export interface StorageProduct extends BaseProduct {
  slot: 'storage'
  type: StorageType
  capacity: number
  readSpeed: number
  writeSpeed: number
}

export interface CoolerProduct extends BaseProduct {
  slot: 'cooler'
  type: CoolerType
  aioSize?: AIOSize
  fanCount: number
  maxTDP: number
  compatibleSockets: CPUSocket[]
}

export type Product =
  | CaseProduct
  | CPUProduct
  | MotherboardProduct
  | RAMProduct
  | GPUProduct
  | PSUProduct
  | StorageProduct
  | CoolerProduct

export interface SelectedBuild {
  case: CaseProduct | null
  cpu: CPUProduct | null
  motherboard: MotherboardProduct | null
  ram: RAMProduct | null
  gpu: GPUProduct | null
  psu: PSUProduct | null
  storage: StorageProduct | null
  cooler: CoolerProduct | null
}

export interface CompatibilityIssue {
  slot: ComponentSlot
  message: string
  severity: 'error' | 'warning' | 'info' | 'review'
}

export interface QuoteContact {
  name: string
  emailOrPhone: string
  comuna: string
  comment?: string
}

export interface QuoteRequestProductSnapshot {
  id: string
  externalId?: string
  sku?: string
  slot: ComponentSlot
  name: string
  brand: string
  price: number
  stock?: number
  inStock: boolean
  sourceUrl?: string
  dataQuality?: BaseProduct['dataQuality']
  reviewReasons?: string[]
}

export interface QuoteRevalidationResultItem {
  id: string
  externalId?: string
  sku?: string
  available: boolean
  currentPrice?: number
  currentStock?: number
  priceChanged: boolean
  stockChanged: boolean
  reason?: string
}

export interface QuoteRevalidationResult {
  ok: boolean
  checkedAt: string
  items: QuoteRevalidationResultItem[]
}

export interface QuoteRequestPayload {
  id: string
  createdAt: string
  status: 'mock_submitted'
  mock: true
  contact: QuoteContact
  build: Partial<Record<ComponentSlot, QuoteRequestProductSnapshot>>
  products: QuoteRequestProductSnapshot[]
  totals: {
    price: number
    watts: number
  }
  validation: {
    isComplete: boolean
    issues: CompatibilityIssue[]
    revalidation?: QuoteRevalidationResult
  }
  catalogSource: 'alltec-api' | 'alltec-fixture' | 'local-mock' | null
}
