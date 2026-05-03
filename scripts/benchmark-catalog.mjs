import { readFileSync } from 'node:fs'
import { performance } from 'node:perf_hooks'

const SOURCE_FILE = new URL('../public/data/alltec-products.json', import.meta.url)
const slotOrder = ['case', 'cpu', 'motherboard', 'ram', 'gpu', 'psu', 'storage', 'cooler']
const sizes = process.argv.slice(2).map(Number).filter(Number.isFinite)
const targetSizes = sizes.length ? sizes : [1000, 10000]

function cloneProduct(product, index) {
  const cycle = Math.floor(index / 100000)
  const stock = typeof product.stock === 'number' ? product.stock : product.inStock ? 1 : 0

  return {
    ...product,
    id: `${product.id}-bench-${index}`,
    externalId: product.externalId ? `${product.externalId}-bench-${index}` : undefined,
    sku: product.sku ? `${product.sku}-${index}` : undefined,
    name: `${product.name} #${index + 1}`,
    price: product.price + cycle,
    stock,
    inStock: stock > 0,
  }
}

function expandCatalog(baseProducts, targetSize) {
  return Array.from({ length: targetSize }, (_, index) => cloneProduct(baseProducts[index % baseProducts.length], index))
}

function groupBySlot(products) {
  const grouped = Object.fromEntries(slotOrder.map(slot => [slot, []]))

  for (const product of products) {
    if (grouped[product.slot]) grouped[product.slot].push(product)
  }

  return grouped
}

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0
  return value !== undefined && value !== null && value !== ''
}

function canAddProduct(build, product, slot = product.slot) {
  if (!product.inStock || product.slot !== slot) return false

  const pcCase = build.case
  const cpu = build.cpu
  const motherboard = build.motherboard

  if (slot === 'cpu') return true

  if (slot === 'motherboard') {
    const cpuOk = !cpu || !hasValue(product.socket) || !hasValue(cpu.socket) || product.socket === cpu.socket
    const caseOk = !pcCase || !hasValue(product.formFactor) || !hasValue(pcCase.formFactors) || pcCase.formFactors.includes(product.formFactor)
    return cpuOk && caseOk
  }

  if (slot === 'ram') {
    return !motherboard || !hasValue(product.type) || !hasValue(motherboard.ramType) || product.type === motherboard.ramType
  }

  if (slot === 'gpu') {
    return !pcCase || !hasValue(product.length) || !hasValue(pcCase.maxGPULength) || product.length <= pcCase.maxGPULength
  }

  if (slot === 'cooler') {
    const socketOk = !cpu || !hasValue(product.compatibleSockets) || !hasValue(cpu.socket) || product.compatibleSockets.includes(cpu.socket)
    const aioOk = product.type !== 'aio' || !pcCase || !product.aioSize || product.aioSize <= pcCase.maxAIOSize
    return socketOk && aioOk
  }

  return true
}

function makeBuild(products) {
  const bySlot = groupBySlot(products)

  return {
    case: bySlot.case.find(product => product.inStock) ?? null,
    cpu: bySlot.cpu.find(product => product.inStock) ?? null,
    motherboard: bySlot.motherboard.find(product => product.inStock) ?? null,
    ram: null,
    gpu: null,
    psu: null,
    storage: null,
    cooler: null,
  }
}

function filterCatalog({ grouped, build, searchTerm }) {
  const hasSelectedProducts = Object.values(build).some(Boolean)
  const lowerSearch = searchTerm.toLowerCase()
  const filteredBySlot = {}
  let visibleCount = 0
  let hiddenByCompatibility = 0
  let hiddenOutOfStock = 0

  for (const slot of slotOrder) {
    const slotProducts = grouped[slot] ?? []
    const stockedProducts = slotProducts.filter(product => product.inStock)
    hiddenOutOfStock += slotProducts.length - stockedProducts.length

    const compatibleProducts = hasSelectedProducts
      ? stockedProducts.filter(product => {
        const selected = build[product.slot]?.id === product.id
        const compatible = selected || canAddProduct(build, product, product.slot)
        if (!compatible) hiddenByCompatibility += 1
        return compatible
      })
      : stockedProducts

    filteredBySlot[slot] = lowerSearch
      ? compatibleProducts.filter(product =>
        product.name.toLowerCase().includes(lowerSearch) ||
        product.brand.toLowerCase().includes(lowerSearch) ||
        product.description.toLowerCase().includes(lowerSearch)
      )
      : compatibleProducts

    visibleCount += filteredBySlot[slot].length
  }

  return { filteredBySlot, visibleCount, hiddenByCompatibility, hiddenOutOfStock }
}

function makeVirtualRows(filteredBySlot) {
  const rows = []

  for (const slot of slotOrder) {
    const products = filteredBySlot[slot] ?? []
    if (!products.length) continue
    rows.push({ type: 'header', slot, count: products.length })
    for (const product of products) rows.push({ type: 'product', productId: product.id })
  }

  return rows
}

function measure(label, fn) {
  const start = performance.now()
  const result = fn()
  return { label, durationMs: performance.now() - start, result }
}

const baseProducts = JSON.parse(readFileSync(SOURCE_FILE, 'utf8'))
if (!Array.isArray(baseProducts) || baseProducts.length === 0) {
  throw new Error(`No benchmark products found in ${SOURCE_FILE.pathname}`)
}

console.log('| products | group ms | default filter ms | search filter ms | rows ms | visible | hidden stock | hidden compat |')
console.log('|---:|---:|---:|---:|---:|---:|---:|---:|')

for (const targetSize of targetSizes) {
  const products = expandCatalog(baseProducts, targetSize)
  const groupedRun = measure('group', () => groupBySlot(products))
  const build = makeBuild(products)
  const defaultRun = measure('defaultFilter', () => filterCatalog({ grouped: groupedRun.result, build, searchTerm: '' }))
  const searchRun = measure('searchFilter', () => filterCatalog({ grouped: groupedRun.result, build, searchTerm: 'ryzen' }))
  const rowsRun = measure('rows', () => makeVirtualRows(defaultRun.result.filteredBySlot))

  console.log([
    `| ${targetSize}`,
    groupedRun.durationMs.toFixed(2),
    defaultRun.durationMs.toFixed(2),
    searchRun.durationMs.toFixed(2),
    rowsRun.durationMs.toFixed(2),
    defaultRun.result.visibleCount,
    defaultRun.result.hiddenOutOfStock,
    defaultRun.result.hiddenByCompatibility,
  ].join(' | ') + ' |')
}
