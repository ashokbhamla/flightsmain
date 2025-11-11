import { NextRequest, NextResponse } from 'next/server';
import { getAdminSettings, updateAdminSettings } from '@/lib/adminSettings';

// Simple authentication check
function isAuthenticated(request: NextRequest): boolean {
  const authCookie = request.cookies.get('admin_auth');
  return authCookie?.value === 'authenticated';
}

// GET - Fetch current settings
export async function GET(request: NextRequest) {
  const isPublic = request.nextUrl.searchParams.get('public') === 'true';
  const settings = await getAdminSettings();
  
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
    const settings = await updateAdminSettings({
      flightPopupEnabled: typeof body.flightPopupEnabled === 'boolean'
        ? body.flightPopupEnabled
        : undefined,
      bookingPopupEnabled: typeof body.bookingPopupEnabled === 'boolean'
        ? body.bookingPopupEnabled
        : undefined,
      overlayEnabled: typeof body.overlayEnabled === 'boolean'
        ? body.overlayEnabled
        : undefined,
      phoneNumber: typeof body.phoneNumber === 'string'
        ? body.phoneNumber
        : undefined,
      leadPageEnabled: typeof body.leadPageEnabled === 'boolean'
        ? body.leadPageEnabled
        : undefined,
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

