import { useEffect, useRef, useState, useCallback } from 'react'
import type { Slide } from '../../types'

interface Props {
  slides: Slide[]
}

export function Carrusel({ slides }: Props) {
  const [idx, setIdx] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((next: number) => {
    if (slides.length < 2) return
    setTransitioning(true)
    setTimeout(() => {
      setIdx(next)
      setTransitioning(false)
    }, 300)
  }, [slides.length])

  useEffect(() => {
    if (slides.length < 2) return
    timer.current = setInterval(() => goTo((idx + 1) % slides.length), 5000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [idx, slides.length, goTo])

  if (slides.length === 0) {
    return (
      <section
        className="relative flex items-end pb-16 px-8"
        style={{ height: 480, background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(139,107,74,0.15) 0%, transparent 70%), #0f0e0c' }}
      >
        <div>
          <p className="text-xs tracking-widest mb-3" style={{ color: '#8b6b4a', letterSpacing: '0.45em' }}>
            MATAMOROS, COAHUILA
          </p>
          <h1 className="font-display font-light leading-none" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', color: '#f5f2ec' }}>
            Joyería con <em style={{ color: '#c4a882' }}>carácter</em>
          </h1>
        </div>
      </section>
    )
  }

  const slide = slides[idx]
  const hasImage = slide.imagen_url && slide.imagen_url.length > 10

  return (
    <section className="relative overflow-hidden" style={{ height: 480 }}>
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        {hasImage ? (
          <img src={slide.imagen_url} alt={slide.titulo} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(139,107,74,0.18) 0%, transparent 70%), #0f0e0c' }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(15,14,12,0.92) 0%, rgba(15,14,12,0.4) 50%, rgba(15,14,12,0.15) 100%)' }}
        />
      </div>

      <div
        className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 transition-opacity duration-300"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <p className="text-xs mb-3" style={{ color: '#8b6b4a', letterSpacing: '0.45em' }}>
          DENISSE JOYERÍA — MATAMOROS, COAHUILA
        </p>
        <h2
          className="font-display font-light leading-none mb-3"
          style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', color: '#f5f2ec' }}
        >
          {slide.titulo}
        </h2>
        {slide.subtitulo && (
          <p className="text-sm" style={{ color: '#c4a882', maxWidth: 500 }}>
            {slide.subtitulo}
          </p>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === idx ? '#c4a882' : 'rgba(196,168,130,0.3)' }}
                aria-label={`Ir a diapositiva ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => goTo((idx - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center border transition-colors"
            style={{ borderColor: 'rgba(196,168,130,0.3)', color: '#c4a882' }}
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            onClick={() => goTo((idx + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center border transition-colors"
            style={{ borderColor: 'rgba(196,168,130,0.3)', color: '#c4a882' }}
            aria-label="Siguiente"
          >
            →
          </button>
        </>
      )}
    </section>
  )
}
