import { NextRequest, NextResponse } from 'next/server';
import { sendToCustomCRM } from '@/lib/crm-integration';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    // Validate required fields
    if (!bookingData.customerName || !bookingData.customerPhone || !bookingData.customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Add timestamp and source
    const enrichedData = {
      ...bookingData,
      source: 'search_page',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      submittedAt: new Date().toISOString(),
    };

    console.log('📞 New Booking Request:', JSON.stringify(enrichedData, null, 2));

    // Send to Custom CRM (automatically if CUSTOM_CRM_URL is configured)
    const crmResult = await sendToCustomCRM(enrichedData);
    if (crmResult.success) {
      console.log('✅ Successfully sent to CRM');
    } else {
      console.warn('⚠️ CRM integration not configured or failed');
    }

    // Option 1: Send to your CRM API
    // Additional CRM integrations (Salesforce, HubSpot, Zoho, etc.)
    /*
    const crmResponse = await fetch(process.env.CRM_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRM_API_KEY}`,
      },
      body: JSON.stringify({
        name: bookingData.customerName,
        email: bookingData.customerEmail,
        phone: bookingData.customerPhone,
        source: 'Website - Search Page',
        flight_from: bookingData.flightDetails.from,
        flight_to: bookingData.flightDetails.to,
        flight_price: bookingData.flightDetails.price,
        notes: `Flight: ${bookingData.flightDetails.fromCity} (${bookingData.flightDetails.from}) → ${bookingData.flightDetails.toCity} (${bookingData.flightDetails.to})\nPrice: $${bookingData.flightDetails.price}\nTravelers: ${bookingData.flightDetails.travelers}\nClass: ${bookingData.flightDetails.class}`,
      }),
    });

    if (!crmResponse.ok) {
      console.error('CRM API error:', await crmResponse.text());
    }
    */

    // Option 2: Send email notification
    // Uncomment and configure for email service
    /*
    await fetch(`${process.env.EMAIL_API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
      },
      body: JSON.stringify({
        to: process.env.ADMIN_EMAIL,
        subject: `New Flight Booking Request - ${bookingData.flightDetails.fromCity} to ${bookingData.flightDetails.toCity}`,
        html: `
          <h2>New Booking Request</h2>
          <h3>Customer Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${bookingData.customerName}</li>
            <li><strong>Email:</strong> ${bookingData.customerEmail}</li>
            <li><strong>Phone:</strong> ${bookingData.customerPhone}</li>
          </ul>
          <h3>Flight Details:</h3>
          <ul>
            <li><strong>Route:</strong> ${bookingData.flightDetails.fromCity} (${bookingData.flightDetails.from}) → ${bookingData.flightDetails.toCity} (${bookingData.flightDetails.to})</li>
            <li><strong>Price:</strong> $${bookingData.flightDetails.price}</li>
            <li><strong>Departure:</strong> ${bookingData.flightDetails.departureDate || 'N/A'}</li>
            <li><strong>Return:</strong> ${bookingData.flightDetails.returnDate || 'N/A'}</li>
            <li><strong>Travelers:</strong> ${bookingData.flightDetails.travelers}</li>
            <li><strong>Class:</strong> ${bookingData.flightDetails.class}</li>
            <li><strong>Trip Type:</strong> ${bookingData.flightDetails.tripType}</li>
          </ul>
          <p><strong>Submitted:</strong> ${enrichedData.submittedAt}</p>
          <p><strong>IP:</strong> ${enrichedData.ip}</p>
        `,
      }),
    });
    */

    // Option 3: Send to Webhook (Zapier, Make.com, n8n, etc.)
    // Automatically sends if WEBHOOK_URL is set
    if (process.env.WEBHOOK_URL) {
      try {
        await fetch(process.env.WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enrichedData),
        });
        console.log('✅ Webhook sent successfully');
      } catch (webhookError) {
        console.error('❌ Webhook error:', webhookError);
        // Don't fail the request if webhook fails
      }
    }

    // Option 4: Save to Database (if you have one)
    // Uncomment and configure
    /*
    const db = await getDatabase(); // Your database connection
    await db.collection('bookings').insertOne(enrichedData);
    */

    // Option 5: Send to Google Sheets
    // See the webhook integration below

    return NextResponse.json({ 
      success: true, 
      message: 'Booking request received successfully',
      bookingId: `BK${Date.now()}`, // Generate a simple booking ID
    });

  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json({ 
      error: 'Failed to process booking request' 
    }, { status: 500 });
  }
}

// GET endpoint to retrieve bookings (for admin panel)
export async function GET(request: NextRequest) {
  // Check authentication
  const authCookie = request.cookies.get('admin_auth');
  if (authCookie?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In production, fetch from database
  // For now, return empty array
  return NextResponse.json({ bookings: [], message: 'Connect to database to see bookings' });
}

