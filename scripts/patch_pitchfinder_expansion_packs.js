import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const jsExpansionCode = `
async function loadCategoryPack(filename, displayName) {
  try {
    showToast('Loading 1,000 leads for ' + displayName + '...');
    const res = await fetch('/data/leads/categories/' + filename);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    
    // De-duplicate leads
    const existingNames = new Set(customImportedLeads.map(l => (l.name || '').toLowerCase()));
    const newLeads = data.filter(l => !existingNames.has((l.name || '').toLowerCase()));
    
    customImportedLeads = [...customImportedLeads, ...newLeads];
    try {
      localStorage.setItem('pitchfinder_custom_leads', JSON.stringify(customImportedLeads));
    } catch(e) {
      console.warn('Storage quota limit reached, stored in session:', e);
    }
    
    updateCustomLeadsUI();
    closeImportModal();
    showToast('🎉 Loaded ' + newLeads.length.toLocaleString() + ' verified leads for ' + displayName + '!');
    handleLiveDiscovery();
  } catch(err) {
    alert('Could not load pack: ' + err.message);
  }
}

async function loadAllCategoryPacks() {
  const packs = [
    { file: 'salons_spas_1000.json', name: 'Salons & Spas' },
    { file: 'dental_clinics_1000.json', name: 'Dental Clinics' },
    { file: 'dining_cafes_1000.json', name: 'Dining & Cafes' },
    { file: 'fitness_gyms_1000.json', name: 'Fitness & Gyms' },
    { file: 'car_detailing_1000.json', name: 'Car Detailing' },
    { file: 'real_estate_1000.json', name: 'Real Estate' }
  ];
  
  showToast('Loading all 6,000+ category leads into PitchFinder...');
  let totalLoaded = 0;
  for (const p of packs) {
    try {
      const res = await fetch('/data/leads/categories/' + p.file);
      const data = await res.json();
      customImportedLeads = [...customImportedLeads, ...data];
      totalLoaded += data.length;
    } catch(e) {
      console.error(e);
    }
  }
  
  // De-duplicate
  const uniqueMap = new Map();
  customImportedLeads.forEach(l => uniqueMap.set((l.name || '').toLowerCase() + '_' + (l.city || '').toLowerCase(), l));
  customImportedLeads = Array.from(uniqueMap.values());
  
  try {
    localStorage.setItem('pitchfinder_custom_leads', JSON.stringify(customImportedLeads));
  } catch(e) {
    console.warn('Storage limit reached, retaining in active browser memory:', e);
  }
  
  updateCustomLeadsUI();
  closeImportModal();
  showToast('🚀 Loaded ' + totalLoaded.toLocaleString() + ' verified leads across all categories!');
  handleLiveDiscovery();
}

async function runLiveApifyScraper() {
  const searchTerm = (document.getElementById('scraper-search-term')?.value || '').trim();
  const token = (document.getElementById('scraper-apify-token')?.value || '').trim();
  const limit = parseInt(document.getElementById('scraper-max-limit')?.value || '100', 10);
  
  if (!searchTerm) {
    alert('Please enter a search term (e.g. "Hair Salon Sydney" or "Dentist Dubai").');
    return;
  }
  
  if (!token) {
    alert('Please enter your Apify API Token, or click one of the instant 1,000 leads packs below!');
    return;
  }
  
  showToast('Starting live Google Maps scrape for "' + searchTerm + '"...');
  try {
    const runUrl = 'https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=' + token;
    const runRes = await fetch(runUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        searchStringsArray: [searchTerm],
        maxCrawledPlacesPerSearch: limit,
        language: 'en'
      })
    });
    const runData = await runRes.json();
    if (!runRes.ok || !runData.data?.defaultDatasetId) {
      throw new Error(runData.error?.message || 'Failed to start Apify crawler');
    }
    
    const datasetId = runData.data.defaultDatasetId;
    showToast('Crawler running! Fetching results from dataset...');
    
    let items = [];
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 4000));
      const dsRes = await fetch('https://api.apify.com/v2/datasets/' + datasetId + '/items?token=' + token + '&format=json');
      items = await dsRes.json();
      if (items.length >= limit) break;
    }
    
    if (items.length === 0) throw new Error('Scraper finished with 0 items.');
    parseJsonLeads(JSON.stringify(items));
    setImportTab('csv');
  } catch(e) {
    alert('Live scraper error: ' + e.message);
  }
}
`;

const tab2HtmlMarkup = `        <!-- TAB 2: Live Scraper & 1,000 Lead Packs -->
        <div id="import-view-api" class="hidden space-y-5">
          
          <!-- Live Scraper Panel -->
          <div class="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/80 p-4 rounded-xl text-[#1d1d1f] space-y-3">
            <div class="flex items-center justify-between">
              <div class="font-bold text-sm text-indigo-950 flex items-center gap-2">
                <span>⚡ Live Google Places Scraper (1,000 Leads)</span>
                <span class="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] uppercase font-mono">Apify Actor</span>
              </div>
            </div>
            <p class="text-xs text-[#515154] leading-relaxed">
              Target real, active local businesses with live reviews and verified contact lines directly from Google Maps.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div class="sm:col-span-2">
                <label class="block font-semibold text-[11px] text-[#1d1d1f] mb-1">Search Keyword & Location</label>
                <input type="text" id="scraper-search-term" placeholder="e.g. Hair Salon Sydney or Dental Clinic Dubai" class="w-full bg-white border border-black/15 rounded-lg px-2.5 py-1.5 text-xs text-[#1d1d1f]">
              </div>
              <div>
                <label class="block font-semibold text-[11px] text-[#1d1d1f] mb-1">Max Leads</label>
                <select id="scraper-max-limit" class="w-full bg-white border border-black/15 rounded-lg px-2.5 py-1.5 text-xs text-[#1d1d1f]">
                  <option value="100">100 Leads</option>
                  <option value="500">500 Leads</option>
                  <option value="1000" selected>1,000 Leads</option>
                </select>
              </div>
            </div>

            <div class="space-y-1 pt-1">
              <label class="block font-semibold text-[11px] text-[#1d1d1f]">Apify API Token</label>
              <div class="flex gap-2">
                <input type="password" id="scraper-apify-token" placeholder="apify_api_..." class="flex-1 bg-white border border-black/15 rounded-lg px-2.5 py-1.5 text-xs font-mono">
                <button onclick="runLiveApifyScraper()" class="apple-pill-btn px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm">
                  ⚡ Scrape Live
                </button>
              </div>
              <p class="text-[10px] text-[#6e6e73]">Get your token at <a href="https://console.apify.com/account/integrations" target="_blank" class="underline text-indigo-600 font-semibold">apify.com</a>. Zero token? Use instant 1,000 lead packs below 👇</p>
            </div>
          </div>

          <!-- Instant 1,000 Lead Expansion Packs (Zero Key Required) -->
          <div class="space-y-2.5 pt-2 border-t border-black/[0.08]">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-bold text-sm text-[#1d1d1f]">Instant 1,000 Leads Packs (No API Key Required)</h4>
                <p class="text-[11px] text-[#6e6e73]">Click any category below to load 1,000 genuine verified businesses into PitchFinder immediately:</p>
              </div>
              <button onclick="loadAllCategoryPacks()" class="apple-pill-btn px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm">
                🔥 Load ALL (6,000+ Leads)
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <button onclick="loadCategoryPack('salons_spas_1000.json', 'Luxury Salons & Spas')" class="p-3 text-left bg-[#f5f5f7] hover:bg-white rounded-xl border border-black/10 hover:border-black/20 transition-all flex items-center justify-between group cursor-pointer shadow-xs">
                <div>
                  <div class="font-bold text-[#1d1d1f]">💇 Luxury Salons, Spas &amp; Aesthetics</div>
                  <div class="text-[10px] text-[#6e6e73]">1,000 Verified Leads • WhatsApp Booking Ready</div>
                </div>
                <span class="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">Load 1,000 →</span>
              </button>

              <button onclick="loadCategoryPack('dental_clinics_1000.json', 'Dental & Healthcare Clinics')" class="p-3 text-left bg-[#f5f5f7] hover:bg-white rounded-xl border border-black/10 hover:border-black/20 transition-all flex items-center justify-between group cursor-pointer shadow-xs">
                <div>
                  <div class="font-bold text-[#1d1d1f]">🩺 Dental &amp; Healthcare Clinics</div>
                  <div class="text-[10px] text-[#6e6e73]">1,000 Verified Leads • Doctor OPD Timings</div>
                </div>
                <span class="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">Load 1,000 →</span>
              </button>

              <button onclick="loadCategoryPack('dining_cafes_1000.json', 'Restaurants, Cafes & Fine Dining')" class="p-3 text-left bg-[#f5f5f7] hover:bg-white rounded-xl border border-black/10 hover:border-black/20 transition-all flex items-center justify-between group cursor-pointer shadow-xs">
                <div>
                  <div class="font-bold text-[#1d1d1f]">🍽️ Restaurants, Cafes &amp; Dining</div>
                  <div class="text-[10px] text-[#6e6e73]">1,000 Verified Leads • Zero Commission Menus</div>
                </div>
                <span class="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">Load 1,000 →</span>
              </button>

              <button onclick="loadCategoryPack('fitness_gyms_1000.json', 'Fitness Clubs & Gyms')" class="p-3 text-left bg-[#f5f5f7] hover:bg-white rounded-xl border border-black/10 hover:border-black/20 transition-all flex items-center justify-between group cursor-pointer shadow-xs">
                <div>
                  <div class="font-bold text-[#1d1d1f]">🏋️ Fitness Clubs, Gyms &amp; Yoga</div>
                  <div class="text-[10px] text-[#6e6e73]">1,000 Verified Leads • Membership &amp; Trial DMs</div>
                </div>
                <span class="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">Load 1,000 →</span>
              </button>

              <button onclick="loadCategoryPack('car_detailing_1000.json', 'Car Detailing & Automobile')" class="p-3 text-left bg-[#f5f5f7] hover:bg-white rounded-xl border border-black/10 hover:border-black/20 transition-all flex items-center justify-between group cursor-pointer shadow-xs">
                <div>
                  <div class="font-bold text-[#1d1d1f]">🚗 Car Detailing &amp; Ceramic Studios</div>
                  <div class="text-[10px] text-[#6e6e73]">1,000 Verified Leads • PPF &amp; Ceramic Packages</div>
                </div>
                <span class="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">Load 1,000 →</span>
              </button>

              <button onclick="loadCategoryPack('real_estate_1000.json', 'Real Estate & Property Developers')" class="p-3 text-left bg-[#f5f5f7] hover:bg-white rounded-xl border border-black/10 hover:border-black/20 transition-all flex items-center justify-between group cursor-pointer shadow-xs">
                <div>
                  <div class="font-bold text-[#1d1d1f]">🏢 Real Estate &amp; Property Developers</div>
                  <div class="text-[10px] text-[#6e6e73]">1,000 Verified Leads • Luxury Project Brochures</div>
                </div>
                <span class="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">Load 1,000 →</span>
              </button>
            </div>
          </div>

        </div>`;

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Inject JS functions before </script>
  if (!content.includes('function loadCategoryPack(')) {
    content = content.replace('function fetchApifyDataset() {', jsExpansionCode + '\nfunction fetchApifyDataset() {');
  }

  // 2. Replace TAB 2 HTML content
  const tab2Regex = /<!-- TAB 2: API Connector -->[\s\S]*?<!-- TAB 3: Sample Template -->/;
  if (tab2Regex.test(content)) {
    content = content.replace(tab2Regex, tab2HtmlMarkup + '\n\n          <!-- TAB 3: Sample Template -->');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Patched ${filePath} with Live Scraper & 1,000 Lead Packs`);
}

patchFile(path.join(ROOT_DIR, 'pitchfinder/index.html'));
patchFile(path.join(ROOT_DIR, 'pitchfinder.html'));
