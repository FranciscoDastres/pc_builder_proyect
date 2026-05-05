import { useMemo, useState } from 'react'
import { slotLabels, slotOrder } from '../../../data/products'
import type { CompatibilityIssue, ComponentSlot, Product, SelectedBuild } from '../../../types'
import { formatCLP } from '../../../utils/format'
import { createBuildSummaryText, createPrintableBuildSummaryDocument, createPrintableBuildSummaryHtml } from '../utils/buildSummaryText'

interface Props {
  className?: string
  build: SelectedBuild
  totalPrice: number
  totalWatts: number
  isComplete: boolean
  issues: CompatibilityIssue[]
  catalogSourceLabel: string
  onRequestQuote: () => void
  onSaveBuild: () => void
  onCreateShareUrl: () => string
}

function getIssueTone(severity: CompatibilityIssue['severity']): string {
  if (severity === 'error') return 'border-red-200 bg-red-50 text-red-700'
  if (severity === 'warning') return 'border-amber-200 bg-amber-50 text-amber-700'
  if (severity === 'review') return 'border-blue-200 bg-blue-50 text-blue-700'
  return 'border-gray-200 bg-gray-50 text-gray-700'
}

function getStatusLabel(isComplete: boolean, issues: CompatibilityIssue[]): string {
  if (!isComplete) return 'Build incompleta'
  if (issues.some(issue => issue.severity === 'error')) return 'Incompatible'
  if (issues.some(issue => issue.severity === 'review')) return 'Requiere revisión'
  if (issues.some(issue => issue.severity === 'warning')) return 'Compatible con advertencias'
  return 'Lista para revisar'
}

function getStatusClass(issues: CompatibilityIssue[], isComplete: boolean): string {
  if (!isComplete) return 'border-gray-200 bg-gray-50 text-gray-600'
  if (issues.some(issue => issue.severity === 'error')) return 'border-red-200 bg-red-50 text-red-700'
  if (issues.some(issue => issue.severity === 'review')) return 'border-blue-200 bg-blue-50 text-blue-700'
  if (issues.some(issue => issue.severity === 'warning')) return 'border-amber-200 bg-amber-50 text-amber-700'
  return 'border-green-200 bg-green-50 text-green-700'
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

export function BuildInspector({
  className = '',
  build,
  totalPrice,
  totalWatts,
  isComplete,
  issues,
  catalogSourceLabel,
  onRequestQuote,
  onSaveBuild,
  onCreateShareUrl,
}: Props) {
  const [actionStatus, setActionStatus] = useState<string | null>(null)
  const selectedProducts = slotOrder
    .map(slot => build[slot as ComponentSlot])
    .filter((product): product is Product => Boolean(product))
  const errors = issues.filter(issue => issue.severity === 'error')
  const stockOk = selectedProducts.length > 0 && selectedProducts.every(product => product.inStock)
  const summaryText = useMemo(() => createBuildSummaryText({
    build,
    issues,
    totalPrice,
    totalWatts,
    catalogSource: catalogSourceLabel,
  }), [build, catalogSourceLabel, issues, totalPrice, totalWatts])
  const quoteDisabled = !isComplete || errors.length > 0

  async function handleCopy() {
    await copyText(summaryText)
    setActionStatus('Resumen copiado')
  }

  function handleSaveLocal() {
    onSaveBuild()
    openPdfPrintView()
    setActionStatus('Build guardada y PDF preparado')
  }

  async function handleCopyShareUrl() {
    await copyText(onCreateShareUrl())
    setActionStatus('Link de build copiado')
  }

  function openPdfPrintView() {
    const printWindow = window.open('', '_blank', 'noopener,noreferrer')
    if (!printWindow) {
      setActionStatus('No se pudo abrir la vista PDF')
      return
    }

    const html = createPrintableBuildSummaryDocument({
      build,
      issues,
      totalPrice,
      totalWatts,
      catalogSource: catalogSourceLabel,
      statusLabel: getStatusLabel(isComplete, issues),
      createdAt: new Date(),
    })

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 200)
  }

  function handleExportText() {
    openPdfPrintView()
    setActionStatus('PDF preparado para exportar')
  }

  function handlePrintSummary() {
    const printWindow = window.open('', '_blank', 'noopener,noreferrer')
    if (!printWindow) {
      setActionStatus('No se pudo abrir la vista imprimible')
      return
    }

    printWindow.document.open()
    printWindow.document.write(createPrintableBuildSummaryHtml(summaryText))
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    setActionStatus('Vista imprimible abierta')
  }

  return (
    <div className={`rounded border border-gray-200 bg-white shadow-sm p-4 ${className}`}>
      <div className="mb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
        <span className={`rounded border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${getStatusClass(issues, isComplete)}`}>
          {getStatusLabel(isComplete, issues)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        <div className="rounded border border-gray-200 bg-gray-50 p-3">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Total</p>
          <p className="text-lg font-black text-red-600">{formatCLP(totalPrice)}</p>
        </div>
        <div className="rounded border border-gray-200 bg-gray-50 p-3">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Consumo</p>
          <p className="text-lg font-black text-blue-600">{totalWatts}W</p>
        </div>
        <div className="rounded border border-gray-200 bg-gray-50 p-3">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Stock</p>
          <p className={`text-sm font-black ${stockOk ? 'text-green-700' : 'text-amber-700'}`}>
            {selectedProducts.length === 0 ? 'Sin piezas' : stockOk ? 'Disponible' : 'Revisar'}
          </p>
        </div>
        <div className="rounded border border-gray-200 bg-gray-50 p-3">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Slots</p>
          <p className="text-sm font-black text-gray-800">{selectedProducts.length}/{slotOrder.length}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">Componentes</p>
        <div className="space-y-1.5">
          {slotOrder.map(slot => {
            const product = build[slot as ComponentSlot]
            return (
              <div key={slot} className="flex items-center justify-between gap-2 rounded border border-gray-200 bg-gray-50 px-2.5 py-2">
                <span className="text-xs font-bold text-gray-600">{slotLabels[slot]}</span>
                <span className={`truncate text-right text-xs ${product ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>
                  {product ? `${product.brand} ${product.name}` : 'Pendiente'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">Compatibilidad</p>
        {issues.length === 0 ? (
          <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
            Sin problemas detectados con los datos actuales.
          </div>
        ) : (
          <div className="space-y-1.5">
            {issues.map((issue, index) => (
              <div key={`${issue.severity}-${issue.slot}-${index}`} className={`rounded border px-3 py-2 text-xs ${getIssueTone(issue.severity)}`}>
                <span className="font-black uppercase">{issue.severity}</span>
                <span className="mx-1">·</span>
                {issue.message}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleCopy}
          disabled={selectedProducts.length === 0}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          Copiar
        </button>
        <button
          type="button"
          onClick={handleExportText}
          disabled={selectedProducts.length === 0}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          Exportar PDF
        </button>
        <button
          type="button"
          onClick={handlePrintSummary}
          disabled={selectedProducts.length === 0}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          Imprimir
        </button>
        <button
          type="button"
          onClick={handleSaveLocal}
          disabled={selectedProducts.length === 0}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          Guardar + PDF
        </button>
        <button
          type="button"
          onClick={handleCopyShareUrl}
          disabled={selectedProducts.length === 0}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          Link
        </button>
        <button
          type="button"
          disabled={quoteDisabled}
          onClick={onRequestQuote}
          className="rounded bg-blue-600 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Solicitar
        </button>
      </div>

      {actionStatus && (
        <p className="mt-3 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
          {actionStatus}
        </p>
      )}
    </div>
  )
}
