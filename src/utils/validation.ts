import { User } from '../types/user';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s-()]{10,}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const validateUserData = (user: Partial<User>): boolean => {
  // Check required fields
  if (!user.firstName?.trim() || !user.lastName?.trim() || !user.email?.trim()) {
    return false;
  }

  // Validate email format
  if (!EMAIL_REGEX.test(user.email)) {
    return false;
  }

  // Validate phone number if provided
  if (user.phoneNumber && !PHONE_REGEX.test(user.phoneNumber)) {
    return false;
  }

  // Validate birth date if provided
  if (user.birthDate) {
    if (!DATE_REGEX.test(user.birthDate)) {
      return false;
    }
    
    const [year, month, day] = user.birthDate.split('-').map(Number);
    const birthDateForComparison = new Date(year, month - 1, day);
    
    if (birthDateForComparison.getFullYear() !== year || 
        birthDateForComparison.getMonth() !== month - 1 || 
        birthDateForComparison.getDate() !== day) {
      return false; 
    }

    const currentDate = new Date();
    
    birthDateForComparison.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (birthDateForComparison.getTime() > currentDate.getTime()) {
      return false;
    }
  }

  // Validate status if provided
  if (user.status && !['active', 'inactive'].includes(user.status)) {
    return false;
  }

  return true;
}; 