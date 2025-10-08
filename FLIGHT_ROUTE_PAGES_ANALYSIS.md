# Flight Route Pages Analysis: /flights/del-hyd

## Page Structure Overview

Route pages like `/flights/del-hyd` use the `FlightTemplate` component with data from multiple APIs.

---

## Data Sources Breakdown

### 🟢 DYNAMIC DATA (From APIs)

#### 1. **Content API** (`/content/flights`)
**Endpoint:** `/content/flights?arrival_iata=HYD&departure_iata=DEL&lang_id=1&domain_id=1`

**Dynamic Content:**
- ✅ Meta title (`title`)
- ✅ Meta description (`description`)
- ✅ Meta keywords (`meta_keywords`)
- ✅ Page heading (`h1` or from title)
- ✅ Page description (from `description`)
- ✅ Weekly graph description (`weekly`)
- ✅ Monthly graph description (`monthly`)
- ✅ Temperature graph description (`temperature`)
- ✅ Rainfall graph description (`rainfall`)
- ✅ Stats section HTML (`stats`)
- ✅ City information HTML (`city`)
- ✅ Places to visit HTML (`places`)
- ✅ Hotels HTML (`hotels`)
- ✅ Airlines HTML (`airlines`)
- ✅ FAQs array (`faqs`)

#### 2. **Real Flight Data API** (`/real/flights`)
**Endpoint:** `/real/flights?arrival_iata=HYD&departure_iata=DEL&lang_id=1&domain_id=1`

**Dynamic Data:**
- ✅ Weekly price data (`weekly_prices_avg` array - 7 days)
- ✅ Monthly price data (`monthly_prices_avg` array - 12 months)
- ✅ Temperature data (`monthly_temperature_avg` array - 12 months)
- ✅ Rainfall data (`monthly_rainfall_avg` array - 12 months)
- ✅ Round trip start price (`round_trip_start`)
- ✅ One-way trip start price (`oneway_trip_start`)
- ✅ Cheapest day (`cheapest_day`)
- ✅ Cheapest month (calculated from monthly array)
- ✅ Flight list data (if available)

#### 3. **City API** (for city-specific content)
**Endpoint:** `/real/city?city_iata=DEL&lang_id=1&domain_id=1`

**Dynamic Data:**
- ✅ City name (`city_name`)
- ✅ Best time to visit (`best_time_to_visit`)
- ✅ Weather info (`weather`)
- ✅ Overview (`overview`)
- ✅ Peak season (`peak_season`)

---

### 🔴 HARDCODED DATA (Not from APIs)

#### 1. **City Name Mapping**
**Location:** `app/[locale]/flights/[slug]/page.tsx` - Lines 54-87

```typescript
const cityMap = {
  'LAX': 'Los Angeles',
  'JFK': 'New York',
  'DEL': 'Delhi',
  'HYD': 'Hyderabad',
  'BOM': 'Mumbai',
  // ... more cities
};
```

**Issue:** ❌ Hardcoded city names instead of using City API
**Fix:** Should use `/real/city` API for city names

#### 2. **Fallback Translations**
**Location:** `app/[locale]/templates/FlightTemplate.tsx` - Lines 28-100+

```typescript
const content = {
  en: {
    title: `Flights from ${departureCity}...`,
    description: `Plan your journey...`,
    cheapDealsTitle: `Cheap flight deals...`,
    // ... all static text
  },
  // ... es, ru, fr
};
```

**Issue:** ⚠️ Fallback content (used when API fails)
**Status:** This is OK as fallback, but should prioritize API content

#### 3. **Mock Flight Enhancement Data**
**Location:** `app/[locale]/flights/[slug]/page.tsx` - Lines 103-114

```typescript
function enhanceFlightData(flights: any[]): any[] {
  return flights.map(flight => {
    const stopsOptions = [0, 0, 0, 1, 1, 2]; // HARDCODED
    const randomStops = stopsOptions[Math.floor(Math.random() * stopsOptions.length)];
    
    return {
      ...flight,
      isDirect: randomStops === 0,
      stops: randomStops // HARDCODED/RANDOM
    };
  });
}
```

**Issue:** ❌ Random/mock stops data
**Fix:** Should come from flight API if available

#### 4. **Random Destination Function**
**Location:** Lines 92-100

```typescript
function getRandomDestination(): string {
  const destinations = [
    'New York JFK', 'London LHR', // HARDCODED LIST
    // ...
  ];
  return destinations[Math.floor(Math.random() * destinations.length)];
}
```

**Issue:** ❌ Not being used, but still hardcoded
**Status:** Can be removed

---

## JSON-LD Schemas

### 🟢 DYNAMIC Schemas (From APIs)

1. ✅ **Flight List Schema** - Uses real flight data from API
2. ✅ **Dataset Schema** - Uses weekly/monthly graph data from API
3. ✅ **FAQ Schema** - Uses FAQs array from content API
4. ✅ **Organization Schema** - Uses environment variables
5. ✅ **Breadcrumb Schema** - Dynamic based on route

### 🔴 PARTIALLY DYNAMIC

1. ⚠️ **Product Schema** - Uses API data but has some hardcoded fallbacks
2. ⚠️ **Page Content** - Mix of API content and hardcoded translations

---

## Components Used

### **Main Components:**
1. `FlightSearchBox` - Interactive search widget
2. `ClientPriceGraph` - Renders 4 graphs (Weekly, Monthly, Temperature, Rainfall)
3. `FlightTabs` - Shows flight listings
4. `SchemaOrg` - Renders JSON-LD schemas

---

## Current Data Flow

```
/flights/del-hyd
      ↓
Parse slug → DEL (departure), HYD (arrival)
      ↓
Fetch APIs in parallel:
  - getCachedFlightContent(HYD, DEL, langId, domainId)
  - getCachedFlightData(HYD, DEL, langId, domainId)
      ↓
Pass to FlightTemplate component
      ↓
FlightTemplate renders:
  - Meta (from API or fallback)
  - Heading (from API or fallback)
  - Search Box (dynamic)
  - 4 Price Cards (from API data):
    * Round trip start from
    * One-way from
    * Cheapest day
    * Cheapest month
  - 4 Graphs (from API data):
    * Weekly prices (7 days)
    * Monthly prices (12 months)
    * Temperature (12 months)
    * Rainfall (12 months)
  - Content Sections (from API with dangerouslySetInnerHTML):
    * Stats
    * City
    * Places
    * Hotels
    * Airlines
  - FAQs (from API)
  - JSON-LD Schemas (mostly dynamic)
```

---

## Percentage Breakdown

### **Overall:**
- 🟢 **~85% Dynamic** (from APIs)
- 🔴 **~15% Hardcoded** (city names, fallbacks, mock data)

### **By Section:**

| Section | Dynamic % | Source |
|---------|-----------|--------|
| Meta Tags | 90% | Content API + fallback |
| Heading/Description | 95% | Content API |
| Price Cards | 100% | Real Flight Data API |
| Graphs (4 charts) | 100% | Real Flight Data API |
| Graph Descriptions | 100% | Content API |
| Stats/City/Places/Hotels/Airlines | 100% | Content API (HTML) |
| FAQs | 100% | Content API |
| JSON-LD Schemas | 95% | APIs + env vars |
| City Names | 0% | ❌ Hardcoded cityMap |
| Flight Stops | 0% | ❌ Random/mock |

---

## Issues to Fix

### 🔴 **Critical Issues:**

1. **Hardcoded City Names**
   - **Current:** Using `cityMap` object
   - **Should be:** `/real/city` API
   - **Impact:** City names not multilingual, limited to mapped cities

2. **Random Stops Data**
   - **Current:** `enhanceFlightData()` adds random stops
   - **Should be:** From flight API if available
   - **Impact:** Inaccurate flight information

### ⚠️ **Minor Issues:**

3. **Unused Functions**
   - `getRandomDestination()` - not being used
   - Should be removed for cleaner code

4. **Mock Duration/Times**
   - Lines 312-317: Some fallback durations/times are random
   - Should come from API or be marked as "estimated"

---

## Recommendations

### **Priority 1: Replace Hardcoded City Names**
```typescript
// Instead of cityMap, fetch from API:
const cityData = await fetchCityByIata(iataCode, langId, domainId);
const cityName = cityData?.city_name || iataCode;
```

### **Priority 2: Remove Random Stops**
```typescript
// Use actual stops data from API or don't show if unavailable
const stops = flight.stops || null; // Don't make up data
```

### **Priority 3: Clean Up Unused Code**
- Remove `getRandomDestination()`
- Remove unused imports

---

## API Integration Summary

### **APIs Currently Used:**
1. ✅ `/content/flights` - Page content, descriptions, HTML sections
2. ✅ `/real/flights` - Price data, graphs, flight listings
3. ⚠️ `/real/city` - **Partially used** (should be used for city names too)

### **Data Quality:**
- **High Quality:** Graph data, prices, content sections
- **Medium Quality:** Meta tags (good fallbacks)
- **Low Quality:** City names (hardcoded), stops (random)

---

## Conclusion

The `/flights/del-hyd` pages are **mostly dynamic** (~85%), with data coming from your APIs. The main issues are:

1. ❌ **City names are hardcoded** - Should use City API
2. ❌ **Flight stops are random** - Should use real data or omit
3. ✅ **Everything else is dynamic** from APIs

**Next step:** Would you like me to fix these issues and make the page 100% dynamic?

