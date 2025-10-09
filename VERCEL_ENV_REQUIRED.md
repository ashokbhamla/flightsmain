# Required Environment Variables for Vercel

## Critical Variables (Required for API calls to work)

Add these in Vercel Dashboard → Settings → Environment Variables:

### 1. API Configuration
```
NEXT_PUBLIC_API_BASE=https://api.triposia.com
NEXT_PUBLIC_API_REAL=https://api.triposia.com
```

### 2. Domain Configuration
```
NEXT_PUBLIC_DOMAIN=airlinesmap.com
NEXT_PUBLIC_COMPANY_NAME=AirlinesMap
```

### 3. Redis Configuration (Upstash)
```
UPSTASH_REDIS_REST_URL=<your_redis_url>
UPSTASH_REDIS_REST_TOKEN=<your_redis_token>
```

### 4. CRM Configuration
```
CUSTOM_CRM_URL=https://dashboard-alpha-one-85.vercel.app/api/webhooks/leads
CRM_WEBHOOK_API_KEY=a71a000b53d3ed32854cf5086f773403fca323adcab0d226e9d9d8a80759442b
```

## How to Set in Vercel:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - Name: `NEXT_PUBLIC_API_BASE`
   - Value: `https://api.triposia.com`
   - Select: Production, Preview, Development
   - Click **Save**
5. Repeat for all variables above
6. Go to **Deployments** tab
7. Click the **⋯** menu on latest deployment
8. Click **Redeploy**

## After Setting Variables:

The page `/flights/iag-sfb` will show:
- ✅ Correct title from Content API
- ✅ Price cards with real data ($76, $55, Wednesday)
- ✅ 3 graphs (Monthly, Temperature, Rainfall)
- ✅ Content sections (Stats, City, Places, Hotels, Airlines)
- ✅ 6 FAQs from Content API

