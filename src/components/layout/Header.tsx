import { formatCLP } from '../../utils/format'

interface Props {
  filledCount: number
  totalPrice: number
}

export function Header({ filledCount, totalPrice }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div>
            <div className="text-3xl font-black text-gray-900 tracking-tight leading-none">ALLTEC</div>
            <div className="text-[9px] font-bold text-gray-400 tracking-[0.18em] uppercase mt-0.5">San Diego #971 · Santiago</div>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div>
            <div className="text-sm font-bold text-blue-600 uppercase tracking-wide">PC Builder</div>
            <div className="text-[11px] text-gray-400">Arrastra o haz clic en + para armar tu PC</div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-sm text-gray-500">
            <span className="text-blue-600 font-bold text-base">{filledCount}</span>
            <span className="text-gray-400">/8 componentes</span>
          </span>
          {totalPrice > 0 && (
            <div className="text-right">
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">Total build</div>
              <div className="text-xl font-black text-red-600">{formatCLP(totalPrice)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-[1600px] mx-auto px-6 py-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-gray-300">
          <span className="px-3 py-1 rounded hover:bg-gray-700 transition-colors cursor-default">Componentes en Stock</span>
          <span className="text-gray-600 mx-1">|</span>
          <span className="px-3 py-1 rounded hover:bg-gray-700 transition-colors cursor-default">Arrastra para armar</span>
          <span className="text-gray-600 mx-1">|</span>
          <span className="px-3 py-1 rounded hover:bg-gray-700 transition-colors cursor-default">
            {filledCount === 8 ? '✓ Build Completa' : `${8 - filledCount} componentes restantes`}
          </span>
        </div>
      </div>
    </header>
  )
}
