#!/usr/bin/env node

/**
 * API Endpoint Test Script for Admin Activity Tracking
 * Tests the actual API endpoints to ensure activity logging works in real scenarios
 */

import fetch from 'node-fetch';

// Test configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
const TEST_ADMIN_EMAIL = 'test-admin@example.com';
const TEST_ADMIN_PASSWORD = 'TestPassword123!';

let authToken = null;
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();
  
  return { response, data };
};

// Helper function to run a test
const runTest = async (testName, testFunction) => {
  console.log(`\n🧪 Running test: ${testName}`);
  try {
    await testFunction();
    testResults.passed++;
    testResults.tests.push({ name: testName, status: 'PASSED' });
    console.log(`✅ ${testName} - PASSED`);
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name: testName, status: 'FAILED', error: error.message });
    console.log(`❌ ${testName} - FAILED: ${error.message}`);
  }
};

// Test admin login (should log LOGIN activity)
const testAdminLogin = async () => {
  const { response, data } = await apiRequest('/admins/login', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_ADMIN_EMAIL,
      password: TEST_ADMIN_PASSWORD
    })
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${data.message || 'Unknown error'}`);
  }

  authToken = data.token;
  console.log('   🔑 Admin logged in successfully');
};

// Test dashboard view (should log VIEW_DASHBOARD activity)
const testDashboardView = async () => {
  const { response, data } = await apiRequest('/stats/dashboard');
  
  if (!response.ok) {
    throw new Error(`Dashboard request failed: ${data.message || 'Unknown error'}`);
  }

  if (!data.success || !data.data) {
    throw new Error('Dashboard data not returned properly');
  }

  console.log('   📊 Dashboard data retrieved successfully');
};

// Test viewing admin activities (should log VIEW_ADMIN_ACTIVITIES activity)
const testViewAdminActivities = async () => {
  const { response, data } = await apiRequest('/admin-activities');
  
  if (!response.ok) {
    throw new Error(`Admin activities request failed: ${data.message || 'Unknown error'}`);
  }

  if (!data.success || !data.data) {
    throw new Error('Admin activities data not returned properly');
  }

  console.log(`   📋 Retrieved ${data.data.activities.length} admin activities`);
};

// Test viewing doctors (should log VIEW_DOCTORS activity)
const testViewDoctors = async () => {
  const { response, data } = await apiRequest('/doctors');
  
  if (!response.ok) {
    throw new Error(`Doctors request failed: ${data.message || 'Unknown error'}`);
  }

  if (!data.success || !data.data) {
    throw new Error('Doctors data not returned properly');
  }

  console.log(`   👨‍⚕️ Retrieved ${data.data.count} doctors`);
};

// Test viewing patients (should log VIEW_PATIENTS activity)
const testViewPatients = async () => {
  const { response, data } = await apiRequest('/patients');
  
  if (!response.ok) {
    throw new Error(`Patients request failed: ${data.message || 'Unknown error'}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Patients data not returned as array');
  }

  console.log(`   👥 Retrieved ${data.length} patients`);
};

// Test viewing blacklist (should log VIEW_BLACKLIST activity)
const testViewBlacklist = async () => {
  const { response, data } = await apiRequest('/blacklist');
  
  if (!response.ok) {
    throw new Error(`Blacklist request failed: ${data.message || 'Unknown error'}`);
  }

  if (!data.success || !data.data) {
    throw new Error('Blacklist data not returned properly');
  }

  console.log(`   🚫 Retrieved ${data.data.length} blacklist entries`);
};

// Test viewing notifications (should log VIEW_NOTIFICATIONS activity)
const testViewNotifications = async () => {
  const { response, data } = await apiRequest('/notifications');
  
  if (!response.ok) {
    throw new Error(`Notifications request failed: ${data.message || 'Unknown error'}`);
  }

  if (!data.success || !data.data) {
    throw new Error('Notifications data not returned properly');
  }

  console.log(`   🔔 Retrieved ${data.data.length} notifications`);
};

// Test creating a new admin (should log CREATE_ADMIN activity)
const testCreateAdmin = async () => {
  const newAdminData = {
    firstName: 'Test',
    lastName: 'Admin2',
    email: 'test-admin2@example.com',
    password: 'TestPassword123!',
    role: 'Admin',
    phone: '+1234567890'
  };

  const { response, data } = await apiRequest('/admins', {
    method: 'POST',
    body: JSON.stringify(newAdminData)
  });

  if (!response.ok) {
    throw new Error(`Create admin failed: ${data.message || 'Unknown error'}`);
  }

  console.log('   👤 New admin created successfully');
};

// Test adding a patient (should log ADD_PATIENT activity)
const testAddPatient = async () => {
  const newPatientData = {
    firstName: 'Test',
    lastName: 'Patient',
    emailAddress: 'test-patient-api@example.com',
    phone: '+1234567891',
    password: 'TestPassword123!',
    gender: 'Male',
    Age: '30',
    street: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345',
    country: 'Pakistan'
  };

  const { response, data } = await apiRequest('/patients', {
    method: 'POST',
    body: JSON.stringify(newPatientData)
  });

  if (!response.ok) {
    throw new Error(`Add patient failed: ${data.message || 'Unknown error'}`);
  }

  console.log('   👥 New patient added successfully');
};

// Test adding to blacklist (should log ADD_BLACKLIST activity)
const testAddToBlacklist = async () => {
  const blacklistData = {
    email: 'blacklisted-test@example.com',
    phone: '+1234567892',
    reason: 'manual',
    originalEntityType: 'Doctor',
    originalEntityName: 'Test Blacklisted Doctor',
    description: 'Test blacklist entry for API testing'
  };

  const { response, data } = await apiRequest('/blacklist', {
    method: 'POST',
    body: JSON.stringify(blacklistData)
  });

  if (!response.ok) {
    throw new Error(`Add to blacklist failed: ${data.message || 'Unknown error'}`);
  }

  console.log('   🚫 Entry added to blacklist successfully');
};

// Test admin logout (should log LOGOUT activity)
const testAdminLogout = async () => {
  const { response, data } = await apiRequest('/admins/logout', {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error(`Logout failed: ${data.message || 'Unknown error'}`);
  }

  console.log('   🔓 Admin logged out successfully');
};

// Verify activities were logged
const verifyActivitiesLogged = async () => {
  // Re-login to check activities
  const { response, data } = await apiRequest('/admins/login', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_ADMIN_EMAIL,
      password: TEST_ADMIN_PASSWORD
    })
  });

  if (!response.ok) {
    throw new Error('Re-login failed for verification');
  }

  authToken = data.token;

  // Get admin activities
  const { response: activitiesResponse, data: activitiesData } = await apiRequest('/admin-activities');
  
  if (!activitiesResponse.ok) {
    throw new Error('Failed to retrieve activities for verification');
  }

  const activities = activitiesData.data.activities;
  
  // Check for specific activities
  const expectedActivities = [
    'LOGIN',
    'VIEW_DASHBOARD',
    'VIEW_ADMIN_ACTIVITIES',
    'VIEW_DOCTORS',
    'VIEW_PATIENTS',
    'VIEW_BLACKLIST',
    'VIEW_NOTIFICATIONS',
    'CREATE_ADMIN',
    'ADD_PATIENT',
    'ADD_BLACKLIST',
    'LOGOUT'
  ];

  const foundActivities = activities
    .filter(activity => expectedActivities.includes(activity.action))
    .map(activity => activity.action);

  const missingActivities = expectedActivities.filter(
    activity => !foundActivities.includes(activity)
  );

  if (missingActivities.length > 0) {
    throw new Error(`Missing activities: ${missingActivities.join(', ')}`);
  }

  console.log(`   ✅ Verified ${foundActivities.length} activities were logged`);
  console.log(`   📋 Found activities: ${foundActivities.join(', ')}`);
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting Admin Activity Tracking API Tests...\n');
  
  try {
    // Run all tests
    await runTest('Admin Login', testAdminLogin);
    await runTest('Dashboard View', testDashboardView);
    await runTest('View Admin Activities', testViewAdminActivities);
    await runTest('View Doctors', testViewDoctors);
    await runTest('View Patients', testViewPatients);
    await runTest('View Blacklist', testViewBlacklist);
    await runTest('View Notifications', testViewNotifications);
    await runTest('Create Admin', testCreateAdmin);
    await runTest('Add Patient', testAddPatient);
    await runTest('Add to Blacklist', testAddToBlacklist);
    await runTest('Admin Logout', testAdminLogout);
    await runTest('Verify Activities Logged', verifyActivitiesLogged);

    // Print results
    console.log('\n📋 Test Results Summary:');
    console.log(`   ✅ Passed: ${testResults.passed}`);
    console.log(`   ❌ Failed: ${testResults.failed}`);
    console.log(`   📊 Total: ${testResults.passed + testResults.failed}`);
    
    if (testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      testResults.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          console.log(`   - ${test.name}: ${test.error}`);
        });
    }

    if (testResults.failed === 0) {
      console.log('\n🎉 All API tests passed! Admin activity tracking is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the implementation.');
    }

  } catch (error) {
    console.error('💥 Test runner error:', error);
  }
};

// Run the tests
runAllTests().catch(console.error);
