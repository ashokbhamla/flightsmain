# Summary: Extracting iframe Content and Displaying Without iframe

## What Was Created

I've implemented a solution to fetch and display HTML content from the Triposia search widget without using an iframe. This gives you direct access to the DOM elements on your page.

### New Files Created

1. **`app/api/triposia-content/route.ts`** - Server-side API proxy
   - Fetches HTML from `https://search.triposia.com/flights/{searchCode}`
   - Bypasses browser CORS restrictions by fetching on server
   - Returns raw HTML content

2. **`app/[locale]/search/components/TriposiaDirectContent.tsx`** - Direct content renderer
   - Client component that fetches HTML via the API
   - Renders HTML directly using `dangerouslySetInnerHTML`
   - Intercepts clicks on booking buttons
   - Sends postMessage events for popup integration

3. **`app/[locale]/search/example-usage.tsx`** - Usage examples
   - Shows how to use iframe mode (default)
   - Shows how to use direct content mode
   - Examples of conditional rendering

4. **`DIRECT_CONTENT_GUIDE.md`** - Comprehensive documentation
   - Architecture explanation
   - Usage instructions
   - Advantages and limitations
   - Troubleshooting guide

### Modified Files

1. **`app/[locale]/search/components/HashSearchHandler.tsx`**
   - Added `useDirectContent` prop
   - Added conditional rendering between iframe and direct content
   - Maintains backward compatibility (defaults to iframe mode)

## How to Use

### Current Setup (iframe Mode - Working)
Your current search page uses iframe mode by default:

```tsx
// app/[locale]/search/page.tsx
<HashSearchHandler 
  fallbackSearchCode={searchCode} 
  locale={locale}
  // useDirectContent defaults to false
/>
```

### Enable Direct Content Mode

Simply add the `useDirectContent={true}` prop:

```tsx
// app/[locale]/search/page.tsx
<HashSearchHandler 
  fallbackSearchCode={searchCode} 
  locale={locale}
  useDirectContent={true}  // Enable direct content rendering
/>
```

## How It Works

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Client (TriposiaDirectContent.tsx)                         │
│  ├─ Requests: /api/triposia-content?searchCode=XXX         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  API Route (app/api/triposia-content/route.ts)              │
│  ├─ Fetch: https://search.triposia.com/flights/XXX          │
│  ├─ Bypass CORS (server-side fetch)                         │
│  └─ Return: Raw HTML                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Client (TriposiaDirectContent.tsx)                         │
│  ├─ Receive HTML                                            │
│  ├─ Render using dangerouslySetInnerHTML                    │
│  ├─ Intercept clicks on booking buttons                     │
│  └─ Send postMessage to parent                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  HashSearchHandler                                           │
│  ├─ Receive postMessage                                      │
│  ├─ Parse flight data                                        │
│  └─ Open BookingPopup                                        │
└─────────────────────────────────────────────────────────────┘
```

## Key Limitations

⚠️ **IMPORTANT:** This approach has significant limitations:

### 1. JavaScript Won't Execute Properly
- External JavaScript in the fetched HTML will NOT work
- Widget interactions that rely on JavaScript may break
- The content is rendered statically

### 2. Dynamic Content Issues
- If the widget loads content via AJAX/fetch after page load, it won't work
- API calls made by the widget's JavaScript won't execute in your page context
- Only the initial HTML is rendered

### 3. Security Concerns
- Rendering external HTML with `dangerouslySetInnerHTML` has XSS risks
- Consider using DOMPurify to sanitize the HTML first

### 4. URL Problems
- Relative URLs for images, links, or scripts won't work
- Need to transform them to absolute URLs

### 5. CSS Conflicts
- External CSS may conflict with your site's styles
- May need to scope or reset styles

## Recommendation

**Keep using iframe mode** (default) because:
- ✅ Maximum compatibility with the third-party widget
- ✅ JavaScript works properly
- ✅ Dynamic content loads correctly
- ✅ Better security isolation
- ✅ Already working in your codebase

**Only use direct content mode if:**
- ✅ The widget is mostly static HTML/CSS with minimal JavaScript
- ✅ You're willing to implement custom JavaScript for interactions
- ✅ SEO is more important than functionality
- ✅ You can handle the technical challenges

## Testing

To test direct content mode:

1. Open `app/[locale]/search/page.tsx`

2. Modify the HashSearchHandler:
```tsx
<HashSearchHandler 
  fallbackSearchCode={searchCode} 
  locale={locale}
  useDirectContent={true}  // Add this line
/>
```

3. Start your dev server:
```bash
npm run dev
```

4. Visit: `http://localhost:3000/en/search#/flights/JFK2310LHR241011`

5. Check if content renders without iframe border

6. Test if booking buttons work

## Debugging

### Check if API is working:
```bash
curl http://localhost:3000/api/triposia-content?searchCode=JFK2310LHR241011
```

### Check browser console for:
- Network requests to `/api/triposia-content`
- Any JavaScript errors
- Click events being captured

### Check server logs for:
```
🔍 Fetching Triposia content from: https://search.triposia.com/flights/XXX
✅ Triposia content fetched, length: 12345
```

## Alternative Approach

If the direct content approach doesn't work well due to JavaScript limitations, consider:

### Option 1: Full-Screen iframe
Make the iframe appear seamless by styling it to take full viewport:

```css
iframe {
  border: none;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}
```

### Option 2: Proxy with Custom Rendering
Fetch the data yourself and build your own UI:

```typescript
// Fetch flight data from your own API or Triposia API
const flightData = await fetch('/api/flight-data?from=JFK&to=LHR');

// Render your custom UI
return <CustomFlightListing data={flightData} />;
```

### Option 3: Web Components
Use Web Components to embed external widgets more securely than iframes.

## Need Help?

If direct content mode doesn't work as expected:
1. Check browser console for errors
2. Verify the API route is accessible
3. Check if JavaScript errors are blocking functionality
4. Consider sticking with iframe mode

## Summary

✅ **Created**: API proxy, direct content component, documentation, examples
✅ **Modified**: HashSearchHandler to support both modes  
⚠️ **Limitation**: JavaScript and dynamic content may not work
💡 **Recommendation**: Use iframe mode unless you have specific reasons to avoid it

The iframe approach is already working well in your codebase. Only switch to direct content mode if you specifically need SEO benefits and can handle the technical challenges.


