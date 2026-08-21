/**
 * Production-ready Regex Validators and helper functions
 */

// RFC 5322 compliant standard Email Regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Name: 2 to 50 characters, letters, spaces, hyphens and apostrophes only
export const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Email address is required.' };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, message: 'Please enter a valid email address (e.g. name@company.com).' };
  }
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!PASSWORD_REGEX.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
    };
  }
  return { isValid: true };
}

export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Full name is required.' };
  }
  if (!NAME_REGEX.test(trimmed)) {
    return { isValid: false, message: 'Name must be between 2 to 50 characters and contain only letters.' };
  }
  return { isValid: true };
}
