import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for fn in ['pitchfinder/index.html', 'pitchfinder.html']:
    filepath = os.path.join(ROOT_DIR, fn)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_target = """            <div class="flex items-center gap-1.5">
              <button onclick="handleDirectInstagramClick('${b.id}')" class="w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 grid place-items-center transition-all cursor-pointer" title="1-Click Instagram DM: @${getBusinessInstagramHandle(b)}">
                <span class="text-xs">📸</span>
              </button>"""

    new_target = """            <div class="flex items-center gap-1.5">
              ${b.instagram ? `
                <button onclick="handleDirectInstagramClick('${b.id}')" class="w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 grid place-items-center transition-all cursor-pointer" title="1-Click Instagram DM: @${b.instagram}">
                  <span class="text-xs">💬</span>
                </button>
              ` : `
                <button onclick="openPitchModal('${b.id}')" class="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-purple-50 text-[#86868b] hover:text-purple-700 border border-black/[0.06] grid place-items-center transition-all cursor-pointer" title="Instagram: Needs Link-in-Bio Setup (Click to Pitch)">
                  <span class="text-[11px]">📸</span>
                </button>
              `}"""

    if old_target in content:
        content = content.replace(old_target, new_target)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Updated list view button in {fn}")
    else:
        print(f"! Target not found in {fn}")
