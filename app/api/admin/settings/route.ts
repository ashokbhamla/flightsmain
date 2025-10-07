import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (in production, use a database)
const settings = {
  flightPopupEnabled: true,
  bookingPopupEnabled: true,
  overlayEnabled: true,
  phoneNumber: '+1 (855) 921-4888',
};

// Simple authentication check
function isAuthenticated(request: NextRequest): boolean {
  const authCookie = request.cookies.get('admin_auth');
  return authCookie?.value === 'authenticated';
}

// GET - Fetch current settings
export async function GET(request: NextRequest) {
  const isPublic = request.nextUrl.searchParams.get('public') === 'true';
  
  if (!isPublic && !isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(settings);
}

// POST - Update settings
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Update settings
    if (typeof body.flightPopupEnabled === 'boolean') {
      settings.flightPopupEnabled = body.flightPopupEnabled;
    }
    if (typeof body.bookingPopupEnabled === 'boolean') {
      settings.bookingPopupEnabled = body.bookingPopupEnabled;
    }
    if (typeof body.overlayEnabled === 'boolean') {
      settings.overlayEnabled = body.overlayEnabled;
    }
    if (typeof body.phoneNumber === 'string') {
      settings.phoneNumber = body.phoneNumber;
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

