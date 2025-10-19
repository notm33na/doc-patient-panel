import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tabeeb";

// Blacklist Schema (same as in the model file)
const blacklistSchema = new mongoose.Schema({
  email: { type: String, required: false, index: true },
  phone: { type: String, required: false, index: true },
  licenses: [{ type: String, required: false }],
  reason: {
    type: String,
    enum: ["doctor_deleted", "candidate_rejected_multiple", "license_conflict", "manual"],
    required: true
  },
  originalEntityType: {
    type: String,
    enum: ["Doctor", "PendingDoctor"],
    required: true
  },
  originalEntityId: { type: mongoose.Schema.Types.ObjectId, required: false },
  originalEntityName: { type: String, required: false },
  description: { type: String, required: false },
  rejectionCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  blacklistedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: false }
}, { timestamps: true });

const Blacklist = mongoose.model("Blacklist", blacklistSchema, "Blacklist");

// Function to verify Blacklist collection
async function verifyBlacklistCollection() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas successfully");

    // Check if collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const blacklistExists = collections.some(col => col.name === 'Blacklist');
    
    if (blacklistExists) {
      console.log("✅ Blacklist collection exists in MongoDB Atlas");
      
      // Get collection stats
      const stats = await mongoose.connection.db.collection('Blacklist').stats();
      console.log(`📊 Collection stats:`);
      console.log(`   - Document count: ${stats.count}`);
      console.log(`   - Size: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`   - Index count: ${stats.indexCount}`);
      
      // List indexes
      const indexes = await mongoose.connection.db.collection('Blacklist').indexes();
      console.log(`📋 Indexes:`);
      indexes.forEach((index, i) => {
        console.log(`   ${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
      });
      
      // Show sample documents if any exist
      const sampleDocs = await Blacklist.find().limit(3);
      if (sampleDocs.length > 0) {
        console.log(`📄 Sample documents (${sampleDocs.length}):`);
        sampleDocs.forEach((doc, i) => {
          console.log(`   ${i + 1}. ${doc.reason} - ${doc.originalEntityName || 'N/A'} (${doc.email || 'N/A'})`);
        });
      } else {
        console.log("📄 No documents in collection yet");
      }
      
    } else {
      console.log("❌ Blacklist collection does not exist");
      console.log("💡 Run 'node setup-blacklist-atlas.js' to create it");
    }

  } catch (error) {
    console.error("❌ Error verifying Blacklist collection:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB Atlas");
  }
}

// Run the verification
verifyBlacklistCollection();
