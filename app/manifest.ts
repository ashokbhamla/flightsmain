import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap'} - Book Flights, Hotels, and Cars`,
    short_name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AirlinesMap',
    description: 'Find the best deals on flights, hotels, and car rentals worldwide.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e3a8a',
    orientation: 'portrait-primary',
    categories: ['travel', 'business'],
    lang: 'en',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png'
      },
      {
        src: '/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    screenshots: [
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png'
      },
      {
        src: '/screenshot-mobile.png',
        sizes: '750x1334',
        type: 'image/png'
      }
    ]
  }
}
