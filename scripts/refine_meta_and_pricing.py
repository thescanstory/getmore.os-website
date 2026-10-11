import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for filename in ['pitchfinder/index.html', 'pitchfinder.html']:
    filepath = os.path.join(ROOT_DIR, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix getVerifiedEntityMeta order: Move salon & spa check BEFORE brewery & pub
    old_meta = """  if (full.includes('biryani') || full.includes('restaurant') || full.includes('dining')) return { category: 'Fine Dining & Restaurant', subcategory: 'Restaurant' };
  if (full.includes('brewery') || full.includes('pub') || full.includes('bar')) return { category: 'Microbrewery & Pub', subcategory: 'Brewery & Dining' };
  if (full.includes('bakery') || full.includes('bakehouse') || full.includes('dessert')) return { category: 'Artisanal Bakery', subcategory: 'Bakery & Patisserie' };
  if (full.includes('salon') || full.includes('spa') || full.includes('hair') || full.includes('beauty')) return { category: 'Luxury Salon & Spa', subcategory: 'Salon & Spa' };"""

    new_meta = """  if (full.includes('salon') || full.includes('spa') || full.includes('hair') || full.includes('beauty') || full.includes('barber')) return { category: 'Luxury Salon & Spa', subcategory: 'Salon & Spa' };
  if (full.includes('biryani') || full.includes('restaurant') || full.includes('dining')) return { category: 'Fine Dining & Restaurant', subcategory: 'Restaurant' };
  if (full.includes('bakery') || full.includes('bakehouse') || full.includes('dessert')) return { category: 'Artisanal Bakery', subcategory: 'Bakery & Patisserie' };
  if (full.includes('brewery') || full.includes('pub') || (full.includes('bar') && !full.includes('barber'))) return { category: 'Microbrewery & Pub', subcategory: 'Brewery & Dining' };"""

    if old_meta in content:
        content = content.replace(old_meta, new_meta)
        print(f"✓ Fixed entity meta order in {filename}")

    # 2. Dynamic regional pricing in card view
    old_card_price = '<span class="text-[11px] font-bold text-emerald-700 shrink-0">₹9,999</span>'
    new_card_price = '<span class="text-[11px] font-bold text-emerald-700 shrink-0">${getRegionalPitchPricing(b.country).setup}</span>'
    if old_card_price in content:
        content = content.replace(old_card_price, new_card_price)
        print(f"✓ Fixed card regional price in {filename}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("🎉 Completed refinement of entity meta and pricing!")
