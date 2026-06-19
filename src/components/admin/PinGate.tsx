import { useState } from 'react'
import { btnPrimary } from '../ui/AdminControls'

const PIN_CORRECTO = '454647'

interface Props {
  onSuccess: () => void
  onCancel: () => void
}

export function PinGate({ onSuccess, onCancel }: Props) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const intentar = () => {
    if (pin === PIN_CORRECTO) {
      onSuccess()
    } else {
      setError(true)
      setShake(true)
      setPin('')
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#0f0e0c' }}>
      <div
        className={`border p-12 max-w-sm w-full mx-4 ${shake ? 'animate-bounce' : ''}`}
        style={{ borderColor: 'rgba(139,107,74,0.3)', background: 'rgba(74,53,32,0.12)' }}
      >
        <div className="text-center mb-10">
          <p className="text-xs mb-1" style={{ color: '#8b6b4a', letterSpacing: '0.45em' }}>ACCESO RESTRINGIDO</p>
          <h2 className="font-display text-3xl font-light" style={{ color: '#f5f2ec' }}>Área del dueño</h2>
          <p className="text-xs mt-3 leading-relaxed" style={{ color: '#6b6158' }}>
            Ingresa el PIN para administrar productos, carrusel y pedidos.
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false) }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') intentar()
              if (e.key === 'Escape') onCancel()
            }}
            placeholder="PIN de acceso"
            maxLength={8}
            autoFocus
            className="w-full bg-transparent border px-4 py-3 text-sm text-center outline-none transition-colors"
            style={{
              borderColor: error ? '#dc2626' : 'rgba(139,107,74,0.4)',
              color: '#f5f2ec',
              fontFamily: 'Josefin Sans, sans-serif',
              letterSpacing: '0.5em',
            }}
          />
          {error && <p className="text-xs text-center" style={{ color: '#dc2626' }}>PIN incorrecto</p>}
          <button onClick={intentar} className="w-full py-3 text-xs" style={{ ...btnPrimary, letterSpacing: '0.3em' }}>
            ENTRAR
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2 text-xs"
            style={{ color: '#6b6158', background: 'none', border: 'none', fontFamily: 'Josefin Sans, sans-serif', letterSpacing: '0.3em' }}
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  )
}
