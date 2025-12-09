// Environment configuration for header and footer data
export const envConfig = {
  // Header Configuration
  header: {
    title: process.env.NEXT_PUBLIC_HEADER_TITLE || 'AirlinesMap',
    metaDescription: process.env.NEXT_PUBLIC_HEADER_META_DESCRIPTION || 'Book flights, hotels, and cars',
    navigation: {
      airlines: process.env.NEXT_PUBLIC_NAV_AIRLINES || '/airlines',
      hotels: process.env.NEXT_PUBLIC_NAV_HOTELS || '/hotels',
      login: process.env.NEXT_PUBLIC_NAV_LOGIN || '/login'
    },
    socialMedia: {
      facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/airlinesmap',
      twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/airlinesmap',
      instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/airlinesmap'
    }
  },
  
  // Footer Configuration
  footer: {
    copyright: process.env.NEXT_PUBLIC_FOOTER_COPYRIGHT || '© 2018-2025 AirlinesMap Inc. All rights reserved.',
    description1: process.env.NEXT_PUBLIC_FOOTER_DESCRIPTION_1 || 'Helps you find the cheapest flight deals to any destination with ease.',
    description2: process.env.NEXT_PUBLIC_FOOTER_DESCRIPTION_2 || 'Browse through the best hotels and find exclusive deals.',
    navigation: {
      aboutUs: process.env.NEXT_PUBLIC_FOOTER_ABOUT_US || '/about-us',
      contactUs: process.env.NEXT_PUBLIC_FOOTER_CONTACT_US || '/contact-us',
      privacyPolicy: process.env.NEXT_PUBLIC_FOOTER_PRIVACY_POLICY || '/privacy-policy'
    }
  },

  // Popup Configuration
  popup: {
    phoneNumber: process.env.NEXT_PUBLIC_POPUP_PHONE_NUMBER || '+1-888-351-1711',
    promoCode: process.env.NEXT_PUBLIC_POPUP_PROMO_CODE || 'SAVE30'
  }
};
