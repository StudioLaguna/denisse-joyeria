import { useState } from 'react'
import type { Producto, Categoria } from '../types'
import { Carrusel } from '../components/storefront/Carrusel'
import { ProductCard } from '../components/storefront/ProductCard'
import { CartDrawer } from '../components/storefront/CartDrawer'
import { useStore } from '../hooks/useStore'
import { useCart } from '../hooks/useCart'
import { buildInquiryMessage } from '../lib/whatsapp'

const FILTROS: { id: 'todas' | Categoria; label: string }[] = [
  { id: 'todas', label: 'TODOS' },
  { id: 'acero', label: 'ACERO' },
  { id: 'bisuteria', label: 'BISUTERÍA' },
  { id: 'colecciones', label: 'COLECCIONES' },
]

interface Props {
  onAdminTrigger: () => void
}

export function StorePage({ onAdminTrigger }: Props) {
  const { productos, slides, loading } = useStore()
  const cart = useCart()
  const [filtro, setFiltro] = useState<'todas' | Categoria>('todas')
  const [logoClicks, setLogoClicks] = useState(0)

  const handleLogoClick = () => {
    const next = logoClicks + 1
    setLogoClicks(next)
    if (next >= 5) {
      setLogoClicks(0)
      onAdminTrigger()
    }
  }

  const filtrados = filtro === 'todas'
    ? productos
    : productos.filter((p) => p.categoria === filtro)

  const cartCount = cart.items.reduce((n, i) => n + i.cantidad, 0)

  return (
    <div className="min-h-screen" style={{ background: '#0f0e0c' }}>
      {/* NAV */}
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-10 py-4"
        style={{ background: 'rgba(15,14,12,0.97)', borderBottom: '1px solid rgba(139,107,74,0.12)' }}
      >
        <button onClick={handleLogoClick} className="text-left select-none">
          <span className="font-display text-xl font-light" style={{ color: '#c4a882', fontStyle: 'italic', letterSpacing: '0.12em' }}>
            Denisse
          </span>
          <span className="block" style={{ fontSize: '0.5rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#6b6158' }}>
            JOYERÍA Y BISUTERÍA
          </span>
        </button>

        <div className="flex items-center gap-4">
          <a
            href={buildInquiryMessage()}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-2"
            style={{ color: '#c4a882', fontSize: '0.6rem', letterSpacing: '0.3em', textDecoration: 'none', border: '1px solid rgba(139,107,74,0.35)', padding: '8px 20px', fontFamily: 'Josefin Sans, sans-serif' }}
          >
            <WhatsAppIcon size={12} />
            WHATSAPP
          </a>

          <button
            onClick={() => cart.setOpen(true)}
            className="relative flex items-center gap-2"
            style={{ color: '#f5f2ec', fontSize: '0.6rem', letterSpacing: '0.3em', border: '1px solid rgba(139,107,74,0.35)', padding: '8px 16px', fontFamily: 'Josefin Sans, sans-serif' }}
          >
            PEDIDO
            {cartCount > 0 && (
              <span
                className="flex items-center justify-center w-5 h-5"
                style={{ background: '#8b6b4a', color: '#f5f2ec', borderRadius: '50%', fontSize: '0.6rem' }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* CARRUSEL */}
      <Carrusel slides={slides} />

      {/* HEADER CATÁLOGO */}
      <div className="px-6 md:px-10 pt-14 pb-8">
        <div className="max-w-6xl mx-auto">
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#8b6b4a' }}>
            CATÁLOGO
          </p>
          <h2 className="font-display font-light mt-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#f5f2ec', lineHeight: 1.1 }}>
            Piezas que <em style={{ color: '#c4a882' }}>hablan</em> por sí solas
          </h2>
        </div>
      </div>

      {/* FILTROS */}
      <div className="px-6 md:px-10 pb-8">
        <div className="max-w-6xl mx-auto flex gap-1 flex-wrap">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              style={{
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: '0.6rem',
                letterSpacing: '0.3em',
                padding: '8px 20px',
                border: '1px solid',
                background: filtro === f.id ? '#8b6b4a' : 'transparent',
                color: filtro === f.id ? '#f5f2ec' : '#6b6158',
                borderColor: filtro === f.id ? '#8b6b4a' : 'rgba(139,107,74,0.2)',
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="px-6 md:px-10 pb-20">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl font-light" style={{ color: 'rgba(196,168,130,0.3)' }}>
                Cargando...
              </p>
            </div>
          ) : filtrados.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl font-light" style={{ color: 'rgba(196,168,130,0.3)' }}>
                Sin productos en esta categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px">
              {filtrados.map((p: Producto) => (
                <ProductCard key={p.id} producto={p} onAgregar={cart.agregar} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer
        className="px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(139,107,74,0.15)' }}
      >
        <p className="font-display text-lg font-light" style={{ color: '#c4a882', fontStyle: 'italic' }}>
          Denisse Joyería y Bisutería
        </p>
        <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#6b6158', textTransform: 'uppercase' }}>
          Matamoros, Coahuila — +52 1 871 977 3006
        </p>
        <a
          href="https://www.facebook.com/profile.php?id=61564666229241"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#8b6b4a', textDecoration: 'none', fontFamily: 'Josefin Sans, sans-serif' }}
        >
          FACEBOOK
        </a>
      </footer>

      {/* CART */}
      {cart.open && (
        <CartDrawer
          items={cart.items}
          total={cart.total}
          onClose={() => cart.setOpen(false)}
          onQuitar={cart.quitar}
          onCantidad={cart.cambiarCantidad}
        />
      )}
    </div>
  )
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
