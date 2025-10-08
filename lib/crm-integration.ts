// Custom CRM Integration Module

interface BookingData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  flightDetails: {
    from: string;
    to: string;
    fromCity?: string;
    toCity?: string;
    departureDate?: string;
    returnDate?: string;
    price?: string;
    travelers?: number;
    class?: string;
    tripType?: string;
  };
  timestamp: string;
  source?: string;
  ip?: string;
  userAgent?: string;
}

/**
 * Send booking data to your custom CRM
 */
export async function sendToCustomCRM(bookingData: BookingData) {
  try {
    // Get CRM configuration from environment variables
    // Default to your webhook if not configured
    const crmUrl = process.env.CUSTOM_CRM_URL || 'https://dashboard-alpha-one-85.vercel.app/api/webhooks/leads';
    const crmApiKey = process.env.CUSTOM_CRM_API_KEY;
    const crmAuthToken = process.env.CUSTOM_CRM_AUTH_TOKEN;

    if (!crmUrl) {
      console.warn('⚠️ CUSTOM_CRM_URL not configured, skipping CRM integration');
      return { success: false, message: 'CRM not configured' };
    }

    // Transform data to match your CRM's expected format
    const crmPayload = transformDataForCRM(bookingData);

    // Prepare headers based on your CRM's authentication method
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Option 1: API Key in header (X-API-Key)
    // Use API key from environment variable for security
    const apiKey = crmApiKey || process.env.CRM_WEBHOOK_API_KEY;
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    } else {
      console.warn('⚠️ No API key configured for CRM webhook');
    }

    // Option 2: Bearer Token
    if (crmAuthToken) {
      headers['Authorization'] = `Bearer ${crmAuthToken}`;
    }

    // Option 3: Basic Auth (uncomment if needed)
    // if (process.env.CUSTOM_CRM_USERNAME && process.env.CUSTOM_CRM_PASSWORD) {
    //   const credentials = Buffer.from(
    //     `${process.env.CUSTOM_CRM_USERNAME}:${process.env.CUSTOM_CRM_PASSWORD}`
    //   ).toString('base64');
    //   headers['Authorization'] = `Basic ${credentials}`;
    // }

    console.log('📤 Sending to CRM:', crmUrl);

    const response = await fetch(crmUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(crmPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ CRM API Error:', response.status, errorText);
      throw new Error(`CRM API returned ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ CRM Response:', result);

    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Error sending to CRM:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Transform booking data to match your CRM's expected format
 * Configured for: dashboard-alpha-one-85.vercel.app/api/webhooks/leads
 */
function transformDataForCRM(bookingData: BookingData) {
  // Format matching your CRM webhook expectations
  return {
    customerName: bookingData.customerName,
    email: bookingData.customerEmail,
    phone: bookingData.customerPhone,
    flightFrom: bookingData.flightDetails.from,
    flightTo: bookingData.flightDetails.to,
    departDate: bookingData.flightDetails.departureDate || '',
    returnDate: bookingData.flightDetails.returnDate || '',
    tripType: bookingData.flightDetails.tripType?.toLowerCase() === 'one-way' ? 'oneway' : 'roundtrip',
    numberOfPassengers: bookingData.flightDetails.travelers || 1,
    source: 'landing', // Source from airlinesmap search page
    notes: `Flight: ${bookingData.flightDetails.fromCity || bookingData.flightDetails.from} to ${bookingData.flightDetails.toCity || bookingData.flightDetails.to}${bookingData.flightDetails.price ? `. Estimated Price: $${bookingData.flightDetails.price}` : ''}. Class: ${bookingData.flightDetails.class || 'Economy'}. Submitted from search page.`,
  };

  // Example 2: If your CRM uses a different structure
  /*
  return {
    lead: {
      contact: {
        firstName: bookingData.customerName.split(' ')[0],
        lastName: bookingData.customerName.split(' ').slice(1).join(' ') || 'Unknown',
        email: bookingData.customerEmail,
        phone: bookingData.customerPhone,
      },
      details: {
        route: `${bookingData.flightDetails.from}-${bookingData.flightDetails.to}`,
        price: bookingData.flightDetails.price,
        travelers: bookingData.flightDetails.travelers,
      },
      metadata: {
        source: 'website',
        timestamp: bookingData.timestamp,
      },
    },
  };
  */

  // Example 3: If your CRM expects flat structure with custom field names
  /*
  return {
    full_name: bookingData.customerName,
    email_address: bookingData.customerEmail,
    phone_number: bookingData.customerPhone,
    flight_from: bookingData.flightDetails.from,
    flight_to: bookingData.flightDetails.to,
    flight_price: bookingData.flightDetails.price,
    lead_source: 'search_page',
    created_at: bookingData.timestamp,
  };
  */
}

/**
 * Alternative: Send booking data via webhook
 * This is useful if you want to process data through a middleware
 */
export async function sendToWebhook(bookingData: BookingData, webhookUrl: string) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Webhook error:', error);
    return { success: false, error };
  }
}

/**
 * Batch send multiple bookings (useful for syncing)
 */
export async function batchSendToCRM(bookings: BookingData[]) {
  const results = await Promise.allSettled(
    bookings.map(booking => sendToCustomCRM(booking))
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`📊 Batch send results: ${successful} successful, ${failed} failed`);

  return { successful, failed, results };
}

