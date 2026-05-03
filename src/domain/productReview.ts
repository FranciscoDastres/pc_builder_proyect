import type { Product } from '../types'

export interface ProductReview {
  product: Product
  reasons: string[]
}

function isMissing(value: unknown): boolean {
  if (Array.isArray(value)) return value.length === 0
  return value === undefined || value === null || value === ''
}

function hasText(product: Product, pattern: RegExp): boolean {
  return pattern.test(`${product.name} ${product.description} ${product.categoryName ?? ''}`)
}

export function getProductReviewReasons(product: Product): string[] {
  const reasons = [...(product.reviewReasons ?? [])]

  if (product.dataQuality === 'review_required') reasons.push('marcado por el importador')
  if (product.dataQuality === 'incomplete') reasons.push('specs incompletas')
  if (product.dataQuality === 'disabled') reasons.push('producto deshabilitado')
  if (!product.sourceUrl) reasons.push('sin URL de origen')
  if (!product.imageUrl) reasons.push('sin imagen de producto')
  if (product.stock === undefined) reasons.push('sin stock numerico')
  if (product.price <= 0) reasons.push('sin precio valido')
  if (product.price > 20_000_000) reasons.push('precio fuera de rango plausible')

  if (product.slot === 'case') {
    if (isMissing(product.formFactors)) reasons.push('sin formatos compatibles')
    if (isMissing(product.maxGPULength)) reasons.push('sin largo máximo GPU')
    if (product.maxGPULength === 330 && !hasText(product, /(GPU|VGA|VIDEO)[^0-9]{0,24}[0-9]{3}\s*mm/i)) {
      reasons.push('largo máximo GPU inferido')
    }
    if (product.maxAIOSize === 240 && !hasText(product, /240\s*mm|280\s*mm|360\s*mm/i)) {
      reasons.push('tamaño AIO inferido')
    }
    if (!hasText(product, /ATX|M-?ATX|MICRO ATX|ITX/i)) reasons.push('form factor inferido')
  }

  if (product.slot === 'cpu') {
    if (isMissing(product.socket)) reasons.push('sin socket')
    if (product.tdp === 65 && !hasText(product, /TDP[^0-9]{0,12}65\s*W/i)) reasons.push('TDP inferido')
  }

  if (product.slot === 'motherboard') {
    if (isMissing(product.socket)) reasons.push('sin socket')
    if (!hasText(product, /DDR[345]/i)) reasons.push('tipo de memoria inferido')
    if (!hasText(product, /ATX|M-?ATX|MICRO ATX|ITX/i)) reasons.push('form factor inferido')
  }

  if (product.slot === 'ram') {
    if (isMissing(product.type)) reasons.push('sin tipo DDR')
    if (product.capacity <= 0 || product.capacity > 256) reasons.push('capacidad RAM fuera de rango plausible')
    if (product.modules === 1 && !hasText(product, /\(?[1-4]\s*x\s*[0-9]{1,3}\s*GB/i)) reasons.push('cantidad de módulos inferida')
  }

  if (product.slot === 'gpu') {
    if (isMissing(product.length)) reasons.push('sin largo fisico GPU')
    if (product.length === 300 && !hasText(product, /[0-9]{3}\s*x\s*[0-9]{2,3}\s*x\s*[0-9]{2,3}\s*mm/i)) {
      reasons.push('largo fisico inferido')
    }
    if (product.powerDraw === 220 || product.powerDraw === 250) reasons.push('consumo GPU estimado')
  }

  if (product.slot === 'psu') {
    if (product.wattage < 300) reasons.push('wattage fuera de rango plausible')
    if (product.wattage === 650 && !hasText(product, /650\s*W/i)) reasons.push('wattage inferido')
    if (product.efficiency === '80+ Gold' && !hasText(product, /GOLD/i)) reasons.push('eficiencia inferida')
  }

  if (product.slot === 'storage') {
    if (product.capacity < 120 || product.capacity > 8000) reasons.push('capacidad de almacenamiento fuera de rango plausible')
    if (product.capacity === 512 && !hasText(product, /512\s*GB|0[.,]5\s*TB/i)) reasons.push('capacidad inferida')
    if (product.readSpeed === 3500 || product.readSpeed === 550 || product.readSpeed === 250) {
      reasons.push('velocidad de lectura inferida')
    }
  }

  if (product.slot === 'cooler') {
    if (product.type === 'aio' && isMissing(product.aioSize)) reasons.push('sin tamaño AIO')
    if (product.maxTDP === 180 || product.maxTDP === 250) reasons.push('TDP máximo cooler inferido')
    if (product.compatibleSockets.length >= 3) reasons.push('sockets compatibles genéricos')
  }

  return [...new Set(reasons)]
}

export function getProductsForReview(products: Product[]): ProductReview[] {
  return products
    .map(product => ({ product, reasons: getProductReviewReasons(product) }))
    .filter(review => review.reasons.length > 0)
}
