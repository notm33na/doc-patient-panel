/**
 * Backend Phone Number Validation and Formatting Utilities
 * Handles Pakistani phone number validation and formatting for server-side
 */

/**
 * Validates if a phone number contains only digits and follows Pakistani format
 * @param {string} phone - The phone number to validate
 * @returns {object} - { isValid: boolean, error?: string, formatted?: string }
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return { isValid: false, error: "Phone number is required" };
  }

  // Remove all spaces, dashes, and other non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Check if phone contains any letters
  if (/[a-zA-Z]/.test(phone)) {
    return { isValid: false, error: "Phone number cannot contain letters" };
  }

  // Check if phone contains only digits (and optional + at start)
  if (!/^\+?[\d]+$/.test(cleaned)) {
    return { isValid: false, error: "Phone number can only contain digits" };
  }

  // Handle different input formats
  let phoneDigits = cleaned.replace(/^\+/, ''); // Remove + if present

  // Pakistani phone number validation
  if (phoneDigits.startsWith('92')) {
    // Format: 92xxxxxxxxx (already has country code)
    if (phoneDigits.length === 12) {
      const formatted = `+${phoneDigits.slice(0, 2)}-${phoneDigits.slice(2, 5)}-${phoneDigits.slice(5)}`;
      return { isValid: true, formatted };
    }
  } else if (phoneDigits.startsWith('0')) {
    // Format: 0xxxxxxxxx (local format)
    if (phoneDigits.length === 11) {
      const withoutZero = phoneDigits.slice(1); // Remove leading 0
      const formatted = `+92-${withoutZero.slice(0, 3)}-${withoutZero.slice(3)}`;
      return { isValid: true, formatted };
    }
  } else if (phoneDigits.length === 10) {
    // Format: xxxxxxxxxx (without country code or leading 0)
    const formatted = `+92-${phoneDigits.slice(0, 3)}-${phoneDigits.slice(3)}`;
    return { isValid: true, formatted };
  }

  return { 
    isValid: false, 
    error: "Invalid phone number format. Please use format: 0xxxxxxxxx" 
  };
};

/**
 * Formats a phone number for storage in database
 * Converts any valid Pakistani phone number to +92-xxx-xxxxxxx format
 * @param {string} phone - The phone number to format for storage
 * @returns {string} - Formatted phone number for database storage
 */
export const formatPhoneForStorage = (phone) => {
  const validation = validatePhoneNumber(phone);
  return validation.isValid ? validation.formatted : phone;
};

/**
 * Middleware to validate and format phone numbers in request body
 * @param {string} fieldName - The field name containing the phone number
 * @returns {function} - Express middleware function
 */
export const validateAndFormatPhone = (fieldName = 'phone') => {
  return (req, res, next) => {
    if (req.body[fieldName]) {
      const validation = validatePhoneNumber(req.body[fieldName]);
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: validation.error,
          field: fieldName
        });
      }
      
      // Format the phone number for storage
      req.body[fieldName] = validation.formatted;
    }
    
    next();
  };
};

/**
 * Validates phone number for API endpoints
 * @param {string} phone - The phone number to validate
 * @returns {object} - Validation result
 */
export const validatePhoneForAPI = (phone) => {
  const validation = validatePhoneNumber(phone);
  
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error,
      code: 'INVALID_PHONE_FORMAT'
    };
  }
  
  return {
    success: true,
    formatted: validation.formatted
  };
};

/**
 * Phone number validation patterns and constants
 */
export const phoneConstants = {
  // Pakistani mobile number patterns
  patterns: {
    local: /^0[3-9]\d{9}$/, // 0xxxxxxxxx format
    international: /^\+92[3-9]\d{9}$/, // +92xxxxxxxxx format
    formatted: /^\+92-\d{3}-\d{7}$/ // +92-xxx-xxxxxxx format
  },
  
  // Valid Pakistani mobile prefixes
  validPrefixes: ['030', '031', '032', '033', '034', '035', '036', '037', '038', '039'],
  
  // Phone number length requirements
  lengths: {
    local: 11, // 0xxxxxxxxx
    international: 13, // +92xxxxxxxxx
    formatted: 15 // +92-xxx-xxxxxxx
  }
};

export default {
  validatePhoneNumber,
  formatPhoneForStorage,
  validateAndFormatPhone,
  validatePhoneForAPI,
  phoneConstants
};
