import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const cleanCardsViewFunction = `function renderCardsView(brands) {
  if (brands.length === 0) {
    return \`
      <div class="text-center py-20 bg-white rounded-2xl border border-black/[0.08] p-8 shadow-xs">
        <div class="text-4xl mb-3">🔍</div>
        <h3 class="text-lg font-bold text-[#1d1d1f] mb-1">No Matching Leads Found</h3>
        <p class="text-xs text-[#6e6e73]">Try adjusting your search keyword, category, or city filter.</p>
      </div>
    \`;
  }

  const visible = brands.slice(0, currentRenderLimit);

  return \`
    <div class="mb-4 text-xs text-[#6e6e73] font-medium flex items-center justify-between flex-wrap gap-2">
      <span>Showing <strong>\${visible.length.toLocaleString()}</strong> verified businesses</span>
      <div class="flex items-center gap-2">
        <span class="text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Verified Mobile & WhatsApp Lines</span>
        </span>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      \${visible.map(b => {
        const contacted = isLeadContacted(b.id);
        const mapsUrl = createGoogleMapsUrl(b.name, b.city + ' ' + (b.area || ''));
        return \`
        <div class="p-5 flex flex-col justify-between bg-white rounded-2xl border \${contacted ? 'border-emerald-300 bg-emerald-50/15' : 'border-black/[0.08] hover:border-black/20 hover:shadow-md'} transition-all group">
          <div>
            <!-- Header: Title & Rating -->
            <div class="flex items-start justify-between gap-2 mb-1.5">
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-[15px] text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors leading-snug line-clamp-1" title="\${b.name}">
                  \${b.name}
                </h3>
                <p class="text-xs text-[#86868b] truncate mt-0.5">
                  \${b.subcategory || b.category || 'Local Business'} • <span class="font-medium text-[#1d1d1f]">\${b.area || b.city}</span>
                </p>
              </div>
              <div class="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                <span>★ \${b.gmb_rating || '4.8'}</span>
                <span class="text-[10px] text-[#86868b] font-normal">(\${(b.gmb_reviews || 0).toLocaleString()})</span>
              </div>
            </div>

            <!-- Website Status Row (Honest: verified link vs no website) -->
            <div class="my-3">
              \${b.website_url ? \`
                <a href="\${getSafeWebsiteUrl(b)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs text-[#0071e3] hover:underline font-medium truncate max-w-full" title="Visit Verified Website">
                  <span>🌐</span>
                  <span class="truncate">\${b.website_display || 'Visit Official Website'}</span>
                  <span class="text-[10px]">↗</span>
                </a>
              \` : \`
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>No Official Website Detected</span>
                </div>
              \`}
            </div>

            <!-- Pitch Angle Card -->
            <div class="bg-[#f5f5f7] p-2.5 rounded-xl border border-black/[0.04] mb-3">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-[#1d1d1f] truncate flex items-center gap-1">
                  <span class="text-[#0071e3]">⚡</span> \${b.pitch_offer_name || '0% Commission Direct Website'}
                </span>
                <span class="text-[11px] font-bold text-emerald-700 shrink-0">₹9,999</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div class="pt-3 border-t border-black/[0.06] flex items-center gap-2">
            \${b.whatsapp_number ? \`
              <a href="\${getDirectWhatsAppUrl(b)}" onclick="handleDirectWhatsAppClick('\${b.id}')" target="_blank" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl \${contacted ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700'} text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
                <svg class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                <span>\${contacted ? '✓ Sent' : 'WhatsApp'}</span>
              </a>
            \` : \`
              <a href="tel:\${b.phone_number}" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1d1d1f] hover:bg-black text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
                <span>📞 Call Desk</span>
              </a>
            \`}

            <a href="\${mapsUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 rounded-xl bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-semibold border border-black/[0.08] transition-all flex items-center gap-1 cursor-pointer" title="View on Google Maps">
              <span>📍 Maps</span>
            </a>

            <button onclick="openPitchModal('\${b.id}')" class="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0071e3] text-xs font-semibold border border-blue-200/80 transition-all flex items-center gap-1 cursor-pointer" title="Open Custom Pitch Scripts">
              <span>Pitch</span>
            </button>
          </div>
        </div>
      \`;
      }).join('')}
    </div>
  \`;
}`;

function patchCards(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const cardsRegex = /function renderCardsView\(brands\)\s*\{[\s\S]*?^\}/m;
  if (cardsRegex.test(content)) {
    content = content.replace(cardsRegex, cleanCardsViewFunction);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Cleaned card UI in ${filePath}`);
  } else {
    console.error(`Could not match renderCardsView in ${filePath}`);
  }
}

patchCards(path.join(ROOT_DIR, 'pitchfinder/index.html'));
patchCards(path.join(ROOT_DIR, 'pitchfinder.html'));

console.log('🎉 Refined cards UI applied successfully!');
