# Sitemap Setup for AirlinesMap.com

## Environment Variables

Add these to your `.env.local` file:

```bash
CRON_SECRET=airlinesmap-sitemap-secret-2024
VERCEL_URL=https://airlinesmap.com
```

## Sitemap URLs

After deployment, your sitemaps will be available at:

- **Main Sitemap Index**: `https://airlinesmap.com/sitemap.xml`
- **Category Sitemaps**:
  - `https://airlinesmap.com/sitemap-flightsone_pages.xml`
  - `https://airlinesmap.com/sitemap-flightsround_pages.xml`
  - `https://airlinesmap.com/sitemap-airlinesround_pages.xml`
  - `https://airlinesmap.com/sitemap-airlinesone_pages.xml`
  - `https://airlinesmap.com/sitemap-airport_pages.xml`
  - `https://airlinesmap.com/sitemap-airlines_pages.xml`
  - `https://airlinesmap.com/sitemap-airport_hotels.xml`

## API Endpoints

- **Status Check**: `https://airlinesmap.com/api/sitemap/status`
- **Manual Update**: `https://airlinesmap.com/api/cron/sitemap-update`

## Cron Job

The sitemap will automatically update every Sunday at 2 AM UTC via Vercel cron jobs.

## Manual Testing

Test the cron endpoint manually:
```bash
curl -H "Authorization: Bearer airlinesmap-sitemap-secret-2024" \
  https://airlinesmap.com/api/cron/sitemap-update
```
