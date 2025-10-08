# CRM Integration Guide

## Overview
This guide explains how to integrate the booking popup data with your CRM system.

## Data Flow

```
User fills booking form → Submits → /api/bookings → Your CRM
```

## Booking Data Structure

```json
{
  "customerName": "John Doe",
  "customerPhone": "+1 (555) 123-4567",
  "customerEmail": "john@example.com",
  "flightDetails": {
    "from": "JFK",
    "to": "LHR",
    "fromCity": "New York",
    "toCity": "London",
    "departureDate": "Wed, 17 Sep",
    "returnDate": "Wed, 24 Sep",
    "price": "299",
    "travelers": 1,
    "class": "Economy",
    "tripType": "Round-Trip"
  },
  "timestamp": "2024-10-07T12:00:00.000Z",
  "source": "search_page",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

## Integration Options

### Option 1: Direct CRM API Integration

#### Salesforce
```typescript
// In app/api/bookings/route.ts
const crmResponse = await fetch('https://your-instance.salesforce.com/services/data/v58.0/sobjects/Lead', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
  },
  body: JSON.stringify({
    FirstName: bookingData.customerName.split(' ')[0],
    LastName: bookingData.customerName.split(' ').slice(1).join(' ') || 'Unknown',
    Email: bookingData.customerEmail,
    Phone: bookingData.customerPhone,
    Company: 'Flight Booking',
    LeadSource: 'Website',
    Description: `Flight: ${bookingData.flightDetails.fromCity} to ${bookingData.flightDetails.toCity}\nPrice: $${bookingData.flightDetails.price}`,
  }),
});
```

**Environment Variables:**
```env
SALESFORCE_ACCESS_TOKEN=your_salesforce_token
```

#### HubSpot
```typescript
const crmResponse = await fetch('https://api.hubapi.com/contacts/v1/contact/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
  },
  body: JSON.stringify({
    properties: [
      { property: 'email', value: bookingData.customerEmail },
      { property: 'firstname', value: bookingData.customerName.split(' ')[0] },
      { property: 'lastname', value: bookingData.customerName.split(' ').slice(1).join(' ') },
      { property: 'phone', value: bookingData.customerPhone },
      { property: 'flight_route', value: `${bookingData.flightDetails.from}-${bookingData.flightDetails.to}` },
      { property: 'flight_price', value: bookingData.flightDetails.price },
    ],
  }),
});
```

**Environment Variables:**
```env
HUBSPOT_API_KEY=your_hubspot_api_key
```

#### Zoho CRM
```typescript
const crmResponse = await fetch('https://www.zohoapis.com/crm/v2/Leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`,
  },
  body: JSON.stringify({
    data: [{
      First_Name: bookingData.customerName.split(' ')[0],
      Last_Name: bookingData.customerName.split(' ').slice(1).join(' ') || 'Unknown',
      Email: bookingData.customerEmail,
      Phone: bookingData.customerPhone,
      Lead_Source: 'Website',
      Description: `Flight booking request: ${bookingData.flightDetails.fromCity} to ${bookingData.flightDetails.toCity}`,
    }],
  }),
});
```

**Environment Variables:**
```env
ZOHO_ACCESS_TOKEN=your_zoho_token
```

### Option 2: Webhook Integration (Zapier, Make.com, n8n)

#### Zapier Webhook
```typescript
await fetch(process.env.ZAPIER_WEBHOOK_URL!, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(enrichedData),
});
```

**Steps:**
1. Create a Zap in Zapier
2. Choose "Webhooks by Zapier" as trigger
3. Select "Catch Hook"
4. Copy the webhook URL
5. Add to `.env`: `ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/xxxxx/`
6. Connect to any CRM as action (Salesforce, HubSpot, etc.)

#### Make.com (Integromat) Webhook
```typescript
await fetch(process.env.MAKE_WEBHOOK_URL!, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(enrichedData),
});
```

**Steps:**
1. Create a scenario in Make.com
2. Add "Webhooks" module as trigger
3. Choose "Custom webhook"
4. Copy the webhook URL
5. Add to `.env`: `MAKE_WEBHOOK_URL=https://hook.us1.make.com/xxxxx`

#### n8n Webhook
```typescript
await fetch(process.env.N8N_WEBHOOK_URL!, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(enrichedData),
});
```

### Option 3: Email Notification

#### SendGrid
```typescript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: process.env.ADMIN_EMAIL,
  from: process.env.FROM_EMAIL,
  subject: `New Booking: ${bookingData.flightDetails.fromCity} → ${bookingData.flightDetails.toCity}`,
  html: `
    <h2>New Flight Booking Request</h2>
    <h3>Customer Details:</h3>
    <ul>
      <li><strong>Name:</strong> ${bookingData.customerName}</li>
      <li><strong>Email:</strong> ${bookingData.customerEmail}</li>
      <li><strong>Phone:</strong> ${bookingData.customerPhone}</li>
    </ul>
    <h3>Flight Details:</h3>
    <ul>
      <li><strong>From:</strong> ${bookingData.flightDetails.fromCity} (${bookingData.flightDetails.from})</li>
      <li><strong>To:</strong> ${bookingData.flightDetails.toCity} (${bookingData.flightDetails.to})</li>
      <li><strong>Price:</strong> $${bookingData.flightDetails.price}</li>
      <li><strong>Travelers:</strong> ${bookingData.flightDetails.travelers}</li>
      <li><strong>Class:</strong> ${bookingData.flightDetails.class}</li>
    </ul>
  `,
});
```

**Install:** `npm install @sendgrid/mail`

**Environment Variables:**
```env
SENDGRID_API_KEY=SG.xxxxx
ADMIN_EMAIL=admin@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com
```

#### Resend (Modern Alternative)
```typescript
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Bookings <bookings@yourdomain.com>',
  to: process.env.ADMIN_EMAIL!,
  subject: `New Booking: ${bookingData.flightDetails.fromCity} → ${bookingData.flightDetails.toCity}`,
  html: `...`,
});
```

**Install:** `npm install resend`

### Option 4: Google Sheets Integration

```typescript
// Using Google Sheets API
const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_SHEETS_API_KEY });

await sheets.spreadsheets.values.append({
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
  range: 'Bookings!A:K',
  valueInputOption: 'USER_ENTERED',
  requestBody: {
    values: [[
      new Date().toISOString(),
      bookingData.customerName,
      bookingData.customerEmail,
      bookingData.customerPhone,
      bookingData.flightDetails.from,
      bookingData.flightDetails.to,
      bookingData.flightDetails.fromCity,
      bookingData.flightDetails.toCity,
      bookingData.flightDetails.price,
      bookingData.flightDetails.travelers,
      bookingData.flightDetails.class,
    ]],
  },
});
```

### Option 5: SMS Notification (Twilio)

```typescript
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

await client.messages.create({
  body: `New booking: ${bookingData.customerName} - ${bookingData.flightDetails.fromCity} to ${bookingData.flightDetails.toCity} - $${bookingData.flightDetails.price}. Contact: ${bookingData.customerPhone}`,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: process.env.ADMIN_PHONE_NUMBER,
});
```

**Install:** `npm install twilio`

## Recommended Setup

### For Small Scale (< 100 bookings/day)
**Best Option:** Zapier/Make.com Webhook
- No code changes needed
- Easy to set up (5 minutes)
- Connects to any CRM
- Free tier available

### For Medium Scale (100-1000 bookings/day)
**Best Option:** Direct CRM API + Email
- Better performance
- More control
- Lower cost
- Automated workflows

### For Large Scale (1000+ bookings/day)
**Best Option:** Database + Queue System
- PostgreSQL/MongoDB for storage
- Bull/BullMQ for queue processing
- Batch CRM syncing
- Analytics and reporting

## Quick Setup: Zapier Webhook

### Step 1: Create Zapier Webhook
1. Go to https://zapier.com/app/zaps
2. Click "Create Zap"
3. Search for "Webhooks by Zapier"
4. Choose "Catch Hook"
5. Copy your webhook URL

### Step 2: Add Environment Variable
```bash
# .env.local
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/xxxxx/
```

### Step 3: Update API Route
Uncomment this in `app/api/bookings/route.ts`:
```typescript
await fetch(process.env.ZAPIER_WEBHOOK_URL!, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(enrichedData),
});
```

### Step 4: Connect to Your CRM
1. In Zapier, add an action step
2. Choose your CRM (Salesforce, HubSpot, etc.)
3. Map the fields:
   - `customerName` → Lead Name
   - `customerEmail` → Email
   - `customerPhone` → Phone
   - `flightDetails.from` → Custom field
   - `flightDetails.to` → Custom field
   - etc.
4. Test and turn on the Zap

### Step 5: Deploy
```bash
git add .
git commit -m "Add Zapier webhook integration"
git push
```

## Environment Variables Needed

Add these to your `.env.local` (for development) and Vercel Environment Variables (for production):

```env
# Choose ONE or MORE options below based on your needs

# Option 1: Zapier
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/xxxxx/

# Option 2: Make.com
MAKE_WEBHOOK_URL=https://hook.us1.make.com/xxxxx

# Option 3: Direct CRM APIs
SALESFORCE_ACCESS_TOKEN=your_token
HUBSPOT_API_KEY=your_api_key
ZOHO_ACCESS_TOKEN=your_token

# Option 4: Email
SENDGRID_API_KEY=SG.xxxxx
ADMIN_EMAIL=admin@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com

# Option 5: SMS
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
ADMIN_PHONE_NUMBER=+1234567890

# Option 6: Google Sheets
GOOGLE_SHEETS_API_KEY=your_api_key
GOOGLE_SHEET_ID=your_sheet_id

# Option 7: Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

## Testing the Integration

### 1. Test Locally
```bash
npm run dev
# Visit: http://localhost:3000/en/search#/flights/JFK2310LHR241011
# Click on the search results
# Fill the booking form
# Submit
# Check your CRM/Email/Webhook receiver
```

### 2. Test Webhook Delivery
Use tools like:
- **webhook.site** - Free webhook testing
- **RequestBin** - View webhook payloads
- **ngrok** - Tunnel to local server

### 3. Check Logs
```bash
# In Vercel dashboard, check Function Logs
# Look for: "📞 New Booking Request:"
```

## Monitoring & Analytics

### View Booking Logs
Check server logs for:
```
📞 New Booking Request: {
  "customerName": "...",
  "customerEmail": "...",
  ...
}
```

### Track Conversions
Add analytics tracking in `components/BookingPopup.tsx`:
```typescript
// After successful submission
if (window.gtag) {
  window.gtag('event', 'booking_request', {
    event_category: 'conversion',
    event_label: `${bookingData.flightDetails.from}-${bookingData.flightDetails.to}`,
    value: parseFloat(bookingData.flightDetails.price || '0'),
  });
}
```

## Common CRM Field Mappings

| Booking Data | Salesforce | HubSpot | Zoho |
|--------------|------------|---------|------|
| customerName | FirstName, LastName | firstname, lastname | First_Name, Last_Name |
| customerEmail | Email | email | Email |
| customerPhone | Phone | phone | Phone |
| flightDetails.from | Custom: Departure_Code__c | flight_from | Departure_Code |
| flightDetails.to | Custom: Arrival_Code__c | flight_to | Arrival_Code |
| flightDetails.price | Custom: Flight_Price__c | flight_price | Flight_Price |

## Error Handling

The API already includes:
- ✅ Field validation
- ✅ Error logging
- ✅ Graceful failure (won't break if CRM is down)
- ✅ User-friendly error messages

## Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Validate input** - Already implemented
3. **Rate limiting** - Add if needed
4. **HTTPS only** - Vercel provides this
5. **Sanitize data** - Clean user inputs

## Next Steps

1. Choose your integration method (Zapier recommended for quick start)
2. Set up webhook/CRM connection
3. Add environment variables to Vercel
4. Test the integration
5. Monitor the data flow
6. Set up alerts for failed submissions

## Support

For issues:
1. Check Vercel function logs
2. Verify environment variables are set
3. Test webhook URLs manually
4. Check CRM API documentation
5. Review rate limits

---

**Recommended Quick Start:** Use Zapier webhook - it takes 5 minutes to set up and works with any CRM!

