import puppeteer from 'puppeteer-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ARTIFACT_DIR = '/Users/mac/.gemini/antigravity-ide/brain/2d724762-666d-47a9-b9b7-b481817b07ed';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(ROOT_DIR, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }
  }
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

async function run() {
  await new Promise(resolve => server.listen(3456, resolve));
  console.log('Local test server running at http://localhost:3456');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const viewports = [
    { name: 'iPhone 13 (390x844)', width: 390, height: 844 },
    { name: 'iPhone SE (375x667)', width: 375, height: 667 },
    { name: 'Galaxy S (360x800)', width: 360, height: 800 },
    { name: 'iPhone XR (414x896)', width: 414, height: 896 }
  ];

  for (const vp of viewports) {
    console.log(`\n--- Testing ${vp.name} ---`);
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:3456/pitchfinder', { waitUntil: 'networkidle0' });

    // Check body and documentElement scrollWidth
    const metrics = await page.evaluate(() => {
      const bodyWidth = document.body.scrollWidth;
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      
      // Find any overflowing elements
      const overflowing = [];
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        if (rect.right > winWidth + 1) {
          overflowing.push({
            tag: el.tagName,
            id: el.id,
            className: (el.className || '').toString().slice(0, 50),
            right: rect.right,
            width: rect.width
          });
        }
      }
      return { bodyWidth, docWidth, winWidth, overflowing: overflowing.slice(0, 5) };
    });

    console.log(`Viewport: ${metrics.winWidth}px | Body scrollWidth: ${metrics.bodyWidth}px | Doc scrollWidth: ${metrics.docWidth}px`);
    if (metrics.bodyWidth > metrics.winWidth) {
      console.error(`❌ Overflow detected on ${vp.name}! Overflow elements:`, metrics.overflowing);
    } else {
      console.log(`✅ Zero horizontal overflow on ${vp.name}! Perfectly matches viewport.`);
    }
  }

  // Set standard iPhone 13 (390x844) for UI component checks and screenshots
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3456/pitchfinder', { waitUntil: 'networkidle0' });

  // 1. Mobile Header & Hero screenshot
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_top_header.png'), fullPage: false });
  console.log('Saved mobile_top_header.png');

  // Check default view mode
  const initialViewMode = await page.evaluate(() => {
    return {
      currentViewMode: typeof currentViewMode !== 'undefined' ? currentViewMode : null,
      cardsBtnClass: document.getElementById('view-cards-btn')?.className,
      tableBtnClass: document.getElementById('view-table-btn')?.className,
      hasCards: document.querySelectorAll('.grid > div').length > 0
    };
  });
  console.log('Initial mobile view mode:', initialViewMode.currentViewMode);

  // Scroll down to cards section & capture
  await page.evaluate(() => {
    const el = document.getElementById('results-container');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_cards_view.png') });
  console.log('Saved mobile_cards_view.png');

  // Switch to Table View and test responsiveness
  await page.evaluate(() => {
    if (typeof setViewMode === 'function') setViewMode('table');
  });
  await new Promise(r => setTimeout(r, 400));
  const tableMetrics = await page.evaluate(() => {
    return {
      bodyWidth: document.body.scrollWidth,
      winWidth: window.innerWidth,
      tableContainerWidth: document.querySelector('#results-container > div')?.scrollWidth
    };
  });
  console.log('Table mode on mobile:', tableMetrics);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_table_view.png') });
  console.log('Saved mobile_table_view.png');

  // Test Daily 50 Queue modal
  await page.evaluate(() => {
    if (typeof startDailyQueue === 'function') startDailyQueue();
  });
  await new Promise(r => setTimeout(r, 600));
  const modalMetrics = await page.evaluate(() => {
    const modalBox = document.querySelector('#outreach-queue-modal .apple-modal-sheet');
    const rect = modalBox ? modalBox.getBoundingClientRect() : null;
    return {
      bodyWidth: document.body.scrollWidth,
      winWidth: window.innerWidth,
      modalWidth: rect ? rect.width : null,
      modalRight: rect ? rect.right : null
    };
  });
  console.log('Outreach modal metrics:', modalMetrics);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_queue_modal.png') });
  console.log('Saved mobile_queue_modal.png');

  // Close queue modal
  await page.evaluate(() => {
    if (typeof closeQueueModal === 'function') closeQueueModal();
  });
  await new Promise(r => setTimeout(r, 400));

  // Test Pitch Playbook modal
  await page.evaluate(() => {
    if (displayedBrands && displayedBrands.length > 0 && typeof openPitchModal === 'function') {
      openPitchModal(displayedBrands[0].id);
    }
  });
  await new Promise(r => setTimeout(r, 600));
  const pitchMetrics = await page.evaluate(() => {
    const modalBox = document.querySelector('#pitch-modal .apple-modal-sheet');
    const rect = modalBox ? modalBox.getBoundingClientRect() : null;
    return {
      bodyWidth: document.body.scrollWidth,
      winWidth: window.innerWidth,
      modalWidth: rect ? rect.width : null,
      modalRight: rect ? rect.right : null
    };
  });
  console.log('Pitch playbook modal metrics:', pitchMetrics);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_playbook_modal.png') });
  console.log('Saved mobile_playbook_modal.png');

  await page.evaluate(() => {
    if (typeof closeModal === 'function') closeModal();
  });
  await new Promise(r => setTimeout(r, 300));
  console.log('Saved mobile_playbook_modal.png');

  await browser.close();
  server.close();
  console.log('\nAll mobile audits completed successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
