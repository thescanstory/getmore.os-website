import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MASTER_JSON_PATH = path.join(ROOT_DIR, 'data', 'leads', 'master_leads_10000.json');

// Normalizes real extracted phone number
function formatRealPhone(rawPhone, country = 'India') {
  if (!rawPhone) return { phone: null, whatsapp: null };
  const cleanStr = rawPhone.trim();
  const digitsOnly = cleanStr.replace(/\D/g, '');

  let formattedPhone = cleanStr;
  let whatsapp = null;

  if (country === 'India') {
    // Check for Indian landline STD codes (080, 022, 011, 044, 033, 040, 020, 0832, 0141)
    const isLandline = /^(0?80|0?22|0?11|0?44|0?33|0?40|0?20|0?832|0?141)\d{6,8}$/.test(digitsOnly) ||
                       cleanStr.startsWith('080') || cleanStr.startsWith('022') || cleanStr.startsWith('011') ||
                       cleanStr.startsWith('044') || cleanStr.startsWith('033') || cleanStr.startsWith('040') || cleanStr.startsWith('020');

    if (isLandline) {
      whatsapp = null;
      formattedPhone = cleanStr.startsWith('0') ? cleanStr : `0${cleanStr}`;
    } else {
      // Check if 10-digit mobile starting with 6,7,8,9
      let mobDigits = digitsOnly;
      if (mobDigits.startsWith('0')) mobDigits = mobDigits.substring(1);
      if (mobDigits.startsWith('91') && mobDigits.length === 12) mobDigits = mobDigits.substring(2);

      if (mobDigits.length === 10 && /^[6-9]/.test(mobDigits)) {
        whatsapp = `91${mobDigits}`;
        formattedPhone = `+91 ${mobDigits.slice(0, 5)} ${mobDigits.slice(5)}`;
      } else {
        whatsapp = null;
        formattedPhone = cleanStr;
      }
    }
  } else if (country === 'USA' || country === 'Canada') {
    let d = digitsOnly;
    if (d.length === 10) d = '1' + d;
    if (d.startsWith('1') && d.length === 11) {
      formattedPhone = `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
    }
    whatsapp = null;
  } else if (country === 'Australia') {
    let d = digitsOnly;
    if (d.startsWith('0')) d = d.substring(1);
    if (d.startsWith('4') && d.length === 9) {
      whatsapp = `61${d}`;
      formattedPhone = `+61 4${d.slice(1, 5)} ${d.slice(5)}`;
    } else {
      whatsapp = null;
      formattedPhone = cleanStr;
    }
  } else if (country === 'UAE') {
    let d = digitsOnly;
    if (d.startsWith('0')) d = d.substring(1);
    if (d.startsWith('971')) d = d.substring(3);
    if (d.startsWith('5') && d.length === 9) {
      whatsapp = `971${d}`;
      formattedPhone = `+971 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
    } else {
      whatsapp = null;
      formattedPhone = cleanStr;
    }
  } else if (country === 'United Kingdom' || country === 'UK') {
    let d = digitsOnly;
    if (d.startsWith('0')) d = d.substring(1);
    if (d.startsWith('44')) d = d.substring(2);
    if (d.startsWith('7') && d.length === 10) {
      whatsapp = `44${d}`;
      formattedPhone = `+44 7${d.slice(1, 5)} ${d.slice(5)}`;
    } else {
      whatsapp = null;
      formattedPhone = cleanStr;
    }
  }

  return { phone: formattedPhone, whatsapp };
}

// Scrape place detail directly from Google Maps
async function scrapePlace(page, searchQuery, country = 'India') {
  const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}?hl=en`;
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3200));

    // If multiple results, click first result if present
    const firstResult = await page.$('a[href*="/maps/place/"]');
    if (firstResult) {
      await firstResult.click().catch(() => {});
      await new Promise(r => setTimeout(r, 2500));
    }

    const data = await page.evaluate(() => {
      const titleEl = document.querySelector('h1') || document.querySelector('.DUwDvf');
      const title = titleEl ? titleEl.innerText.trim() : null;

      let phone = null;
      let address = null;
      let website = null;

      const allButtons = Array.from(document.querySelectorAll('button[aria-label], a[aria-label]'));
      for (const b of allButtons) {
        const label = b.getAttribute('aria-label') || '';
        if (/Phone:\s*/i.test(label) || /Phone number:\s*/i.test(label)) {
          phone = label.replace(/Phone:\s*|Phone number:\s*/i, '').trim();
        } else if (/Address:\s*/i.test(label)) {
          address = label.replace(/Address:\s*/i, '').trim();
        } else if (/Website:\s*/i.test(label)) {
          website = b.getAttribute('href') || label.replace(/Website:\s*/i, '').trim();
        }
      }

      // Ratings & reviews
      const ratingSnippet = document.querySelector('.F7nice');
      let rating = null;
      let reviews = null;
      if (ratingSnippet) {
        const parts = ratingSnippet.innerText.split('\n');
        const rVal = parseFloat(parts[0]);
        if (!isNaN(rVal)) rating = rVal;
        if (parts[1]) {
          const revVal = parseInt(parts[1].replace(/\D/g, ''), 10);
          if (!isNaN(revVal)) reviews = revVal;
        }
      }

      return { title, phone, address, website, rating, reviews };
    });

    if (data && (data.phone || data.title)) {
      const { phone, whatsapp } = formatRealPhone(data.phone, country);
      return {
        ...data,
        phone,
        whatsapp,
        phone_number: phone,
        whatsapp_number: whatsapp ? `+${whatsapp}` : null,
        success: true
      };
    }
  } catch (err) {
    console.error(`Error scraping "${searchQuery}":`, err.message);
  }
  return { success: false };
}

export { scrapePlace, formatRealPhone };
