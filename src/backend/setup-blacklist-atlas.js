import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://7883:7883@tabeeb.wb8xjht.mongodb.net/Tabeeb";

// Blacklist Schema
const blacklistSchema = new mongoose.Schema({
  // Blacklisted credentials
  email: {
    type: String,
    required: false,
    index: true
  },
  phone: {
    type: String,
    required: false,
    index: true
  },
  licenses: [{
    type: String,
    required: false
  }],
  
  // Blacklist reason and metadata
  reason: {
    type: String,
    enum: ["doctor_deleted", "candidate_rejected_multiple", "license_conflict", "manual"],
    required: true
  },
  
  // Original entity information
  originalEntityType: {
    type: String,
    enum: ["Doctor", "PendingDoctor"],
    required: true
  },
  originalEntityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  originalEntityName: {
    type: String,
    required: false
  },
  
  // Additional context
  description: {
    type: String,
    required: false
  },
  
  // Rejection count (for candidates)
  rejectionCount: {
    type: Number,
    default: 0
  },
  
  // Blacklist status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Admin who created the blacklist entry
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  
  // Timestamps
  blacklistedAt: {
    type: Date,
    default: Date.now
  },
  
  // Optional expiration date
  expiresAt: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
blacklistSchema.index({ email: 1, isActive: 1 });
blacklistSchema.index({ phone: 1, isActive: 1 });
blacklistSchema.index({ licenses: 1, isActive: 1 });
blacklistSchema.index({ reason: 1, isActive: 1 });
blacklistSchema.index({ originalEntityType: 1, originalEntityId: 1 });

// Static method to check if credentials are blacklisted
blacklistSchema.statics.isBlacklisted = async function(credentials) {
  const { email, phone, licenses = [] } = credentials;
  
  const query = {
    isActive: true,
    $or: []
  };
  
  if (email) {
    query.$or.push({ email: email });
  }
  
  if (phone) {
    query.$or.push({ phone: phone });
  }
  
  if (licenses && licenses.length > 0) {
    query.$or.push({ licenses: { $in: licenses } });
  }
  
  // Check for expiration
  query.$or.push({
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  });
  
  const blacklistedEntry = await this.findOne(query);
  return blacklistedEntry;
};

// Static method to add to blacklist
blacklistSchema.statics.addToBlacklist = async function(data) {
  const blacklistEntry = new this(data);
  return await blacklistEntry.save();
};

// Static method to increment rejection count
blacklistSchema.statics.incrementRejectionCount = async function(email) {
  const existingEntry = await this.findOne({ 
    email: email, 
    reason: "candidate_rejected_multiple",
    isActive: true 
  });
  
  if (existingEntry) {
    existingEntry.rejectionCount += 1;
    await existingEntry.save();
    return existingEntry;
  }
  
  return null;
};

const Blacklist = mongoose.model("Blacklist", blacklistSchema, "Blacklist");

// Function to create the Blacklist collection and indexes
async function createBlacklistCollection() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas successfully");

    // Create the collection if it doesn't exist
    console.log("Creating Blacklist collection...");
    await Blacklist.createCollection();
    console.log("✅ Blacklist collection created successfully");

    // Create indexes
    console.log("Creating indexes...");
    await Blacklist.collection.createIndex({ email: 1, isActive: 1 });
    await Blacklist.collection.createIndex({ phone: 1, isActive: 1 });
    await Blacklist.collection.createIndex({ licenses: 1, isActive: 1 });
    await Blacklist.collection.createIndex({ reason: 1, isActive: 1 });
    await Blacklist.collection.createIndex({ originalEntityType: 1, originalEntityId: 1 });
    console.log("✅ All indexes created successfully");

    // Verify collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const blacklistExists = collections.some(col => col.name === 'Blacklist');
    
    if (blacklistExists) {
      console.log("✅ Blacklist collection verified in MongoDB Atlas");
    } else {
      console.log("❌ Blacklist collection not found");
    }

    // Test the model with a sample document
    console.log("Testing Blacklist model...");
    const testEntry = new Blacklist({
      email: "test@example.com",
      phone: "+1234567890",
      licenses: ["TEST123"],
      reason: "manual",
      originalEntityType: "Doctor",
      originalEntityName: "Test Doctor",
      description: "Test entry for verification"
    });

    await testEntry.save();
    console.log("✅ Test entry created successfully");

    // Clean up test entry
    await Blacklist.deleteOne({ email: "test@example.com" });
    console.log("✅ Test entry cleaned up");

    console.log("\n🎉 Blacklist collection setup completed successfully!");
    console.log("The Blacklist model is now available in your MongoDB Atlas database.");

  } catch (error) {
    console.error("❌ Error setting up Blacklist collection:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB Atlas");
  }
}

// Run the setup
createBlacklistCollection();
