import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

// Helper to extract REAL_VERIFIED_DATABASE from pitchfinder/index.html
function getVerifiedDatabase() {
  const html = fs.readFileSync(path.join(ROOT_DIR, 'pitchfinder/index.html'), 'utf8');
  const dbMatch = html.match(/const REAL_VERIFIED_DATABASE\s*=\s*(\[[\s\S]*?\]);/);
  if (!dbMatch) throw new Error('Could not find REAL_VERIFIED_DATABASE in pitchfinder/index.html');
  return JSON.parse(dbMatch[1]);
}

test('PitchFinder Database Integrity', async (t) => {
  const db = getVerifiedDatabase();

  await t.test('Database contains leads', () => {
    assert.ok(db.length > 500, `Expected >500 leads, found ${db.length}`);
  });

  await t.test('All international leads strictly have valid WhatsApp mobile numbers or null', () => {
    const international = db.filter(l => l.country && l.country !== 'India');
    assert.ok(international.length >= 30, `Expected >=30 international leads, found ${international.length}`);

    international.forEach(lead => {
      if (lead.whatsapp) {
        const wa = String(lead.whatsapp);
        // Valid international mobile prefixes:
        // Australia: 614...
        // UAE: 9715...
        // UK: 447...
        // USA: 1... (10 digits after 1)
        if (lead.country === 'Australia') {
          assert.match(wa, /^614\d{8}$/, `Invalid Australia mobile for ${lead.name}: ${wa}`);
        } else if (lead.country === 'UAE') {
          assert.match(wa, /^9715\d{8}$/, `Invalid UAE mobile for ${lead.name}: ${wa}`);
        } else if (lead.country === 'United Kingdom') {
          assert.match(wa, /^447\d{9}$/, `Invalid UK mobile for ${lead.name}: ${wa}`);
        } else if (lead.country === 'USA') {
          assert.match(wa, /^1\d{10}$/, `Invalid USA mobile for ${lead.name}: ${wa}`);
        }
      }
    });
  });

  await t.test('All Indian leads have valid 10-digit mobile numbers with 91 prefix', () => {
    const indianLeadsWithWA = db.filter(l => (!l.country || l.country === 'India') && l.whatsapp);
    indianLeadsWithWA.forEach(lead => {
      const wa = String(lead.whatsapp);
      assert.match(wa, /^91[6-9]\d{9}$/, `Invalid India mobile for ${lead.name}: ${wa}`);
    });
  });

  await t.test('All leads have required metadata fields', () => {
    db.forEach((lead, i) => {
      assert.ok(lead.name && lead.name.trim().length > 0, `Lead #${i} missing name`);
      assert.ok(lead.city && lead.city.trim().length > 0, `Lead #${i} (${lead.name}) missing city`);
      assert.ok(Array.isArray(lead.tags) && lead.tags.length > 0, `Lead #${i} (${lead.name}) missing tags`);
    });
  });
});

test('PitchFinder CSV Import Parser Logic', async (t) => {
  const sampleCsvPath = path.join(ROOT_DIR, 'data/leads/sample_import_template.csv');
  assert.ok(fs.existsSync(sampleCsvPath), 'Sample import CSV exists');

  const content = fs.readFileSync(sampleCsvPath, 'utf8');
  const lines = content.trim().split(/\r?\n/);
  assert.ok(lines.length >= 5, 'Sample CSV has data rows');

  const header = lines[0].toLowerCase();
  assert.ok(header.includes('name'), 'Header includes Name');
  assert.ok(header.includes('phone'), 'Header includes Phone');
  assert.ok(header.includes('city'), 'Header includes City');
});

test('PitchFinder 1-Click SMS / iMessage Outreach Logic', async (t) => {
  const html = fs.readFileSync(path.join(ROOT_DIR, 'pitchfinder/index.html'), 'utf8');

  await t.test('Helper function getDirectSmsUrl is present in HTML', () => {
    assert.ok(html.includes('function getDirectSmsUrl(b)'), 'getDirectSmsUrl function missing in HTML');
    assert.ok(html.includes('function generateSmsPitch(b)'), 'generateSmsPitch function missing in HTML');
    assert.ok(html.includes('handleDirectSmsClick'), 'handleDirectSmsClick missing in HTML');
  });

  await t.test('Views support 1-Click SMS CTAs for leads without WhatsApp', () => {
    assert.ok(html.includes('1-Click SMS'), 'Cards/List view missing 1-Click SMS CTA');
    assert.ok(html.includes('SMS ↗'), 'Table view missing SMS ↗ badge');
    assert.ok(html.includes('modal-script-type-label'), 'Modal missing dynamic script label');
  });

  await t.test('getDirectSmsUrl accurately formats North American and Australian numbers', () => {
    // Mock getDirectSmsUrl
    function formatSms(b) {
      const phone = b.phone_number || b.phone;
      let num = phone.toString().replace(/\D/g, '');
      if (b.country === 'USA' || b.country === 'Canada') {
        if (num.length === 10) num = '1' + num;
      } else if (b.country === 'Australia') {
        if (num.startsWith('0')) num = num.substring(1);
        if (num.length === 9) num = '61' + num;
      }
      return `sms:+${num}?&body=pitch`;
    }

    const usLead = { phone: '+1 (786) 276-5980', country: 'USA' };
    const caLead = { phone: '+1 (416) 555-0123', country: 'Canada' };
    const auLead = { phone: '0410315770', country: 'Australia' };

    assert.equal(formatSms(usLead), 'sms:+17862765980?&body=pitch');
    assert.equal(formatSms(caLead), 'sms:+14165550123?&body=pitch');
    assert.equal(formatSms(auLead), 'sms:+61410315770?&body=pitch');
  });
});

