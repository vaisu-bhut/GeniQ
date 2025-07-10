// Test API script for GeniQ backend
// Run with: node test-api.js

const API_BASE = 'http://localhost:8000';

async function testAPI() {
  console.log('🧪 Testing GeniQ API Endpoints...\n');

  // Test health check
  console.log('1. Testing Health Check...');
  try {
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }

  // Test Tabular Data Generation
  console.log('\n2. Testing Tabular Data Generation...');
  const tabularRequest = {
    columns: [
      {
        name: "User ID",
        dtype: "int",
        description: "Unique user identifier",
        validation: ">0",
        options: []
      },
      {
        name: "Email",
        dtype: "str", 
        description: "User email address",
        validation: "contains('@')",
        options: []
      },
      {
        name: "Age",
        dtype: "int",
        description: "User age in years",
        validation: ">=18 and <=100",
        options: []
      },
      {
        name: "Department",
        dtype: "str",
        description: "User department",
        validation: "",
        options: ["Engineering", "Marketing", "Sales", "HR", "Finance"]
      },
      {
        name: "Is Active",
        dtype: "bool",
        description: "Whether user account is active",
        validation: "",
        options: []
      }
    ],
    num_rows: 100,
    description: "Sample user dataset for testing with validation rules and categorical options",
    use_case: "User analytics and segmentation",
    output_format: "csv"
  };

  console.log('📤 Sending Tabular Request:', JSON.stringify(tabularRequest, null, 2));

  try {
    const tabularResponse = await fetch(`${API_BASE}/generate/tabular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tabularRequest)
    });
    
    const tabularData = await tabularResponse.json();
    console.log('✅ Tabular Response:', tabularData);
  } catch (error) {
    console.log('❌ Tabular Generation Failed:', error.message);
  }

  // Test Q&A Generation
  console.log('\n3. Testing Q&A Generation...');
  const qaRequest = {
    domain: "healthcare",
    complexity: "intermediate",
    num_pairs: 25,
    context: "Focus on diabetes management and prevention",
    constraints: "Medical accuracy, Evidence-based, Patient-friendly, Clinical guidelines"
  };

  console.log('📤 Sending Q&A Request:', JSON.stringify(qaRequest, null, 2));

  try {
    const qaResponse = await fetch(`${API_BASE}/generate/qa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(qaRequest)
    });
    
    const qaData = await qaResponse.json();
    console.log('✅ Q&A Response:', qaData);
  } catch (error) {
    console.log('❌ Q&A Generation Failed:', error.message);
  }

  // Test Feedback Submission
  console.log('\n4. Testing Feedback Submission...');
  const feedbackRequest = {
    name: "John Doe",
    email: "john@example.com",
    company: "Tech Corp",
    message: "Great platform! Would love to see more data formats.",
    rating: 5,
    category: "feature",
    timestamp: new Date().toISOString(),
    source: "web_contact_form"
  };

  console.log('📤 Sending Feedback Request:', JSON.stringify(feedbackRequest, null, 2));

  try {
    const feedbackResponse = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackRequest)
    });
    
    const feedbackData = await feedbackResponse.json();
    console.log('✅ Feedback Response:', feedbackData);
  } catch (error) {
    console.log('❌ Feedback Submission Failed:', error.message);
  }

  console.log('\n🎉 API Testing Complete!');
  console.log('\n📋 Summary:');
  console.log('- Health Check: Verifies backend is running');
  console.log('- Tabular Generation: Creates structured datasets with validation rules and options');
  console.log('- Q&A Generation: Produces question-answer pairs with constraints');
  console.log('- Feedback: Collects user feedback and ratings');
  console.log('\n🔧 New Features Tested:');
  console.log('- Column validation rules (e.g., >0, contains("@"))');
  console.log('- Categorical options (e.g., Department dropdown)');
  console.log('- Q&A constraints field for specific requirements');
  console.log('- Detailed dataset descriptions');
}

// Run the tests
testAPI().catch(console.error); 