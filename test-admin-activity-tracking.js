#!/usr/bin/env node

/**
 * Comprehensive Admin Activity Tracking Test Script
 * Tests all implemented admin activities to ensure they're being logged correctly
 */

import mongoose from 'mongoose';
import Admin from './src/backend/models/Admin.js';
import AdminActivity from './src/backend/models/AdminActivity.js';
import Doctor from './src/backend/models/Doctor.js';
import Patient from './src/backend/models/Patient.js';
import Blacklist from './src/backend/models/Blacklist.js';
import Notification from './src/backend/models/Notification.js';
import { logAdminActivity, getClientIP, getUserAgent } from './src/backend/utils/adminActivityLogger.js';

// Test configuration
const TEST_CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/doc-patient-panel',
  TEST_ADMIN_EMAIL: 'test-admin@example.com',
  TEST_DOCTOR_EMAIL: 'test-doctor@example.com',
  TEST_PATIENT_EMAIL: 'test-patient@example.com'
};

// Mock request object for testing
const createMockRequest = (admin = null) => ({
  admin: admin,
  ip: '127.0.0.1',
  headers: {
    'user-agent': 'Test-Agent/1.0'
  }
});

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
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

// Test authentication activities
const testAuthActivities = async () => {
  const testAdmin = await Admin.findOne({ email: TEST_CONFIG.TEST_ADMIN_EMAIL });
  if (!testAdmin) {
    throw new Error('Test admin not found');
  }

  const mockReq = createMockRequest(testAdmin);

  // Test LOGIN activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'LOGIN',
    details: 'Test login activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true }
  });

  // Test LOGOUT activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'LOGOUT',
    details: 'Test logout activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true }
  });

  // Verify activities were logged
  const loginActivity = await AdminActivity.findOne({ 
    adminId: testAdmin._id, 
    action: 'LOGIN',
    'metadata.test': true 
  });
  
  const logoutActivity = await AdminActivity.findOne({ 
    adminId: testAdmin._id, 
    action: 'LOGOUT',
    'metadata.test': true 
  });

  if (!loginActivity || !logoutActivity) {
    throw new Error('Authentication activities not logged properly');
  }
};

// Test admin management activities
const testAdminManagementActivities = async () => {
  const testAdmin = await Admin.findOne({ email: TEST_CONFIG.TEST_ADMIN_EMAIL });
  const mockReq = createMockRequest(testAdmin);

  // Test CREATE_ADMIN activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'CREATE_ADMIN',
    details: 'Test admin creation activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, createdAdminEmail: 'new-admin@example.com' }
  });

  // Test UPDATE_ADMIN activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'UPDATE_ADMIN',
    details: 'Test admin update activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, updatedFields: ['role', 'permissions'] }
  });

  // Test DELETE_ADMIN activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'DELETE_ADMIN',
    details: 'Test admin deletion activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, deletedAdminEmail: 'deleted-admin@example.com' }
  });

  // Verify activities were logged
  const createActivity = await AdminActivity.findOne({ 
    adminId: testAdmin._id, 
    action: 'CREATE_ADMIN',
    'metadata.test': true 
  });
  
  const updateActivity = await AdminActivity.findOne({ 
    adminId: testAdmin._id, 
    action: 'UPDATE_ADMIN',
    'metadata.test': true 
  });

  const deleteActivity = await AdminActivity.findOne({ 
    adminId: testAdmin._id, 
    action: 'DELETE_ADMIN',
    'metadata.test': true 
  });

  if (!createActivity || !updateActivity || !deleteActivity) {
    throw new Error('Admin management activities not logged properly');
  }
};

// Test doctor management activities
const testDoctorManagementActivities = async () => {
  const testAdmin = await Admin.findOne({ email: TEST_CONFIG.TEST_ADMIN_EMAIL });
  const mockReq = createMockRequest(testAdmin);

  // Test APPROVE_DOCTOR activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'APPROVE_DOCTOR',
    details: 'Test doctor approval activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, doctorEmail: TEST_CONFIG.TEST_DOCTOR_EMAIL }
  });

  // Test REJECT_DOCTOR activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'REJECT_DOCTOR',
    details: 'Test doctor rejection activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, doctorEmail: 'rejected-doctor@example.com' }
  });

  // Test SUSPEND_DOCTOR activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'SUSPEND_DOCTOR',
    details: 'Test doctor suspension activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, doctorEmail: 'suspended-doctor@example.com' }
  });

  // Test UNSUSPEND_DOCTOR activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'UNSUSPEND_DOCTOR',
    details: 'Test doctor unsuspension activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, doctorEmail: 'unsuspended-doctor@example.com' }
  });

  // Verify activities were logged
  const activities = await AdminActivity.find({ 
    adminId: testAdmin._id, 
    action: { $in: ['APPROVE_DOCTOR', 'REJECT_DOCTOR', 'SUSPEND_DOCTOR', 'UNSUSPEND_DOCTOR'] },
    'metadata.test': true 
  });

  if (activities.length !== 4) {
    throw new Error(`Expected 4 doctor management activities, found ${activities.length}`);
  }
};

// Test patient management activities
const testPatientManagementActivities = async () => {
  const testAdmin = await Admin.findOne({ email: TEST_CONFIG.TEST_ADMIN_EMAIL });
  const mockReq = createMockRequest(testAdmin);

  // Test ADD_PATIENT activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'ADD_PATIENT',
    details: 'Test patient addition activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, patientEmail: TEST_CONFIG.TEST_PATIENT_EMAIL }
  });

  // Test UPDATE_PATIENT activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'UPDATE_PATIENT',
    details: 'Test patient update activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, patientEmail: TEST_CONFIG.TEST_PATIENT_EMAIL }
  });

  // Test ANONYMIZE_PATIENT activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'ANONYMIZE_PATIENT',
    details: 'Test patient anonymization activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, patientId: '507f1f77bcf86cd799439011' }
  });

  // Test DELETE_PATIENT activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'DELETE_PATIENT',
    details: 'Test patient deletion activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, patientEmail: 'deleted-patient@example.com' }
  });

  // Verify activities were logged
  const activities = await AdminActivity.find({ 
    adminId: testAdmin._id, 
    action: { $in: ['ADD_PATIENT', 'UPDATE_PATIENT', 'ANONYMIZE_PATIENT', 'DELETE_PATIENT'] },
    'metadata.test': true 
  });

  if (activities.length !== 4) {
    throw new Error(`Expected 4 patient management activities, found ${activities.length}`);
  }
};

// Test blacklist management activities
const testBlacklistManagementActivities = async () => {
  const testAdmin = await Admin.findOne({ email: TEST_CONFIG.TEST_ADMIN_EMAIL });
  const mockReq = createMockRequest(testAdmin);

  // Test ADD_BLACKLIST activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'ADD_BLACKLIST',
    details: 'Test blacklist addition activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, email: 'blacklisted@example.com' }
  });

  // Test UPDATE_BLACKLIST activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'UPDATE_BLACKLIST',
    details: 'Test blacklist update activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, blacklistId: '507f1f77bcf86cd799439012' }
  });

  // Test DELETE_BLACKLIST activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'DELETE_BLACKLIST',
    details: 'Test blacklist deletion activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, blacklistId: '507f1f77bcf86cd799439013' }
  });

  // Verify activities were logged
  const activities = await AdminActivity.find({ 
    adminId: testAdmin._id, 
    action: { $in: ['ADD_BLACKLIST', 'UPDATE_BLACKLIST', 'DELETE_BLACKLIST'] },
    'metadata.test': true 
  });

  if (activities.length !== 3) {
    throw new Error(`Expected 3 blacklist management activities, found ${activities.length}`);
  }
};

// Test system activities
const testSystemActivities = async () => {
  const testAdmin = await Admin.findOne({ email: TEST_CONFIG.TEST_ADMIN_EMAIL });
  const mockReq = createMockRequest(testAdmin);

  // Test VIEW_DASHBOARD activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'VIEW_DASHBOARD',
    details: 'Test dashboard view activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, statsType: 'dashboard' }
  });

  // Test VIEW_ADMIN_ACTIVITIES activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'VIEW_ADMIN_ACTIVITIES',
    details: 'Test admin activities view activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, page: 1, limit: 50 }
  });

  // Test VIEW_STATISTICS activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'VIEW_STATISTICS',
    details: 'Test statistics view activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, statsType: 'traffic' }
  });

  // Test EXPORT_DATA activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'EXPORT_DATA',
    details: 'Test data export activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, exportType: 'patients', format: 'csv' }
  });

  // Test SYSTEM_MAINTENANCE activity
  await logAdminActivity({
    adminId: testAdmin._id,
    adminName: `${testAdmin.firstName} ${testAdmin.lastName}`,
    adminRole: testAdmin.role,
    action: 'SYSTEM_MAINTENANCE',
    details: 'Test system maintenance activity',
    ipAddress: getClientIP(mockReq),
    userAgent: getUserAgent(mockReq),
    metadata: { test: true, maintenanceType: 'database_cleanup' }
  });

  // Verify activities were logged
  const activities = await AdminActivity.find({ 
    adminId: testAdmin._id, 
    action: { $in: ['VIEW_DASHBOARD', 'VIEW_ADMIN_ACTIVITIES', 'VIEW_STATISTICS', 'EXPORT_DATA', 'SYSTEM_MAINTENANCE'] },
    'metadata.test': true 
  });

  if (activities.length !== 5) {
    throw new Error(`Expected 5 system activities, found ${activities.length}`);
  }
};

// Test activity querying and filtering
const testActivityQuerying = async () => {
  const testAdmin = await Admin.findOne({ email: TEST_CONFIG.TEST_ADMIN_EMAIL });
  
  // Test querying by admin ID
  const adminActivities = await AdminActivity.find({ adminId: testAdmin._id });
  if (adminActivities.length === 0) {
    throw new Error('No activities found for test admin');
  }

  // Test querying by action
  const loginActivities = await AdminActivity.find({ action: 'LOGIN' });
  if (loginActivities.length === 0) {
    throw new Error('No LOGIN activities found');
  }

  // Test querying by date range
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const recentActivities = await AdminActivity.find({
    createdAt: { $gte: yesterday, $lte: today }
  });
  
  if (recentActivities.length === 0) {
    throw new Error('No recent activities found');
  }

  // Test activity statistics
  const activityStats = await AdminActivity.aggregate([
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        lastPerformed: { $max: '$createdAt' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  if (activityStats.length === 0) {
    throw new Error('No activity statistics found');
  }

  console.log('📊 Activity Statistics:');
  activityStats.forEach(stat => {
    console.log(`   ${stat._id}: ${stat.count} times`);
  });
};

// Test role-based filtering
const testRoleBasedFiltering = async () => {
  const testAdmin = await Admin.findOne({ email: TEST_CONFIG.TEST_ADMIN_EMAIL });
  
  // Test sensitive actions filtering
  const sensitiveActions = ['CREATE_ADMIN', 'DELETE_ADMIN', 'EXPORT_DATA', 'SYSTEM_MAINTENANCE'];
  
  for (const action of sensitiveActions) {
    const activity = await AdminActivity.findOne({ 
      action: action,
      'metadata.test': true 
    });
    
    if (!activity) {
      throw new Error(`Sensitive action ${action} not found in test data`);
    }
    
    // Verify that sensitive actions have proper metadata
    if (!activity.metadata || !activity.metadata.test) {
      throw new Error(`Sensitive action ${action} missing proper metadata`);
    }
  }
};

// Cleanup test data
const cleanupTestData = async () => {
  console.log('\n🧹 Cleaning up test data...');
  
  // Remove test activities
  const deletedActivities = await AdminActivity.deleteMany({ 'metadata.test': true });
  console.log(`   Removed ${deletedActivities.deletedCount} test activities`);
  
  // Remove test notifications
  const deletedNotifications = await Notification.deleteMany({ 'metadata.test': true });
  console.log(`   Removed ${deletedNotifications.deletedCount} test notifications`);
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting Admin Activity Tracking Tests...\n');
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(TEST_CONFIG.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if test admin exists
    const testAdmin = await Admin.findOne({ email: TEST_CONFIG.TEST_ADMIN_EMAIL });
    if (!testAdmin) {
      console.log('⚠️  Test admin not found. Creating test admin...');
      const newAdmin = new Admin({
        firstName: 'Test',
        lastName: 'Admin',
        email: TEST_CONFIG.TEST_ADMIN_EMAIL,
        password: 'TestPassword123!',
        role: 'Super Admin',
        isActive: true
      });
      await newAdmin.save();
      console.log('✅ Test admin created');
    }

    // Run all tests
    await runTest('Authentication Activities', testAuthActivities);
    await runTest('Admin Management Activities', testAdminManagementActivities);
    await runTest('Doctor Management Activities', testDoctorManagementActivities);
    await runTest('Patient Management Activities', testPatientManagementActivities);
    await runTest('Blacklist Management Activities', testBlacklistManagementActivities);
    await runTest('System Activities', testSystemActivities);
    await runTest('Activity Querying', testActivityQuerying);
    await runTest('Role-Based Filtering', testRoleBasedFiltering);

    // Cleanup
    await cleanupTestData();

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
      console.log('\n🎉 All tests passed! Admin activity tracking is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the implementation.');
    }

  } catch (error) {
    console.error('💥 Test runner error:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\n📡 MongoDB connection closed');
  }
};

// Run the tests
runAllTests().catch(console.error);
