import json
import re
import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 1. Update data/leads/master_leads_10000.json
master_json_path = os.path.join(ROOT_DIR, 'data', 'leads', 'master_leads_10000.json')
with open(master_json_path, 'r', encoding='utf-8') as f:
    leads = json.load(f)

nullified = 0
for lead in leads:
    country = lead.get('country')
    if country and country != 'India':
        lead['whatsapp'] = None
        lead['whatsapp_number'] = None
        nullified += 1

with open(master_json_path, 'w', encoding='utf-8') as f:
    json.dump(leads, f, indent=2, ensure_ascii=False)

print(f"✓ Updated master_leads_10000.json: Nullified {nullified} international whatsapp numbers.")

# 2. Update pitchfinder/index.html and pitchfinder.html
html_files = [
    os.path.join(ROOT_DIR, 'pitchfinder', 'index.html'),
    os.path.join(ROOT_DIR, 'pitchfinder.html')
]

for html_path in html_files:
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    db_match = re.search(r'const REAL_VERIFIED_DATABASE = (\[.*?\]);', html, re.DOTALL)
    if not db_match:
        print(f"❌ REAL_VERIFIED_DATABASE not found in {html_path}")
        continue

    db_leads = json.loads(db_match.group(1))
    modified = 0
    for lead in db_leads:
        country = lead.get('country')
        if country and country != 'India':
            lead['whatsapp'] = None
            lead['whatsapp_number'] = None
            modified += 1

    new_db_str = 'const REAL_VERIFIED_DATABASE = ' + json.dumps(db_leads, ensure_ascii=False) + ';'
    html = html[:db_match.start()] + new_db_str + html[db_match.end():]

    # Also update loadQueueLead to handle when a lead has no whatsapp_number
    old_queue_lead = "  document.getElementById('queue-phone-display').textContent = formatDisplayPhone(b.phone_number);"
    new_queue_lead = """  document.getElementById('queue-phone-display').textContent = formatDisplayPhone(b.phone_number);
  const queueLaunchBtn = document.getElementById('queue-launch-btn');
  if (queueLaunchBtn) {
    if (b.whatsapp_number) {
      queueLaunchBtn.className = 'apple-pill-btn px-6 py-3 text-sm font-bold flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md hover:shadow-lg transition-all w-full sm:w-auto cursor-pointer';
      queueLaunchBtn.innerHTML = '<span>Open WhatsApp &amp; Next</span> <span class="text-xs bg-white/20 px-2 py-0.5 rounded text-white font-mono">Space ␣</span>';
    } else {
      queueLaunchBtn.className = 'apple-pill-btn px-6 py-3 text-sm font-bold flex items-center justify-center gap-2 bg-[#0071e3] hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all w-full sm:w-auto cursor-pointer';
      queueLaunchBtn.innerHTML = '<span>Open 1-Click Email &amp; Next</span> <span class="text-xs bg-white/20 px-2 py-0.5 rounded text-white font-mono">Space ␣</span>';
    }
  }"""

    if old_queue_lead in html and 'queueLaunchBtn' not in html:
        html = html.replace(old_queue_lead, new_queue_lead)

    # Update badge in renderCardsView to show appropriate label
    old_badge = '<span>Verified Mobile & WhatsApp Lines</span>'
    new_badge = '<span>${currentSelectedCountry === "India" ? "Verified Mobile & WhatsApp Lines" : "Direct Phone & Email Outreach Lines"}</span>'
    html = html.replace(old_badge, new_badge)

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"✓ Updated {os.path.basename(html_path)}: Nullified {modified} international whatsapp entries.")

print("🎉 Successfully cleaned all international leads!")
