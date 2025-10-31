'use client';

import Script from 'next/script';

const GA_TRACKING_ID = 'G-38CR0JRFNT';
const ADS_ID = 'AW-16765334947';
const ADS_PHONE_LABEL = 'QHicCJr_1rYbEKPrqro-';

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      {/* Google Ads tag */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
            // Google Ads base config
            gtag('config', '${ADS_ID}');
            // Phone call conversion
            gtag('config', '${ADS_ID}/${ADS_PHONE_LABEL}', {
              'phone_conversion_number': '(888) 319-6206'
            });
          `,
        }}
      />
    </>
  );
}
