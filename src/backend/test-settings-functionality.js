import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';
import axios from 'axios';

dotenv.config();

const BASE_URL = 'http://localhost:5000';

const testSettingsFunctionality = async () => {
  console.log('🧪 Testing Settings Functionality...');

  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected...');

    // 2. Test admin login
    console.log('\n📝 Step 1: Testing admin login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/admins/login`, {
      email: 'superadmin@tabeeb.com',
      password: 'SuperAdmin123!',
    });

    if (loginResponse.status === 200 && loginResponse.data.token) {
      console.log('✅ Admin login successful!');
      const token = loginResponse.data.token;
      const adminId = loginResponse.data._id;

      // 3. Test get current user (for header display)
      console.log('\n📝 Step 2: Testing get current user...');
      const meResponse = await axios.get(`${BASE_URL}/api/admins/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (meResponse.status === 200) {
        console.log('✅ Get current user successful!');
        console.log(`   Admin: ${meResponse.data.firstName} ${meResponse.data.lastName}`);
        console.log(`   Email: ${meResponse.data.email}`);
        console.log(`   Role: ${meResponse.data.role}`);
        console.log(`   Phone: ${meResponse.data.phone}`);
      } else {
        console.error('❌ Get current user failed');
        return;
      }

      // 4. Test profile update
      console.log('\n📝 Step 3: Testing profile update...');
      const updateData = {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@tabeeb.com',
        phone: '+92-300-1234567'
      };

      const updateResponse = await axios.put(`${BASE_URL}/api/admins/me`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (updateResponse.status === 200) {
        console.log('✅ Profile update successful!');
        console.log(`   Updated admin: ${updateResponse.data.firstName} ${updateResponse.data.lastName}`);
      } else {
        console.error('❌ Profile update failed');
        console.error(`   Error: ${updateResponse.data?.message || 'Unknown error'}`);
      }

      // 5. Test password change
      console.log('\n📝 Step 4: Testing password change...');
      const passwordData = {
        currentPassword: 'SuperAdmin123!',
        newPassword: 'NewPassword123!'
      };

      try {
        const passwordResponse = await axios.put(`${BASE_URL}/api/admins/change-password`, passwordData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (passwordResponse.status === 200) {
          console.log('✅ Password change successful!');
          
          // Test login with new password
          console.log('\n📝 Step 5: Testing login with new password...');
          const newLoginResponse = await axios.post(`${BASE_URL}/api/admins/login`, {
            email: 'superadmin@tabeeb.com',
            password: 'NewPassword123!',
          });

          if (newLoginResponse.status === 200) {
            console.log('✅ Login with new password successful!');
            
            // Change password back to original
            console.log('\n📝 Step 6: Restoring original password...');
            const restorePasswordResponse = await axios.put(`${BASE_URL}/api/admins/change-password`, {
              currentPassword: 'NewPassword123!',
              newPassword: 'SuperAdmin123!'
            }, {
              headers: {
                'Authorization': `Bearer ${newLoginResponse.data.token}`,
                'Content-Type': 'application/json'
              }
            });

            if (restorePasswordResponse.status === 200) {
              console.log('✅ Password restored successfully!');
            } else {
              console.error('❌ Password restore failed');
            }
          } else {
            console.error('❌ Login with new password failed');
          }
        } else {
          console.error('❌ Password change failed');
          console.error(`   Error: ${passwordResponse.data?.message || 'Unknown error'}`);
        }
      } catch (passwordError) {
        console.error('❌ Password change test failed:', passwordError.response?.data?.message || passwordError.message);
      }

      // 6. Test email validation
      console.log('\n📝 Step 7: Testing email validation...');
      const invalidUpdateData = {
        firstName: 'Test',
        lastName: 'Admin',
        email: 'invalid-email',
        phone: '+92-300-1234567'
      };

      try {
        const invalidUpdateResponse = await axios.put(`${BASE_URL}/api/admins/me`, invalidUpdateData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('❌ Invalid email validation failed - should have been rejected');
      } catch (validationError) {
        if (validationError.response?.status === 400) {
          console.log('✅ Email validation working correctly - invalid email rejected');
        } else {
          console.error('❌ Unexpected validation error:', validationError.response?.data?.message);
        }
      }

    } else {
      console.error('❌ Admin login failed');
      console.error(`   Error: ${loginResponse.data?.message || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('\nAn unexpected error occurred:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB Disconnected.');
    console.log('🎉 Settings functionality test completed.');
  }
};

testSettingsFunctionality();
