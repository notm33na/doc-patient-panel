import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkAdmins() {
  try {
    console.log('👥 Checking admin accounts in database...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all admins
    const admins = await Admin.find({}).select('-password');
    
    console.log(`\n📊 Found ${admins.length} admin(s):`);
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.firstName} ${admin.lastName}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive}`);
      console.log(`   Created: ${admin.createdAt}`);
      console.log('');
    });
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the function
checkAdmins();
