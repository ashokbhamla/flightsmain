# Complete Pages List - All URLs and Page Mechanisms

## 🌐 **Base URL Structure**
- **Base URL**: `https://yourdomain.com` or `http://localhost:3000`
- **Supported Languages**: English (en), Spanish (es), Russian (ru), French (fr)
- **Default Language**: English (accessible at root `/`)

## 📋 **All Page Types and URLs**

### 🏠 **1. Home Page**
```
URL Pattern: /[locale]
Examples:
- / (English - default)
- /en (English)
- /es (Spanish)
- /ru (Russian)
- /fr (French)

File: app/[locale]/page.tsx
Component: HomePageContent
```

### ✈️ **2. Airlines Pages**

#### 2.1 Airlines Index Page
```
URL Pattern: /[locale]/airlines
Examples:
- /airlines
- /es/airlines
- /ru/airlines
- /fr/airlines

File: app/[locale]/airlines/page.tsx
```

#### 2.2 Individual Airline Page
```
URL Pattern: /[locale]/airlines/[airline]
Examples:
- /airlines/6e (IndiGo)
- /airlines/dl (Delta)
- /airlines/aa (American Airlines)
- /airlines/lh (Lufthansa)
- /airlines/ba (British Airways)
- /es/airlines/6e
- /ru/airlines/dl

File: app/[locale]/airlines/[airline]/page.tsx
```

#### 2.3 Airline Route Pages (Dynamic)
```
URL Pattern: /[locale]/airlines/[airline]/[route]
Examples:
- /airlines/6e/ixc (IndiGo from Chandigarh)
- /airlines/6e/del (IndiGo from Delhi)
- /airlines/dl/jfk (Delta to JFK)
- /airlines/lh/fra (Lufthansa to Frankfurt)
- /airlines/ba/lhr (British Airways to Heathrow)
- /es/airlines/6e/ixc
- /ru/airlines/dl/jfk

Files:
- app/[locale]/airlines/[airline]/[route]/page.tsx (Current)
- app/[locale]/airlines/[airline]/[route]/clean-page.tsx (Clean version)
- app/[locale]/airlines/[airline]/[route]/optimized-page.tsx (Optimized version)

Components:
- AirlineRouteContent
- CleanPageComponent
- OptimizedAirlineRouteContent
```

### 🏨 **3. Hotels Pages**

#### 3.1 Hotels Index Page
```
URL Pattern: /[locale]/hotels
Examples:
- /hotels
- /es/hotels
- /ru/hotels
- /fr/hotels

File: app/[locale]/hotels/page.tsx
```

#### 3.2 Hotels by Airport
```
URL Pattern: /[locale]/hotels/[airportCode]
Examples:
- /hotels/del (Hotels near Delhi Airport)
- /hotels/jfk (Hotels near JFK)
- /hotels/lhr (Hotels near Heathrow)
- /hotels/cdg (Hotels near Charles de Gaulle)
- /es/hotels/del
- /ru/hotels/jfk

File: app/[locale]/hotels/[airportCode]/page.tsx
```

### 🛫 **4. Airport Pages**

#### 4.1 Individual Airport Page
```
URL Pattern: /[locale]/airports/[slug]
Examples:
- /airports/del (Delhi Airport)
- /airports/jfk (JFK Airport)
- /airports/lhr (Heathrow Airport)
- /airports/cdg (Charles de Gaulle)
- /airports/nrt (Narita Airport)
- /es/airports/del
- /ru/airports/jfk

File: app/[locale]/airports/[slug]/page.tsx
```

### ✈️ **5. Flight Pages**

#### 5.1 Flight Details
```
URL Pattern: /[locale]/flights/[slug]
Examples:
- /flights/del-bom (Delhi to Mumbai)
- /flights/jfk-lhr (JFK to London)
- /flights/cdg-fra (Paris to Frankfurt)
- /flights/nrt-icn (Tokyo to Seoul)
- /es/flights/del-bom
- /ru/flights/jfk-lhr

File: app/[locale]/flights/[slug]/page.tsx
```

#### 5.2 Flights from Airport
```
URL Pattern: /[locale]/flights/from/[airport]
Examples:
- /flights/from/del (Flights from Delhi)
- /flights/from/jfk (Flights from JFK)
- /flights/from/lhr (Flights from Heathrow)
- /es/flights/from/del
- /ru/flights/from/jfk

File: app/[locale]/flights/from/[airport]/page.tsx
```

### 📏 **6. Distance Pages**
```
URL Pattern: /[locale]/distance/[slug]
Examples:
- /distance/del-bom (Distance Delhi to Mumbai)
- /distance/jfk-lhr (Distance JFK to London)
- /es/distance/del-bom
- /ru/distance/jfk-lhr

File: app/[locale]/distance/[slug]/page.tsx
```

### 🔍 **7. Search Page**
```
URL Pattern: /[locale]/search
Examples:
- /search
- /es/search
- /ru/search
- /fr/search

File: app/[locale]/search/page.tsx
Components: HashSearchHandler, TriposiaSearchWidget
```

### 👤 **8. Authentication Pages**

#### 8.1 Login Page
```
URL Pattern: /[locale]/login
Examples:
- /login
- /es/login
- /ru/login
- /fr/login

File: app/[locale]/login/page.tsx
```

#### 8.2 Register Page
```
URL Pattern: /[locale]/register
Examples:
- /register
- /es/register
- /ru/register
- /fr/register

File: app/[locale]/register/page.tsx
```

#### 8.3 My Account Page
```
URL Pattern: /[locale]/my-account
Examples:
- /my-account
- /es/my-account
- /ru/my-account
- /fr/my-account

File: app/[locale]/my-account/page.tsx
```

### ℹ️ **9. Static Pages**

#### 9.1 About Pages
```
URL Patterns:
- /[locale]/about
- /[locale]/about-us

Examples:
- /about
- /about-us
- /es/about
- /es/about-us
- /ru/about
- /ru/about-us

Files:
- app/[locale]/about/page.tsx
- app/[locale]/about-us/page.tsx
```

#### 9.2 Contact Page
```
URL Pattern: /[locale]/contact-us
Examples:
- /contact-us
- /es/contact-us
- /ru/contact-us
- /fr/contact-us

File: app/[locale]/contact-us/page.tsx
```

#### 9.3 Legal Pages
```
URL Patterns:
- /[locale]/privacy-policy
- /[locale]/terms-and-conditions
- /[locale]/refund-policy

Examples:
- /privacy-policy
- /terms-and-conditions
- /refund-policy
- /es/privacy-policy
- /ru/terms-and-conditions
- /fr/refund-policy

Files:
- app/[locale]/privacy-policy/page.tsx
- app/[locale]/terms-and-conditions/page.tsx
- app/[locale]/refund-policy/page.tsx
```

## 🔧 **Page Mechanisms**

### **1. Translation System**
- **English Master**: All content starts in English
- **Auto-Translation**: Other languages inherit from English
- **Supported Languages**: EN, ES, RU, FR
- **Translation Files**: `lib/translations.ts`

### **2. Content Systems**

#### 2.1 Current System (With Duplicates)
- **File**: `app/[locale]/airlines/[airline]/[route]/page.tsx`
- **Component**: `AirlineRouteContent`
- **Issues**: Duplicate content, slow loading

#### 2.2 Clean System (No Duplicates)
- **File**: `app/[locale]/airlines/[airline]/[route]/clean-page.tsx`
- **Component**: `CleanPageComponent`
- **Benefits**: No duplicates, fast loading

#### 2.3 Optimized System (Performance)
- **File**: `app/[locale]/airlines/[airline]/[route]/optimized-page.tsx`
- **Component**: `OptimizedAirlineRouteContent`
- **Benefits**: Cached translations, better performance

#### 2.4 Universal System (All Pages)
- **File**: `app/[locale]/universal-page-template.tsx`
- **Component**: `UniversalMasterPage`
- **Benefits**: Works for all page types

### **3. API Integration**

#### 3.1 Airline APIs
```
- /api/airline-content
- /api/airline-data
- /api/airline-by-slug
- /api/airline-airport-content
- /api/airline-airport-data
```

#### 3.2 Flight APIs
```
- /api/flight-content
- /api/flight-data
- /api/destination-flight-content
- /api/destination-flight-data
```

#### 3.3 Airport APIs
```
- /api/airport-by-slug
- /api/airports/search
```

#### 3.4 Hotel APIs
```
- /api/hotels-by-airport
```

### **4. SEO and Sitemaps**

#### 4.1 Sitemap Files
```
- /sitemap.xml (Main sitemap)
- /sitemap-index.xml (Sitemap index)
- /sitemap-airlines.xml (Airlines sitemap)
- /sitemap-airports.xml (Airports sitemap)
- /sitemap-flights.xml (Flights sitemap)
- /sitemap-pages.xml (Static pages sitemap)
- /robots.txt (Robots file)
```

#### 4.2 Schema.org Integration
- **Organization Schema**: Company information
- **Website Schema**: Site structure
- **Breadcrumb Schema**: Navigation
- **Product Schema**: Flight offerings
- **ItemList Schema**: Flight lists

## 📊 **Page Statistics**

### **Total Page Types**: 9
### **Total URL Patterns**: 25+
### **Supported Languages**: 4 (EN, ES, RU, FR)
### **Total URLs**: 100+ (25 patterns × 4 languages)

### **Page Categories**:
1. **Home**: 1 page type
2. **Airlines**: 3 page types (index, airline, route)
3. **Hotels**: 2 page types (index, by airport)
4. **Airports**: 1 page type
5. **Flights**: 2 page types (details, from airport)
6. **Distance**: 1 page type
7. **Search**: 1 page type
8. **Authentication**: 3 page types (login, register, account)
9. **Static**: 6 page types (about, contact, legal)

## 🚀 **Recommended Implementation**

### **For Clean Pages (No Duplicates)**
Use: `CleanPageComponent` + `clean-page.tsx`

### **For Performance**
Use: `OptimizedAirlineRouteContent` + `optimized-page.tsx`

### **For All Page Types**
Use: `UniversalMasterPage` + `universal-page-template.tsx`

### **For Master Translation**
Use: `masterTranslationSystem.ts` + English as master

## 🔗 **Example URLs**

```
English (Default):
- https://yourdomain.com/
- https://yourdomain.com/airlines
- https://yourdomain.com/airlines/6e
- https://yourdomain.com/airlines/6e/ixc
- https://yourdomain.com/hotels/del
- https://yourdomain.com/airports/del
- https://yourdomain.com/flights/del-bom

Spanish:
- https://yourdomain.com/es/
- https://yourdomain.com/es/airlines
- https://yourdomain.com/es/airlines/6e
- https://yourdomain.com/es/airlines/6e/ixc

Russian:
- https://yourdomain.com/ru/
- https://yourdomain.com/ru/airlines
- https://yourdomain.com/ru/airlines/6e

French:
- https://yourdomain.com/fr/
- https://yourdomain.com/fr/airlines
- https://yourdomain.com/fr/airlines/6e
```

This comprehensive list covers all pages, URL patterns, and mechanisms in your web application! 🚀
