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
    'relative border-2 rounded-lg px-3 py-2 transition-all duration-200 min-h-[52px] flex items-center gap-2',
    isDragging ? 'opacity-30' : '',
    isOver ? 'border-sky-400 bg-sky-900/30 scale-[1.02]' : '',
    !isOver && isEmpty && active ? 'slot-available border-sky-600/60' : '',
    !isOver && isEmpty && !active ? 'border-gray-700/50 bg-gray-900/30' : '',
    !isEmpty && hasIssue ? 'border-red-500/70 bg-red-950/20' : '',
    !isEmpty && !hasIssue ? 'border-green-600/60 bg-green-950/20' : '',
    product ? 'cursor-grab active:cursor-grabbing' : '',
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
        <p className="text-xs text-gray-500 uppercase tracking-wider leading-none">{slotLabels[slot]}</p>
        {product ? (
          <p className="text-xs font-semibold text-gray-200 truncate">{product.name}</p>
        ) : (
          <p className="text-xs text-gray-600 italic">
            {isOver ? '¡Suelta aquí!' : active ? 'Arrastra un componente' : 'Sin seleccionar'}
          </p>
        )}
      </div>
      {product && (
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-sky-400 font-bold">${product.price}</span>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onRemove}
            className="text-gray-600 hover:text-red-400 transition-colors text-sm"
            title="Remover"
          >
            ✕
          </button>
        </div>
      )}
      {hasIssue && (
        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white">!</span>
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
      rounded-2xl border-2 p-4 mb-4 text-center transition-all duration-500
      ${isOver ? 'border-sky-400 bg-sky-900/30 scale-[1.01]' : ''}
      ${!isOver && pc ? 'border-sky-500/60 bg-gradient-to-b from-sky-950/30 to-gray-950/80' : ''}
      ${!isOver && !pc ? 'border-gray-800 bg-gray-900/30' : ''}
    `}>
      {pc ? (
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <CaseIllustration caseId={pc.id} size="lg" />
          </div>
          <div className="text-left flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{pc.brand}</p>
            <p className="text-sm font-bold text-sky-300 leading-tight">{pc.name}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {pc.formFactors.map(f => (
                <span key={f} className="text-xs bg-sky-900/50 text-sky-300 px-2 py-0.5 rounded-full">{f}</span>
              ))}
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">GPU ≤{pc.maxGPULength}mm</span>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">AIO ≤{pc.maxAIOSize}mm</span>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full capitalize">{pc.color}</span>
            </div>
            <button
              onClick={onRemove}
              className="mt-2 text-xs text-gray-600 hover:text-red-400 transition-colors"
            >
              ✕ Cambiar gabinete
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-2">
          <div className={`opacity-20 mb-2 transition-opacity ${isOver ? 'opacity-60' : ''}`}>
            <CaseIllustration caseId="none" size="lg" />
          </div>
          {isOver
            ? <p className="text-sm text-sky-400 font-semibold">¡Suelta el gabinete aquí!</p>
            : <p className="text-sm text-gray-600">Selecciona un gabinete para comenzar</p>
          }
          <p className="text-xs text-gray-700 mt-1">Define el form factor y compatibilidad de toda la build</p>
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
      <div className="flex flex-col gap-2 flex-1">
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
