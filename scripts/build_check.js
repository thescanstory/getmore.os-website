import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('🔍 Running GetMoreOS Pre-Deployment Build Verification...');

let errors = 0;

// 1. Verify key HTML files exist
const requiredFiles = [
  'index.html',
  'pitchfinder.html',
  'pitchfinder/index.html',
  'clinic-website-bangalore/index.html',
  'hotel-direct-booking-website/index.html',
  'local-seo-bangalore/index.html',
  'restaurant-website-zero-commission/index.html',
  'salon-website-bangalore/index.html',
  'whatsapp-booking-automation/index.html',
  'posters.html',
  'sitemap.xml',
  'robots.txt',
  'data/leads/sample_import_template.csv'
];

requiredFiles.forEach(rel => {
  const full = path.join(ROOT_DIR, rel);
  if (!fs.existsSync(full)) {
    console.error(`❌ Missing critical file: ${rel}`);
    errors++;
  } else {
    const size = fs.statSync(full).size;
    if (size === 0) {
      console.error(`❌ Empty file: ${rel}`);
      errors++;
    } else {
      console.log(`  ✓ ${rel} (${size} bytes)`);
    }
  }
});

// 2. Verify JavaScript syntax inside key HTML files
const htmlFilesWithScripts = ['index.html', 'pitchfinder/index.html'];
htmlFilesWithScripts.forEach(rel => {
  const full = path.join(ROOT_DIR, rel);
  if (!fs.existsSync(full)) return;
  const content = fs.readFileSync(full, 'utf8');
  const scriptMatches = [...content.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi)];
  scriptMatches.forEach((m, idx) => {
    const code = m[1].trim();
    if (!code) return;
    if (m[0].includes('application/ld+json')) {
      try {
        JSON.parse(code);
        console.log(`  ✓ ${rel} Script #${idx + 1} JSON-LD Valid`);
      } catch (e) {
        console.error(`❌ ${rel} Script #${idx + 1} JSON-LD Error:`, e.message);
        errors++;
      }
    } else {
      try {
        new Function(code);
        console.log(`  ✓ ${rel} Script #${idx + 1} JS Syntax Valid`);
      } catch (e) {
        console.error(`❌ ${rel} Script #${idx + 1} JS Syntax Error:`, e.message);
        errors++;
      }
    }
  });
});

if (errors > 0) {
  console.error(`\n💥 Build verification failed with ${errors} error(s)!`);
  process.exit(1);
} else {
  console.log('\n✅ All build checks passed successfully!');
  process.exit(0);
}
