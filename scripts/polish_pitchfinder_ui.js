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

function refinePitchfinder(html) {
  // 1. Clean up Navbar Header Right side
  const navRightRegex = /<!-- Right: Status Pill, Daily 50 Queue, What to Pitch & Upgrade CTA -->[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/header>)/;
  const cleanNavRight = `<!-- Right: Status Pill, Daily 50 Queue, What to Pitch & Upgrade CTA -->
      <div class="flex items-center gap-2 sm:gap-2.5">
        <!-- LinkedIn Link -->
        <a href="https://www.linkedin.com/company/getmoreos/" target="_blank" rel="noopener noreferrer" class="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 text-[#0a66c2] text-xs font-semibold border border-[#0a66c2]/30 transition-all">
          <svg class="w-3.5 h-3.5 fill-[#0a66c2]" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          <span>LinkedIn</span>
        </a>

        <!-- Master Daily 50 Focus Queue Pill -->
        <button onclick="startDailyQueue('detailing')" class="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer" title="Launch Today's Focus Queue (50 Leads)">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>⚡ Daily 50 Queue</span>
          <span id="header-queue-counter" class="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded-full font-mono">0/50</span>
        </button>

        <!-- Import Leads Modal -->
        <button onclick="openImportModal()" class="hidden sm:flex px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-[#1d1d1f] border border-black/[0.08] text-xs font-semibold items-center gap-1.5 transition-all shadow-2xs cursor-pointer">
          <svg class="w-3.5 h-3.5 text-[#0071e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <span>Import Leads</span>
        </button>

        <!-- What to Pitch Playbook -->
        <button onclick="openPlaybookModal()" class="hidden md:flex px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0071e3] border border-blue-200 text-xs font-bold items-center gap-1.5 transition-all shadow-2xs cursor-pointer">
          <span>📘 Sales Playbook</span>
        </button>

        <!-- CTA Pricing -->
        <a href="index.html#pricing" class="apple-pill-dark px-4 py-1.5 text-xs font-semibold shrink-0">
          <span>Setup ₹9,999</span>
        </a>`;

  if (navRightRegex.test(html)) {
    html = html.replace(navRightRegex, cleanNavRight);
  }

  // 2. Remove the duplicated "What We Offer" pills row from the Hero section (lines 311-332)
  const heroOfferPillsRegex = /<!-- What We Offer: 5 Core Deliverables -->[\s\S]*?<\/div>\s*<\/div>\s*<!-- Quick Action Guide Button -->[\s\S]*?<\/div>\s*<\/div>/;
  const cleanHeroEnd = `</div>
      <div class="shrink-0 flex items-center gap-2">
        <button onclick="openPlaybookModal()" class="apple-pill-btn px-4 py-2 text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer">
          <span>📘 What Can We Pitch?</span>
        </button>
      </div>
    </div>`;

  if (heroOfferPillsRegex.test(html)) {
    html = html.replace(heroOfferPillsRegex, cleanHeroEnd);
  }

  // 3. Clean up and refine the Daily 50 Outreach Hub Bar
  const hubBarRegex = /<!-- ⚡ Daily 50 WhatsApp Outreach Hub Bar -->[\s\S]*?<\/section>/;
  const cleanHubBar = `<!-- ⚡ Daily 50 WhatsApp Outreach Hub Bar -->
    <section class="mb-8 p-4 sm:p-5 rounded-apple bg-gradient-to-r from-emerald-50/70 via-white to-purple-50/60 border border-emerald-200/70 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      
      <!-- Left: Title & Subtitle -->
      <div class="flex items-center gap-3 shrink-0">
        <div class="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
          ⚡
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="font-bold text-sm sm:text-base text-[#1d1d1f]">Daily 50 Outreach Hub</h3>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wide">1-Key Quick-Fire</span>
          </div>
          <p class="text-xs text-[#6e6e73]">
            Personalized 1-click WhatsApp outreach. Spacebar opens chat and advances to next lead.
          </p>
        </div>
      </div>

      <!-- Center & Right: Segmented Queue Selector, Progress & CTA -->
      <div class="flex flex-wrap items-center gap-3 justify-between lg:justify-end">
        
        <!-- Segmented Focus Selector -->
        <div class="flex items-center bg-black/[0.04] p-1 rounded-full border border-black/[0.06] text-xs font-semibold">
          <button onclick="startDailyQueue('detailing')" class="px-3 py-1.5 rounded-full bg-white text-[#af52de] font-bold shadow-2xs border border-purple-200/60 flex items-center gap-1.5 transition-all cursor-pointer" title="Verified Car Detailing & PPF Studios">
            <span>🏎️ Detailing</span>
            <span class="text-[10px] px-1.5 py-0.2 bg-[#af52de] text-white rounded-full font-mono">50</span>
          </button>
          <button onclick="startDailyQueue('dental')" class="px-3 py-1.5 rounded-full text-[#6e6e73] hover:text-[#0071e3] hover:bg-white/60 flex items-center gap-1.5 transition-all cursor-pointer" title="Verified Dental Clinics">
            <span>🦷 Dental</span>
            <span class="text-[10px] px-1.5 py-0.2 bg-[#0071e3] text-white rounded-full font-mono">50</span>
          </button>
          <button onclick="startDailyQueue('all')" class="px-3 py-1.5 rounded-full text-[#6e6e73] hover:text-emerald-700 hover:bg-white/60 flex items-center gap-1.5 transition-all cursor-pointer" title="Mixed High Opportunity Leads">
            <span>⚡ All Mix</span>
            <span class="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded-full font-mono">50</span>
          </button>
        </div>

        <!-- Progress Counter -->
        <div class="flex items-center gap-2">
          <div class="flex flex-col items-end">
            <span id="hub-progress-text" class="text-xs font-bold font-mono text-emerald-700">0 / 50 sent</span>
            <div class="w-24 h-1.5 bg-black/[0.08] rounded-full overflow-hidden mt-1">
              <div id="hub-progress-bar" class="h-full bg-[#25D366] rounded-full transition-all duration-300" style="width: 0%;"></div>
            </div>
          </div>
        </div>

        <!-- Launch Button -->
        <button onclick="startDailyQueue('detailing')" class="apple-pill-btn px-4 py-2 text-xs font-bold flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm shrink-0 cursor-pointer">
          <svg class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Launch 50 Queue</span>
          <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">Space ␣</span>
        </button>

        <!-- Hide Contacted Checkbox -->
        <label class="flex items-center gap-1.5 text-xs text-[#6e6e73] hover:text-[#1d1d1f] cursor-pointer select-none px-2.5 py-1.5 rounded-lg bg-white/80 border border-black/[0.06]">
          <input type="checkbox" id="hide-contacted-checkbox" onchange="toggleHideContacted(this.checked)" class="rounded text-[#25D366] focus:ring-emerald-400 cursor-pointer">
          <span class="font-medium text-[11px]">Hide Contacted</span>
        </label>
      </div>
    </section>`;

  if (hubBarRegex.test(html)) {
    html = html.replace(hubBarRegex, cleanHubBar);
  }

  // 4. Consolidate search and remove stacked duplicate bars
  // Find from <!-- Unified Apple Search Console (Single Master Search) --> down to <!-- Discovered Leads Container -->
  const searchConsoleSectionRegex = /<!-- Unified Apple Search Console \(Single Master Search\) -->[\s\S]*?(?=<div id="results-container">)/;
  
  const cleanSearchConsole = `<!-- Unified Apple Search Console & Filter Command Center -->
    <section class="mb-6 bg-white p-4 sm:p-5 rounded-apple border border-black/[0.08] shadow-sm space-y-3.5">
      
      <!-- Top Row: Main Search Inputs -->
      <form id="search-form" onsubmit="event.preventDefault(); applyLocalFilters();" class="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
        
        <!-- Live Instant Search Bar -->
        <div class="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-[#f5f5f7] rounded-apple-sm border border-black/[0.06] focus-within:border-[#0071e3] focus-within:bg-white transition-all shadow-inner">
          <svg class="w-4 h-4 text-[#0071e3] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            id="query-input" 
            type="text" 
            placeholder="Search business name, trade, area (e.g. Indiranagar, HSR), or keywords..." 
            oninput="handleInstantSearch(this.value)"
            class="bg-transparent border-none text-[#1d1d1f] text-xs sm:text-sm focus:outline-none w-full placeholder:text-[#86868b] font-medium"
          />
          <button 
            type="button" 
            onclick="clearInstantSearch()" 
            id="clear-search-btn"
            class="hidden text-xs text-[#86868b] hover:text-[#1d1d1f] font-bold px-2 py-0.5 rounded-full bg-black/5 hover:bg-black/10 transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        <!-- Category Dropdown -->
        <div class="sm:w-48 flex items-center gap-2 px-3 py-2.5 bg-[#f5f5f7] rounded-apple-sm border border-black/[0.06] focus-within:border-[#0071e3] focus-within:bg-white transition-all shrink-0">
          <span class="text-xs shrink-0">✨</span>
          <select 
            id="query-dropdown" 
            class="bg-transparent border-none text-[#1d1d1f] text-xs font-semibold focus:outline-none w-full cursor-pointer truncate"
            onchange="handleQueryDropdownChange(this.value)"
            title="Filter by Category"
          >
            <option value="" selected>✨ All Categories</option>
            <option value="Food & Dining">🍽️ Food &amp; Dining</option>
            <option value="Luxury Salon">💇 Salons &amp; Spa</option>
            <option value="Dentist">🦷 Dental Clinics</option>
            <option value="CrossFit Gym">🏋️ Fitness &amp; Gyms</option>
            <option value="Car Detailing">🚗 Car Detailing</option>
            <option value="Real Estate Broker">🏢 Real Estate</option>
            <option value="Wedding Photographer">📸 Photographers</option>
            <option value="Tattoo Studio">🎨 Tattoo Studios</option>
            <option value="Pet Clinic & Vet">🐾 Pet Care &amp; Vets</option>
            <option value="Chartered Accountant">💼 CA &amp; Tax</option>
            <option value="Solar Panels">⚡ Solar Energy</option>
          </select>
        </div>

        <!-- Country Dropdown -->
        <div class="sm:w-40 flex items-center gap-2 px-3 py-2.5 bg-[#f5f5f7] rounded-apple-sm border border-black/[0.06] focus-within:border-[#0071e3] focus-within:bg-white transition-all shrink-0">
          <span class="text-xs shrink-0">🌍</span>
          <select 
            id="country-select" 
            class="bg-transparent border-none text-[#1d1d1f] text-xs font-semibold focus:outline-none w-full cursor-pointer"
            onchange="handleCountryChange(this.value)"
            title="Select Target Country"
          >
            <option value="India" selected>🇮🇳 India</option>
            <option value="Australia">🇦🇺 Australia</option>
            <option value="USA">🇺🇸 United States</option>
            <option value="Canada">🇨🇦 Canada</option>
            <option value="UAE">🇦🇪 UAE / Dubai</option>
            <option value="United Kingdom">🇬🇧 United Kingdom</option>
            <option value="All">🌐 All Countries</option>
          </select>
        </div>

        <!-- City Dropdown -->
        <div class="sm:w-40 flex items-center gap-2 px-3 py-2.5 bg-[#f5f5f7] rounded-apple-sm border border-black/[0.06] focus-within:border-[#0071e3] focus-within:bg-white transition-all shrink-0">
          <svg class="w-3.5 h-3.5 text-[#0071e3] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <input id="city-input" type="hidden" value="Bangalore" />
          <select 
            id="city-dropdown" 
            class="bg-transparent border-none text-[#1d1d1f] text-xs font-semibold focus:outline-none w-full cursor-pointer truncate"
            onchange="handleCityDropdownChange(this.value)"
            title="Select Target City"
          >
            <option value="Bangalore" selected>Bangalore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Pune">Pune</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Goa">Goa</option>
            <option value="Jaipur">Jaipur</option>
            <option value="All India Cities">All India Cities</option>
            <option value="custom">✏️ Custom City...</option>
          </select>
        </div>

        <!-- Sort By Dropdown -->
        <div class="sm:w-44 flex items-center gap-1.5 px-3 py-2.5 bg-[#f5f5f7] rounded-apple-sm border border-black/[0.06] text-xs font-semibold text-[#1d1d1f] shrink-0">
          <span class="text-[#0071e3] font-bold text-xs">⇅</span>
          <select id="main-sort-select" class="bg-transparent border-none text-[#1d1d1f] text-xs font-semibold focus:outline-none w-full cursor-pointer truncate" onchange="handleSortChange(this.value)">
            <option value="opportunity">Opportunity Score</option>
            <option value="reviews_desc">Most Reviews</option>
            <option value="reviews_asc">Least Reviews</option>
            <option value="rating_desc">Highest Rating</option>
            <option value="rating_asc">Lowest Rating</option>
          </select>
        </div>
      </form>

      <!-- Bottom Row: Pitch Strategy Filters, View Switcher & Export -->
      <div class="pt-2 border-t border-black/[0.05] flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <!-- Pitch Strategy Chips -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span class="text-[#86868b] text-[11px] uppercase font-bold tracking-wider shrink-0 mr-1">Pitch:</span>
          <select id="filter-pitch" class="px-2.5 py-1 rounded-full bg-[#f5f5f7] border border-black/[0.06] text-xs text-[#1d1d1f] font-semibold focus:outline-none cursor-pointer" onchange="applyLocalFilters()">
            <option value="all">🎯 All Pitch Angles</option>
            <option value="reels">🎬 Influencer Reels</option>
            <option value="website">🌐 Missing Website</option>
            <option value="seo">📈 SEO &amp; Maps Rank</option>
            <option value="whatsapp">💬 WhatsApp 0% Comm.</option>
            <option value="app">📱 Direct Booking PWA</option>
            <option value="ads">🎯 Local Meta Ads</option>
            <option value="gmb">⭐ 5-Star Reviews</option>
          </select>

          <!-- Hidden category fallback -->
          <select id="filter-category" class="hidden" onchange="applyLocalFilters()"><option value="All">All Categories</option></select>

          <span id="badge-count-pill" class="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0071e3] border border-blue-200 font-bold text-[11px] shrink-0">
            <span id="badge-count">613</span> Verified Leads
          </span>
        </div>

        <!-- View Mode Switcher & Export Button -->
        <div class="flex items-center gap-2 shrink-0">
          <div class="flex items-center bg-[#f5f5f7] border border-black/[0.06] rounded-xl p-0.5">
            <button id="view-table-btn" class="px-3 py-1 rounded-lg text-xs font-semibold bg-white text-[#1d1d1f] shadow-2xs transition-all flex items-center gap-1 cursor-pointer" onclick="setViewMode('table')" title="Data Table View">
              <svg class="w-3.5 h-3.5 text-[#0071e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M3 10h18M3 14h18M3 6h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2z"></path></svg>
              <span class="font-bold">Table</span>
            </button>
            <button id="view-list-btn" class="px-3 py-1 rounded-lg text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition-all flex items-center gap-1 cursor-pointer" onclick="setViewMode('list')" title="List View">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" stroke-width="2"></line><line x1="3" y1="12" x2="21" y2="12" stroke-width="2"></line><line x1="3" y1="18" x2="21" y2="18" stroke-width="2"></line></svg>
              <span>List</span>
            </button>
            <button id="view-cards-btn" class="px-3 py-1 rounded-lg text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition-all flex items-center gap-1 cursor-pointer" onclick="setViewMode('cards')" title="Grid View">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>Grid</span>
            </button>
            <button id="view-contacts-btn" class="px-3 py-1 rounded-lg text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition-all flex items-center gap-1 cursor-pointer" onclick="setViewMode('contacts')" title="Contacts Only (Names, Phones, Emails)">
              <svg class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
              <span class="text-purple-700 font-bold">Contacts</span>
            </button>
          </div>

          <button onclick="exportCSV()" class="apple-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5 text-[#0071e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </section>

    `;

  if (searchConsoleSectionRegex.test(html)) {
    html = html.replace(searchConsoleSectionRegex, cleanSearchConsole);
    console.log('✓ Consolidated Search Console and eliminated redundant stacked bars');
  }

  return html;
}

function main() {
  console.log('--- REFINING ALIGNMENT & DESIGN OF PITCHFINDER DASHBOARD ---');

  for (const filePath of HTML_FILES) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = refinePitchfinder(content);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Cleaned and harmonized ${path.basename(filePath)}`);
  }

  console.log('\n🎉 Finished refining alignment!');
}

main();
