/**
 * Automated Verification Script for FleetCo IT Helpdesk Bot
 */
const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting FleetCo IT Helpdesk Test Suite...\n');

  // Start the server internally
  const app = require('./src/server');
  const server = app.listen(5001, async () => {
    try {
      // 1. Health check
      console.log('1. Testing GET /health ...');
      const health = await makeRequest({
        hostname: 'localhost',
        port: 5001,
        path: '/health',
        method: 'GET'
      });
      console.log(`   Status: ${health.status}, Response:`, health.data);
      if (health.status !== 200 || health.data.status !== 'ok') {
        throw new Error('Health check failed');
      }

      // 2. High confidence /ask test
      console.log('\n2. Testing POST /ask with high-confidence VPN question...');
      const vpnRes = await makeRequest({
        hostname: 'localhost',
        port: 5001,
        path: '/ask',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { question: 'How do I reset my FleetCo VPN connection?' });

      console.log(`   Status: ${vpnRes.status}`);
      console.log(`   Confidence: ${vpnRes.data.confidence} (>= 0.75: ${vpnRes.data.confidence >= 0.75})`);
      console.log(`   Citation: ${vpnRes.data.source}`);
      console.log(`   Needs Escalation: ${vpnRes.data.needsEscalation}`);
      if (vpnRes.data.confidence < 0.75) {
        throw new Error(`Expected high confidence >= 0.75, got ${vpnRes.data.confidence}`);
      }

      // 3. Low confidence /ask test
      console.log('\n3. Testing POST /ask with out-of-domain low-confidence query...');
      const pizzaRes = await makeRequest({
        hostname: 'localhost',
        port: 5001,
        path: '/ask',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { question: 'Can I bring my pet iguana and order pizza?' });

      console.log(`   Status: ${pizzaRes.status}`);
      console.log(`   Confidence: ${pizzaRes.data.confidence} (< 0.75: ${pizzaRes.data.confidence < 0.75})`);
      console.log(`   Auto Escalated: ${pizzaRes.data.autoEscalated}`);
      console.log(`   Escalation Ticket ID: ${pizzaRes.data.escalationId}`);
      if (pizzaRes.data.confidence >= 0.75 || !pizzaRes.data.autoEscalated) {
        throw new Error(`Expected low confidence < 0.75 and auto-escalation, got ${pizzaRes.data.confidence}`);
      }

      // 4. Manual POST /escalate test
      console.log('\n4. Testing POST /escalate ...');
      const escRes = await makeRequest({
        hostname: 'localhost',
        port: 5001,
        path: '/escalate',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { question: 'MacBook screen flickering continuously', reason: 'Hardware specialist check required' });

      console.log(`   Status: ${escRes.status}, Ticket: #${escRes.data.escalation.id}`);
      if (escRes.status !== 201) {
        throw new Error('POST /escalate failed');
      }

      // 5. Verify SQLite interactions table
      console.log('\n5. Testing GET /interactions ...');
      const interactionsRes = await makeRequest({
        hostname: 'localhost',
        port: 5001,
        path: '/interactions',
        method: 'GET'
      });
      console.log(`   Total interactions in SQLite: ${interactionsRes.data.interactions.length}`);

      // 6. Verify SQLite escalations table
      console.log('\n6. Testing GET /escalations ...');
      const escalationsRes = await makeRequest({
        hostname: 'localhost',
        port: 5001,
        path: '/escalations',
        method: 'GET'
      });
      console.log(`   Total escalations in SQLite: ${escalationsRes.data.escalations.length}`);

      console.log('\n✅ All FleetCo IT Helpdesk Bot tests passed successfully!');
    } catch (err) {
      console.error('\n❌ Test failed:', err);
    } finally {
      server.close(() => process.exit(0));
    }
  });
}

runTests();
