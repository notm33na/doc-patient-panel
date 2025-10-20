import fetch from 'node-fetch';

/**
 * Test Core Admin Activity Statistics API
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();
  
  return { response, data };
};

// Test core stats endpoint
const testCoreStats = async () => {
  console.log('🧪 Testing Core Admin Activity Statistics API...\n');
  
  try {
    // Test stats endpoint
    const { response, data } = await apiRequest('/admin-activities/stats?period=7d');
    
    if (!response.ok) {
      throw new Error(`Stats request failed: ${data.message || 'Unknown error'}`);
    }

    if (!data.success || !data.data) {
      throw new Error('Stats data not returned properly');
    }

    const stats = data.data;
    
    console.log('✅ Core Stats Retrieved Successfully:');
    console.log(`   📊 Total Activities: ${stats.totalActivities || 0}`);
    console.log(`   👥 Active Admins: ${stats.activitiesByAdmin?.length || 0}`);
    console.log(`   🚨 Critical Actions: ${stats.criticalActions || 0}`);
    
    // Verify core metrics are present
    const coreMetrics = {
      totalActivities: typeof stats.totalActivities === 'number',
      criticalActions: typeof stats.criticalActions === 'number',
      activitiesByAdmin: Array.isArray(stats.activitiesByAdmin)
    };
    
    console.log('\n🔍 Core Metrics Verification:');
    Object.entries(coreMetrics).forEach(([metric, isValid]) => {
      console.log(`   ${metric}: ${isValid ? '✅' : '❌'}`);
    });
    
    // Test different periods
    console.log('\n📅 Testing Different Periods:');
    const periods = ['1d', '7d', '30d', '90d'];
    
    for (const period of periods) {
      try {
        const { response: periodResponse, data: periodData } = await apiRequest(`/admin-activities/stats?period=${period}`);
        
        if (periodResponse.ok && periodData.success) {
          console.log(`   ${period}: ✅ (${periodData.data.totalActivities || 0} activities)`);
        } else {
          console.log(`   ${period}: ❌ (${periodData.message || 'Failed'})`);
        }
      } catch (error) {
        console.log(`   ${period}: ❌ (${error.message})`);
      }
    }
    
    // Test frontend display values
    console.log('\n🖥️ Frontend Display Values:');
    console.log(`   Total Activities Card: ${(stats.totalActivities || 0).toLocaleString()}`);
    console.log(`   Active Admins Card: ${stats.activitiesByAdmin?.length || 0}`);
    console.log(`   Critical Actions Card: ${stats.criticalActions || 0}`);
    console.log(`   Most Active Admin: ${stats.mostActiveAdmin?.name || 'N/A'}`);
    
    console.log('\n🎉 Core stats API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testCoreStats().catch(console.error);
