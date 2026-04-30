import { useState } from 'react'
import { ProductCard } from './ProductCard'
import { slotLabels, slotOrder } from '../../../data/products'
import type { Product, ComponentSlot, SelectedBuild } from '../../../types'

interface Props {
  products: Product[]
  build: SelectedBuild
  isCompatible: (product: Product, slot: ComponentSlot) => boolean
  onAdd: (product: Product) => void
}

const categoryIcons: Record<string, string> = {
  case: '🖥️', cpu: '🔲', motherboard: '🟫', ram: '📊',
  gpu: '🎮', psu: '⚡', storage: '💾', cooler: '❄️',
}

export function ProductCatalog({ products, build, isCompatible, onAdd }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ComponentSlot | 'all'>('all')

  const grouped = slotOrder.reduce<Record<string, Product[]>>((acc, slot) => {
    acc[slot] = products.filter(p => p.slot === slot)
    return acc
  }, {})

  const filtered = (slot: string) =>
    grouped[slot]?.filter(p =>
      !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    ) ?? []

  const visibleSlots = activeCategory === 'all'
    ? slotOrder
    : slotOrder.filter(s => s === activeCategory)

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="mb-3 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Buscar componente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded px-9 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors border ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          Todos
        </button>
        {slotOrder.map(slot => (
          <button
            key={slot}
            onClick={() => setActiveCategory(slot as ComponentSlot)}
            className={`px-2.5 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors border flex items-center gap-1 ${
              activeCategory === slot
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            <span>{categoryIcons[slot]}</span>
            <span className="hidden sm:inline">{slotLabels[slot]}</span>
          </button>
        ))}
      </div>

      {/* Products list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-1">
        {visibleSlots.map(slot => {
          const items = filtered(slot)
          if (!items.length) return null
          return (
            <div key={slot}>
              <div className="flex items-center gap-2 mb-2 sticky top-0 bg-gray-100/95 py-1 z-10">
                <span className="text-base">{categoryIcons[slot]}</span>
                <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest">{slotLabels[slot]}</h3>
                <span className="text-xs text-gray-400">({items.length})</span>
              </div>
              <div className="space-y-2">
                {items.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    compatible={isCompatible(p, p.slot as ComponentSlot)}
                    selected={build[p.slot as ComponentSlot]?.id === p.id}
                    onAdd={() => onAdd(p)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
