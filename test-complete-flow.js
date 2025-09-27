// Complete InvestPro Platform Test & Vercel Readiness Check
const axios = require('axios');

const LOCAL_FRONTEND = 'http://localhost:3000';
const LOCAL_API = 'http://localhost:5000/api';

// Create axios instance with proper session handling
const client = axios.create({
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function testCompleteFlow() {
  console.log('🚀 InvestPro Complete Platform Test & Vercel Readiness Check\n');
  console.log(`Frontend: ${LOCAL_FRONTEND}`);
  console.log(`Backend API: ${LOCAL_API}\n`);

  const results = {
    frontend: { passed: 0, failed: 0, tests: [] },
    backend: { passed: 0, failed: 0, tests: [] },
    vercel: { passed: 0, failed: 0, tests: [] }
  };

  function logResult(category, name, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}: ${name}`);
    if (details) console.log(`   ${details}`);
    
    results[category].tests.push({ name, passed, details });
    if (passed) results[category].passed++;
    else results[category].failed++;
  }

  // === FRONTEND TESTS ===
  console.log('🌐 FRONTEND TESTS\n');

  try {
    const frontendResponse = await client.get(LOCAL_FRONTEND);
    logResult('frontend', 'Frontend Server Running', 
      frontendResponse.status === 200, `Status: ${frontendResponse.status}`);
  } catch (error) {
    logResult('frontend', 'Frontend Server Running', false, error.message);
  }

  // === BACKEND API TESTS ===
  console.log('\n🔧 BACKEND API TESTS\n');

  // Health Check
  try {
    const health = await client.get(`${LOCAL_API}/health`);
    logResult('backend', 'Health Check', 
      health.data.status === 'ok', `DB: ${health.data.database}`);
  } catch (error) {
    logResult('backend', 'Health Check', false, error.message);
  }

  // Investment Packages
  try {
    const packages = await client.get(`${LOCAL_API}/investments/packages`);
    logResult('backend', 'Investment Packages', 
      packages.data.packages.length > 0, `${packages.data.packages.length} packages`);
  } catch (error) {
    logResult('backend', 'Investment Packages', false, error.message);
  }

  // User Registration
  const testUser = {
    firstName: 'Complete',
    lastName: 'Test',
    email: `complete${Date.now()}@test.com`,
    password: 'CompleteTest123!'
  };

  try {
    const register = await client.post(`${LOCAL_API}/auth/register`, testUser);
    logResult('backend', 'User Registration', 
      register.status === 201, `User ID: ${register.data.user.id}`);

    // User Login
    try {
      const login = await client.post(`${LOCAL_API}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      logResult('backend', 'User Login', 
        login.status === 200, `Logged in as: ${login.data.user.firstName}`);

      // Authenticated Endpoints
      try {
        const investments = await client.get(`${LOCAL_API}/investments`);
        logResult('backend', 'Get Investments (Auth)', 
          investments.status === 200, `${investments.data.investments.length} investments`);
      } catch (error) {
        logResult('backend', 'Get Investments (Auth)', false, error.message);
      }

      try {
        const stats = await client.get(`${LOCAL_API}/investments/stats`);
        logResult('backend', 'Investment Stats (Auth)', 
          stats.status === 200, `Total: $${stats.data.summary.totalInvestment}`);
      } catch (error) {
        logResult('backend', 'Investment Stats (Auth)', false, error.message);
      }

      try {
        const wallet = await client.get(`${LOCAL_API}/payments/wallet`);
        logResult('backend', 'Wallet System (Auth)', 
          wallet.status === 200, `Balance: $${wallet.data.balance}`);
      } catch (error) {
        logResult('backend', 'Wallet System (Auth)', false, error.message);
      }

    } catch (error) {
      logResult('backend', 'User Login', false, error.message);
    }

  } catch (error) {
    logResult('backend', 'User Registration', false, 
      `${error.response?.status} ${error.response?.data?.error || error.message}`);
  }

  // === VERCEL READINESS TESTS ===
  console.log('\n🚀 VERCEL DEPLOYMENT READINESS\n');

  // Check required files
  const fs = require('fs');
  const requiredFiles = [
    { file: 'vercel.json', desc: 'Vercel configuration' },
    { file: 'api/index.ts', desc: 'Serverless API entry' },
    { file: 'package.json', desc: 'Root package.json with build scripts' },
    { file: 'client/package.json', desc: 'Client package.json' },
    { file: 'DEPLOYMENT.md', desc: 'Deployment guide' }
  ];

  for (const { file, desc } of requiredFiles) {
    try {
      const exists = fs.existsSync(file);
      logResult('vercel', `${desc}`, exists, exists ? 'File exists' : 'File missing');
    } catch (error) {
      logResult('vercel', `${desc}`, false, error.message);
    }
  }

  // Check package.json build scripts
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasVercelBuild = packageJson.scripts && packageJson.scripts['vercel-build'];
    const hasBuild = packageJson.scripts && packageJson.scripts['build'];
    logResult('vercel', 'Build Scripts', hasVercelBuild || hasBuild, 
      `vercel-build: ${!!hasVercelBuild}, build: ${!!hasBuild}`);
  } catch (error) {
    logResult('vercel', 'Build Scripts', false, error.message);
  }

  // Check environment examples
  const envFiles = [
    { file: 'client/env.example', desc: 'Client env example' },
    { file: 'server/env.example', desc: 'Server env example' },
    { file: 'client/env.production', desc: 'Client production env' },
    { file: 'server/env.production', desc: 'Server production env' }
  ];

  for (const { file, desc } of envFiles) {
    try {
      const exists = fs.existsSync(file);
      logResult('vercel', desc, exists, exists ? 'Available' : 'Missing');
    } catch (error) {
      logResult('vercel', desc, false, error.message);
    }
  }

  // === RESULTS SUMMARY ===
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(80));

  const categories = ['frontend', 'backend', 'vercel'];
  let totalPassed = 0, totalFailed = 0;

  for (const category of categories) {
    const result = results[category];
    const total = result.passed + result.failed;
    const rate = total > 0 ? ((result.passed / total) * 100).toFixed(1) : 0;
    
    console.log(`\n🎯 ${category.toUpperCase()}:`);
    console.log(`   ✅ Passed: ${result.passed}`);
    console.log(`   ❌ Failed: ${result.failed}`);
    console.log(`   📊 Success Rate: ${rate}%`);
    
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  const overallRate = totalPassed + totalFailed > 0 ? 
    ((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1) : 0;

  console.log(`\n🎉 OVERALL RESULTS:`);
  console.log(`   ✅ Total Passed: ${totalPassed}`);
  console.log(`   ❌ Total Failed: ${totalFailed}`);
  console.log(`   📊 Overall Success Rate: ${overallRate}%`);

  // === DEPLOYMENT READINESS ===
  console.log('\n🚀 VERCEL DEPLOYMENT STATUS:');
  if (overallRate >= 90) {
    console.log('🟢 READY FOR DEPLOYMENT!');
    console.log('   Your platform is fully functional and Vercel-ready');
  } else if (overallRate >= 75) {
    console.log('🟡 MOSTLY READY - Minor fixes needed');
  } else {
    console.log('🔴 NEEDS ATTENTION - Critical issues found');
  }

  // === NEXT STEPS ===
  console.log('\n📋 NEXT STEPS FOR VERCEL DEPLOYMENT:');
  console.log('1. 🌐 Go to: https://vercel.com/new');
  console.log('2. 📦 Import: chilinio/investpro repository');
  console.log('3. ⚙️ Configure:');
  console.log('   - Framework: Other');
  console.log('   - Build Command: npm run build');
  console.log('   - Output Directory: client/dist');
  console.log('4. 🔐 Add Environment Variables:');
  console.log('   - DATABASE_URL=your_postgresql_url');
  console.log('   - SESSION_SECRET=your_secret_key');
  console.log('   - NODE_ENV=production');
  console.log('   - CORS_ORIGIN=https://your-project.vercel.app');
  console.log('5. 🚀 Deploy and test!');

  console.log('\n🎯 LIVE TESTING URLs:');
  console.log(`   Frontend: ${LOCAL_FRONTEND}`);
  console.log(`   API Health: ${LOCAL_API}/health`);
  console.log(`   API Packages: ${LOCAL_API}/investments/packages`);

  if (totalFailed > 0) {
    console.log('\n❌ FAILED TESTS:');
    for (const category of categories) {
      const failed = results[category].tests.filter(t => !t.passed);
      if (failed.length > 0) {
        console.log(`\n${category.toUpperCase()}:`);
        failed.forEach(test => console.log(`   - ${test.name}: ${test.details}`));
      }
    }
  }

  console.log('\n🎉 InvestPro Platform Testing Complete!');
}

// Run the complete test
testCompleteFlow().catch(console.error);
