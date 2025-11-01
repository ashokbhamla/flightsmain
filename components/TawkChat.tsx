'use client';

import Script from 'next/script';

export default function TawkChat() {
  return (
    <>
      <Script id="tawk-inline-config" strategy="afterInteractive">
        {`
          window.Tawk_API = window.Tawk_API || {};
          window.Tawk_LoadStart = new Date();
        `}
      </Script>
      <Script
        id="tawk-embed"
        strategy="afterInteractive"
        src="https://embed.tawk.to/686fd734affcbd1910f861e6/1ivqe1a5q"
        charSet="UTF-8"
        crossOrigin="*"
      />
    </>
  );
}


