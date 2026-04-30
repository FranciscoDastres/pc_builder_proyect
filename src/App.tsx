import { useState, useCallback } from 'react'
import {
  DndContext, DragOverlay, closestCenter,
  type DragStartEvent, type DragEndEvent
} from '@dnd-kit/core'
import type { Product, SelectedBuild, ComponentSlot } from './types'
import { allProducts } from './data/products'
import { useCompatibility } from './hooks/useCompatibility'
import { ProductCatalog } from './components/ProductCatalog'
import { CaseSilhouette } from './components/CaseSilhouette'
import { BuildSummary } from './components/BuildSummary'
import { ProductCard } from './components/ProductCard'
import './index.css'

const emptyBuild: SelectedBuild = {
  case: null, cpu: null, motherboard: null, ram: null,
  gpu: null, psu: null, storage: null, cooler: null,
}

export default function App() {
  const [build, setBuild] = useState<SelectedBuild>(emptyBuild)
  const [dragging, setDragging] = useState<Product | null>(null)

  const { issues, isCompatible, totalWatts, totalPrice, isComplete } = useCompatibility(build)

  const addProduct = useCallback((product: Product) => {
    setBuild(prev => ({ ...prev, [product.slot]: product }))
  }, [])

  const removeProduct = useCallback((slot: ComponentSlot) => {
    setBuild(prev => {
      const next = { ...prev, [slot]: null }
      if (slot === 'case') return { ...next, motherboard: null }
      if (slot === 'cpu') return { ...next, cooler: null, motherboard: null }
      if (slot === 'motherboard') return { ...next, ram: null }
      return next
    })
  }, [])

  const clearBuild = useCallback(() => setBuild(emptyBuild), [])

  const handleDragStart = (e: DragStartEvent) => {
    setDragging(e.active.data.current?.product ?? null)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setDragging(null)
    const product = e.active.data.current?.product as Product | undefined
    const fromSlot = e.active.data.current?.fromSlot as ComponentSlot | undefined
    if (!product) return
    const overId = e.over?.id as string | undefined
    if (fromSlot) {
      if (!overId?.startsWith('slot-')) removeProduct(fromSlot)
      return
    }
    if (!overId?.startsWith('slot-')) return
    const slot = overId.replace('slot-', '') as ComponentSlot
    if (product.slot !== slot) return
    if (!isCompatible(product, slot)) return
    addProduct(product)
  }

  const activeSlot: ComponentSlot | null = dragging ? (dragging.slot as ComponentSlot) : null
  const filledCount = Object.values(build).filter(Boolean).length

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-100 flex flex-col">

        {/* Header blanco estilo Alltec */}
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
                  <div className="text-xl font-black text-red-600">${totalPrice.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>

          {/* Barra de navegación oscura estilo Alltec */}
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

        {/* Main */}
        <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-5 grid grid-cols-[1fr_390px] gap-5 h-[calc(100vh-93px)] overflow-hidden">
          {/* Left: catalog */}
          <div className="flex flex-col overflow-hidden">
            <div className="mb-2.5">
              <h2 className="m-0 text-sm font-black text-gray-800 uppercase tracking-wide">Componentes Disponibles</h2>
              <p className="m-0 text-[11px] text-gray-500">Los componentes en gris no son compatibles con tu selección actual</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <ProductCatalog
                products={allProducts}
                build={build}
                isCompatible={isCompatible}
                onAdd={addProduct}
              />
            </div>
          </div>

          {/* Right: builder */}
          <div className="overflow-y-auto flex flex-col gap-4">
            <div>
              <h2 className="m-0 text-sm font-black text-gray-800 uppercase tracking-wide">Tu Build</h2>
              <p className="mt-0.5 mb-0 text-[11px] text-gray-500">
                {!build.case ? 'Empieza seleccionando un gabinete' : 'Arrastra componentes a los slots'}
              </p>
            </div>
            <CaseSilhouette
              build={build}
              activeSlot={activeSlot}
              issues={issues}
              onRemove={removeProduct}
            />
            <BuildSummary
              build={build}
              totalPrice={totalPrice}
              totalWatts={totalWatts}
              isComplete={isComplete}
              issues={issues}
              onClear={clearBuild}
            />
          </div>
        </main>
      </div>

      <DragOverlay>
        {dragging && (
          <div className="rotate-[2deg] scale-105 opacity-90 w-[280px]">
            <ProductCard product={dragging} compatible={true} selected={false} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
