import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const filesToUpdate = [
  path.join(ROOT_DIR, 'pitchfinder/index.html'),
  path.join(ROOT_DIR, 'pitchfinder.html')
];

for (const filePath of filesToUpdate) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove the entire redundant Horizontal Category Carousel
  const carouselStart = '<!-- Apple Store Style Horizontal Category Carousel -->';
  const consoleStart = '<!-- Unified Apple Search Console (Single Master Search) -->';

  const cIdx1 = content.indexOf(carouselStart);
  const cIdx2 = content.indexOf(consoleStart);

  if (cIdx1 !== -1 && cIdx2 !== -1) {
    console.log(`Removing carousel in ${path.basename(filePath)} (${cIdx2 - cIdx1} bytes)`);
    content = content.slice(0, cIdx1) + content.slice(cIdx2);
  } else {
    console.warn(`Carousel markers not found in ${path.basename(filePath)}`);
  }

  // 2. Replace the search form with a single unified, clean Apple-grade filter bar
  const searchFormRegex = /<!-- Unified Apple Search Console \(Single Master Search\) -->[\s\S]*?<\/form>\s*<\/section>/;

  const unifiedSearchFormHTML = `<!-- Unified Apple Search Console (Single Master Search) -->
    <section class="mb-8">
      <form id="search-form" class="bg-[#ffffff] p-4 sm:p-5 rounded-apple border border-black/[0.08] shadow-sm space-y-3">
        
        <!-- Top Main Input Bar (Single Consolidated Filter Bar) -->
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
          
          <!-- Unified Keyword / Business Search Input -->
          <div class="flex-1 flex items-center gap-2.5 px-3.5 py-3 bg-[#f5f5f7] rounded-apple-sm border border-black/[0.06] focus-within:border-[#0071e3] focus-within:bg-white transition-all shadow-inner">
            <svg class="w-4 h-4 text-[#0071e3] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              id="query-input" 
              type="text" 
              value="" 
              placeholder="Search business name, trade, or keyword..." 
              class="bg-transparent border-none text-[#1d1d1f] text-xs sm:text-sm focus:outline-none w-full placeholder:text-[#86868b] font-medium"
            />
          </div>

          <!-- Single Category Selector Dropdown -->
          <div class="sm:w-52 flex items-center gap-2 px-3 py-3 bg-[#f5f5f7] rounded-apple-sm border border-black/[0.06] focus-within:border-[#0071e3] focus-within:bg-white transition-all shadow-inner shrink-0">
            <span class="text-sm shrink-0">✨</span>
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

          <!-- Country Selector Dropdown -->
          <div class="sm:w-44 flex items-center gap-2 px-3 py-3 bg-[#f5f5f7] rounded-apple-sm border border-black/[0.06] focus-within:border-[#0071e3] focus-within:bg-white transition-all shadow-inner shrink-0">
            <span class="text-sm shrink-0">🌍</span>
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

          <!-- Target City Dynamic Dropdown (Single Clean Selector) -->
          <div class="sm:w-44 flex items-center gap-2 px-3 py-3 bg-[#f5f5f7] rounded-apple-sm border border-black/[0.06] focus-within:border-[#0071e3] focus-within:bg-white transition-all shadow-inner shrink-0">
            <svg class="w-4 h-4 text-[#0071e3] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
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

          <!-- Sort Selector -->
          <div class="sm:w-44 flex items-center gap-1.5 px-3 py-3 bg-[#f5f5f7] rounded-apple-sm border border-black/[0.06] text-xs font-semibold text-[#1d1d1f] shrink-0">
            <span class="text-[#0071e3] font-bold">⇅</span>
            <select id="main-sort-select" class="bg-transparent border-none text-[#1d1d1f] text-xs font-semibold focus:outline-none w-full cursor-pointer truncate" onchange="handleSortChange(this.value)">
              <option value="opportunity">Sort: Opportunity Score</option>
              <option value="reviews_desc">Sort: Most Reviews</option>
              <option value="reviews_asc">Sort: Least Reviews</option>
              <option value="rating_desc">Sort: Highest Rating</option>
              <option value="rating_asc">Sort: Lowest Rating</option>
              <option value="pagespeed_asc">Sort: Slowest Speed</option>
              <option value="loss_desc">Sort: Highest Loss / ROI</option>
              <option value="name_asc">Sort: Name (A → Z)</option>
            </select>
          </div>

          <!-- Primary Discover Button -->
          <button 
            type="submit" 
            id="discover-btn"
            class="apple-pill-btn px-5 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            <span id="btn-text">Filter Leads</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
          </button>
        </div>

      </form>
    </section>`;

  if (searchFormRegex.test(content)) {
    console.log(`Replacing search-form in ${path.basename(filePath)}`);
    content = content.replace(searchFormRegex, unifiedSearchFormHTML);
  } else {
    console.warn(`Search form regex failed to match in ${path.basename(filePath)}`);
  }

  // 3. In the toolbar, hide the redundant #filter-category select so only 1 category filter exists
  content = content.replace(
    /<select id="filter-category"[\s\S]*?<\/select>/,
    '<select id="filter-category" class="hidden" onchange="applyLocalFilters()"><option value="All">All Categories</option></select>'
  );

  // 4. Update JavaScript functions: handleQueryDropdownChange, updateCityDropdown, handleCityDropdownChange, quickSelectCategory
  const jsPatches = `
// Single Unified Category Filter Handler
function handleQueryDropdownChange(val) {
  const catVal = (val === 'All' || !val) ? '' : val;
  const cityInput = document.getElementById('city-input');
  const city = (cityInput ? cityInput.value : '') || currentSelectedCity;
  const country = (document.getElementById('country-select') ? document.getElementById('country-select').value : '') || currentSelectedCountry;
  
  const queryInput = document.getElementById('query-input');
  if (queryInput) {
    queryInput.value = catVal;
  }
  
  const filterCat = document.getElementById('filter-category');
  if (filterCat) filterCat.value = val || 'All';
  
  executeDiscovery(catVal, city, country);
}

function quickSelectCategory(categoryName, el) {
  const qDropdown = document.getElementById('query-dropdown');
  if (qDropdown) qDropdown.value = (categoryName === 'All') ? '' : categoryName;
  handleQueryDropdownChange((categoryName === 'All') ? '' : categoryName);
}
`;

  // Inject handleQueryDropdownChange before handleCountryChange
  if (!content.includes('function handleQueryDropdownChange(')) {
    content = content.replace('function handleCountryChange(', jsPatches + '\nfunction handleCountryChange(');
  }

  // Update handleCityDropdownChange implementation
  const oldCityDropdownHandler = /function handleCityDropdownChange\(cityVal\) \{[\s\S]*?executeDiscovery\(query, \(cityVal\.startsWith\('All'\) \? '' : cityVal\), currentSelectedCountry\);\s*\}/;

  const newCityDropdownHandler = `function handleCityDropdownChange(cityVal) {
  const cityInput = document.getElementById('city-input');
  if (cityVal === 'custom') {
    const customCity = prompt('Enter city name (e.g. Pune, Gold Coast, Chicago):', '');
    if (customCity && customCity.trim()) {
      currentSelectedCity = customCity.trim();
      if (cityInput) cityInput.value = currentSelectedCity;
      const citySelect = document.getElementById('city-dropdown');
      if (citySelect) {
        const opt = new Option(currentSelectedCity, currentSelectedCity, true, true);
        citySelect.add(opt, citySelect.options[0]);
      }
    } else {
      return;
    }
  } else {
    currentSelectedCity = cityVal;
    if (cityInput) cityInput.value = cityVal.startsWith('All') ? '' : cityVal;
  }
  
  const queryInput = document.getElementById('query-input');
  const query = queryInput ? queryInput.value : '';
  executeDiscovery(query, (currentSelectedCity.startsWith('All') ? '' : currentSelectedCity), currentSelectedCountry);
}`;

  if (oldCityDropdownHandler.test(content)) {
    content = content.replace(oldCityDropdownHandler, newCityDropdownHandler);
    console.log(`Updated handleCityDropdownChange in ${path.basename(filePath)}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Saved ${path.basename(filePath)}`);
}

console.log('✅ Unify single filter completed successfully!');
