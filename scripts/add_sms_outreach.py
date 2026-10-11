import os
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for filename in ['pitchfinder/index.html', 'pitchfinder.html']:
    filepath = os.path.join(ROOT_DIR, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add getDirectSmsUrl, generateSmsPitch, and handleDirectSmsClick
    sms_helper_js = """
function getDirectSmsUrl(b) {
  const phone = b.phone_number || b.phone;
  if (!phone) return '#';
  let num = phone.toString().replace(/\\D/g, '');
  if (b.country === 'USA' || b.country === 'Canada') {
    if (num.length === 10) num = '1' + num;
  } else if (b.country === 'Australia') {
    if (num.startsWith('0')) num = num.substring(1);
    if (num.length === 9) num = '61' + num;
  } else if (b.country === 'United Kingdom') {
    if (num.startsWith('0')) num = num.substring(1);
    if (!num.startsWith('44')) num = '44' + num;
  }
  const msg = typeof generateSmsPitch === 'function' ? generateSmsPitch(b) : generateWhatsAppPitch(b);
  return `sms:+${num}?&body=${encodeURIComponent(msg)}`;
}

function generateSmsPitch(b) {
  const cleanName = (b.name || '').split('–')[0].split('-')[0].trim();
  const reviewsCount = b.gmb_reviews ? b.gmb_reviews.toLocaleString() : '100+';
  const area = b.area || b.city || 'your area';
  const rating = b.gmb_rating ? `★${b.gmb_rating}` : '★4.8';
  const regional = getRegionalPitchPricing(b.country);
  
  if (!b.website_url) {
    return `Hi ${cleanName} team 👋 Saw your Google Maps profile in ${area} with ${reviewsCount} reviews (${rating}) - awesome local reputation!\\n\\nNoticed you don't have an official direct booking website linked on Maps. We build fast Apple-grade direct booking mobile web apps (from ${regional.setup}, 0% commission).\\n\\nCan I send a 30-sec demo preview we made for ${cleanName}? 📱\\n\\nPreview: https://getmoreos.in`;
  }
  return `Hi ${cleanName} team 👋 Found your Google Maps listing in ${area} with ${reviewsCount} reviews!\\n\\nAre you losing 15-25% commissions sending customers to ${regional.aggregator}? We build custom direct booking systems (from ${regional.setup}, 0% commission) so local clients book directly with you.\\n\\nOpen to seeing a quick 30-sec demo preview for ${cleanName}? 🚀\\n\\nPreview: https://getmoreos.in`;
}

function handleDirectSmsClick(brandId) {
  markLeadContacted(brandId);
  updateDailyProgressUI();
  showToast("💬 1-Click SMS / iMessage launched & lead marked contacted!");
}
"""

    if 'function getDirectSmsUrl(' not in content:
        content = content.replace('function getDirectWhatsAppUrl(', sms_helper_js + '\nfunction getDirectWhatsAppUrl(')
        print(f"✓ Added SMS helper functions to {filename}")

    # 2. Update calculatePitchData to tailor pitch offer name for international (Mobile Web App instead of WhatsApp)
    old_pitch_name_check = "    pitchOfferName = '🌐 0% Commission Direct WhatsApp Web App';"
    new_pitch_name_check = "    pitchOfferName = (lead.country === 'India' ? '🌐 0% Commission Direct WhatsApp Web App' : '🌐 0% Commission Direct Mobile Web App');"
    if old_pitch_name_check in content:
        content = content.replace(old_pitch_name_check, new_pitch_name_check)

    old_pitch_name_check_2 = "    pitchOfferName = '🍕 0% Commission WhatsApp Ordering Menu';"
    new_pitch_name_check_2 = "    pitchOfferName = (lead.country === 'India' ? '🍕 0% Commission WhatsApp Ordering Menu' : '🍕 0% Commission Direct Online Ordering App');"
    if old_pitch_name_check_2 in content:
        content = content.replace(old_pitch_name_check_2, new_pitch_name_check_2)

    # 3. Update renderCardsView Action Buttons
    old_cards_action = """            ${b.whatsapp_number ? `
              <a href="${getDirectWhatsAppUrl(b)}" onclick="handleDirectWhatsAppClick('${b.id}')" target="_blank" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl ${contacted ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700'} text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
                <svg class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                <span>${contacted ? '✓ Sent' : 'WhatsApp'}</span>
              </a>
            ` : `
              <a href="tel:${b.phone_number}" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1d1d1f] hover:bg-black text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
                <span>📞 Call Desk</span>
              </a>
            `}"""

    new_cards_action = """            ${b.whatsapp_number ? `
              <a href="${getDirectWhatsAppUrl(b)}" onclick="handleDirectWhatsAppClick('${b.id}')" target="_blank" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl ${contacted ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700'} text-white text-xs font-bold shadow-xs transition-all cursor-pointer" title="1-Click WhatsApp Direct">
                <svg class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                <span>${contacted ? '✓ Sent' : 'WhatsApp'}</span>
              </a>
            ` : `
              <a href="${getDirectSmsUrl(b)}" onclick="handleDirectSmsClick('${b.id}')" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl ${contacted ? 'bg-blue-800 hover:bg-blue-900' : 'bg-[#0071e3] hover:bg-blue-600'} text-white text-xs font-bold shadow-xs transition-all cursor-pointer" title="1-Click SMS / iMessage Direct">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></svg>
                <span>${contacted ? '✓ Sent' : '1-Click SMS'}</span>
              </a>
            `}"""

    if old_cards_action in content:
        content = content.replace(old_cards_action, new_cards_action)
        print(f"✓ Updated renderCardsView action buttons in {filename}")

    # 4. Update renderTableView Reachout Column
    old_table_reachout = """                  ${b.whatsapp_number ? `
                    <a 
                      href="${getDirectWhatsAppUrl(b)}" 
                      onclick="handleDirectWhatsAppClick('${b.id}')"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${contacted ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#25D366] hover:bg-[#20ba59]'} text-white text-xs font-bold font-mono shadow-2xs hover:shadow-xs transition-all w-full justify-between" 
                      title="Open WhatsApp Chat with ${b.name} (${formatDisplayPhone(b.phone_number)})"
                    >
                      <div class="flex items-center gap-1.5 truncate">
                        <svg class="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                        <span class="text-[11px] font-semibold">${formatDisplayPhone(b.phone_number)}</span>
                      </div>
                      <span class="text-[9px] bg-white/20 px-1 py-0.2 rounded font-sans font-bold shrink-0">${contacted ? '✓ Sent' : 'WA ↗'}</span>
                    </a>
                    <div class="mt-1 flex items-center justify-between text-[11px] text-[#6e6e73]">
                      <a href="${getDirectEmailUrl(b)}" onclick="handleDirectEmailClick('${b.id}')" class="hover:text-[#0071e3] truncate max-w-[170px]" title="1-Click Cold Email: ${b.email || ''}">✉️ ${b.email || 'Email Ready'}</a>
                    </div>
                  ` : `
                    <a 
                      href="${getDirectEmailUrl(b)}" 
                      onclick="handleDirectEmailClick('${b.id}')"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${contacted ? 'bg-slate-700 hover:bg-slate-800' : 'bg-[#0071e3] hover:bg-blue-600'} text-white text-xs font-semibold shadow-2xs hover:shadow-xs transition-all w-full justify-between" 
                      title="Send 1-Click Cold Email Pitch to ${b.email || ''}"
                    >
                      <div class="flex items-center gap-1.5 truncate">
                        <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        <span class="text-[11px] font-mono truncate font-medium">${b.email || '1-Click Email'}</span>
                      </div>
                      <span class="text-[9px] bg-white/25 px-1.5 py-0.2 rounded font-sans font-bold shrink-0">${contacted ? '✓ Sent' : 'Email ↗'}</span>
                    </a>
                    <div class="mt-1 flex items-center justify-between text-[11px] text-[#6e6e73] font-mono">
                      <a href="tel:${b.phone_number || b.phone}" class="hover:text-[#0071e3] flex items-center gap-1 font-semibold" title="Direct Desk Call">
                        <span>📞 ${formatDisplayPhone(b.phone_number || b.phone)}</span>
                      </a>
                      <span class="text-[9px] text-[#86868b] bg-black/[0.04] px-1 py-0.2 rounded font-sans">Desk Landline</span>
                    </div>
                  `}"""

    new_table_reachout = """                  ${b.whatsapp_number ? `
                    <a 
                      href="${getDirectWhatsAppUrl(b)}" 
                      onclick="handleDirectWhatsAppClick('${b.id}')"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${contacted ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#25D366] hover:bg-[#20ba59]'} text-white text-xs font-bold font-mono shadow-2xs hover:shadow-xs transition-all w-full justify-between" 
                      title="Open WhatsApp Chat with ${b.name} (${formatDisplayPhone(b.phone_number)})"
                    >
                      <div class="flex items-center gap-1.5 truncate">
                        <svg class="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                        <span class="text-[11px] font-semibold">${formatDisplayPhone(b.phone_number)}</span>
                      </div>
                      <span class="text-[9px] bg-white/20 px-1 py-0.2 rounded font-sans font-bold shrink-0">${contacted ? '✓ Sent' : 'WA ↗'}</span>
                    </a>
                    <div class="mt-1 flex items-center justify-between text-[11px] text-[#6e6e73]">
                      <a href="${getDirectEmailUrl(b)}" onclick="handleDirectEmailClick('${b.id}')" class="hover:text-[#0071e3] truncate max-w-[130px]" title="1-Click Cold Email: ${b.email || ''}">✉️ ${b.email || 'Email Ready'}</a>
                      <a href="tel:${b.phone_number || b.phone}" class="hover:text-[#0071e3] font-mono text-[10px]" title="Direct Call">📞 Call</a>
                    </div>
                  ` : `
                    <a 
                      href="${getDirectSmsUrl(b)}" 
                      onclick="handleDirectSmsClick('${b.id}')"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${contacted ? 'bg-blue-800 hover:bg-blue-900' : 'bg-[#0071e3] hover:bg-blue-600'} text-white text-xs font-bold font-mono shadow-2xs hover:shadow-xs transition-all w-full justify-between" 
                      title="1-Click SMS / iMessage Pitch to ${b.name} (${formatDisplayPhone(b.phone_number)})"
                    >
                      <div class="flex items-center gap-1.5 truncate">
                        <svg class="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></svg>
                        <span class="text-[11px] font-semibold">${formatDisplayPhone(b.phone_number)}</span>
                      </div>
                      <span class="text-[9px] bg-white/20 px-1 py-0.2 rounded font-sans font-bold shrink-0">${contacted ? '✓ Sent' : 'SMS ↗'}</span>
                    </a>
                    <div class="mt-1 flex items-center justify-between text-[11px] text-[#6e6e73]">
                      <a href="${getDirectEmailUrl(b)}" onclick="handleDirectEmailClick('${b.id}')" class="hover:text-[#0071e3] truncate max-w-[130px]" title="1-Click Cold Email: ${b.email || ''}">✉️ ${b.email || 'Email Ready'}</a>
                      <a href="tel:${b.phone_number || b.phone}" class="hover:text-[#0071e3] font-mono text-[10px]" title="Direct Call">📞 Call</a>
                    </div>
                  `}"""

    if old_table_reachout in content:
        content = content.replace(old_table_reachout, new_table_reachout)
        print(f"✓ Updated renderTableView reachout column in {filename}")

    # 5. Update renderListView Action Buttons
    old_list_reachout = """                ${b.whatsapp_number ? `
                  <a href="${getDirectWhatsAppUrl(b)}" onclick="handleDirectWhatsAppClick('${b.id}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${contacted ? 'bg-emerald-600 text-white' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-900 border border-emerald-200/80'} text-xs font-semibold font-mono shadow-xs hover:shadow-sm transition-all group/wa" title="1-Click WhatsApp Chat with ${b.name}">
                    <svg class="w-3.5 h-3.5 fill-[#25D366] text-[#25D366] group-hover/wa:scale-110 transition-transform shrink-0" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                    <span>${formatDisplayPhone(b.phone_number)}</span>
                    <span class="text-[9px] font-sans font-bold ${contacted ? 'bg-white/20 text-white' : 'bg-emerald-200/70 text-emerald-900'} px-1 py-0.2 rounded">${contacted ? '✓ Sent' : 'WA ↗'}</span>
                  </a>
                ` : `
                  <a href="${getDirectEmailUrl(b)}" onclick="handleDirectEmailClick('${b.id}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${contacted ? 'bg-slate-700 text-white' : 'bg-blue-50 hover:bg-blue-100 text-[#0071e3] border border-blue-200/80'} text-xs font-semibold font-mono shadow-xs hover:shadow-sm transition-all" title="1-Click Cold Email Pitch to ${b.email || ''}">
                    <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    <span class="truncate max-w-[130px] font-sans">${b.email || 'Email Ready'}</span>
                    <span class="text-[10px] font-sans font-bold ${contacted ? 'bg-white/20 text-white' : 'bg-blue-200/70 text-blue-900'} px-1 py-0.2 rounded">${contacted ? '✓ Sent' : 'Email ↗'}</span>
                  </a>
                `}"""

    new_list_reachout = """                ${b.whatsapp_number ? `
                  <a href="${getDirectWhatsAppUrl(b)}" onclick="handleDirectWhatsAppClick('${b.id}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${contacted ? 'bg-emerald-600 text-white' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-900 border border-emerald-200/80'} text-xs font-semibold font-mono shadow-xs hover:shadow-sm transition-all group/wa" title="1-Click WhatsApp Chat with ${b.name}">
                    <svg class="w-3.5 h-3.5 fill-[#25D366] text-[#25D366] group-hover/wa:scale-110 transition-transform shrink-0" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                    <span>${formatDisplayPhone(b.phone_number)}</span>
                    <span class="text-[9px] font-sans font-bold ${contacted ? 'bg-white/20 text-white' : 'bg-emerald-200/70 text-emerald-900'} px-1 py-0.2 rounded">${contacted ? '✓ Sent' : 'WA ↗'}</span>
                  </a>
                ` : `
                  <a href="${getDirectSmsUrl(b)}" onclick="handleDirectSmsClick('${b.id}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${contacted ? 'bg-blue-800 text-white' : 'bg-blue-50 hover:bg-blue-100 text-[#0071e3] border border-blue-200/80'} text-xs font-semibold font-mono shadow-xs hover:shadow-sm transition-all" title="1-Click SMS / iMessage Pitch to ${b.name}">
                    <svg class="w-3.5 h-3.5 fill-[#0071e3] shrink-0" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></svg>
                    <span>${formatDisplayPhone(b.phone_number)}</span>
                    <span class="text-[9px] font-sans font-bold ${contacted ? 'bg-white/20 text-white' : 'bg-blue-200/70 text-blue-900'} px-1 py-0.2 rounded">${contacted ? '✓ Sent' : 'SMS ↗'}</span>
                  </a>
                `}"""

    if old_list_reachout in content:
        content = content.replace(old_list_reachout, new_list_reachout)
        print(f"✓ Updated renderListView action buttons in {filename}")

    # 6. Update openPitchModal
    old_modal_wa = """  if (b.whatsapp_number) {
    modalWaBtn.classList.remove('hidden');
    modalWaBtn.href = waUrl;
    modalWaBtn.onclick = () => handleDirectWhatsAppClick(b.id);
    if (emailBtn) {
      emailBtn.className = 'apple-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 bg-white text-[#0071e3]';
      emailBtn.href = emailPitch.mailto;
      emailBtn.onclick = () => handleDirectEmailClick(b.id);
      emailBtn.title = `Send Email Pitch to ${b.email || ''}`;
      emailBtn.innerHTML = `<span>✉️ Email Pitch</span>`;
    }
  } else {
    modalWaBtn.classList.add('hidden');
    if (emailBtn) {
      emailBtn.className = 'apple-pill-btn px-4 py-2 text-xs font-bold flex items-center gap-1.5 bg-[#0071e3] hover:bg-blue-600 text-white shadow-sm cursor-pointer';
      emailBtn.href = emailPitch.mailto;
      emailBtn.onclick = () => handleDirectEmailClick(b.id);
      emailBtn.title = `Send 1-Click Email Pitch to ${b.email || ''}`;
      emailBtn.innerHTML = `<span>✉️ Send 1-Click Email Pitch</span><span class="text-[10px]">↗</span>`;
    }
  }"""

    new_modal_wa = """  if (b.whatsapp_number) {
    modalWaBtn.classList.remove('hidden');
    modalWaBtn.href = waUrl;
    modalWaBtn.onclick = () => handleDirectWhatsAppClick(b.id);
    modalWaBtn.className = 'apple-pill-btn px-4 py-2 text-xs font-bold flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm cursor-pointer';
    modalWaBtn.innerHTML = `<svg class="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg> <span>💬 1-Click WhatsApp</span>`;
    if (emailBtn) {
      emailBtn.className = 'apple-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 bg-white text-[#0071e3] border border-blue-200/80';
      emailBtn.href = emailPitch.mailto;
      emailBtn.onclick = () => handleDirectEmailClick(b.id);
      emailBtn.title = `Send Email Pitch to ${b.email || ''}`;
      emailBtn.innerHTML = `<span>✉️ Email Pitch</span>`;
    }
  } else {
    modalWaBtn.classList.remove('hidden');
    modalWaBtn.href = getDirectSmsUrl(b);
    modalWaBtn.onclick = () => handleDirectSmsClick(b.id);
    modalWaBtn.className = 'apple-pill-btn px-4 py-2 text-xs font-bold flex items-center gap-1.5 bg-[#0071e3] hover:bg-blue-600 text-white shadow-sm cursor-pointer';
    modalWaBtn.innerHTML = `<svg class="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></svg> <span>💬 1-Click SMS / iMessage</span>`;
    if (emailBtn) {
      emailBtn.className = 'apple-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 bg-white text-[#0071e3] border border-blue-200/80';
      emailBtn.href = emailPitch.mailto;
      emailBtn.onclick = () => handleDirectEmailClick(b.id);
      emailBtn.title = `Send 1-Click Email Pitch to ${b.email || ''}`;
      emailBtn.innerHTML = `<span>✉️ Email Pitch</span>`;
    }
  }"""

    if old_modal_wa in content:
        content = content.replace(old_modal_wa, new_modal_wa)
        print(f"✓ Updated openPitchModal in {filename}")

    # Modal pitch title & dynamic script
    content = content.replace('<span>💬</span> 1-Click WhatsApp Direct Pitch Script', '<span>💬</span> <span id="modal-script-type-label">1-Click WhatsApp Direct Pitch Script</span>')
    
    old_script_set = "  document.getElementById('modal-pitch-script').textContent = generateWhatsAppPitch(b);"
    new_script_set = """  const scriptHeading = document.getElementById('modal-script-type-label');
  if (scriptHeading) {
    scriptHeading.textContent = b.whatsapp_number ? '1-Click WhatsApp Direct Pitch Script' : '1-Click SMS / iMessage Direct Pitch Script';
  }
  document.getElementById('modal-pitch-script').textContent = b.whatsapp_number ? generateWhatsAppPitch(b) : generateSmsPitch(b);"""

    if old_script_set in content:
        content = content.replace(old_script_set, new_script_set)
        print(f"✓ Updated modal pitch script generation in {filename}")

    # 7. Update sendWhatsAppAndNext in Queue
    old_queue_send = """  if (b.whatsapp_number) {
    const waUrl = getDirectWhatsAppUrl(b);
    window.location.href = waUrl;
    markLeadContacted(b.id);
    showToast(`⚡ WhatsApp opened! "${b.name}" marked contacted.`);
  } else {
    const mailUrl = getDirectEmailUrl(b);
    window.location.href = mailUrl;
    markLeadContacted(b.id);
    showToast(`✉️ 1-Click Email opened! "${b.name}" marked contacted.`);
  }"""

    new_queue_send = """  if (b.whatsapp_number) {
    const waUrl = getDirectWhatsAppUrl(b);
    window.location.href = waUrl;
    markLeadContacted(b.id);
    showToast(`⚡ WhatsApp opened! "${b.name}" marked contacted.`);
  } else {
    const smsUrl = getDirectSmsUrl(b);
    window.location.href = smsUrl;
    markLeadContacted(b.id);
    showToast(`💬 1-Click SMS launched! "${b.name}" marked contacted.`);
  }"""

    if old_queue_send in content:
        content = content.replace(old_queue_send, new_queue_send)
        print(f"✓ Updated queue send in {filename}")

    # 8. Update queue launch button in loadQueueLead
    old_queue_load_btn = "queueLaunchBtn.innerHTML = '<span>Open 1-Click Email &amp; Next</span> <span class=\"text-xs bg-white/20 px-2 py-0.5 rounded text-white font-mono\">Space ␣</span>';"
    new_queue_load_btn = "queueLaunchBtn.innerHTML = '<span>Launch 1-Click SMS &amp; Next</span> <span class=\"text-xs bg-white/20 px-2 py-0.5 rounded text-white font-mono\">Space ␣</span>';"
    if old_queue_load_btn in content:
        content = content.replace(old_queue_load_btn, new_queue_load_btn)
        print(f"✓ Updated queue load button text in {filename}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("🎉 Completed adding 1-Click SMS to all files!")
