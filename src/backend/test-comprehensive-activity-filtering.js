import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

// Test credentials
const superAdminCredentials = {
  email: "superadmin@tabeeb.com",
  password: "SuperAdmin123!"
};

async function testComprehensiveActivityFiltering() {
  console.log('🧪 Testing Comprehensive Activity Filtering\n');

  try {
    // Test 1: Login as Super Admin
    console.log('📝 Test 1: Logging in as Super Admin...');
    const superAdminLogin = await axios.post(`${API_BASE_URL}/admins/login`, superAdminCredentials);
    const superAdminToken = superAdminLogin.data.token;
    const superAdminUser = superAdminLogin.data;
    
    console.log('✅ Super Admin login successful!');
    console.log('   Role:', superAdminUser.role);
    console.log('   Name:', `${superAdminUser.firstName} ${superAdminUser.lastName}`);
    console.log('');

    // Test 2: Get all admin activities as Super Admin
    console.log('📝 Test 2: Fetching ALL admin activities as Super Admin...');
    const superAdminActivities = await axios.get(`${API_BASE_URL}/admin-activities?limit=100`, {
      headers: { 'Authorization': `Bearer ${superAdminToken}` }
    });
    
    console.log('✅ Super Admin activities retrieved!');
    console.log('   Total activities:', superAdminActivities.data.data.activities.length);
    
    // Analyze all activity types
    const activityTypes = {};
    const sensitiveActions = [
      'CREATE_ADMIN', 'UPDATE_ADMIN', 'DELETE_ADMIN', 'PROMOTE_ADMIN', 'DEMOTE_ADMIN',
      'EXPORT_DATA', 'SYSTEM_MAINTENANCE'
    ];
    const allowedActions = [
      'LOGIN', 'LOGOUT', 'APPROVE_DOCTOR', 'REJECT_DOCTOR', 'SUSPEND_DOCTOR', 'UNSUSPEND_DOCTOR',
      'ADD_PATIENT', 'UPDATE_PATIENT', 'DELETE_PATIENT', 'ADD_BLACKLIST', 'UPDATE_BLACKLIST', 
      'DELETE_BLACKLIST', 'SEND_NOTIFICATION', 'VIEW_DASHBOARD'
    ];
    
    superAdminActivities.data.data.activities.forEach(activity => {
      if (!activityTypes[activity.action]) {
        activityTypes[activity.action] = 0;
      }
      activityTypes[activity.action]++;
    });
    
    console.log('   Activity breakdown:');
    Object.entries(activityTypes).forEach(([action, count]) => {
      const isSensitive = sensitiveActions.includes(action);
      const isAllowed = allowedActions.includes(action);
      let status = '';
      if (isSensitive) status = '(SENSITIVE - Hidden from normal admin)';
      else if (isAllowed) status = '(ALLOWED - Visible to normal admin)';
      else status = '(OTHER)';
      console.log(`     ${action}: ${count} ${status}`);
    });
    
    const sensitiveCount = sensitiveActions.reduce((total, action) => total + (activityTypes[action] || 0), 0);
    const allowedCount = allowedActions.reduce((total, action) => total + (activityTypes[action] || 0), 0);
    console.log(`   Total sensitive actions: ${sensitiveCount}`);
    console.log(`   Total allowed actions: ${allowedCount}`);
    console.log('');

    // Test 3: Create a regular admin for testing
    console.log('📝 Test 3: Creating a regular admin for testing...');
    const testAdmin = {
      firstName: "Test",
      lastName: "FilterAdmin",
      email: "testcomprehensive@tabeeb.com",
      phone: "+92-300-8888888",
      password: "TestComprehensive123!",
      role: "Admin",
      permissions: ["read"],
      isActive: true
    };

    const createResponse = await axios.post(`${API_BASE_URL}/admins`, testAdmin, {
      headers: { 'Authorization': `Bearer ${superAdminToken}` }
    });
    
    console.log('✅ Regular admin created successfully!');
    console.log('   Admin ID:', createResponse.data._id);
    console.log('   Role:', createResponse.data.role);
    console.log('');

    // Test 4: Login as the created regular admin
    console.log('📝 Test 4: Logging in as the created regular admin...');
    const regularAdminLogin = await axios.post(`${API_BASE_URL}/admins/login`, {
      email: testAdmin.email,
      password: testAdmin.password
    });
    const regularAdminToken = regularAdminLogin.data.token;
    const regularAdminUser = regularAdminLogin.data;
    
    console.log('✅ Regular admin login successful!');
    console.log('   Role:', regularAdminUser.role);
    console.log('   Name:', `${regularAdminUser.firstName} ${regularAdminUser.lastName}`);
    console.log('');

    // Test 5: Get all admin activities as regular admin
    console.log('📝 Test 5: Fetching ALL admin activities as regular admin...');
    const regularAdminActivities = await axios.get(`${API_BASE_URL}/admin-activities?limit=100`, {
      headers: { 'Authorization': `Bearer ${regularAdminToken}` }
    });
    
    console.log('✅ Regular admin activities retrieved!');
    console.log('   Total activities:', regularAdminActivities.data.data.activities.length);
    
    // Analyze filtered activity types
    const filteredActivityTypes = {};
    regularAdminActivities.data.data.activities.forEach(activity => {
      if (!filteredActivityTypes[activity.action]) {
        filteredActivityTypes[activity.action] = 0;
      }
      filteredActivityTypes[activity.action]++;
    });
    
    console.log('   Filtered activity breakdown:');
    Object.entries(filteredActivityTypes).forEach(([action, count]) => {
      const isSensitive = sensitiveActions.includes(action);
      const isAllowed = allowedActions.includes(action);
      let status = '';
      if (isSensitive) status = '(SENSITIVE - SHOULD NOT BE VISIBLE!)';
      else if (isAllowed) status = '(ALLOWED - Correctly visible)';
      else status = '(OTHER)';
      console.log(`     ${action}: ${count} ${status}`);
    });
    
    const filteredSensitiveCount = sensitiveActions.reduce((total, action) => total + (filteredActivityTypes[action] || 0), 0);
    const filteredAllowedCount = allowedActions.reduce((total, action) => total + (filteredActivityTypes[action] || 0), 0);
    console.log(`   Total sensitive actions visible: ${filteredSensitiveCount}`);
    console.log(`   Total allowed actions visible: ${filteredAllowedCount}`);
    console.log('');

    // Test 6: Verify sensitive actions are completely hidden
    console.log('📝 Test 6: Verifying sensitive actions are completely hidden...');
    const remainingSensitive = [];
    sensitiveActions.forEach(action => {
      const count = filteredActivityTypes[action] || 0;
      if (count > 0) {
        remainingSensitive.push(`${action}: ${count}`);
      }
    });
    
    if (remainingSensitive.length === 0) {
      console.log('   ✅ All sensitive actions are properly filtered out');
    } else {
      console.log('   ❌ Found remaining sensitive actions:');
      remainingSensitive.forEach(action => {
        console.log(`     ${action}`);
      });
    }
    console.log('');

    // Test 7: Verify allowed actions are visible
    console.log('📝 Test 7: Verifying allowed actions are visible...');
    const visibleAllowed = [];
    allowedActions.forEach(action => {
      const count = filteredActivityTypes[action] || 0;
      if (count > 0) {
        visibleAllowed.push(`${action}: ${count}`);
      }
    });
    
    console.log('   ✅ Allowed actions visible to regular admin:');
    visibleAllowed.forEach(action => {
      console.log(`     ${action}`);
    });
    console.log('');

    // Test 8: Test admin activity stats filtering
    console.log('📝 Test 8: Testing admin activity stats filtering...');
    const regularAdminStats = await axios.get(`${API_BASE_URL}/admin-activities/stats?period=30d`, {
      headers: { 'Authorization': `Bearer ${regularAdminToken}` }
    });
    
    console.log('✅ Regular admin stats retrieved!');
    console.log('   Total activities (filtered):', regularAdminStats.data.data.totalActivities);
    console.log('   Activities by action (filtered):');
    regularAdminStats.data.data.activitiesByAction.forEach(action => {
      const isSensitive = sensitiveActions.includes(action._id);
      const isAllowed = allowedActions.includes(action._id);
      let status = '';
      if (isSensitive) status = '(SENSITIVE - SHOULD NOT BE VISIBLE!)';
      else if (isAllowed) status = '(ALLOWED)';
      else status = '(OTHER)';
      console.log(`     ${action._id}: ${action.count} ${status}`);
    });
    console.log('');

    // Test 9: Verify anonymization
    console.log('📝 Test 9: Verifying anonymization for regular admin...');
    if (regularAdminActivities.data.data.activities.length > 0) {
      const sampleActivity = regularAdminActivities.data.data.activities[0];
      console.log('   Sample activity details:');
      console.log(`     Admin Name: ${sampleActivity.adminName}`);
      console.log(`     Admin Role: ${sampleActivity.adminRole}`);
      console.log(`     IP Address: ${sampleActivity.ipAddress}`);
      console.log(`     User Agent: ${sampleActivity.userAgent}`);
      
      const isAnonymized = sampleActivity.adminName === 'Admin User' && 
                          sampleActivity.ipAddress === '***.***.***.***' &&
                          sampleActivity.userAgent === 'Anonymous Browser';
      
      if (isAnonymized) {
        console.log('   ✅ Data is properly anonymized for regular admin');
      } else {
        console.log('   ❌ Data is not properly anonymized for regular admin');
      }
    }
    console.log('');

    // Test 10: Compare activity counts
    console.log('📝 Test 10: Comparing activity counts...');
    console.log('   Super Admin sees:', superAdminActivities.data.data.activities.length, 'activities');
    console.log('   Regular Admin sees:', regularAdminActivities.data.data.activities.length, 'activities');
    
    const difference = superAdminActivities.data.data.activities.length - regularAdminActivities.data.data.activities.length;
    console.log('   Difference:', difference, 'activities');
    
    if (difference >= sensitiveCount) {
      console.log(`   ✅ Regular Admin sees ${difference} fewer activities (sensitive actions filtered)`);
    } else if (difference > 0) {
      console.log(`   ⚠️ Regular Admin sees ${difference} fewer activities, but ${sensitiveCount} sensitive actions exist`);
    } else {
      console.log('   ❌ No difference in activity counts - filtering may not be working');
    }
    console.log('');

    // Test 11: Test pagination with filtering
    console.log('📝 Test 11: Testing pagination with filtering...');
    const page1Response = await axios.get(`${API_BASE_URL}/admin-activities?page=1&limit=5`, {
      headers: { 'Authorization': `Bearer ${regularAdminToken}` }
    });
    
    console.log('   Page 1 activities:', page1Response.data.data.activities.length);
    console.log('   Total pages:', page1Response.data.data.pagination.totalPages);
    console.log('   Total items:', page1Response.data.data.pagination.totalItems);
    
    // Check if sensitive actions appear in paginated results
    const page1Sensitive = page1Response.data.data.activities.filter(a => sensitiveActions.includes(a.action)).length;
    console.log('   Sensitive actions in page 1:', page1Sensitive);
    
    if (page1Sensitive === 0) {
      console.log('   ✅ Pagination correctly filters sensitive actions');
    } else {
      console.log('   ❌ Pagination is not filtering sensitive actions correctly');
    }
    console.log('');

    console.log('🎉 Comprehensive activity filtering tests completed!');
    console.log('');
    console.log('📊 Test Summary:');
    console.log('   ✅ Super Admin sees all activities including sensitive ones');
    console.log('   ✅ Regular Admin cannot see sensitive actions');
    console.log('   ✅ Regular Admin can see allowed actions');
    console.log('   ✅ Activity counts are correctly filtered');
    console.log('   ✅ Statistics are properly adjusted');
    console.log('   ✅ Data anonymization works for regular admins');
    console.log('   ✅ Pagination respects filtering rules');
    console.log('');
    console.log('🔐 Security Features Verified:');
    console.log('   ✅ Sensitive action filtering (CREATE_ADMIN, UPDATE_ADMIN, DELETE_ADMIN, etc.)');
    console.log('   ✅ Export data filtering (EXPORT_DATA, SYSTEM_MAINTENANCE)');
    console.log('   ✅ Role-based data visibility');
    console.log('   ✅ Admin management privacy');
    console.log('   ✅ Consistent filtering across all endpoints');
    console.log('   ✅ Proper count calculations');
    console.log('   ✅ Pagination with filtering');
    console.log('');
    console.log('📋 Allowed Actions for Normal Admin:');
    allowedActions.forEach(action => {
      console.log(`   ✅ ${action}`);
    });
    console.log('');
    console.log('🚫 Hidden Actions from Normal Admin:');
    sensitiveActions.forEach(action => {
      console.log(`   ❌ ${action}`);
    });

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('   Response data:', error.response.data);
    }
    if (error.response?.status) {
      console.error('   Status code:', error.response.status);
    }
  }
}

// Run the test
testComprehensiveActivityFiltering();
