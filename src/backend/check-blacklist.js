import mongoose from "mongoose";
import Blacklist from "./models/Blacklist.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function checkBlacklist() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected successfully");

    console.log("\n🚫 Checking Blacklist Entries");
    console.log("=" .repeat(60));

    // Fetch all blacklist entries
    const blacklistEntries = await Blacklist.find({}).sort({ createdAt: -1 });
    
    if (blacklistEntries.length === 0) {
      console.log("✅ No blacklist entries found - blacklist is empty");
      return;
    }

    console.log(`\n📊 Found ${blacklistEntries.length} blacklist entry(ies):`);
    console.log("=" .repeat(60));

    blacklistEntries.forEach((entry, index) => {
      console.log(`\n🚫 BLACKLIST ENTRY #${index + 1}`);
      console.log("─" .repeat(50));
      console.log(`📧 Email:       ${entry.email || 'N/A'}`);
      console.log(`📱 Phone:       ${entry.phone || 'N/A'}`);
      console.log(`📄 Licenses:     ${entry.licenses && entry.licenses.length > 0 ? entry.licenses.join(', ') : 'N/A'}`);
      console.log(`⚠️  Reason:      ${entry.reason}`);
      console.log(`📝 Description: ${entry.description}`);
      console.log(`🏷️  Entity Type: ${entry.originalEntityType || 'N/A'}`);
      console.log(`👤 Entity Name: ${entry.originalEntityName || 'N/A'}`);
      console.log(`📅 Created:     ${entry.createdAt.toLocaleString()}`);
      console.log(`🆔 ID:          ${entry._id}`);
      console.log("─" .repeat(50));
    });

    console.log("\n📋 Blacklist Summary:");
    console.log(`   Total Entries: ${blacklistEntries.length}`);
    
    const reasons = [...new Set(blacklistEntries.map(e => e.reason))];
    console.log(`   Reasons: ${reasons.join(', ')}`);
    
    const emails = blacklistEntries.filter(e => e.email).map(e => e.email);
    const phones = blacklistEntries.filter(e => e.phone).map(e => e.phone);
    const licenses = blacklistEntries.filter(e => e.licenses && e.licenses.length > 0).flatMap(e => e.licenses);
    
    console.log(`   Blacklisted Emails: ${emails.length}`);
    console.log(`   Blacklisted Phones: ${phones.length}`);
    console.log(`   Blacklisted Licenses: ${licenses.length}`);

    if (emails.length > 0) {
      console.log("\n📧 Blacklisted Emails:");
      emails.forEach((email, i) => console.log(`   ${i + 1}. ${email}`));
    }

    if (phones.length > 0) {
      console.log("\n📱 Blacklisted Phone Numbers:");
      phones.forEach((phone, i) => console.log(`   ${i + 1}. ${phone}`));
    }

    if (licenses.length > 0) {
      console.log("\n📄 Blacklisted License Numbers:");
      licenses.forEach((license, i) => console.log(`   ${i + 1}. ${license}`));
    }

    console.log("\n💡 Solutions:");
    console.log("   1. Use different email, phone, or license numbers");
    console.log("   2. Remove entries from blacklist if they were added by mistake");
    console.log("   3. Check if the credentials belong to a deleted doctor");

  } catch (error) {
    console.error("❌ Error checking blacklist:", error);
    console.error("Error details:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
    process.exit(0);
  }
}

// Run the script
checkBlacklist();
