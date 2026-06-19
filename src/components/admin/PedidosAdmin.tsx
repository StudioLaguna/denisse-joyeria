import type { Pedido, EstadoPedido } from '../../types'
import { Label, Select, btnSecondary } from '../ui/AdminControls'

const ESTADOS: { id: EstadoPedido; label: string; color: string }[] = [
  { id: 'nuevo', label: 'Nuevo', color: '#c4a882' },
  { id: 'confirmado', label: 'Confirmado', color: '#8b6b4a' },
  { id: 'preparando', label: 'Preparando', color: '#6b9ac4' },
  { id: 'enviado', label: 'Enviado', color: '#7ab87a' },
  { id: 'entregado', label: 'Entregado', color: '#4a7a4a' },
  { id: 'cancelado', label: 'Cancelado', color: '#dc2626' },
]

const estadoInfo = (id: EstadoPedido) => ESTADOS.find((e) => e.id === id) ?? ESTADOS[0]

interface Props {
  pedidos: Pedido[]
  onActualizarEstado: (id: string, estado: EstadoPedido) => Promise<unknown>
}

export function PedidosAdmin({ pedidos, onActualizarEstado }: Props) {
  const ordenados = [...pedidos].sort((a, b) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0
    const db = b.created_at ? new Date(b.created_at).getTime() : 0
    return db - da
  })

  return (
    <div>
      <div className="mb-6">
        <Label>PEDIDOS RECIBIDOS</Label>
        <h3 className="font-display text-2xl font-light" style={{ color: '#f5f2ec' }}>
          {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
        </h3>
      </div>

      <div className="space-y-3">
        {ordenados.map((p) => {
          const info = estadoInfo(p.estado)
          const fecha = p.created_at ? new Date(p.created_at).toLocaleString('es-MX', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
          }) : ''

          return (
            <div key={p.id} className="p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(139,107,74,0.12)' }}>
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <p className="font-display text-lg font-light" style={{ color: '#f5f2ec' }}>
                    {p.cliente_nombre || 'Cliente sin nombre'}
                  </p>
                  <p className="text-xs" style={{ color: '#6b6158' }}>{p.cliente_telefono}</p>
                  {fecha && <p className="text-xs mt-1" style={{ color: '#6b6158' }}>{fecha}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display text-xl font-light" style={{ color: '#c4a882' }}>
                    ${p.total.toLocaleString('es-MX')} MXN
                  </p>
                  <div className="mt-2 flex items-center gap-2 justify-end">
                    <span
                      className="text-xs px-2 py-1"
                      style={{ background: `${info.color}22`, color: info.color, letterSpacing: '0.2em', fontSize: '0.55rem', textTransform: 'uppercase' }}
                    >
                      {info.label}
                    </span>
                    <Select
                      value={p.estado}
                      onChange={(e) => onActualizarEstado(p.id, e.target.value as EstadoPedido)}
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '0.65rem' }}
                    >
                      {ESTADOS.map((e) => (
                        <option key={e.id} value={e.id} style={{ background: '#1a1510' }}>{e.label}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-2">
                {p.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs" style={{ color: '#a89e94' }}>
                    <span>{item.cantidad}× {item.nombre}</span>
                    <span>${(item.precio * item.cantidad).toLocaleString('es-MX')}</span>
                  </div>
                ))}
              </div>

              {p.notas && (
                <p className="text-xs mt-2 italic" style={{ color: '#6b6158' }}>Nota: {p.notas}</p>
              )}
            </div>
          )
        })}
        {pedidos.length === 0 && (
          <p className="text-xs py-8 text-center" style={{ color: '#6b6158' }}>
            Aún no hay pedidos. Aparecerán aquí cuando los clientes ordenen por WhatsApp.
          </p>
        )}
      </div>
    </div>
  )
}

export { btnSecondary as _unusedExport }
