import { useCallback } from 'react'
import { useDroppable, useDraggable } from '@dnd-kit/core'
import type { SelectedBuild, ComponentSlot, Product } from '../types'
import { slotLabels } from '../data/products'
import { CaseIllustration } from './CaseIllustration'

interface SlotProps {
  slot: ComponentSlot
  product: Product | null
  active: boolean
  hasIssue: boolean
  onRemove: () => void
}

function CaseSlot({ slot, product, active, hasIssue, onRemove }: SlotProps) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `slot-${slot}` })
  const { setNodeRef: setDragRef, attributes, listeners, isDragging } = useDraggable({
    id: `placed-${slot}`,
    data: { product, fromSlot: slot },
    disabled: !product,
  })

  const ref = useCallback((node: HTMLElement | null) => {
    setDropRef(node)
    setDragRef(node)
  }, [setDropRef, setDragRef])

  const isEmpty = !product
  const base = [
    'relative border-2 rounded px-3 py-2 transition-all duration-200 min-h-[52px] flex items-center gap-2 bg-white',
    isDragging ? 'opacity-30' : '',
    isOver ? 'border-blue-500 bg-blue-50 scale-[1.02]' : '',
    !isOver && isEmpty && active ? 'slot-available' : '',
    !isOver && isEmpty && !active ? 'border-gray-200 bg-gray-50' : '',
    !isEmpty && hasIssue ? 'border-red-400 bg-red-50' : '',
    !isEmpty && !hasIssue ? 'border-green-400 bg-green-50' : '',
    product ? 'cursor-grab active:cursor-grabbing shadow-sm' : '',
  ].join(' ')

  return (
    <div
      ref={ref}
      className={base}
      {...(product ? attributes : {})}
      {...(product ? listeners : {})}
    >
      <div className="text-lg shrink-0">
        {product ? product.image : slotIcons[slot]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider leading-none font-bold">{slotLabels[slot]}</p>
        {product ? (
          <p className="text-xs font-bold text-gray-800 truncate">{product.name}</p>
        ) : (
          <p className="text-xs text-gray-400 italic">
            {isOver ? '¡Suelta aquí!' : active ? 'Arrastra un componente' : 'Sin seleccionar'}
          </p>
        )}
      </div>
      {product && (
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-red-600 font-black">${product.price.toLocaleString()}</span>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors text-sm font-bold"
            title="Remover"
          >
            ✕
          </button>
        </div>
      )}
      {hasIssue && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-black">!</span>
      )}
    </div>
  )
}

const slotIcons: Record<string, string> = {
  case: '🖥️', cpu: '🔲', motherboard: '🟫', ram: '📊',
  gpu: '🎮', psu: '⚡', storage: '💾', cooler: '❄️',
}

interface CaseHeaderProps {
  build: SelectedBuild
  onRemove: () => void
}

function CaseHeader({ build, onRemove }: CaseHeaderProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'slot-case' })
  const pc = build.case

  return (
    <div ref={setNodeRef} className={`
      rounded border-2 p-4 mb-3 transition-all duration-300 bg-white
      ${isOver ? 'border-blue-500 bg-blue-50 scale-[1.01]' : ''}
      ${!isOver && pc ? 'border-green-400 shadow-sm' : ''}
      ${!isOver && !pc ? 'border-gray-200' : ''}
    `}>
      {pc ? (
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <CaseIllustration caseId={pc.id} size="lg" />
          </div>
          <div className="text-left flex-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{pc.brand}</p>
            <p className="text-sm font-black text-gray-800 leading-tight">{pc.name}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {pc.formFactors.map(f => (
                <span key={f} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">{f}</span>
              ))}
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">GPU ≤{pc.maxGPULength}mm</span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">AIO ≤{pc.maxAIOSize}mm</span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold capitalize">{pc.color}</span>
            </div>
            <button
              onClick={onRemove}
              className="mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors font-semibold"
            >
              ✕ Cambiar gabinete
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-2">
          <div className={`opacity-20 mb-2 transition-opacity ${isOver ? 'opacity-50' : ''}`}>
            <CaseIllustration caseId="none" size="lg" />
          </div>
          {isOver
            ? <p className="text-sm text-blue-600 font-bold">¡Suelta el gabinete aquí!</p>
            : <p className="text-sm text-gray-400 font-semibold">Selecciona un gabinete para comenzar</p>
          }
          <p className="text-xs text-gray-300 mt-1">Define el form factor y compatibilidad de la build</p>
        </div>
      )}
    </div>
  )
}

interface Props {
  build: SelectedBuild
  activeSlot: ComponentSlot | null
  issues: Array<{ slot: ComponentSlot; severity: string }>
  onRemove: (slot: ComponentSlot) => void
}

const slotPositions: ComponentSlot[] = ['case', 'motherboard', 'cpu', 'cooler', 'ram', 'gpu', 'storage', 'psu']

export function CaseSilhouette({ build, activeSlot, issues, onRemove }: Props) {
  const issueSlots = new Set(issues.filter(i => i.severity === 'error').map(i => i.slot))

  return (
    <div className="flex flex-col h-full">
      <CaseHeader build={build} onRemove={() => onRemove('case')} />
      <div className="flex flex-col gap-1.5 flex-1">
        {slotPositions.filter(s => s !== 'case').map(slot => (
          <CaseSlot
            key={slot}
            slot={slot}
            product={build[slot] as Product | null}
            active={activeSlot === slot || (slot !== 'cpu' && !!build.case)}
            hasIssue={issueSlots.has(slot)}
            onRemove={() => onRemove(slot)}
          />
        ))}
      </div>
    </div>
  )
}
