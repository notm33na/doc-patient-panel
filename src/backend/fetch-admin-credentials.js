import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function fetchAdminCredentials() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected successfully");

    console.log("\n📋 Fetching Admin Credentials");
    console.log("=" .repeat(50));

    // Fetch all admins
    const admins = await Admin.find({}).select('firstName lastName email password role phone isActive createdAt');
    
    if (admins.length === 0) {
      console.log("❌ No admins found in the database");
      return;
    }

    console.log(`\n📊 Found ${admins.length} admin(s):`);
    console.log("=" .repeat(80));

    admins.forEach((admin, index) => {
      console.log(`\n🔑 ADMIN #${index + 1}`);
      console.log("─" .repeat(40));
      console.log(`👤 Name:        ${admin.firstName} ${admin.lastName}`);
      console.log(`📧 Email:       ${admin.email}`);
      console.log(`🔐 Password:    ${admin.password}`);
      console.log(`👑 Role:        ${admin.role}`);
      console.log(`📱 Phone:       ${admin.phone}`);
      console.log(`✅ Active:      ${admin.isActive ? 'YES' : 'NO'}`);
      console.log(`📅 Created:     ${admin.createdAt.toLocaleString()}`);
      console.log(`🆔 ID:          ${admin._id}`);
      console.log("─" .repeat(40));
    });

    console.log("\n📋 Summary:");
    console.log(`   Total Admins: ${admins.length}`);
    console.log(`   Active Admins: ${admins.filter(a => a.isActive).length}`);
    console.log(`   Inactive Admins: ${admins.filter(a => !a.isActive).length}`);
    
    const roles = [...new Set(admins.map(a => a.role))];
    console.log(`   Roles: ${roles.join(', ')}`);

    console.log("\n🔐 Password Information:");
    admins.forEach((admin, index) => {
      const isHashed = admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$');
      console.log(`   ${index + 1}. ${admin.email}: ${isHashed ? '✅ Hashed' : '❌ Plain Text'}`);
    });

  } catch (error) {
    console.error("❌ Error fetching admin credentials:", error);
    console.error("Error details:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
    process.exit(0);
  }
}

// Run the script
fetchAdminCredentials();