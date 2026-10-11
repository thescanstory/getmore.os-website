import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

function getPrimaryHtmlPages() {
  return [
    'index.html',
    'pitchfinder.html',
    'contact/index.html',
    'clinic-website-bangalore/index.html',
    'hotel-direct-booking-website/index.html',
    'local-seo-bangalore/index.html',
    'restaurant-website-zero-commission/index.html',
    'salon-website-bangalore/index.html',
    'whatsapp-booking-automation/index.html'
  ];
}

test('SEO and Metadata Integrity across Core Pages', async (t) => {
  const pages = getPrimaryHtmlPages();

  for (const rel of pages) {
    const full = path.join(ROOT_DIR, rel);
    assert.ok(fs.existsSync(full), `Page exists: ${rel}`);
    const html = fs.readFileSync(full, 'utf8');

    await t.test(`Validate SEO for ${rel}`, () => {
      // 1. Title tag
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      assert.ok(titleMatch && titleMatch[1].trim().length > 5, `${rel} has descriptive <title>`);

      // 2. Meta description
      const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
      assert.ok(descMatch && descMatch[1].trim().length > 15, `${rel} has descriptive meta description`);

      // 3. Viewport tag
      const viewportMatch = html.match(/<meta\s+name=["']viewport["']/i);
      assert.ok(viewportMatch, `${rel} has mobile viewport meta tag`);
    });
  }
});

test('Sitemap, Robots and LLM Manifest Integrity', async (t) => {
  // 1. robots.txt
  const robotsPath = path.join(ROOT_DIR, 'robots.txt');
  assert.ok(fs.existsSync(robotsPath), 'robots.txt exists');
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  assert.ok(robotsContent.includes('Sitemap:'), 'robots.txt points to Sitemap');

  // 2. sitemap.xml
  const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
  assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml exists');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  assert.ok(sitemapContent.includes('<urlset'), 'sitemap.xml contains urlset');
  assert.ok(sitemapContent.includes('https://getmoreos.in/'), 'sitemap.xml includes homepage');

  // 3. llms.txt
  const llmsPath = path.join(ROOT_DIR, 'llms.txt');
  assert.ok(fs.existsSync(llmsPath), 'llms.txt exists');
  const llmsContent = fs.readFileSync(llmsPath, 'utf8');
  assert.ok(llmsContent.includes('Getmore OS'), 'llms.txt includes Getmore OS context');
});
