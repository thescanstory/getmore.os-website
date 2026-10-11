import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT_DIR, 'images');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const heroes = [
  {
    file: 'clinic-hero.webp',
    title: 'Clinic & Healthcare Growth OS',
    subtitle: 'HIPAA-Ready WhatsApp Bookings • Doctor Profiles • 5-Star Reviews',
    badge: '🏥 Healthcare Solution',
    color1: '#0f172a',
    color2: '#0284c7',
    icon: '🩺'
  },
  {
    file: 'hotel-hero.webp',
    title: 'Hotel Direct Booking Engine',
    subtitle: 'Zero Commission • Direct WhatsApp Guest Concierge • Local SEO',
    badge: '🏨 Hospitality Solution',
    color1: '#18181b',
    color2: '#e11d48',
    icon: '🛎️'
  },
  {
    file: 'local-seo-bangalore.webp',
    fileAlias: 'local-seo-hero.webp',
    title: 'Local SEO & Map Pack Domination',
    subtitle: 'Google 3-Pack Rankings • AI Citation Schema • Review Booster',
    badge: '📍 Local SEO Engine',
    color1: '#172554',
    color2: '#2563eb',
    icon: '🚀'
  },
  {
    file: 'restaurant-hero.webp',
    title: 'Restaurant Direct Ordering & Bookings',
    subtitle: 'Zero Commission Menus • 1-Tap WhatsApp Table Reservation • QR System',
    badge: '🍽️ Dining Solution',
    color1: '#262626',
    color2: '#ea580c',
    icon: '🍕'
  },
  {
    file: 'salon-hero.webp',
    title: 'Luxury Salon & Spa Booking OS',
    subtitle: 'Stylist Roster • Instant Slot Selection • Automated Follow-Ups',
    badge: '💇 Beauty & Spa Solution',
    color1: '#1e1b4b',
    color2: '#9333ea',
    icon: '✨'
  },
  {
    file: 'whatsapp-hero.webp',
    title: 'WhatsApp Business Growth Automation',
    subtitle: 'Zero-Lag Bot Flows • Automated Confirmations • Lead Capture',
    badge: '💬 WhatsApp Suite',
    color1: '#064e3b',
    color2: '#059669',
    icon: '⚡'
  }
];

async function generateImages() {
  for (const h of heroes) {
    const safeTitle = h.title.replace(/&/g, '&amp;');
    const safeSubtitle = h.subtitle.replace(/&/g, '&amp;');
    const safeBadge = h.badge.replace(/&/g, '&amp;');

    const svg = `
    <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${h.color1}" />
          <stop offset="100%" stop-color="${h.color2}" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="40" result="blur" />
        </filter>
      </defs>

      <!-- Background -->
      <rect width="1200" height="675" fill="url(#bgGrad)" />

      <!-- Subtle Grid -->
      <g stroke="#ffffff" stroke-opacity="0.05" stroke-width="1">
        ${Array.from({ length: 15 }, (_, i) => `<line x1="${i * 80}" y1="0" x2="${i * 80}" y2="675" />`).join('')}
        ${Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${i * 75}" x2="1200" y2="${i * 75}" />`).join('')}
      </g>

      <!-- Ambient Glow Circle -->
      <circle cx="950" cy="337" r="220" fill="${h.color2}" opacity="0.35" filter="url(#glow)" />

      <!-- Badge Container -->
      <rect x="100" y="160" width="280" height="42" rx="21" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.2" />
      <text x="125" y="187" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, sans-serif" font-size="16" font-weight="700" fill="#ffffff">${safeBadge}</text>

      <!-- Title -->
      <text x="100" y="275" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, sans-serif" font-size="52" font-weight="800" fill="#ffffff" letter-spacing="-0.02em">
        ${safeTitle}
      </text>

      <!-- Subtitle -->
      <text x="100" y="340" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Roboto, sans-serif" font-size="22" font-weight="400" fill="#e2e8f0" fill-opacity="0.9">
        ${safeSubtitle}
      </text>

      <!-- Metric Card 1 -->
      <g transform="translate(100, 420)">
        <rect width="280" height="110" rx="18" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.15" />
        <text x="25" y="55" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, sans-serif" font-size="34" font-weight="800" fill="#ffffff">0%</text>
        <text x="25" y="85" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Roboto, sans-serif" font-size="14" font-weight="500" fill="#94a3b8">Marketplace Commission</text>
      </g>

      <!-- Metric Card 2 -->
      <g transform="translate(410, 420)">
        <rect width="280" height="110" rx="18" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.15" />
        <text x="25" y="55" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, sans-serif" font-size="34" font-weight="800" fill="#34d399">1-Tap</text>
        <text x="25" y="85" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Roboto, sans-serif" font-size="14" font-weight="500" fill="#94a3b8">WhatsApp Direct Booking</text>
      </g>

      <!-- Metric Card 3 -->
      <g transform="translate(720, 420)">
        <rect width="280" height="110" rx="18" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.15" />
        <text x="25" y="55" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, sans-serif" font-size="34" font-weight="800" fill="#38bdf8">Top 3</text>
        <text x="25" y="85" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Roboto, sans-serif" font-size="14" font-weight="500" fill="#94a3b8">Google Maps Pack SEO</text>
      </g>

      <!-- Watermark Logo -->
      <text x="100" y="605" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, sans-serif" font-size="16" font-weight="700" fill="#ffffff" fill-opacity="0.5">
        GETMORE OS • getmoreos.in
      </text>
    </svg>
    `;

    const outPath = path.join(IMAGES_DIR, h.fileAlias || h.file);
    await sharp(Buffer.from(svg))
      .webp({ quality: 90 })
      .toFile(outPath);
    console.log(`✓ Generated ${path.relative(ROOT_DIR, outPath)}`);
  }
}

generateImages().catch(err => {
  console.error('Error generating hero images:', err);
  process.exit(1);
});
