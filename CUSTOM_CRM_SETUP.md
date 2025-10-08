# Custom CRM Integration Setup

## Quick Start

Your booking popup data will automatically send to your custom CRM once you configure the environment variables.

## Step 1: Configure Environment Variables

Add these to your Vercel Environment Variables (or `.env.local` for local testing):

### Required:
```env
CUSTOM_CRM_URL=https://your-crm.com/api/leads
```

### Choose ONE authentication method:

**Option A: API Key**
```env
CUSTOM_CRM_API_KEY=your_api_key_here
```

**Option B: Bearer Token**
```env
CUSTOM_CRM_AUTH_TOKEN=your_bearer_token_here
```

**Option C: Basic Auth** (if your CRM uses username/password)
```env
CUSTOM_CRM_USERNAME=your_username
CUSTOM_CRM_PASSWORD=your_password
```

## Step 2: Customize Data Format

Edit `lib/crm-integration.ts` function `transformDataForCRM()` to match your CRM's API:

### Example 1: If your CRM expects this format:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555-123-4567",
  "flight_from": "JFK",
  "flight_to": "LHR",
  "price": "299"
}
```

**Use this transformation:**
```typescript
function transformDataForCRM(bookingData: BookingData) {
  return {
    name: bookingData.customerName,
    email: bookingData.customerEmail,
    phone: bookingData.customerPhone,
    flight_from: bookingData.flightDetails.from,
    flight_to: bookingData.flightDetails.to,
    price: bookingData.flightDetails.price,
  };
}
```

### Example 2: If your CRM expects nested objects:
```json
{
  "contact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 555-123-4567"
  },
  "booking": {
    "route": "JFK-LHR",
    "price": 299,
    "travelers": 1
  }
}
```

**Use this transformation:**
```typescript
function transformDataForCRM(bookingData: BookingData) {
  return {
    contact: {
      name: bookingData.customerName,
      email: bookingData.customerEmail,
      phone: bookingData.customerPhone,
    },
    booking: {
      route: `${bookingData.flightDetails.from}-${bookingData.flightDetails.to}`,
      price: parseFloat(bookingData.flightDetails.price || '0'),
      travelers: bookingData.flightDetails.travelers,
    },
  };
}
```

### Example 3: Custom CRM with specific field names
Replace the entire `transformDataForCRM` function with your structure.

## Step 3: Enable Basic Auth (if needed)

If your CRM uses Basic Authentication, uncomment these lines in `lib/crm-integration.ts`:

```typescript
// Option 3: Basic Auth (uncomment if needed)
if (process.env.CUSTOM_CRM_USERNAME && process.env.CUSTOM_CRM_PASSWORD) {
  const credentials = Buffer.from(
    `${process.env.CUSTOM_CRM_USERNAME}:${process.env.CUSTOM_CRM_PASSWORD}`
  ).toString('base64');
  headers['Authorization'] = `Basic ${credentials}`;
}
```

And add these environment variables:
```env
CUSTOM_CRM_USERNAME=your_crm_username
CUSTOM_CRM_PASSWORD=your_crm_password
```

## Step 4: Test the Integration

### Local Testing:
1. Add variables to `.env.local`
2. Run: `npm run dev`
3. Visit: `http://localhost:3000/en/search#/flights/JFK2310LHR241011`
4. Click on search results → Fill form → Submit
5. Check console logs for: `✅ Successfully sent to CRM`
6. Check your CRM for the new lead/contact

### Production Testing:
1. Add variables to Vercel Environment Variables
2. Deploy your changes
3. Test on production: `https://airlinesmap.com/en/search#/flights/JFK2310LHR241011`
4. Check Vercel Function Logs for confirmation

## Step 5: Add to Vercel

### Via Vercel Dashboard:
1. Go to your project settings
2. Click "Environment Variables"
3. Add each variable:
   - `CUSTOM_CRM_URL`
   - `CUSTOM_CRM_API_KEY` (or chosen auth method)
4. Redeploy

### Via CLI:
```bash
vercel env add CUSTOM_CRM_URL production
# Enter your CRM URL when prompted

vercel env add CUSTOM_CRM_API_KEY production
# Enter your API key when prompted
```

## Complete Environment Variables Reference

```env
# Custom CRM - REQUIRED
CUSTOM_CRM_URL=https://your-crm.com/api/leads

# Authentication - Choose ONE method
CUSTOM_CRM_API_KEY=sk_live_xxxxx                    # For API Key auth
CUSTOM_CRM_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5...   # For Bearer Token auth
CUSTOM_CRM_USERNAME=admin                            # For Basic Auth
CUSTOM_CRM_PASSWORD=password123                      # For Basic Auth

# Optional: Webhook for backup/logging
WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/xxxxx/

# Optional: Email notifications
SENDGRID_API_KEY=SG.xxxxx
ADMIN_EMAIL=admin@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com
```

## Troubleshooting

### Issue: "CRM not configured"
**Solution:** Make sure `CUSTOM_CRM_URL` is set in Vercel environment variables

### Issue: "401 Unauthorized"
**Solution:** 
- Check your API key/token is correct
- Verify the authentication method matches your CRM
- Check if token has expired

### Issue: "400 Bad Request"
**Solution:** 
- Your CRM expects different data format
- Update `transformDataForCRM()` function
- Check CRM API documentation for required fields

### Issue: Data not appearing in CRM
**Solution:**
- Check Vercel Function Logs for errors
- Test the CRM API endpoint with Postman
- Verify field mappings are correct
- Check CRM for validation rules

## Monitoring

### View Logs in Vercel:
1. Go to Vercel Dashboard
2. Click your project
3. Go to "Functions" tab
4. Select `/api/bookings`
5. View real-time logs

### Look for these messages:
- ✅ `Successfully sent to CRM` - Integration working
- ⚠️ `CRM integration not configured` - Missing env vars
- ❌ `CRM API Error: 401` - Authentication issue
- ❌ `CRM API Error: 400` - Data format issue

## Advanced Configuration

### Add Custom Headers
Edit `lib/crm-integration.ts`:
```typescript
headers['X-Custom-Header'] = 'value';
headers['X-API-Version'] = 'v2';
```

### Add Query Parameters
```typescript
const crmUrl = `${process.env.CUSTOM_CRM_URL}?api_key=${crmApiKey}&source=website`;
```

### Handle Different HTTP Methods
If your CRM uses PUT or PATCH:
```typescript
const response = await fetch(crmUrl, {
  method: 'PUT', // or 'PATCH'
  headers,
  body: JSON.stringify(crmPayload),
});
```

### Retry Logic
```typescript
let attempts = 0;
const maxAttempts = 3;

while (attempts < maxAttempts) {
  try {
    const response = await fetch(crmUrl, { /* ... */ });
    if (response.ok) break;
  } catch (error) {
    attempts++;
    if (attempts === maxAttempts) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
  }
}
```

## Next Steps

1. ✅ Get your CRM API endpoint URL
2. ✅ Get your CRM API credentials (key/token)
3. ✅ Add environment variables to Vercel
4. ✅ Customize `transformDataForCRM()` if needed
5. ✅ Test the integration
6. ✅ Monitor the logs
7. ✅ Set up error alerts

## Need Help?

Share your CRM's API documentation and I can help you:
- Configure the authentication
- Map the data fields correctly
- Handle any custom requirements
- Set up error handling
- Add retry logic

---

**The integration is ready!** Just add your CRM credentials and it will work automatically. 🚀

