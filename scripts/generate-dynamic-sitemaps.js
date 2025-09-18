#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://airlinesmap.com';
const LOCALES = ['en', 'es', 'ru', 'fr'];
const OUTPUT_DIR = './public/sitemaps';
const API_BASE = 'https://api.triposia.com/real/urls';

// API endpoints and their corresponding sitemap names
const API_ENDPOINTS = {
  'flightsone_pages': 'sitemap-flightsone.xml',
  'flightsround_pages': 'sitemap-flightsround.xml',
  'airlinesround_pages': 'sitemap-airlinesround.xml',
  'airlinesone_pages': 'sitemap-airlinesone.xml',
  'airport_pages': 'sitemap-airports.xml',
  'airlines_pages': 'sitemap-airlines.xml',
  'airport_hotels': 'sitemap-airport-hotels.xml'
};

// Fetch URLs from API endpoint
async function fetchUrlsFromAPI(endpoint) {
  try {
    console.log(`📡 Fetching URLs from ${endpoint}...`);
    const response = await fetch(`${API_BASE}?urls=${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.urls || [];
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error.message);
    return [];
  }
}

// Clean old sitemaps
function cleanOldSitemaps() {
  console.log('🧹 Cleaning old sitemap files...');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    return;
  }
  
  const files = fs.readdirSync(OUTPUT_DIR);
  const sitemapFiles = files.filter(file => 
    file.endsWith('.xml') && 
    Object.values(API_ENDPOINTS).includes(file)
  );
  
  sitemapFiles.forEach(file => {
    const filePath = path.join(OUTPUT_DIR, file);
    fs.unlinkSync(filePath);
    console.log(`🗑️  Deleted old ${file}`);
  });
  
  console.log(`✅ Cleaned ${sitemapFiles.length} old sitemap files`);
}

// Generate sitemap XML for a category
function generateCategorySitemap(urls, category, sitemapName) {
  const sitemapEntries = [];
  
  // Generate entries for all URLs in this category
  // URLs from API already include locales, so no need to multiply
  for (const url of urls) {
    sitemapEntries.push({
      url: `${BASE_URL}${url}`,
      lastmod: new Date().toISOString(),
      changefreq: getChangeFrequency(category),
      priority: getPriority(category, url)
    });
  }
  
  // Generate paginated sitemaps if needed
  const maxUrlsPerSitemap = 50000;
  const totalPages = Math.ceil(sitemapEntries.length / maxUrlsPerSitemap);
  const sitemaps = [];

  for (let i = 0; i < totalPages; i++) {
    const start = i * maxUrlsPerSitemap;
    const end = start + maxUrlsPerSitemap;
    const pageEntries = sitemapEntries.slice(start, end);
    
    const sitemapContent = generateSitemapXML(pageEntries, totalPages, i + 1, sitemapName);
    const filename = totalPages > 1 ? 
      sitemapName.replace('.xml', `-${i + 1}.xml`) : 
      sitemapName;
    
    sitemaps.push({
      filename,
      content: sitemapContent,
      urlCount: pageEntries.length
    });
  }

  return sitemaps;
}

// Generate XML content
function generateSitemapXML(entries, totalPages, currentPage, sitemapName) {
  const urls = entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('');

  // Add pagination if there are more pages
  const pagination = currentPage < totalPages ? `
  <url>
    <loc>${BASE_URL}/sitemaps/${sitemapName.replace('.xml', `-${currentPage + 1}.xml`)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
${pagination}
</urlset>`;
}

// Generate main sitemap index
function generateMainSitemapIndex(generatedSitemaps) {
  const sitemaps = generatedSitemaps.map(sitemap => `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/${sitemap.filename}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;
}

// Helper functions
function getChangeFrequency(category) {
  const frequencies = {
    'flightsone_pages': 'daily',
    'flightsround_pages': 'daily',
    'airlinesround_pages': 'daily',
    'airlinesone_pages': 'daily',
    'airport_pages': 'weekly',
    'airlines_pages': 'weekly',
    'airport_hotels': 'weekly'
  };
  return frequencies[category] || 'weekly';
}

function getPriority(category, url) {
  const isPopularRoute = url.includes('lax') || url.includes('jfk') || url.includes('lhr') || url.includes('cdg');
  const isMajorAirport = url.includes('lax') || url.includes('jfk') || url.includes('lhr') || url.includes('cdg') || url.includes('dxb');
  
  if (isPopularRoute) return 0.9;
  if (isMajorAirport) return 0.8;
  return 0.7;
}

// Main execution
async function generateDynamicSitemaps() {
  console.log('🚀 Starting dynamic sitemap generation...');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`🌍 Locales: ${LOCALES.join(', ')} (included in API URLs)`);
  console.log(`📊 API endpoints: ${Object.keys(API_ENDPOINTS).length}`);
  console.log('');

  // Clean old sitemaps first
  cleanOldSitemaps();
  console.log('');

  const allGeneratedSitemaps = [];
  let totalUrls = 0;

  // Process each API endpoint
  for (const [endpoint, sitemapName] of Object.entries(API_ENDPOINTS)) {
    console.log(`\n📝 Processing ${endpoint}...`);
    
    const urls = await fetchUrlsFromAPI(endpoint);
    if (urls.length === 0) {
      console.log(`⚠️  No URLs found for ${endpoint}, skipping...`);
      continue;
    }

    const sitemaps = generateCategorySitemap(urls, endpoint, sitemapName);
    
    // Save sitemap files
    for (const sitemap of sitemaps) {
      const filePath = path.join(OUTPUT_DIR, sitemap.filename);
      fs.writeFileSync(filePath, sitemap.content);
      console.log(`✅ Generated ${sitemap.filename} (${sitemap.urlCount.toLocaleString()} URLs)`);
      
      allGeneratedSitemaps.push(sitemap);
      totalUrls += sitemap.urlCount;
    }
  }

  // Generate main sitemap index
  console.log('\n📋 Generating main sitemap index...');
  const mainSitemap = generateMainSitemapIndex(allGeneratedSitemaps);
  const mainSitemapPath = path.join(OUTPUT_DIR, 'sitemap.xml');
  fs.writeFileSync(mainSitemapPath, mainSitemap);
  console.log(`✅ Generated sitemap.xml`);

  // Update main sitemap.ts to point to the generated sitemap
  console.log('\n🔄 Updating main sitemap.ts...');
  const sitemapTsContent = `import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://airlinesmap.com';
  
  // Point to the generated sitemap index
  return [{
    url: \`\${baseUrl}/sitemaps/sitemap.xml\`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0
  }];
}`;
  
  fs.writeFileSync('./app/sitemap.ts', sitemapTsContent);
  console.log(`✅ Updated app/sitemap.ts`);

  // Create timestamp file
  const timestampFile = path.join(OUTPUT_DIR, 'last-updated.txt');
  fs.writeFileSync(timestampFile, new Date().toISOString());

  // Summary
  console.log('\n🎉 Dynamic sitemap generation completed!');
  console.log(`📊 Total URLs generated: ${totalUrls.toLocaleString()}`);
  console.log(`📁 Files saved to: ${OUTPUT_DIR}`);
  console.log(`🌐 Main sitemap: ${BASE_URL}/sitemaps/sitemap.xml`);
  console.log(`⏰ Last updated: ${new Date().toLocaleString()}`);
  
  // List all generated files
  console.log('\n📄 Generated files:');
  const files = fs.readdirSync(OUTPUT_DIR);
  files.forEach(file => {
    const filePath = path.join(OUTPUT_DIR, file);
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(2);
    console.log(`   - ${file} (${size} KB)`);
  });
}

// Run the script
generateDynamicSitemaps().catch(console.error);
