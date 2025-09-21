const fs = require('fs');
const path = require('path');

// Read critical CSS
const criticalCSS = fs.readFileSync(path.join(__dirname, '../styles/critical.css'), 'utf8');

// Minify CSS (simple minification)
const minifiedCSS = criticalCSS
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
  .replace(/\s+/g, ' ') // Replace multiple spaces with single space
  .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
  .replace(/{\s+/g, '{') // Remove spaces after opening braces
  .replace(/;\s+/g, ';') // Remove spaces after semicolons
  .replace(/,\s+/g, ',') // Remove spaces after commas
  .trim();

// Create a CSS-in-JS file for Next.js
const cssInJS = `export const criticalCSS = \`${minifiedCSS}\`;`;

fs.writeFileSync(path.join(__dirname, '../lib/critical-css.js'), cssInJS);

console.log('Critical CSS inlined successfully!');
console.log(`Original size: ${criticalCSS.length} bytes`);
console.log(`Minified size: ${minifiedCSS.length} bytes`);
console.log(`Compression ratio: ${((criticalCSS.length - minifiedCSS.length) / criticalCSS.length * 100).toFixed(1)}%`);
