import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Producto, Slide, Pedido, EstadoPedido } from '../types'

export function useStore() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [slides, setSlides] = useState<Slide[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [{ data: prods, error: e1 }, { data: slids, error: e2 }, { data: peds, error: e3 }] =
        await Promise.all([
          supabase.from('productos').select('*').order('orden').order('created_at'),
          supabase.from('carrusel').select('*').eq('activo', true).order('orden'),
          supabase.from('pedidos').select('*').order('created_at', { ascending: false }),
        ])

      if (e1) throw e1
      if (e2) throw e2
      if (e3) throw e3

      setProductos(prods ?? [])
      setSlides(slids ?? [])
      setPedidos(peds ?? [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Productos ──────────────────────────────────────────────
  const crearProducto = async (data: Omit<Producto, 'id' | 'created_at'>) => {
    const { data: nuevo, error } = await supabase.from('productos').insert(data).select().single()
    if (error) throw error
    setProductos((prev) => [...prev, nuevo])
    return nuevo
  }

  const actualizarProducto = async (id: string, data: Partial<Producto>) => {
    const { data: updated, error } = await supabase.from('productos').update(data).eq('id', id).select().single()
    if (error) throw error
    setProductos((prev) => prev.map((p) => (p.id === id ? updated : p)))
    return updated
  }

  const eliminarProducto = async (id: string) => {
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) throw error
    setProductos((prev) => prev.filter((p) => p.id !== id))
  }

  // ── Carrusel ───────────────────────────────────────────────
  const crearSlide = async (data: Omit<Slide, 'id' | 'created_at'>) => {
    const { data: nuevo, error } = await supabase.from('carrusel').insert(data).select().single()
    if (error) throw error
    setSlides((prev) => [...prev, nuevo])
    return nuevo
  }

  const actualizarSlide = async (id: string, data: Partial<Slide>) => {
    const { data: updated, error } = await supabase.from('carrusel').update(data).eq('id', id).select().single()
    if (error) throw error
    setSlides((prev) => prev.map((s) => (s.id === id ? updated : s)))
    return updated
  }

  const eliminarSlide = async (id: string) => {
    const { error } = await supabase.from('carrusel').delete().eq('id', id)
    if (error) throw error
    setSlides((prev) => prev.filter((s) => s.id !== id))
  }

  // ── Pedidos ────────────────────────────────────────────────
  const actualizarEstadoPedido = async (id: string, estado: EstadoPedido) => {
    const { data: updated, error } = await supabase.from('pedidos').update({ estado }).eq('id', id).select().single()
    if (error) throw error
    setPedidos((prev) => prev.map((p) => (p.id === id ? updated : p)))
  }

  return {
    productos,
    slides,
    pedidos,
    loading,
    error,
    refetch: fetchAll,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    crearSlide,
    actualizarSlide,
    eliminarSlide,
    actualizarEstadoPedido,
  }
}
