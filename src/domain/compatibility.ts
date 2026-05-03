import type {
  CompatibilityIssue,
  ComponentSlot,
  CoolerProduct,
  GPUProduct,
  MotherboardProduct,
  Product,
  RAMProduct,
  SelectedBuild,
} from '../types'

function hasValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0
  return value !== undefined && value !== null && value !== ''
}

function getRuntimeValue(product: Product, key: string): unknown {
  return (product as unknown as Record<string, unknown>)[key]
}

function pushReviewIfMissing(
  issues: CompatibilityIssue[],
  product: Product | null,
  keys: string[],
): void {
  if (!product) return

  const missing = keys.filter(key => !hasValue(getRuntimeValue(product, key)))
  if (!missing.length) return

  issues.push({
    slot: product.slot,
    severity: 'review',
      message: `${product.name} requiere revisión: faltan specs críticas (${missing.join(', ')})`,
  })
}

export function getTotalWatts(build: SelectedBuild): number {
  return Object.values(build).reduce((sum, product) => sum + (product?.powerDraw ?? 0), 0)
}

export function getTotalPrice(build: SelectedBuild): number {
  return Object.values(build).reduce((sum, product) => sum + (product?.price ?? 0), 0)
}

export function isBuildComplete(build: SelectedBuild): boolean {
  return Object.values(build).every(Boolean)
}

export function validateBuild(build: SelectedBuild): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = []
  const { case: pcCase, cpu, motherboard, ram, gpu, psu, cooler } = build

  pushReviewIfMissing(issues, pcCase, ['formFactors', 'maxAIOSize', 'maxGPULength'])
  pushReviewIfMissing(issues, cpu, ['socket', 'tdp'])
  pushReviewIfMissing(issues, motherboard, ['socket', 'formFactor', 'ramType', 'ramSlots', 'maxRAM'])
  pushReviewIfMissing(issues, ram, ['type', 'modules', 'capacity'])
  pushReviewIfMissing(issues, gpu, ['length'])
  pushReviewIfMissing(issues, psu, ['wattage'])
  pushReviewIfMissing(issues, cooler, ['compatibleSockets', 'maxTDP'])

  if (cpu && motherboard && hasValue(cpu.socket) && hasValue(motherboard.socket) && cpu.socket !== motherboard.socket) {
    issues.push({
      slot: 'motherboard',
      severity: 'error',
      message: `${motherboard.name} usa socket ${motherboard.socket} pero ${cpu.name} requiere ${cpu.socket}`,
    })
  }

  if (motherboard && ram && hasValue(ram.type) && hasValue(motherboard.ramType) && ram.type !== motherboard.ramType) {
    issues.push({
      slot: 'ram',
      severity: 'error',
      message: `${ram.name} es ${ram.type} pero tu placa soporta ${motherboard.ramType}`,
    })
  }

  if (
    pcCase &&
    motherboard &&
    hasValue(pcCase.formFactors) &&
    hasValue(motherboard.formFactor) &&
    !pcCase.formFactors.includes(motherboard.formFactor)
  ) {
    issues.push({
      slot: 'motherboard',
      severity: 'error',
      message: `${motherboard.name} es ${motherboard.formFactor} pero ${pcCase.name} soporta ${pcCase.formFactors.join('/')}`,
    })
  }

  if (pcCase && gpu && hasValue(gpu.length) && hasValue(pcCase.maxGPULength) && gpu.length > pcCase.maxGPULength) {
    issues.push({
      slot: 'gpu',
      severity: 'error',
      message: `${gpu.name} mide ${gpu.length}mm pero el gabinete acepta máximo ${pcCase.maxGPULength}mm`,
    })
  }

  if (
    pcCase &&
    cooler &&
    cooler.type === 'aio' &&
    hasValue(cooler.aioSize) &&
    hasValue(pcCase.maxAIOSize) &&
    cooler.aioSize &&
    cooler.aioSize > pcCase.maxAIOSize
  ) {
    issues.push({
      slot: 'cooler',
      severity: 'error',
      message: `AIO de ${cooler.aioSize}mm no cabe en el gabinete (máximo ${pcCase.maxAIOSize}mm)`,
    })
  }

  if (
    cpu &&
    cooler &&
    hasValue(cpu.socket) &&
    hasValue(cooler.compatibleSockets) &&
    !cooler.compatibleSockets.includes(cpu.socket)
  ) {
    issues.push({
      slot: 'cooler',
      severity: 'error',
      message: `${cooler.name} no soporta socket ${cpu.socket}`,
    })
  }

  if (cpu && cooler && hasValue(cpu.tdp) && hasValue(cooler.maxTDP) && cpu.tdp > cooler.maxTDP) {
    issues.push({
      slot: 'cooler',
      severity: 'warning',
      message: `TDP del CPU (${cpu.tdp}W) supera la capacidad del cooler (${cooler.maxTDP}W)`,
    })
  }

  if (motherboard && ram && hasValue(ram.modules) && hasValue(motherboard.ramSlots) && ram.modules > motherboard.ramSlots) {
    issues.push({
      slot: 'ram',
      severity: 'error',
        message: `${ram.name} usa ${ram.modules} módulos pero la placa tiene ${motherboard.ramSlots} slots`,
    })
  }

  if (motherboard && ram && hasValue(ram.capacity) && hasValue(motherboard.maxRAM) && ram.capacity > motherboard.maxRAM) {
    issues.push({
      slot: 'ram',
      severity: 'warning',
        message: `${ram.name} tiene ${ram.capacity}GB pero la placa soporta máximo ${motherboard.maxRAM}GB`,
    })
  }

  if (psu) {
    const totalWatts = getTotalWatts(build)

    if (hasValue(psu.wattage) && totalWatts > psu.wattage) {
      issues.push({
        slot: 'psu',
        severity: 'error',
        message: `La build consume ~${totalWatts}W pero la fuente es de ${psu.wattage}W`,
      })
    } else if (hasValue(psu.wattage) && totalWatts > psu.wattage * 0.85) {
      issues.push({
        slot: 'psu',
        severity: 'warning',
        message: `La build consume ~${totalWatts}W — considera una fuente más grande para margen de seguridad`,
      })
    }
  }

  return issues
}

export function canAddProduct(
  build: SelectedBuild,
  product: Product,
  slot: ComponentSlot = product.slot,
): boolean {
  if (!product.inStock || product.slot !== slot) return false

  const { case: pcCase, cpu, motherboard } = build

  if (slot === 'cpu') return true

  if (slot === 'motherboard') {
    const candidate = product as MotherboardProduct
    const cpuOk =
      !cpu ||
      !hasValue(candidate.socket) ||
      !hasValue(cpu.socket) ||
      candidate.socket === cpu.socket
    const caseOk =
      !pcCase ||
      !hasValue(candidate.formFactor) ||
      !hasValue(pcCase.formFactors) ||
      pcCase.formFactors.includes(candidate.formFactor)

    return cpuOk && caseOk
  }

  if (slot === 'ram') {
    const candidate = product as RAMProduct

    return !motherboard || !hasValue(candidate.type) || !hasValue(motherboard.ramType) || candidate.type === motherboard.ramType
  }

  if (slot === 'gpu') {
    const candidate = product as GPUProduct

    return !pcCase || !hasValue(candidate.length) || !hasValue(pcCase.maxGPULength) || candidate.length <= pcCase.maxGPULength
  }

  if (slot === 'cooler') {
    const candidate = product as CoolerProduct
    const socketOk =
      !cpu ||
      !hasValue(candidate.compatibleSockets) ||
      !hasValue(cpu.socket) ||
      candidate.compatibleSockets.includes(cpu.socket)
    const aioOk =
      candidate.type !== 'aio' ||
      !pcCase ||
      !candidate.aioSize ||
      candidate.aioSize <= pcCase.maxAIOSize

    return socketOk && aioOk
  }

  if (slot === 'case') return true
  if (slot === 'psu') return true
  if (slot === 'storage') return true

  return true
}

export const getBuildIssues = validateBuild
export const isCompatible = canAddProduct
export const totalBuildWatts = getTotalWatts
export const totalBuildPrice = getTotalPrice
