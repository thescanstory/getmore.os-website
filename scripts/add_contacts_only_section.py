import os
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

contacts_view_js = """
// 📇 Dedicated View: ONLY Business Names, Phone Numbers, and Email IDs
function renderContactsOnlyView(brands) {
  if (brands.length === 0) {
    return `
      <div class="text-center py-20 bg-white rounded-2xl border border-black/[0.08] p-8 shadow-xs">
        <div class="text-5xl mb-3">📇</div>
        <h3 class="text-base font-bold text-[#1d1d1f] mb-1">No Matching Contacts Found</h3>
        <p class="text-xs text-[#6e6e73]">Try adjusting your search query or filters.</p>
      </div>
    `;
  }

  const visible = brands.slice(0, currentRenderLimit);
  const emailCount = visible.filter(b => b.email && b.email.includes('@')).length;
  const phoneCount = visible.filter(b => b.phone_number || b.phone).length;

  return `
    <div class="bg-white rounded-2xl border border-black/[0.08] shadow-sm overflow-hidden mb-8">
      
      <!-- Contacts Header Bar with Instant Blitz Tools -->
      <div class="px-5 py-4 bg-gradient-to-r from-[#fafafa] via-purple-50/30 to-blue-50/30 border-b border-black/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-purple-100 text-purple-700 text-sm">📇</span>
            <h3 class="text-base font-bold text-[#1d1d1f] tracking-tight">Direct Contact Roster: Names, Phones &amp; Emails Only</h3>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              ${visible.length.toLocaleString()} Businesses
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              📞 ${phoneCount.toLocaleString()} Phones
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#0071e3] border border-blue-200">
              ✉️ ${emailCount.toLocaleString()} Verified Emails
            </span>
          </div>
          <p class="text-xs text-[#6e6e73]">
            Dedicated fast outreach list designed for cold calling, SMS blitzes, and email blasts. Pure contact data.
          </p>
        </div>

        <!-- Blitz Action Buttons -->
        <div class="flex items-center gap-2 flex-wrap">
          <button onclick="copyAllVisibleEmails()" class="apple-pill-btn px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-2xs cursor-pointer" title="Copy all emails to clipboard (comma separated)">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>📋 Copy All Emails (${emailCount})</span>
          </button>
          
          <button onclick="copyAllVisiblePhones()" class="apple-pill-btn px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer" title="Copy all phone numbers to clipboard">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span>📋 Copy All Phones (${phoneCount})</span>
          </button>

          <button onclick="exportContactsOnlyCSV()" class="apple-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer" title="Export CSV containing only Name, Phone and Email">
            <svg class="w-3.5 h-3.5 text-[#0071e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Export Contacts CSV</span>
          </button>
        </div>
      </div>

      <!-- Pure Contacts Table (Only Business Name, Phone Number, Email Address) -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#f5f5f7] border-b border-black/[0.06] text-[#86868b] uppercase font-bold text-[10px] tracking-wider">
              <th class="py-3 px-4 w-12 text-center">#</th>
              <th class="py-3 px-4 min-w-[280px]">Business Name</th>
              <th class="py-3 px-4 min-w-[240px]">Phone Number</th>
              <th class="py-3 px-4 min-w-[260px]">Email ID</th>
              <th class="py-3 px-4 w-40 text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-black/[0.04]">
            ${visible.map((b, idx) => {
              const contacted = isLeadContacted(b.id);
              const cleanPhone = b.phone_number || b.phone || 'N/A';
              const cleanEmail = b.email || null;

              return `
                <tr class="hover:bg-blue-50/30 transition-colors ${contacted ? 'bg-emerald-50/20' : ''}">
                  <!-- Index -->
                  <td class="py-3.5 px-4 text-center font-mono text-[11px] text-[#86868b] align-middle">
                    ${idx + 1}
                  </td>

                  <!-- Business Name -->
                  <td class="py-3.5 px-4 align-middle">
                    <div class="font-bold text-[#1d1d1f] text-[13px] leading-tight flex items-center gap-1.5">
                      <span>${b.name}</span>
                      ${contacted ? '<span class="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">✓ Contacted</span>' : ''}
                    </div>
                    <div class="text-[11px] text-[#6e6e73] mt-0.5 flex items-center gap-1.5">
                      <span>📍 ${b.area || b.city || ''}${b.country ? `, ${b.country}` : ''}</span>
                      <span class="text-black/20">•</span>
                      <span class="text-[10px] text-[#86868b]">${b.category || b.subcategory || 'Local Business'}</span>
                    </div>
                  </td>

                  <!-- Phone Number -->
                  <td class="py-3.5 px-4 align-middle">
                    <div class="flex items-center gap-2">
                      <a href="tel:${cleanPhone}" class="font-mono text-xs font-bold text-[#1d1d1f] hover:text-[#0071e3] hover:underline flex items-center gap-1" title="Click to call ${cleanPhone}">
                        <span class="text-emerald-600">📞</span>
                        <span>${cleanPhone}</span>
                      </a>
                      <button onclick="copySingleContact('${(b.name || '').replace(/'/g, "\\\\'")}', '${cleanPhone}', '${cleanEmail || ''}')" class="text-[10px] text-[#86868b] hover:text-[#1d1d1f] bg-black/[0.03] hover:bg-black/[0.08] px-1.5 py-0.5 rounded cursor-pointer transition-colors" title="Copy Phone Number">
                        📋 Copy
                      </button>
                    </div>
                    <div class="text-[10px] text-[#86868b] mt-0.5 flex items-center gap-2">
                      ${b.whatsapp_number ? '<span class="text-emerald-600 font-semibold">✓ WhatsApp Ready</span>' : '<span class="text-blue-600 font-semibold">✓ SMS / iMessage</span>'}
                    </div>
                  </td>

                  <!-- Email Address -->
                  <td class="py-3.5 px-4 align-middle">
                    ${cleanEmail ? `
                      <div class="flex items-center gap-2">
                        <a href="mailto:${cleanEmail}" onclick="handleDirectEmailClick('${b.id}')" class="font-mono text-xs font-bold text-[#0071e3] hover:underline truncate max-w-[220px]" title="1-Click Email to ${cleanEmail}">
                          ✉️ ${cleanEmail}
                        </a>
                        <button onclick="navigator.clipboard.writeText('${cleanEmail}'); showToast('📋 Copied email: ${cleanEmail}');" class="text-[10px] text-[#86868b] hover:text-[#1d1d1f] bg-black/[0.03] hover:bg-black/[0.08] px-1.5 py-0.5 rounded cursor-pointer transition-colors shrink-0" title="Copy Email ID">
                          📋 Copy
                        </button>
                      </div>
                    ` : `
                      <div class="flex items-center gap-1.5 text-[#86868b]">
                        <span class="font-mono text-[11px] italic">Unlisted</span>
                        <a href="https://www.google.com/search?q=${encodeURIComponent((b.name || '') + ' ' + (b.city || '') + ' official email contact')}" target="_blank" rel="noopener noreferrer" class="text-[10px] text-[#0071e3] hover:underline ml-1">
                          🔍 Find Email ↗
                        </a>
                      </div>
                    `}
                  </td>

                  <!-- Quick Action -->
                  <td class="py-3.5 px-4 text-right align-middle">
                    <div class="flex items-center justify-end gap-1.5">
                      <a href="tel:${cleanPhone}" class="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-all flex items-center gap-1" title="Call ${cleanPhone}">
                        <span>📞</span>
                        <span class="hidden sm:inline">Call</span>
                      </a>
                      ${cleanEmail ? `
                        <a href="${getDirectEmailUrl(b)}" onclick="handleDirectEmailClick('${b.id}')" class="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0071e3] font-bold text-xs border border-blue-200 transition-all flex items-center gap-1" title="Email ${cleanEmail}">
                          <span>✉️</span>
                          <span class="hidden sm:inline">Email</span>
                        </a>
                      ` : `
                        <button onclick="openPitchModal('${b.id}')" class="px-2.5 py-1.5 rounded-lg bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-semibold text-xs border border-black/[0.06] transition-all flex items-center gap-1 cursor-pointer" title="View Full Pitch">
                          <span>⚡</span>
                          <span class="hidden sm:inline">Pitch</span>
                        </button>
                      `}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      
      <!-- Footer status / Load more -->
      <div class="p-4 bg-[#fafafa] border-t border-black/[0.06] flex items-center justify-between text-xs text-[#6e6e73]">
        <span>Showing <strong>${visible.length.toLocaleString()}</strong> of <strong>${brands.length.toLocaleString()}</strong> matching businesses</span>
        ${visible.length < brands.length ? `
          <button onclick="loadMoreLeads()" class="apple-pill-btn px-4 py-1.5 text-xs font-bold bg-[#1d1d1f] hover:bg-black text-white shadow-2xs cursor-pointer">
            Load More Contacts (Next 50) ↓
          </button>
        ` : '<span class="text-emerald-600 font-bold">✓ All matching contacts loaded</span>'}
      </div>
    </div>
  `;
}

function copyAllVisibleEmails() {
  const emails = (displayedBrands || [])
    .map(b => b.email)
    .filter(e => e && e.trim().length > 0 && e.includes('@'));
  
  if (emails.length === 0) {
    showToast("No emails found in currently filtered leads.");
    return;
  }
  
  const text = emails.join(', ');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 Copied ${emails.length} email addresses to clipboard!`);
    }).catch(() => {
      showToast('Clipboard access denied.');
    });
  } else {
    showToast(`Found ${emails.length} emails.`);
  }
}

function copyAllVisiblePhones() {
  const phones = (displayedBrands || [])
    .map(b => b.phone_number || b.phone)
    .filter(p => p && p.trim().length > 0);
  
  if (phones.length === 0) {
    showToast("No phone numbers found in currently filtered leads.");
    return;
  }
  
  const text = phones.join('\\n');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 Copied ${phones.length} phone numbers to clipboard!`);
    }).catch(() => {
      showToast('Clipboard access denied.');
    });
  } else {
    showToast(`Found ${phones.length} phones.`);
  }
}

function copySingleContact(name, phone, email) {
  const info = `${name} | Phone: ${phone || 'N/A'} | Email: ${email || 'N/A'}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(info).then(() => {
      showToast(`📋 Copied: ${name}`);
    });
  }
}

function exportContactsOnlyCSV() {
  const brands = displayedBrands || [];
  if (brands.length === 0) {
    showToast("No leads to export.");
    return;
  }
  let csv = 'Business Name,City,Country,Phone Number,Email Address\\n';
  brands.forEach(b => {
    const name = `"${(b.name || '').replace(/"/g, '""')}"`;
    const city = `"${(b.city || '').replace(/"/g, '""')}"`;
    const country = `"${(b.country || '').replace(/"/g, '""')}"`;
    const phone = `"${(b.phone_number || b.phone || '').replace(/"/g, '""')}"`;
    const email = `"${(b.email || '').replace(/"/g, '""')}"`;
    csv += `${name},${city},${country},${phone},${email}\\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `getmore_direct_contacts_${brands.length}_leads.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast(`📥 Exported ${brands.length} contacts (Names, Phones, Emails)!`);
}
"""

for fn in ['pitchfinder/index.html', 'pitchfinder.html']:
    filepath = os.path.join(ROOT_DIR, fn)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add Contacts button in Top Overview section
    old_overview_buttons = '<span class="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-semibold border border-slate-200">✉️ 1-Click Email</span>\n        </div>'
    new_overview_buttons = """<span class="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-semibold border border-slate-200">✉️ 1-Click Email</span>
          <button type="button" onclick="setViewMode('contacts'); document.getElementById('results-container').scrollIntoView({ behavior: 'smooth' });" class="apple-pill-btn px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5 ml-1">
            <span>📇 Only Names, Phones &amp; Emails</span>
            <span class="text-[10px]">↓</span>
          </button>
        </div>"""

    if old_overview_buttons in content:
        content = content.replace(old_overview_buttons, new_overview_buttons)
        print(f"✓ Added top overview Contacts shortcut in {fn}")

    # 2. Add Contacts button in Segmented View Switcher
    old_view_switcher = """          <button id="view-cards-btn" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition-all flex items-center gap-1.5" onclick="setViewMode('cards')" title="Grid View">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span class="hidden sm:inline">Grid</span>
          </button>
        </div>"""

    new_view_switcher = """          <button id="view-cards-btn" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition-all flex items-center gap-1.5" onclick="setViewMode('cards')" title="Grid View">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span class="hidden sm:inline">Grid</span>
          </button>
          <button id="view-contacts-btn" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition-all flex items-center gap-1.5" onclick="setViewMode('contacts')" title="Only Emails, Phone Numbers & Business Names">
            <svg class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
            <span class="font-bold text-purple-700">Emails &amp; Phones</span>
          </button>
        </div>"""

    if old_view_switcher in content:
        content = content.replace(old_view_switcher, new_view_switcher)
        print(f"✓ Added view-contacts-btn to segmented control in {fn}")

    # 3. Add Contacts view JS right before renderResults()
    if 'function renderContactsOnlyView' not in content:
        render_results_needle = 'function renderResults() {'
        content = content.replace(render_results_needle, contacts_view_js + '\n' + render_results_needle)
        print(f"✓ Added renderContactsOnlyView JS to {fn}")

    # 4. Update renderResults() to support 'contacts' mode
    old_render_results = """function renderResults() {
  const container = document.getElementById('results-container');
  if (currentViewMode === 'cards') {
    container.innerHTML = renderCardsView(displayedBrands);
  } else if (currentViewMode === 'list') {
    container.innerHTML = renderListView(displayedBrands);
  } else {
    container.innerHTML = renderTableView(displayedBrands);
  }
  updateMetrics();
  updateDailyProgressUI();
}"""

    new_render_results = """function renderResults() {
  const container = document.getElementById('results-container');
  if (currentViewMode === 'cards') {
    container.innerHTML = renderCardsView(displayedBrands);
  } else if (currentViewMode === 'list') {
    container.innerHTML = renderListView(displayedBrands);
  } else if (currentViewMode === 'contacts') {
    container.innerHTML = renderContactsOnlyView(displayedBrands);
  } else {
    container.innerHTML = renderTableView(displayedBrands);
  }
  updateMetrics();
  updateDailyProgressUI();
}"""

    if old_render_results in content:
        content = content.replace(old_render_results, new_render_results)
        print(f"✓ Updated renderResults() for 'contacts' view in {fn}")

    # 5. Update setViewMode() to handle contactsBtn styling
    old_set_view_mode = """function setViewMode(mode) {
  currentViewMode = mode;
  const cardsBtn = document.getElementById('view-cards-btn');
  const listBtn = document.getElementById('view-list-btn');
  const tableBtn = document.getElementById('view-table-btn');

  const activeClass = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#1d1d1f] shadow-sm transition-all flex items-center gap-1.5';
  const inactiveClass = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition-all flex items-center gap-1.5';

  if (cardsBtn) cardsBtn.className = mode === 'cards' ? activeClass : inactiveClass;
  if (listBtn) listBtn.className = mode === 'list' ? activeClass : inactiveClass;
  if (tableBtn) tableBtn.className = mode === 'table' ? activeClass : inactiveClass;

  renderResults();
}"""

    new_set_view_mode = """function setViewMode(mode) {
  currentViewMode = mode;
  const cardsBtn = document.getElementById('view-cards-btn');
  const listBtn = document.getElementById('view-list-btn');
  const tableBtn = document.getElementById('view-table-btn');
  const contactsBtn = document.getElementById('view-contacts-btn');

  const activeClass = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#1d1d1f] shadow-sm transition-all flex items-center gap-1.5';
  const inactiveClass = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition-all flex items-center gap-1.5';

  if (cardsBtn) cardsBtn.className = mode === 'cards' ? activeClass : inactiveClass;
  if (listBtn) listBtn.className = mode === 'list' ? activeClass : inactiveClass;
  if (tableBtn) tableBtn.className = mode === 'table' ? activeClass : inactiveClass;
  if (contactsBtn) contactsBtn.className = mode === 'contacts' ? activeClass : inactiveClass;

  renderResults();
}"""

    if old_set_view_mode in content:
        content = content.replace(old_set_view_mode, new_set_view_mode)
        print(f"✓ Updated setViewMode() for 'contacts' button in {fn}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("🎉 Successfully added Contacts-Only Section and View across all PitchFinder files!")
