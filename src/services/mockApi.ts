import { User, ImportResult } from '../types/user';

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

const validateUser = (user: User): string[] => {
  const errors: string[] = [];

  if (!user.firstName?.trim()) {
    errors.push('First name is required');
  }
  if (!user.lastName?.trim()) {
    errors.push('Last name is required');
  }
  if (!user.email?.trim() || !validateEmail(user.email)) {
    errors.push('Valid email is required');
  }
  if (!user.phoneNumber?.trim() || !validatePhoneNumber(user.phoneNumber)) {
    errors.push('Valid phone number is required');
  }
  if (!user.address?.trim()) {
    errors.push('Address is required');
  }
  if (!user.birthDate?.trim() || !validateDate(user.birthDate)) {
    errors.push('Valid birth date is required');
  }
  if (!['active', 'inactive'].includes(user.status)) {
    errors.push('Status must be either active or inactive');
  }

  return errors;
};

export const mockUserApi = {
  validateUsers: async (users: User[]): Promise<ImportResult> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result: ImportResult = {
      successful: [],
      failed: [],
      totalProcessed: users.length,
    };

    users.forEach((user, index) => {
      const errors = validateUser(user);
      if (errors.length === 0) {
        result.successful.push(user);
      } else {
        result.failed.push({
          row: index + 1,
          errors,
        });
      }
    });

    return result;
  },

  importUsers: async (users: User[]): Promise<ImportResult> => {
    // First validate the users
    const validationResult = await mockUserApi.validateUsers(users);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // If there are any validation errors, return them
    if (validationResult.failed.length > 0) {
      return validationResult;
    }

    // Simulate successful import
    return {
      successful: users.map(user => ({
        ...user,
        id: Math.random().toString(36).substr(2, 9),
      })),
      failed: [],
      totalProcessed: users.length,
    };
  },
}; 