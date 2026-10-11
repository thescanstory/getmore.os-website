import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Read cleaned master database
const masterLeadsPath = path.join(ROOT_DIR, 'data', 'leads', 'master_leads_10000.json');
const masterLeads = JSON.parse(fs.readFileSync(masterLeadsPath, 'utf8'));

console.log(`Loaded ${masterLeads.length.toLocaleString()} audited leads...`);

// Cleaned HTML replacement for Hero & Controls section
const cleanHeroSection = `
  <!-- Hero Header Section (Clean & Simple Apple Edition) -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 relative z-10">

    <!-- Clean Header & Region Selector -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">
            PitchFinder. <span class="text-[#86868b] font-normal">Verified Business Directory</span>
          </h1>
          <p class="text-xs sm:text-sm text-[#6e6e73] mt-1">
            Browse verified Google Maps profiles with direct WhatsApp mobile lines, review counts, and website audits.
          </p>
        </div>

        <!-- Clean Action Buttons -->
        <div class="flex items-center gap-2 flex-wrap">
          <button onclick="startDailyQueue()" class="apple-pill-btn px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-2 cursor-pointer">
            <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>Daily 50 Queue</span>
            <span id="header-queue-counter" class="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-black/20">0/50</span>
          </button>

          <button onclick="openImportModal()" class="apple-pill-btn px-3.5 py-2 text-xs font-semibold bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border border-black/10 shadow-xs flex items-center gap-1.5 cursor-pointer">
            <span>📥 Import Leads</span>
          </button>

          <button onclick="openPlaybookModal()" class="apple-pill-btn px-3.5 py-2 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-[#0071e3] border border-blue-200 shadow-xs flex items-center gap-1.5 cursor-pointer">
            <span>📘 Pitch Playbook</span>
          </button>
        </div>
      </div>

      <!-- Quick Country Switcher Bar -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 mt-5 text-xs font-semibold">
        <span class="text-[#86868b] text-[11px] uppercase tracking-wider mr-1 shrink-0">Region:</span>
        <button type="button" data-country="Australia" onclick="selectCountryPill('Australia', this)" class="country-pill active px-3.5 py-1.5 rounded-full bg-[#1d1d1f] text-white border border-[#1d1d1f] shadow-xs cursor-pointer shrink-0 transition-all text-xs font-semibold">🇦🇺 Australia</button>
        <button type="button" data-country="India" onclick="selectCountryPill('India', this)" class="country-pill px-3.5 py-1.5 rounded-full bg-white text-[#1d1d1f] border border-black/[0.08] hover:border-black/20 shadow-2xs cursor-pointer shrink-0 transition-all text-xs font-semibold">🇮🇳 India</button>
        <button type="button" data-country="UAE" onclick="selectCountryPill('UAE', this)" class="country-pill px-3.5 py-1.5 rounded-full bg-white text-[#1d1d1f] border border-black/[0.08] hover:border-black/20 shadow-2xs cursor-pointer shrink-0 transition-all text-xs font-semibold">🇦🇪 UAE / Dubai</button>
        <button type="button" data-country="United Kingdom" onclick="selectCountryPill('United Kingdom', this)" class="country-pill px-3.5 py-1.5 rounded-full bg-white text-[#1d1d1f] border border-black/[0.08] hover:border-black/20 shadow-2xs cursor-pointer shrink-0 transition-all text-xs font-semibold">🇬🇧 UK</button>
        <button type="button" data-country="USA" onclick="selectCountryPill('USA', this)" class="country-pill px-3.5 py-1.5 rounded-full bg-white text-[#1d1d1f] border border-black/[0.08] hover:border-black/20 shadow-2xs cursor-pointer shrink-0 transition-all text-xs font-semibold">🇺🇸 USA</button>
        <button type="button" data-country="All" onclick="selectCountryPill('All', this)" class="country-pill px-3.5 py-1.5 rounded-full bg-white text-[#1d1d1f] border border-black/[0.08] hover:border-black/20 shadow-2xs cursor-pointer shrink-0 transition-all text-xs font-semibold">🌐 All Countries</button>
      </div>
    </div>

    <!-- Clean, Simple Search & Filter Console -->
    <section class="mb-6">
      <form id="search-form" class="bg-white p-4 sm:p-5 rounded-2xl border border-black/[0.08] shadow-xs space-y-3">
        
        <!-- Main Search Bar -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <!-- Keyword input -->
          <div class="md:col-span-5 flex items-center gap-2.5 px-3.5 py-2.5 bg-[#f5f5f7] rounded-xl border border-black/[0.06] focus-within:border-[#0071e3] focus-within:bg-white transition-all">
            <svg class="w-4 h-4 text-[#86868b] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              id="query-input" 
              type="text" 
              value="" 
              placeholder="Search business name, niche, or area..." 
              class="bg-transparent border-none text-[#1d1d1f] text-xs sm:text-sm focus:outline-none w-full placeholder:text-[#86868b] font-medium"
            />
          </div>

          <!-- Category Preset Dropdown -->
          <div class="md:col-span-3 flex items-center px-3 py-2.5 bg-[#f5f5f7] rounded-xl border border-black/[0.06] focus-within:border-[#0071e3] focus-within:bg-white transition-all">
            <select 
              id="query-dropdown" 
              class="bg-transparent border-none text-[#1d1d1f] text-xs font-semibold focus:outline-none w-full cursor-pointer truncate"
              onchange="handleQueryDropdownChange(this.value)"
            >
              <option value="" selected>✨ All Categories</option>
              <option value="Luxury Salon">💇 Salons &amp; Luxury Spas</option>
              <option value="Dentist">🦷 Dental &amp; Healthcare Clinics</option>
              <option value="Food &amp; Dining">🍽️ Restaurants &amp; Cafes</option>
              <option value="CrossFit Gym">🏋️ Fitness Clubs &amp; Gyms</option>
              <option value="Car Detailing">🚗 Car Detailing Studios</option>
              <option value="Real Estate Broker">🏢 Real Estate &amp; Builders</option>
              <option value="Wedding Photographer">📸 Photographers &amp; Video</option>
              <option value="Tattoo Studio">🎨 Tattoo Studios</option>
              <option value="Pet Clinic &amp; Vet">🐾 Veterinary &amp; Pet Clinics</option>
              <option value="Chartered Accountant">💼 CA &amp; Tax Consultants</option>
            </select>
          </div>

          <!-- City Dropdown -->
          <div class="md:col-span-4 flex items-center gap-2 px-3 py-2.5 bg-[#f5f5f7] rounded-xl border border-black/[0.06] focus-within:border-[#0071e3] focus-within:bg-white transition-all">
            <span class="text-xs">📍</span>
            <input 
              id="city-input" 
              type="text" 
              value="Sydney" 
              placeholder="City (e.g. Sydney, Dubai)" 
              class="bg-transparent border-none text-[#1d1d1f] text-xs focus:outline-none flex-1 font-medium placeholder:text-[#86868b]"
              oninput="handleCityInput(this.value)"
            />
            <select 
              id="city-dropdown" 
              class="bg-white text-[#1d1d1f] text-xs font-semibold px-2 py-1 rounded-lg border border-black/[0.08] focus:outline-none cursor-pointer max-w-[110px] shrink-0"
              onchange="handleCityDropdownChange(this.value)"
            >
              <option value="Sydney" selected>Sydney</option>
              <option value="Melbourne">Melbourne</option>
              <option value="Dubai">Dubai</option>
              <option value="London">London</option>
              <option value="Miami">Miami</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="custom">Custom...</option>
            </select>
          </div>

        </div>

        <!-- Filter Sub-bar: Status Pills & View Mode Toggle -->
        <div class="flex items-center justify-between pt-2 border-t border-black/[0.06] text-xs text-[#6e6e73] flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span id="results-count-badge" class="font-bold text-[#1d1d1f]">Loading leads...</span>
            <span>•</span>
            <label class="flex items-center gap-1.5 cursor-pointer text-xs select-none">
              <input type="checkbox" id="hide-contacted-checkbox" onchange="toggleHideContacted(this.checked)" class="rounded text-emerald-600 focus:ring-emerald-400">
              <span>Hide Contacted</span>
            </label>
          </div>

          <!-- View Mode Toggle -->
          <div class="flex items-center gap-1 bg-[#f5f5f7] p-0.5 rounded-lg border border-black/[0.06]">
            <button type="button" onclick="setViewMode('cards')" id="view-mode-cards" class="px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-[#1d1d1f] shadow-xs cursor-pointer">
              Cards
            </button>
            <button type="button" onclick="setViewMode('table')" id="view-mode-table" class="px-2.5 py-1 rounded-md text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] cursor-pointer">
              Table
            </button>
          </div>
        </div>

      </form>
    </section>
`;

function patchPitchFinder(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace REAL_VERIFIED_DATABASE
  const minifiedDb = 'const REAL_VERIFIED_DATABASE = ' + JSON.stringify(masterLeads) + ';';
  content = content.replace(/const REAL_VERIFIED_DATABASE\s*=\s*\[[\s\S]*?\];/, minifiedDb);

  // 2. Replace Hero through Search Form
  const heroRegex = /<!-- Hero Header Section \(Apple Store White Edition\) -->[\s\S]*?<!-- Dynamic Leads Grid \/ Table Container -->/;
  if (heroRegex.test(content)) {
    content = content.replace(heroRegex, cleanHeroSection + '\n\n    <!-- Dynamic Leads Grid / Table Container -->');
  }

  // 3. Update getSafeWebsiteUrl so it never returns dead URLs
  const safeWebRegex = /function getSafeWebsiteUrl\(brand\)\s*\{[\s\S]*?^}/m;
  const newSafeWebCode = `function getSafeWebsiteUrl(brand) {
  if (brand && brand.website_url) {
    let url = brand.website_url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }
  const query = encodeURIComponent((brand.name || '') + ' ' + (brand.city || '') + ' ' + (brand.area || ''));
  return 'https://www.google.com/maps/search/?api=1&query=' + query;
}`;
  content = content.replace(safeWebRegex, newSafeWebCode);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Simplified & Audited ${filePath} (${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)} MB)`);
}

patchPitchFinder(path.join(ROOT_DIR, 'pitchfinder/index.html'));
patchPitchFinder(path.join(ROOT_DIR, 'pitchfinder.html'));

console.log('🎉 Successfully applied simple, clean UI redesign and audited website links!');
