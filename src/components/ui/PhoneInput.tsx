import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { validatePhoneInput, formatPhoneForDisplay, phonePatterns } from '@/utils/phoneValidation';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showFormatHint?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  onValidationChange,
  label = "Phone Number",
  placeholder = phonePatterns.placeholder,
  required = false,
  disabled = false,
  className = "",
  showFormatHint = true
}) => {
  const [error, setError] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  // Memoize the validation callback to prevent infinite re-renders
  const handleValidationChange = useCallback((isValid: boolean, error?: string) => {
    if (onValidationChange) {
      onValidationChange(isValid, error);
    }
  }, [onValidationChange]);

  // Validate phone number as user types
  useEffect(() => {
    const validation = validatePhoneInput(value);
    
    if (value && isTouched) {
      if (validation.error) {
        setError(validation.error);
        setIsValid(false);
      } else if (validation.isValid) {
        setError("");
        setIsValid(true);
      } else {
        setError("");
        setIsValid(false);
      }
    } else if (!value && required && isTouched) {
      setError("Phone number is required");
      setIsValid(false);
    } else {
      setError("");
      setIsValid(false);
    }
  }, [value, isTouched, required]);

  // Separate effect to notify parent component about validation status
  useEffect(() => {
    handleValidationChange(isValid && !error, error);
  }, [isValid, error, handleValidationChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow digits and + at the start
    if (phonePatterns.inputPattern.test(inputValue)) {
      onChange(inputValue);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const handleFocus = () => {
    if (!isTouched) {
      setIsTouched(true);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="phone" className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id="phone"
          type="tel"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-10 ${
            error && isTouched 
              ? 'border-red-500 focus:border-red-500' 
              : isValid && isTouched 
                ? 'border-green-500 focus:border-green-500' 
                : ''
          }`}
          maxLength={11} // Maximum length for Pakistani phone numbers
        />
        
        {/* Validation Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {error && isTouched ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : isValid && isTouched ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : null}
        </div>
      </div>

      {/* Error Message */}
      {error && isTouched && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      {/* Format Hint */}
      {showFormatHint && !error && (
        <p className="text-xs text-gray-500">
          {phonePatterns.helpText}
        </p>
      )}

      {/* Success Message */}
      {isValid && isTouched && !error && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Valid phone number format
        </p>
      )}

      {/* Examples */}
      {showFormatHint && !isTouched && (
        <div className="text-xs text-gray-400">
          <p className="mb-1">Examples:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {phonePatterns.examples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
