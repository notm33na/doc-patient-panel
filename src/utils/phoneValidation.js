/**
 * Phone Number Validation and Formatting Utilities
 * Handles Pakistani phone number validation and formatting
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
 * Formats a phone number for display in frontend
 * Converts +92-xxx-xxxxxxx to 0xxxxxxxxx for user input
 * @param {string} phone - The phone number to format for display
 * @returns {string} - Formatted phone number for frontend display
 */
export const formatPhoneForDisplay = (phone) => {
  if (!phone) return '';
  
  // Remove all formatting
  const cleaned = phone.replace(/[^\d]/g, '');
  
  if (cleaned.startsWith('92')) {
    // Convert +92xxxxxxxxx to 0xxxxxxxxx
    return '0' + cleaned.slice(2);
  } else if (cleaned.startsWith('0')) {
    // Already in correct format
    return cleaned;
  } else if (cleaned.length === 10) {
    // Add leading 0
    return '0' + cleaned;
  }
  
  return phone; // Return original if can't format
};

/**
 * Formats a phone number for storage in backend
 * Converts 0xxxxxxxxx to +92-xxx-xxxxxxx
 * @param {string} phone - The phone number to format for storage
 * @returns {string} - Formatted phone number for backend storage
 */
export const formatPhoneForStorage = (phone) => {
  const validation = validatePhoneNumber(phone);
  return validation.isValid ? validation.formatted : phone;
};

/**
 * Validates phone number in real-time as user types
 * @param {string} phone - The phone number being typed
 * @returns {object} - { isValid: boolean, error?: string, canContinue?: boolean }
 */
export const validatePhoneInput = (phone) => {
  if (!phone) {
    return { isValid: false, canContinue: true };
  }

  // Check for letters immediately
  if (/[a-zA-Z]/.test(phone)) {
    return { isValid: false, error: "Phone number cannot contain letters", canContinue: false };
  }

  // Allow partial input while typing
  const cleaned = phone.replace(/[^\d]/g, '');
  
  if (cleaned.length === 0) {
    return { isValid: false, canContinue: true };
  }

  // If length is less than 11, still typing
  if (cleaned.length < 11) {
    return { isValid: false, canContinue: true };
  }

  // If length is exactly 11, validate it
  if (cleaned.length === 11) {
    return validatePhoneNumber(phone);
  }

  // If length is more than 11, it's invalid
  return { isValid: false, error: "Phone number is too long", canContinue: false };
};

/**
 * Phone number input patterns and hints
 */
export const phonePatterns = {
  // Regex pattern for input validation (allows digits and + at start)
  inputPattern: /^[\d+]*$/,
  
  // Placeholder text for input fields
  placeholder: "0xxxxxxxxx",
  
  // Help text for users
  helpText: "Enter your phone number starting with 0 (e.g., 03001234567)",
  
  // Example formats
  examples: [
    "03001234567",
    "03123456789", 
    "03212345678"
  ]
};

export default {
  validatePhoneNumber,
  formatPhoneForDisplay,
  formatPhoneForStorage,
  validatePhoneInput,
  phonePatterns
};
