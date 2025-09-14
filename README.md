# Next.js i18n Travel Boilerplate (SSR + TypeScript + MUI + Schema.org)

- **Default English at /** (lang=1)
- **Spanish at /es** (lang=2)
- **App Router** (Next 14), SSR data fetching
- **Material UI 6** with Emotion
- **Header/Footer** with sample data
- Dynamic routes with sample content
- **Currently using sample data for design purposes** (no API calls needed)

## Quick Start

```bash
npm install
npm run dev
```

The application will run at `http://localhost:3000` with sample data.

## Available Routes

- `/` - Home page (English)
- `/es` - Home page (Spanish)
- `/about` - About page
- `/flights/[slug]` - Flight details (e.g., `/flights/nyc-london`)
- `/airlines/[airline]` - Airline information (e.g., `/airlines/aa`)
- `/airlines/[airline]/[slug]` - Airline-specific flights
- `/airport/[airport]` - Airport information (e.g., `/airport/jfk`)
- `/distance/[slug]` - Distance calculations



## i18n Routing

- English paths visible as `/...` (rewritten internally to `/en/...` by middleware)
- Spanish paths visible as `/es/...`

## SEO / Schema.org

- `generateMetadata` pulls data from sample data
- `SchemaOrg` injects JSON-LD for Organization + WebSite + Breadcrumbs

## Design Focus

This version is set up for **design and UI development** without API dependencies. When you're ready to integrate real APIs:

1. Replace the sample data imports with API calls
2. Update the `API_BASE` environment variable
3. Restore the original API functions in `lib/api.ts`

## Notes

- All pages now render instantly with sample data
- No external API calls or mock servers needed
- Perfect for focusing on UI/UX design and component development
- Easy to switch back to API mode when design is complete
# finalcms
# finalcms
# airlinesmap
