import type { CartItem } from '../types'

const WA_NUMBER = '5218719773006'

export function buildOrderMessage(items: CartItem[]): string {
  const total = items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)

  const lines = items
    .map((i) => `- ${i.producto.nombre} x${i.cantidad} = $${i.producto.precio * i.cantidad} MXN`)
    .join('\n')

  const msg = `Hola Denisse, quiero hacer un pedido:\n\n${lines}\n\nTotal estimado: $${total} MXN\n\n(Por favor confirmar disponibilidad y forma de envio)`

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

export function buildInquiryMessage(nombreProducto?: string): string {
  const msg = nombreProducto
    ? `Hola, me interesa el producto: ${nombreProducto}. Podrian darme mas informacion?`
    : 'Hola, me interesa conocer sus productos.'

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}
