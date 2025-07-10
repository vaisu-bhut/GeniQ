// Test script to check backend connectivity
// Run with: node test-backend.js

const API_BASE = 'http://localhost:8000';

async function testBackend() {
  console.log('🔍 Testing Backend Connectivity...\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  try {
    const healthResponse = await fetch(`${API_BASE}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend is running:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure the backend is running: cd services && python main.py');
    console.log('2. Check if port 8000 is available');
    console.log('3. Verify CORS is enabled in the backend');
    return;
  }

  // Test 2: CORS Preflight
  console.log('\n2. Testing CORS...');
  try {
    const corsResponse = await fetch(`${API_BASE}/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type',
      }
    });
    
    if (corsResponse.ok) {
      console.log('✅ CORS is properly configured');
      console.log('CORS Headers:', {
        'Access-Control-Allow-Origin': corsResponse.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': corsResponse.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': corsResponse.headers.get('Access-Control-Allow-Headers'),
      });
    } else {
      console.log('❌ CORS preflight failed:', corsResponse.status);
    }
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }

  // Test 3: Simple API Call
  console.log('\n3. Testing API Endpoint...');
  try {
    const testRequest = {
      columns: [
        {
          name: "Test Column",
          dtype: "str",
          description: "Test description",
          validation: "",
          options: []
        }
      ],
      num_rows: 5,
      description: "Test dataset",
      use_case: "testing",
      output_format: "csv"
    };

    const apiResponse = await fetch(`${API_BASE}/generate/tabular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest)
    });

    if (apiResponse.ok) {
      console.log('✅ API endpoint is working');
      const contentType = apiResponse.headers.get('content-type');
      console.log('Response type:', contentType);
    } else {
      const errorText = await apiResponse.text();
      console.log('❌ API endpoint error:', apiResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ API test failed:', error.message);
  }

  console.log('\n🎉 Backend testing complete!');
}

// Run the test
testBackend().catch(console.error); 