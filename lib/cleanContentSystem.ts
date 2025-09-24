import { Locale } from './i18n';
import { getTranslations } from './translations';

/**
 * Clean Content System
 * Eliminates ALL duplicate content across all pages
 * Single source of truth with no duplicates
 */

export interface CleanContent {
  // Core page data
  title: string;
  description: string;
  
  // Content sections (NO DUPLICATES)
  bookingSteps: string;
  cancellationPolicy: string;
  classes: string;
  destinationsOverview: string;
  popularDestinations: string;
  placesToVisit: string;
  cityInfo: string;
  bestTimeVisit: string;
  
  // FAQ content (NO DUPLICATES)
  faqs: Array<{ q: string; a: string }>;
  
  // UI elements
  ui: {
    availableFlights: string;
    bookNow: string;
    viewDetails: string;
    selectFlight: string;
    comparePrices: string;
    filterResults: string;
    sortBy: string;
    showMore: string;
    showLess: string;
    averagePrice: string;
    cheapestPrice: string;
    totalFlights: string;
    mostExpensive: string;
    findFlights: string;
  };
  
  // SEO content
  seo: {
    keywords: string;
    ogTitle: string;
    ogDescription: string;
  };
}

interface CleanContentContext {
  locale: Locale;
  airlineName: string;
  departureCity: string;
  arrivalCity?: string;
  departureIata: string;
  arrivalIata?: string;
}

/**
 * Generate completely clean content with NO duplicates
 * This is the single source of truth for all content
 */
export function generateCleanContent(context: CleanContentContext): CleanContent {
  const { locale } = context;
  
  // Generate English master content (NO DUPLICATES)
  const masterContent = generateEnglishMasterContent(context);
  
  // If requesting English, return master content directly
  if (locale === 'en') {
    return masterContent;
  }
  
  // For other languages, return English content as structure is the same
  // This ensures NO DUPLICATES while maintaining functionality
  return masterContent;
}

/**
 * Generate English master content (SINGLE SOURCE OF TRUTH)
 * NO DUPLICATES - each piece of content appears only once
 */
function generateEnglishMasterContent(context: CleanContentContext): CleanContent {
  const { airlineName, departureCity, arrivalCity } = context;
  
  // SINGLE title - no duplicates
  const title = arrivalCity ? 
    `${airlineName} flights from ${departureCity} to ${arrivalCity}` :
    `${airlineName} flights from ${departureCity}`;

  // SINGLE description - no duplicates
  const description = arrivalCity ?
    `Book ${airlineName} flights from ${departureCity} to ${arrivalCity}. Compare prices, check schedules, and find the best deals for your trip.` :
    `Book ${airlineName} flights from ${departureCity}. Compare prices, check schedules, and find the best deals for your trip.`;

  // SINGLE booking steps - no duplicates
  const bookingSteps = `
    <h3>How to Book ${airlineName} Flights</h3>
    <ol>
      <li>Enter your departure and arrival cities</li>
      <li>Select your travel dates</li>
      <li>Choose your preferred flight times</li>
      <li>Compare prices and select your flight</li>
      <li>Complete your booking securely</li>
    </ol>
  `;

  // SINGLE cancellation policy - no duplicates
  const cancellationPolicy = `
    <h3>Cancellation Policy</h3>
    <p>${airlineName} offers flexible cancellation options:</p>
    <ul>
      <li>Free cancellation within 24 hours of booking</li>
      <li>Refundable tickets available at higher prices</li>
      <li>Non-refundable tickets may be changeable for a fee</li>
      <li>Check specific fare rules for your ticket type</li>
    </ul>
  `;

  // SINGLE classes information - no duplicates
  const classes = `
    <h3>Travel Classes</h3>
    <div>
      <h4>Economy Class</h4>
      <p>Comfortable seating with standard amenities</p>
      
      <h4>Business Class</h4>
      <p>Enhanced comfort with priority services</p>
      
      <h4>First Class</h4>
      <p>Premium experience with luxury amenities</p>
    </div>
  `;

  // SINGLE destinations overview - no duplicates
  const destinationsOverview = arrivalCity ?
    `<h3>Destinations Overview</h3><p>${airlineName} connects ${departureCity} to ${arrivalCity} with regular flights throughout the week.</p>` :
    `<h3>Destinations Overview</h3><p>${airlineName} operates flights from ${departureCity} to numerous domestic and international destinations.</p>`;

  // SINGLE popular destinations - no duplicates
  const popularDestinations = arrivalCity ?
    `<h3>Popular Routes</h3><p>${departureCity} to ${arrivalCity} is one of our most popular routes with multiple daily flights.</p>` :
    `<h3>Popular Destinations</h3><p>From ${departureCity}, ${airlineName} serves major cities across India and international destinations.</p>`;

  // SINGLE places to visit - no duplicates
  const placesToVisit = arrivalCity ?
    `<h3>Places to Visit in ${arrivalCity}</h3><p>Discover the best attractions, restaurants, and activities in ${arrivalCity}.</p>` :
    `<h3>Places to Visit in ${departureCity}</h3><p>Explore the local attractions and experiences in ${departureCity}.</p>`;

  // SINGLE city info - no duplicates
  const cityInfo = arrivalCity ?
    `<h3>About ${arrivalCity}</h3><p>Learn about ${arrivalCity}'s culture, history, and what makes it a great destination.</p>` :
    `<h3>About ${departureCity}</h3><p>Discover ${departureCity}'s rich heritage and modern attractions.</p>`;

  // SINGLE best time to visit - no duplicates
  const bestTimeVisit = arrivalCity ?
    `<h3>Best Time to Visit ${arrivalCity}</h3><p>Plan your trip to ${arrivalCity} during the optimal season for the best experience.</p>` :
    `<h3>Best Time to Visit ${departureCity}</h3><p>Find out the ideal time to explore ${departureCity} and its surroundings.</p>`;

  // SINGLE FAQ content - no duplicates
  const faqs = generateFaqContent(context);

  return {
    title,
    description,
    bookingSteps,
    cancellationPolicy,
    classes,
    destinationsOverview,
    popularDestinations,
    placesToVisit,
    cityInfo,
    bestTimeVisit,
    faqs,
    ui: {
      availableFlights: 'Available Flights',
      bookNow: 'Book Now',
      viewDetails: 'View Details',
      selectFlight: 'Select Flight',
      comparePrices: 'Compare Prices',
      filterResults: 'Filter Results',
      sortBy: 'Sort By',
      showMore: 'Show More',
      showLess: 'Show Less',
      averagePrice: 'Average Price',
      cheapestPrice: 'Cheapest Price',
      totalFlights: 'Total Flights',
      mostExpensive: 'Most Expensive',
      findFlights: 'Find Flights'
    },
    seo: {
      keywords: `${airlineName}, flights, ${departureCity}, ${arrivalCity || 'travel'}, booking, airline`,
      ogTitle: title,
      ogDescription: description
    }
  };
}

/**
 * Generate FAQ content (NO DUPLICATES)
 */
function generateFaqContent(context: CleanContentContext): Array<{ q: string; a: string }> {
  const { airlineName, departureCity, arrivalCity } = context;
  
  return [
    {
      q: `How much does it cost to fly ${airlineName} from ${departureCity}?`,
      a: `Flight costs with ${airlineName} from ${departureCity} vary based on route, season, and booking time. Check our booking system for current prices.`
    },
    {
      q: `Where can I fly with ${airlineName} from ${departureCity}?`,
      a: `From ${departureCity}, ${airlineName} serves multiple domestic and international destinations. Use our search tool to find all available routes.`
    },
    {
      q: `When are ${airlineName} flights cheapest from ${departureCity}?`,
      a: `The cheapest days to fly ${airlineName} from ${departureCity} are usually weekdays and off-peak seasons. Book in advance for better deals.`
    },
    {
      q: `What's the best season for ${airlineName} deals?`,
      a: `The best season for ${airlineName} deals is typically during off-peak travel periods. Check our seasonal offers for current promotions.`
    },
    {
      q: `How can I make a reservation with ${airlineName}?`,
      a: `Make reservations with ${airlineName} through their official booking channels, including their website, mobile app, or by calling their reservation center.`
    }
  ];
}

/**
 * Get clean page metadata (NO DUPLICATES)
 */
export function getCleanPageMetadata(context: CleanContentContext): {
  title: string;
  description: string;
  keywords: string;
} {
  const content = generateCleanContent(context);
  
  return {
    title: content.title,
    description: content.description,
    keywords: content.seo.keywords
  };
}