import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

// Recursively find all .html files
function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node:modules' || file.startsWith('.') || file === 'brain') continue;
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(findHtmlFiles(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

test('Local Links and Asset References Integrity', async (t) => {
  const htmlFiles = findHtmlFiles(ROOT_DIR);
  assert.ok(htmlFiles.length >= 8, `Expected at least 8 HTML files, found ${htmlFiles.length}`);

  for (const file of htmlFiles) {
    const relFile = path.relative(ROOT_DIR, file);
    const fileDir = path.dirname(file);
    let content = fs.readFileSync(file, 'utf8');

    // Strip script and style contents so we only test actual DOM elements
    content = content.replace(/<script(?:\s+[^>]*)?>[\s\S]*?<\/script>/gi, '');
    content = content.replace(/<style(?:\s+[^>]*)?>[\s\S]*?<\/style>/gi, '');

    // Extract src attributes
    const srcMatches = [...content.matchAll(/src=["']([^"']+)["']/g)];
    for (const match of srcMatches) {
      const src = match[1];
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('//')) {
        continue;
      }
      
      const cleanSrc = src.split('?')[0].split('#')[0];
      if (!cleanSrc) continue;

      let targetPath;
      if (cleanSrc.startsWith('/')) {
        targetPath = path.join(ROOT_DIR, cleanSrc);
      } else {
        targetPath = path.join(fileDir, cleanSrc);
      }

      assert.ok(fs.existsSync(targetPath), `Broken src in ${relFile}: "${src}" -> ${path.relative(ROOT_DIR, targetPath)} not found`);
    }

    // Extract href attributes (stylesheets, local pages)
    const hrefMatches = [...content.matchAll(/href=["']([^"']+)["']/g)];
    for (const match of hrefMatches) {
      const href = match[1];
      if (
        href.startsWith('http://') || 
        href.startsWith('https://') || 
        href.startsWith('mailto:') || 
        href.startsWith('tel:') || 
        href.startsWith('javascript:') || 
        href.startsWith('#') ||
        href.startsWith('//')
      ) {
        continue;
      }

      const cleanHref = href.split('?')[0].split('#')[0];
      if (!cleanHref) continue;

      let targetPath;
      if (cleanHref.startsWith('/')) {
        targetPath = path.join(ROOT_DIR, cleanHref);
      } else {
        targetPath = path.join(fileDir, cleanHref);
      }

      // Check direct file or directory with index.html or with .html appended
      const exists = fs.existsSync(targetPath) || 
                     fs.existsSync(path.join(targetPath, 'index.html')) || 
                     fs.existsSync(targetPath + '.html');

      assert.ok(exists, `Broken internal href in ${relFile}: "${href}"`);
    }
  }
});
