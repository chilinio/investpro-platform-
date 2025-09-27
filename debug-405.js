// Debug 405 Error - InvestPro Registration Issue
const axios = require('axios');

async function debug405Error() {
  console.log('🔍 Debugging 405 Error in InvestPro Registration\n');

  const tests = [
    {
      name: 'Local Development Server',
      baseURL: 'http://localhost:5000/api',
      description: 'Testing local development server'
    },
    {
      name: 'Local Development Client Proxy',
      baseURL: 'http://localhost:3000/api',
      description: 'Testing through Vite proxy'
    }
  ];

  for (const test of tests) {
    console.log(`📊 Testing: ${test.name}`);
    console.log(`🔗 Base URL: ${test.baseURL}`);
    console.log(`📝 Description: ${test.description}\n`);

    try {
      // Test 1: Health Check
      console.log('1️⃣ Health Check...');
      try {
        const health = await axios.get(`${test.baseURL}/health`, { timeout: 5000 });
        console.log('✅ Health:', health.data);
      } catch (error) {
        console.log('❌ Health failed:', error.response?.status, error.response?.data || error.message);
      }

      // Test 2: Investment Packages (GET)
      console.log('\n2️⃣ Investment Packages (GET)...');
      try {
        const packages = await axios.get(`${test.baseURL}/investments/packages`, { timeout: 5000 });
        console.log('✅ Packages:', packages.data.packages?.length || 'No packages');
      } catch (error) {
        console.log('❌ Packages failed:', error.response?.status, error.response?.data || error.message);
      }

      // Test 3: Registration (POST) - This is where the 405 might occur
      console.log('\n3️⃣ Registration Endpoint (POST)...');
      const testUser = {
        firstName: 'Debug',
        lastName: 'User',
        email: `debug${Date.now()}@test.com`,
        password: 'Debug123!'
      };

      try {
        const response = await axios.post(`${test.baseURL}/auth/register`, testUser, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Registration successful:', response.status, response.data);
      } catch (error) {
        console.log('❌ Registration failed:');
        console.log('   Status:', error.response?.status);
        console.log('   Status Text:', error.response?.statusText);
        console.log('   Headers:', error.response?.headers);
        console.log('   Data:', error.response?.data);
        console.log('   URL:', error.config?.url);
        console.log('   Method:', error.config?.method);
        
        if (error.response?.status === 405) {
          console.log('🚨 405 Method Not Allowed - Possible causes:');
          console.log('   - Route not defined for POST method');
          console.log('   - Middleware blocking POST requests');
          console.log('   - CORS preflight issues');
          console.log('   - Server not handling POST correctly');
        }
      }

      // Test 4: Check available methods on auth route
      console.log('\n4️⃣ Testing available methods on /auth/register...');
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
      
      for (const method of methods) {
        try {
          const response = await axios({
            method: method.toLowerCase(),
            url: `${test.baseURL}/auth/register`,
            data: method === 'POST' ? testUser : undefined,
            timeout: 3000
          });
          console.log(`✅ ${method}: ${response.status}`);
        } catch (error) {
          const status = error.response?.status;
          if (status === 405) {
            console.log(`❌ ${method}: 405 Method Not Allowed`);
          } else if (status === 404) {
            console.log(`❌ ${method}: 404 Not Found`);
          } else {
            console.log(`⚠️ ${method}: ${status} ${error.response?.statusText || error.message}`);
          }
        }
      }

    } catch (error) {
      console.log('❌ Test suite failed:', error.message);
    }

    console.log('\n' + '='.repeat(60) + '\n');
  }

  // Additional diagnostics
  console.log('🔧 Additional Diagnostics:\n');
  
  console.log('📋 Common 405 Error Causes:');
  console.log('1. Route method mismatch (GET vs POST)');
  console.log('2. CORS preflight blocking OPTIONS');
  console.log('3. Middleware not passing requests through');
  console.log('4. Server not running or wrong port');
  console.log('5. API route not properly defined');
  console.log('6. Frontend making request to wrong URL');

  console.log('\n🔍 Check These Files:');
  console.log('- server/src/routes/auth.ts (POST route definition)');
  console.log('- server/src/index.ts (route mounting)');
  console.log('- client/src/lib/api.ts (API base URL)');
  console.log('- vercel.json (routing configuration)');

  console.log('\n🚀 Recommended Actions:');
  console.log('1. Verify development servers are running');
  console.log('2. Check browser Network tab for actual request details');
  console.log('3. Test API endpoints individually');
  console.log('4. Verify CORS configuration');
  console.log('5. Check server logs for errors');
}

// Run the diagnostic
debug405Error().catch(console.error);
