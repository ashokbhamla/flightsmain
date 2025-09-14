const fs = require('fs');
const path = require('path');
const { minify } = require('csso');

// Function to minify CSS files
function minifyCSSFiles() {
  const stylesDir = path.join(__dirname, '..', 'styles');
  const nextDir = path.join(__dirname, '..', '.next', 'static', 'css');
  
  // Minify styles directory files
  if (fs.existsSync(stylesDir)) {
    const files = fs.readdirSync(stylesDir).filter(file => file.endsWith('.css'));
    
    files.forEach(file => {
      const filePath = path.join(stylesDir, file);
      const css = fs.readFileSync(filePath, 'utf8');
      const minified = minify(css).css;
      
      // Write minified version
      fs.writeFileSync(filePath, minified);
      console.log(`Minified: ${file}`);
    });
  }
  
  // Minify Next.js generated CSS files
  if (fs.existsSync(nextDir)) {
    const files = fs.readdirSync(nextDir).filter(file => file.endsWith('.css'));
    
    files.forEach(file => {
      const filePath = path.join(nextDir, file);
      const css = fs.readFileSync(filePath, 'utf8');
      const minified = minify(css).css;
      
      // Write minified version
      fs.writeFileSync(filePath, minified);
      console.log(`Minified: ${file}`);
    });
  }
  
  console.log('CSS minification completed!');
}

minifyCSSFiles();
