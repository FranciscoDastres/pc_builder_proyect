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
    if (!product) return
    const overId = e.over?.id as string | undefined
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
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          borderBottom: '1px solid #1f2937',
          background: 'rgba(3,7,18,0.9)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <div style={{ maxWidth: 1600, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 13 }}>
                PC
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f9fafb', lineHeight: 1 }}>PC Builder</h1>
                <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>Arma tu PC gamer — arrastra o haz clic en + Agregar</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 13, color: '#9ca3af' }}>
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>{Object.values(build).filter(Boolean).length}</span>
                <span style={{ color: '#4b5563' }}>/8 componentes</span>
              </span>
              {totalPrice > 0 && (
                <span style={{ fontSize: 15, color: '#a78bfa', fontWeight: 700 }}>${totalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{
          flex: 1,
          maxWidth: 1600,
          margin: '0 auto',
          width: '100%',
          padding: '20px 16px',
          display: 'grid',
          gridTemplateColumns: '1fr 390px',
          gap: 20,
          height: 'calc(100vh - 61px)',
          overflow: 'hidden',
        }}>
          {/* Left: catalog */}
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ marginBottom: 10 }}>
              <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#d1d5db' }}>Componentes en stock</h2>
              <p style={{ margin: 0, fontSize: 11, color: '#4b5563' }}>Los componentes grises no son compatibles con tu selección actual</p>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ProductCatalog
                products={allProducts}
                build={build}
                isCompatible={isCompatible}
                onAdd={addProduct}
              />
            </div>
          </div>

          {/* Right: builder */}
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#d1d5db' }}>Tu Build</h2>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#4b5563' }}>
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
          <div style={{ transform: 'rotate(2deg) scale(1.05)', opacity: 0.92, width: 280 }}>
            <ProductCard product={dragging} compatible={true} selected={false} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
