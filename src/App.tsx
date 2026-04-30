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

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-950 flex flex-col">
        {/* Header */}
        <header className="border-b border-[#0c2a3e] bg-gray-950/[0.97] backdrop-blur sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-6 py-[10px] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex items-center gap-[7px] bg-gradient-to-br from-[#0369a1] to-sky-500 rounded-lg px-3 py-[7px]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="13" rx="2"/>
                  <path d="M8 21h8M12 16v5"/>
                </svg>
                <span className="text-[13px] font-black text-white tracking-[0.14em]">ALLTEC</span>
              </div>
              <div className="border-l border-[#1e3a5f] pl-3.5">
                <h1 className="m-0 text-sm font-bold text-slate-200 leading-none">PC Builder</h1>
                <p className="m-0 text-[11px] text-slate-600">Arrastra o haz clic en + para armar tu PC</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[13px] text-slate-400">
                <span className="text-sky-400 font-bold">{Object.values(build).filter(Boolean).length}</span>
                <span className="text-slate-700">/8 componentes</span>
              </span>
              {totalPrice > 0 && (
                <span className="text-[15px] text-sky-400 font-bold">${totalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-5 grid grid-cols-[1fr_390px] gap-5 h-[calc(100vh-61px)] overflow-hidden">
          {/* Left: catalog */}
          <div className="flex flex-col overflow-hidden">
            <div className="mb-2.5">
              <h2 className="m-0 text-[13px] font-bold text-gray-300">Componentes en stock</h2>
              <p className="m-0 text-[11px] text-gray-600">Los componentes grises no son compatibles con tu selección actual</p>
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
              <h2 className="m-0 text-[13px] font-bold text-gray-300">Tu Build</h2>
              <p className="mt-0.5 mb-0 text-[11px] text-gray-600">
                {!build.case ? 'Empieza seleccionando un gabinete' : 'Arrastra componentes a los slots del gabinete'}
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
          <div className="rotate-[2deg] scale-105 opacity-[0.92] w-[280px]">
            <ProductCard product={dragging} compatible={true} selected={false} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
