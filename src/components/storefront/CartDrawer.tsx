import type { CartItem } from '../../types'
import { buildOrderMessage } from '../../lib/whatsapp'

interface Props {
  items: CartItem[]
  total: number
  onClose: () => void
  onQuitar: (id: string) => void
  onCantidad: (id: string, cantidad: number) => void
}

export function CartDrawer({ items, total, onClose, onQuitar, onCantidad }: Props) {
  const waUrl = buildOrderMessage(items)

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1" style={{ background: 'rgba(0,0,0,0.65)' }} onClick={onClose} />

      {/* Panel */}
      <div
        className="slide-in w-full flex flex-col"
        style={{
          maxWidth: 420,
          background: '#0f0e0c',
          borderLeft: '1px solid rgba(139,107,74,0.2)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid rgba(139,107,74,0.15)' }}
        >
          <div>
            <p className="text-xs" style={{ color: '#8b6b4a', letterSpacing: '0.45em' }}>PEDIDO</p>
            <h3 className="font-display text-2xl font-light" style={{ color: '#f5f2ec' }}>Tu selección</h3>
          </div>
          <button onClick={onClose} style={{ color: '#6b6158', fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-xl font-light" style={{ color: 'rgba(196,168,130,0.3)' }}>
                Ningún producto agregado
              </p>
              <p className="text-xs mt-2" style={{ color: '#6b6158' }}>
                Navega el catálogo y agrega piezas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const hasImage = item.producto.imagen_url && item.producto.imagen_url.length > 10
                return (
                  <div
                    key={item.producto.id}
                    className="flex gap-3 pb-4"
                    style={{ borderBottom: '1px solid rgba(139,107,74,0.1)' }}
                  >
                    <div className="w-16 h-16 flex-shrink-0" style={{ background: '#1a1510' }}>
                      {hasImage && (
                        <img src={item.producto.imagen_url} className="w-full h-full object-cover" alt={item.producto.nombre} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-base font-light leading-tight" style={{ color: '#f5f2ec' }}>
                        {item.producto.nombre}
                      </p>
                      <p className="font-display text-base mt-1" style={{ color: '#c4a882' }}>
                        ${item.producto.precio * item.cantidad}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onCantidad(item.producto.id, item.cantidad - 1)}
                          className="w-6 h-6 flex items-center justify-center border text-xs"
                          style={{ borderColor: 'rgba(139,107,74,0.3)', color: '#c4a882' }}
                        >−</button>
                        <span className="text-sm w-4 text-center" style={{ color: '#f5f2ec' }}>{item.cantidad}</span>
                        <button
                          onClick={() => onCantidad(item.producto.id, item.cantidad + 1)}
                          className="w-6 h-6 flex items-center justify-center border text-xs"
                          style={{ borderColor: 'rgba(139,107,74,0.3)', color: '#c4a882' }}
                        >+</button>
                        <button
                          onClick={() => onQuitar(item.producto.id)}
                          className="ml-auto text-xs"
                          style={{ color: '#6b6158' }}
                        >Eliminar</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(139,107,74,0.15)' }}>
            <div className="flex justify-between mb-5">
              <span className="text-xs" style={{ color: '#8b6b4a', letterSpacing: '0.45em' }}>TOTAL ESTIMADO</span>
              <span className="font-display text-2xl font-light" style={{ color: '#c4a882' }}>${total} MXN</span>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-pulse flex items-center justify-center gap-3 w-full py-3.5 text-xs transition-all"
              style={{
                background: '#8b6b4a',
                color: '#f5f2ec',
                fontFamily: 'Josefin Sans, sans-serif',
                letterSpacing: '0.3em',
                textDecoration: 'none',
              }}
            >
              <WhatsAppIcon />
              ENVIAR PEDIDO POR WHATSAPP
            </a>
            <p className="text-xs text-center mt-3" style={{ color: '#6b6158' }}>
              Los precios son orientativos y se confirman al contactar.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
