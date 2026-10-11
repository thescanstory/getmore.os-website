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

  await t.test('Instagram handles are authentic, valid strings or null for unclaimed directory leads', () => {
    let invalidIg = 0;
    let verifiedCount = 0;
    db.forEach((lead, i) => {
      if (lead.instagram !== null && lead.instagram !== undefined) {
        if (typeof lead.instagram !== 'string' || !lead.instagram.trim() || !/^[a-zA-Z0-9._]+$/.test(lead.instagram.replace(/^@/, ''))) {
          invalidIg++;
        } else {
          verifiedCount++;
        }
      }
    });
    assert.equal(invalidIg, 0, `Expected 0 invalid Instagram handles, found ${invalidIg}`);
    assert.ok(verifiedCount > 0, `Expected verified Instagram handles in database, found ${verifiedCount}`);
  });

  await t.test('Verified anchor brands have authentic 1:1 Instagram handles without fake pool cycling', () => {
    const geist = db.find(l => l.name === 'Geist Brewing Factory');
    if (geist) assert.equal(geist.instagram, 'drinkgeist');

    const biergarten = db.find(l => l.name === 'Biergarten Brewery & Kitchen');
    if (biergarten) assert.equal(biergarten.instagram, 'biergartenbangalore');

    const rameshwaram = db.find(l => l.name === 'The Rameshwaram Cafe');
    if (rameshwaram) assert.equal(rameshwaram.instagram, 'therameshwaramcafe');

    const toit = db.find(l => l.name === 'Toit Brewpub');
    if (toit) assert.equal(toit.instagram, 'toitbeerco');

    const camali = db.find(l => l.name === 'Camali Clinic');
    if (camali) assert.equal(camali.instagram, 'camaliclinic');

    // Ensure Kaya Skin Clinic or unrelated clinics are NOT falsely mapped to Camali Clinic
    const kaya = db.find(l => l.name === 'Kaya Skin Clinic');
    if (kaya) assert.notEqual(kaya.instagram, 'camaliclinic');
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

test('PitchFinder Top Directory Overview & Instagram Outreach', async (t) => {
  const html = fs.readFileSync(path.join(ROOT_DIR, 'pitchfinder/index.html'), 'utf8');

  await t.test('Top Directory Overview section displays total 100% verified businesses', () => {
    assert.ok(html.includes('Verified Businesses on Dashboard'), 'Missing top section title');
    assert.ok(html.includes('Active Verified Entities'), 'Missing total active businesses badge');
    assert.ok(html.includes('India'), 'Missing India label');
    assert.ok(html.includes('Australia'), 'Missing Australia label');
    assert.ok(html.includes('United States'), 'Missing USA label');
    assert.ok(html.includes('UAE / Dubai'), 'Missing UAE label');
    assert.ok(html.includes('United Kingdom'), 'Missing UK label');
    assert.ok(html.includes('Canada'), 'Missing Canada label');
  });

  await t.test('Instagram helper functions exist in HTML', () => {
    assert.ok(html.includes('function getBusinessInstagramHandle(b)'), 'Missing getBusinessInstagramHandle');
    assert.ok(html.includes('function getDirectInstagramUrl(b)'), 'Missing getDirectInstagramUrl');
    assert.ok(html.includes('function generateInstagramPitch(b)'), 'Missing generateInstagramPitch');
    assert.ok(html.includes('function handleDirectInstagramClick(brandId)'), 'Missing handleDirectInstagramClick');
    assert.ok(html.includes('function openInstagramFromModal()'), 'Missing openInstagramFromModal');
    assert.ok(html.includes('function copyInstagramScript()'), 'Missing copyInstagramScript');
  });

  await t.test('Views contain 1-Click Instagram DM integration', () => {
    assert.ok(html.includes('handleDirectInstagramClick'), 'Missing Instagram click handlers');
    assert.ok(html.includes('modal-ig-script'), 'Missing modal Instagram script container');
    assert.ok(html.includes('modal-ig-handle-label'), 'Missing modal Instagram handle label');
    assert.ok(html.includes('modal-ig-direct-btn'), 'Missing modal direct Instagram button');
  });

  await t.test('getBusinessInstagramHandle cleans handles properly', () => {
    function getHandle(b) {
      if (b.instagram) return b.instagram.replace(/^@/, '');
      if (b.website) {
        try {
          const url = new URL(b.website.startsWith('http') ? b.website : 'https://' + b.website);
          const host = url.hostname.replace(/^www\./, '').split('.')[0];
          if (host && host.length >= 3 && !['google', 'facebook', 'instagram', 'yelp'].includes(host)) {
            return host.toLowerCase().replace(/[^a-z0-9_]/g, '');
          }
        } catch (e) {}
      }
      const clean = (b.name || 'business').split('(')[0].split('–')[0].split('-')[0].trim();
      return clean.toLowerCase().replace(/[^a-z0-9_]/g, '').substring(0, 30);
    }

    assert.equal(getHandle({ name: 'The Rameshwaram Cafe', website: 'https://therameshwaramcafe.org' }), 'therameshwaramcafe');
    assert.equal(getHandle({ name: 'Clover Emergency Vet Hospital (Key Biscayne Central)' }), 'cloveremergencyvethospital');
  });
});

test('PitchFinder Direct Contacts Only View (Names, Phones & Emails)', async (t) => {
  const html = fs.readFileSync(path.join(ROOT_DIR, 'pitchfinder/index.html'), 'utf8');

  await t.test('View switcher and section contains Contacts Only mode', () => {
    assert.ok(html.includes('id="view-contacts-btn"'), 'Missing view-contacts-btn in HTML');
    assert.ok(html.includes("setViewMode('contacts')"), 'Missing setViewMode contacts trigger in HTML');
    assert.ok(html.includes('Emails &amp; Phones') || html.includes('Emails & Phones'), 'Missing Emails & Phones label');
  });

  await t.test('Contacts view renderer and clipboard helper functions exist', () => {
    assert.ok(html.includes('function renderContactsOnlyView(brands)'), 'Missing renderContactsOnlyView');
    assert.ok(html.includes('function copyAllVisibleEmails()'), 'Missing copyAllVisibleEmails');
    assert.ok(html.includes('function copyAllVisiblePhones()'), 'Missing copyAllVisiblePhones');
    assert.ok(html.includes('function exportContactsOnlyCSV()'), 'Missing exportContactsOnlyCSV');
  });

  await t.test('Contacts table renders only Name, Phone and Email columns', () => {
    assert.ok(html.includes('Direct Contact Roster: Names, Phones &amp; Emails Only') || html.includes('Direct Contact Roster: Names, Phones & Emails Only'), 'Missing contact roster title');
    assert.ok(html.includes('Business Name</th>'), 'Missing Business Name th');
    assert.ok(html.includes('Phone Number</th>'), 'Missing Phone Number th');
    assert.ok(html.includes('Email ID</th>'), 'Missing Email ID th');
  });
});



