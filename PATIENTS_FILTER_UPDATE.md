# Patients Page Filter Functionality Update

## Overview

Updated the Patients page to have comprehensive filter functionality similar to the Doctors page, providing better user experience and more efficient patient management.

## Changes Made

### 1. **Enhanced State Management**

- Added `filteredPatients` state to separate filtered results from all patients
- Added new filter states: `filterGender`, `filterAgeRange`, `filterCity`
- Removed old `filterDoctor` state (not applicable to patients)

### 2. **Improved Filter Logic**

- **Client-side filtering**: All filters now work on the client side for better performance
- **Real-time filtering**: Filters apply immediately as users change them
- **Combined filtering**: Multiple filters can be applied simultaneously
- **Search integration**: Search works alongside all other filters

### 3. **New Filter Options**

#### **Status Filter** (Enhanced)

- All, Active, Inactive
- Same as before but now works with other filters

#### **Gender Filter** (New)

- All, Male, Female, Other
- Filters patients by gender field

#### **Age Range Filter** (New)

- All, 0-18 years, 19-35 years, 36-50 years, 51-65 years, 65+ years
- Filters patients by age ranges for demographic analysis

#### **City Filter** (New)

- All Cities + dynamic list of unique cities from patient data
- Filters patients by their address city
- Automatically populates with cities from existing patient data

### 4. **Enhanced UI Components**

#### **Filter Dialog**

- Expanded to include all filter options
- Better organization with proper spacing
- Reset button to clear all filters at once

#### **Filter Summary** (New)

- Shows active filters as badges
- Individual filter removal with X button
- "Clear all" button for quick reset
- Only appears when filters are active

#### **Results Count** (New)

- Shows "Showing X of Y patients"
- Displays search term when searching
- "Clear Filters" button when filters are active

### 5. **Improved Search**

- Updated placeholder text to be more descriptive
- Search now works with all other filters
- Real-time search without API calls for better performance

## Filter Implementation Details

### **useEffect for Filtering**

```typescript
useEffect(() => {
  let filtered = patients;

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(
      (patient) =>
        getPatientName(patient)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        getPrimaryCondition(patient)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        patient.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply status filter
  if (filterStatus !== "all") {
    filtered = filtered.filter((patient) => patient.isActive === filterStatus);
  }

  // Apply gender filter
  if (filterGender !== "all") {
    filtered = filtered.filter((patient) => patient.gender === filterGender);
  }

  // Apply age range filter
  if (filterAgeRange !== "all") {
    filtered = filtered.filter((patient) => {
      const age = parseInt(patient.Age);
      switch (filterAgeRange) {
        case "0-18":
          return age >= 0 && age <= 18;
        case "19-35":
          return age >= 19 && age <= 35;
        case "36-50":
          return age >= 36 && age <= 50;
        case "51-65":
          return age >= 51 && age <= 65;
        case "65+":
          return age > 65;
        default:
          return true;
      }
    });
  }

  // Apply city filter
  if (filterCity !== "all") {
    filtered = filtered.filter(
      (patient) =>
        patient.address?.city?.toLowerCase() === filterCity.toLowerCase()
    );
  }

  setFilteredPatients(filtered);
}, [
  patients,
  searchTerm,
  filterStatus,
  filterGender,
  filterAgeRange,
  filterCity,
]);
```

### **Dynamic City List**

```typescript
const getUniqueCities = () => {
  const cities = patients
    .map((patient) => patient.address?.city)
    .filter((city) => city && city.trim() !== "")
    .filter((city, index, arr) => arr.indexOf(city) === index)
    .sort();
  return cities;
};
```

## User Experience Improvements

### **1. Real-time Filtering**

- No loading states when applying filters
- Instant results as users change filter options
- Smooth user experience

### **2. Visual Feedback**

- Filter summary shows active filters
- Results count shows filtered vs total patients
- Clear visual indicators for applied filters

### **3. Easy Filter Management**

- Individual filter removal with X button
- "Clear all" button for quick reset
- Reset button in filter dialog

### **4. Better Search**

- More descriptive placeholder text
- Search works across name, condition, and email
- Search integrates with all other filters

## Benefits

### **1. Performance**

- Client-side filtering reduces API calls
- Faster response times for filter changes
- Better user experience

### **2. Functionality**

- Multiple simultaneous filters
- Comprehensive filter options
- Better patient management capabilities

### **3. Usability**

- Intuitive filter interface
- Clear visual feedback
- Easy filter management

### **4. Consistency**

- Matches Doctors page functionality
- Consistent UI patterns across the application
- Familiar user experience

## Usage Examples

### **Filter by Multiple Criteria**

1. Open filter dialog
2. Select "Active" status
3. Select "Male" gender
4. Select "19-35" age range
5. Select "Karachi" city
6. See filtered results immediately

### **Search with Filters**

1. Type "Ahmad" in search box
2. Apply "Active" status filter
3. See patients named Ahmad who are active

### **Quick Filter Management**

1. See active filters as badges
2. Click X on any badge to remove that filter
3. Click "Clear all" to remove all filters

## Technical Notes

### **Data Structure Compatibility**

- Works with current Patient interface
- Uses existing address structure for city filtering
- Compatible with current API responses

### **Performance Considerations**

- Client-side filtering for better performance
- Efficient filter logic with early returns
- Minimal re-renders with proper useEffect dependencies

### **Accessibility**

- Proper labels for all filter options
- Keyboard navigation support
- Screen reader friendly

The Patients page now has comprehensive filter functionality that matches the Doctors page, providing users with powerful tools for patient management and analysis.
