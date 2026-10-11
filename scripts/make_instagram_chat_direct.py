import os
import json
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
master_path = os.path.join(ROOT_DIR, 'data/leads/master_leads_10000.json')

with open(master_path, 'r', encoding='utf-8') as f:
    leads = json.load(f)

print(f"Total leads in master: {len(leads)}")

# Ensure Jumeirah Silk Salon & Day Spa has silkspadubai
updated_count = 0
for b in leads:
    name_lower = (b.get('name') or '').lower()
    if 'jumeirah silk' in name_lower or 'silk spa' in name_lower:
        b['instagram'] = 'silkspadubai'
        updated_count += 1
    elif 'salt kite' in name_lower:
        b['instagram'] = 'findsalt'
        updated_count += 1
    elif 'extra hour' in name_lower:
        b['instagram'] = 'extrahourspa'
        updated_count += 1
    elif 'camali clinic' in name_lower:
        b['instagram'] = 'camaliclinic'
        updated_count += 1
    elif '306 spa' in name_lower:
        b['instagram'] = '306spa'
        updated_count += 1
    elif 'rameshwaram' in name_lower:
        b['instagram'] = 'therameshwaramcafe'
        updated_count += 1
    elif 'toit brew' in name_lower:
        b['instagram'] = 'toitbeerco'
        updated_count += 1

print(f"✓ Specifically verified key handles, updated {updated_count} matches.")

with open(master_path, 'w', encoding='utf-8') as f:
    json.dump(leads, f, indent=2, ensure_ascii=False)

db_json = json.dumps(leads, ensure_ascii=False)

# Instagram direct chat logic
js_helpers = """function getBusinessInstagramHandle(b) {
  if (b.instagram) return b.instagram.replace(/^@/, '').trim();
  const nameLower = (b.name || '').toLowerCase();
  if (nameLower.includes('jumeirah silk') || nameLower.includes('silk spa')) return 'silkspadubai';
  if (nameLower.includes('salt kite')) return 'findsalt';
  if (nameLower.includes('extra hour')) return 'extrahourspa';
  if (nameLower.includes('camali clinic')) return 'camaliclinic';
  if (nameLower.includes('face fit')) return 'facefitdubai';
  if (nameLower.includes('306 spa')) return '306spa';
  if (nameLower.includes('rameshwaram')) return 'therameshwaramcafe';
  if (nameLower.includes('toit brew')) return 'toitbeerco';
  if (nameLower.includes('truffles')) return 'truffles.in';
  if (nameLower.includes('third wave coffee')) return 'thirdwavecoffeeindia';
  if (nameLower.includes('vidyarthi bhavan')) return 'vidyarthibhavan';
  if (nameLower.includes('arbor brewing')) return 'arborbrewindia';
  if (nameLower.includes('byg brewski')) return 'bygbrewski';
  if (nameLower.includes('geist brewing')) return 'geistbrewingco';
  if (nameLower.includes('biergarten')) return 'biergartenbangalore';
  if (nameLower.includes('ironhill')) return 'ironhillindia';
  if (nameLower.includes('corner house')) return 'cornerhouseicecreams';
  if (nameLower.includes('empire restaurant')) return 'hotelempire';
  if (nameLower.includes('smoke house deli')) return 'smokehousedeli';
  if (nameLower.includes('blue tokai')) return 'bluetokaicoffee';
  if (nameLower.includes('naturals salon')) return 'naturalssalon';
  if (nameLower.includes('enrich salon')) return 'enrichsalon';
  if (nameLower.includes('bodycraft')) return 'bodycraftspasalon';
  if (nameLower.includes('bounce salon')) return 'bouncesalon';
  if (nameLower.includes('ylg salon')) return 'ylgsalon';
  if (nameLower.includes('cult.fit')) return 'cultfit.in';
  if (nameLower.includes('gold\\'s gym')) return 'goldsgymindia';

  if (b.website) {
    try {
      const url = new URL(b.website.startsWith('http') ? b.website : 'https://' + b.website);
      const host = url.hostname.replace(/^www\\./, '').split('.')[0];
      if (host && host.length >= 3 && !['google', 'facebook', 'instagram', 'yelp', 'tripadvisor', 'linktr', 'wixsite'].includes(host)) {
        return host.toLowerCase().replace(/[^a-z0-9_]/g, '');
      }
    } catch (e) {}
  }

  const clean = (b.name || '').split('(')[0].split('–')[0].split('-')[0].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean.substring(0, 28) || 'business';
}

function getDirectInstagramUrl(b) {
  const handle = getBusinessInstagramHandle(b);
  return `https://ig.me/m/${handle}`;
}

function generateInstagramPitch(b) {
  const cleanName = (b.name || '').split('–')[0].split('-')[0].trim();
  const area = b.area || b.city || 'your area';
  const reviewsCount = b.gmb_reviews ? b.gmb_reviews.toLocaleString() : '100+';
  const regional = getRegionalPitchPricing(b.country);
  
  return `Hey ${cleanName} team 👋 Love your page! Saw your Google profile in ${area} with ${reviewsCount} reviews ★${b.gmb_rating || '4.8'}.\\n\\nQuick question: Are you guys taking direct bookings through Instagram / your link-in-bio, or losing 15-25% commissions to aggregators?\\n\\nWe build ultra-fast Apple-grade direct booking systems & viral creator reels (from ${regional.setup}, 0% commission).\\n\\nCan I send a 30-sec demo preview we put together for ${cleanName}? 🚀\\n\\nDemo preview: https://getmoreos.in`;
}

function handleDirectInstagramClick(brandId) {
  const b = (rawDiscoveredBrands && rawDiscoveredBrands.find(item => item.id === brandId)) ||
            (displayedBrands && displayedBrands.find(item => item.id === brandId));
  if (!b) return;
  
  const igPitch = generateInstagramPitch(b);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(igPitch);
  }
  
  markLeadContacted(brandId);
  updateDailyProgressUI();
  
  const handle = getBusinessInstagramHandle(b);
  showToast(`💬 Pitch copied! Opening Instagram chat with @${handle}...`);
  window.open(`https://ig.me/m/${handle}`, '_blank');
}

var currentModalInstagramHandle = '';

function updateModalInstagramHandle(newHandle) {
  currentModalInstagramHandle = (newHandle || '').replace(/^@/, '').trim();
  const directBtn = document.getElementById('modal-ig-direct-btn');
  if (directBtn) {
    directBtn.innerHTML = `<span>💬 Open Chat (@${currentModalInstagramHandle}) ↗</span>`;
  }
}

function openInstagramFromModal() {
  if (!selectedBrand) return;
  const b = selectedBrand;
  const igPitch = generateInstagramPitch(b);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(igPitch);
  }
  markLeadContacted(b.id);
  updateDailyProgressUI();
  
  const inputEl = document.getElementById('modal-ig-handle-input');
  const handle = (inputEl && inputEl.value.trim().replace(/^@/, '')) || currentModalInstagramHandle || getBusinessInstagramHandle(b);
  showToast(`💬 Pitch copied! Opening Instagram chat with @${handle}...`);
  window.open(`https://ig.me/m/${handle}`, '_blank');
}

function copyInstagramScript() {
  if (!selectedBrand) return;
  const igPitch = generateInstagramPitch(selectedBrand);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(igPitch).then(() => {
      showToast('📋 Instagram pitch copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy script.');
    });
  } else {
    showToast('Clipboard not accessible.');
  }
}

function sendInstagramAndNext() {
  const b = queueLeadsList[queueActiveIndex];
  if (!b) return;
  const igPitch = generateInstagramPitch(b);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(igPitch);
  }
  const handle = getBusinessInstagramHandle(b);
  window.open(`https://ig.me/m/${handle}`, '_blank');
  markLeadContacted(b.id);
  showToast(`💬 Pitch copied! Instagram chat opened for "${b.name}".`);
  
  if (queueActiveIndex + 1 < queueLeadsList.length) {
    setTimeout(() => {
      queueActiveIndex++;
      loadQueueLead(queueActiveIndex);
    }, 400);
  } else {
    showToast('🎉 Daily 50 Queue Completed! Awesome job!');
    closeDailyQueueModal();
  }
}"""

# New modal Instagram section with direct handle input and chat launcher
new_modal_ig_card = """        <!-- 📸 1-Click Instagram Direct Chat Script -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-xs uppercase text-purple-600 flex items-center gap-2">
              <span>📸</span> <span id="modal-ig-handle-label">1-Click Instagram DM Chat Script</span>
            </h4>
            <div class="flex items-center gap-2">
              <button onclick="copyInstagramScript()" class="apple-btn-secondary px-3 py-1 text-xs font-semibold flex items-center gap-1 bg-white">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span>Copy Script</span>
              </button>
              <button id="modal-ig-direct-btn" onclick="openInstagramFromModal()" class="apple-pill-btn px-3.5 py-1 text-xs font-bold flex items-center gap-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 text-white shadow-2xs cursor-pointer">
                <span>💬 Open Instagram Chat ↗</span>
              </button>
            </div>
          </div>

          <div id="modal-ig-script" class="bg-[#f5f5f7] p-4 rounded-xl border border-black/[0.06] text-xs leading-relaxed text-[#1d1d1f] font-mono whitespace-pre-wrap select-all">
            <!-- Instagram Pitch populated via JS -->
          </div>

          <div class="flex items-center justify-between text-xs bg-purple-50/80 p-2.5 rounded-xl border border-purple-200/80">
            <div class="flex items-center gap-2">
              <span class="text-purple-800 font-bold text-xs">Direct Chat Account:</span>
              <div class="flex items-center bg-white px-2 py-0.5 rounded-lg border border-purple-300 shadow-2xs">
                <span class="text-purple-400 font-bold">@</span>
                <input id="modal-ig-handle-input" type="text" class="text-xs font-mono font-bold text-purple-900 bg-transparent border-none focus:outline-none w-40" value="" oninput="updateModalInstagramHandle(this.value)" placeholder="username" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="openInstagramFromModal()" class="font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 cursor-pointer text-xs">
                <span>Launch Chat (ig.me)</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        </div>"""

for fn in ['pitchfinder/index.html', 'pitchfinder.html']:
    filepath = os.path.join(ROOT_DIR, fn)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update REAL_VERIFIED_DATABASE
    content = re.sub(
        r'const REAL_VERIFIED_DATABASE\s*=\s*\[[\s\S]*?\];',
        f'const REAL_VERIFIED_DATABASE = {db_json};',
        content
    )
    print(f"✓ Replaced REAL_VERIFIED_DATABASE with verified handles in {fn}")

    # 2. Update JS helpers
    helpers_pattern = r'function getBusinessInstagramHandle\(b\) \{[\s\S]*?closeDailyQueueModal\(\);\s*\}\s*\}'
    if re.search(helpers_pattern, content):
        content = re.sub(helpers_pattern, js_helpers, content)
        print(f"✓ Replaced Instagram helpers with 100% direct chat logic in {fn}")

    # 3. Update Modal HTML section
    old_modal_card_pattern = r'<!-- 📸 1-Click Instagram Direct Pitch Script -->[\s\S]*?</div>\s*</div>\s*</div>'
    if re.search(old_modal_card_pattern, content):
        content = re.sub(old_modal_card_pattern, new_modal_ig_card, content)
        print(f"✓ Replaced modal Instagram card in {fn}")

    # 4. Update openPitchModal JS
    old_modal_ig_pop = """  const igHandle = getBusinessInstagramHandle(b);
  const igPitch = generateInstagramPitch(b);
  const igScriptEl = document.getElementById('modal-ig-script');
  if (igScriptEl) igScriptEl.textContent = igPitch;
  
  const cleanName = (b.name || '').split('(')[0].split('–')[0].split('-')[0].trim();
  const igHandleLabel = document.getElementById('modal-ig-handle-label');
  if (igHandleLabel) {
    igHandleLabel.textContent = igHandle ? `Official Verified Instagram DM Pitch (@${igHandle})` : `1-Click Instagram DM Pitch Script`;
  }
  
  const igAccountInfo = document.getElementById('modal-ig-account-info');
  if (igAccountInfo) {
    igAccountInfo.innerHTML = igHandle 
      ? `<span class="text-emerald-700 font-bold">✓ Verified Official Handle: @${igHandle}</span>`
      : `<span class="text-[#6e6e73]">Search & DM via Verified Google Instagram Locator</span>`;
  }
  
  const igProfileLink = document.getElementById('modal-ig-profile-link');
  if (igProfileLink) {
    if (igHandle) {
      igProfileLink.href = `https://www.instagram.com/${igHandle}/`;
      igProfileLink.textContent = `Open @${igHandle} ↗`;
      igProfileLink.classList.remove('hidden');
    } else {
      igProfileLink.classList.add('hidden');
    }
  }
  
  const igSearchLink = document.getElementById('modal-ig-search-link');
  if (igSearchLink) {
    igSearchLink.href = `https://www.google.com/search?q=${encodeURIComponent('site:instagram.com ' + cleanName + ' ' + b.city)}`;
    igSearchLink.textContent = `Find Official Profile on Google ↗`;
  }
  
  const igDirectBtn = document.getElementById('modal-ig-direct-btn');
  if (igDirectBtn) {
    igDirectBtn.innerHTML = igHandle ? `<span>Launch @${igHandle} ↗</span>` : `<span>Find Official Page &amp; Pitch ↗</span>`;
  }"""

    new_modal_ig_pop = """  const igHandle = getBusinessInstagramHandle(b);
  currentModalInstagramHandle = igHandle;
  const igPitch = generateInstagramPitch(b);
  const igScriptEl = document.getElementById('modal-ig-script');
  if (igScriptEl) igScriptEl.textContent = igPitch;
  
  const igHandleLabel = document.getElementById('modal-ig-handle-label');
  if (igHandleLabel) {
    igHandleLabel.textContent = `1-Click Instagram Direct Chat (@${igHandle})`;
  }
  
  const handleInput = document.getElementById('modal-ig-handle-input');
  if (handleInput) {
    handleInput.value = igHandle;
  }
  
  const igDirectBtn = document.getElementById('modal-ig-direct-btn');
  if (igDirectBtn) {
    igDirectBtn.innerHTML = `<span>💬 Open Chat (@${igHandle}) ↗</span>`;
  }"""

    if old_modal_ig_pop in content:
        content = content.replace(old_modal_ig_pop, new_modal_ig_pop)
        print(f"✓ Replaced openPitchModal JS in {fn}")

    # 5. Update Cards View button to show "@handle" and open chat directly
    old_card_ig = """            ${b.instagram ? `
              <button onclick="handleDirectInstagramClick('${b.id}')" class="px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 transition-all flex items-center gap-1 cursor-pointer" title="Open Verified Instagram: @${b.instagram}">
                <span>📸 @${b.instagram.substring(0, 10)}</span>
              </button>
            ` : `
              <button onclick="handleDirectInstagramClick('${b.id}')" class="px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 transition-all flex items-center gap-1 cursor-pointer" title="Find Official Instagram Page & Copy Pitch">
                <span>📸 Find on IG</span>
              </button>
            `}"""

    new_card_ig = """            <button onclick="handleDirectInstagramClick('${b.id}')" class="px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 transition-all flex items-center gap-1 cursor-pointer" title="Open Instagram Chat (ig.me) with @${getBusinessInstagramHandle(b)}">
              <span>💬 @${getBusinessInstagramHandle(b).substring(0, 11)}</span>
            </button>"""

    if old_card_ig in content:
        content = content.replace(old_card_ig, new_card_ig)
        print(f"✓ Replaced cards Instagram button in {fn}")

    # 6. Update Table View button
    old_table_ig = """<button onclick="handleDirectInstagramClick('${b.id}')" class="hover:text-purple-700 font-semibold text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200/70 cursor-pointer truncate max-w-[105px]" title="${b.instagram ? 'Open Verified Instagram: @' + b.instagram : 'Find Official Instagram Page on Google'}">📸 ${b.instagram ? '@' + b.instagram.substring(0, 10) : 'Find on IG'}</button>"""

    new_table_ig = """<button onclick="handleDirectInstagramClick('${b.id}')" class="hover:text-purple-700 font-semibold text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200/70 cursor-pointer truncate max-w-[105px]" title="Open Instagram Chat (ig.me) with @${getBusinessInstagramHandle(b)}">💬 @${getBusinessInstagramHandle(b).substring(0, 10)}</button>"""

    if old_table_ig in content:
        content = content.replace(old_table_ig, new_table_ig)
        print(f"✓ Replaced table Instagram button in {fn}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("🎉 Completed setting all Instagram outreach to 100% direct chat via ig.me/m/!")
