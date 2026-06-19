/**
 * Comprime una imagen antes de subirla a Supabase Storage.
 * Reduce a máximo 1200px de ancho y calidad 0.8 para WEBP.
 * Ideal para fotos tomadas desde celular (4-8MB -> ~200-400KB).
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const canvas = document.createElement('canvas')
      let { width, height } = img

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('No canvas context'))

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Compression failed'))
          resolve(blob)
        },
        'image/webp',
        quality
      )
    }

    img.onerror = () => reject(new Error('Image load failed'))
    img.src = url
  })
}

/**
 * Sube una imagen comprimida a Supabase Storage y devuelve la URL pública.
 */
export async function uploadImage(
  file: File,
  bucket: string,
  folder: string
): Promise<string> {
  const { supabase } = await import('./supabase')

  const compressed = await compressImage(file)
  const ext = 'webp'
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(filename, compressed, {
    contentType: 'image/webp',
    upsert: false,
  })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
  return data.publicUrl
}
