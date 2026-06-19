import { useState, useRef } from 'react'
import type { Producto, Categoria } from '../../types'
import { uploadImage } from '../../lib/imageUtils'
import { Label, Input, Textarea, Select, SavedBadge, btnPrimary, btnSecondary, btnDanger } from '../ui/AdminControls'

const CATEGORIAS: { id: Categoria; label: string }[] = [
  { id: 'acero', label: 'Acero Inoxidable' },
  { id: 'bisuteria', label: 'Bisutería' },
  { id: 'colecciones', label: 'Colecciones' },
]

interface Props {
  productos: Producto[]
  onCrear: (data: Omit<Producto, 'id' | 'created_at'>) => Promise<unknown>
  onActualizar: (id: string, data: Partial<Producto>) => Promise<unknown>
  onEliminar: (id: string) => Promise<void>
}

type FormState = Partial<Producto>

export function ProductosAdmin({ productos, onCrear, onActualizar, onEliminar }: Props) {
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({})
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [filtro, setFiltro] = useState<'todas' | Categoria>('todas')
  const fileRef = useRef<HTMLInputElement>(null)

  const abrirNuevo = () => {
    setEditId('nuevo')
    setForm({ nombre: '', descripcion: '', precio: 0, categoria: 'acero', imagen_url: '', disponible: true, destaca: false })
  }

  const abrirEditar = (p: Producto) => {
    setEditId(p.id)
    setForm({ ...p })
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'imagenes', 'productos')
      setForm((f) => ({ ...f, imagen_url: url }))
    } catch (err) {
      console.error(err)
      alert('Error al subir la imagen. Verifica el bucket "imagenes" en Supabase Storage.')
    } finally {
      setUploading(false)
    }
  }

  const guardar = async () => {
  if (!form.nombre?.trim()) { alert('Nombre requerido'); return }
  if (!form.precio || Number(form.precio) <= 0) { alert('Precio invalido'); return }

  const data = {
    nombre: form.nombre.trim(),
    descripcion: form.descripcion ?? '',
    precio: Number(form.precio),
    categoria: form.categoria ?? 'acero',
    imagen_url: form.imagen_url ?? '',
    disponible: form.disponible ?? true,
    destaca: form.destaca ?? false,
    orden: form.orden ?? productos.length,
  }

  try {
    if (editId === 'nuevo') {
      await onCrear(data)
    } else if (editId) {
      await onActualizar(editId, data)
    }
    setEditId(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  } catch (err) {
   alert('Error al guardar: ' + JSON.stringify(err))
  }
}

  const toggleDisponible = async (p: Producto) => {
    await onActualizar(p.id, { disponible: !p.disponible })
  }

  const filtrados = filtro === 'todas' ? productos : productos.filter((p) => p.categoria === filtro)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <Label>CATÁLOGO DE PRODUCTOS</Label>
          <h3 className="font-display text-2xl font-light" style={{ color: '#f5f2ec' }}>
            {productos.length} productos
          </h3>
        </div>
        <button style={btnPrimary} onClick={abrirNuevo}>+ NUEVO PRODUCTO</button>
      </div>

      <SavedBadge show={saved} />

      {editId && (
        <div className="mb-6 p-6" style={{ background: 'rgba(74,53,32,0.12)', border: '1px solid rgba(139,107,74,0.2)' }}>
          <div className="mb-4">
            <Label>{editId === 'nuevo' ? 'NUEVO PRODUCTO' : 'EDITAR PRODUCTO'}</Label>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Nombre</Label>
              <Input
                value={form.nombre ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Nombre del producto"
              />
            </div>
            <div>
              <Label>Precio (MXN)</Label>
              <Input
                type="number"
                value={form.precio ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, precio: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Descripción</Label>
              <Textarea
                value={form.descripcion ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                placeholder="Descripción del producto..."
              />
            </div>
            <div>
              <Label>Categoría</Label>
              <Select
                value={form.categoria ?? 'acero'}
                onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value as Categoria }))}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.id} value={c.id} style={{ background: '#1a1510' }}>{c.label}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Imagen del producto</Label>
              <div className="flex items-center gap-3 flex-wrap">
                {form.imagen_url && (
                  <img src={form.imagen_url} className="w-12 h-12 object-cover" style={{ border: '1px solid rgba(139,107,74,0.3)' }} alt="" />
                )}
                <button style={btnSecondary} onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? 'SUBIENDO...' : form.imagen_url ? 'CAMBIAR' : 'SUBIR FOTO'}
                </button>
                {form.imagen_url && (
                  <button style={btnDanger} onClick={() => setForm((f) => ({ ...f, imagen_url: '' }))}>QUITAR</button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.disponible ?? true}
                onChange={(e) => setForm((f) => ({ ...f, disponible: e.target.checked }))}
                style={{ accentColor: '#8b6b4a' }}
              />
              <span style={{ ...{ marginBottom: 0 }, fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#8b6b4a' }}>
                DISPONIBLE
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.destaca ?? false}
                onChange={(e) => setForm((f) => ({ ...f, destaca: e.target.checked }))}
                style={{ accentColor: '#8b6b4a' }}
              />
              <span style={{ fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#8b6b4a' }}>
                DESTACADO
              </span>
            </label>
          </div>

          <div className="flex gap-2">
            <button style={btnPrimary} onClick={guardar}>GUARDAR PRODUCTO</button>
            <button style={btnSecondary} onClick={() => setEditId(null)}>CANCELAR</button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {[{ id: 'todas', label: 'TODOS' }, ...CATEGORIAS.map((c) => ({ id: c.id, label: c.label.toUpperCase() }))].map((c) => (
          <button
            key={c.id}
            onClick={() => setFiltro(c.id as 'todas' | Categoria)}
            style={{
              ...btnSecondary,
              background: filtro === c.id ? '#8b6b4a' : 'transparent',
              color: filtro === c.id ? '#f5f2ec' : '#6b6158',
              borderColor: filtro === c.id ? '#8b6b4a' : 'rgba(139,107,74,0.2)',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {filtrados.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 p-3 flex-wrap"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(139,107,74,0.12)', opacity: p.disponible ? 1 : 0.6 }}
          >
            <div className="w-12 h-12 flex-shrink-0" style={{ background: '#1a1510' }}>
              {p.imagen_url && <img src={p.imagen_url} className="w-full h-full object-cover" alt="" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-display text-base font-light" style={{ color: '#f5f2ec' }}>{p.nombre}</p>
                {p.destaca && (
                  <span style={{ fontSize: '0.45rem', letterSpacing: '0.3em', background: '#8b6b4a', color: '#f5f2ec', padding: '1px 6px' }}>
                    DESTACADO
                  </span>
                )}
                {!p.disponible && (
                  <span style={{ fontSize: '0.45rem', letterSpacing: '0.3em', background: 'rgba(220,38,38,0.2)', color: '#dc2626', padding: '1px 6px' }}>
                    SIN STOCK
                  </span>
                )}
              </div>
              <p className="text-xs" style={{ color: '#6b6158' }}>{p.categoria} — ${p.precio} MXN</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <button onClick={() => toggleDisponible(p)} style={{ ...btnSecondary, padding: '4px 10px', fontSize: '0.5rem' }}>
                {p.disponible ? 'MARCAR AGOTADO' : 'MARCAR DISPONIBLE'}
              </button>
              <button style={{ ...btnSecondary, padding: '4px 10px' }} onClick={() => abrirEditar(p)}>EDITAR</button>
              <button style={{ ...btnDanger, padding: '4px 10px' }} onClick={() => onEliminar(p.id)}>BORRAR</button>
            </div>
          </div>
        ))}
        {filtrados.length === 0 && (
          <p className="text-xs py-8 text-center" style={{ color: '#6b6158' }}>No hay productos en esta categoría.</p>
        )}
      </div>
    </div>
  )
}
