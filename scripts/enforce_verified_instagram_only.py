import os
import json
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
master_path = os.path.join(ROOT_DIR, 'data/leads/master_leads_10000.json')

with open(master_path, 'r', encoding='utf-8') as f:
    leads = json.load(f)

print(f"Total leads in master: {len(leads)}")
verified_leads = [b for b in leads if b.get('instagram')]
print(f"Verified Instagram leads: {len(verified_leads)}")

db_json = json.dumps(leads, ensure_ascii=False)

# 1. Direct JS helpers (verified handles only, no fake guesses)
js_helpers = """function getBusinessInstagramHandle(b) {
  if (b && b.instagram) return b.instagram.replace(/^@/, '').trim();
  return null;
}

function getDirectInstagramUrl(b) {
  if (b && b.instagram) {
    return `https://ig.me/m/${b.instagram.replace(/^@/, '').trim()}`;
  }
  return null;
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
  if (!b || !b.instagram) return;
  
  const igPitch = generateInstagramPitch(b);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(igPitch);
  }
  
  markLeadContacted(brandId);
  updateDailyProgressUI();
  
  const handle = b.instagram.replace(/^@/, '').trim();
  showToast(`💬 Pitch copied! Opening Instagram chat with @${handle}...`);
  window.open(`https://ig.me/m/${handle}`, '_blank');
}

var currentModalInstagramHandle = '';

function updateModalInstagramHandle(newHandle) {
  currentModalInstagramHandle = (newHandle || '').replace(/^@/, '').trim();
  const directBtn = document.getElementById('modal-ig-direct-btn');
  if (directBtn) {
    directBtn.innerHTML = currentModalInstagramHandle ? `<span>💬 Open Chat (@${currentModalInstagramHandle}) ↗</span>` : `<span>💬 Launch Chat ↗</span>`;
  }
}

function openInstagramFromModal() {
  if (!selectedBrand) return;
  const b = selectedBrand;
  const inputEl = document.getElementById('modal-ig-handle-input');
  const handle = (inputEl && inputEl.value.trim().replace(/^@/, '')) || currentModalInstagramHandle || (b.instagram && b.instagram.replace(/^@/, '').trim());
  
  if (!handle) {
    showToast("Please enter an Instagram handle to launch chat.");
    if (inputEl) inputEl.focus();
    return;
  }
  
  const igPitch = generateInstagramPitch(b);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(igPitch);
  }
  markLeadContacted(b.id);
  updateDailyProgressUI();
  
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
  
  if (b.instagram) {
    const igPitch = generateInstagramPitch(b);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(igPitch);
    }
    const handle = b.instagram.replace(/^@/, '').trim();
    window.open(`https://ig.me/m/${handle}`, '_blank');
    markLeadContacted(b.id);
    showToast(`💬 Pitch copied! Instagram chat opened for "${b.name}".`);
  } else {
    // If no instagram, use sms or wa
    if (b.whatsapp_number) {
      window.location.href = getDirectWhatsAppUrl(b);
      markLeadContacted(b.id);
      showToast(`⚡ WhatsApp opened! "${b.name}" marked contacted.`);
    } else {
      window.location.href = getDirectSmsUrl(b);
      markLeadContacted(b.id);
      showToast(`💬 1-Click SMS launched! "${b.name}" marked contacted.`);
    }
  }
  
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

# 2. Modal HTML Card with Verified Badge and Custom Input
modal_ig_card = """        <!-- 📸 1-Click Instagram Direct Chat Script -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-xs uppercase text-purple-600 flex items-center gap-1.5">
                <span>📸</span> <span id="modal-ig-handle-label">Instagram DM Chat Script</span>
              </h4>
              <span id="modal-ig-verified-badge"></span>
            </div>
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
              <span class="text-purple-800 font-bold text-xs">Direct Chat Handle:</span>
              <div class="flex items-center bg-white px-2 py-0.5 rounded-lg border border-purple-300 shadow-2xs">
                <span class="text-purple-400 font-bold">@</span>
                <input id="modal-ig-handle-input" type="text" class="text-xs font-mono font-bold text-purple-900 bg-transparent border-none focus:outline-none w-36" placeholder="type handle..." oninput="updateModalInstagramHandle(this.value)" />
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
    print(f"✓ Replaced REAL_VERIFIED_DATABASE in {fn}")

    # 2. Update JS helpers
    helpers_pattern = r'function getBusinessInstagramHandle\(b\) \{[\s\S]*?closeDailyQueueModal\(\);\s*\}\s*\}'
    if re.search(helpers_pattern, content):
        content = re.sub(helpers_pattern, js_helpers, content)
        print(f"✓ Updated Instagram helpers in {fn}")

    # 3. Update Modal HTML section
    old_modal_card_pattern = r'<!-- 📸 1-Click Instagram Direct Chat Script -->[\s\S]*?</div>\s*</div>\s*</div>'
    if re.search(old_modal_card_pattern, content):
        content = re.sub(old_modal_card_pattern, modal_ig_card, content)
        print(f"✓ Updated modal Instagram card in {fn}")

    # 4. Update openPitchModal JS
    old_modal_pop = r'const igHandle = getBusinessInstagramHandle\(b\);[\s\S]*?igDirectBtn\.innerHTML = `<span>💬 Open Chat \(@\$\{igHandle\}\) ↗</span>`;\s*\}'
    new_modal_pop = """  const igPitch = generateInstagramPitch(b);
  const igScriptEl = document.getElementById('modal-ig-script');
  if (igScriptEl) igScriptEl.textContent = igPitch;
  
  const handleInput = document.getElementById('modal-ig-handle-input');
  const igDirectBtn = document.getElementById('modal-ig-direct-btn');
  const igHandleLabel = document.getElementById('modal-ig-handle-label');
  const igVerifiedBadge = document.getElementById('modal-ig-verified-badge');
  
  if (b.instagram) {
    currentModalInstagramHandle = b.instagram.replace(/^@/, '').trim();
    if (handleInput) handleInput.value = currentModalInstagramHandle;
    if (igDirectBtn) {
      igDirectBtn.innerHTML = `<span>💬 Open Chat (@${currentModalInstagramHandle}) ↗</span>`;
      igDirectBtn.classList.remove('hidden');
    }
    if (igHandleLabel) igHandleLabel.textContent = `Instagram DM Chat Script (@${currentModalInstagramHandle})`;
    if (igVerifiedBadge) igVerifiedBadge.innerHTML = `<span class="text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">✓ Verified</span>`;
  } else {
    currentModalInstagramHandle = '';
    if (handleInput) handleInput.value = '';
    if (igDirectBtn) igDirectBtn.innerHTML = `<span>💬 Launch Chat ↗</span>`;
    if (igHandleLabel) igHandleLabel.textContent = `Instagram DM Chat Script`;
    if (igVerifiedBadge) igVerifiedBadge.innerHTML = `<span class="text-[#86868b] text-[11px] font-normal">Enter handle to chat</span>`;
  }"""

    if re.search(old_modal_pop, content):
        content = re.sub(old_modal_pop, new_modal_pop, content)
        print(f"✓ Updated openPitchModal JS in {fn}")

    # 5. In Cards View: Only show Instagram button if b.instagram is verified!
    old_cards_ig = r'<button onclick="handleDirectInstagramClick\(\'\$\{b\.id\}\'\)" class="px-2\.5 py-2 rounded-xl bg-purple-50[\s\S]*?<span>💬 @\$\{getBusinessInstagramHandle\(b\)\.substring\(0, 11\)\}</span>\s*</button>'
    new_cards_ig = """${b.instagram ? `
              <button onclick="handleDirectInstagramClick('${b.id}')" class="px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 transition-all flex items-center gap-1 cursor-pointer" title="Open Instagram Chat (ig.me) with @${b.instagram}">
                <span>💬 @${b.instagram.substring(0, 11)}</span>
              </button>
            ` : ''}"""

    if re.search(old_cards_ig, content):
        content = re.sub(old_cards_ig, new_cards_ig, content)
        print(f"✓ Updated cards Instagram button (verified only) in {fn}")

    # 6. In Table View: Only show Instagram button if b.instagram is verified!
    old_table_ig = r'<button onclick="handleDirectInstagramClick\(\'\$\{b\.id\}\'\)" class="hover:text-purple-700 font-semibold text-\[10px\] text-purple-700 bg-purple-50[\s\S]*?💬 @\$\{getBusinessInstagramHandle\(b\)\.substring\(0, 10\)\}</button>'
    new_table_ig = """${b.instagram ? `
                        <button onclick="handleDirectInstagramClick('${b.id}')" class="hover:text-purple-700 font-semibold text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200/70 cursor-pointer truncate max-w-[105px]" title="Open Instagram Chat with @${b.instagram}">💬 @${b.instagram.substring(0, 10)}</button>
                      ` : ''}"""

    if re.search(old_table_ig, content):
        content = re.sub(old_table_ig, new_table_ig, content)
        print(f"✓ Updated table Instagram button (verified only) in {fn}")

    # 7. In List View: Only show Instagram icon if b.instagram is verified!
    old_list_ig = r'<button onclick="handleDirectInstagramClick\(\'\$\{b\.id\}\'\)" class="w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 grid place-items-center transition-all cursor-pointer" title="1-Click Instagram DM: @\$\{getBusinessInstagramHandle\(b\)\}"><span class="text-xs">📸</span></button>'
    new_list_ig = """${b.instagram ? `
                <button onclick="handleDirectInstagramClick('${b.id}')" class="w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 grid place-items-center transition-all cursor-pointer" title="Open Instagram Chat: @${b.instagram}"><span class="text-xs">💬</span></button>
              ` : ''}"""

    if re.search(old_list_ig, content):
        content = re.sub(old_list_ig, new_list_ig, content)
        print(f"✓ Updated list Instagram button (verified only) in {fn}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("🎉 Completed enforcing verified-only Instagram links across all files!")
