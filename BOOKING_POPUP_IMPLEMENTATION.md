# Booking Popup Implementation

## Overview
This implementation adds a booking request popup that appears when users click the "ticket-action-button-deeplink" buttons inside the Triposia search widget iframe.

## Components Added

### 1. BookingPopup Component (`components/BookingPopup.tsx`)
A Material-UI based popup dialog that collects customer information for flight bookings.

**Features:**
- Displays flight details (from, to, dates, price)
- Collects customer name, phone number, and email
- Form validation
- Call now button
- Request callback button
- Success confirmation animation
- Auto-close after successful submission

**Props:**
- `open: boolean` - Controls popup visibility
- `onClose: () => void` - Callback when popup is closed
- `flightData: object` - Flight information to display
- `phoneNumber: string` - Customer service phone number (default: +1 (855) 921-4888)

### 2. Updated HashSearchHandler Component
Modified to handle booking button clicks and display the BookingPopup.

**New Features:**
- Listens for postMessage events from iframe with type 'bookingButtonClick'
- Monitors iframe DOM for button clicks (with CORS fallback)
- Extracts flight data from URL hash
- Maps airport codes to city names
- Manages BookingPopup state

### 3. Updated TriposiaSearchWidget Component
Enhanced to inject JavaScript into the iframe to capture button clicks.

**Injected Script Features:**
- Monitors all click events inside iframe
- Detects clicks on buttons with classes containing:
  - `ticket-action-button-deeplink`
  - `ticket-action-button`
  - `book-button`
  - `select-button`
- Prevents default button action
- Extracts flight data and price
- Sends postMessage to parent window

## How It Works

### Flow Diagram
```
User clicks ticket button in iframe
          ↓
Injected script captures click event
          ↓
Script extracts flight data from URL hash
          ↓
Script sends postMessage to parent window
          ↓
HashSearchHandler receives message
          ↓
HashSearchHandler extracts flight details
          ↓
BookingPopup opens with flight information
          ↓
User fills form and submits
          ↓
Data can be sent to backend API
          ↓
Success confirmation shown
          ↓
Popup auto-closes after 2 seconds
```

### Data Flow

**URL Pattern:**
```
/en/search#/flights/JFK2310LHR241011
                     ^^^      ^^^
                     FROM     TO
```

**Extracted Data:**
- `from`: JFK (airport code)
- `to`: LHR (airport code)
- `fromCity`: New York (mapped from code)
- `toCity`: London (mapped from code)
- `price`: Extracted from button/nearby elements
- `travelers`: Default 1
- `class`: Default "Economy"
- `tripType`: Default "Round-Trip"

### PostMessage Communication

**Message Format:**
```javascript
{
  type: 'bookingButtonClick',
  action: 'openBooking',
  from: 'JFK',
  to: 'LHR',
  price: '299',
  timestamp: '2024-10-07T...'
}
```

## Fallback Mechanisms

### 1. Cross-Origin Restrictions
Since the iframe is from a different origin (search.triposia.com), we have multiple fallback methods:

**Method 1: Script Injection (Primary)**
- Injects JavaScript into iframe head
- Captures clicks at the document level
- Works if CORS allows script injection

**Method 2: PostMessage Listening (Backup)**
- Listens for messages from iframe
- Works if iframe sends messages

**Method 3: DOM Monitoring (Tertiary)**
- Attempts to access iframe DOM directly
- Falls back silently if CORS blocks access

### 2. Price Extraction
Multiple methods to extract flight prices:

1. From postMessage data
2. From button element
3. From parent ticket element
4. From cached iframe price
5. Fallback to empty string

### 3. City Name Mapping
Comprehensive airport code to city name mapping includes:
- Major US cities (JFK, LAX, ORD, etc.)
- Major international cities (LHR, CDG, DXB, etc.)
- Indian cities (DEL, BOM, BLR, etc.)
- Fallback to airport code if not in map

## Backend Integration

### API Endpoint (To Be Implemented)
```javascript
// Example: app/api/bookings/route.ts
export async function POST(request: NextRequest) {
  const data = await request.json();
  
  // Save to database
  // Send email notification
  // Integrate with CRM
  // etc.
  
  return NextResponse.json({ success: true });
}
```

### Booking Data Structure
```javascript
{
  customerName: "John Doe",
  customerPhone: "+1 (555) 123-4567",
  customerEmail: "john@example.com",
  flightDetails: {
    from: "JFK",
    to: "LHR",
    fromCity: "New York",
    toCity: "London",
    departureDate: "Wed, 17 Sep",
    returnDate: "Wed, 24 Sep",
    price: "299",
    travelers: 1,
    class: "Economy",
    tripType: "Round-Trip"
  },
  timestamp: "2024-10-07T12:00:00.000Z"
}
```

## Customization

### Change Phone Number
Update the phone number in `HashSearchHandler.tsx`:
```jsx
<BookingPopup
  open={showBookingPopup}
  onClose={() => setShowBookingPopup(false)}
  flightData={bookingData}
  phoneNumber="+1 (800) YOUR-NUMBER"
/>
```

### Add More Airport Codes
Update the `cityMap` object in both:
- `app/[locale]/search/components/HashSearchHandler.tsx` (line 125-133)
- Inside the injected script in `app/[locale]/search/components/TriposiaSearchWidget.tsx`

```javascript
const cityMap: { [key: string]: string } = {
  'JFK': 'New York',
  'LAX': 'Los Angeles',
  // Add your codes here
  'XYZ': 'Your City Name',
};
```

### Modify Button Detection
Update the button class detection in the injected script:
```javascript
if (className.includes && (
  className.includes('ticket-action-button-deeplink') ||
  className.includes('your-custom-button-class') ||
  // Add more button classes
)) {
  // ...
}
```

### Style Customization
The popup uses Material-UI components. Customize styles in `components/BookingPopup.tsx`:

```jsx
<Dialog
  PaperProps={{
    sx: {
      borderRadius: 2, // Change border radius
      boxShadow: '...', // Change shadow
      // Add your custom styles
    },
  }}
>
```

## Testing

### Local Testing
1. Run development server: `npm run dev`
2. Navigate to: `http://localhost:3000/en/search#/flights/JFK2310LHR241011`
3. Click any ticket action button in the iframe
4. Popup should appear with flight details

### Test Cases
- [ ] Popup opens when button is clicked
- [ ] Flight details are correctly extracted from URL
- [ ] Price is displayed (if available)
- [ ] Form validation works
- [ ] Call now button triggers phone call
- [ ] Request callback submits form
- [ ] Success message appears
- [ ] Popup auto-closes after success
- [ ] Works with different URL patterns
- [ ] Works with different airport codes

### Debug Mode
Check browser console for:
- "Booking button clicked, opening booking popup"
- "Booking button clicked, message sent to parent"
- PostMessage data logs

## Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE 11 (not supported)

## Known Limitations

1. **CORS Restrictions**: Script injection may fail if iframe has strict CORS policies
2. **Button Class Names**: If iframe updates button class names, detection may break
3. **URL Pattern Changes**: If URL hash format changes, extraction logic needs update
4. **Price Extraction**: May not always find price if DOM structure changes

## Troubleshooting

### Popup Not Opening
1. Check if postMessage is being sent (browser console)
2. Verify button class names match detection logic
3. Ensure URL hash format is correct
4. Check for JavaScript errors in console

### Wrong Flight Data
1. Verify URL hash contains correct airport codes
2. Check if airport codes exist in cityMap
3. Confirm URL pattern matches regex

### Price Not Showing
1. Check if price element exists in iframe
2. Verify price extraction selector
3. Ensure price format matches regex

## Future Enhancements

- [ ] Add date extraction from URL
- [ ] Support for one-way trips
- [ ] Multi-traveler support
- [ ] Cabin class selection
- [ ] Real-time price updates
- [ ] Integration with booking system
- [ ] Email confirmation
- [ ] SMS notifications
- [ ] Analytics tracking
- [ ] A/B testing support

## Support
For issues or questions, contact the development team.

