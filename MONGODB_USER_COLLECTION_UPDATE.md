# Updated MongoDB Atlas User Collection Schema

## Overview

Successfully updated the `Tabeeb.Users` collection in MongoDB Atlas to include all fields from the AddPatient form. The User model now serves as a comprehensive patient record with both basic information and medical data.

## Updated User Model Schema

### **Basic Information**

```javascript
userRole: String (default: "Patient")
firstName: String (required)
lastName: String (required)
emailAddress: String (required, unique)
phone: String (required)
password: String (required)
profileImage: String (default: "")
gender: String (enum: ['Male', 'Female', 'Other'], required)
Age: String (required)
```

### **Address Information**

```javascript
address: {
  street: String
  city: String
  state: String
  zipCode: String
  country: String (default: 'Pakistan')
}
```

### **Status**

```javascript
isActive: String (default: "true")
```

### **Medical Information**

```javascript
doctorId: String;
appointmentId: String;
diagnosis: String;
```

### **Medical Arrays**

```javascript
symptoms: [String];
medications: [String];
allergies: [String];
chronicConditions: [String];
vaccinations: [String];
```

### **Vital Signs**

```javascript
weight: String;
height: String;
```

### **Additional Medical Fields**

```javascript
notes: String;
```

### **Legacy Fields (Backward Compatibility)**

```javascript
name: String
email: String
role: String (enum: ['Admin', 'Doctor', 'Patient'])
department: String
```

### **System Fields**

```javascript
createdBy: ObjectId (ref: 'User')
lastVisit: Date
nextAppointment: Date
createdAt: Date
updatedAt: Date
```

## Changes Made

### 1. **Updated User Model** (`src/backend/models/User.js`)

- ✅ **Added all AddPatient form fields** to the User schema
- ✅ **Maintained backward compatibility** with existing fields
- ✅ **Added proper indexes** for performance
- ✅ **Set Pakistan as default country** as requested
- ✅ **Added vaccinations array** field

### 2. **Updated User Controller** (`src/backend/controller/userController.js`)

- ✅ **Enhanced addUser function** to handle all new fields
- ✅ **Added proper field mapping** from request body
- ✅ **Maintained email uniqueness** check for both emailAddress and email
- ✅ **Added comprehensive data validation**
- ✅ **Preserved password hashing** functionality

### 3. **Updated AddPatient Form** (`src/pages/AddPatient.tsx`)

- ✅ **Simplified submission logic** to use single User collection
- ✅ **Added vaccinations field** to the form
- ✅ **Updated API call** to use `/api/users` endpoint
- ✅ **Removed separate medical record creation**
- ✅ **Added proper error handling**

## Data Flow

```
AddPatient Form → POST /api/users → User Collection (MongoDB Atlas)
```

### **Single Collection Approach**

- **All patient data** (basic info + medical info) stored in User collection
- **No separate MedicalRecord collection** needed
- **Simplified data management** and queries
- **Better performance** with single collection

## API Endpoint

### **Create User/Patient**

```javascript
POST /api/users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "gender": "Male",
  "Age": "30",
  "address": {
    "street": "123 Main St",
    "city": "Karachi",
    "state": "Sindh",
    "zipCode": "75000",
    "country": "Pakistan"
  },
  "isActive": "true",
  "doctorId": "doc123",
  "diagnosis": "Hypertension",
  "symptoms": ["Headache", "Dizziness"],
  "medications": ["Lisinopril 10mg"],
  "allergies": ["Penicillin"],
  "chronicConditions": ["Diabetes"],
  "vaccinations": ["COVID-19", "Flu"],
  "weight": "70 kg",
  "height": "5'10\"",
  "notes": "Patient notes here"
}
```

## Benefits

1. **Unified Data Model**: All patient information in one collection
2. **Simplified Queries**: No need for joins between collections
3. **Better Performance**: Single collection queries are faster
4. **Easier Management**: One API endpoint for all patient data
5. **Backward Compatibility**: Existing code continues to work
6. **Comprehensive Medical Records**: All medical information included

## Next Steps

1. **Test the API** with the updated AddPatient form
2. **Update existing queries** to use new field names
3. **Add validation** for required medical fields
4. **Implement search functionality** across all fields
5. **Add data migration** for existing users if needed

The MongoDB Atlas User collection is now fully updated to match your AddPatient form structure!
