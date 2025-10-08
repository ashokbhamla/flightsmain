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
    // Use API key from environment variable, fallback to hardcoded default
    const apiKey = crmApiKey || process.env.CRM_WEBHOOK_API_KEY || 'a71a000b53d3ed32854cf5086f773403fca323adcab0d226e9d9d8a80759442b';
    headers['X-API-Key'] = apiKey;
    console.log('🔑 API Key configured:', apiKey.substring(0, 10) + '...');

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
    console.log('🔑 Using API Key:', apiKey ? 'Yes (configured)' : 'No');
    console.log('📦 Payload:', JSON.stringify(crmPayload, null, 2));

    const response = await fetch(crmUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(crmPayload),
    });

    console.log('📡 CRM Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ CRM API Error:', response.status, errorText);
      throw new Error(`CRM API returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ CRM Response:', JSON.stringify(result, null, 2));

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
  // Convert date format if needed (e.g., "23 Oct" to "2025-10-23")
  const formatDateForCRM = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    
    // Try to parse "23 Oct" or "23 Oct 2025" format
    try {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const parts = dateStr.split(' ');
      if (parts.length >= 2) {
        const day = parts[0].padStart(2, '0');
        const monthIndex = monthNames.findIndex(m => m === parts[1]);
        if (monthIndex >= 0) {
          const month = (monthIndex + 1).toString().padStart(2, '0');
          const year = parts[2] || new Date().getFullYear().toString();
          return `${year}-${month}-${day}`;
        }
      }
    } catch (e) {
      console.error('Date parsing error:', e);
    }
    
    return dateStr; // Return original if parsing fails
  };
  
  // Format matching your CRM webhook expectations
  return {
    customerName: bookingData.customerName,
    email: bookingData.customerEmail,
    phone: bookingData.customerPhone,
    flightFrom: bookingData.flightDetails.from,
    flightTo: bookingData.flightDetails.to,
    departDate: formatDateForCRM(bookingData.flightDetails.departureDate),
    returnDate: formatDateForCRM(bookingData.flightDetails.returnDate),
    tripType: bookingData.flightDetails.tripType?.toLowerCase() === 'one-way' ? 'oneway' : 'roundtrip',
    numberOfPassengers: bookingData.flightDetails.travelers || 1,
    source: 'landing', // Source from airlinesmap search page
    notes: `Flight: ${bookingData.flightDetails.fromCity || bookingData.flightDetails.from} to ${bookingData.flightDetails.toCity || bookingData.flightDetails.to}${bookingData.flightDetails.price ? `. Estimated Price: $${bookingData.flightDetails.price}` : ''}. Class: ${bookingData.flightDetails.class || 'Economy'}. Submitted from AirlinesMap search page.`,
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

