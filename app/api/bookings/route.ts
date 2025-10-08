import { NextRequest, NextResponse } from 'next/server';
import { sendToCustomCRM } from '@/lib/crm-integration';
import { isRateLimited, getRemainingRequests, getResetTime } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - prevent spam (5 requests per IP per 15 minutes)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    if (isRateLimited(ip, 5, 15 * 60 * 1000)) {
      const resetTime = getResetTime(ip);
      console.warn(`⚠️ Rate limit exceeded for IP: ${ip}. Reset in ${resetTime}s`);
      return NextResponse.json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: resetTime,
      }, { status: 429 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.customerName || !body.customerEmail || !body.flightDetails?.from) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customerEmail)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    console.log('📞 New Booking Request from IP:', ip);
    console.log('📋 Customer:', body.customerName, body.customerEmail, body.customerPhone);
    console.log('✈️ Flight:', body.flightDetails?.from, '→', body.flightDetails?.to);

    // Format dates for CRM
    const formatDateForCRM = (dateStr: string | undefined) => {
      if (!dateStr) return null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      
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
      return null;
    };

    // Forward to CRM with API key (secure - server-side only)
    try {
      const crmUrl = process.env.CUSTOM_CRM_URL || 'https://dashboard-alpha-one-85.vercel.app/api/webhooks/leads';
      const apiKey = process.env.CRM_WEBHOOK_API_KEY || 'a71a000b53d3ed32854cf5086f773403fca323adcab0d226e9d9d8a80759442b';
      
      console.log('📤 Forwarding to CRM:', crmUrl);
      
      const crmResponse = await fetch(crmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey, // API key hidden from client
        },
        body: JSON.stringify({
          customerName: body.customerName,
          email: body.customerEmail,
          phone: body.customerPhone || '',
          flightFrom: body.flightDetails.from,
          flightTo: body.flightDetails.to,
          departDate: formatDateForCRM(body.flightDetails.departureDate),
          returnDate: formatDateForCRM(body.flightDetails.returnDate),
          tripType: body.flightDetails.returnDate ? 'roundtrip' : 'oneway',
          numberOfPassengers: body.flightDetails.travelers || 1,
          source: 'landing',
          notes: `Flight: ${body.flightDetails.fromCity || body.flightDetails.from} to ${body.flightDetails.toCity || body.flightDetails.to}${body.flightDetails.price ? `. Price: $${body.flightDetails.price}` : ''}. Class: ${body.flightDetails.class || 'Economy'}. Submitted from AirlinesMap search page.`,
        }),
      });

      const crmResult = await crmResponse.json();
      console.log('📡 CRM Response Status:', crmResponse.status);
      console.log('📊 CRM Result:', JSON.stringify(crmResult, null, 2));
      
      if (crmResponse.ok) {
        console.log('✅ Lead captured in CRM:', crmResult.leadId);
        // Return success to frontend
        return NextResponse.json({
          success: true,
          message: 'Booking request received successfully',
          bookingId: `BK${Date.now()}`,
          leadId: crmResult.leadId,
        });
      } else {
        console.error('❌ CRM error:', crmResult);
        // Still return success to user, but log the error
        return NextResponse.json({
          success: true,
          message: 'Booking request received successfully',
          bookingId: `BK${Date.now()}`,
          warning: 'CRM sync pending',
        });
      }
    } catch (crmError) {
      console.error('❌ CRM connection error:', crmError);
      // Don't fail the request, just log the error
      return NextResponse.json({
        success: true,
        message: 'Booking request received successfully',
        bookingId: `BK${Date.now()}`,
        warning: 'CRM sync failed',
      });
    } catch (error) {
    console.error('❌ Error processing booking:', error);
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

