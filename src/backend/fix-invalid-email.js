import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const fixInvalidEmail = async () => {
  console.log('🔧 Fixing Invalid Email Issue...');
  
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Atlas Connected...');

    // Find the admin with invalid email
    const invalidAdmin = await Admin.findOne({ email: 'invalid-email' });
    
    if (invalidAdmin) {
      console.log(`📝 Found admin with invalid email: ${invalidAdmin.firstName} ${invalidAdmin.lastName}`);
      console.log(`   Current email: ${invalidAdmin.email}`);
      console.log(`   Role: ${invalidAdmin.role}`);
      
      // Fix the email
      invalidAdmin.email = 'superadmin@tabeeb.com';
      await invalidAdmin.save();
      
      console.log('✅ Email fixed successfully!');
      console.log(`   New email: ${invalidAdmin.email}`);
    } else {
      console.log('❌ No admin found with invalid email');
    }

    // Verify the fix
    console.log('\n🔍 Verifying fix...');
    const fixedAdmin = await Admin.findOne({ email: 'superadmin@tabeeb.com' });
    
    if (fixedAdmin) {
      console.log('✅ Verification successful!');
      console.log(`   Admin: ${fixedAdmin.firstName} ${fixedAdmin.lastName}`);
      console.log(`   Email: ${fixedAdmin.email}`);
      console.log(`   Role: ${fixedAdmin.role}`);
    }

  } catch (error) {
    console.error('❌ Error fixing invalid email:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB Atlas Disconnected.');
    console.log('🎉 Email fix completed.');
  }
};

fixInvalidEmail();
