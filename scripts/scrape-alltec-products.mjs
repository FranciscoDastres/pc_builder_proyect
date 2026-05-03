import { mkdir, writeFile } from 'node:fs/promises'
import { parse } from 'node-html-parser'

const BASE_URL = 'https://www.alltec.cl'
const SITEMAP_URL = `${BASE_URL}/1_index_sitemap.xml`
const OUTPUT_BASENAME = process.env.ALLTEC_OUTPUT_BASENAME ?? 'alltec-products'
const OUTPUT_FILE = `public/data/${OUTPUT_BASENAME}.json`
const META_FILE = `public/data/${OUTPUT_BASENAME}.meta.json`
const REQUEST_DELAY_MS = 250
const MAX_PRODUCTS = Number(process.env.ALLTEC_LIMIT ?? 1000)
const PER_SLOT_LIMIT = Number(process.env.ALLTEC_PER_SLOT_LIMIT ?? 0)
const STRICT_SPECS = process.env.ALLTEC_STRICT_SPECS !== '0'
const TARGET_SLOTS = ['case', 'cooler', 'cpu', 'gpu', 'motherboard', 'psu', 'ram', 'storage']

const SLOT_ICONS = {
  case: '🖥️',
  cpu: '🔲',
  motherboard: '🟫',
  ram: '📊',
  gpu: '🎮',
  psu: '⚡',
  storage: '💾',
  cooler: '❄️',
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function decodeHtml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&Aacute;/g, 'Á')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó')
    .replace(/&Uacute;/g, 'Ú')
    .replace(/&nbsp;/g, ' ')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™')
}

function textFromHtml(html = '') {
  return decodeHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeWhitespace(value = '') {
  return decodeHtml(value).replace(/\s+/g, ' ').trim()
}

function parseNumber(value) {
  if (value === undefined || value === null) return 0
  const raw = String(value).replace(/[^\d.,-]/g, '')
  const cleaned = raw.includes('.') && !raw.includes(',')
    ? raw
    : raw.replace(/\./g, '').replace(',', '.')
  const number = Number(cleaned)
  return Number.isFinite(number) ? Math.round(number) : 0
}

function getVar(html, name) {
  const match = html.match(new RegExp(`var\\s+${name}\\s*=\\s*([\\s\\S]*?);var\\s`))
  if (!match) {
    const fallback = html.match(new RegExp(`var\\s+${name}\\s*=\\s*([^;]+);`))
    return fallback?.[1]?.trim()
  }
  return match[1].trim()
}

function parseStringVar(html, name) {
  const raw = getVar(html, name)
  if (!raw) return ''
  try {
    return normalizeWhitespace(JSON.parse(raw))
  } catch {
    return normalizeWhitespace(raw.replace(/^['"]|['"]$/g, ''))
  }
}

function parseNumericVar(html, name) {
  return parseNumber(getVar(html, name))
}

function getMeta(root, property) {
  return normalizeWhitespace(root.querySelector(`meta[property="${property}"]`)?.getAttribute('content') ?? '')
}

function firstPathSegment(url) {
  return new URL(url).pathname.split('/').filter(Boolean)[0] ?? ''
}

function detectSlot(url, name, category) {
  const segment = firstPathSegment(url)
  const haystack = `${segment} ${category} ${name}`.toLowerCase()

  if (/(auriculares|headset|mouse|teclado|keyboard|controlador|splitter|cable elevador|cofre|enclosure|adaptador|tarjeta de red|chassis-fan|ventiladores|vga holder|partition plate|cargador laptop|sleeved extension|extension kit|cable kit)/.test(haystack)) return null
  if (/(gabinete|case|chasis|chassis|sin-fuente-de-poder|con-fuente-de-poder)/.test(haystack)) return 'case'
  if (/(ryzen|athlon|threadripper|intel core|core i[3579]|core ultra|\bi[3579][- ]?[0-9]{4,5}[a-z]*\b|pentium|celeron)/.test(haystack)) return 'cpu'
  if (/(geforce|radeon|rtx|gtx|rx [0-9]|tarjeta de video|\bt\.v\.)/.test(haystack)) return 'gpu'
  if (/(placa madre|motherboard|\bm\.?b\.?\b|b650|b840|b850|x870|a620|z790|z890|h610|b760|lga|am5|am4)/.test(haystack) && /(m\.?b\.?|placa|motherboard|para-amd|para-intel|asus|asrock|msi|gigabyte)/.test(haystack)) return 'motherboard'
  if (/(ddr3|ddr4|ddr5|sodimm|memoria ram|ram )/.test(haystack)) return 'ram'
  if (/(ssd|nvme|m\.2|sata3|hdd|disco duro|rigido|almacenamiento)/.test(haystack)) return 'storage'
  if (/(water-cooling|water cooling|cpu-cooler|cpu cooler|cooler cpu|refrigeracion|refrigeración|aio|liquid)/.test(haystack) && !/(ssd|hdd)/.test(haystack)) return 'cooler'
  if (/(fuente|psu|power supply|80 plus)/.test(haystack) && !/water/.test(haystack)) return 'psu'

  return null
}

function detectBrand(name, category) {
  const haystack = `${name} ${category}`.toUpperCase()
  const brands = [
    'AMD', 'INTEL', 'ASUS', 'MSI', 'GIGABYTE', 'ASROCK', 'SAPPHIRE', 'KINGSTON',
    'CORSAIR', 'TEAMGROUP', 'TEAM', 'ADATA', 'A-DATA', 'WESTERN DIGITAL', 'WD',
    'SEAGATE', 'CRUCIAL', 'SAMSUNG', 'COOLER MASTER', 'THERMALTAKE', 'XIGMATEK',
    'DEEPCOOL', 'NZXT', 'EVGA', 'AOC', 'HIKVISION', 'KINGSPEC', 'PATRIOT',
  ]
  const brand = brands.find(brand => haystack.includes(brand))
  if (!brand) return 'Alltec'
  if (brand === 'A-DATA') return 'ADATA'
  if (brand === 'TEAM') return 'TEAMGROUP'
  return brand
}

function socketFromText(text) {
  const upper = text.toUpperCase()
  if (upper.includes('AM5')) return 'AM5'
  if (upper.includes('AM4')) return 'AM4'
  if (upper.includes('LGA1851')) return 'LGA1851'
  if (upper.includes('LGA1700')) return 'LGA1700'
  if (upper.includes('LGA1200')) return 'LGA1200'
  return 'AM5'
}

function pcieFromText(text) {
  return /PCIE\s*5|PCI EXPRESS\s*5|PCIe 5/i.test(text) ? 'PCIe 5.0' : 'PCIe 4.0'
}

function ramTypeFromText(text) {
  if (/DDR5/i.test(text)) return 'DDR5'
  if (/DDR3/i.test(text)) return 'DDR3'
  return 'DDR4'
}

function intMatch(text, pattern, fallback) {
  const match = text.match(pattern)
  if (!match) return fallback
  const value = match.slice(1).find(group => group !== undefined)
  if (!value) return fallback
  return Number.parseInt(value, 10)
}

function floatMatch(text, pattern, fallback) {
  const match = text.match(pattern)
  if (!match) return fallback
  const value = match.slice(1).find(group => group !== undefined)
  if (!value) return fallback
  return Number.parseFloat(value.replace(',', '.'))
}

function normalizeCpu(base, text) {
  const socket = socketFromText(text)
  const brand = /AMD|RYZEN|ATHLON|THREADRIPPER/i.test(text)
    ? 'AMD'
    : /\bINTEL\b|\bCORE\s+(I[3579]|ULTRA)\b|PENTIUM|CELERON/i.test(text)
      ? 'Intel'
      : base.brand === 'Intel'
        ? 'Intel'
        : 'AMD'
  const tdp = intMatch(text, /TDP\)?\s*([0-9]{2,3})\s*W/i, 65)
  const cores =
    /THIRTY[- ]?TWO|32C/i.test(text) ? 32 :
    /TWENTY[- ]?FOUR|24C/i.test(text) ? 24 :
    /SIXTEEN|16C/i.test(text) ? 16 :
    /TWELVE|12C/i.test(text) ? 12 :
    /OCTA|8C/i.test(text) ? 8 :
    /SIX CORE|6C/i.test(text) ? 6 :
    /QUAD|4C/i.test(text) ? 4 :
    /DUAL|2C/i.test(text) ? 2 :
    6
  return {
    ...base,
    brand,
    socket,
    cores,
    threads: intMatch(text, /[0-9]+C\s*\/?\s*([0-9]+)T/i, cores * 2),
    baseClock: floatMatch(text, /([0-9]+(?:[.,][0-9]+)?)\s*GHz/i, 3.5),
    boostClock: floatMatch(text, /\(([0-9]+(?:[.,][0-9]+)?)\s*GHz\s*TURBO/i, 4.5),
    tdp,
    generation: socket,
    includesCooler: /BOX|COOLER/i.test(text),
    powerDraw: tdp,
  }
}

function normalizeMotherboard(base, text) {
  const socket = socketFromText(text)
  const ramType = ramTypeFromText(text)
  return {
    ...base,
    socket,
    formFactor: /ITX/i.test(text) ? 'ITX' : /M-?ATX|MICRO ATX|B650M|B850M|H610M|A620M/i.test(text) ? 'mATX' : 'ATX',
    ramType,
    ramSlots: /2\s*(X|SLOT|DIMM)|2DDR/i.test(text) ? 2 : 4,
    maxRAM: ramType === 'DDR5' ? 192 : 128,
    pciegen: pcieFromText(text),
    m2Slots: intMatch(text, /([1-5])\s*x?\s*M\.2/i, /M\.2/i.test(text) ? 2 : 1),
    powerDraw: 25,
  }
}

function normalizeRam(base, text) {
  const capacity = intMatch(text, /([0-9]{1,3})\s*GB/i, 16)
  const modules = intMatch(text, /\(?([1-4])\s*x\s*[0-9]{1,3}\s*GB/i, 1)
  return {
    ...base,
    type: ramTypeFromText(text),
    frequency: intMatch(text, /DDR[45][- ]?([0-9]{4})|([0-9]{4})\s*MHz/i, 3200),
    capacity,
    modules,
    latency: text.match(/CL[0-9]{2}/i)?.[0]?.toUpperCase() ?? 'CL40',
    powerDraw: Math.max(4, modules * 4),
  }
}

function normalizeGpu(base, text) {
  const vram = intMatch(text, /([0-9]{1,2})\s*GB\s*(GDDR|VRAM)/i, 8)
  const brand = /RADEON|RX\s/i.test(text) ? 'AMD' : 'NVIDIA'
  return {
    ...base,
    brand,
    vram,
    pciegen: pcieFromText(text),
    length: intMatch(text, /([0-9]{3})\s*x\s*[0-9]{2,3}\s*x\s*[0-9]{2,3}\s*mm/i, 300),
    series: text.match(/RTX\s*[0-9]{4}|RX\s*[0-9]{4}|GTX\s*[0-9]{3,4}/i)?.[0]?.toUpperCase() ?? (brand === 'AMD' ? 'Radeon' : 'GeForce'),
    powerDraw: intMatch(text, /([0-9]{3})\s*W/i, brand === 'AMD' ? 250 : 220),
  }
}

function normalizePsu(base, text) {
  const wattage = intMatch(text, /([0-9]{3,4})\s*W/i, 650)
  const efficiency = /TITANIUM/i.test(text) ? '80+ Titanium' : /PLATINUM/i.test(text) ? '80+ Platinum' : /BRONZE/i.test(text) ? '80+ Bronze' : '80+ Gold'
  return {
    ...base,
    wattage,
    efficiency,
    modular: /FULL|MODULAR/i.test(text) ? 'full' : /SEMI/i.test(text) ? 'semi' : 'non',
    powerDraw: 0,
  }
}

function normalizeCase(base, text) {
  const formFactors = ['ATX', 'mATX']
  if (/ITX/i.test(text)) formFactors.push('ITX')
  return {
    ...base,
    formFactors,
    maxAIOSize: /360/i.test(text) ? 360 : /280/i.test(text) ? 280 : 240,
    maxGPULength: intMatch(text, /GPU[^0-9]{0,20}([0-9]{3})\s*mm|VGA[^0-9]{0,20}([0-9]{3})\s*mm/i, 330),
    sidePanel: /VIDRIO|GLASS|CRISTAL/i.test(text) ? 'glass' : 'solid',
    color: /WHITE|BLANCO/i.test(text) ? 'white' : 'black',
    powerDraw: 0,
  }
}

function normalizeCooler(base, text) {
  const aioSize = intMatch(text, /([0-9]{3})\s*mm/i, 240)
  const isAio = /WATER|LIQUID|AIO|240|280|360/i.test(text)
  return {
    ...base,
    type: isAio ? 'aio' : 'air',
    aioSize: isAio ? (aioSize === 280 ? 280 : aioSize >= 360 ? 360 : aioSize >= 240 ? 240 : 120) : undefined,
    fanCount: intMatch(text, /([1-3])\s*x\s*[0-9]{2,3}\s*mm/i, isAio && aioSize >= 360 ? 3 : isAio && aioSize >= 240 ? 2 : 1),
    maxTDP: intMatch(text, /TDP[^0-9]{0,10}([0-9]{2,3})\s*W/i, isAio ? 250 : 180),
    compatibleSockets: ['AM5', 'LGA1700', 'LGA1851'],
    powerDraw: isAio ? 10 : 5,
  }
}

function normalizeStorage(base, text) {
  const capacityText = `${base.name} ${base.description}`.toUpperCase()
  const capacityRaw = floatMatch(capacityText, /([0-9]+(?:[.,][0-9]+)?)\s*TB\b(?!W)/i, 0)
  const capacity = capacityRaw ? Math.round(capacityRaw * 1000) : intMatch(capacityText, /([0-9]{3,4})\s*GB/i, 512)
  const isHdd = /HDD|DISCO|RIGIDO|RÍGIDO/i.test(text)
  const isNvme = /NVME|M\.2|PCIE/i.test(text)
  return {
    ...base,
    type: isHdd ? 'HDD' : isNvme ? 'NVMe M.2' : 'SATA SSD',
    capacity,
    readSpeed: intMatch(text, /([0-9]{3,5})\s*MB\/?S?\s*(READ|LECTURA)/i, isHdd ? 250 : isNvme ? 3500 : 550),
    writeSpeed: intMatch(text, /([0-9]{3,5})\s*MB\/?S?\s*(WRITE|ESCRITURA)/i, isHdd ? 250 : isNvme ? 3000 : 500),
    powerDraw: isHdd ? 8 : 5,
  }
}

function normalizeProduct(raw) {
  const slot = detectSlot(raw.url, raw.name, raw.category)
  if (!slot) return null
  const brand = detectBrand(raw.name, raw.category)
  const base = {
    id: `alltec-${raw.externalId}`,
    externalId: raw.externalId,
    sku: raw.sku,
    name: raw.name,
    brand,
    price: raw.price,
    image: SLOT_ICONS[slot],
    imageUrl: raw.imageUrl,
    sourceUrl: raw.url,
    categoryName: raw.category,
    stock: raw.stock,
    slot,
    inStock: raw.stock > 0,
    description: raw.description || raw.name,
    powerDraw: 0,
  }
  const text = `${raw.name} ${raw.category} ${raw.description} ${raw.details}`.toUpperCase()

  let product = null

  if (slot === 'cpu') product = normalizeCpu(base, text)
  if (slot === 'motherboard') product = normalizeMotherboard(base, text)
  if (slot === 'ram') product = normalizeRam(base, text)
  if (slot === 'gpu') product = normalizeGpu(base, text)
  if (slot === 'psu') product = normalizePsu(base, text)
  if (slot === 'case') product = normalizeCase(base, text)
  if (slot === 'cooler') product = normalizeCooler(base, text)
  if (slot === 'storage') product = normalizeStorage(base, text)

  if (!product) return null
  const reviewReasons = getReviewReasons(product)

  return {
    ...product,
    dataQuality: reviewReasons.length ? 'incomplete' : 'ready',
    reviewSeverity: getReviewSeverity(reviewReasons),
    reviewReasons,
  }
}

function extractProductUrls(sitemapXml) {
  return [...sitemapXml.matchAll(/<loc>(https:\/\/www\.alltec\.cl\/[^<]+\.html)<\/loc>/g)]
    .map(match => decodeHtml(match[1]))
    .filter(url => !/\/(monitores|teclados|mouse|auriculares|parlantes|webcam|sillas|software|impresoras|redes|adaptadores|cables|custom-pc|notebook|tablet|smartphone|lentes|ups)\//.test(url))
    .slice(0, MAX_PRODUCTS)
}

function getReviewReasons(product) {
  const reasons = []
  const text = `${product.name} ${product.categoryName ?? ''} ${product.description}`.toUpperCase()

  if (product.price <= 0) reasons.push('sin precio valido')
  if (product.price > 20_000_000) reasons.push('precio fuera de rango plausible')
  if (product.stock === undefined) reasons.push('sin stock numerico')

  if (product.slot === 'case') {
    if (!product.formFactors?.length) reasons.push('sin formatos compatibles')
    if (!product.maxGPULength) reasons.push('sin largo máximo GPU')
    if (product.maxGPULength === 330 && !/(GPU|VGA|VIDEO)[^0-9]{0,24}330\s*MM/i.test(text)) reasons.push('largo máximo GPU inferido')
    if (product.maxAIOSize === 240 && !/240\s*MM/i.test(text)) reasons.push('tamaño AIO inferido')
  }

  if (product.slot === 'cpu' && !/TDP\)?\s*[0-9]{2,3}\s*W/i.test(text)) reasons.push('TDP inferido')
  if (product.slot === 'motherboard' && !/DDR[345]/i.test(text)) reasons.push('tipo de memoria inferido')
  if (product.slot === 'motherboard' && !/M-?ATX|MICRO ATX|ITX|\bATX\b/i.test(text)) reasons.push('form factor inferido')
  if (product.slot === 'ram' && product.modules === 1 && !/\(?[1-4]\s*x\s*[0-9]{1,3}\s*GB/i.test(text)) reasons.push('cantidad de módulos inferida')
  if (product.slot === 'gpu' && product.length === 300 && !/[0-9]{3}\s*x\s*[0-9]{2,3}\s*x\s*[0-9]{2,3}\s*MM/i.test(text)) reasons.push('largo fisico GPU inferido')
  if (product.slot === 'gpu' && !/[0-9]{3}\s*W/i.test(text)) reasons.push('consumo GPU estimado')
  if (product.slot === 'psu' && product.wattage < 300) reasons.push('wattage fuera de rango plausible')
  if (product.slot === 'psu' && !/BRONZE|GOLD|PLATINUM|TITANIUM/i.test(text)) reasons.push('eficiencia inferida')
  if (product.slot === 'storage' && (product.capacity < 120 || product.capacity > 8000)) reasons.push('capacidad de almacenamiento fuera de rango plausible')
  if (product.slot === 'cooler' && !/TDP[^0-9]{0,10}[0-9]{2,3}\s*W/i.test(text)) reasons.push('TDP máximo cooler inferido')
  if (product.slot === 'cooler' && !/AM4|AM5|LGA[0-9]{4}/i.test(text)) reasons.push('sockets compatibles inferidos')

  return [...new Set(reasons)]
}

function getReviewSeverity(reasons) {
  if (!reasons.length) return undefined
  return reasons.some(reason => /sin |fuera de rango|invalido/i.test(reason)) ? 'critical' : 'warning'
}

function shouldTakeProduct(products, product) {
  if (STRICT_SPECS && product.reviewReasons.length > 0) return false
  if (!PER_SLOT_LIMIT) return true
  const currentCount = products.filter(item => item.slot === product.slot).length
  return currentCount < PER_SLOT_LIMIT
}

function reachedPerSlotLimit(products) {
  if (!PER_SLOT_LIMIT) return false
  return TARGET_SLOTS.every(slot => products.filter(product => product.slot === slot).length >= PER_SLOT_LIMIT)
}

function parseRawProduct(url, html) {
  const root = parse(html)
  const name = parseStringVar(html, 'sharing_name') || getMeta(root, 'og:title') || root.querySelector('h1')?.text.trim()
  const externalId = String(parseNumericVar(html, 'id_product') || url.match(/\/([0-9]+)-/)?.[1] || '')
  const category = parseStringVar(html, 'content_category') ||
    (html.match(/content_category['"]?\s*:\s*['"]([^'"]+)/)?.[1] ?? '') ||
    firstPathSegment(url)
  const rawDescription = getMeta(root, 'og:description') || root.querySelector('#short_description_content')?.text || ''
  const details = root.querySelector('.page-product-box .rte')?.innerHTML ?? root.querySelector('.rte')?.innerHTML ?? ''

  return {
    url,
    externalId,
    sku: parseStringVar(html, 'productReference') || externalId,
    name: normalizeWhitespace(name),
    category: normalizeWhitespace(category.split('>').pop() ?? category),
    price: parseNumericVar(html, 'productPrice') || parseNumber(getMeta(root, 'product:price:amount')),
    stock: parseNumericVar(html, 'quantityAvailable'),
    imageUrl: parseStringVar(html, 'sharing_img') || getMeta(root, 'og:image'),
    description: normalizeWhitespace(rawDescription),
    details: textFromHtml(details),
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'pc-builder-project-demo-scraper/1.0 (+https://www.alltec.cl/)',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  })
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  return response.text()
}

async function main() {
  const startedAt = new Date().toISOString()
  const sitemap = await fetchText(SITEMAP_URL)
  const urls = extractProductUrls(sitemap)
  const products = []
  const rejected = []

  for (const [index, url] of urls.entries()) {
    try {
      const html = await fetchText(url)
      const raw = parseRawProduct(url, html)
      const product = normalizeProduct(raw)
      if (product && shouldTakeProduct(products, product)) products.push(product)
      else if (product && STRICT_SPECS && product.reviewReasons.length > 0) {
        rejected.push({ url, reason: `Strict specs rejected: ${product.reviewReasons.join(', ')}` })
      }
      else if (product) rejected.push({ url, reason: `Per-slot sample limit reached for ${product.slot}` })
      else rejected.push({ url, reason: 'No component slot detected' })
    } catch (error) {
      rejected.push({ url, reason: error instanceof Error ? error.message : 'Unknown error' })
    }

    if ((index + 1) % 25 === 0) {
      console.log(`Processed ${index + 1}/${urls.length}. Components: ${products.length}. Rejected: ${rejected.length}.`)
    }
    if (reachedPerSlotLimit(products)) {
      console.log(`Reached ${PER_SLOT_LIMIT} products per slot after ${index + 1}/${urls.length} URLs.`)
      break
    }
    await sleep(REQUEST_DELAY_MS)
  }

  products.sort((a, b) => a.slot.localeCompare(b.slot) || a.name.localeCompare(b.name))

  const countsBySlot = products.reduce((acc, product) => {
    acc[product.slot] = (acc[product.slot] ?? 0) + 1
    return acc
  }, {})
  const reviewSummary = products.reduce((acc, product) => {
    if (product.reviewSeverity) acc[product.reviewSeverity] = (acc[product.reviewSeverity] ?? 0) + 1
    return acc
  }, {})

  await mkdir('public/data', { recursive: true })
  await writeFile(OUTPUT_FILE, `${JSON.stringify(products, null, 2)}\n`)
  await writeFile(META_FILE, `${JSON.stringify({
    source: SITEMAP_URL,
    startedAt,
    finishedAt: new Date().toISOString(),
    requestedUrls: urls.length,
    maxProducts: MAX_PRODUCTS,
    perSlotLimit: PER_SLOT_LIMIT || null,
    strictSpecs: STRICT_SPECS,
    productCount: products.length,
    rejectedCount: rejected.length,
    countsBySlot,
    reviewSummary,
    rejected,
  }, null, 2)}\n`)

  console.log(`Wrote ${products.length} products to ${OUTPUT_FILE}`)
  console.log(countsBySlot)
  console.log({ reviewSummary })
  if (rejected.length) console.log(`Rejected ${rejected.length}; see ${META_FILE}`)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
