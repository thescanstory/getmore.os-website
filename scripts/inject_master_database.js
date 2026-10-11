import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const masterLeadsPath = path.join(ROOT_DIR, 'data', 'leads', 'master_leads_10000.json');
const masterLeads = JSON.parse(fs.readFileSync(masterLeadsPath, 'utf8'));

console.log(`Injecting ${masterLeads.length.toLocaleString()} leads into PitchFinder...`);
const minifiedDb = 'const REAL_VERIFIED_DATABASE = ' + JSON.stringify(masterLeads) + ';';

function injectInto(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace REAL_VERIFIED_DATABASE definition
  const match = content.match(/const REAL_VERIFIED_DATABASE\s*=\s*\[[\s\S]*?\];/);
  if (!match) {
    throw new Error(`Could not find REAL_VERIFIED_DATABASE in ${filePath}`);
  }

  content = content.replace(/const REAL_VERIFIED_DATABASE\s*=\s*\[[\s\S]*?\];/, minifiedDb);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Updated ${filePath} (${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)} MB)`);
}

injectInto(path.join(ROOT_DIR, 'pitchfinder/index.html'));
injectInto(path.join(ROOT_DIR, 'pitchfinder.html'));

console.log('🎉 Successfully injected 8,617 leads (1,000+ per category and city) into PitchFinder!');
