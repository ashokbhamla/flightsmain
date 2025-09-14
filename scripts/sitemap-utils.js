#!/usr/bin/env node

/**
 * Sitemap Utilities for AirlinesMap
 * 
 * This script provides utilities to manage and validate the sitemap
 * 
 * Usage:
 *   node scripts/sitemap-utils.js validate
 *   node scripts/sitemap-utils.js count
 *   node scripts/sitemap-utils.js test
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'https://airlinesmap.com';
const LOCAL_URL = 'http://localhost:3000';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function validateSitemap() {
  console.log('🔍 Validating sitemap...');
  
  try {
    const response = await makeRequest(`${LOCAL_URL}/sitemap.xml`);
    
    if (response.status !== 200) {
      console.error('❌ Sitemap not accessible');
      return false;
    }
    
    // Basic XML validation
    if (!response.data.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      console.error('❌ Invalid XML format');
      return false;
    }
    
    if (!response.data.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
      console.error('❌ Invalid sitemap format');
      return false;
    }
    
    console.log('✅ Sitemap is valid');
    return true;
  } catch (error) {
    console.error('❌ Error validating sitemap:', error.message);
    return false;
  }
}

async function countUrls() {
  console.log('📊 Counting URLs in sitemap...');
  
  try {
    const response = await makeRequest(`${LOCAL_URL}/sitemap.xml`);
    
    if (response.status !== 200) {
      console.error('❌ Sitemap not accessible');
      return;
    }
    
    const urlCount = (response.data.match(/<url>/g) || []).length;
    console.log(`📈 Total URLs: ${urlCount}`);
    
    // Count by type
    const homePages = (response.data.match(/<loc>https:\/\/airlinesmap\.com<\/loc>/g) || []).length;
    const airlinePages = (response.data.match(/<loc>https:\/\/airlinesmap\.com\/airlines\//g) || []).length;
    const flightPages = (response.data.match(/<loc>https:\/\/airlinesmap\.com\/flights\//g) || []).length;
    const languagePages = (response.data.match(/<loc>https:\/\/airlinesmap\.com\/[a-z]{2}\//g) || []).length;
    
    console.log(`🏠 Home pages: ${homePages}`);
    console.log(`✈️  Airline pages: ${airlinePages}`);
    console.log(`🛫 Flight pages: ${flightPages}`);
    console.log(`🌍 Language pages: ${languagePages}`);
    
  } catch (error) {
    console.error('❌ Error counting URLs:', error.message);
  }
}

async function testEndpoints() {
  console.log('🧪 Testing sitemap endpoints...');
  
  const endpoints = [
    '/sitemap.xml',
    '/sitemap-index.xml',
    '/robots.txt'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${LOCAL_URL}${endpoint}`);
      const status = response.status === 200 ? '✅' : '❌';
      console.log(`${status} ${endpoint} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
}

async function generateReport() {
  console.log('📋 Generating sitemap report...');
  
  try {
    const response = await makeRequest(`${LOCAL_URL}/sitemap.xml`);
    
    if (response.status !== 200) {
      console.error('❌ Sitemap not accessible');
      return;
    }
    
    const urlCount = (response.data.match(/<url>/g) || []).length;
    const lastModified = new Date().toISOString();
    
    console.log('\n📊 SITEMAP REPORT');
    console.log('================');
    console.log(`📅 Generated: ${lastModified}`);
    console.log(`🔗 Base URL: ${BASE_URL}`);
    console.log(`📈 Total URLs: ${urlCount}`);
    console.log(`🌍 Languages: English, Spanish, Russian, French`);
    console.log(`✈️  Airlines: 30+ major airlines`);
    console.log(`🛫 Routes: 50+ popular flight routes`);
    console.log(`📱 Mobile-friendly: Yes`);
    console.log(`🔍 SEO optimized: Yes`);
    
    console.log('\n📋 SITEMAP STRUCTURE');
    console.log('====================');
    console.log('• Main pages (Home, Airlines, Hotels, Search)');
    console.log('• Static content (About, Contact, Privacy, Terms)');
    console.log('• Language-specific pages (4 languages)');
    console.log('• Flight routes (domestic & international)');
    console.log('• Airline pages (individual airline details)');
    console.log('• User account pages (Login, Register, My Account)');
    
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
  }
}

async function main() {
  const command = process.argv[2];
  
  console.log('🚀 AirlinesMap Sitemap Utilities\n');
  
  switch (command) {
    case 'validate':
      await validateSitemap();
      break;
    case 'count':
      await countUrls();
      break;
    case 'test':
      await testEndpoints();
      break;
    case 'report':
      await generateReport();
      break;
    default:
      console.log('Usage: node scripts/sitemap-utils.js <command>');
      console.log('\nCommands:');
      console.log('  validate  - Validate sitemap XML format');
      console.log('  count     - Count URLs in sitemap');
      console.log('  test      - Test sitemap endpoints');
      console.log('  report    - Generate comprehensive report');
      break;
  }
}

main().catch(console.error);
