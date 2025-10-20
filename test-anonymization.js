// Test script for patient anonymization
const API_BASE_URL = 'http://localhost:5000/api';

async function testAnonymization() {
  try {
    console.log('Testing patient anonymization...');
    
    // First, get all patients to find one to anonymize
    const response = await fetch(`${API_BASE_URL}/patients`);
    if (!response.ok) {
      throw new Error(`Failed to fetch patients: ${response.status}`);
    }
    
    const patients = await response.json();
    console.log(`Found ${patients.length} patients`);
    
    if (patients.length === 0) {
      console.log('No patients found to test anonymization');
      return;
    }
    
    // Find a non-anonymized patient
    const testPatient = patients.find(p => p.firstName !== "Anonymous" && p.lastName !== "Patient");
    
    if (!testPatient) {
      console.log('No non-anonymized patients found');
      return;
    }
    
    console.log(`Testing anonymization for patient: ${testPatient.firstName} ${testPatient.lastName} (ID: ${testPatient._id})`);
    
    // Test anonymization
    const anonymizeResponse = await fetch(`${API_BASE_URL}/patients/${testPatient._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: "Anonymous",
        lastName: "Patient",
        emailAddress: "",
        phone: "",
        isActive: false,
        password: "anonymous_password"
      }),
    });
    
    if (!anonymizeResponse.ok) {
      const errorText = await anonymizeResponse.text();
      throw new Error(`Anonymization failed: ${anonymizeResponse.status} - ${errorText}`);
    }
    
    const anonymizedPatient = await anonymizeResponse.json();
    console.log('✅ Anonymization successful!');
    console.log('Anonymized patient data:', {
      id: anonymizedPatient._id,
      name: `${anonymizedPatient.firstName} ${anonymizedPatient.lastName}`,
      email: anonymizedPatient.emailAddress,
      phone: anonymizedPatient.phone,
      isActive: anonymizedPatient.isActive
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAnonymization();
