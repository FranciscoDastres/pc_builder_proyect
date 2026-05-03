import type { SelectedBuild, CompatibilityIssue } from '../../../types'
import { formatCLP } from '../../../utils/format'

interface Props {
  build: SelectedBuild
  totalPrice: number
  totalWatts: number
  isComplete: boolean
  issues: CompatibilityIssue[]
  onClear: () => void
  onRequestQuote: () => void
}

export function BuildSummary({ build, totalPrice, totalWatts, isComplete, issues, onClear, onRequestQuote }: Props) {
  const filledSlots = Object.values(build).filter(Boolean).length
  const totalSlots = Object.keys(build).length
  const progress = (filledSlots / totalSlots) * 100

  const errors = issues.filter(i => i.severity === 'error')
  const warnings = issues.filter(i => i.severity === 'warning')
  const reviewIssues = issues.filter(i => i.severity === 'review')

  return (
    <div className="rounded border border-gray-200 bg-white shadow-sm p-4">
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Completitud</span>
          <span className="text-xs font-black text-blue-600">{filledSlots}/{totalSlots} componentes</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Precio Total</p>
          <p className="text-xl font-black text-red-600">{formatCLP(totalPrice)}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Consumo</p>
          <p className="text-xl font-black text-blue-600">{totalWatts}W</p>
        </div>
      </div>

      {/* Issues */}
      {(errors.length > 0 || warnings.length > 0 || reviewIssues.length > 0) && (
        <div className="mb-4 space-y-1.5">
          {errors.map((issue, i) => (
            <div key={i} className="flex gap-2 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">
              <span className="text-red-500 shrink-0 font-bold">✗</span>
              <span className="text-red-700">{issue.message}</span>
            </div>
          ))}
          {warnings.map((issue, i) => (
            <div key={i} className="flex gap-2 text-xs bg-amber-50 border border-amber-200 rounded px-3 py-2">
              <span className="text-amber-500 shrink-0 font-bold">⚠</span>
              <span className="text-amber-700">{issue.message}</span>
            </div>
          ))}
          {reviewIssues.map((issue, i) => (
            <div key={i} className="flex gap-2 text-xs bg-blue-50 border border-blue-200 rounded px-3 py-2">
              <span className="text-blue-500 shrink-0 font-bold">i</span>
              <span className="text-blue-700">{issue.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Complete state */}
      {isComplete && errors.length === 0 && (
        <div className="mb-4 bg-green-50 border border-green-300 rounded px-4 py-3 text-center glow-pulse">
          <p className="text-green-700 font-black text-sm uppercase tracking-wide">✓ Build Completa</p>
          <p className="text-xs text-green-600 mt-0.5">Tu PC gamer está lista para solicitar armado</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onClear}
          className="flex-1 bg-white hover:bg-gray-50 text-gray-600 text-sm py-2.5 rounded border border-gray-300 font-semibold transition-colors"
        >
          Limpiar Build
        </button>
        <button
          disabled={!isComplete || errors.length > 0}
          onClick={onRequestQuote}
          className={`flex-1 text-sm py-2.5 rounded font-black uppercase tracking-wide transition-all ${
            isComplete && errors.length === 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          Solicitar Armado
        </button>
      </div>
    </div>
  )
}
