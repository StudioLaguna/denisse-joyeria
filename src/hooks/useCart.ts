import { useState, useCallback } from 'react'
import type { CartItem, Producto } from '../types'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)

  const agregar = useCallback((producto: Producto) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.producto.id === producto.id)
      if (existing) {
        return prev.map((i) =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      }
      return [...prev, { producto, cantidad: 1 }]
    })
    setOpen(true)
  }, [])

  const quitar = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== id))
  }, [])

  const cambiarCantidad = useCallback((id: string, cantidad: number) => {
    if (cantidad < 1) return
    setItems((prev) => prev.map((i) => (i.producto.id === id ? { ...i, cantidad } : i)))
  }, [])

  const vaciar = useCallback(() => setItems([]), [])

  const total = items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)
  const cantidad = items.reduce((acc, i) => acc + i.cantidad, 0)

  return { items, open, setOpen, agregar, quitar, cambiarCantidad, vaciar, total, cantidad }
}
