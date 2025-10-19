# MongoDB Atlas Schema Update Summary

## Overview
Updated the Add Patient and Add Doctor forms to match comprehensive MongoDB Atlas schemas with proper field structures and data organization.

## Changes Made

### 1. Created New MongoDB Models

#### Patient Model (`src/backend/models/Patient.js`)
- **Basic Information**: name, email, phone, age, gender
- **Medical Information**: medicalCondition, medicalHistory, allergies, currentMedications
- **Emergency Contact**: name, phone, relationship (nested object)
- **Assignment**: assignedDoctor, status
- **Address**: street, city, state, zipCode, country (nested object)
- **Insurance**: provider, policyNumber, groupNumber (nested object)
- **Prescription Images**: fileName, filePath, uploadedAt, ocrText (array)
- **System Fields**: userId, createdBy, lastVisit, nextAppointment

#### Doctor Model (`src/backend/models/Doctor.js`)
- **Basic Information**: name, email, phone
- **Professional Information**: specialty, department, licenseNumber, experience, education
- **Professional Details**: qualifications (array), languages (array), consultationFee
- **Availability**: workingHours (nested object for each day)
- **Status**: status, priority, rating, totalPatients, totalConsultations
- **Additional**: bio, profileImage
- **Address**: street, city, state, zipCode, country (nested object)
- **System Fields**: userId, createdBy, verified, verificationDate
- **Documents**: type, fileName, filePath, uploadedAt, verified (array)

### 2. Updated Forms

#### AddPatient.tsx
- ✅ **Comprehensive form sections**: Basic Info, Medical Info, Emergency Contact, Address, Insurance, Status
- ✅ **Enhanced prescription image upload** with OCR processing
- ✅ **Proper data structure** matching Patient model
- ✅ **Form validation** with required fields marked
- ✅ **Better UX** with organized sections and placeholders

#### AddDoctor.tsx (New)
- ✅ **Complete doctor registration form** with all professional fields
- ✅ **Working hours management** for each day of the week
- ✅ **Document upload system** for licenses, certificates, degrees
- ✅ **Professional specialties** dropdown with common medical specialties
- ✅ **Address and contact information**
- ✅ **Status and priority management**

#### AddCandidate.tsx (Updated)
- ✅ **Enhanced candidate form** matching Doctor model structure
- ✅ **Professional information** with specialty selection
- ✅ **Address and contact details**
- ✅ **Status management** for candidate review process

## Field Mapping

### Patient Form Fields → MongoDB Schema
```
Basic Info:
- name → name (String, required)
- email → email (String, required, unique)
- phone → phone (String, required)
- age → age (Number, required)
- gender → gender (Enum: Male, Female, Other)

Medical Info:
- medicalCondition → medicalCondition (String)
- medicalHistory → medicalHistory (String)
- allergies → allergies (String)
- currentMedications → currentMedications (String)

Emergency Contact:
- emergencyContactName → emergencyContact.name (String)
- emergencyContactPhone → emergencyContact.phone (String)
- emergencyContactRelationship → emergencyContact.relationship (String)

Address:
- street → address.street (String)
- city → address.city (String)
- state → address.state (String)
- zipCode → address.zipCode (String)
- country → address.country (String)

Insurance:
- insuranceProvider → insurance.provider (String)
- insurancePolicyNumber → insurance.policyNumber (String)
- insuranceGroupNumber → insurance.groupNumber (String)

Status:
- status → status (Enum: Active, Inactive, Critical, Recovering)
- assignedDoctor → assignedDoctor (ObjectId reference)
```

### Doctor Form Fields → MongoDB Schema
```
Basic Info:
- name → name (String, required)
- email → email (String, required, unique)
- phone → phone (String, required)

Professional Info:
- specialty → specialty (String, required)
- department → department (String, required)
- licenseNumber → licenseNumber (String, required, unique)
- experience → experience (String)
- education → education (String)

Professional Details:
- qualifications → qualifications (Array of Strings)
- languages → languages (Array of Strings)
- consultationFee → consultationFee (Number)

Working Hours:
- workingHours.monday.start → workingHours.monday.start (String)
- workingHours.monday.end → workingHours.monday.end (String)
- [Similar for all days]

Status:
- status → status (Enum: Active, Inactive, On Leave, Suspended)
- priority → priority (Enum: High, Medium, Low)

Additional:
- bio → bio (String)
- address → address (nested object)
- documents → documents (Array of document objects)
```

## Next Steps Required

### 1. Backend API Endpoints
You need to create API endpoints to handle the new data structures:

```javascript
// Patient endpoints
POST /api/patients - Create new patient
GET /api/patients - Get all patients
GET /api/patients/:id - Get patient by ID
PUT /api/patients/:id - Update patient
DELETE /api/patients/:id - Delete patient

// Doctor endpoints
POST /api/doctors - Create new doctor
GET /api/doctors - Get all doctors
GET /api/doctors/:id - Get doctor by ID
PUT /api/doctors/:id - Update doctor
DELETE /api/doctors/:id - Delete doctor

// Candidate endpoints
POST /api/candidates - Create new candidate
GET /api/candidates - Get all candidates
PUT /api/candidates/:id - Update candidate status
```

### 2. Update Backend Controllers
Create controllers for Patient and Doctor models similar to the existing User controller.

### 3. Update Routes
Add routes for the new endpoints in your backend routing system.

### 4. Database Migration
If you have existing data, you may need to migrate it to the new schema structure.

### 5. Frontend Integration
Update the form submission handlers to actually call the API endpoints instead of just logging to console.

## MongoDB Atlas Connection
Make sure your MongoDB Atlas cluster is properly configured with:
- Connection string in environment variables
- Proper database permissions
- Indexes for performance (already included in models)

## Testing
Use the provided API testing scripts to verify the new endpoints work correctly with your MongoDB Atlas cluster.

## Notes
- All forms now have proper validation and required field indicators
- Data structures match MongoDB best practices with nested objects
- Forms are organized into logical sections for better UX
- File upload functionality is included for documents and prescription images
- OCR processing is simulated but can be integrated with real OCR services
