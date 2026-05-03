import { useState, type FormEvent } from 'react'
import type { QuoteContact, QuoteRequestPayload } from '../../../types'
import { formatCLP } from '../../../utils/format'

interface Props {
  open: boolean
  submitting: boolean
  validationErrors: string[]
  confirmation: QuoteRequestPayload | null
  onSubmit: (contact: QuoteContact) => void
  onCancel: () => void
  onReset: () => void
}

const initialContact: QuoteContact = {
  name: '',
  emailOrPhone: '',
  comuna: '',
  comment: '',
}

export function QuoteRequestForm({
  open,
  submitting,
  validationErrors,
  confirmation,
  onSubmit,
  onCancel,
  onReset,
}: Props) {
  const [contact, setContact] = useState<QuoteContact>(initialContact)

  if (!open && !confirmation) return null

  function updateContact(field: keyof QuoteContact, value: string) {
    setContact(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(contact)
  }

  if (confirmation) {
    const reviewCount = confirmation.products.filter(product => product.reviewReasons?.length).length
    const revalidation = confirmation.validation.revalidation

    return (
      <div className="rounded border border-green-300 bg-white shadow-sm p-4">
        <div className="mb-3">
          <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Solicitud mock enviada</p>
          <h3 className="text-base font-black text-gray-900 mt-0.5">{confirmation.id}</h3>
          <p className="text-xs text-gray-500 mt-1">
            Quedo listo el payload local para que Alltec revise la build y contacte al cliente.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded border border-gray-200 bg-gray-50 p-2">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Total estimado</p>
            <p className="text-sm font-black text-red-600">{formatCLP(confirmation.totals.price)}</p>
          </div>
          <div className="rounded border border-gray-200 bg-gray-50 p-2">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Productos</p>
            <p className="text-sm font-black text-blue-600">{confirmation.products.length}</p>
          </div>
        </div>

        {reviewCount > 0 && (
          <div className="mb-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            {reviewCount} productos tienen specs estimadas en el fixture demo.
          </div>
        )}
        {revalidation && !revalidation.ok && (
          <div className="mb-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            La revalidación mock detectó cambios o productos no disponibles. Alltec debería confirmar antes de vender.
          </div>
        )}

        <div className="mb-3 rounded border border-gray-200 bg-gray-50 p-2">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Contacto</p>
          <p className="text-xs text-gray-800 font-semibold">{confirmation.contact.name}</p>
          <p className="text-xs text-gray-500">{confirmation.contact.emailOrPhone} · {confirmation.contact.comuna}</p>
        </div>

        <button
          onClick={() => {
            setContact(initialContact)
            onReset()
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded font-black uppercase tracking-wide transition-colors"
        >
          Crear otra solicitud
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded border border-gray-200 bg-white shadow-sm p-4">
      <div className="mb-3">
        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Solicitud comercial</p>
        <h3 className="text-base font-black text-gray-900 mt-0.5">Datos de contacto</h3>
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-3 space-y-1">
          {validationErrors.map(error => (
            <div key={error} className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2.5">
        <label className="block">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1">Nombre</span>
          <input
            value={contact.name}
            onChange={event => updateContact('name', event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Nombre y apellido"
          />
        </label>
        <label className="block">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1">Email o telefono</span>
          <input
            value={contact.emailOrPhone}
            onChange={event => updateContact('emailOrPhone', event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="correo@dominio.cl o +56 9..."
          />
        </label>
        <label className="block">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1">Comuna</span>
          <input
            value={contact.comuna}
            onChange={event => updateContact('comuna', event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Santiago"
          />
        </label>
        <label className="block">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1">Comentario opcional</span>
          <textarea
            value={contact.comment}
            onChange={event => updateContact('comment', event.target.value)}
            maxLength={400}
            rows={3}
            className="w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Uso principal, presupuesto, preferencias..."
          />
        </label>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white hover:bg-gray-50 text-gray-600 text-sm py-2.5 rounded border border-gray-300 font-semibold transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm py-2.5 rounded font-black uppercase tracking-wide transition-colors"
        >
          {submitting ? 'Enviando...' : 'Enviar Mock'}
        </button>
      </div>
    </form>
  )
}
