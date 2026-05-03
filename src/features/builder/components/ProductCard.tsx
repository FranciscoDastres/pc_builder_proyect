import { useDraggable } from '@dnd-kit/core'
import type { Product } from '../../../types'
import { formatCLP } from '../../../utils/format'
import { CaseIllustration } from './CaseIllustration'

interface Props {
  product: Product
  compatible: boolean
  selected: boolean
  onAdd?: () => void
  draggable?: boolean
  reviewReasons?: string[]
}

export function ProductCard({ product, compatible, selected, onAdd, draggable = true, reviewReasons = [] }: Props) {
  const unavailable = !product.inStock
  const blocked = !compatible || unavailable
  const blockLabel = unavailable ? 'Sin stock' : 'No compatible'
  const blockTitle = unavailable ? 'Producto sin stock disponible' : 'No compatible con tu build actual'
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: draggable ? product.id : `preview-${product.id}`,
    data: { product },
    disabled: !draggable || blocked || selected,
  })

  const baseClass = `
    relative rounded border bg-white transition-all duration-200
    ${isDragging ? 'opacity-40 scale-95' : ''}
    ${selected ? 'border-blue-500 bg-blue-50 cursor-default' : ''}
    ${!selected && !blocked && draggable ? 'border-gray-200 hover:border-blue-400 hover:shadow-md cursor-grab active:cursor-grabbing shadow-sm' : ''}
    ${!selected && !blocked && !draggable ? 'border-gray-200 shadow-sm' : ''}
    ${!selected && blocked ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed' : ''}
  `

  const isCase = product.slot === 'case'
  const showProductImage = Boolean(product.imageUrl)

  return (
    <div
      ref={setNodeRef}
      {...(draggable ? listeners : {})}
      {...(draggable ? attributes : {})}
      className={baseClass}
      title={blocked ? blockTitle : undefined}
    >
      {selected && (
        <div className="absolute top-0 right-0 overflow-hidden w-16 h-16 pointer-events-none">
          <span className="absolute top-3 -right-4 rotate-45 bg-blue-600 text-white text-[9px] font-bold px-6 py-0.5 shadow">
            EN BUILD
          </span>
        </div>
      )}
      {blocked && !selected && (
        <span className={`absolute top-2 right-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
          unavailable ? 'bg-gray-200 text-gray-500' : 'bg-red-50 text-red-500'
        }`}>
          {blockLabel}
        </span>
      )}

      <div className={`p-3 flex items-start gap-3 ${isCase ? 'items-center' : ''}`}>
        <div className="shrink-0 flex items-center justify-center">
          {showProductImage
            ? (
              <img
                src={product.imageUrl}
                alt=""
                loading="lazy"
                className="h-14 w-14 rounded border border-gray-100 bg-white object-contain p-1"
              />
            )
            : isCase
            ? <CaseIllustration caseId={product.id} size="sm" />
            : <span className="text-2xl">{product.image}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{product.brand}</p>
          <p className="text-sm font-bold text-gray-800 leading-tight line-clamp-2">{product.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.description}</p>
          <ProductSpecs product={product} />
          {reviewReasons.length > 0 && (
            <div className="mt-1.5 rounded border border-amber-200 bg-amber-50 px-2 py-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
                Revisar specs
              </p>
              <p className="text-[10px] text-amber-700 line-clamp-1">
                {reviewReasons.slice(0, 2).join(' · ')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-3 pb-3 pt-1 border-t border-gray-100">
        <span className="text-red-600 font-black text-base">{formatCLP(product.price)}</span>
        {!blocked && !selected && onAdd && (
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
