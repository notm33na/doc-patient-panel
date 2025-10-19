# MongoDB Atlas Patient Collection Setup Guide

## Overview

This guide will help you set up the Patient collection on MongoDB Atlas online and ensure it works with your application.

## Prerequisites

- MongoDB Atlas account
- Node.js installed
- Your backend server running

## Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up or log in to your account
3. Create a new cluster (free tier available)

### 1.2 Configure Database Access

1. Go to "Database Access" in your Atlas dashboard
2. Click "Add New Database User"
3. Create a user with read/write permissions
4. Note down the username and password

### 1.3 Configure Network Access

1. Go to "Network Access" in your Atlas dashboard
2. Click "Add IP Address"
3. Add your current IP address or use `0.0.0.0/0` for development (not recommended for production)

### 1.4 Get Connection String

1. Go to "Clusters" in your Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

## Step 2: Backend Configuration

### 2.1 Create Environment File

Create a `.env` file in your `src/backend/` directory:

```bash
# Copy the example file
cp env.example .env
```

### 2.2 Update .env File

Replace the placeholder values in your `.env` file:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

## Step 3: Test Patient Collection

### 3.1 Install Dependencies

```bash
cd src/backend
npm install
```

### 3.2 Test Patient Model

Run the test script to verify the Patient collection works:

```bash
node test-patient.js
```

Expected output:

```
🔌 Connecting to MongoDB Atlas...
✅ Connected to MongoDB Atlas
📝 Creating test patient...
✅ Patient created successfully!
Patient ID: 507f1f77bcf86cd799439011
Patient Name: John Doe
Email: john.doe@example.com
Medical Info: { symptoms: [ 'Headache', 'Fever' ], medications: [ 'Paracetamol', 'Ibuprofen' ], allergies: [ 'Penicillin' ] }
✅ Patient verified in database
Collection name: Patient
🧹 Cleaning up test patient...
✅ Test patient removed
🔌 Disconnected from MongoDB Atlas
```

### 3.3 Start Backend Server

```bash
npm start
# or
node server.js
```

## Step 4: API Endpoints

Once your server is running, you can use these Patient API endpoints:

### Create Patient

```bash
POST http://localhost:5000/api/patients
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "emailAddress": "jane.smith@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "gender": "Female",
  "Age": "25",
  "address": {
    "street": "456 Oak St",
    "city": "Lahore",
    "state": "Punjab",
    "zipCode": "54000",
    "country": "Pakistan"
  },
  "symptoms": ["Cough", "Sore throat"],
  "medications": ["Cough syrup"],
  "allergies": ["None"],
  "chronicConditions": [],
  "vaccinations": ["COVID-19"],
  "weight": "60 kg",
  "height": "5'6\"",
  "notes": "Regular patient"
}
```

### Get All Patients

```bash
GET http://localhost:5000/api/patients
```

### Get Single Patient

```bash
GET http://localhost:5000/api/patients/:id
```

### Update Patient

```bash
PUT http://localhost:5000/api/patients/:id
Content-Type: application/json

{
  "notes": "Updated medical notes"
}
```

### Delete Patient

```bash
DELETE http://localhost:5000/api/patients/:id
```

### Search Patients

```bash
GET http://localhost:5000/api/patients/search/john
```

### Get Patients by Status

```bash
GET http://localhost:5000/api/patients/status/true
```

## Step 5: Verify in MongoDB Atlas

1. Go to your MongoDB Atlas dashboard
2. Click "Browse Collections"
3. You should see a "Patient" collection
4. Click on it to view the documents

## Step 6: Frontend Integration

Update your AddPatient.tsx to use the new Patient API:

```typescript
// In AddPatient.tsx, update the API call:
const response = await fetch("/api/patients", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(userData),
});
```

## Troubleshooting

### Common Issues:

1. **Connection Error**: Check your MONGO_URI in .env file
2. **Authentication Error**: Verify username/password in connection string
3. **Network Error**: Ensure your IP is whitelisted in Atlas
4. **Collection Not Found**: The collection will be created automatically when you insert the first document

### Debug Commands:

```bash
# Check if .env file exists
ls -la src/backend/.env

# Test MongoDB connection
node -e "require('dotenv').config(); console.log(process.env.MONGO_URI)"

# Check if server is running
curl http://localhost:5000/api/patients
```

## Security Notes

- Never commit your `.env` file to version control
- Use environment-specific connection strings
- Implement proper authentication in production
- Use MongoDB Atlas IP whitelisting for production

## Next Steps

1. Test all API endpoints
2. Update your frontend to use the new Patient API
3. Implement proper error handling
4. Add data validation
5. Set up monitoring and logging
