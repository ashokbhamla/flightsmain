import { MetadataRoute } from 'next'

export interface SitemapUrl {
  url: string
  lastModified: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export class SitemapGenerator {
  private baseUrl: string
  private currentDate: string

  constructor(baseUrl: string = 'https://airlinesmap.com') {
    this.baseUrl = baseUrl
    this.currentDate = new Date().toISOString()
  }

  // Generate main pages
  generateMainPages(): SitemapUrl[] {
    return [
      {
        url: this.baseUrl,
        lastModified: this.currentDate,
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${this.baseUrl}/airlines`,
        lastModified: this.currentDate,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${this.baseUrl}/hotels`,
        lastModified: this.currentDate,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${this.baseUrl}/search`,
        lastModified: this.currentDate,
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${this.baseUrl}/login`,
        lastModified: this.currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${this.baseUrl}/register`,
        lastModified: this.currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${this.baseUrl}/my-account`,
        lastModified: this.currentDate,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ]
  }

  // Generate static content pages
  generateStaticPages(): SitemapUrl[] {
    return [
      {
        url: `${this.baseUrl}/about-us`,
        lastModified: this.currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${this.baseUrl}/contact-us`,
        lastModified: this.currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${this.baseUrl}/privacy-policy`,
        lastModified: this.currentDate,
        changeFrequency: 'yearly',
        priority: 0.5,
      },
      {
        url: `${this.baseUrl}/terms-and-conditions`,
        lastModified: this.currentDate,
        changeFrequency: 'yearly',
        priority: 0.5,
      },
      {
        url: `${this.baseUrl}/refund-policy`,
        lastModified: this.currentDate,
        changeFrequency: 'yearly',
        priority: 0.5,
      },
    ]
  }

  // Generate language-specific pages
  generateLanguagePages(languages: string[] = ['es', 'ru', 'fr']): SitemapUrl[] {
    return languages.flatMap(lang => [
      // Main language pages
      {
        url: `${this.baseUrl}/${lang}`,
        lastModified: this.currentDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${this.baseUrl}/${lang}/airlines`,
        lastModified: this.currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${this.baseUrl}/${lang}/hotels`,
        lastModified: this.currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${this.baseUrl}/${lang}/search`,
        lastModified: this.currentDate,
        changeFrequency: 'daily',
        priority: 0.7,
      },
      {
        url: `${this.baseUrl}/${lang}/login`,
        lastModified: this.currentDate,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${this.baseUrl}/${lang}/register`,
        lastModified: this.currentDate,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${this.baseUrl}/${lang}/my-account`,
        lastModified: this.currentDate,
        changeFrequency: 'monthly',
        priority: 0.4,
      },
      // Static content pages
      {
        url: `${this.baseUrl}/${lang}/about-us`,
        lastModified: this.currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${this.baseUrl}/${lang}/contact-us`,
        lastModified: this.currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${this.baseUrl}/${lang}/privacy-policy`,
        lastModified: this.currentDate,
        changeFrequency: 'yearly',
        priority: 0.4,
      },
      {
        url: `${this.baseUrl}/${lang}/terms-and-conditions`,
        lastModified: this.currentDate,
        changeFrequency: 'yearly',
        priority: 0.4,
      },
      {
        url: `${this.baseUrl}/${lang}/refund-policy`,
        lastModified: this.currentDate,
        changeFrequency: 'yearly',
        priority: 0.4,
      },
    ])
  }

  // Generate flight routes - only the correct URL structure
  generateFlightRoutes(routes: string[] = []): SitemapUrl[] {
    const defaultRoutes = [
      'DEL-BOM', 'DEL-BLR', 'DEL-HYD', 'DEL-CCU', 'DEL-MAA',
      'BOM-BLR', 'BOM-HYD', 'BOM-DEL', 'BOM-MAA', 'BOM-CCU',
      'BLR-DEL', 'BLR-BOM', 'BLR-HYD', 'BLR-MAA', 'BLR-CCU',
      'HYD-DEL', 'HYD-BOM', 'HYD-BLR', 'HYD-MAA', 'HYD-CCU',
      'MAA-DEL', 'MAA-BOM', 'MAA-BLR', 'MAA-HYD', 'MAA-CCU',
      'CCU-DEL', 'CCU-BOM', 'CCU-BLR', 'CCU-HYD', 'CCU-MAA'
    ]

    const routesToUse = routes.length > 0 ? routes : defaultRoutes

    // Extract unique airports and generate URLs
    const uniqueAirports = [...new Set(routesToUse.map(route => route.split('-')[0]))]
    
    return uniqueAirports.map(airport => ({
      url: `${this.baseUrl}/flights/from/${airport}`,
      lastModified: this.currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  }

  // Generate language-specific flight routes - only the correct URL structure
  generateLanguageFlightRoutes(
    languages: string[] = ['es', 'ru', 'fr'],
    routes: string[] = []
  ): SitemapUrl[] {
    const defaultRoutes = [
      'DEL-BOM', 'DEL-BLR', 'DEL-HYD', 'DEL-CCU', 'DEL-MAA',
      'BOM-BLR', 'BOM-HYD', 'BOM-DEL', 'BOM-MAA', 'BOM-CCU',
      'BLR-DEL', 'BLR-BOM', 'BLR-HYD', 'BLR-MAA', 'BLR-CCU',
      'HYD-DEL', 'HYD-BOM', 'HYD-BLR', 'HYD-MAA', 'HYD-CCU',
      'MAA-DEL', 'MAA-BOM', 'MAA-BLR', 'MAA-HYD', 'MAA-CCU',
      'CCU-DEL', 'CCU-BOM', 'CCU-BLR', 'CCU-HYD', 'CCU-MAA'
    ]

    const routesToUse = routes.length > 0 ? routes : defaultRoutes

    // Extract unique airports and generate URLs for each language
    const uniqueAirports = [...new Set(routesToUse.map(route => route.split('-')[0]))]
    
    return languages.flatMap(lang => 
      uniqueAirports.map(airport => ({
        url: `${this.baseUrl}/${lang}/flights/from/${airport}`,
        lastModified: this.currentDate,
        changeFrequency: 'weekly',
        priority: 0.6,
      }))
    )
  }

  // Generate airline pages
  generateAirlinePages(airlines: string[] = []): SitemapUrl[] {
    const defaultAirlines = [
      'aa', 'dl', 'ua', 'wn', 'ba', 'lh', 'af', 'kl', 'sq', 'cx', 
      'nh', 'jl', 'qr', 'ey', 'ek', 'ac', 'vs', 'ib', 'az', 'os'
    ]

    const airlinesToUse = airlines.length > 0 ? airlines : defaultAirlines

    return airlinesToUse.map(airline => ({
      url: `${this.baseUrl}/airlines/${airline}`,
      lastModified: this.currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  }

  // Generate language-specific airline pages
  generateLanguageAirlinePages(
    languages: string[] = ['es', 'ru', 'fr'],
    airlines: string[] = []
  ): SitemapUrl[] {
    const defaultAirlines = [
      'aa', 'dl', 'ua', 'wn', 'ba', 'lh', 'af', 'kl', 'sq', 'cx', 
      'nh', 'jl', 'qr', 'ey', 'ek', 'ac', 'vs', 'ib', 'az', 'os'
    ]

    const airlinesToUse = airlines.length > 0 ? airlines : defaultAirlines

    return languages.flatMap(lang =>
      airlinesToUse.map(airline => ({
        url: `${this.baseUrl}/${lang}/airlines/${airline}`,
        lastModified: this.currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    )
  }

  // Generate complete sitemap
  generateCompleteSitemap(options: {
    languages?: string[]
    routes?: string[]
    airlines?: string[]
  } = {}): SitemapUrl[] {
    const {
      languages = ['es', 'ru', 'fr'],
      routes = [],
      airlines = []
    } = options

    return [
      ...this.generateMainPages(),
      ...this.generateStaticPages(),
      ...this.generateLanguagePages(languages),
      ...this.generateFlightRoutes(routes),
      ...this.generateLanguageFlightRoutes(languages, routes),
      ...this.generateAirlinePages(airlines),
      ...this.generateLanguageAirlinePages(languages, airlines),
    ]
  }
}

// Utility function to create sitemap
export function createSitemap(baseUrl?: string, options?: {
  languages?: string[]
  routes?: string[]
  airlines?: string[]
}): SitemapUrl[] {
  const generator = new SitemapGenerator(baseUrl)
  return generator.generateCompleteSitemap(options)
}
