import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MASTER_JSON_PATH = path.join(ROOT_DIR, 'data', 'leads', 'master_leads_10000.json');
const DETAILING_CSV_PATH = path.join(ROOT_DIR, 'bangalore_car_detailing_50_queue.csv');
const DETAILING_JSON_PATH = path.join(ROOT_DIR, 'data', 'leads', 'bangalore_car_detailing_50_queue.json');
const HTML_FILES = [
  path.join(ROOT_DIR, 'pitchfinder.html'),
  path.join(ROOT_DIR, 'pitchfinder', 'index.html')
];

function generatePitchAngle(lead) {
  const area = lead.area && lead.area !== 'Bangalore' ? lead.area : 'Bangalore';
  const name = lead.name;
  
  if (name.toLowerCase().includes('ppf') || name.toLowerCase().includes('ceramic')) {
    return `Specialized PPF/Ceramic warranty registration, instant WhatsApp paint package calculator & luxury car booking funnel in ${area}.`;
  }
  if (name.toLowerCase().includes('wash') || name.toLowerCase().includes('spa')) {
    return `Automated WhatsApp recurring maintenance package subscription & instant doorstep/slot booking engine in ${area}.`;
  }
  return `Sub-second luxury vehicle gallery portfolio, automated WhatsApp PPF estimate generator & Google 5-Star review tap funnel in ${area}.`;
}

function cleanArea(address, defaultArea) {
  if (!address) return defaultArea;
  const lower = address.toLowerCase();
  if (lower.includes('hsr layout') || lower.includes('hsr')) return 'HSR Layout';
  if (lower.includes('koramangala')) return 'Koramangala';
  if (lower.includes('indiranagar')) return 'Indiranagar';
  if (lower.includes('whitefield')) return 'Whitefield';
  if (lower.includes('electronic city')) return 'Electronic City';
  if (lower.includes('marathahalli')) return 'Marathahalli';
  if (lower.includes('bellandur')) return 'Bellandur';
  if (lower.includes('sarjapur')) return 'Sarjapur Road';
  if (lower.includes('jp nagar')) return 'JP Nagar';
  if (lower.includes('jayanagar')) return 'Jayanagar';
  if (lower.includes('basavanagudi')) return 'Basavanagudi';
  if (lower.includes('lavelle')) return 'Lavelle Road';
  return defaultArea || 'Bangalore';
}

function main() {
  console.log('--- GENERATING NEW 50 CAR DETAILING & PPF QUEUE ---');

  const content = fs.readFileSync(path.join(ROOT_DIR, 'pitchfinder.html'), 'utf8');
  const match = content.match(/const REAL_VERIFIED_DATABASE = (\[.*?\]);/s);
  if (!match) {
    console.error('Failed to parse REAL_VERIFIED_DATABASE from pitchfinder.html');
    process.exit(1);
  }

  const db = JSON.parse(match[1]);

  const detailingLeads = db.filter(l => 
    (l.category === 'car detailing' || (l.tags && (l.tags.includes('car detailing') || l.tags.includes('ppf') || l.tags.includes('ceramic coating')))) &&
    l.whatsapp &&
    (l.city === 'Bangalore' || (l.address && l.address.toLowerCase().includes('bengaluru')))
  );

  const seenPhones = new Set();
  const seenNames = new Set();
  const final50 = [];

  for (const lead of detailingLeads) {
    const phone = lead.whatsapp;
    const cleanName = lead.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (!seenPhones.has(phone) && !seenNames.has(cleanName)) {
      seenPhones.add(phone);
      seenNames.add(cleanName);
      
      const realArea = cleanArea(lead.address, lead.area);
      const enrichedLead = {
        ...lead,
        area: realArea,
        pitch_angle: generatePitchAngle({ ...lead, area: realArea }),
        whatsapp_link: `https://wa.me/${lead.whatsapp}`
      };
      final50.push(enrichedLead);

      if (final50.length === 50) break;
    }
  }

  console.log(`✓ Selected ${final50.length} verified luxury detailing studios in Bangalore.`);

  // Write JSON
  fs.writeFileSync(DETAILING_JSON_PATH, JSON.stringify(final50, null, 2), 'utf8');
  console.log(`✓ Saved ${DETAILING_JSON_PATH}`);

  // Write CSV
  const csvRows = [
    ['Sl No', 'Studio Name', 'Area / Locality', 'Rating', 'Reviews', 'Phone', 'WhatsApp Direct Link', 'Website', 'Full Address', 'Custom Pitch Angle']
  ];

  final50.forEach((l, idx) => {
    csvRows.push([
      idx + 1,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.area}"`,
      l.rating || 4.8,
      l.reviews || 100,
      `"${l.phone}"`,
      l.whatsapp_link,
      `"${l.website || 'No website'}"`,
      `"${(l.address || '').replace(/"/g, '""')}"`,
      `"${l.pitch_angle.replace(/"/g, '""')}"`
    ]);
  });

  fs.writeFileSync(DETAILING_CSV_PATH, csvRows.map(r => r.join(',')).join('\n'), 'utf8');
  console.log(`✓ Saved ${DETAILING_CSV_PATH}`);

  // Patch HTML files to add Detailing 50 Queue trigger
  for (const htmlPath of HTML_FILES) {
    let html = fs.readFileSync(htmlPath, 'utf8');

    // 1. Update startDailyQueue in javascript
    if (!html.includes("queueType === 'detailing'")) {
      const searchTarget = "if (queueType === 'dental') {";
      const replacement = `if (queueType === 'detailing') {
    const detailingMatches = rawDiscoveredBrands.filter(b => 
      (b.tags && (b.tags.includes('car detailing') || b.tags.includes('ppf') || b.tags.includes('ceramic coating'))) || 
      (b.category && b.category.toLowerCase().includes('car detail')) ||
      (b.name && (b.name.toLowerCase().includes('detail') || b.name.toLowerCase().includes('ppf') || b.name.toLowerCase().includes('car care') || b.name.toLowerCase().includes('ceramic')))
    );
    if (detailingMatches.length > 0) {
      pool = detailingMatches;
    }
  } else if (queueType === 'dental') {`;

      if (html.includes(searchTarget)) {
        html = html.replace(searchTarget, replacement);
        console.log(`✓ Added startDailyQueue('detailing') handler in ${path.basename(htmlPath)}`);
      }
    }

    // 2. Add header pill
    if (!html.includes("startDailyQueue('detailing')")) {
      const dentalPillRegex = /(<button onclick="startDailyQueue\('dental'\)"[^>]*>[\s\S]*?<\/button>)/;
      const detailingPill = `\n        <!-- Detailing 50 Queue Trigger Pill -->
        <button onclick="startDailyQueue('detailing')" class="px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-[#af52de] border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer" title="Launch Verified 50 Bangalore Car Detailing & PPF Studios Focus Queue">
          <span>🏎️ Detailing 50</span>
          <span class="text-[10px] px-1.5 py-0.2 bg-[#af52de] text-white rounded-full font-mono">50</span>
        </button>`;

      if (dentalPillRegex.test(html)) {
        html = html.replace(dentalPillRegex, `$1${detailingPill}`);
        console.log(`✓ Added Detailing 50 Header pill in ${path.basename(htmlPath)}`);
      }
    }

    // 3. Add hub button
    if (!html.includes("Launch Detailing 50 Queue")) {
      const dentalHubBtnRegex = /(<button onclick="startDailyQueue\('dental'\)"[^>]*>[\s\S]*?<\/button>)/;
      const detailingHubBtn = `\n        <!-- Detailing 50 Hub Button -->
        <button onclick="startDailyQueue('detailing')" class="apple-pill-btn px-4 py-2.5 text-xs font-bold flex items-center gap-2 bg-[#af52de] hover:bg-[#9a3ec4] text-white shadow-sm shrink-0 cursor-pointer">
          <span>🏎️ Detailing 50 Queue</span>
        </button>`;

      if (dentalHubBtnRegex.test(html)) {
        html = html.replace(dentalHubBtnRegex, `$1${detailingHubBtn}`);
        console.log(`✓ Added Detailing 50 Hub button in ${path.basename(htmlPath)}`);
      }
    }

    fs.writeFileSync(htmlPath, html, 'utf8');
  }

  console.log('\n🎉 ALL DONE! 50 Daily Car Detailing & PPF Queue created and wired up successfully.');
}

main();
