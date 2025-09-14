# Sitemap Guide for AirlinesMap

## Overview

This guide explains how the sitemap system works for the AirlinesMap website and how to maintain it.

## Files Structure

```
app/
├── sitemap.ts                    # Main sitemap generator
├── sitemap-index.xml/route.ts    # Sitemap index
├── robots.ts                     # Robots.txt generator
lib/
└── sitemap-generator.ts          # Sitemap utility class
```

## Sitemap Features

### 1. Main Sitemap (`/sitemap.xml`)

The main sitemap includes:
- **Main Pages**: Home, Airlines, Hotels, Search, Login, Register, My Account
- **Static Pages**: About Us, Contact Us, Privacy Policy, Terms & Conditions, Refund Policy
- **Language Pages**: All pages in Spanish (es), Russian (ru), and French (fr)
- **Flight Routes**: Popular domestic and international flight routes
- **Airline Pages**: Individual airline pages
- **Language-specific Routes**: All routes in multiple languages

### 2. Sitemap Generator Class

The `SitemapGenerator` class provides methods to:
- Generate main pages
- Generate static content pages
- Generate language-specific pages
- Generate flight routes
- Generate airline pages
- Generate complete sitemap with custom options

### 3. Robots.txt (`/robots.txt`)

The robots.txt file:
- Allows all search engines to crawl the site
- Disallows API routes, admin areas, and private content
- References the sitemap location
- Includes host information

## Customization

### Adding New Routes

To add new flight routes, update the `popularRoutes` array in `app/sitemap.ts`:

```typescript
const popularRoutes = [
  'DEL-BOM', 'DEL-BLR', 'DEL-HYD', // ... existing routes
  'NEW-ROUTE', 'ANOTHER-ROUTE',    // ... new routes
]
```

### Adding New Airlines

To add new airlines, update the `airlines` array in `app/sitemap.ts`:

```typescript
const airlines = [
  'aa', 'dl', 'ua', // ... existing airlines
  'new-airline', 'another-airline', // ... new airlines
]
```

### Adding New Languages

To add new languages, update the `languages` array in `app/sitemap.ts`:

```typescript
const languages = ['es', 'ru', 'fr', 'de', 'it'] // Add new languages
```

### Custom Sitemap Generation

You can create custom sitemaps using the generator class:

```typescript
import { SitemapGenerator } from '@/lib/sitemap-generator'

const generator = new SitemapGenerator('https://your-domain.com')
const customSitemap = generator.generateCompleteSitemap({
  languages: ['en', 'es'],
  routes: ['CUSTOM-ROUTE'],
  airlines: ['CUSTOM-AIRLINE']
})
```

## SEO Benefits

### 1. Search Engine Discovery
- Helps search engines discover all pages
- Improves indexing speed
- Ensures all language versions are found

### 2. Priority and Frequency
- **Priority 1.0**: Homepage (highest priority)
- **Priority 0.9**: Main language pages and core features
- **Priority 0.8**: Airlines, Hotels, Search pages
- **Priority 0.7**: Flight routes and airline pages
- **Priority 0.6**: User account pages
- **Priority 0.5**: Static content pages
- **Priority 0.4**: Language-specific static content

### 3. Change Frequency
- **Daily**: Homepage, search pages, flight routes
- **Weekly**: Airlines, hotels, airline pages
- **Monthly**: User accounts, static content
- **Yearly**: Legal pages (privacy, terms, etc.)

## Maintenance

### Regular Updates

1. **Monthly**: Review and update popular routes
2. **Quarterly**: Add new airlines and remove discontinued ones
3. **Annually**: Review language support and add new languages

### Monitoring

- Check sitemap accessibility: `https://airlinesmap.com/sitemap.xml`
- Verify robots.txt: `https://airlinesmap.com/robots.txt`
- Monitor search console for indexing issues

### Testing

Test sitemap generation locally:
```bash
curl http://localhost:3000/sitemap.xml | head -20
curl http://localhost:3000/robots.txt
```

## Advanced Features

### Dynamic Route Generation

For dynamic routes based on database content, you can:

1. Create API routes to fetch real data
2. Use the sitemap generator with fetched data
3. Implement caching for performance

### Sitemap Index

The sitemap index (`/sitemap-index.xml`) can be used to:
- Split large sitemaps into smaller ones
- Organize sitemaps by content type
- Improve crawling efficiency

### Hreflang Implementation

For better international SEO, consider adding hreflang tags to indicate language alternatives:

```xml
<link rel="alternate" hreflang="en" href="https://airlinesmap.com/" />
<link rel="alternate" hreflang="es" href="https://airlinesmap.com/es/" />
<link rel="alternate" hreflang="ru" href="https://airlinesmap.com/ru/" />
<link rel="alternate" hreflang="fr" href="https://airlinesmap.com/fr/" />
```

## Troubleshooting

### Common Issues

1. **Sitemap not updating**: Clear Next.js cache and rebuild
2. **Missing pages**: Check if routes are properly defined
3. **Invalid URLs**: Verify base URL configuration
4. **Large sitemap**: Consider splitting into multiple sitemaps

### Validation

Use online tools to validate your sitemap:
- Google Search Console
- XML Sitemap Validator
- Screaming Frog SEO Spider

## Performance Considerations

- The current sitemap generates ~3,600 URLs
- Consider splitting if it exceeds 50,000 URLs
- Implement caching for frequently accessed sitemaps
- Use compression for large sitemaps

## Future Enhancements

1. **Image Sitemaps**: Add image sitemaps for better image SEO
2. **Video Sitemaps**: Include video content if applicable
3. **News Sitemaps**: For news and blog content
4. **Mobile Sitemaps**: Separate mobile-specific sitemaps
5. **Real-time Updates**: Dynamic sitemap updates based on content changes
