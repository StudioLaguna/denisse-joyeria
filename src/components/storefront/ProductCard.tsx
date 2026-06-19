import { useState } from 'react'
import type { Producto } from '../../types'

const ICONOS: Record<string, string> = { acero: '⬡', bisuteria: '◇', colecciones: '◈' }

interface Props {
  producto: Producto
  onAgregar: (p: Producto) => void
}

export function ProductCard({ producto, onAgregar }: Props) {
  const [hover, setHover] = useState(false)
  const hasImage = producto.imagen_url && producto.imagen_url.length > 10

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: '#151311' }}
    >
      {/* Imagen */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: '#1a1510' }}>
        {hasImage ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hover ? 'scale(1.05)' : 'scale(1)' }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(160deg, #1a1510, #0f0e0c)' }}
          >
            <span className="text-4xl" style={{ opacity: 0.15 }}>{ICONOS[producto.categoria] ?? '◇'}</span>
          </div>
        )}

        {/* Overlay con botón */}
        <div
          className="absolute inset-0 flex items-end p-4 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(15,14,12,0.9) 0%, transparent 60%)',
            opacity: hover ? 1 : 0,
          }}
        >
          {producto.disponible && (
            <button
              onClick={() => onAgregar(producto)}
              className="w-full py-2.5 text-xs transition-all"
              style={{
                background: '#8b6b4a',
                color: '#f5f2ec',
                fontFamily: 'Josefin Sans, sans-serif',
                letterSpacing: '0.3em',
              }}
            >
              AGREGAR AL PEDIDO
            </button>
          )}
        </div>

        {/* Badges */}
        {producto.destaca && (
          <div
            className="absolute top-3 left-3 px-2 py-0.5"
            style={{ background: '#8b6b4a', color: '#f5f2ec', fontSize: '0.5rem', letterSpacing: '0.3em' }}
          >
            DESTACADO
          </div>
        )}
        {!producto.disponible && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(15,14,12,0.7)' }}
          >
            <span style={{ color: '#6b6158', fontSize: '0.6rem', letterSpacing: '0.35em' }}>SIN STOCK</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-light text-lg leading-tight mb-1" style={{ color: '#f5f2ec' }}>
          {producto.nombre}
        </h3>
        <p className="text-xs leading-relaxed mb-3" style={{ color: '#6b6158', letterSpacing: '0.04em' }}>
          {producto.descripcion}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display text-xl" style={{ color: '#c4a882' }}>
            ${producto.precio}
            <span className="text-xs ml-1 font-sans" style={{ color: '#6b6158' }}>MXN</span>
          </span>
          <span style={{ color: '#6b6158', fontSize: '0.5rem', letterSpacing: '0.3em' }}>
            {producto.categoria.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}
