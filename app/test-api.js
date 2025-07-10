// Test script to verify API connection and CORS setup
const API_BASE_URL = 'http://localhost:8001';

async function testAPI() {
  console.log('Testing GeniQ API connection...');
  
  try {
    // Test health check endpoint
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${API_BASE_URL}/`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }

    // Test CORS preflight
    console.log('2. Testing CORS preflight...');
    const corsResponse = await fetch(`${API_BASE_URL}/`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      }
    });
    
    if (corsResponse.ok) {
      console.log('✅ CORS preflight passed');
      console.log('CORS Headers:', {
        'Access-Control-Allow-Origin': corsResponse.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': corsResponse.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': corsResponse.headers.get('Access-Control-Allow-Headers'),
      });
    } else {
      console.log('❌ CORS preflight failed:', corsResponse.status);
    }

    // Test tabular generation endpoint (without actual generation)
    console.log('3. Testing tabular endpoint...');
    const tabularResponse = await fetch(`${API_BASE_URL}/generate/tabular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        columns: [
          {
            name: "test",
            dtype: "int",
            description: "test column",
            validation: "",
            options: []
          }
        ],
        num_rows: 5,
        description: "test dataset",
        use_case: "testing",
        output_format: "csv"
      })
    });
    
    console.log('Tabular endpoint response status:', tabularResponse.status);
    if (tabularResponse.ok) {
      console.log('✅ Tabular endpoint accessible');
    } else {
      const errorText = await tabularResponse.text();
      console.log('❌ Tabular endpoint error:', errorText);
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Run the test
testAPI(); 