import { useMemo } from 'react'
import type {
  Product, SelectedBuild, CompatibilityIssue, ComponentSlot,
  MotherboardProduct, RAMProduct,
  GPUProduct, CoolerProduct
} from '../types'

function totalBuildWatts(build: SelectedBuild): number {
  return Object.values(build).reduce((sum, p) => sum + (p?.powerDraw ?? 0), 0)
}

export function useCompatibility(build: SelectedBuild) {
  const issues = useMemo<CompatibilityIssue[]>(() => {
    const result: CompatibilityIssue[] = []
    const { case: pc, cpu, motherboard, ram, gpu, psu, cooler } = build

    if (cpu && motherboard && cpu.socket !== motherboard.socket) {
      result.push({ slot: 'motherboard', severity: 'error', message: `${motherboard.name} usa socket ${motherboard.socket} pero ${cpu.name} requiere ${cpu.socket}` })
    }
    if (motherboard && ram && ram.type !== motherboard.ramType) {
      result.push({ slot: 'ram', severity: 'error', message: `${ram.name} es ${ram.type} pero tu placa soporta ${motherboard.ramType}` })
    }
    if (pc && motherboard && !pc.formFactors.includes(motherboard.formFactor)) {
      result.push({ slot: 'motherboard', severity: 'error', message: `${motherboard.name} es ${motherboard.formFactor} pero ${pc.name} soporta ${pc.formFactors.join('/')}` })
    }
    if (pc && gpu && gpu.length > pc.maxGPULength) {
      result.push({ slot: 'gpu', severity: 'error', message: `${gpu.name} mide ${gpu.length}mm pero el gabinete acepta máximo ${pc.maxGPULength}mm` })
    }
    if (pc && cooler && cooler.type === 'aio' && cooler.aioSize && cooler.aioSize > pc.maxAIOSize) {
      result.push({ slot: 'cooler', severity: 'error', message: `AIO de ${cooler.aioSize}mm no cabe en el gabinete (máximo ${pc.maxAIOSize}mm)` })
    }
    if (cpu && cooler && !cooler.compatibleSockets.includes(cpu.socket)) {
      result.push({ slot: 'cooler', severity: 'error', message: `${cooler.name} no soporta socket ${cpu.socket}` })
    }
    if (cpu && cooler && cpu.tdp > cooler.maxTDP) {
      result.push({ slot: 'cooler', severity: 'warning', message: `TDP del CPU (${cpu.tdp}W) supera la capacidad del cooler (${cooler.maxTDP}W)` })
    }
    if (psu) {
      const totalW = totalBuildWatts(build)
      if (totalW > psu.wattage) {
        result.push({ slot: 'psu', severity: 'error', message: `La build consume ~${totalW}W pero la fuente es de ${psu.wattage}W` })
      } else if (totalW > psu.wattage * 0.85) {
        result.push({ slot: 'psu', severity: 'warning', message: `La build consume ~${totalW}W — considera una fuente más grande para margen de seguridad` })
      }
    }
    return result
  }, [build])

  const isCompatible = useMemo(() => (product: Product, slot: ComponentSlot): boolean => {
    if (!product.inStock) return false
    const { case: pc, cpu, motherboard } = build

    if (slot === 'cpu') return true
    if (slot === 'motherboard') {
      const mb = product as MotherboardProduct
      const cpuOk = !cpu || mb.socket === cpu.socket
      const caseOk = !pc || pc.formFactors.includes(mb.formFactor)
      return cpuOk && caseOk
    }
    if (slot === 'ram') {
      const r = product as RAMProduct
      return !motherboard || r.type === motherboard.ramType
    }
    if (slot === 'gpu') {
      const g = product as GPUProduct
      return !pc || g.length <= pc.maxGPULength
    }
    if (slot === 'cooler') {
      const c = product as CoolerProduct
      const socketOk = !cpu || c.compatibleSockets.includes(cpu.socket)
      const aioOk = c.type !== 'aio' || !pc || !c.aioSize || c.aioSize <= pc.maxAIOSize
      return socketOk && aioOk
    }
    if (slot === 'case') return true
    if (slot === 'psu') return true
    if (slot === 'storage') return true
    return true
  }, [build])

  const totalWatts = useMemo(() => totalBuildWatts(build), [build])
  const totalPrice = useMemo(
    () => Object.values(build).reduce((sum, p) => sum + (p?.price ?? 0), 0),
    [build]
  )
  const isComplete = useMemo(
    () => Object.values(build).every(Boolean),
    [build]
  )

  return { issues, isCompatible, totalWatts, totalPrice, isComplete }
}
