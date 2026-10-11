import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

// Import server
import server from '../../scripts/serve.js';

const PORT = 3456;
const CONCURRENT_CLIENTS = 8;
const REQUESTS_PER_CLIENT = 25; // 200 total requests in simulation run

const ENDPOINTS = [
  '/',
  '/pitchfinder',
  '/contact',
  '/clinic-website-bangalore',
  '/hotel-direct-booking-website',
  '/local-seo-bangalore',
  '/restaurant-website-zero-commission',
  '/salon-website-bangalore',
  '/whatsapp-booking-automation',
  '/data/leads/sample_import_template.csv',
  '/images/clinic-hero.webp',
  '/images/hotel-hero.webp',
  '/images/local-seo-hero.webp',
  '/images/restaurant-hero.webp',
  '/images/salon-hero.webp',
  '/images/whatsapp-hero.webp',
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/non-existent-page-404-check'
];

async function makeRequest(path) {
  const start = performance.now();
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const duration = performance.now() - start;
        resolve({
          path,
          status: res.statusCode,
          duration,
          bytes: data.length,
          success: res.statusCode === 200 || (path.includes('404') && res.statusCode === 404)
        });
      });
    });
    req.on('error', (err) => {
      const duration = performance.now() - start;
      resolve({ path, status: 0, duration, bytes: 0, success: false, error: err.message });
    });
  });
}

async function simulateVirtualClient(clientId, results) {
  for (let i = 0; i < REQUESTS_PER_CLIENT; i++) {
    const targetEndpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
    const res = await makeRequest(targetEndpoint);
    results.push(res);
  }
}

async function runSyntheticSimulation() {
  console.log(`\n🤖 Starting Synthetic Traffic Simulation Harness...`);
  console.log(`   Concurrent Virtual Clients: ${CONCURRENT_CLIENTS}`);
  console.log(`   Target Total Requests: ${CONCURRENT_CLIENTS * REQUESTS_PER_CLIENT}`);

  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`   ✓ Test server booted on port ${PORT}`);

  const startTime = performance.now();
  const results = [];

  const clientPromises = Array.from({ length: CONCURRENT_CLIENTS }, (_, id) => 
    simulateVirtualClient(id + 1, results)
  );

  await Promise.all(clientPromises);
  const totalDuration = performance.now() - startTime;

  server.close();

  // Metrics analysis
  const totalReqs = results.length;
  const successfulReqs = results.filter(r => r.success).length;
  const durations = results.map(r => r.duration).sort((a, b) => a - b);

  const p50 = durations[Math.floor(durations.length * 0.50)] || 0;
  const p95 = durations[Math.floor(durations.length * 0.95)] || 0;
  const p99 = durations[Math.floor(durations.length * 0.99)] || 0;
  const rps = (totalReqs / (totalDuration / 1000)).toFixed(1);

  console.log('\n📊 === SYNTHETIC BENCHMARK REPORT ===');
  console.log(`   Total Requests Executed: ${totalReqs}`);
  console.log(`   Successful Requests:     ${successfulReqs} (${((successfulReqs/totalReqs)*100).toFixed(1)}%)`);
  console.log(`   Throughput:              ${rps} req/sec`);
  console.log(`   Latency (p50):           ${p50.toFixed(2)} ms`);
  console.log(`   Latency (p95):           ${p95.toFixed(2)} ms`);
  console.log(`   Latency (p99):           ${p99.toFixed(2)} ms`);
  console.log(`   Total Simulation Time:   ${totalDuration.toFixed(2)} ms`);

  if (successfulReqs < totalReqs) {
    const failures = results.filter(r => !r.success);
    console.error(`\n❌ Detected ${failures.length} unexpected failures:`);
    failures.slice(0, 5).forEach(f => console.error(`   - ${f.path}: HTTP ${f.status} (${f.error || 'unexpected status'})`));
    process.exit(1);
  } else {
    console.log('\n✨ Synthetic client simulation completed with 100% accuracy and ZERO anomalies!\n');
    process.exit(0);
  }
}

runSyntheticSimulation().catch(err => {
  console.error('Simulation harness crashed:', err);
  process.exit(1);
});
