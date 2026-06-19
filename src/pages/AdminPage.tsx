import { useState } from 'react'
import { useStore } from '../hooks/useStore'
import { CarruselAdmin } from '../components/admin/CarruselAdmin'
import { ProductosAdmin } from '../components/admin/ProductosAdmin'
import { PedidosAdmin } from '../components/admin/PedidosAdmin'

type Tab = 'carrusel' | 'productos' | 'pedidos'

interface Props { onExit: () => void }

const tabStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: 'Josefin Sans, sans-serif',
  fontSize: '0.6rem',
  letterSpacing: '0.35em',
  padding: '12px 24px',
  color: active ? '#c4a882' : '#6b6158',
  borderBottom: `2px solid ${active ? '#8b6b4a' : 'transparent'}`,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
})

export function AdminPage({ onExit }: Props) {
  const [tab, setTab] = useState<Tab>('productos')
  const {
    productos, slides, pedidos, loading,
    crearProducto, actualizarProducto, eliminarProducto,
    crearSlide, actualizarSlide, eliminarSlide,
    actualizarEstadoPedido,
  } = useStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0e0c' }}>
        <p className="font-display text-2xl font-light" style={{ color: 'rgba(196,168,130,0.3)' }}>Cargando...</p>
      </div>
    )
  }

  const stats = [
    { label: 'Productos', value: productos.length },
    { label: 'Disponibles', value: productos.filter((p) => p.disponible).length },
    { label: 'Diapositivas', value: slides.length },
    { label: 'Pedidos', value: pedidos.length },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0f0e0c' }}>
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-10 py-4"
        style={{ background: 'rgba(15,14,12,0.98)', borderBottom: '1px solid rgba(139,107,74,0.2)' }}
      >
        <div>
          <p style={{ fontSize: '0.55rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: '#8b6b4a' }}>
            PANEL DE ADMINISTRACIÓN
          </p>
          <p className="font-display text-xl font-light" style={{ color: '#f5f2ec' }}>Denisse Joyería</p>
        </div>
        <button
          onClick={onExit}
          style={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '0.6rem', letterSpacing: '0.3em', padding: '8px 20px', border: '1px solid rgba(139,107,74,0.3)', color: '#6b6158', background: 'none', cursor: 'pointer' }}
        >
          ← VER TIENDA
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-8" style={{ border: '1px solid rgba(139,107,74,0.15)' }}>
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="font-display text-3xl font-light" style={{ color: '#c4a882' }}>{s.value}</p>
              <p style={{ fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#8b6b4a', marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-0 mb-8" style={{ borderBottom: '1px solid rgba(139,107,74,0.15)' }}>
          {(['productos', 'carrusel', 'pedidos'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>{t.toUpperCase()}</button>
          ))}
        </div>

        {tab === 'carrusel' && <CarruselAdmin slides={slides} onCrear={crearSlide} onActualizar={actualizarSlide} onEliminar={eliminarSlide} />}
        {tab === 'productos' && <ProductosAdmin productos={productos} onCrear={crearProducto} onActualizar={actualizarProducto} onEliminar={eliminarProducto} />}
        {tab === 'pedidos' && <PedidosAdmin pedidos={pedidos} onActualizarEstado={actualizarEstadoPedido} />}
      </div>
    </div>
  )
}
