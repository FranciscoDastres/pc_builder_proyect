import { slotLabels, slotOrder } from '../../../data/products'
import type { CompatibilityIssue, ComponentSlot, Product, SelectedBuild } from '../../../types'
import { formatCLP } from '../../../utils/format'

interface BuildSummaryTextInput {
  build: SelectedBuild
  issues: CompatibilityIssue[]
  totalPrice: number
  totalWatts: number
  catalogSource?: string
  createdAt?: Date
}

function getProductSpecs(product: Product): string[] {
  switch (product.slot) {
    case 'case':
      return [
        `Formatos: ${product.formFactors.join('/')}`,
        `GPU max: ${product.maxGPULength}mm`,
        `AIO max: ${product.maxAIOSize}mm`,
      ]
    case 'cpu':
      return [
        `Socket: ${product.socket}`,
        `Nucleos/hilos: ${product.cores}/${product.threads}`,
        `TDP: ${product.tdp}W`,
      ]
    case 'motherboard':
      return [
        `Socket: ${product.socket}`,
        `Formato: ${product.formFactor}`,
        `RAM: ${product.ramType}`,
      ]
    case 'ram':
      return [
        `Tipo: ${product.type}`,
        `Capacidad: ${product.capacity}GB`,
        `Modulos: ${product.modules}`,
      ]
    case 'gpu':
      return [
        `VRAM: ${product.vram}GB`,
        `Largo: ${product.length}mm`,
        `Consumo: ${product.powerDraw}W`,
      ]
    case 'psu':
      return [
        `Potencia: ${product.wattage}W`,
        `Eficiencia: ${product.efficiency}`,
        `Modular: ${product.modular}`,
      ]
    case 'storage':
      return [
        `Tipo: ${product.type}`,
        `Capacidad: ${product.capacity}GB`,
        `Lectura: ${product.readSpeed}MB/s`,
      ]
    case 'cooler':
      return [
        `Tipo: ${product.type}`,
        `TDP max: ${product.maxTDP}W`,
        `Sockets: ${product.compatibleSockets.join('/')}`,
      ]
  }
}

function issuePrefix(severity: CompatibilityIssue['severity']): string {
  if (severity === 'error') return 'ERROR'
  if (severity === 'warning') return 'WARNING'
  if (severity === 'review') return 'REVISION'
  return 'INFO'
}

export function createBuildSummaryText({
  build,
  issues,
  totalPrice,
  totalWatts,
  catalogSource,
  createdAt = new Date(),
}: BuildSummaryTextInput): string {
  const selectedEntries = slotOrder
    .map(slot => [slot, build[slot as ComponentSlot]] as const)
    .filter((entry): entry is readonly [ComponentSlot, Product] => Boolean(entry[1]))

  const pendingSlots = slotOrder.filter(slot => !build[slot as ComponentSlot])
  const errors = issues.filter(issue => issue.severity === 'error')
  const warnings = issues.filter(issue => issue.severity === 'warning')
  const reviews = issues.filter(issue => issue.severity === 'review')
  const stockStatus = selectedEntries.every(([, product]) => product.inStock)
    ? 'Disponible en componentes seleccionados'
    : 'Hay componentes sin stock'

  const lines = [
    'Build PC Alltec',
    `Fecha: ${createdAt.toLocaleString('es-CL')}`,
    catalogSource ? `Catalogo: ${catalogSource}` : null,
    '',
    `Total estimado: ${formatCLP(totalPrice)}`,
    `Consumo estimado: ${totalWatts}W`,
    `Stock: ${stockStatus}`,
    `Estado: ${errors.length > 0 ? 'Incompatible' : reviews.length > 0 ? 'Requiere revision' : warnings.length > 0 ? 'Compatible con advertencias' : 'Compatible'}`,
    '',
    'Componentes:',
    ...selectedEntries.map(([slot, product]) => {
      const stock = product.inStock ? 'stock OK' : 'sin stock'
      const specs = getProductSpecs(product).join('; ')
      return `- ${slotLabels[slot]}: ${product.brand} ${product.name} | ${formatCLP(product.price)} | ${stock} | ${specs}`
    }),
    ...pendingSlots.map(slot => `- ${slotLabels[slot as ComponentSlot]}: pendiente`),
    '',
    'Compatibilidad:',
    issues.length === 0 ? '- Sin problemas detectados.' : null,
    ...issues.map(issue => `- ${issuePrefix(issue.severity)}: ${issue.message}`),
    '',
    'Nota: precios, stock y specs deben confirmarse contra la fuente oficial antes de una venta.',
  ]

  return lines.filter((line): line is string => line !== null).join('\n')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function createPrintableBuildSummaryHtml(summaryText: string): string {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Build PC Alltec</title>
  <style>
    body { color: #111827; font-family: Arial, sans-serif; margin: 32px; }
    h1 { font-size: 22px; margin: 0 0 16px; }
    pre { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.55; white-space: pre-wrap; }
    @media print { body { margin: 18mm; } }
  </style>
</head>
<body>
  <h1>Build PC Alltec</h1>
  <pre>${escapeHtml(summaryText)}</pre>
</body>
</html>`
}
