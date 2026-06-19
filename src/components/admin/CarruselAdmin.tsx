import { useState, useRef } from 'react'
import type { Slide } from '../../types'
import { uploadImage } from '../../lib/imageUtils'
import { Label, Input, SavedBadge, btnPrimary, btnSecondary, btnDanger } from '../ui/AdminControls'

interface Props {
  slides: Slide[]
  onCrear: (data: Omit<Slide, 'id' | 'created_at'>) => Promise<unknown>
  onActualizar: (id: string, data: Partial<Slide>) => Promise<unknown>
  onEliminar: (id: string) => Promise<void>
}

type FormState = Partial<Slide>

export function CarruselAdmin({ slides, onCrear, onActualizar, onEliminar }: Props) {
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({})
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const abrirNuevo = () => {
    setEditId('nuevo')
    setForm({ titulo: '', subtitulo: '', imagen_url: '', activo: true })
  }

  const abrirEditar = (s: Slide) => {
    setEditId(s.id)
    setForm({ ...s })
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'imagenes', 'carrusel')
      setForm((f) => ({ ...f, imagen_url: url }))
    } catch (err) {
      console.error(err)
      alert('Error al subir la imagen. Verifica el bucket "imagenes" en Supabase Storage.')
    } finally {
      setUploading(false)
    }
  }

  const guardar = async () => {
    if (!form.titulo) return

    const data = {
      titulo: form.titulo,
      subtitulo: form.subtitulo ?? '',
      imagen_url: form.imagen_url ?? '',
      activo: form.activo ?? true,
      orden: form.orden ?? slides.length,
    }

    if (editId === 'nuevo') {
      await onCrear(data)
    } else if (editId) {
      await onActualizar(editId, data)
    }

    setEditId(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Label>CARRUSEL DE INICIO</Label>
          <h3 className="font-display text-2xl font-light" style={{ color: '#f5f2ec' }}>
            {slides.length} {slides.length === 1 ? 'diapositiva' : 'diapositivas'}
          </h3>
        </div>
        <button style={btnPrimary} onClick={abrirNuevo}>+ AGREGAR DIAPOSITIVA</button>
      </div>

      <SavedBadge show={saved} />

      {editId && (
        <div className="mb-6 p-6" style={{ background: 'rgba(74,53,32,0.12)', border: '1px solid rgba(139,107,74,0.2)' }}>
          <p style={{ ...{} }} className="mb-4">
            <Label>{editId === 'nuevo' ? 'NUEVA DIAPOSITIVA' : 'EDITAR DIAPOSITIVA'}</Label>
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Título</Label>
              <Input
                value={form.titulo ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                placeholder="Ej: Nueva colección 2025"
              />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input
                value={form.subtitulo ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, subtitulo: e.target.value }))}
                placeholder="Descripción breve"
              />
            </div>
          </div>

          <div className="mb-4">
            <Label>Imagen de fondo (opcional)</Label>
            <div className="flex items-center gap-3 flex-wrap">
              {form.imagen_url && (
                <img src={form.imagen_url} className="w-20 h-12 object-cover" style={{ border: '1px solid rgba(139,107,74,0.3)' }} alt="" />
              )}
              <button style={btnSecondary} onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? 'SUBIENDO...' : form.imagen_url ? 'CAMBIAR IMAGEN' : 'SUBIR IMAGEN'}
              </button>
              {form.imagen_url && (
                <button style={btnDanger} onClick={() => setForm((f) => ({ ...f, imagen_url: '' }))}>QUITAR</button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          </div>

          <div className="flex gap-2">
            <button style={btnPrimary} onClick={guardar}>GUARDAR</button>
            <button style={btnSecondary} onClick={() => setEditId(null)}>CANCELAR</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="flex items-center gap-4 p-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(139,107,74,0.12)' }}
          >
            <span className="font-display text-2xl font-light" style={{ color: 'rgba(196,168,130,0.2)', minWidth: 32 }}>
              {i + 1}
            </span>
            {s.imagen_url ? (
              <img src={s.imagen_url} className="w-16 h-10 object-cover flex-shrink-0" alt="" />
            ) : (
              <div className="w-16 h-10 flex-shrink-0" style={{ background: '#1a1510' }} />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-display text-base font-light" style={{ color: '#f5f2ec' }}>{s.titulo}</p>
              <p className="text-xs truncate" style={{ color: '#6b6158' }}>{s.subtitulo}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button style={btnSecondary} onClick={() => abrirEditar(s)}>EDITAR</button>
              <button style={btnDanger} onClick={() => onEliminar(s.id)}>BORRAR</button>
            </div>
          </div>
        ))}
        {slides.length === 0 && !editId && (
          <p className="text-xs py-8 text-center" style={{ color: '#6b6158' }}>
            No hay diapositivas. Agrega la primera.
          </p>
        )}
      </div>
    </div>
  )
}
