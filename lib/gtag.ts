// Google Analytics utility functions

export const GA_TRACKING_ID = 'AW-17749159006';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Flight search tracking
export const trackFlightSearch = (from: string, to: string, departureDate: string) => {
  event({
    action: 'flight_search',
    category: 'engagement',
    label: `${from}-${to}`,
  });
};

// Flight booking tracking
export const trackFlightBooking = (from: string, to: string, price: number) => {
  event({
    action: 'flight_booking',
    category: 'conversion',
    label: `${from}-${to}`,
    value: price,
  });
};

// Hotel search tracking
export const trackHotelSearch = (location: string, checkIn: string, checkOut: string) => {
  event({
    action: 'hotel_search',
    category: 'engagement',
    label: location,
  });
};

// Hotel booking tracking
export const trackHotelBooking = (location: string, price: number) => {
  event({
    action: 'hotel_booking',
    category: 'conversion',
    label: location,
    value: price,
  });
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: any
    ) => void;
  }
}
