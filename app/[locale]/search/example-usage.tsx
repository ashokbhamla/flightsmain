// EXAMPLE: How to use HashSearchHandler with both iframe and direct content modes

'use client';

import { useState, useEffect } from 'react';
import HashSearchHandler from './components/HashSearchHandler';

// ============================================
// Example 1: Default iframe mode (RECOMMENDED)
// ============================================
export function IframeModeExample() {
  return (
    <HashSearchHandler 
      fallbackSearchCode="JFK2310LHR241011" 
      locale="en" 
      // useDirectContent defaults to false
    />
  );
}

// ============================================
// Example 2: Direct content mode
// ============================================
export function DirectContentModeExample() {
  return (
    <HashSearchHandler 
      fallbackSearchCode="JFK2310LHR241011" 
      locale="en"
      useDirectContent={true}  // Enable direct content rendering
    />
  );
}

// ============================================
// Example 3: Conditional rendering based on feature flag
// ============================================
export function ConditionalExample() {
  // You could use environment variables or API settings
  const useDirectContent = process.env.NEXT_PUBLIC_USE_DIRECT_CONTENT === 'true';
  
  return (
    <HashSearchHandler 
      fallbackSearchCode="JFK2310LHR241011" 
      locale="en"
      useDirectContent={useDirectContent}
    />
  );
}

// ============================================
// Example 4: With admin settings from API
// ============================================
export function AdminSettingsExample() {
  const [settings, setSettings] = useState({ useDirectContent: false });
  
  useEffect(() => {
    fetch('/api/admin/settings?public=true')
      .then(r => r.json())
      .then(data => setSettings(data));
  }, []);
  
  return (
    <HashSearchHandler 
      fallbackSearchCode="JFK2310LHR241011" 
      locale="en"
      useDirectContent={settings.useDirectContent}
    />
  );
}

// ============================================
// To enable direct content mode:
// ============================================
// 
// Option 1: Add to page.tsx
// ============================================
/*
// app/[locale]/search/page.tsx
<HashSearchHandler 
  fallbackSearchCode={searchCode} 
  locale={locale}
  useDirectContent={true}  // <-- Add this
/>
*/

// ============================================
// Option 2: Use environment variable
// ============================================
/*
// .env.local
NEXT_PUBLIC_USE_DIRECT_CONTENT=true

// In your component
const useDirectContent = process.env.NEXT_PUBLIC_USE_DIRECT_CONTENT === 'true';

<HashSearchHandler 
  useDirectContent={useDirectContent}
  // ... other props
/>
*/

// ============================================
// Option 3: Admin dashboard setting
// ============================================
/*
// Add to your admin settings:
{
  flightPopupEnabled: true,
  bookingPopupEnabled: true,
  overlayEnabled: true,
  useDirectContent: false,  // <-- Add this
  phoneNumber: '+1 (855) 921-4888',
}

// Then fetch and use it:
const [settings, setSettings] = useState({ useDirectContent: false });
// ... fetch settings ...

<HashSearchHandler 
  useDirectContent={settings.useDirectContent}
  // ... other props
/>
*/

