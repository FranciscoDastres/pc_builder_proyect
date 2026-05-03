import { useState, useCallback } from 'react'
import {
  DndContext, DragOverlay, closestCenter,
  type DragStartEvent, type DragEndEvent
} from '@dnd-kit/core'
import type { Product, SelectedBuild, ComponentSlot } from '../types'
import type { QuoteContact, QuoteRequestPayload } from '../types'
import { quoteSnapshotsToRevalidationItems, revalidateActiveCatalogProducts, useProductCatalog } from '../services/catalog'
import { submitMockQuoteRequest } from '../services/quote'
import { useCompatibility } from '../features/builder/hooks/useCompatibility'
import { createQuoteRequestPayload, validateQuoteRequest } from '../domain'
import { ProductCatalog } from '../features/builder/components/ProductCatalog'
import { CaseSilhouette } from '../features/builder/components/CaseSilhouette'
import { BuildSummary } from '../features/builder/components/BuildSummary'
import { ProductCard } from '../features/builder/components/ProductCard'
import { QuoteRequestForm } from '../features/builder/components/QuoteRequestForm'
import { Header } from '../components/layout/Header'

const emptyBuild: SelectedBuild = {
  case: null, cpu: null, motherboard: null, ram: null,
  gpu: null, psu: null, storage: null, cooler: null,
}

function catalogSourceLabel(source: 'alltec-api' | 'alltec-fixture' | 'local-mock' | null): string {
  if (source === 'alltec-api') return 'desde API Alltec'
  if (source === 'alltec-fixture') return 'desde fixture Alltec'
  if (source === 'local-mock') return 'desde mock local'
  return ''
}

export default function Home() {
  const [build, setBuild] = useState<SelectedBuild>(emptyBuild)
  const [dragging, setDragging] = useState<Product | null>(null)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteSubmitting, setQuoteSubmitting] = useState(false)
  const [quoteErrors, setQuoteErrors] = useState<string[]>([])
  const [quoteConfirmation, setQuoteConfirmation] = useState<QuoteRequestPayload | null>(null)
  const { products, loading, error, source } = useProductCatalog()

  const { issues, isCompatible, totalWatts, totalPrice, isComplete } = useCompatibility(build)

  const addProduct = useCallback((product: Product) => {
    setBuild(prev => ({ ...prev, [product.slot]: product }))
    setQuoteConfirmation(null)
  }, [])

  const removeProduct = useCallback((slot: ComponentSlot) => {
    setQuoteConfirmation(null)
    setBuild(prev => {
      const next = { ...prev, [slot]: null }
      if (slot === 'case') return { ...next, motherboard: null }
      if (slot === 'cpu') return { ...next, cooler: null, motherboard: null }
      if (slot === 'motherboard') return { ...next, ram: null }
      return next
    })
  }, [])

  const clearBuild = useCallback(() => {
    setBuild(emptyBuild)
    setQuoteConfirmation(null)
    setQuoteOpen(false)
    setQuoteErrors([])
  }, [])

  const openQuoteRequest = useCallback(() => {
    setQuoteOpen(true)
    setQuoteConfirmation(null)
    setQuoteErrors([])
  }, [])

  const cancelQuoteRequest = useCallback(() => {
    setQuoteOpen(false)
    setQuoteErrors([])
  }, [])

  const resetQuoteRequest = useCallback(() => {
    setQuoteOpen(false)
    setQuoteErrors([])
    setQuoteConfirmation(null)
  }, [])

  const submitQuoteRequest = useCallback(async (contact: QuoteContact) => {
    const validation = validateQuoteRequest(contact, build)
    if (!validation.valid) {
      setQuoteErrors(validation.errors)
      return
    }

    setQuoteSubmitting(true)
    setQuoteErrors([])

    try {
      const payloadDraft = createQuoteRequestPayload(contact, build, issues, source)
      const revalidation = await revalidateActiveCatalogProducts(
        quoteSnapshotsToRevalidationItems(payloadDraft.products),
      )
      const payload = createQuoteRequestPayload(contact, build, issues, source, new Date(), revalidation)
      const result = await submitMockQuoteRequest(payload)
      setQuoteConfirmation(result.payload)
      setQuoteOpen(false)
    } finally {
      setQuoteSubmitting(false)
    }
  }, [build, issues, source])

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
        <Header filledCount={filledCount} totalPrice={totalPrice} />

        <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-5 grid grid-cols-[1fr_390px] gap-5 h-[calc(100vh-93px)] overflow-hidden">
          {/* Left: catalog */}
          <div className="flex flex-col overflow-hidden">
            <div className="mb-2.5">
              <h2 className="m-0 text-sm font-black text-gray-800 uppercase tracking-wide">Componentes Disponibles</h2>
              <p className="m-0 text-[11px] text-gray-500">
                {products.length > 0
                  ? `${products.length} productos ${catalogSourceLabel(source)}`
                  : 'Los componentes en gris no son compatibles con tu selección actual'}
              </p>
            </div>
            <div className="flex-1 overflow-hidden">
              {loading && (
                <div className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-500">
                  Cargando catálogo...
                </div>
              )}
              {error && (
                <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
              {!loading && !error && products.length === 0 && (
                <div className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-500">
                  No hay componentes disponibles.
                </div>
              )}
              {!loading && !error && products.length > 0 && (
                <ProductCatalog
                  products={products}
                  build={build}
                  isCompatible={isCompatible}
                  onAdd={addProduct}
                />
              )}
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
              onRequestQuote={openQuoteRequest}
            />
            <QuoteRequestForm
              open={quoteOpen}
              submitting={quoteSubmitting}
              validationErrors={quoteErrors}
              confirmation={quoteConfirmation}
              onSubmit={submitQuoteRequest}
              onCancel={cancelQuoteRequest}
              onReset={resetQuoteRequest}
            />
          </div>
        </main>
      </div>

      <DragOverlay>
        {dragging && (
          <div className="rotate-[2deg] scale-105 opacity-90 w-[280px]">
            <ProductCard product={dragging} compatible={true} selected={false} draggable={false} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
