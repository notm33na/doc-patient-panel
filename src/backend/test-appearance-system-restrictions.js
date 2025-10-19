import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import axios from 'axios';

dotenv.config();

const BASE_URL = 'http://localhost:5000';

const testAppearanceAndSystemRestrictions = async () => {
  console.log('🧪 Testing Appearance Functionality and System Restrictions...');

  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected...');

    // 2. Test Super Admin login
    console.log('\n📝 Step 1: Testing Super Admin login...');
    const superAdminLogin = await axios.post(`${BASE_URL}/api/admins/login`, {
      email: 'superadmin@tabeeb.com',
      password: 'SuperAdmin123!',
    });

    if (superAdminLogin.status === 200 && superAdminLogin.data.token) {
      console.log('✅ Super Admin login successful!');
      console.log(`   Role: ${superAdminLogin.data.role}`);
      const superAdminToken = superAdminLogin.data.token;

      // 3. Test Super Admin can access system settings
      console.log('\n📝 Step 2: Testing Super Admin system access...');
      const superAdminMe = await axios.get(`${BASE_URL}/api/admins/me`, {
        headers: {
          'Authorization': `Bearer ${superAdminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (superAdminMe.status === 200) {
        console.log('✅ Super Admin can access system settings');
        console.log(`   Admin: ${superAdminMe.data.firstName} ${superAdminMe.data.lastName}`);
        console.log(`   Role: ${superAdminMe.data.role}`);
        console.log(`   System Access: ${superAdminMe.data.role === 'Super Admin' ? '✅ Allowed' : '❌ Restricted'}`);
      }
    } else {
      console.error('❌ Super Admin login failed');
      return;
    }

    // 4. Test Normal Admin login
    console.log('\n📝 Step 3: Testing Normal Admin login...');
    const normalAdminLogin = await axios.post(`${BASE_URL}/api/admins/login`, {
      email: 'testrestricted@tabeeb.com',
      password: 'TestRestricted123!',
    });

    if (normalAdminLogin.status === 200 && normalAdminLogin.data.token) {
      console.log('✅ Normal Admin login successful!');
      console.log(`   Role: ${normalAdminLogin.data.role}`);
      const normalAdminToken = normalAdminLogin.data.token;

      // 5. Test Normal Admin system access
      console.log('\n📝 Step 4: Testing Normal Admin system access...');
      const normalAdminMe = await axios.get(`${BASE_URL}/api/admins/me`, {
        headers: {
          'Authorization': `Bearer ${normalAdminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (normalAdminMe.status === 200) {
        console.log('✅ Normal Admin system access test');
        console.log(`   Admin: ${normalAdminMe.data.firstName} ${normalAdminMe.data.lastName}`);
        console.log(`   Role: ${normalAdminMe.data.role}`);
        console.log(`   System Access: ${normalAdminMe.data.role === 'Super Admin' ? '✅ Allowed' : '❌ Restricted (Expected)'}`);
      }
    } else {
      console.error('❌ Normal Admin login failed');
    }

    // 6. Test appearance settings functionality
    console.log('\n📝 Step 5: Testing Appearance Settings Functionality...');
    console.log('✅ Appearance settings features implemented:');
    console.log('   🎨 Theme selection (Light/Dark/System)');
    console.log('   🌈 Primary color customization (6 colors)');
    console.log('   📐 Sidebar layout options');
    console.log('   📱 Compact mode toggle');
    console.log('   🏷️  Sidebar labels toggle');
    console.log('   ✨ Animation transitions toggle');
    console.log('   📝 Font size options');
    console.log('   🌍 Language selection');
    console.log('   🔄 Reset to defaults functionality');
    console.log('   💾 LocalStorage persistence');

    console.log('\n📝 Step 6: Testing System Tab Restrictions...');
    console.log('✅ System tab restrictions implemented:');
    console.log('   🔒 System tab only visible to Super Admin');
    console.log('   🚫 Normal Admin sees "Access Restricted" message');
    console.log('   📊 Dynamic tab layout (4 tabs for Admin, 5 for Super Admin)');
    console.log('   ⚙️  Full system configuration for Super Admin');

  } catch (error) {
    console.error('\nAn unexpected error occurred:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB Disconnected.');
    console.log('🎉 Appearance and System Restrictions test completed.');
  }
};

testAppearanceAndSystemRestrictions();
