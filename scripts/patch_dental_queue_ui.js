import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const HTML_FILES = [
  path.join(ROOT_DIR, 'pitchfinder.html'),
  path.join(ROOT_DIR, 'pitchfinder', 'index.html')
];

for (const filePath of HTML_FILES) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add Dental 50 Queue Pill in Header next to Daily 50 Queue
  if (!content.includes('startDailyQueue(\'dental\')')) {
    const oldHeaderPill = `        <!-- Daily 50 Queue Trigger Pill -->
        <button onclick="startDailyQueue()" class="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer" title="Launch Ban-Safe 50 DMs / Day Focus Studio">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>⚡ Daily 50 Queue</span>
          <span id="header-queue-counter" class="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded-full font-mono">0/50</span>
        </button>`;

    const newHeaderPill = `        <!-- Daily 50 Queue Trigger Pill -->
        <button onclick="startDailyQueue()" class="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer" title="Launch Ban-Safe 50 DMs / Day Focus Studio">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>⚡ Daily 50 Queue</span>
          <span id="header-queue-counter" class="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded-full font-mono">0/50</span>
        </button>

        <!-- Dental 50 Queue Trigger Pill -->
        <button onclick="startDailyQueue('dental')" class="px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0071e3] border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer" title="Launch Verified 50 Bangalore Dental Clinics Focus Queue">
          <span>🦷 Dental 50 Queue</span>
          <span class="text-[10px] px-1.5 py-0.2 bg-[#0071e3] text-white rounded-full font-mono">50</span>
        </button>`;

    if (content.includes(oldHeaderPill)) {
      content = content.replace(oldHeaderPill, newHeaderPill);
    } else {
      // Fallback regex replacement
      content = content.replace(
        /(<button onclick="startDailyQueue\(\)"[^>]*>[\s\S]*?<\/button>)/,
        `$1\n\n        <!-- Dental 50 Queue Trigger Pill -->\n        <button onclick="startDailyQueue('dental')" class="px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0071e3] border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer" title="Launch Verified 50 Bangalore Dental Clinics Focus Queue">\n          <span>🦷 Dental 50 Queue</span>\n          <span class="text-[10px] px-1.5 py-0.2 bg-[#0071e3] text-white rounded-full font-mono">50</span>\n        </button>`
      );
    }
  }

  // 2. Add Dental 50 Button in Daily 50 WhatsApp Outreach Hub Bar
  if (!content.includes('Launch Dental 50 Queue')) {
    const oldHubBtn = `        <!-- Launch Queue Button -->
        <button onclick="startDailyQueue()" class="apple-pill-btn px-4 py-2.5 text-xs font-bold flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm shrink-0 cursor-pointer">
          <svg class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Launch 50 DM Queue</span>
          <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">Space ␣</span>
        </button>`;

    const newHubBtn = `        <!-- Launch Queue Button -->
        <button onclick="startDailyQueue()" class="apple-pill-btn px-4 py-2.5 text-xs font-bold flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm shrink-0 cursor-pointer">
          <svg class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Launch 50 DM Queue</span>
          <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">Space ␣</span>
        </button>

        <!-- Launch Dental 50 Queue Button -->
        <button onclick="startDailyQueue('dental')" class="apple-pill-btn px-4 py-2.5 text-xs font-bold flex items-center gap-2 bg-[#0071e3] hover:bg-blue-600 text-white shadow-sm shrink-0 cursor-pointer" title="Launch Verified 50 Dental Clinics Focus Queue">
          <span>🦷 Dental 50 Queue</span>
          <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">50 Verified</span>
        </button>`;

    if (content.includes(oldHubBtn)) {
      content = content.replace(oldHubBtn, newHubBtn);
    }
  }

  // 3. Update startDailyQueue function definition to accept queueType
  content = content.replace(
    /function startDailyQueue\(\) \{([\s\S]*?)const pool = displayedBrands\.length > 0 \? displayedBrands : rawDiscoveredBrands;/,
    `function startDailyQueue(queueType) {\n  const contacted = getContactedTodayList();\n  let pool = displayedBrands.length > 0 ? displayedBrands : rawDiscoveredBrands;\n\n  if (queueType === 'dental') {\n    const dentalMatches = rawDiscoveredBrands.filter(b => \n      (b.tags && (b.tags.includes('dentist') || b.tags.includes('dental'))) || \n      (b.category && b.category.toLowerCase().includes('dent')) ||\n      (b.name && b.name.toLowerCase().includes('dental'))\n    );\n    if (dentalMatches.length > 0) {\n      pool = dentalMatches;\n    }\n  }`
  );

  // 4. Update generateWhatsAppPitch to include dental angle
  if (!content.includes('const isDental =')) {
    content = content.replace(
      /const isFood = b\.category && \(b\.category\.toLowerCase\(\)\.includes\('food'\)[\s\S]*?\);\n\s*const regional = getRegionalPitchPricing\(b\.country\);/,
      `const isFood = b.category && (b.category.toLowerCase().includes('food') || b.category.toLowerCase().includes('biryani') || b.category.toLowerCase().includes('cafe') || b.category.toLowerCase().includes('dining') || b.category.toLowerCase().includes('restaurant'));
  const isDental = (b.category && b.category.toLowerCase().includes('dent')) || 
                   (b.tags && (b.tags.includes('dentist') || b.tags.includes('dental'))) ||
                   (b.name && b.name.toLowerCase().includes('dental'));
  const regional = getRegionalPitchPricing(b.country);`
    );

    const dentalAngleCode = `  // Angle 1b: Dental Clinics (High-ticket smile makeovers, aligners, direct WhatsApp appointments)
  if (isDental) {
    if (!b.website_url) {
      return \`Hey *\${cleanName}* team 👋\\n\\nFound your clinic on Google Maps in *\${area}* with *\${reviewsCount} reviews (\${rating})* — fantastic patient reputation!\\n\\nWhen local patients find you on Google Maps, there is no direct consultation booking link, so patients call during busy clinic hours or get redirected to aggregator portals.\\n\\nWe build custom *1-Click WhatsApp Consultation Booking apps & Smile Galleries* (from \${regional.setup}, 0% commission) so patients book appointments directly in 5 seconds.\\n\\nCan I send a 30-sec demo preview link we made for *\${cleanName}*? 🦷\${footerLinks}\`;
    } else {
      return \`Hey *\${cleanName}* team 👋\\n\\nSaw your clinic's strong reputation on Google Maps in *\${area}* with *\${reviewsCount} reviews*!\\n\\nWhen patients search for clear aligners, dental implants, or smile makeovers in \${area}, our *24/7 WhatsApp AI Assistant* answers questions, explains treatment pricing roadmaps, and confirms appointments directly 24/7.\\n\\nOpen to seeing a quick 30-sec demo preview tailored for *\${cleanName}*? 🦷\${footerLinks}\`;
    }
  }\n\n`;

    content = content.replace(
      /(\/\/ Angle 1: Has Google Maps with Reviews, but NO Direct Website)/,
      dentalAngleCode + '$1'
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Patched ${filePath} successfully.`);
}

console.log('UI Patch complete!');
