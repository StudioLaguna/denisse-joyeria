export type Categoria = 'acero' | 'bisuteria' | 'colecciones'

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: Categoria
  imagen_url: string
  disponible: boolean
  destaca: boolean
  orden: number
  created_at?: string
}

export interface Slide {
  id: string
  titulo: string
  subtitulo: string
  imagen_url: string
  orden: number
  activo: boolean
  created_at?: string
}

export type EstadoPedido = 'nuevo' | 'confirmado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado'

export interface ItemPedido {
  producto_id: string
  nombre: string
  precio: number
  cantidad: number
}

export interface Pedido {
  id: string
  cliente_nombre: string
  cliente_telefono: string
  items: ItemPedido[]
  total: number
  estado: EstadoPedido
  notas: string
  created_at?: string
}

export interface CartItem {
  producto: Producto
  cantidad: number
}
