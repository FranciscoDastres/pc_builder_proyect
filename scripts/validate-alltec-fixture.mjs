import { readFile } from 'node:fs/promises'

const file = process.argv[2] ?? 'public/data/alltec-products.json'
const requiredSlots = ['case', 'cpu', 'motherboard', 'ram', 'gpu', 'psu', 'storage', 'cooler']
const strict = process.env.ALLTEC_VALIDATE_STRICT !== '0'

function fail(message) {
  console.error(message)
  process.exitCode = 1
}

function countBySlot(products) {
  return products.reduce((acc, product) => {
    acc[product.slot] = (acc[product.slot] ?? 0) + 1
    return acc
  }, {})
}

function hasCoreFields(product) {
  return Boolean(
    product.id &&
    product.name &&
    product.slot &&
    typeof product.price === 'number' &&
    product.price > 0 &&
    product.sourceUrl &&
    product.imageUrl,
  )
}

const products = JSON.parse(await readFile(file, 'utf8'))
const counts = countBySlot(products)
const withReviews = products.filter(product => product.reviewReasons?.length || product.reviewSeverity || product.dataQuality !== 'ready')
const missingCoreFields = products.filter(product => !hasCoreFields(product))
const highPrice = products.filter(product => product.price > 20_000_000)
const badStorage = products.filter(product => product.slot === 'storage' && (product.capacity < 120 || product.capacity > 8000))

console.log({
  file,
  productCount: products.length,
  counts,
  ready: products.filter(product => product.dataQuality === 'ready').length,
  withReviews: withReviews.length,
  missingCoreFields: missingCoreFields.length,
  highPrice: highPrice.length,
  badStorage: badStorage.length,
})

if (!Array.isArray(products)) fail('Fixture must be a JSON array.')
if (missingCoreFields.length) fail(`Products missing core fields: ${missingCoreFields.map(product => product.id).join(', ')}`)
if (highPrice.length) fail(`Products with implausible prices: ${highPrice.map(product => product.id).join(', ')}`)
if (badStorage.length) fail(`Storage products with implausible capacity: ${badStorage.map(product => product.id).join(', ')}`)

if (strict && withReviews.length) {
  fail(`Strict fixture contains products with review reasons: ${withReviews.map(product => product.id).join(', ')}`)
}

const missingSlots = requiredSlots.filter(slot => !counts[slot])
if (missingSlots.length) {
  console.warn(`Missing slots: ${missingSlots.join(', ')}`)
}
