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
    relative rounded-xl border p-3 cursor-grab active:cursor-grabbing transition-all duration-200
    ${isDragging ? 'opacity-40 scale-95' : ''}
    ${selected ? 'border-green-500 bg-green-950/40 cursor-default' : ''}
    ${!selected && compatible ? 'border-sky-700/50 bg-gray-900 hover:border-sky-500 hover:bg-gray-800' : ''}
    ${!selected && !compatible ? 'border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed' : ''}
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
        <span className="absolute top-2 right-2 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full">
          En build
        </span>
      )}
      {!compatible && !selected && (
        <span className="absolute top-2 right-2 text-xs text-red-400">✗</span>
      )}

      <div className={`flex items-start gap-3 ${isCase ? 'items-center' : ''}`}>
        <div className="shrink-0 flex items-center justify-center">
          {isCase
            ? <CaseIllustration caseId={product.id} size="sm" />
            : <span className="text-2xl">{product.image}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wider">{product.brand}</p>
          <p className="text-sm font-semibold text-gray-100 leading-tight">{product.name}</p>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
          <ProductSpecs product={product} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
        <span className="text-sky-400 font-bold text-sm">${product.price}</span>
        {compatible && !selected && onAdd && (
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onAdd() }}
            className="text-xs bg-sky-700 hover:bg-sky-600 text-white px-2 py-1 rounded-lg transition-colors"
          >
            + Agregar
          </button>
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
    specs.push(`${product.capacity >= 1000 ? (product.capacity/1000).toFixed(1)+'TB' : product.capacity+'GB'}`, product.type)
  } else if (product.slot === 'cooler') {
    specs.push(product.type === 'aio' ? `AIO ${product.aioSize}mm` : 'Aire', `${product.maxTDP}W TDP`)
  } else if (product.slot === 'case') {
    specs.push(product.formFactors.join('/'), `GPU ≤${product.maxGPULength}mm`)
  }

  if (!specs.length) return null
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {specs.map((s, i) => (
        <span key={i} className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">{s}</span>
      ))}
    </div>
  )
}
