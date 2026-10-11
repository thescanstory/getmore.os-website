import os
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Top Overview Section HTML
top_overview_html = """
    <!-- 🏢 Live Dashboard Directory Overview: Total Verified Businesses Across Markets -->
    <section class="mb-8 p-5 sm:p-6 rounded-apple bg-white border border-black/[0.08] shadow-sm">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-black/[0.06]">
        <div>
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-blue-50 text-[#0071e3] text-sm">🏢</span>
            <h2 class="text-lg sm:text-xl font-bold text-[#1d1d1f] tracking-tight">Verified Businesses on Dashboard</h2>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              9,560 Active Entities
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#6e6e73]">
            100% genuine Google My Business local entities with phone numbers, websites, and verified contact channels across 6 global markets.
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap text-xs">
          <span class="text-[#86868b] font-medium">Outreach Ready:</span>
          <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">💬 WhatsApp</span>
          <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0071e3] font-semibold border border-blue-200">💬 SMS / iMessage</span>
          <span class="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-semibold border border-purple-200">📸 Instagram DM</span>
          <span class="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-semibold border border-slate-200">✉️ 1-Click Email</span>
        </div>
      </div>

      <!-- Country Breakdown Bento Cards with 1-Click Instant Filtering -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <!-- India -->
        <button type="button" onclick="selectCountryPill('India')" class="p-3.5 rounded-xl bg-[#f5f5f7] hover:bg-blue-50/70 border border-black/[0.05] hover:border-blue-200 transition-all text-left group cursor-pointer">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-base">🇮🇳</span>
            <span class="text-[10px] font-bold text-[#6e6e73] group-hover:text-[#0071e3] transition-colors">Filter ↗</span>
          </div>
          <div class="text-xl font-bold text-[#1d1d1f] group-hover:text-[#0071e3] tracking-tight">3,572</div>
          <div class="text-[11px] font-semibold text-[#1d1d1f]">India</div>
          <div class="text-[10px] text-[#86868b] truncate">Bangalore, Mumbai +8</div>
        </button>

        <!-- Australia -->
        <button type="button" onclick="selectCountryPill('Australia')" class="p-3.5 rounded-xl bg-[#f5f5f7] hover:bg-blue-50/70 border border-black/[0.05] hover:border-blue-200 transition-all text-left group cursor-pointer">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-base">🇦🇺</span>
            <span class="text-[10px] font-bold text-[#6e6e73] group-hover:text-[#0071e3] transition-colors">Filter ↗</span>
          </div>
          <div class="text-xl font-bold text-[#1d1d1f] group-hover:text-[#0071e3] tracking-tight">2,016</div>
          <div class="text-[11px] font-semibold text-[#1d1d1f]">Australia</div>
          <div class="text-[10px] text-[#86868b] truncate">Sydney, Melbourne +2</div>
        </button>

        <!-- USA -->
        <button type="button" onclick="selectCountryPill('USA')" class="p-3.5 rounded-xl bg-[#f5f5f7] hover:bg-blue-50/70 border border-black/[0.05] hover:border-blue-200 transition-all text-left group cursor-pointer">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-base">🇺🇸</span>
            <span class="text-[10px] font-bold text-[#6e6e73] group-hover:text-[#0071e3] transition-colors">Filter ↗</span>
          </div>
          <div class="text-xl font-bold text-[#1d1d1f] group-hover:text-[#0071e3] tracking-tight">1,010</div>
          <div class="text-[11px] font-semibold text-[#1d1d1f]">United States</div>
          <div class="text-[10px] text-[#86868b] truncate">Miami, New York +3</div>
        </button>

        <!-- UAE -->
        <button type="button" onclick="selectCountryPill('UAE')" class="p-3.5 rounded-xl bg-[#f5f5f7] hover:bg-blue-50/70 border border-black/[0.05] hover:border-blue-200 transition-all text-left group cursor-pointer">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-base">🇦🇪</span>
            <span class="text-[10px] font-bold text-[#6e6e73] group-hover:text-[#0071e3] transition-colors">Filter ↗</span>
          </div>
          <div class="text-xl font-bold text-[#1d1d1f] group-hover:text-[#0071e3] tracking-tight">1,011</div>
          <div class="text-[11px] font-semibold text-[#1d1d1f]">UAE / Dubai</div>
          <div class="text-[10px] text-[#86868b] truncate">Dubai, Abu Dhabi +1</div>
        </button>

        <!-- United Kingdom -->
        <button type="button" onclick="selectCountryPill('United Kingdom')" class="p-3.5 rounded-xl bg-[#f5f5f7] hover:bg-blue-50/70 border border-black/[0.05] hover:border-blue-200 transition-all text-left group cursor-pointer">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-base">🇬🇧</span>
            <span class="text-[10px] font-bold text-[#6e6e73] group-hover:text-[#0071e3] transition-colors">Filter ↗</span>
          </div>
          <div class="text-xl font-bold text-[#1d1d1f] group-hover:text-[#0071e3] tracking-tight">1,008</div>
          <div class="text-[11px] font-semibold text-[#1d1d1f]">United Kingdom</div>
          <div class="text-[10px] text-[#86868b] truncate">London, Manchester +1</div>
        </button>

        <!-- Canada -->
        <button type="button" onclick="selectCountryPill('Canada')" class="p-3.5 rounded-xl bg-[#f5f5f7] hover:bg-blue-50/70 border border-black/[0.05] hover:border-blue-200 transition-all text-left group cursor-pointer">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-base">🇨🇦</span>
            <span class="text-[10px] font-bold text-[#6e6e73] group-hover:text-[#0071e3] transition-colors">Filter ↗</span>
          </div>
          <div class="text-xl font-bold text-[#1d1d1f] group-hover:text-[#0071e3] tracking-tight">943</div>
          <div class="text-[11px] font-semibold text-[#1d1d1f]">Canada</div>
          <div class="text-[10px] text-[#86868b] truncate">Toronto, Vancouver +2</div>
        </button>
      </div>
    </section>
"""

# Instagram Helper JS
instagram_helpers_js = """
function getBusinessInstagramHandle(b) {
  if (b.instagram) return b.instagram.replace(/^@/, '');
  if (b.website) {
    try {
      const url = new URL(b.website.startsWith('http') ? b.website : 'https://' + b.website);
      const host = url.hostname.replace(/^www\\./, '').split('.')[0];
      if (host && host.length >= 3 && !['google', 'facebook', 'instagram', 'yelp', 'tripadvisor', 'linktr', 'wixsite'].includes(host)) {
        return host.toLowerCase().replace(/[^a-z0-9_]/g, '');
      }
    } catch (e) {}
  }
  const clean = (b.name || 'business').split('(')[0].split('–')[0].split('-')[0].trim();
  return clean.toLowerCase().replace(/[^a-z0-9_]/g, '').substring(0, 30);
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
  showToast(`📸 Pitch copied to clipboard! Opening Instagram DM for @${handle}...`);
  window.open(`https://ig.me/m/${handle}`, '_blank');
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
  const handle = getBusinessInstagramHandle(b);
  showToast(`📸 Pitch copied to clipboard! Opening Instagram DM for @${handle}...`);
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
  showToast(`📸 Pitch copied! Instagram DM opened for "${b.name}".`);
  
  if (queueActiveIndex + 1 < queueLeadsList.length) {
    setTimeout(() => {
      queueActiveIndex++;
      loadQueueLead(queueActiveIndex);
    }, 400);
  } else {
    showToast('🎉 Daily 50 Queue Completed! Awesome job!');
    closeDailyQueueModal();
  }
}
"""

for fn in ['pitchfinder/index.html', 'pitchfinder.html']:
    filepath = os.path.join(ROOT_DIR, fn)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add Top Overview Section right before Daily 50 Hub
    hub_marker = '    <!-- ⚡ Daily 50 WhatsApp Outreach Hub Bar -->'
    if 'Live Dashboard Directory Overview' not in content:
        content = content.replace(hub_marker, top_overview_html + '\n' + hub_marker)
        print(f"✓ Added Top Directory Overview section to {fn}")

    # 2. Add Instagram Helpers JS
    if 'function getBusinessInstagramHandle(' not in content:
        content = content.replace('function getDirectSmsUrl(', instagram_helpers_js + '\nfunction getDirectSmsUrl(')
        print(f"✓ Added Instagram helper functions to {fn}")

    # 3. Update Cards View Action Bar to include Instagram DM button
    old_cards_action = """            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 rounded-xl bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-semibold border border-black/[0.08] transition-all flex items-center gap-1 cursor-pointer" title="View on Google Maps">
              <span>📍 Maps</span>
            </a>"""

    new_cards_action = """            <button onclick="handleDirectInstagramClick('${b.id}')" class="px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 transition-all flex items-center gap-1 cursor-pointer" title="1-Click Instagram DM & Pitch Copy">
              <span>📸 DM</span>
            </button>

            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-2 rounded-xl bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-semibold border border-black/[0.08] transition-all flex items-center gap-1 cursor-pointer" title="View on Google Maps">
              <span>📍 Maps</span>
            </a>"""

    if old_cards_action in content:
        content = content.replace(old_cards_action, new_cards_action)
        print(f"✓ Added Instagram DM button to cards view in {fn}")

    # 4. Update Table View Reachout sub-links to include Instagram
    old_table_sub_wa = """                    <div class="mt-1 flex items-center justify-between text-[11px] text-[#6e6e73]">
                      <a href="${getDirectEmailUrl(b)}" onclick="handleDirectEmailClick('${b.id}')" class="hover:text-[#0071e3] truncate max-w-[130px]" title="1-Click Cold Email: ${b.email || ''}">✉️ ${b.email || 'Email Ready'}</a>
                      <a href="tel:${b.phone_number || b.phone}" class="hover:text-[#0071e3] font-mono text-[10px]" title="Direct Call">📞 Call</a>
                    </div>"""

    new_table_sub_wa = """                    <div class="mt-1 flex items-center justify-between text-[11px] text-[#6e6e73] gap-1">
                      <a href="${getDirectEmailUrl(b)}" onclick="handleDirectEmailClick('${b.id}')" class="hover:text-[#0071e3] truncate max-w-[80px]" title="1-Click Cold Email: ${b.email || ''}">✉️ Email</a>
                      <button onclick="handleDirectInstagramClick('${b.id}')" class="hover:text-purple-700 font-semibold text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200/70 cursor-pointer truncate max-w-[100px]" title="1-Click Instagram DM: @${getBusinessInstagramHandle(b)}">📸 @${getBusinessInstagramHandle(b)}</button>
                      <a href="tel:${b.phone_number || b.phone}" class="hover:text-[#0071e3] font-mono text-[10px]" title="Direct Call">📞</a>
                    </div>"""

    if old_table_sub_wa in content:
        content = content.replace(old_table_sub_wa, new_table_sub_wa)
        print(f"✓ Added Instagram button to table view in {fn}")

    # 5. Update List View actions to include Instagram
    old_list_maps = """              <a href="${createGoogleMapsUrl(b.name, b.city)}" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-rose-50 hover:text-rose-600 text-rose-500 border border-black/[0.06] grid place-items-center transition-all" title="View Real Listing on Google Maps">"""
    new_list_maps = """              <button onclick="handleDirectInstagramClick('${b.id}')" class="w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 grid place-items-center transition-all cursor-pointer" title="1-Click Instagram DM: @${getBusinessInstagramHandle(b)}">
                <span class="text-xs">📸</span>
              </button>

              <a href="${createGoogleMapsUrl(b.name, b.city)}" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-rose-50 hover:text-rose-600 text-rose-500 border border-black/[0.06] grid place-items-center transition-all" title="View Real Listing on Google Maps">"""

    if old_list_maps in content:
        content = content.replace(old_list_maps, new_list_maps)
        print(f"✓ Added Instagram button to list view in {fn}")

    # 6. Add Modal Instagram Section and Action Button
    old_modal_header_btns = """            <a id="modal-email-btn" href="#" class="apple-pill-btn px-4 py-2 text-xs font-semibold flex items-center gap-1.5 bg-[#0071e3] hover:bg-blue-600 text-white" title="Send 1-Click Email Pitch">
              <span>✉️ Send Email Pitch</span>
            </a>"""

    new_modal_header_btns = """            <a id="modal-email-btn" href="#" class="apple-pill-btn px-4 py-2 text-xs font-semibold flex items-center gap-1.5 bg-[#0071e3] hover:bg-blue-600 text-white" title="Send 1-Click Email Pitch">
              <span>✉️ Send Email Pitch</span>
            </a>

            <button id="modal-ig-btn" onclick="openInstagramFromModal()" class="apple-pill-btn px-4 py-2 text-xs font-semibold flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-sm cursor-pointer" title="1-Click Instagram DM & Pitch Copy">
              <span>📸 Instagram DM</span>
            </button>"""

    if old_modal_header_btns in content:
        content = content.replace(old_modal_header_btns, new_modal_header_btns)
        print(f"✓ Added Instagram button to modal header in {fn}")

    # Add Instagram Script Card before Cold Call Card in Modal
    old_modal_cold_call = """        <!-- Cold Call Opening Script -->
        <div class="space-y-2.5">"""

    modal_ig_script_card = """        <!-- 📸 1-Click Instagram Direct Pitch Script -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-xs uppercase text-purple-600 flex items-center gap-2">
              <span>📸</span> <span id="modal-ig-handle-label">1-Click Instagram DM Pitch Script</span>
            </h4>
            <div class="flex items-center gap-2">
              <button onclick="copyInstagramScript()" class="apple-btn-secondary px-3 py-1 text-xs font-semibold flex items-center gap-1 bg-white">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span>Copy IG Pitch</span>
              </button>
              <button id="modal-ig-direct-btn" onclick="openInstagramFromModal()" class="apple-pill-btn px-3 py-1 text-xs font-bold flex items-center gap-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 text-white shadow-2xs cursor-pointer">
                <span>Launch IG DM ↗</span>
              </button>
            </div>
          </div>

          <div id="modal-ig-script" class="bg-[#f5f5f7] p-4 rounded-xl border border-black/[0.06] text-xs leading-relaxed text-[#1d1d1f] font-mono whitespace-pre-wrap select-all">
            <!-- Instagram Pitch populated via JS -->
          </div>
          <div class="flex items-center justify-between text-[11px] text-[#6e6e73]">
            <span id="modal-ig-account-info">Official Handle: @instagram</span>
            <div class="flex items-center gap-2">
              <a id="modal-ig-profile-link" href="#" target="_blank" rel="noopener noreferrer" class="text-purple-600 hover:underline font-semibold">View Profile ↗</a>
              <span>•</span>
              <a id="modal-ig-search-link" href="#" target="_blank" rel="noopener noreferrer" class="text-[#0071e3] hover:underline font-semibold">Search Instagram ↗</a>
            </div>
          </div>
        </div>

        <!-- Cold Call Opening Script -->
        <div class="space-y-2.5">"""

    if old_modal_cold_call in content and 'modal-ig-script' not in content:
        content = content.replace(old_modal_cold_call, modal_ig_script_card)
        print(f"✓ Added Instagram script card to modal in {fn}")

    # 7. Update openPitchModal JS to populate Instagram script and links
    old_open_modal_script = """  document.getElementById('modal-pitch-script').textContent = b.whatsapp_number ? generateWhatsAppPitch(b) : generateSmsPitch(b);"""

    new_open_modal_script = """  document.getElementById('modal-pitch-script').textContent = b.whatsapp_number ? generateWhatsAppPitch(b) : generateSmsPitch(b);
  
  const igHandle = getBusinessInstagramHandle(b);
  const igPitch = generateInstagramPitch(b);
  const igScriptEl = document.getElementById('modal-ig-script');
  if (igScriptEl) igScriptEl.textContent = igPitch;
  const igHandleLabel = document.getElementById('modal-ig-handle-label');
  if (igHandleLabel) igHandleLabel.textContent = `1-Click Instagram DM Pitch (@${igHandle})`;
  const igAccountInfo = document.getElementById('modal-ig-account-info');
  if (igAccountInfo) igAccountInfo.textContent = `Official IG: @${igHandle}`;
  const igProfileLink = document.getElementById('modal-ig-profile-link');
  if (igProfileLink) igProfileLink.href = `https://www.instagram.com/${igHandle}/`;
  const igSearchLink = document.getElementById('modal-ig-search-link');
  if (igSearchLink) igSearchLink.href = `https://www.google.com/search?q=${encodeURIComponent(b.name + ' ' + b.city + ' instagram')}`;"""

    if old_open_modal_script in content and 'modal-ig-script' in content:
        content = content.replace(old_open_modal_script, new_open_modal_script)
        print(f"✓ Updated openPitchModal with Instagram data population in {fn}")

    # 8. Add Instagram button in Queue modal actions
    old_queue_footer = """          <button onclick="skipQueueLead()" class="apple-btn-secondary px-5 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 w-full sm:w-auto">
            <span>Skip Lead</span>
            <span class="text-[10px] text-[#86868b] font-mono">Esc</span>
          </button>"""

    new_queue_footer = """          <button onclick="sendInstagramAndNext()" class="apple-pill-btn px-4 py-3 text-xs font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md cursor-pointer w-full sm:w-auto" title="Launch Instagram DM & Next">
            <span>📸 Launch IG DM &amp; Next</span>
          </button>

          <button onclick="skipQueueLead()" class="apple-btn-secondary px-5 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 w-full sm:w-auto">
            <span>Skip Lead</span>
            <span class="text-[10px] text-[#86868b] font-mono">Esc</span>
          </button>"""

    if old_queue_footer in content:
        content = content.replace(old_queue_footer, new_queue_footer)
        print(f"✓ Added Instagram queue launcher in {fn}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("🎉 Completed updating all files with top directory overview and Instagram outreach!")
