/**
 * Test script to verify RAKHI backend setup
 */

const request = require('supertest');
const app = require('./server');

console.log('🧪 Testing RAKHI Backend Setup');
console.log('==============================\n');

async function runTests() {
  try {
    // Test 1: Health check
    console.log('1. Testing health check endpoint...');
    const healthResponse = await request(app)
      .get('/api/health')
      .expect(200);
    
    console.log('   ✅ Health check passed');
    console.log(`   📊 Status: ${healthResponse.body.status}`);
    console.log(`   ⏰ Uptime: ${healthResponse.body.uptime}s\n`);

    // Test 2: Voice service health
    console.log('2. Testing voice recognition service...');
    const voiceResponse = await request(app)
      .get('/api/voice/health')
      .expect(200);
    
    console.log('   ✅ Voice service is healthy');
    console.log(`   🎤 Service: ${voiceResponse.body.service}`);
    console.log(`   📊 Status: ${voiceResponse.body.status}\n`);

    // Test 3: Victim registration (without auth)
    console.log('3. Testing victim registration endpoint...');
    const testVictim = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+919876543210',
      password: 'testpassword123'
    };

    const regResponse = await request(app)
      .post('/api/victim/register')
      .send(testVictim)
      .expect(201);
    
    console.log('   ✅ Victim registration endpoint working');
    console.log(`   👤 Created victim: ${regResponse.body.victim.firstName} ${regResponse.body.victim.lastName}\n`);

    // Test 4: Invalid route (404)
    console.log('4. Testing 404 handling...');
    await request(app)
      .get('/api/nonexistent')
      .expect(404);
    
    console.log('   ✅ 404 handling working correctly\n');

    console.log('🎉 All tests passed! Backend is ready to use.');
    console.log('\n📋 Available endpoints:');
    console.log('   • POST /api/victim/register - Register new victim');
    console.log('   • POST /api/victim/login - Login victim');
    console.log('   • POST /api/victim/codeword - Set voice codeword');
    console.log('   • POST /api/voice/test - Test voice recognition');
    console.log('   • GET /api/health - Health check');
    console.log('   • GET /api/voice/health - Voice service health');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.body);
    }
    process.exit(1);
  }
}

// Run tests
runTests();

