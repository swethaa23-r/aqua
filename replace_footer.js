const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/SWETHA/Desktop/aqua';

const indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

// Extract the footer from index.html
const footerRegex = /<!-- Premium Stackly Footer -->[\s\S]*?<\/footer>/;
const footerMatch = indexHtml.match(footerRegex);

if (!footerMatch) {
  console.error("Could not find footer in index.html");
  process.exit(1);
}

const newFooter = footerMatch[0];

const files = [
  'about.html',
  'services.html',
  'species.html',
  'technology.html',
  'sustainability.html',
  'gallery.html',
  'blog.html',
  'contact.html',
  '404.html'
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace existing footer. Existing could be <!-- Premium Stackly Footer -->... or <!-- Footer -->...
  const existingFooterRegex = /<!--\s*(Premium Stackly )?Footer\s*-->[\s\S]*?<\/footer>/i;
  
  if (existingFooterRegex.test(content)) {
    content = content.replace(existingFooterRegex, newFooter);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    // If there's no comment, just look for <footer
    const fallbackRegex = /<footer[\s\S]*?<\/footer>/i;
    if (fallbackRegex.test(content)) {
      content = content.replace(fallbackRegex, newFooter);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file} (fallback)`);
    } else {
      console.log(`No footer found in ${file}`);
    }
  }
});
