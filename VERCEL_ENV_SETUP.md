# Vercel Environment Variables Setup

## Required Environment Variables for CRM Integration

Add these to your Vercel project settings to enable secure CRM integration.

---

## Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Select your project: `airlinesmap`
3. Go to: **Settings** → **Environment Variables**

---

## Step 2: Add CRM Configuration

### Required Variables:

#### 1. CRM Webhook URL
```
Name: CUSTOM_CRM_URL
Value: https://dashboard-alpha-one-85.vercel.app/api/webhooks/leads
Environment: Production, Preview, Development
```

#### 2. CRM API Key (for security)
```
Name: CRM_WEBHOOK_API_KEY
Value: a71a000b53d3ed32854cf5086f773403fca323adcab0d226e9d9d8a80759442b
Environment: Production, Preview, Development
```

---

## Step 3: Verify Configuration

After adding the variables, redeploy your application:

### Via Vercel Dashboard:
1. Go to **Deployments** tab
2. Click the three dots (•••) on the latest deployment
3. Click **Redeploy**

### Via CLI:
```bash
vercel --prod
```

---

## Step 4: Test the Integration

### Option 1: Test via UI
1. Visit: `https://airlinesmap.com/en/search#/flights/JFK2310LHR241011`
2. Click on search results
3. Fill booking form
4. Submit
5. Check your CRM dashboard for new lead

### Option 2: Test via API
```bash
curl -X POST https://airlinesmap.com/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerEmail": "test@example.com",
    "customerPhone": "+1-555-1234",
    "flightDetails": {
      "from": "JFK",
      "to": "LAX",
      "fromCity": "New York",
      "toCity": "Los Angeles",
      "price": "199",
      "travelers": 1,
      "class": "Economy",
      "tripType": "Round-Trip"
    },
    "timestamp": "2024-10-07T12:00:00.000Z"
  }'
```

---

## Complete Environment Variables Reference

### CRM Integration (Required)
```env
CUSTOM_CRM_URL=https://dashboard-alpha-one-85.vercel.app/api/webhooks/leads
CRM_WEBHOOK_API_KEY=a71a000b53d3ed32854cf5086f773403fca323adcab0d226e9d9d8a80759442b
```

### Redis Cache (Already Configured)
```env
REDIS_URL=your_redis_url
REDIS_TOKEN=your_redis_token
```

### API Endpoints (Already Configured)
```env
NEXT_PUBLIC_API_BASE=https://node.airlinesmap.com
NEXT_PUBLIC_API_REAL=https://node.airlinesmap.com
NEXT_PUBLIC_DOMAIN=airlinesmap.com
```

---

## Security Features

✅ **API Key Authentication** - Prevents unauthorized submissions  
✅ **Environment Variables** - API key never exposed in code  
✅ **HTTPS Only** - Encrypted communication  
✅ **Origin Validation** - Optional, can be added to CRM  

---

## Monitoring & Logs

### Check if leads are being sent:
1. Go to Vercel Dashboard
2. Click **Functions** tab
3. Select `/api/bookings`
4. View real-time logs

### Look for these messages:
```
📞 New Booking Request: {...}
📤 Sending to CRM: https://dashboard-alpha-one-85.vercel.app/api/webhooks/leads
✅ CRM Response: {"leadId":"..."}
✅ Successfully sent to CRM
```

---

## What Happens When User Submits Booking Form

```
1. User fills form on search page
2. Clicks "Request Callback"
3. Data sent to /api/bookings
4. System transforms data to CRM format
5. POST request sent to your CRM with X-API-Key header
6. Your CRM validates API key
7. Lead created in your CRM
8. Success response sent back
9. User sees confirmation ✅
```

---

## Next Steps

1. ✅ Add environment variables to Vercel (CRM_WEBHOOK_API_KEY)
2. ✅ Redeploy the application
3. ✅ Test with a real form submission
4. ✅ Verify leads appear in your CRM dashboard
5. ✅ Monitor logs for any errors

---

## Need to Update API Key?

If you need to rotate the API key:
1. Update in Vercel: Settings → Environment Variables → Edit `CRM_WEBHOOK_API_KEY`
2. Update in your CRM dashboard
3. Redeploy

**Important:** Never commit the API key to Git! Always use environment variables.

---

Your CRM integration is now secure and ready to capture leads! 🔒✅

