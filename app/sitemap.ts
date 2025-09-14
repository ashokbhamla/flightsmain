import { MetadataRoute } from 'next'
import { createSitemap } from '@/lib/sitemap-generator'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com'
  
  // You can customize these arrays with your actual data
  const popularRoutes = [
    'DEL-BOM', 'DEL-BLR', 'DEL-HYD', 'DEL-CCU', 'DEL-MAA',
    'BOM-BLR', 'BOM-HYD', 'BOM-DEL', 'BOM-MAA', 'BOM-CCU',
    'BLR-DEL', 'BLR-BOM', 'BLR-HYD', 'BLR-MAA', 'BLR-CCU',
    'HYD-DEL', 'HYD-BOM', 'HYD-BLR', 'HYD-MAA', 'HYD-CCU',
    'MAA-DEL', 'MAA-BOM', 'MAA-BLR', 'MAA-HYD', 'MAA-CCU',
    'CCU-DEL', 'CCU-BOM', 'CCU-BLR', 'CCU-HYD', 'CCU-MAA',
    // International routes
    'DEL-LHR', 'DEL-DXB', 'DEL-SIN', 'DEL-BKK', 'DEL-KUL',
    'BOM-LHR', 'BOM-DXB', 'BOM-SIN', 'BOM-BKK', 'BOM-KUL',
    'BLR-LHR', 'BLR-DXB', 'BLR-SIN', 'BLR-BKK', 'BLR-KUL',
    'HYD-LHR', 'HYD-DXB', 'HYD-SIN', 'HYD-BKK', 'HYD-KUL',
    'MAA-LHR', 'MAA-DXB', 'MAA-SIN', 'MAA-BKK', 'MAA-KUL',
  ]

  const airlines = [
    'aa', 'dl', 'ua', 'wn', 'ba', 'lh', 'af', 'kl', 'sq', 'cx', 
    'nh', 'jl', 'qr', 'ey', 'ek', 'ac', 'vs', 'ib', 'az', 'os',
    'ai', '6e', 'sg', 'ix', 'uk', 'g8', 'i5', 's2', '9w', 'it'
  ]

  const languages = ['es', 'ru', 'fr']

  return createSitemap(baseUrl, {
    languages,
    routes: popularRoutes,
    airlines,
  })
}
