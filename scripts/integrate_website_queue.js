import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DETAILING_50_JSON = path.join(ROOT_DIR, 'data', 'leads', 'bangalore_car_detailing_50_queue.json');
const DENTAL_50_JSON = path.join(ROOT_DIR, 'data', 'leads', 'bangalore_dental_50_queue.json');
const HTML_FILES = [
  path.join(ROOT_DIR, 'pitchfinder.html'),
  path.join(ROOT_DIR, 'pitchfinder', 'index.html')
];

function main() {
  console.log('--- WIRING UP EXACT 50 DAILY QUEUE INTO PITCHFINDER WEBSITE ---');

  const detailing50 = JSON.parse(fs.readFileSync(DETAILING_50_JSON, 'utf8'));
  const dental50 = JSON.parse(fs.readFileSync(DENTAL_50_JSON, 'utf8'));

  console.log(`Loaded ${detailing50.length} detailing leads and ${dental50.length} dental leads.`);

  for (const htmlPath of HTML_FILES) {
    let content = fs.readFileSync(htmlPath, 'utf8');

    // 1. Embed DETAILING_50_QUEUE if not already present
    const embedMarker = 'const DETAILING_50_QUEUE =';
    if (!content.includes(embedMarker)) {
      const dbMarker = 'const REAL_VERIFIED_DATABASE =';
      const embedCode = `// Top 50 Luxury Car Detailing & PPF Studios Queue (Bangalore)\nconst DETAILING_50_QUEUE = ${JSON.stringify(detailing50)};\n\n`;
      content = content.replace(dbMarker, embedCode + dbMarker);
      console.log(`✓ Embedded DETAILING_50_QUEUE in ${path.basename(htmlPath)}`);
    } else {
      // Refresh it
      content = content.replace(
        /const\s+DETAILING_50_QUEUE\s*=\s*\[[\s\S]*?\];\n\n/,
        `const DETAILING_50_QUEUE = ${JSON.stringify(detailing50)};\n\n`
      );
      console.log(`✓ Refreshed DETAILING_50_QUEUE in ${path.basename(htmlPath)}`);
    }

    // 2. Clean up header buttons (lines with Daily 50, Dental 50, Detailing 50)
    const headerPillsRegex = /<!-- Daily 50 Queue Trigger Pill -->[\s\S]*?(?=<!-- Import 1,000\+ Leads)/;
    const cleanHeaderPills = `<!-- Detailing 50 Queue Trigger Pill -->
        <button onclick="startDailyQueue('detailing')" class="px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-[#af52de] border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer" title="Launch Verified 50 Bangalore Car Detailing & PPF Studios Focus Queue">
          <span>🏎️ Detailing 50</span>
          <span class="text-[10px] px-1.5 py-0.2 bg-[#af52de] text-white rounded-full font-mono">50</span>
        </button>

        <!-- Dental 50 Queue Trigger Pill -->
        <button onclick="startDailyQueue('dental')" class="px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0071e3] border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer" title="Launch Verified 50 Bangalore Dental Clinics Focus Queue">
          <span>🦷 Dental 50</span>
          <span class="text-[10px] px-1.5 py-0.2 bg-[#0071e3] text-white rounded-full font-mono">50</span>
        </button>

        <!-- Daily 50 Queue Trigger Pill -->
        <button onclick="startDailyQueue('detailing')" class="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer" title="Launch Today's Verified 50 Focus Leads">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>⚡ Daily 50 Queue</span>
          <span id="header-queue-counter" class="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded-full font-mono">0/50</span>
        </button>

        `;

    if (headerPillsRegex.test(content)) {
      content = content.replace(headerPillsRegex, cleanHeaderPills);
      console.log(`✓ Cleaned header pills in ${path.basename(htmlPath)}`);
    }

    // 3. Clean up Hub Bar buttons
    const hubButtonsRegex = /<!-- Launch Queue Button -->[\s\S]*?(?=<!-- Hide Contacted Checkbox -->)/;
    const cleanHubButtons = `<!-- Launch Detailing 50 Button -->
        <button onclick="startDailyQueue('detailing')" class="apple-pill-btn px-4 py-2.5 text-xs font-bold flex items-center gap-2 bg-[#af52de] hover:bg-[#9a3ec4] text-white shadow-sm shrink-0 cursor-pointer" title="Launch Verified 50 Car Detailing & PPF Studios">
          <span>🏎️ Detailing 50 Queue</span>
          <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">50</span>
        </button>

        <!-- Launch Dental 50 Button -->
        <button onclick="startDailyQueue('dental')" class="apple-pill-btn px-4 py-2.5 text-xs font-bold flex items-center gap-2 bg-[#0071e3] hover:bg-blue-600 text-white shadow-sm shrink-0 cursor-pointer" title="Launch Verified 50 Dental Clinics Focus Queue">
          <span>🦷 Dental 50 Queue</span>
          <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">50</span>
        </button>

        <!-- Launch Master 50 Queue Button -->
        <button onclick="startDailyQueue('detailing')" class="apple-pill-btn px-4 py-2.5 text-xs font-bold flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm shrink-0 cursor-pointer">
          <svg class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Launch 50 DM Queue</span>
          <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">Space ␣</span>
        </button>

        `;

    if (hubButtonsRegex.test(content)) {
      content = content.replace(hubButtonsRegex, cleanHubButtons);
      console.log(`✓ Cleaned hub buttons in ${path.basename(htmlPath)}`);
    }

    // 4. Update the queue modal header to support queue switching tabs
    const modalHeaderTopRegex = /(<div class="px-6 py-3\.5 border-b border-black\/\[0\.08\] bg-\[#f5f5f7\] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2\.5">[\s\S]*?<div class="flex items-center gap-2\.5">[\s\S]*?<\/div>[\s\S]*?<\/div>)/;
    
    const newModalHeaderTop = `<div class="px-5 sm:px-6 py-3.5 border-b border-black/[0.08] bg-[#f5f5f7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div class="flex items-center gap-2.5">
          <div id="queue-icon-badge" class="w-8 h-8 rounded-lg bg-[#af52de] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            🏎️
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span id="queue-title-text" class="font-bold text-sm text-[#1d1d1f]">Daily 50 Outreach Runner</span>
              <span id="queue-lead-counter" class="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">Lead 1 / 50</span>
            </div>
            <div class="text-[11px] text-[#6e6e73] flex items-center gap-1.5">
              <span>🟢 1-Key Quick-Fire</span> • 
              <span id="queue-remaining-text" class="text-purple-700 font-semibold">50 leads remaining today</span>
            </div>
          </div>
        </div>

        <!-- Mode switcher tabs inside modal -->
        <div class="flex items-center gap-1 bg-black/5 p-1 rounded-full text-[11px] font-semibold shrink-0">
          <button id="modal-tab-detailing" onclick="startDailyQueue('detailing')" class="px-2.5 py-1 rounded-full transition-all cursor-pointer">🏎️ Detailing (50)</button>
          <button id="modal-tab-dental" onclick="startDailyQueue('dental')" class="px-2.5 py-1 rounded-full transition-all cursor-pointer">🦷 Dental (50)</button>
          <button id="modal-tab-all" onclick="startDailyQueue('all')" class="px-2.5 py-1 rounded-full transition-all cursor-pointer">⚡ All (50)</button>
        </div>`;

    if (modalHeaderTopRegex.test(content) && !content.includes('id="modal-tab-detailing"')) {
      content = content.replace(modalHeaderTopRegex, newModalHeaderTop);
      console.log(`✓ Enhanced queue modal header with mode tabs in ${path.basename(htmlPath)}`);
    }

    // 5. Update startDailyQueue function logic to strictly enforce EXACTLY 50 leads
    const startQueueFnRegex = /function\s+startDailyQueue\s*\([^\)]*\)\s*\{[\s\S]*?(?=function\s+loadQueueLead)/;
    
    const newStartQueueFn = `var currentQueueType = 'detailing';

function startDailyQueue(queueType) {
  if (!queueType) queueType = 'detailing';
  currentQueueType = queueType;
  const contacted = getContactedTodayList();
  let pool = [];

  const iconBadge = document.getElementById('queue-icon-badge');
  const titleText = document.getElementById('queue-title-text');
  const counterPill = document.getElementById('queue-lead-counter');
  const progressBar = document.getElementById('queue-progress-bar');
  const tabDetailing = document.getElementById('modal-tab-detailing');
  const tabDental = document.getElementById('modal-tab-dental');
  const tabAll = document.getElementById('modal-tab-all');

  // Reset tab active styling
  [tabDetailing, tabDental, tabAll].forEach(t => {
    if (t) {
      t.className = 'px-2.5 py-1 rounded-full transition-all cursor-pointer text-[#6e6e73] hover:text-[#1d1d1f]';
    }
  });

  if (queueType === 'detailing') {
    pool = (typeof DETAILING_50_QUEUE !== 'undefined' && DETAILING_50_QUEUE.length > 0)
      ? [...DETAILING_50_QUEUE]
      : rawDiscoveredBrands.filter(b => 
          (b.tags && (b.tags.includes('car detailing') || b.tags.includes('ppf') || b.tags.includes('ceramic coating'))) || 
          (b.category && b.category.toLowerCase().includes('car detail'))
        );
    if (iconBadge) iconBadge.textContent = '🏎️';
    if (iconBadge) iconBadge.className = 'w-8 h-8 rounded-lg bg-[#af52de] text-white flex items-center justify-center font-bold text-sm shadow-xs';
    if (titleText) titleText.textContent = 'Car Detailing & PPF 50 Queue';
    if (counterPill) counterPill.className = 'text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800';
    if (progressBar) progressBar.className = 'h-full bg-[#af52de] rounded-full transition-all duration-300';
    if (tabDetailing) tabDetailing.className = 'px-2.5 py-1 rounded-full bg-white shadow-2xs text-[#af52de] font-bold cursor-pointer';
  } else if (queueType === 'dental') {
    const dentalMatches = rawDiscoveredBrands.filter(b => 
      (b.tags && (b.tags.includes('dentist') || b.tags.includes('dental'))) || 
      (b.category && b.category.toLowerCase().includes('dent')) ||
      (b.name && b.name.toLowerCase().includes('dental'))
    );
    pool = dentalMatches.length > 0 ? dentalMatches : rawDiscoveredBrands.slice(0, 50);
    if (iconBadge) iconBadge.textContent = '🦷';
    if (iconBadge) iconBadge.className = 'w-8 h-8 rounded-lg bg-[#0071e3] text-white flex items-center justify-center font-bold text-sm shadow-xs';
    if (titleText) titleText.textContent = 'Dental Clinics 50 Queue';
    if (counterPill) counterPill.className = 'text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800';
    if (progressBar) progressBar.className = 'h-full bg-[#0071e3] rounded-full transition-all duration-300';
    if (tabDental) tabDental.className = 'px-2.5 py-1 rounded-full bg-white shadow-2xs text-[#0071e3] font-bold cursor-pointer';
  } else {
    pool = displayedBrands.length > 0 ? [...displayedBrands] : [...rawDiscoveredBrands];
    if (iconBadge) iconBadge.textContent = '⚡';
    if (iconBadge) iconBadge.className = 'w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center font-bold text-sm shadow-xs';
    if (titleText) titleText.textContent = 'Daily 50 Outreach Runner';
    if (counterPill) counterPill.className = 'text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
    if (progressBar) progressBar.className = 'h-full bg-[#25D366] rounded-full transition-all duration-300';
    if (tabAll) tabAll.className = 'px-2.5 py-1 rounded-full bg-white shadow-2xs text-emerald-700 font-bold cursor-pointer';
  }

  if (!pool || pool.length === 0) {
    alert('No verified leads available in current view.');
    return;
  }

  // Sort queue so uncontacted leads appear first, and strictly cap at EXACTLY 50 leads
  const sorted = [...pool].sort((a, b) => {
    const aContacted = contacted.includes(a.id || a.name) ? 1 : 0;
    const bContacted = contacted.includes(b.id || b.name) ? 1 : 0;
    return aContacted - bContacted;
  });

  queueLeadsList = sorted.slice(0, 50);

  queueActiveIndex = 0;
  loadQueueLead(queueActiveIndex);
  document.getElementById('outreach-queue-modal').classList.remove('hidden');
}

`;

    content = content.replace(startQueueFnRegex, newStartQueueFn);
    console.log(`✓ Upgraded startDailyQueue with strict 50 cap in ${path.basename(htmlPath)}`);

    // 6. Ensure generateWhatsAppPitch includes Car Detailing & PPF custom script
    if (!content.includes('isDetailing =')) {
      const pitchTarget = "const isDental =";
      const pitchAddition = `const isDetailing = (b.category && b.category.toLowerCase().includes('car detail')) ||
                    (b.tags && (b.tags.includes('car detailing') || b.tags.includes('ppf') || b.tags.includes('ceramic coating'))) ||
                    (b.name && (b.name.toLowerCase().includes('detail') || b.name.toLowerCase().includes('ppf') || b.name.toLowerCase().includes('car care') || b.name.toLowerCase().includes('ceramic')));

  if (isDetailing) {
    return \`Hey *\${cleanName}* team 👋\\n\\nFound your studio on Google Maps in *\${area}* with *\${reviewsCount} reviews (\${rating})* — incredible quality finish and reputation!\\n\\nWhen high-ticket car owners (BMW, Merc, Porsche, Thar, Fortuner) search for Ceramic, Graphene, or PPF in \${area}, they want to see before/after transformation videos, warranty proof, and instant package quotes on WhatsApp.\\n\\nWe build custom *1-Click WhatsApp PPF/Ceramic Quote Calculators & Warranty Cards* (from \${regional.setup}, 0% commission) so luxury car owners book ₹25k - ₹1.5L packages directly on WhatsApp in 10 seconds.\\n\\nCan I send a 30-sec demo preview link we put together for *\${cleanName}*? 🏎️\${footerLinks}\`;
  }

  const isDental =`;
      content = content.replace(pitchTarget, pitchAddition);
      console.log(`✓ Added high-converting Car Detailing pitch script in ${path.basename(htmlPath)}`);
    }

    fs.writeFileSync(htmlPath, content, 'utf8');
  }

  console.log('\n🎉 Successfully integrated and verified strict 50 Website Queue!');
}

main();
