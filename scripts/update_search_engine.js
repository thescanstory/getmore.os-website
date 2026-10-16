import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MASTER_JSON_PATH = path.join(ROOT_DIR, 'data', 'leads', 'master_leads_10000.json');

const leads = JSON.parse(fs.readFileSync(MASTER_JSON_PATH, 'utf8'));
const minifiedDb = JSON.stringify(leads);

for (const htmlRelPath of ['pitchfinder.html', 'pitchfinder/index.html']) {
  const fullPath = path.join(ROOT_DIR, htmlRelPath);
  let content = fs.readFileSync(fullPath, 'utf8');

  // 1. Update REAL_VERIFIED_DATABASE
  content = content.replace(
    /const\s+REAL_VERIFIED_DATABASE\s*=\s*\[[\s\S]*?\];/,
    `const REAL_VERIFIED_DATABASE = ${minifiedDb};`
  );

  // 2. Upgrade generateUniversalLeads
  const oldGenStart = 'function generateUniversalLeads(query, city = \'Bangalore\', country = \'India\') {';
  const newGenBody = `function generateUniversalLeads(query, city = 'Bangalore', country = 'India') {
  const cleanQ = (query || '').trim();
  const queryLower = cleanQ.toLowerCase();
  const targetIndustryKey = getIndustryKey(cleanQ);
  const qNorm = cleanQ.toLowerCase().replace(/[^a-z0-9]/g, '');

  const cleanCity = (city || '').trim().toLowerCase();
  const cleanCountry = (country || '').trim().toLowerCase();

  const allLeadsSource = (typeof customImportedLeads !== 'undefined' && customImportedLeads.length > 0) ? 
    [...REAL_VERIFIED_DATABASE, ...customImportedLeads] : REAL_VERIFIED_DATABASE;

  let matchedReal = allLeadsSource.filter(item => {
    // 1. Country filter
    if (cleanCountry && cleanCountry !== 'all') {
      const itemCountry = (item.country || 'India').toLowerCase();
      if (itemCountry !== cleanCountry) return false;
    }

    // 2. City filter
    if (cleanCity && cleanCity !== 'all' && !cleanCity.startsWith('all')) {
      const itemCity = (item.city || '').toLowerCase();
      const itemArea = (item.area || '').toLowerCase();
      const itemAddr = (item.address || '').toLowerCase();
      const matchesCity = itemCity.includes(cleanCity) || itemArea.includes(cleanCity) || itemAddr.includes(cleanCity);
      if (!matchesCity) return false;
    }

    // 3. Query filter
    if (!cleanQ || cleanQ.toLowerCase() === 'all') return true;

    // Normalized alphanumeric match (handles typos, missing spaces, quotes like Ink'dtattoo studio vs Ink'd tattoo studio)
    const itemNormName = (item.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const itemNormAddr = (item.address || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const itemNormArea = (item.area || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const itemNormTags = (item.tags || []).join(' ').toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (qNorm) {
      if (itemNormName.includes(qNorm) || qNorm.includes(itemNormName)) return true;
      if (itemNormAddr.includes(qNorm) || itemNormArea.includes(qNorm)) return true;
      if (itemNormTags.includes(qNorm)) return true;
    }

    // Industry key match (inspect both name and tags)
    const itemIndustryKey = getIndustryKey((item.name || '') + ' ' + (item.tags || []).join(' '));
    if (targetIndustryKey !== 'general' && itemIndustryKey === targetIndustryKey) return true;

    // Word tokens match (e.g. "ink tattoo", "tattoo studio indiranagar")
    const tokens = cleanQ.toLowerCase().split(/[\\s,.'"-]+/).filter(t => t.length > 1);
    if (tokens.length > 0) {
      const combined = ((item.name || '') + ' ' + (item.area || '') + ' ' + (item.address || '') + ' ' + (item.tags || []).join(' ')).toLowerCase();
      if (tokens.every(t => combined.includes(t))) return true;
    }

    const nameMatch = (item.name || '').toLowerCase().includes(queryLower);
    const tagMatch = (item.tags || []).some(t => t.toLowerCase().includes(queryLower) || queryLower.includes(t.toLowerCase()));
    const areaMatch = (item.area || '').toLowerCase().includes(queryLower);
    return nameMatch || tagMatch || areaMatch;
  });`;

  content = content.replace(
    /function\s+generateUniversalLeads\(query,\s*city\s*=\s*'Bangalore',\s*country\s*=\s*'India'\)\s*\{[\s\S]*?return\s+matchedReal\.map/,
    `${newGenBody}\n\n  return matchedReal.map`
  );

  // 3. Upgrade applyLocalFilters instant search
  const oldFilterSnippet = `  // 1. Instant Text Search Filter
  if (instantSearchQuery) {
    filtered = filtered.filter(b => 
      (b.name && b.name.toLowerCase().includes(instantSearchQuery)) || 
      (b.area && b.area.toLowerCase().includes(instantSearchQuery)) || 
      (b.full_address && b.full_address.toLowerCase().includes(instantSearchQuery)) ||
      (b.category && b.category.toLowerCase().includes(instantSearchQuery)) ||
      (b.subcategory && b.subcategory.toLowerCase().includes(instantSearchQuery)) ||
      (b.pitch_offer_name && b.pitch_offer_name.toLowerCase().includes(instantSearchQuery)) ||
      (b.phone_number && b.phone_number.includes(instantSearchQuery))
    );
  }`;

  const newFilterSnippet = `  // 1. Instant Text Search Filter (Resilient & Fuzzy Normalized)
  if (instantSearchQuery) {
    const iqNorm = instantSearchQuery.replace(/[^a-z0-9]/g, '');
    const iqTokens = instantSearchQuery.split(/[\\s,.'"-]+/).filter(t => t.length > 1);

    filtered = filtered.filter(b => {
      // 1. Direct includes
      if (b.name && b.name.toLowerCase().includes(instantSearchQuery)) return true;
      if (b.area && b.area.toLowerCase().includes(instantSearchQuery)) return true;
      if (b.full_address && b.full_address.toLowerCase().includes(instantSearchQuery)) return true;
      if (b.category && b.category.toLowerCase().includes(instantSearchQuery)) return true;
      if (b.subcategory && b.subcategory.toLowerCase().includes(instantSearchQuery)) return true;
      if (b.pitch_offer_name && b.pitch_offer_name.toLowerCase().includes(instantSearchQuery)) return true;
      if (b.phone_number && b.phone_number.includes(instantSearchQuery)) return true;

      // 2. Normalized match (ignores missing spaces, apostrophes, punctuation)
      if (iqNorm) {
        const bNormName = (b.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const bNormAddr = (b.full_address || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const bNormArea = (b.area || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const bNormPhone = (b.phone_number || '').replace(/[^0-9]/g, '');
        if (bNormName.includes(iqNorm) || iqNorm.includes(bNormName)) return true;
        if (bNormAddr.includes(iqNorm) || bNormArea.includes(iqNorm)) return true;
        if (bNormPhone.includes(iqNorm)) return true;
      }

      // 3. Token match (each word matches in combined entity metadata)
      if (iqTokens.length > 0) {
        const combined = ((b.name || '') + ' ' + (b.area || '') + ' ' + (b.full_address || '') + ' ' + (b.category || '') + ' ' + (b.subcategory || '')).toLowerCase();
        if (iqTokens.every(tok => combined.includes(tok))) return true;
      }

      return false;
    });
  }`;

  if (content.includes(oldFilterSnippet)) {
    content = content.replace(oldFilterSnippet, newFilterSnippet);
  } else {
    // Regex replace
    content = content.replace(
      /\/\/ 1\. Instant Text Search Filter[\s\S]*?filtered\s*=\s*filtered\.filter\(b\s*=>[\s\S]*?\);\s*\}/,
      newFilterSnippet
    );
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✓ Upgraded search engine in ${htmlRelPath}`);
}
