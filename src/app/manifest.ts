import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Asistencia Integral Funeraria',
    short_name: 'Funeraria',
    description: 'Acompañamiento experto y respetuoso. Gestione logística y servicios sin contratiempos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#0f172a', // Gris oscuro/slate 900
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
  }
}
