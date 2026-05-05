import { useMemo, useRef, useState, type UIEvent } from 'react'
import { ProductCard } from './ProductCard'
import { slotLabels, slotOrder } from '../../../data/products'
import type { Product, ComponentSlot, SelectedBuild } from '../../../types'
import { getCatalogView, type ActiveCatalogCategory, type CpuPlatformFilter } from '../utils/catalogView'

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

const HEADER_ROW_HEIGHT = 34
const PRODUCT_ROW_HEIGHT = 178
const OVERSCAN_ROWS = 6

export function ProductCatalog({ products, build, isCompatible, onAdd }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ActiveCatalogCategory>('all')
  const [cpuPlatformFilter, setCpuPlatformFilter] = useState<CpuPlatformFilter>('all')
  const [showOutOfStock, setShowOutOfStock] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const catalogView = useMemo(() => getCatalogView({
    products,
    build,
    activeCategory,
    cpuPlatformFilter,
    searchTerm: search,
    showOutOfStock,
    isCompatible,
  }), [activeCategory, build, cpuPlatformFilter, isCompatible, products, search, showOutOfStock])
  const {
    rows,
    outOfStockBySlot,
    outOfStockCount,
    hiddenBySlot,
    hasSelectedProducts,
    hasVisibleProducts,
    reviewCount,
  } = catalogView
  const rowPositions = useMemo(() => {
    const positions: number[] = []
    let totalHeight = 0

    for (const row of rows) {
      positions.push(totalHeight)
      totalHeight += row.type === 'header' ? HEADER_ROW_HEIGHT : PRODUCT_ROW_HEIGHT
    }

    return { positions, totalHeight }
  }, [rows])
  const visibleRange = useMemo(() => {
    if (!rows.length) return { start: 0, end: 0 }

    const viewportBottom = scrollTop + viewportHeight
    let start = 0
    let end = rows.length - 1

    while (start < rows.length - 1) {
      const rowBottom = rowPositions.positions[start] + (rows[start].type === 'header' ? HEADER_ROW_HEIGHT : PRODUCT_ROW_HEIGHT)
      if (rowBottom >= scrollTop) break
      start += 1
    }

    while (end > 0 && rowPositions.positions[end] > viewportBottom) {
      end -= 1
    }

    return {
      start: Math.max(0, start - OVERSCAN_ROWS),
      end: Math.min(rows.length - 1, end + OVERSCAN_ROWS),
    }
  }, [rowPositions.positions, rows, scrollTop, viewportHeight])
  const visibleRows = rows.slice(visibleRange.start, visibleRange.end + 1)

  function changeCategory(category: ActiveCatalogCategory) {
    setActiveCategory(category)
    setScrollTop(0)
    scrollRef.current?.scrollTo({ top: 0 })
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const target = event.currentTarget
    setScrollTop(target.scrollTop)
    setViewportHeight(target.clientHeight)
  }

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
          onClick={() => changeCategory('all')}
          className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors border ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => changeCategory('review')}
          className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors border ${
            activeCategory === 'review'
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white text-gray-600 border-gray-300 hover:border-amber-400 hover:text-amber-600'
          }`}
        >
          Revision {reviewCount}
        </button>
        {slotOrder.map(slot => (
          <button
            key={slot}
            onClick={() => changeCategory(slot as ComponentSlot)}
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
      <div className="mb-3 flex items-center gap-1.5 rounded border border-gray-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setCpuPlatformFilter('all')}
          className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors border ${
            cpuPlatformFilter === 'all'
              ? 'bg-gray-700 text-white border-gray-700'
              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-800'
          }`}
        >
          Todo
        </button>
        <button
          type="button"
          onClick={() => setCpuPlatformFilter('intel')}
          className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors border ${
            cpuPlatformFilter === 'intel'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          Intel
        </button>
        <button
          type="button"
          onClick={() => setCpuPlatformFilter('amd')}
          className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors border ${
            cpuPlatformFilter === 'amd'
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-red-400 hover:text-red-600'
          }`}
        >
          AMD
        </button>
      </div>

      {outOfStockCount > 0 && (
        <label className="mb-3 flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={showOutOfStock}
            onChange={event => setShowOutOfStock(event.target.checked)}
            className="h-3.5 w-3.5 accent-blue-600"
          />
          Mostrar productos sin stock ({outOfStockCount})
        </label>
      )}

      {hasSelectedProducts && (
        <div className="mb-3 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Mostrando solo productos compatibles con tu build actual.
        </div>
      )}

      {/* Products list */}
      <div
        ref={(node) => {
          scrollRef.current = node
          if (node && viewportHeight === 0) setViewportHeight(node.clientHeight)
        }}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin pr-1"
      >
        {!hasVisibleProducts && (
          <div className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-500">
            {activeCategory === 'review'
              ? 'No hay productos pendientes de revisión para esta búsqueda.'
              : 'No se encontraron componentes para esta búsqueda.'}
          </div>
        )}
        {hasVisibleProducts && (
          <div className="relative" style={{ height: rowPositions.totalHeight }}>
            {visibleRows.map((row, index) => {
              const rowIndex = visibleRange.start + index
              const top = rowPositions.positions[rowIndex]

              if (row.type === 'header') {
                return (
                  <div
                    key={`header-${row.slot}`}
                    className="absolute left-0 right-0 flex items-center gap-2 bg-gray-100/95 py-1"
                    style={{ top, height: HEADER_ROW_HEIGHT }}
                  >
                    <span className="text-base">{categoryIcons[row.slot]}</span>
                    <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest">{slotLabels[row.slot]}</h3>
                    <span className="text-xs text-gray-400">({row.count})</span>
                    {activeCategory !== 'review' && row.reviewCount > 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600">
                        {row.reviewCount} revisión
                      </span>
                    )}
                    {hasSelectedProducts && hiddenBySlot[row.slot] > 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        {hiddenBySlot[row.slot]} ocultos
                      </span>
                    )}
                    {!showOutOfStock && outOfStockBySlot[row.slot] > 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        {outOfStockBySlot[row.slot]} sin stock
                      </span>
                    )}
                  </div>
                )
              }

              const product = row.product
              return (
                <div
                  key={product.id}
                  className="absolute left-0 right-0"
                  style={{ top, height: PRODUCT_ROW_HEIGHT }}
                >
                  <ProductCard
                    product={product}
                    compatible={isCompatible(product, product.slot as ComponentSlot)}
                    selected={build[product.slot as ComponentSlot]?.id === product.id}
                    onAdd={() => onAdd(product)}
                    reviewReasons={row.reasons}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
