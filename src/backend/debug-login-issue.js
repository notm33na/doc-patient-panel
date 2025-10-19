import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';

// Admin Schema (matching your backend model)
const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['Super Admin', 'Admin'] },
  phone: { type: String, required: true },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  profileImage: { type: String, default: '' },
  loginAttempts: { type: Number, default: 0 },
  accountLocked: { type: Boolean, default: false },
  lastLogin: { type: Date },
  lastActivity: { type: Date }
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema, 'Admin');

async function debugLoginIssue() {
  console.log('🔍 Debugging Login Issue\n');

  try {
    // Step 1: Check if backend server is running
    console.log('📝 Step 1: Checking backend server status...');
    try {
      const serverResponse = await axios.get(`${API_BASE_URL}/admins`);
      console.log('✅ Backend server is running');
      console.log('   Status:', serverResponse.status);
    } catch (error) {
      console.log('❌ Backend server is not responding');
      console.log('   Error:', error.message);
      console.log('   Please start the backend server with: npm run dev');
      return;
    }
    console.log('');

    // Step 2: Connect to database and check admin data
    console.log('📝 Step 2: Checking admin data in database...');
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Connected to MongoDB Atlas');

      const admins = await Admin.find({}).select('firstName lastName email role isActive accountLocked loginAttempts');
      
      console.log(`📊 Found ${admins.length} admin accounts:`);
      
      if (admins.length === 0) {
        console.log('❌ No admin accounts found in database!');
        console.log('   You need to create an admin account first.');
        return;
      }

      admins.forEach((admin, index) => {
        console.log(`\n👤 Admin #${index + 1}:`);
        console.log(`   Name: ${admin.firstName} ${admin.lastName}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Active: ${admin.isActive ? '✅' : '❌'}`);
        console.log(`   Locked: ${admin.accountLocked ? '🔒' : '🔓'}`);
        console.log(`   Login Attempts: ${admin.loginAttempts}`);
      });

    } catch (error) {
      console.log('❌ Database connection failed');
      console.log('   Error:', error.message);
      return;
    }
    console.log('');

    // Step 3: Test login endpoint with known credentials
    console.log('📝 Step 3: Testing login endpoint...');
    
    const testCredentials = [
      { email: "superadmin@tabeeb.com", password: "SuperAdmin123!" },
      { email: "testadmin@tabeeb.com", password: "TestAdmin123!" },
      { email: "testregular@tabeeb.com", password: "TestRegular123!" }
    ];

    for (const creds of testCredentials) {
      console.log(`\n🧪 Testing: ${creds.email}`);
      try {
        const response = await axios.post(`${API_BASE_URL}/admins/login`, creds);
        console.log('✅ Login successful!');
        console.log('   Status:', response.status);
        console.log('   Token present:', !!response.data.token);
        console.log('   User:', response.data.firstName, response.data.lastName);
        break; // Stop on first successful login
      } catch (error) {
        console.log('❌ Login failed');
        console.log('   Status:', error.response?.status);
        console.log('   Error:', error.response?.data?.message || error.message);
        
        if (error.response?.status === 400) {
          console.log('   This suggests the credentials are invalid or account is locked');
        }
      }
    }
    console.log('');

    // Step 4: Test with your specific credentials
    console.log('📝 Step 4: What credentials are you trying to use?');
    console.log('   Please provide the email and password you\'re using so I can test them.');
    console.log('');

    // Step 5: Check for common issues
    console.log('📝 Step 5: Common issues to check:');
    console.log('   1. Make sure you\'re using the exact email from the database');
    console.log('   2. Check if the account is active (isActive: true)');
    console.log('   3. Check if the account is locked (accountLocked: false)');
    console.log('   4. Verify the password is correct');
    console.log('   5. Check browser console for any JavaScript errors');
    console.log('   6. Make sure the backend server is running on port 5000');
    console.log('');

    // Step 6: Provide working credentials
    console.log('📝 Step 6: Try these credentials:');
    console.log('   Email: superadmin@tabeeb.com');
    console.log('   Password: SuperAdmin123!');
    console.log('');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from database');
    }
  }
}

// Run the debug function
debugLoginIssue();
