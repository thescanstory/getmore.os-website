import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const masterPath = path.join(ROOT_DIR, 'data', 'leads', 'master_leads_10000.json');

const leads = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

leads.forEach((l, i) => {
  const name = (l.name || '').toLowerCase();
  if (!Array.isArray(l.tags)) l.tags = [];

  // Tattoo
  if (name.includes('tattoo') || name.includes('ink ') || name.includes('ink\'') || name.includes('piercing') || name.includes('body art')) {
    l.tags = ['tattoo', 'tattoo studio', 'ink', 'body art', 'piercing', 'verified'];
    l.category = 'tattoo';
  }
  // Solar
  else if (name.includes('solar') || name.includes('sunpv') || name.includes('photovoltaic') || name.includes('clean energy') || name.includes('rooftop solar')) {
    l.tags = ['solar', 'solar energy', 'clean energy', 'rooftop solar', 'epc', 'verified'];
    l.category = 'solar';
  }
  // Dental
  else if (name.includes('dental') || name.includes('dentist') || name.includes('teeth') || name.includes('smile') || name.includes('ortho') || name.includes('implant direct')) {
    l.tags = ['dentist', 'dental', 'clinic', 'teeth', 'oral care', 'verified'];
    l.category = 'dentist';
  }
  // Gym & Fitness
  else if (name.includes('fitness') || name.includes('gym') || name.includes('crossfit') || name.includes('workout') || name.includes('bouldering') || name.includes('training')) {
    l.tags = ['gym', 'fitness', 'workout', 'training', 'wellness', 'verified'];
    l.category = 'gym';
  }
  // Car Detailing & Wraps
  else if (name.includes('detailing') || name.includes('ppf') || name.includes('ceramic') || name.includes('auto wrap') || name.includes('car care') || name.includes('carzspa') || name.includes('opti-coat')) {
    l.tags = ['car detailing', 'ppf', 'ceramic coating', 'auto care', 'car wash', 'verified'];
    l.category = 'car detailing';
  }
  // Photography
  else if (name.includes('photo') || name.includes('photography') || name.includes('cinematography') || name.includes('wedding film') || name.includes('camera') || name.includes('lens')) {
    l.tags = ['photography', 'wedding photography', 'events', 'photoshoot', 'cinematography', 'verified'];
    l.category = 'photography';
  }
  // Pet & Vet
  else if (name.includes('pet') || name.includes('vet') || name.includes('veterinary') || name.includes('animal') || name.includes('paws') || name.includes('bark')) {
    l.tags = ['vet', 'veterinary', 'pet clinic', 'animal care', 'pet hospital', 'verified'];
    l.category = 'vet';
  }
  // Salon & Spa
  else if (name.includes('salon') || name.includes('spa') || name.includes('hair') || name.includes('beauty') || name.includes('makeup') || name.includes('barber')) {
    l.tags = ['salon', 'hair studio', 'spa', 'beauty', 'makeup', 'verified'];
    l.category = 'salon';
  }
  // Brewery & Pub
  else if (name.includes('brew') || name.includes('pub') || name.includes('beer') || name.includes('taproom')) {
    l.tags = ['brewery', 'pub', 'food', 'craft beer', 'nightlife', 'verified'];
    l.category = 'brewery';
  }
  // Cafe & Coffee
  else if (name.includes('cafe') || name.includes('coffee') || name.includes('roastery') || name.includes('bakehouse') || name.includes('bakery')) {
    l.tags = ['cafe', 'coffee', 'bakery', 'food', 'breakfast', 'verified'];
    l.category = 'cafe';
  }
  // Restaurant & Dining
  else if (name.includes('restaurant') || name.includes('dining') || name.includes('kitchen') || name.includes('bhavan') || name.includes('foods') || name.includes('biryani') || name.includes('hotel') || name.includes('dosa')) {
    l.tags = ['food', 'restaurant', 'dining', 'south indian', 'verified'];
    l.category = 'food';
  }
});

fs.writeFileSync(masterPath, JSON.stringify(leads, null, 2), 'utf8');
console.log(`Successfully normalized tags across all ${leads.length} leads in master database!`);
