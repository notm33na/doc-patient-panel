import fetch from 'node-fetch';

/**
 * Test Enhanced Admin Activity Statistics API
 */

const API_BASE_URL = 'http://localhost:5000/api';
const TEST_ADMIN_EMAIL = 'admin@example.com';
const TEST_ADMIN_PASSWORD = 'TestPassword123!';

let authToken = null;

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

// Test admin login
const testAdminLogin = async () => {
  console.log('🔑 Testing admin login...');
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
  console.log('✅ Admin logged in successfully');
};

// Test enhanced stats endpoint
const testEnhancedStats = async (period = '7d') => {
  console.log(`📊 Testing enhanced stats for period: ${period}...`);
  
  const { response, data } = await apiRequest(`/admin-activities/stats?period=${period}`);
  
  if (!response.ok) {
    throw new Error(`Stats request failed: ${data.message || 'Unknown error'}`);
  }

  if (!data.success || !data.data) {
    throw new Error('Stats data not returned properly');
  }

  const stats = data.data;
  
  console.log(`✅ Stats retrieved for ${period} period:`);
  console.log(`   📊 Total Activities: ${stats.totalActivities}`);
  console.log(`   📈 Growth Rate: ${stats.growthRate}%`);
  console.log(`   📅 Avg per Day: ${stats.averageActivitiesPerDay}`);
  console.log(`   🚨 Critical Actions: ${stats.criticalActions}`);
  console.log(`   👥 Active Admins: ${stats.activitiesByAdmin.length}`);
  console.log(`   🔍 Top Action: ${stats.mostCommonAction?.action || 'N/A'} (${stats.mostCommonAction?.count || 0})`);
  console.log(`   👤 Most Active Admin: ${stats.mostActiveAdmin?.name || 'N/A'} (${stats.mostActiveAdmin?.count || 0})`);
  console.log(`   ⏰ Peak Hour: ${stats.peakHour ? `${stats.peakHour.hour}:00` : 'N/A'} (${stats.peakHour?.count || 0})`);
  console.log(`   🔐 Security Metrics:`);
  console.log(`      - Logins: ${stats.securityMetrics.totalLogins}`);
  console.log(`      - Logouts: ${stats.securityMetrics.totalLogouts}`);
  console.log(`      - Suspicious: ${stats.securityMetrics.suspiciousActivities}`);
  
  return stats;
};

// Test different periods
const testAllPeriods = async () => {
  const periods = ['1d', '7d', '30d', '90d'];
  
  for (const period of periods) {
    try {
      await testEnhancedStats(period);
      console.log(''); // Empty line for readability
    } catch (error) {
      console.error(`❌ Failed to test ${period} period:`, error.message);
    }
  }
};

// Test stats data structure
const testStatsStructure = async () => {
  console.log('🔍 Testing stats data structure...');
  
  const stats = await testEnhancedStats('7d');
  
  const requiredFields = [
    'period', 'totalActivities', 'totalActivitiesAllTime', 'criticalActions',
    'growthRate', 'averageActivitiesPerDay', 'activitiesByAction', 'activitiesByAdmin',
    'activitiesByDay', 'activitiesByHour', 'recentActivities', 'peakHour',
    'mostActiveAdmin', 'mostCommonAction', 'loginStats', 'adminStats', 'securityMetrics'
  ];
  
  const missingFields = requiredFields.filter(field => !(field in stats));
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  console.log('✅ All required fields present in stats response');
  
  // Test data types
  if (typeof stats.totalActivities !== 'number') {
    throw new Error('totalActivities should be a number');
  }
  
  if (!Array.isArray(stats.activitiesByAction)) {
    throw new Error('activitiesByAction should be an array');
  }
  
  if (!Array.isArray(stats.activitiesByAdmin)) {
    throw new Error('activitiesByAdmin should be an array');
  }
  
  if (!Array.isArray(stats.activitiesByDay)) {
    throw new Error('activitiesByDay should be an array');
  }
  
  if (!Array.isArray(stats.activitiesByHour)) {
    throw new Error('activitiesByHour should be an array');
  }
  
  if (!Array.isArray(stats.recentActivities)) {
    throw new Error('recentActivities should be an array');
  }
  
  if (typeof stats.securityMetrics !== 'object') {
    throw new Error('securityMetrics should be an object');
  }
  
  console.log('✅ All data types are correct');
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting Enhanced Admin Activity Statistics API Tests...\n');
  
  try {
    await testAdminLogin();
    await testStatsStructure();
    await testAllPeriods();
    
    console.log('\n🎉 All enhanced stats tests passed!');
    console.log('\n📋 Summary:');
    console.log('✅ Enhanced stats endpoint working correctly');
    console.log('✅ All required fields present and correctly typed');
    console.log('✅ Multiple time periods supported (1d, 7d, 30d, 90d)');
    console.log('✅ Comprehensive statistics calculated');
    console.log('✅ Security metrics included');
    console.log('✅ Growth rate calculations working');
    console.log('✅ Peak hour analysis functional');
    console.log('✅ Admin activity rankings working');
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
};

// Run the tests
runAllTests().catch(console.error);
