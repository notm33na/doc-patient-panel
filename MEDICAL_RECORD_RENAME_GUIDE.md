# MedicalRecord Collection Rename Guide

## Overview

This guide explains how to rename the "MedicalRecord" collection to "Patient Medical Record" on MongoDB Atlas and update all related code to use the new collection name.

## Changes Made

### 1. Model Update (`src/backend/models/MedicalRecord.js`)

**Updated the collection name in the model definition:**

```javascript
// Before
export default mongoose.model("MedicalRecord", medicalRecordSchema, "MedicalRecord");

// After
export default mongoose.model("MedicalRecord", medicalRecordSchema, "Patient Medical Record");
```

### 2. Scripts Created

#### `rename-medical-record-collection.js`

**Purpose**: Renames the existing collection from "MedicalRecord" to "Patient Medical Record"
**Usage**: `node rename-medical-record-collection.js`

**What it does**:

- Checks if "MedicalRecord" collection exists
- Renames it to "Patient Medical Record"
- Verifies the rename was successful
- Handles edge cases (collection already exists, doesn't exist, etc.)

#### `rename-and-repopulate-medical-records.js` (MAIN SCRIPT)

**Purpose**: Complete solution that renames and repopulates the collection
**Usage**: `node rename-and-repopulate-medical-records.js`

**What it does**:

1. **Step 1**: Checks current collections
2. **Step 2**: Renames "MedicalRecord" to "Patient Medical Record"
3. **Step 3**: Clears existing data from both collections
4. **Step 4**: Repopulates with 5 sample patients and medical records
5. **Step 5**: Verifies the results

#### `test-renamed-collection.js`

**Purpose**: Tests the renamed collection to ensure everything works correctly
**Usage**: `node test-renamed-collection.js`

**What it does**:

- Verifies collection was renamed correctly
- Tests document counts
- Verifies data structure
- Tests population functionality
- Tests queries
- Verifies model is pointing to correct collection

#### `rename-medical-record-collection.ps1`

**Purpose**: PowerShell wrapper for easy execution
**Usage**: `.\rename-medical-record-collection.ps1`

## Running the Rename Process

### Option 1: Complete Rename and Repopulate (Recommended)

```bash
cd src/backend
node rename-and-repopulate-medical-records.js
```

### Option 2: PowerShell Script

```powershell
.\rename-medical-record-collection.ps1
```

### Option 3: Just Rename (if you want to keep existing data)

```bash
cd src/backend
node rename-medical-record-collection.js
```

### Option 4: Test After Rename

```bash
cd src/backend
node test-renamed-collection.js
```

## Expected Output

When successful, you should see:

```
🔄 Renaming MedicalRecord collection and repopulating with new structure...

📋 STEP 1: Checking current collections...
Current collections: ['Patient', 'MedicalRecord', 'User', ...]

🔄 STEP 2: Handling collection rename...
Renaming 'MedicalRecord' to 'Patient Medical Record'...
✅ Collection renamed successfully

🗑️  STEP 3: Clearing existing data...
✅ Cleared 0 patients
✅ Cleared 0 medical records

📝 STEP 4: Repopulating with new structure...
Creating patients...
✅ Created patient: Ahmad Khan
✅ Created patient: Fatima Ali
✅ Created patient: Muhammad Hassan
✅ Created patient: Ayesha Malik
✅ Created patient: Ali Raza
Creating medical records in 'Patient Medical Record' collection...
✅ Created medical record for Ahmad Khan
✅ Created medical record for Fatima Ali
✅ Created medical record for Muhammad Hassan
✅ Created medical record for Ayesha Malik
✅ Created medical record for Ali Raza

🧪 STEP 5: Verifying results...
Final collections: ['Patient', 'Patient Medical Record', 'User', ...]
✅ Patients: 5, Medical Records: 5
✅ Population test passed: Ahmad Khan

🎉 SUCCESS! Collection renamed and repopulated!
📊 Summary:
   ✅ Renamed 'MedicalRecord' to 'Patient Medical Record'
   ✅ Cleared existing data
   ✅ Created 5 patients with basic information
   ✅ Created 5 medical records in 'Patient Medical Record' collection
   ✅ Verified new structure is working
```

## Verification Steps

After running the rename process, verify in MongoDB Atlas:

1. **Collection List**: Check that you have "Patient Medical Record" instead of "MedicalRecord"
2. **Document Count**: Verify you have 5 patients and 5 medical records
3. **Data Structure**:
   - Patient documents should have basic info only (no medical fields)
   - Medical Record documents should have all medical data
4. **References**: Each medical record should have a valid `patientId` reference

## Sample Data Created

### Patients (5 total)

1. **Ahmad Khan** - Male, 35, Karachi
2. **Fatima Ali** - Female, 28, Lahore
3. **Muhammad Hassan** - Male, 42, Islamabad
4. **Ayesha Malik** - Female, 31, Peshawar
5. **Ali Raza** - Male, 26, Quetta

### Medical Records (5 total)

Each patient has a corresponding medical record in the "Patient Medical Record" collection with:

- Medications, allergies, chronic conditions
- Vaccination records
- Vital signs (weight, height, blood pressure, etc.)
- Medical notes
- `doctorId` and `appointmentId` set to null (as requested)

## Important Notes

### Collection Name

- **Old**: "MedicalRecord"
- **New**: "Patient Medical Record"
- The model name remains "MedicalRecord" (this is the JavaScript class name)
- Only the MongoDB collection name changes

### Backward Compatibility

- All existing code using `MedicalRecord` model will continue to work
- The model automatically points to the new collection name
- No changes needed in controllers or other parts of the application

### Data Migration

- If you have existing data, the rename script will preserve it
- The repopulate script will clear existing data and create fresh sample data
- Choose the appropriate script based on whether you want to keep existing data

## Troubleshooting

### Common Issues

1. **Collection Already Exists**

   - If "Patient Medical Record" already exists, the script will report this
   - You may need to manually resolve the conflict in MongoDB Atlas

2. **Permission Errors**

   - Ensure your MongoDB user has write permissions
   - Check your connection string and credentials

3. **Connection Issues**

   - Verify `MONGO_URI` in your `.env` file
   - Check network connectivity to MongoDB Atlas

4. **Model Not Found**
   - Ensure all dependencies are installed (`npm install`)
   - Check that the model file is in the correct location

### Verification Commands

Test the renamed collection:

```bash
cd src/backend
node test-renamed-collection.js
```

Check collection names in MongoDB Atlas:

```javascript
// In MongoDB Atlas shell
show collections
```

## Next Steps

After successful rename:

1. **Update Documentation**: Update any documentation that references the old collection name
2. **Test Application**: Test your application to ensure it works with the renamed collection
3. **Monitor**: Keep an eye on logs to ensure no issues arise
4. **Backup**: Consider creating a backup of the renamed collection

## Files Modified/Created

### Modified Files:

- `src/backend/models/MedicalRecord.js` - Updated collection name

### New Files:

- `src/backend/rename-medical-record-collection.js` - Rename script
- `src/backend/rename-and-repopulate-medical-records.js` - Main script
- `src/backend/test-renamed-collection.js` - Test script
- `rename-medical-record-collection.ps1` - PowerShell wrapper

The rename process is now complete and ready to use!
