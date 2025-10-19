import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const fetchAdminCredentials = async () => {
  console.log('🔍 Fetching Admin Credentials from MongoDB Atlas...');
  
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Atlas Connected...');

    // Fetch all admin accounts
    const admins = await Admin.find({}).select('-password');

    if (admins.length === 0) {
      console.log('❌ No admin accounts found in the database.');
      return;
    }

    console.log(`\n📊 Found ${admins.length} admin account(s):`);
    console.log('=' .repeat(80));

    admins.forEach((admin, index) => {
      console.log(`\n👤 Admin ${index + 1}:`);
      console.log(`   📝 ID: ${admin._id}`);
      console.log(`   👨‍💼 Name: ${admin.firstName} ${admin.lastName}`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   🎭 Role: ${admin.role}`);
      console.log(`   📱 Phone: ${admin.phone}`);
      console.log(`   🖼️  Profile Image: ${admin.profileImage || 'Not set'}`);
      console.log(`   ✅ Is Active: ${admin.isActive}`);
      console.log(`   🔒 Account Locked: ${admin.accountLocked}`);
      console.log(`   🔢 Login Attempts: ${admin.loginAttempts}`);
      console.log(`   📅 Created: ${admin.createdAt}`);
      console.log(`   🕒 Last Login: ${admin.lastLogin || 'Never'}`);
      console.log(`   🕒 Last Activity: ${admin.lastActivity || 'Never'}`);
      console.log(`   🔑 Created By: ${admin.createdBy || 'System'}`);
      console.log(`   🎯 Permissions: ${admin.permissions?.length || 0} permissions`);
      
      if (admin.permissions && admin.permissions.length > 0) {
        console.log(`      📋 Permission List: ${admin.permissions.join(', ')}`);
      }
    });

    console.log('\n' + '=' .repeat(80));
    console.log('🎯 Login Credentials Summary:');
    console.log('=' .repeat(80));
    
    admins.forEach((admin, index) => {
      console.log(`\n🔑 Admin ${index + 1} Login Credentials:`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   🔐 Password: [HASHED - Use original password from creation]`);
      console.log(`   🎭 Role: ${admin.role}`);
      console.log(`   ✅ Status: ${admin.isActive ? 'Active' : 'Inactive'}`);
    });

    // Test credentials if we have them
    console.log('\n🧪 Testing Common Credentials:');
    console.log('=' .repeat(80));
    
    const testCredentials = [
      { email: 'superadmin@tabeeb.com', password: 'SuperAdmin123!' },
      { email: 'admin@tabeeb.com', password: 'Admin123!' },
      { email: 'testadmin@tabeeb.com', password: 'TestAdmin123!' },
    ];

    for (const cred of testCredentials) {
      const admin = await Admin.findOne({ email: cred.email });
      if (admin) {
        console.log(`✅ Found admin with email: ${cred.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Status: ${admin.isActive ? 'Active' : 'Inactive'}`);
        console.log(`   Suggested password: ${cred.password}`);
      } else {
        console.log(`❌ No admin found with email: ${cred.email}`);
      }
    }

  } catch (error) {
    console.error('❌ Error fetching admin credentials:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB Atlas Disconnected.');
    console.log('🎉 Admin credentials fetch completed.');
  }
};

fetchAdminCredentials();