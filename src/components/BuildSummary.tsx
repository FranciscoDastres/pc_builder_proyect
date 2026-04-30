import type { SelectedBuild, CompatibilityIssue } from '../types'

interface Props {
  build: SelectedBuild
  totalPrice: number
  totalWatts: number
  isComplete: boolean
  issues: CompatibilityIssue[]
  onClear: () => void
}

export function BuildSummary({ build, totalPrice, totalWatts, isComplete, issues, onClear }: Props) {
  const filledSlots = Object.values(build).filter(Boolean).length
  const totalSlots = Object.keys(build).length
  const progress = (filledSlots / totalSlots) * 100

  const errors = issues.filter(i => i.severity === 'error')
  const warnings = issues.filter(i => i.severity === 'warning')

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-4">
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-500 font-medium">COMPLETITUD</span>
          <span className="text-xs font-bold text-violet-400">{filledSlots}/{totalSlots}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800/60 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-0.5">Precio Total</p>
          <p className="text-lg font-bold text-violet-400">${totalPrice.toLocaleString()}</p>
        </div>
        <div className={`bg-gray-800/60 rounded-xl p-3 text-center ${totalWatts > 0 ? 'border border-gray-700' : ''}`}>
          <p className="text-xs text-gray-500 mb-0.5">Consumo</p>
          <p className="text-lg font-bold text-cyan-400">{totalWatts}W</p>
        </div>
      </div>

      {/* Issues */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div className="mb-4 space-y-1.5">
          {errors.map((issue, i) => (
            <div key={i} className="flex gap-2 text-xs bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2">
              <span className="text-red-400 shrink-0">✗</span>
              <span className="text-red-300">{issue.message}</span>
            </div>
          ))}
          {warnings.map((issue, i) => (
            <div key={i} className="flex gap-2 text-xs bg-amber-950/40 border border-amber-800/50 rounded-lg px-3 py-2">
              <span className="text-amber-400 shrink-0">⚠</span>
              <span className="text-amber-300">{issue.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Complete state */}
      {isComplete && errors.length === 0 && (
        <div className="mb-4 bg-green-950/40 border border-green-700/50 rounded-xl px-4 py-3 text-center glow-pulse">
          <p className="text-green-400 font-bold text-sm">Build Completa</p>
          <p className="text-xs text-green-500">Tu PC gamer está lista</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onClear}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2.5 rounded-xl transition-colors"
        >
          Limpiar Build
        </button>
        <button
          disabled={!isComplete || errors.length > 0}
          className={`flex-1 text-sm py-2.5 rounded-xl font-semibold transition-all ${
            isComplete && errors.length === 0
              ? 'bg-violet-600 hover:bg-violet-500 text-white cursor-pointer'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          Comprar Build
        </button>
      </div>
    </div>
  )
}
