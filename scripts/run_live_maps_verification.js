import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { scrapePlace } from './scrape_real_google_numbers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MASTER_JSON_PATH = path.join(ROOT_DIR, 'data', 'leads', 'master_leads_10000.json');

const targets = [
  { name: 'The Rameshwaram Cafe', query: 'The Rameshwaram Cafe Indiranagar Bangalore', country: 'India' },
  { name: 'Vidyarthi Bhavan', query: 'Vidyarthi Bhavan Gandhi Bazaar Bangalore', country: 'India' },
  { name: 'Toit Brewpub', query: 'Toit Brewpub Indiranagar Bangalore', country: 'India' },
  { name: 'CTR Shri Sagar', query: 'CTR Shri Sagar Malleshwaram Bangalore', country: 'India' },
  { name: 'Truffles', query: 'Truffles St Marks Road Bangalore', country: 'India' },
  { name: "Glen's Bakehouse", query: "Glen's Bakehouse Indiranagar Bangalore", country: 'India' },
  { name: 'Third Wave Coffee Roasters', query: 'Third Wave Coffee Indiranagar Bangalore', country: 'India' },
  { name: 'Bastian Bandra', query: 'Bastian Bandra Mumbai', country: 'India' },
  { name: 'The Bombay Canteen', query: 'The Bombay Canteen Lower Parel Mumbai', country: 'India' },
  { name: 'Peter Cat', query: 'Peter Cat Park Street Kolkata', country: 'India' },
  { name: 'Flurys', query: 'Flurys Park Street Kolkata', country: 'India' },
  { name: "Karim's", query: "Karim's Jama Masjid Old Delhi", country: 'India' },
  { name: 'Indian Accent', query: 'Indian Accent The Lodhi New Delhi', country: 'India' },
  { name: "Joe's Pizza", query: "Joe's Pizza Carmine St New York", country: 'USA' },
  { name: "Katz's Delicatessen", query: "Katz's Delicatessen Houston St New York", country: 'USA' },
  { name: 'Dishoom', query: 'Dishoom Covent Garden London', country: 'United Kingdom' },
  { name: 'Al Ustad Special Kabab', query: 'Al Ustad Special Kabab Al Fahidi Dubai', country: 'UAE' },
  { name: 'Bourke Street Bakery', query: 'Bourke Street Bakery Surry Hills Sydney', country: 'Australia' }
];

async function run() {
  console.log(`Starting live Google Maps scraper for ${targets.length} anchor businesses...`);
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--lang=en-US']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 900 });

  const rawMaster = fs.readFileSync(MASTER_JSON_PATH, 'utf8');
  const leads = JSON.parse(rawMaster);

  let updatedCount = 0;

  for (const t of targets) {
    console.log(`\n🔍 Searching Google Maps for: "${t.query}"...`);
    const res = await scrapePlace(page, t.query, t.country);

    if (res && res.phone) {
      console.log(`  ✓ LIVE VERIFIED: ${res.title || t.name}`);
      console.log(`    Phone: ${res.phone} | WA: ${res.whatsapp}`);
      console.log(`    Address: ${res.address}`);
      console.log(`    Website: ${res.website}`);

      // Find matching lead in database and update
      const targetLower = t.name.toLowerCase();
      const match = leads.find(l => l.name.toLowerCase().includes(targetLower));
      if (match) {
        match.phone = res.phone;
        match.phone_number = res.phone;
        match.whatsapp = res.whatsapp;
        match.whatsapp_number = res.whatsapp_number;
        if (res.address) match.address = res.address;
        if (res.website) match.website = res.website;
        if (res.rating) match.rating = res.rating;
        if (res.reviews) match.reviews = res.reviews;
        match.verified_source = 'Google Maps Live Scrape';
        updatedCount++;
      }
    } else {
      console.log(`  ⚠️ No direct phone found for ${t.name}`);
    }
  }

  await browser.close();

  fs.writeFileSync(MASTER_JSON_PATH, JSON.stringify(leads, null, 2), 'utf8');
  console.log(`\n🎉 Successfully updated ${updatedCount} leads in master database with live verified Google Maps data!`);

  // Sync to HTML
  const minifiedDb = `const REAL_VERIFIED_DATABASE = ${JSON.stringify(leads)};`;
  for (const fn of ['pitchfinder/index.html', 'pitchfinder.html']) {
    const p = path.join(ROOT_DIR, fn);
    let html = fs.readFileSync(p, 'utf8');
    html = html.replace(/const REAL_VERIFIED_DATABASE\s*=\s*\[[\s\S]*?\];/, minifiedDb);
    fs.writeFileSync(p, html, 'utf8');
    console.log(`✓ Updated ${fn}`);
  }
}

run().catch(console.error);
