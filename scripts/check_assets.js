const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('index.html not found at', indexPath);
  process.exit(2);
}

const html = fs.readFileSync(indexPath, 'utf8');
const re = /thumbs\/[\w\-\.]+\.(glb|png)/g;
const matches = html.match(re) || [];
const uniq = Array.from(new Set(matches));

const missing = [];
uniq.forEach((rel) => {
  const file = path.join(root, rel.replace(/\//g, path.sep));
  if (!fs.existsSync(file)) missing.push(rel);
});

console.log('Referenced assets found in index.html:', uniq.length);
if (missing.length) {
  console.log('\nMissing assets:');
  missing.forEach(m => console.log('  -', m));
  process.exit(1);
} else {
  console.log('\nAll referenced assets are present in thumbs/.');
  process.exit(0);
}
