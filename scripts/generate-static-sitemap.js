#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://airlinesmap.com';
const LOCALES = ['en', 'es', 'ru', 'fr'];
const OUTPUT_DIR = './public';
const OUTPUT_FILE = 'sitemap.xml';

// Static pages (excluding dynamic routes)
const STATIC_PAGES = [
  // Home page
  '',
  
  // About pages
  'about',
  'about-us',
  
  // Airlines pages (static)
  'airlines',
  
  // Contact pages
  'contact-us',
  
  // Hotels pages (static)
  'hotels',
  
  // Auth pages
  'login',
  'register',
  
  // Account pages
  'my-account',
  
  // Search page
  'search',
  
  // Legal pages
  'privacy-policy',
  'refund-policy',
  'terms-and-conditions'
];

// Generate sitemap XML
function generateSitemapXML() {
  const urls = [];
  
  // Generate URLs for all static pages in all locales
  for (const page of STATIC_PAGES) {
    for (const locale of LOCALES) {
      const url = page === '' ? 
        `${BASE_URL}/${locale}` : 
        `${BASE_URL}/${locale}/${page}`;
      
      urls.push({
        url,
        lastmod: new Date().toISOString(),
        changefreq: getChangeFrequency(page),
        priority: getPriority(page)
      });
    }
  }
  
  // Generate XML content
  const urlEntries = urls.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Get change frequency based on page type
function getChangeFrequency(page) {
  const frequencies = {
    '': 'daily',                    // Home page
    'about': 'monthly',
    'about-us': 'monthly',
    'airlines': 'weekly',
    'contact-us': 'monthly',
    'hotels': 'weekly',
    'login': 'yearly',
    'register': 'yearly',
    'my-account': 'yearly',
    'search': 'daily',
    'privacy-policy': 'yearly',
    'refund-policy': 'yearly',
    'terms-and-conditions': 'yearly'
  };
  return frequencies[page] || 'monthly';
}

// Get priority based on page importance
function getPriority(page) {
  const priorities = {
    '': 1.0,                        // Home page
    'about': 0.8,
    'about-us': 0.8,
    'airlines': 0.9,
    'contact-us': 0.7,
    'hotels': 0.9,
    'login': 0.5,
    'register': 0.5,
    'my-account': 0.6,
    'search': 0.8,
    'privacy-policy': 0.3,
    'refund-policy': 0.3,
    'terms-and-conditions': 0.3
  };
  return priorities[page] || 0.5;
}

// Generate robots.txt
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
}

// Main execution
function generateStaticSitemap() {
  console.log('🚀 Generating static pages sitemap...');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`🌍 Locales: ${LOCALES.join(', ')}`);
  console.log(`📄 Static pages: ${STATIC_PAGES.length}`);
  console.log('');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate sitemap
  console.log('📝 Generating sitemap XML...');
  const sitemapContent = generateSitemapXML();
  const sitemapPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log(`✅ Generated ${OUTPUT_FILE}`);

  // Generate robots.txt
  console.log('🤖 Generating robots.txt...');
  const robotsContent = generateRobotsTxt();
  const robotsPath = path.join(OUTPUT_DIR, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent);
  console.log(`✅ Generated robots.txt`);

  // Calculate statistics
  const totalUrls = STATIC_PAGES.length * LOCALES.length;
  const fileSize = (fs.statSync(sitemapPath).size / 1024).toFixed(2);

  // Summary
  console.log('\n🎉 Static sitemap generation completed!');
  console.log(`📊 Total URLs generated: ${totalUrls.toLocaleString()}`);
  console.log(`📁 File size: ${fileSize} KB`);
  console.log(`🌐 Sitemap URL: ${BASE_URL}/sitemap.xml`);
  console.log(`🤖 Robots.txt: ${BASE_URL}/robots.txt`);
  
  // List generated pages
  console.log('\n📄 Generated pages:');
  STATIC_PAGES.forEach(page => {
    const pageName = page === '' ? 'Home' : page;
    console.log(`   - ${pageName} (${LOCALES.length} locales)`);
  });
}

// Run the script
generateStaticSitemap();
