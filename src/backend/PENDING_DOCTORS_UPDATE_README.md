# Pending_Doctors Collection Schema Update

This script updates the existing Pending_Doctors collection in MongoDB Atlas to match the new schema structure.

## What This Script Does

### 🔄 **Schema Changes Applied**

1. **Array Field Conversion**: Converts string fields to arrays for:

   - `specialization` → `specialization[]`
   - `licenses` → `licenses[]`
   - `medicalDegree` → `medicalDegree[]`
   - `residency` → `residency[]`
   - `fellowship` → `fellowship[]`
   - `boardCertification` → `boardCertification[]`
   - `hospitalAffiliations` → `hospitalAffiliations[]`
   - `memberships` → `memberships[]`

2. **Field Migration**:

   - `name` → `DoctorName` (if exists)
   - Ensures all required fields exist

3. **Default Values**:

   - Adds missing required fields with appropriate defaults
   - Sets empty arrays for array fields that don't exist
   - Adds timestamps if missing

4. **Data Validation**:
   - Removes empty strings from arrays
   - Ensures all documents have consistent structure

## 🚀 **How to Run**

### Option 1: Using Environment Variables

```bash
cd src/backend
node update-pending-doctors-schema.js
```

### Option 2: Direct Connection String

```bash
cd src/backend
node update-pending-doctors-simple.js
```

## 📋 **Before Running**

1. **Update Connection String**:

   - Edit the `MONGODB_URI` in the script with your actual MongoDB Atlas connection string
   - Or set the `MONGODB_URI` environment variable

2. **Backup Your Data**:

   - This script modifies existing documents
   - Consider backing up your Pending_Doctors collection first

3. **Ensure MongoDB Access**:
   - Make sure your IP is whitelisted in MongoDB Atlas
   - Verify your connection string is correct

## 📊 **What You'll See**

The script will show detailed output like:

```
🔄 Starting Pending_Doctors collection schema update...
📊 Found 3 documents to update

🔄 Processing document: 68f3ee0f1adb67c7e0234028
   DoctorName: Nooran Ishtiaq Ahmed
   Email: nooran4@gmail.com
   ✅ Converting specialization: "Cardiology" -> ["Cardiology"]
   ✅ Converting licenses: "PMC-12345" -> ["PMC-12345"]
   ✅ Adding missing field medicalDegree as empty array
   ✅ Document updated successfully

📊 Update Summary:
   ✅ Successfully updated: 3 documents
   ❌ Errors: 0 documents
   📋 Total processed: 3 documents
```

## 🔍 **Validation**

After the update, the script will:

- Show a sample document structure
- Validate that all array fields are properly formatted
- Check that all required fields exist and have values

## ⚠️ **Important Notes**

1. **Data Safety**: The script only adds/modifies fields, it doesn't delete existing data
2. **String to Array**: If a field contains a string like "Cardiology", it becomes ["Cardiology"]
3. **Empty Arrays**: Fields that don't exist will be added as empty arrays `[]`
4. **Required Fields**: Missing required fields will be added with default values

## 🐛 **Troubleshooting**

### Connection Issues

- Check your MongoDB Atlas connection string
- Ensure your IP is whitelisted
- Verify network connectivity

### Permission Issues

- Make sure your MongoDB user has read/write permissions
- Check if the database and collection exist

### Data Issues

- The script handles various data formats gracefully
- Check the console output for specific error messages

## ✅ **After Running**

1. **Test the Frontend**: Try adding and approving candidates
2. **Check Data**: Verify that the data displays correctly in the UI
3. **Monitor Logs**: Check backend logs for any remaining issues

## 📞 **Support**

If you encounter issues:

1. Check the console output for specific error messages
2. Verify your MongoDB connection
3. Ensure all required fields are present in your documents
4. Check the backend logs when testing the approve functionality

