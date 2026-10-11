import sys

def update_html_files():
    for path in ['pitchfinder/index.html', 'pitchfinder.html']:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Update getDirectInstagramUrl
        old_get_url = """function getDirectInstagramUrl(b) {
  if (b && b.instagram) {
    return `https://ig.me/m/${b.instagram.replace(/^@/, '').trim()}`;
  }
  return null;
}"""

        new_get_url = """function getDirectInstagramUrl(b) {
  if (b && b.instagram) {
    const handle = b.instagram.replace(/^@/, '').trim();
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return isMobile ? `https://ig.me/m/${handle}` : `https://www.instagram.com/${handle}/`;
  }
  return null;
}"""
        if old_get_url in content:
            content = content.replace(old_get_url, new_get_url)
            print(f'Replaced getDirectInstagramUrl in {path}')
        else:
            print(f'old_get_url not found in {path}')

        # 2. Update handleDirectInstagramClick and openInstagramFromModal
        old_funcs = """function handleDirectInstagramClick(brandId) {
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
}"""

        new_funcs = """function handleDirectInstagramClick(brandId) {
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
  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const targetUrl = isMobile ? `https://ig.me/m/${handle}` : `https://www.instagram.com/${handle}/`;
  
  showToast(`💬 Pitch copied! Opening @${handle}... Tap 'Message' & Paste (⌘V) to chat!`);
  window.open(targetUrl, '_blank');
}

var currentModalInstagramHandle = '';

function updateModalInstagramHandle(newHandle) {
  currentModalInstagramHandle = (newHandle || '').replace(/^@/, '').trim();
  const directBtn = document.getElementById('modal-ig-direct-btn');
  if (directBtn) {
    directBtn.innerHTML = currentModalInstagramHandle ? `<span>💬 Open Chat (@${currentModalInstagramHandle}) ↗</span>` : `<span>💬 Launch Chat ↗</span>`;
  }
}

function openInstagramFromModal(mode) {
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
  
  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  let targetUrl;
  if (mode === 'igme' || (isMobile && mode !== 'profile')) {
    targetUrl = `https://ig.me/m/${handle}`;
  } else {
    targetUrl = `https://www.instagram.com/${handle}/`;
  }
  
  showToast(`💬 Pitch copied! Opening @${handle}... Tap 'Message' & Paste (⌘V) to chat!`);
  window.open(targetUrl, '_blank');
}"""

        if old_funcs in content:
            content = content.replace(old_funcs, new_funcs)
            print(f'Replaced funcs in {path}')
        else:
            print(f'old_funcs not found in {path}')

        # 3. Update modal UI buttons
        old_modal_btns = """            <div class="flex items-center gap-2">
              <button onclick="openInstagramFromModal()" class="font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 cursor-pointer text-xs">
                <span>Launch Chat (ig.me)</span>
                <span>↗</span>
              </button>
            </div>"""

        new_modal_btns = """            <div class="flex items-center gap-2">
              <button onclick="openInstagramFromModal('profile')" class="font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 cursor-pointer text-xs" title="Open verified profile with Message button">
                <span>Open Profile (Web)</span>
                <span>↗</span>
              </button>
              <span class="text-purple-300">•</span>
              <button onclick="openInstagramFromModal('igme')" class="font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 cursor-pointer text-xs" title="Open in Instagram Mobile App">
                <span>App DM (ig.me)</span>
                <span>↗</span>
              </button>
            </div>"""

        if old_modal_btns in content:
            content = content.replace(old_modal_btns, new_modal_btns)
            print(f'Replaced modal buttons in {path}')
        else:
            print(f'old_modal_btns not found in {path}')

        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == '__main__':
    update_html_files()
