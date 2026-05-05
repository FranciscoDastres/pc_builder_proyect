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

interface PrintableBuildSummaryInput extends BuildSummaryTextInput {
  statusLabel: string
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

export function createPrintableBuildSummaryDocument({
  build,
  issues,
  totalPrice,
  totalWatts,
  catalogSource,
  createdAt = new Date(),
  statusLabel,
}: PrintableBuildSummaryInput): string {
  const selectedEntries = slotOrder
    .map(slot => [slot, build[slot as ComponentSlot]] as const)
    .filter((entry): entry is readonly [ComponentSlot, Product] => Boolean(entry[1]))
  const pendingSlots = slotOrder.filter(slot => !build[slot as ComponentSlot])
  const stockStatus = selectedEntries.every(([, product]) => product.inStock)
    ? 'Disponible en componentes seleccionados'
    : 'Hay componentes sin stock'
  const issueItems = issues.length === 0
    ? '<li>Sin problemas detectados con los datos actuales.</li>'
    : issues.map(issue => `<li><strong>${issuePrefix(issue.severity)}:</strong> ${escapeHtml(issue.message)}</li>`).join('')

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Build PC Alltec - ${createdAt.toISOString().slice(0, 10)}</title>
  <style>
    :root { color-scheme: light; }
    body { color: #111827; font-family: Arial, sans-serif; margin: 20mm; line-height: 1.45; }
    h1 { font-size: 22px; margin: 0; }
    .topbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .brand { display: flex; align-items: center; gap: 8px; }
    .brand-mark { width: 28px; height: 28px; border-radius: 6px; overflow: hidden; }
    .brand-name { font-size: 18px; font-weight: 900; letter-spacing: .01em; }
    h2 { font-size: 14px; margin: 20px 0 8px; text-transform: uppercase; letter-spacing: .04em; }
    p { margin: 4px 0; }
    .meta { margin-top: 4px; color: #4b5563; font-size: 12px; }
    .status { display: inline-block; margin-top: 10px; border: 1px solid #d1d5db; border-radius: 6px; padding: 4px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 14px; }
    .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; background: #f9fafb; }
    .label { font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; margin: 0; }
    .value { margin: 4px 0 0; font-size: 16px; font-weight: 800; color: #111827; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #e5e7eb; padding: 7px 8px; vertical-align: top; text-align: left; }
    th { background: #f3f4f6; font-size: 11px; text-transform: uppercase; letter-spacing: .03em; }
    .product-cell { display: flex; align-items: flex-start; gap: 6px; }
    .product-icon { font-size: 14px; line-height: 1; margin-top: 1px; }
    .price-cell { white-space: nowrap; font-weight: 700; color: #111827; }
    ul { margin: 8px 0 0; padding-left: 18px; }
    li { margin: 4px 0; }
    .note { margin-top: 16px; border: 1px solid #dbeafe; background: #eff6ff; border-radius: 8px; padding: 10px; font-size: 11px; color: #1e3a8a; }
    @media print { body { margin: 16mm; } }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="alltecGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#0f172a"/>
              <stop offset="100%" stop-color="#1e3a8a"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="64" height="64" rx="12" fill="url(#alltecGrad)"/>
          <path d="M14 46l10-28h6l10 28h-6l-2-6H22l-2 6h-6zm10-11h6l-3-9-3 9z" fill="#ffffff"/>
          <rect x="42" y="18" width="8" height="28" rx="2" fill="#60a5fa"/>
        </svg>
      </div>
      <span class="brand-name">Alltec</span>
    </div>
  </div>
  <h1>Build PC Alltec</h1>
  <p class="meta">Fecha: ${escapeHtml(createdAt.toLocaleString('es-CL'))}</p>
  ${catalogSource ? `<p class="meta">Catálogo: ${escapeHtml(catalogSource)}</p>` : ''}
  <span class="status">${escapeHtml(statusLabel)}</span>

  <section class="stats">
    <div class="card">
      <p class="label">Total estimado</p>
      <p class="value">${escapeHtml(formatCLP(totalPrice))}</p>
    </div>
    <div class="card">
      <p class="label">Consumo estimado</p>
      <p class="value">${totalWatts}W</p>
    </div>
    <div class="card">
      <p class="label">Stock</p>
      <p class="value">${escapeHtml(stockStatus)}</p>
    </div>
    <div class="card">
      <p class="label">Componentes</p>
      <p class="value">${selectedEntries.length}/${slotOrder.length}</p>
    </div>
  </section>

  <h2>Componentes</h2>
  <table>
    <thead>
      <tr>
        <th>Slot</th>
        <th>Producto</th>
        <th>Precio</th>
        <th>Stock</th>
        <th>Especificaciones</th>
      </tr>
    </thead>
    <tbody>
      ${selectedEntries.map(([slot, product]) => `
      <tr>
        <td>${escapeHtml(slotLabels[slot])}</td>
        <td>
          <div class="product-cell">
            <span class="product-icon">${escapeHtml(product.image)}</span>
            <span>${escapeHtml(`${product.brand} ${product.name}`)}</span>
          </div>
        </td>
        <td class="price-cell">${escapeHtml(formatCLP(product.price))}</td>
        <td>${product.inStock ? 'OK' : 'Sin stock'}</td>
        <td>${escapeHtml(getProductSpecs(product).join(' | '))}</td>
      </tr>`).join('')}
      ${pendingSlots.map(slot => `
      <tr>
        <td>${escapeHtml(slotLabels[slot as ComponentSlot])}</td>
        <td>
          <div class="product-cell">
            <span class="product-icon">•</span>
            <span>Pendiente</span>
          </div>
        </td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <h2>Compatibilidad</h2>
  <ul>${issueItems}</ul>

  <p class="note">Nota: precios, stock y specs deben confirmarse contra la fuente oficial antes de una venta.</p>
</body>
</html>`
}
