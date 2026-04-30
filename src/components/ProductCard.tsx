import { useDraggable } from '@dnd-kit/core'
import type { Product } from '../types'
import { CaseIllustration } from './CaseIllustration'

interface Props {
  product: Product
  compatible: boolean
  selected: boolean
  onAdd?: () => void
}

export function ProductCard({ product, compatible, selected, onAdd }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: product.id,
    data: { product },
    disabled: !compatible || selected,
  })

  const baseClass = `
    relative rounded border bg-white transition-all duration-200
    ${isDragging ? 'opacity-40 scale-95' : ''}
    ${selected ? 'border-blue-500 bg-blue-50 cursor-default' : ''}
    ${!selected && compatible ? 'border-gray-200 hover:border-blue-400 hover:shadow-md cursor-grab active:cursor-grabbing shadow-sm' : ''}
    ${!selected && !compatible ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed' : ''}
  `

  const isCase = product.slot === 'case'

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={baseClass}
      title={!compatible ? 'No compatible con tu build actual' : undefined}
    >
      {selected && (
        <div className="absolute top-0 right-0 overflow-hidden w-16 h-16 pointer-events-none">
          <span className="absolute top-3 -right-4 rotate-45 bg-blue-600 text-white text-[9px] font-bold px-6 py-0.5 shadow">
            EN BUILD
          </span>
        </div>
      )}
      {!compatible && !selected && (
        <span className="absolute top-2 right-2 text-xs text-red-400">✗</span>
      )}

      <div className={`p-3 flex items-start gap-3 ${isCase ? 'items-center' : ''}`}>
        <div className="shrink-0 flex items-center justify-center">
          {isCase
            ? <CaseIllustration caseId={product.id} size="sm" />
            : <span className="text-2xl">{product.image}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{product.brand}</p>
          <p className="text-sm font-bold text-gray-800 leading-tight">{product.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.description}</p>
          <ProductSpecs product={product} />
        </div>
      </div>

      <div className="flex items-center justify-between px-3 pb-3 pt-1 border-t border-gray-100">
        <span className="text-red-600 font-black text-base">${product.price.toLocaleString()}</span>
        {compatible && !selected && onAdd && (
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onAdd() }}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded font-semibold transition-colors"
          >
            + Agregar
          </button>
        )}
        {selected && (
          <span className="text-xs text-blue-600 font-semibold">Seleccionado ✓</span>
        )}
      </div>
    </div>
  )
}

function ProductSpecs({ product }: { product: Product }) {
  const specs: string[] = []

  if (product.slot === 'cpu') {
    specs.push(`${product.cores}C/${product.threads}T`, `${product.boostClock}GHz`, product.socket)
  } else if (product.slot === 'motherboard') {
    specs.push(product.socket, product.formFactor, product.ramType)
  } else if (product.slot === 'ram') {
    specs.push(`${product.capacity}GB`, `DDR${product.frequency >= 4000 ? '5' : '4'}-${product.frequency}`, product.latency)
  } else if (product.slot === 'gpu') {
    specs.push(`${product.vram}GB VRAM`, product.series)
  } else if (product.slot === 'psu') {
    specs.push(`${product.wattage}W`, product.efficiency)
  } else if (product.slot === 'storage') {
    specs.push(`${product.capacity >= 1000 ? (product.capacity / 1000).toFixed(1) + 'TB' : product.capacity + 'GB'}`, product.type)
  } else if (product.slot === 'cooler') {
    specs.push(product.type === 'aio' ? `AIO ${product.aioSize}mm` : 'Aire', `${product.maxTDP}W TDP`)
  } else if (product.slot === 'case') {
    specs.push(product.formFactors.join('/'), `GPU ≤${product.maxGPULength}mm`)
  }

  if (!specs.length) return null
  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {specs.map((s, i) => (
        <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{s}</span>
      ))}
    </div>
  )
}
