#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Complete Sitemap Generation');
console.log('==============================');
console.log(`📅 Date: ${new Date().toLocaleString()}`);
console.log('');

try {
  // Step 1: Generate static pages sitemap
  console.log('📄 Step 1: Generating static pages sitemap...');
  execSync('node scripts/generate-static-sitemap.js', { stdio: 'inherit' });
  console.log('✅ Static sitemap generated\n');

  // Step 2: Generate dynamic sitemaps
  console.log('🔄 Step 2: Generating dynamic sitemaps...');
  execSync('node scripts/generate-dynamic-sitemaps.js', { stdio: 'inherit' });
  console.log('✅ Dynamic sitemaps generated\n');

  // Step 3: Summary
  console.log('📊 Final Summary:');
  console.log('================');
  
  // Check static sitemap
  const staticSitemap = './public/sitemap.xml';
  if (fs.existsSync(staticSitemap)) {
    const stats = fs.statSync(staticSitemap);
    console.log(`📄 Static sitemap: ${(stats.size / 1024).toFixed(2)} KB`);
  }

  // Check dynamic sitemaps
  const dynamicDir = './public/sitemaps';
  if (fs.existsSync(dynamicDir)) {
    const files = fs.readdirSync(dynamicDir);
    const xmlFiles = files.filter(file => file.endsWith('.xml'));
    const totalSize = files.reduce((sum, file) => {
      const filePath = path.join(dynamicDir, file);
      return sum + fs.statSync(filePath).size;
    }, 0);
    
    console.log(`📁 Dynamic sitemaps: ${xmlFiles.length} files (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
  }

  console.log('\n🎉 All sitemaps generated successfully!');
  console.log(`🌐 Main sitemap: https://airlinesmap.com/sitemap.xml`);
  console.log(`📁 Dynamic sitemaps: https://airlinesmap.com/sitemaps/`);

} catch (error) {
  console.error('\n❌ Error during sitemap generation:', error.message);
  process.exit(1);
}
