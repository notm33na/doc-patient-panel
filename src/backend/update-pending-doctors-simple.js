import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// MongoDB connection string (update this with your actual connection string)
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Update Pending_Doctors collection schema
async function updatePendingDoctorsSchema() {
  try {
    console.log("🔄 Starting Pending_Doctors collection schema update...");
    
    // Get the Pending_Doctors collection
    const db = mongoose.connection.db;
    const collection = db.collection('Pending_Doctors');
    
    // Get all documents
    const documents = await collection.find({}).toArray();
    console.log(`📊 Found ${documents.length} documents to update`);
    
    if (documents.length === 0) {
      console.log("ℹ️ No documents found in Pending_Doctors collection");
      return;
    }
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const doc of documents) {
      try {
        console.log(`\n🔄 Processing document: ${doc._id}`);
        console.log(`   DoctorName: ${doc.DoctorName || doc.name || 'N/A'}`);
        console.log(`   Email: ${doc.email || 'N/A'}`);
        
        const updateData = {};
        let needsUpdate = false;
        
        // Convert string fields to arrays where needed
        const arrayFields = [
          'specialization', // Optional field
          'licenses', 
          'medicalDegree',
          'residency',
          'fellowship',
          'boardCertification',
          'hospitalAffiliations',
          'memberships'
        ];
        
        for (const field of arrayFields) {
          if (doc[field] !== undefined) {
            if (typeof doc[field] === 'string' && doc[field].trim()) {
              // Convert string to array
              updateData[field] = [doc[field]];
              needsUpdate = true;
              console.log(`   ✅ Converting ${field}: "${doc[field]}" -> ["${doc[field]}"]`);
            } else if (Array.isArray(doc[field])) {
              // Already an array, ensure it's not empty strings
              const filteredArray = doc[field].filter(item => item && item.toString().trim());
              if (filteredArray.length !== doc[field].length) {
                updateData[field] = filteredArray;
                needsUpdate = true;
                console.log(`   ✅ Filtering ${field}: removed empty items`);
              }
            } else if (!doc[field]) {
              // Field is null/undefined, set to empty array
              updateData[field] = [];
              needsUpdate = true;
              console.log(`   ✅ Setting ${field} to empty array`);
            }
          } else {
            // Field doesn't exist, add it as empty array
            updateData[field] = [];
            needsUpdate = true;
            console.log(`   ✅ Adding missing field ${field} as empty array`);
          }
        }
        
        // Handle name field migration (name -> DoctorName)
        if (doc.name && !doc.DoctorName) {
          updateData.DoctorName = doc.name;
          needsUpdate = true;
          console.log(`   ✅ Migrating name field to DoctorName: "${doc.name}"`);
        }
        
        // Ensure required fields exist
        const requiredFields = {
          'DoctorName': doc.DoctorName || doc.name || '',
          'email': doc.email || '',
          'password': doc.password || 'temp_password_123',
          'phone': doc.phone || '',
          'experience': doc.experience || '',
          'about': doc.about || '',
          'malpracticeInsurance': doc.malpracticeInsurance || '',
          'address': doc.address || '',
          'education': doc.education || '',
          'status': doc.status || 'pending'
        };
        
        for (const [field, defaultValue] of Object.entries(requiredFields)) {
          if (doc[field] === undefined || doc[field] === null) {
            updateData[field] = defaultValue;
            needsUpdate = true;
            console.log(`   ✅ Adding missing required field ${field}: "${defaultValue}"`);
          }
        }
        
        // Update timestamps
        const now = new Date();
        if (!doc.createdAt) {
          updateData.createdAt = now;
          needsUpdate = true;
          console.log(`   ✅ Adding createdAt timestamp`);
        }
        updateData.updatedAt = now;
        
        if (needsUpdate) {
          await collection.updateOne(
            { _id: doc._id },
            { $set: updateData }
          );
          updatedCount++;
          console.log(`   ✅ Document updated successfully`);
        } else {
          console.log(`   ℹ️ No updates needed for this document`);
        }
        
      } catch (error) {
        console.error(`   ❌ Error updating document ${doc._id}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Update Summary:`);
    console.log(`   ✅ Successfully updated: ${updatedCount} documents`);
    console.log(`   ❌ Errors: ${errorCount} documents`);
    console.log(`   📋 Total processed: ${documents.length} documents`);
    
  } catch (error) {
    console.error("❌ Error updating Pending_Doctors schema:", error);
    throw error;
  }
}

// Validate the updated schema
async function validateSchema() {
  try {
    console.log("\n🔍 Validating updated schema...");
    
    const db = mongoose.connection.db;
    const collection = db.collection('Pending_Doctors');
    
    // Get a sample document
    const sampleDoc = await collection.findOne({});
    if (!sampleDoc) {
      console.log("ℹ️ No documents found for validation");
      return;
    }
    
    console.log("📋 Sample document structure:");
    console.log(JSON.stringify(sampleDoc, null, 2));
    
    // Check array fields
    const arrayFields = [
      'specialization',
      'licenses', 
      'medicalDegree',
      'residency',
      'fellowship',
      'boardCertification',
      'hospitalAffiliations',
      'memberships'
    ];
    
    console.log("\n🔍 Array field validation:");
    for (const field of arrayFields) {
      const value = sampleDoc[field];
      const isArray = Array.isArray(value);
      console.log(`   ${field}: ${isArray ? '✅ Array' : '❌ Not Array'} (${typeof value})`);
      if (isArray) {
        console.log(`      Length: ${value.length}, Values: [${value.join(', ')}]`);
      }
    }
    
    // Check required fields
    const requiredFields = ['DoctorName', 'email', 'password', 'phone', 'status'];
    console.log("\n🔍 Required field validation:");
    for (const field of requiredFields) {
      const exists = sampleDoc[field] !== undefined && sampleDoc[field] !== null;
      const hasValue = exists && sampleDoc[field].toString().trim() !== '';
      console.log(`   ${field}: ${exists ? '✅ Exists' : '❌ Missing'} ${hasValue ? '✅ Has Value' : '⚠️ Empty'}`);
    }
    
  } catch (error) {
    console.error("❌ Error validating schema:", error);
  }
}

// Main execution
async function main() {
  try {
    await connectDB();
    await updatePendingDoctorsSchema();
    await validateSchema();
    
    console.log("\n🎉 Pending_Doctors collection schema update completed successfully!");
    
  } catch (error) {
    console.error("❌ Script failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
}

// Run the script
main();
