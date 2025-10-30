# Direct Content Rendering Guide

## Overview

This implementation allows you to fetch and render HTML content from the Triposia search widget directly on your page **without using an iframe**. The content is fetched server-side and rendered inline.

## Architecture

### Components

1. **API Route** (`app/api/triposia-content/route.ts`)
   - Server-side proxy that fetches HTML from `https://search.triposia.com`
   - Bypasses CORS restrictions by fetching on the server
   - Returns raw HTML content

2. **Direct Content Component** (`app/[locale]/search/components/TriposiaDirectContent.tsx`)
   - Client-side component that fetches HTML via API
   - Renders HTML using `dangerouslySetInnerHTML`
   - Handles click events for booking buttons
   - Sends postMessage events for popup integration

3. **HashSearchHandler** (Updated)
   - Added `useDirectContent` prop to switch between iframe and direct rendering
   - Defaults to iframe mode for backward compatibility

## Usage

### Basic Usage (Iframe Mode - Default)
```tsx
import HashSearchHandler from './components/HashSearchHandler';

<HashSearchHandler 
  fallbackSearchCode="JFK2310LHR241011" 
  locale="en" 
/>
```

### Direct Content Mode
```tsx
import HashSearchHandler from './components/HashSearchHandler';

<HashSearchHandler 
  fallbackSearchCode="JFK2310LHR241011" 
  locale="en"
  useDirectContent={true} 
/>
```

## How It Works

### Request Flow
```
1. Client requests content via TriposiaDirectContent component
2. Component calls /api/triposia-content?searchCode=XXX
3. API route fetches HTML from https://search.triposia.com/flights/XXX
4. HTML is returned to client
5. Component renders HTML using dangerouslySetInnerHTML
6. Click events are intercepted and sent as postMessage
7. Parent component receives messages and opens popups
```

### Event Handling

The direct content component intercepts clicks on booking buttons and sends postMessage events:

```javascript
window.parent?.postMessage({
  type: 'bookingButtonClick',
  action: 'openBooking',
  timestamp: new Date().toISOString()
}, '*');
```

The `HashSearchHandler` listens for these messages and opens the booking popup.

## Advantages of Direct Content

✅ **Better SEO** - Content is part of your page DOM
✅ **No iframe borders** - Seamless integration
✅ **Direct styling control** - Can override CSS
✅ **Faster initial load** - No iframe overhead
✅ **Better mobile experience** - No iframe scrolling issues

## Limitations & Challenges

⚠️ **JavaScript execution issues** - External JavaScript may not work
⚠️ **Dynamic content** - Content loaded via AJAX may not load properly
⚠️ **Security concerns** - Rendering external HTML requires sanitization
⚠️ **Relative URLs** - Links and images may need URL fixing
⚠️ **CSS conflicts** - External styles may conflict with your styles

## Important Considerations

### 1. JavaScript Execution

The fetched HTML will NOT execute external JavaScript properly. The content is rendered statically.

**Solution:** If the widget relies heavily on JavaScript:
- Use iframe mode instead
- Or implement custom JavaScript to handle interactions

### 2. Dynamic Content Loading

If the widget loads content via AJAX/API after initial load, it won't work in direct mode.

**Solution:** 
- Monitor the network requests
- Implement custom API calls to fetch the dynamic content
- Or stick with iframe mode

### 3. Security - XSS Protection

Always be careful when rendering external HTML. Consider using a library like DOMPurify:

```tsx
import DOMPurify from 'isomorphic-dompurify';

const sanitizedHtml = DOMPurify.sanitize(htmlContent);
```

### 4. Relative URLs

External HTML may contain relative URLs that won't work.

**Solution:** Transform URLs:
```javascript
const fixUrls = (html: string, baseUrl: string) => {
  return html
    .replace(/src="\//g, `src="${baseUrl}/`)
    .replace(/href="\//g, `href="${baseUrl}/`);
};
```

### 5. CSS Conflicts

External styles may conflict with your site's CSS.

**Solution:** Scope the styles:
```css
.triposia-content-wrapper {
  /* Isolate styles */
  isolation: isolate;
}

.triposia-content-wrapper * {
  /* Reset styles if needed */
  box-sizing: border-box;
}
```

## Testing

### Test Direct Content Mode

1. Update the search page to enable direct content:
```tsx
// app/[locale]/search/page.tsx
<HashSearchHandler 
  fallbackSearchCode={searchCode} 
  locale={locale}
  useDirectContent={true}  // Add this
/>
```

2. Visit: `http://localhost:3000/en/search#/flights/JFK2310LHR241011`
3. Verify content loads without iframe
4. Check browser console for any errors

### Test iframe Mode (Default)

1. Remove the `useDirectContent` prop
2. Visit the same URL
3. Verify iframe loads and functions normally

## Debugging

### Check Network Requests
```javascript
// In browser console
fetch('/api/triposia-content?searchCode=JFK2310LHR241011')
  .then(r => r.text())
  .then(html => console.log(html.substring(0, 500)));
```

### Check Server Logs
Look for these logs in your server output:
```
🔍 Fetching Triposia content from: https://search.triposia.com/flights/XXX
✅ Triposia content fetched, length: 12345
```

## Fallback Strategy

The component automatically falls back to iframe mode if:
- API request fails
- HTML is empty or invalid
- CORS errors occur

## Production Considerations

### Caching
Add caching to the API route to reduce server load:

```typescript
export async function GET(request: NextRequest) {
  // Add caching headers
  const response = await fetch(triposiaUrl, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  // Or use Redis cache
  const cacheKey = `triposia-content-${searchCode}`;
  let html = await RedisCache.get(cacheKey);
  
  if (!html) {
    const res = await fetch(triposiaUrl);
    html = await res.text();
    await RedisCache.set(cacheKey, html, 3600);
  }
}
```

### Error Handling
Add comprehensive error handling:

```typescript
export async function GET(request: NextRequest) {
  try {
    // ... fetch logic
  } catch (error) {
    console.error('Triposia fetch error:', error);
    
    // Return fallback HTML or error message
    return new NextResponse(
      '<div>Content temporarily unavailable</div>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}
```

## Recommendation

**Use iframe mode** if:
- ✅ Widget has complex JavaScript interactions
- ✅ Widget loads dynamic content via AJAX
- ✅ You want maximum compatibility
- ✅ Widget is maintained by third party

**Use direct content mode** if:
- ✅ Widget is mostly static HTML/CSS
- ✅ SEO is a priority
- ✅ You want full control over styling
- ✅ You can handle JavaScript interactions

## Support

For issues or questions:
1. Check browser console for errors
2. Check server logs
3. Test both modes to compare
4. Contact development team


