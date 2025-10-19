# Duplicate Email/Phone Prevention Implementation

## Overview

Implemented comprehensive duplicate prevention to ensure that **no patient can use the same email address or phone number to create more than one account**. This prevents duplicate registrations and maintains data integrity.

## Implementation Details

### 1. **Backend Database Level (MongoDB)**

#### **Patient Model Updates**

```javascript
// src/backend/models/Patient.js
const patientSchema = new mongoose.Schema({
  emailAddress: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  // ... other fields
});

// Indexes for better performance
patientSchema.index({ emailAddress: 1 });
patientSchema.index({ phone: 1 });
```

**Key Features:**

- ✅ `emailAddress` has `unique: true` constraint
- ✅ `phone` has `unique: true` constraint (newly added)
- ✅ Database indexes for fast duplicate checking
- ✅ MongoDB will reject any attempt to create duplicate email/phone

### 2. **Backend API Level (Controller)**

#### **Enhanced addPatient Controller**

```javascript
// src/backend/controller/patientController.js
export const addPatient = async (req, res) => {
  try {
    // Check for existing patient by emailAddress or phone
    const existingByEmail = await Patient.findOne({ emailAddress });
    if (existingByEmail) {
      return res.status(400).json({
        error: "A user with similar credentials exist",
      });
    }

    const existingByPhone = await Patient.findOne({ phone });
    if (existingByPhone) {
      return res.status(400).json({
        error: "A user with similar credentials exist",
      });
    }

    // ... rest of the function
  } catch (err) {
    // Handle MongoDB unique constraint errors
    if (err.code === 11000) {
      if (err.keyPattern?.emailAddress) {
        return res.status(400).json({
          error: "A user with similar credentials exist",
        });
      }
      if (err.keyPattern?.phone) {
        return res.status(400).json({
          error: "A user with similar credentials exist",
        });
      }
    }
    // ... other error handling
  }
};
```

**Key Features:**

- ✅ Proactive duplicate checking before creating patient
- ✅ Clear error messages for email vs phone duplicates
- ✅ Handles MongoDB unique constraint violations
- ✅ Returns specific HTTP 400 status codes

### 3. **Frontend Validation Level**

#### **AddPatient Component Updates**

```typescript
// src/pages/AddPatient.tsx

// State for error tracking
const [emailError, setEmailError] = useState<string | null>(null);
const [phoneError, setPhoneError] = useState<string | null>(null);

// Check if email already exists
const checkEmailExists = async (email: string) => {
  if (!email.trim()) return false;

  try {
    const response = await fetch(
      `/api/patients/search/${encodeURIComponent(email)}`
    );
    if (response.ok) {
      const patients = await response.json();
      const existingPatient = patients.find(
        (p: any) => p.emailAddress.toLowerCase() === email.toLowerCase()
      );
      if (existingPatient) {
        setEmailError("A user with similar credentials exist");
        return true;
      }
    }
  } catch (error) {
    console.error("Error checking email:", error);
  }
  return false;
};

// Check if phone already exists
const checkPhoneExists = async (phone: string) => {
  if (!phone.trim()) return false;

  try {
    const response = await fetch(
      `/api/patients/search/${encodeURIComponent(phone)}`
    );
    if (response.ok) {
      const patients = await response.json();
      const existingPatient = patients.find((p: any) => p.phone === phone);
      if (existingPatient) {
        setPhoneError("A user with similar credentials exist");
        return true;
      }
    }
  } catch (error) {
    console.error("Error checking phone:", error);
  }
  return false;
};

// Enhanced form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Check for duplicate email and phone before submitting
  const emailExists = await checkEmailExists(form.emailAddress);
  const phoneExists = await checkPhoneExists(form.phone);

  if (emailExists || phoneExists) {
    return; // Stop submission if duplicates found
  }

  // ... rest of submission logic
};
```

**Key Features:**

- ✅ Real-time duplicate checking before form submission
- ✅ User-friendly error messages displayed under input fields
- ✅ Prevents form submission if duplicates detected
- ✅ Clears error messages when user changes input
- ✅ Uses existing search API for duplicate detection

#### **UI Error Display**

```typescript
// Email input with error display
<Input
  type="email"
  value={form.emailAddress}
  onChange={(e) => handleChange("emailAddress", e.target.value)}
  required
  placeholder="Enter email address"
/>;
{
  emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>;
}

// Phone input with error display
<Input
  value={form.phone}
  onChange={(e) => handleChange("phone", e.target.value)}
  required
  placeholder="Enter phone number"
/>;
{
  phoneError && <p className="text-sm text-red-600 mt-1">{phoneError}</p>;
}
```

## Multi-Layer Protection

### **Layer 1: Frontend Validation**

- **Purpose**: Immediate user feedback
- **When**: Before form submission
- **Benefit**: Better user experience, prevents unnecessary API calls

### **Layer 2: Backend Controller Validation**

- **Purpose**: API-level duplicate checking
- **When**: During API request processing
- **Benefit**: Handles cases where frontend validation might be bypassed

### **Layer 3: Database Constraint**

- **Purpose**: Ultimate data integrity protection
- **When**: During database write operations
- **Benefit**: Guarantees no duplicates even if application logic fails

## Error Messages

### **Frontend Messages**

- Email: "A user with similar credentials exist"
- Phone: "A user with similar credentials exist"

### **Backend API Messages**

- Email: "A user with similar credentials exist"
- Phone: "A user with similar credentials exist"

### **Database Constraint Messages**

- Email: MongoDB duplicate key error for emailAddress field
- Phone: MongoDB duplicate key error for phone field

## Testing

### **Test Script Created**

- `src/backend/test-duplicate-prevention.js` - Comprehensive test script
- `test-duplicate-prevention.ps1` - PowerShell wrapper for easy execution

### **Test Coverage**

1. ✅ MongoDB unique constraints
2. ✅ Backend controller validation
3. ✅ Frontend validation simulation
4. ✅ Error message accuracy
5. ✅ Cleanup and data integrity

### **Running Tests**

```bash
# Run the test script
cd src/backend
node test-duplicate-prevention.js

# Or use PowerShell wrapper
.\test-duplicate-prevention.ps1
```

## Benefits

### **1. Data Integrity**

- Prevents duplicate patient accounts
- Maintains clean database structure
- Ensures unique identification

### **2. User Experience**

- Clear error messages
- Real-time validation feedback
- Prevents frustrating submission failures

### **3. System Reliability**

- Multiple layers of protection
- Handles edge cases and bypasses
- Robust error handling

### **4. Security**

- Prevents account confusion
- Maintains patient privacy
- Reduces data inconsistencies

## Usage Examples

### **Scenario 1: Duplicate Email**

1. User enters email: `john.doe@example.com`
2. System checks existing patients
3. Finds existing patient with same email
4. Shows error: "A user with similar credentials exist"
5. Form submission blocked

### **Scenario 2: Duplicate Phone**

1. User enters phone: `+92-300-1234567`
2. System checks existing patients
3. Finds existing patient with same phone
4. Shows error: "A user with similar credentials exist"
5. Form submission blocked

### **Scenario 3: Valid Registration**

1. User enters unique email and phone
2. System validates no duplicates found
3. Form submits successfully
4. Patient account created

## Technical Notes

### **Performance Considerations**

- Database indexes for fast duplicate checking
- Frontend validation reduces unnecessary API calls
- Efficient search queries with proper filtering

### **Error Handling**

- Graceful degradation if validation fails
- Clear error messages for different scenarios
- Proper HTTP status codes for API responses

### **Scalability**

- Database constraints scale with data size
- Search API can be optimized with pagination
- Caching can be added for frequently checked values

## Files Modified

### **Backend Files**

- `src/backend/models/Patient.js` - Added unique constraint to phone field
- `src/backend/controller/patientController.js` - Enhanced duplicate checking

### **Frontend Files**

- `src/pages/AddPatient.tsx` - Added duplicate validation and error display

### **Test Files**

- `src/backend/test-duplicate-prevention.js` - Comprehensive test script
- `test-duplicate-prevention.ps1` - PowerShell test wrapper

## Conclusion

The duplicate email/phone prevention system provides comprehensive protection across all layers of the application, ensuring that no patient can create multiple accounts with the same contact information. This maintains data integrity, improves user experience, and provides robust system reliability.
